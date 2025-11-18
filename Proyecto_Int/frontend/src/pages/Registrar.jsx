import { useNavigate, Link } from 'react-router-dom'
import './Registrar.css'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function Registrar() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')
    
    const form = e.target
    const nombre = form.nombre.value
    const correo = form.email.value
    const contrasenia = form.password.value
    const confirmarContrasenia = form.confirmPassword.value

    // Validar contraseñas coincidan
    if (contrasenia !== confirmarContrasenia) {
      setErrorMessage('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    // Validar longitud de contraseña
    if (contrasenia.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      // Paso 1: Crear cuenta en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: correo,
        password: contrasenia,
        options: {
          data: {
            nombre: nombre
          }
        }
      })

      if (error) {
        setErrorMessage(error.message)
        setLoading(false)
        return
      }

      console.log('✅ Usuario creado en auth.users:', data.user?.id)

      // Paso 2: Crear registro BÁSICO en tabla cliente (solo con user_id y email)
      // El usuario completará los demás campos (CI, teléfono, etc.) en su perfil
      if (data.user) {
        const { error: profileError } = await supabase
          .from('cliente')
          .insert([{
            user_id: data.user.id,
            nombre_cliente: nombre.split(' ')[0] || nombre, // Solo primer nombre
            primer_apellido: nombre.split(' ')[1] || '-', // Apellido si existe
            correo_cliente: correo,
            ci_cliente: `TEMP_${Date.now()}`, // CI temporal que el usuario debe actualizar
            telefono_cliente: '00000000', // Teléfono temporal
            direccion: 'Por completar',
            genero: 'O', // Otro/No especificado
            nit: '0'
          }])

        if (profileError) {
          console.error('Error creando perfil básico:', profileError)
          setErrorMessage('Cuenta creada pero hubo un error al crear el perfil. Contacta a soporte.')
        } else {
          console.log('✅ Perfil básico creado en tabla cliente')
        }
      }

      setSuccessMessage('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta. Luego completa tu perfil con tus datos personales.')
      
      // Redirigir después de 4 segundos
      setTimeout(() => {
        navigate('/iniciar-sesion')
      }, 4000)
      
    } catch (err) {
      console.error('Error inesperado:', err)
      setErrorMessage('Error inesperado al registrar. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🐾</div>
            <h1>Únete a VetCare</h1>
            <p>Crea tu cuenta y comienza a cuidar a tus mascotas</p>
          </div>

          {errorMessage && (
            <div className="error-banner">
              <span>⚠️</span>
              <p>{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="success-banner">
              <span>✅</span>
              <p>{successMessage}</p>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input 
                id="nombre"
                name="nombre" 
                type="text" 
                placeholder="Juan Pérez" 
                required 
                autoComplete="name"
              />
            </div>

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
                placeholder="Mínimo 6 caracteres" 
                required 
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input 
                id="confirmPassword"
                name="confirmPassword" 
                type="password" 
                placeholder="Repite tu contraseña" 
                required 
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Registrando...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>¿Ya tienes cuenta? <Link to="/iniciar-sesion">Inicia sesión aquí</Link></p>
            <Link to="/" className="link-secondary">← Volver al inicio</Link>
          </div>
        </div>

        <div className="auth-illustration">
          <div className="illustration-content">
            <h2>🎉 Bienvenido a la familia</h2>
            <p>Únete a miles de dueños que confían en VetCare para el cuidado de sus mascotas.</p>
            <div className="features-list">
              <div className="feature-item">✓ Gestión de mascotas</div>
              <div className="feature-item">✓ Citas veterinarias online</div>
              <div className="feature-item">✓ Seguimiento de vacunas</div>
              <div className="feature-item">✓ Tienda de productos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registrar
