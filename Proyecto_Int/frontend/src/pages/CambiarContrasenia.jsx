import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import './CambiarContrasenia.css'

function CambiarContrasenia() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nueva: false,
    confirm: false
  })
  const [formData, setFormData] = useState({
    passwordActual: '',
    passwordNueva: '',
    passwordConfirm: ''
  })

  const validatePassword = (pass) => {
    const errors = []
    if (pass.length < 8) errors.push('Mínimo 8 caracteres')
    if (!/[A-Z]/.test(pass)) errors.push('Incluir mayúscula')
    if (!/[a-z]/.test(pass)) errors.push('Incluir minúscula')
    if (!/[0-9]/.test(pass)) errors.push('Incluir número')
    return errors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    // Validaciones
    if (!formData.passwordActual) {
      setMessage({ type: 'error', text: '❌ Ingresa tu contraseña actual' })
      setLoading(false)
      return
    }

    const errors = validatePassword(formData.passwordNueva)
    if (errors.length > 0) {
      setMessage({ type: 'error', text: `❌ Contraseña débil. Requiere: ${errors.join(', ')}` })
      setLoading(false)
      return
    }

    if (formData.passwordNueva !== formData.passwordConfirm) {
      setMessage({ type: 'error', text: '❌ Las contraseñas nuevas no coinciden' })
      setLoading(false)
      return
    }

    if (formData.passwordActual === formData.passwordNueva) {
      setMessage({ type: 'error', text: '❌ La nueva contraseña debe ser diferente a la actual' })
      setLoading(false)
      return
    }

    try {
      // Primero, verificar que la contraseña actual es correcta
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: formData.passwordActual
      })

      if (signInError) {
        setMessage({ type: 'error', text: '❌ Contraseña actual incorrecta' })
        setLoading(false)
        return
      }

      // Si es correcta, actualizar a la nueva contraseña
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.passwordNueva
      })

      if (updateError) {
        setMessage({ type: 'error', text: `❌ Error al cambiar: ${updateError.message}` })
        setLoading(false)
        return
      }

      setMessage({ 
        type: 'success', 
        text: '✅ ¡Contraseña cambiada exitosamente!' 
      })
      
      // Limpiar formulario
      setFormData({
        passwordActual: '',
        passwordNueva: '',
        passwordConfirm: ''
      })

      // Redirigir después de 3 segundos
      setTimeout(() => {
        window.location.href = '/perfil'
      }, 3000)

    } catch (err) {
      console.error('Error:', err)
      setMessage({ type: 'error', text: `❌ Error inesperado: ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cambiar-contrasenia-container">
      <div className="cambiar-contrasenia-box">
        <h1>🔐 Cambiar Contraseña</h1>
        <p className="subtitle">Actualiza tu contraseña de forma segura</p>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="passwordActual">Contraseña Actual</label>
            <div className="password-input-group">
              <input
                type={showPasswords.actual ? "text" : "password"}
                id="passwordActual"
                name="passwordActual"
                value={formData.passwordActual}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña actual"
                disabled={loading}
                required
              />
              <button 
                type="button" 
                className="toggle-password-btn"
                onClick={() => setShowPasswords(prev => ({ ...prev, actual: !prev.actual }))}
              >
                {showPasswords.actual ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="passwordNueva">Contraseña Nueva</label>
            <div className="password-input-group">
              <input
                type={showPasswords.nueva ? "text" : "password"}
                id="passwordNueva"
                name="passwordNueva"
                value={formData.passwordNueva}
                onChange={handleChange}
                placeholder="Ingresa tu nueva contraseña"
                disabled={loading}
                required
              />
              <button 
                type="button" 
                className="toggle-password-btn"
                onClick={() => setShowPasswords(prev => ({ ...prev, nueva: !prev.nueva }))}
              >
                {showPasswords.nueva ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <small className="hint">
              ℹ️ Mínimo 8 caracteres, mayúscula, minúscula y número
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirm">Confirmar Contraseña Nueva</label>
            <div className="password-input-group">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                id="passwordConfirm"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="Confirma tu nueva contraseña"
                disabled={loading}
                required
              />
              <button 
                type="button" 
                className="toggle-password-btn"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              >
                {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? '⏳ Procesando...' : '✅ Cambiar Contraseña'}
          </button>
        </form>

        <div className="info-box">
          <h3>🔒 Consejos de Seguridad</h3>
          <ul>
            <li>Usa contraseñas únicas y complejas</li>
            <li>Incluye mayúsculas, minúsculas y números</li>
            <li>No compartas tu contraseña con nadie</li>
            <li>Cambiala periódicamente (cada 90 días)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CambiarContrasenia
