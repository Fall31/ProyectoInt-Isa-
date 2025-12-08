import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './RecuperarContrasenia.css'

function RecuperarContrasenia() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [step, setStep] = useState('email') // 'email', 'code', 'password'
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (pass) => {
    const errors = []
    if (pass.length < 8) errors.push('Mínimo 8 caracteres')
    if (!/[A-Z]/.test(pass)) errors.push('Incluir mayúscula')
    if (!/[a-z]/.test(pass)) errors.push('Incluir minúscula')
    if (!/[0-9]/.test(pass)) errors.push('Incluir número')
    return errors
  }

  const handleSendEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (!validateEmail(email)) {
      setMessage({ type: 'error', text: '❌ Ingresa un email válido' })
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
      } else {
        setMessage({ 
          type: 'success', 
          text: '✅ Revisa tu email. Te enviamos un enlace para resetear tu contraseña.' 
        })
        setTimeout(() => {
          setStep('password')
        }, 2000)
      }
    } catch (err) {
      setMessage({ type: 'error', text: `❌ Error inesperado: ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const errors = validatePassword(newPassword)
    if (errors.length > 0) {
      setMessage({ type: 'error', text: `❌ Contraseña débil. Requiere: ${errors.join(', ')}` })
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '❌ Las contraseñas no coinciden' })
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
      } else {
        setMessage({ 
          type: 'success', 
          text: '✅ ¡Contraseña cambiada exitosamente! Redirigiendo...' 
        })
        setTimeout(() => {
          window.location.href = '/iniciar-sesion'
        }, 3000)
      }
    } catch (err) {
      setMessage({ type: 'error', text: `❌ Error inesperado: ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="recuperar-contrasenia-container">
      <div className="recuperar-contrasenia-box">
        <h1>🔑 Recuperar Contraseña</h1>
        <p className="subtitle">Te ayudaremos a recuperar el acceso a tu cuenta</p>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={handleSendEmail}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                disabled={loading}
                required
              />
              <small>Ingresa el email asociado a tu cuenta</small>
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? '⏳ Enviando...' : '📧 Enviar Enlace de Recuperación'}
            </button>

            <p className="back-link">
              ¿Recordaste tu contraseña? <Link to="/iniciar-sesion">Inicia sesión</Link>
            </p>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                disabled={loading}
                required
              />
              <small>ℹ️ Mínimo 8 caracteres, mayúscula, minúscula y número</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                disabled={loading}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? '⏳ Actualizando...' : '✅ Cambiar Contraseña'}
            </button>
          </form>
        )}

        <div className="faq">
          <h3>❓ Preguntas Frecuentes</h3>
          <div className="faq-item">
            <strong>¿Cuánto tiempo tarda el email?</strong>
            <p>Usualmente llega en 1-2 minutos. Verifica tu carpeta de spam.</p>
          </div>
          <div className="faq-item">
            <strong>¿Puedo cerrar esta página?</strong>
            <p>Sí, puedes cerrarla. El enlace permanece válido por 24 horas.</p>
          </div>
          <div className="faq-item">
            <strong>¿Qué pasa si no recibo el email?</strong>
            <p>Asegúrate de tener la ortografía correcta y verifica spam. Contacta a soporte.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecuperarContrasenia
