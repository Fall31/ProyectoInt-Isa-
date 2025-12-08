import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './ConfirmacionEmail.css'

function ConfirmacionEmail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [userEmail, setUserEmail] = useState('')

  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const errorCode = searchParams.get('error_code')

  useEffect(() => {
    // Si hay un error de OTP expirado
    if (error === 'access_denied' && errorCode === 'otp_expired') {
      setMessage({
        type: 'error',
        text: '❌ El link de confirmación expiró. Por favor, solicita uno nuevo.'
      })
    } else if (error) {
      setMessage({
        type: 'error',
        text: `❌ Error: ${errorDescription || error}`
      })
    }
  }, [error, errorDescription, errorCode])

  const handleResendEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (!userEmail.trim()) {
      setMessage({ type: 'error', text: '❌ Por favor ingresa tu email' })
      setLoading(false)
      return
    }

    try {
      // Solicitar que se reenvíe el email de confirmación
      const { error } = await supabase.auth.resendEmail({
        type: 'signup',
        email: userEmail
      })

      if (error) {
        setMessage({
          type: 'error',
          text: `❌ Error: ${error.message}`
        })
        setLoading(false)
        return
      }

      setMessage({
        type: 'success',
        text: '✅ Email de confirmación reenviado. Revisa tu bandeja de entrada.'
      })

      // Limpiar el formulario
      setUserEmail('')

      // Redirigir a login después de 3 segundos
      setTimeout(() => {
        navigate('/iniciar-sesion')
      }, 3000)

    } catch (err) {
      console.error('Error:', err)
      setMessage({ type: 'error', text: '❌ Error al reenviar el email' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="confirmacion-email-page">
      <div className="confirmacion-email-container">
        <div className="confirmacion-header">
          <div className="confirmacion-icon">📧</div>
          <h1>Confirmación de Email</h1>
          <p>Tu cuenta casi está lista</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="info-section">
          <h2>¿Qué hacer ahora?</h2>
          <ol>
            <li>Revisa tu email (incluyendo la carpeta de spam)</li>
            <li>Haz click en el link de confirmación</li>
            <li>Tu cuenta será activada automáticamente</li>
          </ol>
        </div>

        {(error === 'access_denied' && errorCode === 'otp_expired') && (
          <form onSubmit={handleResendEmail} className="resend-form">
            <h3>El link expiró, solicita uno nuevo</h3>
            <div className="form-group">
              <label htmlFor="email">Ingresa tu email:</label>
              <input
                type="email"
                id="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="btn-resend"
              disabled={loading}
            >
              {loading ? '⏳ Reenviando...' : '🔄 Reenviar Email'}
            </button>
          </form>
        )}

        <div className="help-section">
          <h3>❓ Preguntas frecuentes</h3>
          <div className="faq-item">
            <p><strong>¿No recibo el email?</strong></p>
            <p>Revisa la carpeta de spam o solicita que reenviemos el link aquí arriba.</p>
          </div>
          <div className="faq-item">
            <p><strong>¿Cuánto tiempo dura el link?</strong></p>
            <p>El link de confirmación es válido por 24 horas. Si expira, solicita uno nuevo.</p>
          </div>
          <div className="faq-item">
            <p><strong>¿Necesito hacer algo más?</strong></p>
            <p>Solo confirmar tu email. Después podrás completar tu perfil al iniciar sesión.</p>
          </div>
        </div>

        <div className="action-links">
          <button onClick={() => navigate('/iniciar-sesion')} className="link-btn">
            ← Volver a Iniciar Sesión
          </button>
          <button onClick={() => navigate('/registrar')} className="link-btn">
            Volver a Registrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmacionEmail
