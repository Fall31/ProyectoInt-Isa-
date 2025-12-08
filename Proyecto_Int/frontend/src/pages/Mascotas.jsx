import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './Mascotas.css'
import supabaseServices from '../services/supabase'

const Mascotas = () => {
  const navigate = useNavigate()
  const [mascotas, setMascotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMascota, setEditingMascota] = useState(null)
  const [clienteData, setClienteData] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [vacunasVisibles, setVacunasVisibles] = useState(null)
  const [vacunasLista, setVacunasLista] = useState([])
  const [alertasVacunas, setAlertasVacunas] = useState([])
  
  const [formData, setFormData] = useState({
    nombre_mascota: '',
    especie: 'perro',
    raza: '',
    edad: '',
    peso: '',
    genero_mascota: 'macho',
    alergias: '',
    imagen: ''
  })

  const cargarMascotas = useCallback(async () => {
    try {
      setLoading(true)
      
      // Obtener usuario autenticado
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        navigate('/iniciar-sesion')
        return
      }

      // Obtener datos del cliente
      const { data: cliente } = await supabase
        .from('cliente')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (cliente) {
        setClienteData(cliente)
        
        // Cargar mascotas del cliente
        const { data: mascotasData } = await supabase
          .from('mascota')
          .select('*')
          .eq('ci_cliente', cliente.ci_cliente)
          .order('nombre_mascota', { ascending: true })

        setMascotas(mascotasData || [])
      }

      setLoading(false)
    } catch (err) {
      console.error('Error cargando mascotas:', err)
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    cargarMascotas()
  }, [cargarMascotas])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar los 5MB')
      return
    }

    try {
      setUploadingImage(true)

      // Preview local
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Crear nombre único para el archivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${clienteData?.ci_cliente}-${Date.now()}.${fileExt}`
      const filePath = `mascotas/${fileName}`

      // Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('imagenes_mascotas')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('imagenes_mascotas')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, imagen: publicUrl }))
      alert('✅ Foto cargada correctamente')
    } catch (err) {
      console.error('Error subiendo imagen:', err)
      alert('Error al subir la imagen: ' + err.message)
      setImagePreview(null)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!clienteData) {
      alert('No se encontró información del cliente')
      return
    }

    try {
      if (editingMascota) {
        // Actualizar mascota existente
        const { error } = await supabase
          .from('mascota')
          .update(formData)
          .eq('ci_mascota', editingMascota.ci_mascota)

        if (error) throw error
        alert('Mascota actualizada correctamente')
      } else {
        // Crear nueva mascota - generar ID único (máx 20 caracteres)
        const timestamp = Date.now().toString().slice(-8) // últimos 8 dígitos del timestamp
        const ci_mascota = `M${timestamp}`
        const { error } = await supabase
          .from('mascota')
          .insert([{
            ci_mascota,
            ...formData,
            ci_cliente: clienteData.ci_cliente
          }])

        if (error) throw error
        alert('Mascota registrada correctamente')
      }

      setShowForm(false)
      setEditingMascota(null)
      resetForm()
      cargarMascotas()
    } catch (error) {
      console.error('Error guardando mascota:', error)
      alert('Error: ' + error.message)
    }
  }

  const handleEdit = (mascota) => {
    setEditingMascota(mascota)
    setFormData({
      nombre_mascota: mascota.nombre_mascota,
      especie: mascota.especie,
      raza: mascota.raza || '',
      edad: mascota.edad || '',
      peso: mascota.peso || '',
      genero_mascota: mascota.genero_mascota,
      alergias: mascota.alergias || '',
      imagen: mascota.imagen || ''
    })
    setImagePreview(null)
    setShowForm(true)
  }

  const handleDelete = async (ci_mascota) => {
    if (!window.confirm('¿Estás seguro de eliminar esta mascota?')) return

    try {
      const { error } = await supabase
        .from('mascota')
        .delete()
        .eq('ci_mascota', ci_mascota)

      if (error) throw error
      
      alert('Mascota eliminada correctamente')
      cargarMascotas()
    } catch (error) {
      console.error('Error eliminando mascota:', error)
      alert('Error al eliminar: ' + error.message)
    }
  }

  const abrirVacunas = async (mascota) => {
    try {
      setVacunasVisibles(mascota)
      // Cargar vacunas aplicadas usando servicio supabase
      const data = await supabaseServices.vacunas.getByMascota(mascota.ci_mascota)
      const vacunas = data || []
      setVacunasLista(vacunas)

      // Generar alertas: próximas vacunas dentro de 7 días
      const hoy = new Date()
      const sieteDias = 7 * 24 * 60 * 60 * 1000
      const alertas = vacunas
        .filter(v => v.fecha_proxima)
        .map(v => ({
          ...v,
          diff: new Date(v.fecha_proxima).getTime() - hoy.getTime()
        }))
        .filter(v => v.diff > 0 && v.diff <= sieteDias)
        .sort((a,b) => a.diff - b.diff)
      setAlertasVacunas(alertas)
    } catch (err) {
      console.error('Error cargando vacunas:', err)
      alert('No se pudieron cargar las vacunas: ' + err.message)
    }
  }

  const resetForm = () => {
    setFormData({
      nombre_mascota: '',
      especie: 'perro',
      raza: '',
      edad: '',
      peso: '',
      genero_mascota: 'macho',
      alergias: '',
      imagen: ''
    })
    setImagePreview(null)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingMascota(null)
    resetForm()
  }

  if (loading) {
    return <div className="mascotas-loading">Cargando mascotas...</div>
  }

  return (
    <div className="mascotas-page">
      <div className="mascotas-header">
        <div>
          <h1>Mis Mascotas</h1>
          <p>Gestiona la información de tus mascotas y su historial médico</p>
        </div>
        <button 
          className="btn-add" 
          onClick={() => setShowForm(true)}
        >
          + Registrar Mascota
        </button>
      </div>

      {showForm && (
        <div className="mascota-form-container">
          <div className="form-header">
            <h2>{editingMascota ? 'Editar Mascota' : 'Registrar Nueva Mascota'}</h2>
            <button className="btn-close" onClick={handleCancel}>×</button>
          </div>
          <form onSubmit={handleSubmit} className="mascota-form">
            {/* Foto de mascota */}
            <div className="form-group-full">
              <label>📷 Foto de la Mascota</label>
              <div className="mascota-photo-upload">
                <div className="mascota-photo-preview">
                  {imagePreview || formData.foto_url ? (
                    <img 
                      src={imagePreview || formData.foto_url} 
                      alt="Mascota" 
                      className="mascota-image"
                    />
                  ) : (
                    <div className="mascota-placeholder">
                      🐾
                      <p>Sin foto</p>
                    </div>
                  )}
                </div>
                <label htmlFor="mascota-photo" className="btn-upload-photo">
                  📸 {formData.foto_url ? 'Cambiar' : 'Subir'} Foto
                  <input
                    id="mascota-photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre_mascota"
                  value={formData.nombre_mascota}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Especie *</label>
                <select
                  name="especie"
                  value={formData.especie}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Ave">Ave</option>
                  <option value="Roedor">Roedor</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Raza</label>
                <input
                  type="text"
                  name="raza"
                  value={formData.raza}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Género</label>
                <select
                  name="genero_mascota"
                  value={formData.genero_mascota}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar</option>
                  <option value="M">Macho</option>
                  <option value="F">Hembra</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Edad (años)</label>
                <input
                  type="number"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label>Peso (kg)</label>
                <input
                  type="number"
                  name="peso"
                  value={formData.peso}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Alergias o condiciones especiales</label>
              <textarea
                name="alergias"
                value={formData.alergias}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="submit" className="btn-submit">
                {editingMascota ? 'Actualizar' : 'Registrar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mascotas-grid">
        {mascotas.length === 0 ? (
          <div className="empty-state">
            <p>No tienes mascotas registradas</p>
            <button className="btn-add" onClick={() => setShowForm(true)}>
              Registrar primera mascota
            </button>
          </div>
        ) : (
          mascotas.map((mascota) => {
            return (
              <div key={mascota.ci_mascota} className="mascota-card">
                <div className="mascota-image">
                  {mascota.foto_url ? (
                    <img src={mascota.foto_url} alt={mascota.nombre_mascota} />
                  ) : (
                    <div className="placeholder-image">
                      {mascota.especie === 'Perro' ? '🐕' : mascota.especie === 'Gato' ? '🐈' : '🐾'}
                    </div>
                  )}
                </div>
                <div className="mascota-info">
                  <h3>{mascota.nombre_mascota}</h3>
                  <p className="mascota-species">
                    {mascota.especie?.toUpperCase()} • {mascota.raza || 'Sin raza'}
                  </p>
                  <div className="mascota-details">
                    <span>⏰ Edad: {mascota.edad || 'N/A'} años</span>
                    <span>⚖️ Peso: {mascota.peso || 'N/A'} kg</span>
                    <span>
                      {mascota.genero_mascota === 'M' ? '♂️ Macho' : '♀️ Hembra'}
                    </span>
                  </div>
                  {mascota.alergias && (
                    <p className="mascota-allergies">⚠️ Alergias: {mascota.alergias}</p>
                  )}
                </div>
                <div className="mascota-actions">
                  <button onClick={() => handleEdit(mascota)} className="btn-edit">
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => navigate(`/historial/${mascota.ci_mascota}`)} 
                    className="btn-history"
                  >
                    📋 Historial
                  </button>
                  <button onClick={() => abrirVacunas(mascota)} className="btn-history">
                    💉 Vacunas
                  </button>
                  <button onClick={() => handleDelete(mascota.ci_mascota)} className="btn-delete">
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {vacunasVisibles && (
        <div className="modal-overlay" onClick={() => { setVacunasVisibles(null); setVacunasLista([]) }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Vacunas de {vacunasVisibles.nombre_mascota}</h2>
              <button className="btn-close" onClick={() => { setVacunasVisibles(null); setVacunasLista([]) }}>✕</button>
            </div>
            <div style={{ padding: 'var(--spacing-lg)' }}>
              {alertasVacunas.length > 0 && (
                <div className="reserva-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <div className="reserva-body">
                    <div className="reserva-detail full-width">
                      <span className="icon">🔔</span>
                      <div>
                        <strong>Alertas de próximas vacunas (7 días):</strong>
                        {alertasVacunas.map(av => (
                          <p key={av.id_vacuna}>
                            {av.nombre_vacuna || 'Vacuna'} programada para el {new Date(av.fecha_proxima).toLocaleDateString('es-ES')}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {vacunasLista.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🧪</div>
                  <p>No hay vacunas registradas</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                  {vacunasLista.map(v => (
                    <div key={v.id_vacuna} className="reserva-card">
                      <div className="reserva-body">
                        <div className="reserva-detail">
                          <span className="icon">💉</span>
                          <div>
                            <strong>Vacuna:</strong>
                            <p>{v.nombre_vacuna || v.vacunacatalog?.tipo_vacuna || 'Vacuna'}</p>
                          </div>
                        </div>
                        <div className="reserva-detail">
                          <span className="icon">📅</span>
                          <div>
                            <strong>Aplicación:</strong>
                            <p>{v.fecha_aplicacion ? new Date(v.fecha_aplicacion).toLocaleDateString('es-ES') : '-'}</p>
                          </div>
                        </div>
                        <div className="reserva-detail">
                          <span className="icon">🗓️</span>
                          <div>
                            <strong>Próxima:</strong>
                            <p>{v.fecha_proxima ? new Date(v.fecha_proxima).toLocaleDateString('es-ES') : '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Mascotas
