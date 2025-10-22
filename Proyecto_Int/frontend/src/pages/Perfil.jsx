import { useState, useEffect } from 'react'
import { usePerfil } from '@/hooks'
import './Perfil.css'

const Perfil = () => {
  const { user, perfil, loading, saving, updatePerfil, changePassword } = usePerfil()
  
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    primer_apellido: '',
    direccion: '',
    telefono_cliente: '',
    nit: '',
    genero: ''
  })

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (perfil) {
      setFormData({
        nombre_cliente: perfil.nombre_cliente || '',
        primer_apellido: perfil.primer_apellido || '',
        direccion: perfil.direccion || '',
        telefono_cliente: perfil.telefono_cliente || '',
        nit: perfil.nit || '',
        genero: perfil.genero || ''
      })
    }
  }, [perfil])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    const result = await updatePerfil(formData)
    if (result.success) {
      alert('Perfil actualizado correctamente')
    } else {
      alert('Error al actualizar el perfil: ' + result.error)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres')
      return
    }

    const result = await changePassword(passwordData.newPassword)
    if (result.success) {
      alert('Contraseña actualizada correctamente')
      setPasswordData({ newPassword: '', confirmPassword: '' })
    } else {
      alert('Error al cambiar la contraseña: ' + result.error)
    }
  }

  if (loading) {
    return <div className="perfil-loading">Cargando perfil...</div>
  }

  return (
    <div className="perfil-page">
      <div className="perfil-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div className="perfil-content">
        {/* Personal Information Section */}
        <section className="perfil-section">
          <h2>Información Personal</h2>
          <form onSubmit={handleSaveProfile} className="perfil-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre_cliente"
                  value={formData.nombre_cliente}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  name="primer_apellido"
                  value={formData.primer_apellido}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono_cliente"
                  value={formData.telefono_cliente}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>NIT</label>
                <input
                  type="text"
                  name="nit"
                  value={formData.nit}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Género</label>
              <select name="genero" value={formData.genero} onChange={handleInputChange}>
                <option value="">Seleccionar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Correo electrónico</label>
              <input type="email" value={user?.email || ''} disabled />
              <small>El correo no se puede cambiar desde aquí</small>
            </div>

            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </section>

        {/* Password Change Section */}
        <section className="perfil-section">
          <h2>Cambiar Contraseña</h2>
          <form onSubmit={handleChangePassword} className="perfil-form">
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirmar Nueva Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <button type="submit" className="btn-save">
              Cambiar Contraseña
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Perfil
