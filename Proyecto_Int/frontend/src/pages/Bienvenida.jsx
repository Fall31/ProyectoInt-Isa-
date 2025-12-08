import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './Bienvenida.css'

function Bienvenida() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (!authUser) {
          console.log('❌ No hay usuario autenticado, redirigiendo a login')
          navigate('/iniciar-sesion')
          return
        }

        console.log('✅ Usuario autenticado:', authUser.email)

        // Intentar cargar datos del cliente
        try {
          const { data: clientData, error } = await supabase
            .from('cliente')
            .select('perfil_completo, nombre_cliente, ci_cliente')
            .eq('user_id', authUser.id)
            .single()

          // Si perfil está completo (perfil_completo = true), ir a dashboard
          if (!error && clientData && clientData.perfil_completo === true) {
            console.log('✅ Perfil ya completado, redirigiendo a dashboard')
            navigate('/dashboard', { replace: true })
            return
          }

          // Si la consulta falla (no existe registro), es normal - mostrar pantalla de bienvenida
          if (error && error.code === 'PGRST116') {
            console.log('⚠️ Registro de cliente no encontrado aún, mostrando pantalla de bienvenida')
          } else if (error) {
            console.warn('⚠️ Error al consultar cliente (continuando):', error.message)
          } else if (clientData && clientData.perfil_completo === false) {
            console.log('⚠️ Perfil incompleto, mostrando pantalla de bienvenida')
          }
        } catch (queryErr) {
          console.warn('⚠️ Error en consulta de cliente:', queryErr.message)
          // Continuar de todas formas - mostrar pantalla de bienvenida
        }

        setUser(authUser)
        setLoading(false)
      } catch (err) {
        console.error('❌ Error en checkUser:', err)
        setUser(null)
        setLoading(false)
      }
    }

    checkUser()
  }, [navigate])

  if (loading) {
    return (
      <div className="bienvenida-page">
        <div className="loading">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="bienvenida-page">
      <div className="bienvenida-container">
        {/* Sección principal */}
        <div className="bienvenida-hero">
          <div className="hero-icon">🎉</div>
          <h1>¡Bienvenido a VetCare!</h1>
          <p className="hero-subtitle">Tu cuenta ha sido creada exitosamente</p>
          
          <div className="email-display">
            <p>Email registrado:</p>
            <strong>{user?.email}</strong>
          </div>

          <div className="status-badge">
            ✅ Email confirmado
          </div>
        </div>

        {/* Paso siguiente */}
        <div className="next-step-section">
          <h2>Próximo Paso: Completa tu Perfil</h2>
          <p>
            Para acceder al dashboard y disfrutar de todos los servicios de VetCare,
            necesitamos que completes tu información personal como cliente.
          </p>

          <div className="completion-checklist">
            <div className="checklist-item">
              <span className="check-icon">📋</span>
              <div className="check-content">
                <h3>Información Personal</h3>
                <p>Nombre, apellidos, cédula</p>
              </div>
            </div>
            <div className="checklist-item">
              <span className="check-icon">📞</span>
              <div className="check-content">
                <h3>Contacto</h3>
                <p>Teléfono y dirección</p>
              </div>
            </div>
            <div className="checklist-item">
              <span className="check-icon">🐾</span>
              <div className="check-content">
                <h3>Acceso Completo</h3>
                <p>Dashboard, mascotas, citas veterinarias</p>
              </div>
            </div>
          </div>

          <button 
            className="btn-complete-profile"
            onClick={() => navigate('/completar-perfil')}
          >
            ➜ Completar Mi Perfil Ahora
          </button>
        </div>

        {/* Beneficios */}
        <div className="benefits-section">
          <h3>Una vez completes tu perfil, podrás:</h3>
          <ul className="benefits-list">
            <li>✓ Acceder al dashboard personalizado</li>
            <li>✓ Registrar y gestionar tus mascotas</li>
            <li>✓ Agendar citas con veterinarios</li>
            <li>✓ Seguimiento de vacunas y tratamientos</li>
            <li>✓ Comprar productos veterinarios</li>
            <li>✓ Leer artículos educativos del blog</li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h3>Preguntas Frecuentes</h3>
          <div className="faq-item">
            <h4>¿Cuánto tiempo tarda completar el perfil?</h4>
            <p>Aproximadamente 2-3 minutos. Solo necesitamos tu información básica.</p>
          </div>
          <div className="faq-item">
            <h4>¿Puedo cambiar mis datos después?</h4>
            <p>Claro, desde tu Perfil personal puedes actualizar cualquier información en cualquier momento.</p>
          </div>
          <div className="faq-item">
            <h4>¿Mis datos están seguros?</h4>
            <p>Sí, usamos encriptación de nivel empresarial y cumplen con estándares de seguridad internacionales.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bienvenida-footer">
          <p>
            ¿Necesitas ayuda? Contacta a nuestro <a href="#">equipo de soporte</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Bienvenida
