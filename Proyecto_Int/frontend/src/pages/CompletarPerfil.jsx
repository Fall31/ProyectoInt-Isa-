import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './CompletarPerfil.css'

function CompletarPerfil() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [profileData, setProfileData] = useState({
    nombre_cliente: '',
    primer_apellido: '',
    segundo_apellido: '',
    ci_cliente: '',
    telefono_cliente: '',
    direccion: '',
    genero: 'O'
  })

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (!authUser) {
          navigate('/iniciar-sesion')
          return
        }

        setUser(authUser)

        // Intentar cargar datos actuales del cliente
        try {
          const { data: clientData, error } = await supabase
            .from('cliente')
            .select('*')
            .eq('user_id', authUser.id)
            .single()

          if (!error && clientData) {
            setProfileData({
              nombre_cliente: clientData.nombre_cliente || '',
              primer_apellido: clientData.primer_apellido || '',
              segundo_apellido: clientData.segundo_apellido || '',
              ci_cliente: clientData.ci_cliente || '',
              telefono_cliente: clientData.telefono_cliente || '',
              direccion: clientData.direccion || '',
              genero: clientData.genero || 'O'
            })
          } else {
            // Si no existe el registro, crearlo vacío (será actualizado al guardar)
            console.log('Registro no encontrado, se creará al guardar')
          }
        } catch (err) {
          console.log('Error al cargar cliente (normal si es nuevo):', err.message)
        }
      } catch (error) {
        console.error('Error cargando usuario:', error)
      }
    }

    checkUser()
  }, [navigate])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateCI = (ci) => {
    return ci.length >= 5 && ci.length <= 20
  }

  const validatePhone = (phone) => {
    return phone.length >= 7 && phone.length <= 20
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Validaciones previas
      if (!profileData.nombre_cliente.trim() || profileData.nombre_cliente.trim().length < 2) {
        setMessage({ type: 'error', text: '❌ Nombre inválido (mínimo 2 caracteres)' })
        setLoading(false)
        return
      }

      if (!profileData.primer_apellido.trim() || profileData.primer_apellido.trim().length < 2) {
        setMessage({ type: 'error', text: '❌ Primer apellido inválido (mínimo 2 caracteres)' })
        setLoading(false)
        return
      }

      if (!profileData.ci_cliente.trim() || !validateCI(profileData.ci_cliente)) {
        setMessage({ type: 'error', text: '❌ CI/RUT inválido (5-20 caracteres)' })
        setLoading(false)
        return
      }

      if (!profileData.telefono_cliente.trim() || !validatePhone(profileData.telefono_cliente)) {
        setMessage({ type: 'error', text: '❌ Teléfono inválido (7-20 dígitos)' })
        setLoading(false)
        return
      }

      if (!profileData.direccion.trim() || profileData.direccion.trim().length < 5) {
        setMessage({ type: 'error', text: '❌ Dirección inválida (mínimo 5 caracteres)' })
        setLoading(false)
        return
      }

      // Normalizar CI
      const ciTrimmed = profileData.ci_cliente.trim()

      // Generar NIT automáticamente
      const nitGenerado = `NIT-${ciTrimmed.replace(/\s+/g, '')}-${Date.now()}`

      // Preparar datos SIMPLES para guardar
      const dataToUpsert = {
        user_id: user.id,
        ci_cliente: ciTrimmed,
        nombre_cliente: profileData.nombre_cliente.trim(),
        primer_apellido: profileData.primer_apellido.trim(),
        segundo_apellido: profileData.segundo_apellido.trim(),
        telefono_cliente: profileData.telefono_cliente.trim(),
        direccion: profileData.direccion.trim(),
        genero: profileData.genero,
        nit: nitGenerado,
        perfil_completo: true
      }

      // Intentar guardar
      const { error: saveError } = await supabase
        .from('cliente')
        .upsert(dataToUpsert, { onConflict: 'user_id' })

      if (saveError) {
        console.error('❌ Error al guardar:', saveError)
        setMessage({ 
          type: 'error', 
          text: `❌ Error: ${saveError.message}` 
        })
        setLoading(false)
        return
      }

      console.log('✅ Perfil guardado exitosamente')

      setMessage({ 
        type: 'success', 
        text: '✅ ¡Perfil completado exitosamente! Redirigiendo al dashboard...' 
      })
      
      // Redirigir al dashboard después de 1.5 segundos
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
      
    } catch (error) {
      console.error('❌ Error inesperado:', error)
      setMessage({ type: 'error', text: '❌ Error inesperado al guardar perfil. Intenta nuevamente.' })
      setLoading(false)
    }
  }

  const handleSkipForNow = () => {
    navigate('/dashboard')
  }

  return (
    <div className="completar-perfil-page">
      <div className="completar-perfil-container">
        <div className="perfil-header-section">
          <h1>🎉 ¡Bienvenido a VetCare!</h1>
          <p>Completa tu perfil para acceder a todos los servicios</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="perfil-form">
          <div className="form-section">
            <h2>📋 Información Personal</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre_cliente"
                  value={profileData.nombre_cliente}
                  onChange={handleProfileChange}
                  placeholder="Ej: Juan"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="apellido1">Primer Apellido *</label>
                <input
                  type="text"
                  id="apellido1"
                  name="primer_apellido"
                  value={profileData.primer_apellido}
                  onChange={handleProfileChange}
                  placeholder="Ej: Pérez"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="apellido2">Segundo Apellido</label>
                <input
                  type="text"
                  id="apellido2"
                  name="segundo_apellido"
                  value={profileData.segundo_apellido}
                  onChange={handleProfileChange}
                  placeholder="Ej: García"
                />
              </div>

              <div className="form-group">
                <label htmlFor="genero">Género</label>
                <select
                  id="genero"
                  name="genero"
                  value={profileData.genero}
                  onChange={handleProfileChange}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ci">CI/RUT *</label>
                <input
                  type="text"
                  id="ci"
                  name="ci_cliente"
                  value={profileData.ci_cliente}
                  onChange={handleProfileChange}
                  placeholder="Ej: 1234567890"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono_cliente"
                  value={profileData.telefono_cliente}
                  onChange={handleProfileChange}
                  placeholder="Ej: +569 1234 5678"
                  required
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="direccion">Dirección *</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={profileData.direccion}
                onChange={handleProfileChange}
                placeholder="Ej: Calle Principal 123, Apartamento 4B"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-save"
              disabled={loading}
            >
              {loading ? '⏳ Guardando...' : '💾 Guardar Perfil'}
            </button>
            <button 
              type="button"
              className="btn-skip"
              onClick={handleSkipForNow}
              disabled={loading}
            >
              Saltear por ahora
            </button>
          </div>
        </form>

        <div className="info-box">
          <p><strong>ℹ️ Información importante:</strong></p>
          <ul>
            <li>Tus datos personales están protegidos y seguros</li>
            <li>Puedes editar esta información en cualquier momento desde tu Perfil</li>
            <li>Es necesario completar al menos una vez para acceso completo</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CompletarPerfil
