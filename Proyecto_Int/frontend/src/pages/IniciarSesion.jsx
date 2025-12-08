import { useNavigate, Link } from 'react-router-dom'
import './IniciarSesion.css'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'

function IniciarSesion() {
  const navigate = useNavigate()
  const { user, userRole, profileComplete, isClient, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Redirigir basado en rol y estado del perfil
  useEffect(() => {
    if (!authLoading && user && userRole) {
      console.log('🔍 Usuario autenticado, verificando estado:', {
        email: user.email,
        rol: userRole,
        perfil_completo: profileComplete
      })

      // Si es cliente SIN perfil completo, ir a completar perfil
      if (isClient && !profileComplete) {
        console.log('→ Redirigiendo a completar perfil (perfil incompleto)')
        navigate('/completar-perfil', { replace: true })
        return
      }

      // Si es cliente CON perfil completo, ir a dashboard
      if (userRole === 'cliente' && profileComplete) {
        console.log('→ Redirigiendo a dashboard de cliente')
        navigate('/dashboard', { replace: true })
        return
      }

      // Si es personal o admin
      if (userRole === 'personal' || userRole === 'administrador') {
        console.log('→ Redirigiendo a dashboard personal')
        navigate('/dashboard-personal', { replace: true })
        return
      }
    }
  }, [user, userRole, profileComplete, isClient, authLoading, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    
    const form = e.target
    const correo = form.email.value
    const contrasenia = form.password.value

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: correo,
        password: contrasenia,
      })

      if (error) {
        console.error('Supabase signIn error:', error)
        
        // Manejo específico de errores
        if (error.message.includes('Email not confirmed')) {
          setErrorMessage(
            '❌ Email no confirmado. ' +
            'Por favor, revisa tu email y haz click en el link de confirmación. ' +
            'Si no lo recibiste, puedes reenviar el email en /confirmacion-email'
          )
        } else if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('❌ Email o contraseña incorrectos')
        } else if (error.message.includes('Too many requests')) {
          setErrorMessage('❌ Demasiados intentos. Intenta en 5 minutos')
        } else {
          setErrorMessage('❌ ' + (error.message || 'Error al iniciar sesión'))
        }
        setLoading(false)
        return
      }

      console.log('✅ Login exitoso:', data.user.id)
      // El useEffect arriba manejará la redirección automáticamente
      
    } catch (err) {
      console.error('Error inesperado en login:', err)
      setErrorMessage('❌ Error inesperado al iniciar sesión')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🐾</div>
            <h1>Bienvenido a VetCare</h1>
            <p>Inicia sesión para acceder a tu cuenta</p>
          </div>

          {errorMessage && (
            <div className="error-banner">
              <span>⚠️</span>
              <p>{errorMessage}</p>
            </div>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input 
                id="email"
                name="email" 
                type="email" 
                placeholder="tu@email.com" 
                required 
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input 
                id="password"
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Ingresando...
                </>
              ) : (
                <>
                  <span>🔐</span>
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>¿No tienes cuenta? <Link to="/registrar">Regístrate aquí</Link></p>
            <p><Link to="/recuperar-contrasenia" className="link-secondary">¿Olvidaste tu contraseña?</Link></p>
            <Link to="/" className="link-secondary">← Volver al inicio</Link>
          </div>
        </div>

        <div className="auth-illustration">
          <div className="illustration-content">
            <h2>🏥 Cuida a tus mascotas</h2>
            <p>Accede a servicios veterinarios profesionales, historial médico y mucho más.</p>
            <div className="features-list">
              <div className="feature-item">✓ Reservas online</div>
              <div className="feature-item">✓ Historial médico completo</div>
              <div className="feature-item">✓ Tienda de productos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IniciarSesion
