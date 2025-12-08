import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import supabaseServices from '../services/supabase'
import './Reservas.css'

const Reservas = () => {
  const [reservas, setReservas] = useState([])
  const [alertasReservas, setAlertasReservas] = useState([])
  const [servicios, setServicios] = useState([])
  const [mascotas, setMascotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [cliente, setCliente] = useState(null)
  
  // Form data para nueva reserva
  const [formData, setFormData] = useState({
    ci_mascota: '',
    id_servicio: '',
    fecha_reserva: '',
    hora_reserva: '',
    comentarios: '',
    tipo_reserva: 'consulta'
  })
  const [tamano, setTamano] = useState('')
  const [precioEstimado, setPrecioEstimado] = useState(0)
  const [slots, setSlots] = useState([])
  const [slotSeleccionado, setSlotSeleccionado] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      
      // Obtener usuario autenticado
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      if (user) {
        // Obtener cliente
        const { data: clienteData } = await supabase
          .from('cliente')
          .select('*')
          .eq('user_id', user.id)
          .single()

        setCliente(clienteData)

        if (clienteData) {
          // Cargar mascotas del cliente
          const mascotasData = await supabaseServices.mascotas.getByCliente(clienteData.ci_cliente)
          setMascotas(mascotasData)

          // Cargar reservas del cliente
          const { data: reservasData } = await supabase
            .from('reserva')
            .select(`
              *,
              mascota!inner(nombre_mascota, especie, raza, ci_cliente),
              servicio(nombre_servicio, precio_base, duracion)
            `)
            .eq('mascota.ci_cliente', clienteData.ci_cliente)
            .order('fecha_reserva', { ascending: false })

          const lista = reservasData || []
          setReservas(lista)

          // Alertas de reservas próximas: dentro de 24 horas
          const ahora = Date.now()
          const unDia = 24 * 60 * 60 * 1000
          const proximas = lista
            .map(r => {
              const dt = combineDateTime(r.fecha_reserva, r.hora_reserva)
              return { ...r, ts: dt ? dt.getTime() : null }
            })
            .filter(r => r.ts && r.ts > ahora && (r.ts - ahora) <= unDia)
            .sort((a,b) => a.ts - b.ts)
          setAlertasReservas(proximas)
        }
      }

      // Cargar servicios disponibles desde catálogo
      const { data: serviciosData } = await supabase
        .from('catalogo_servicio')
        .select(`
          id_catalogo,
          tipo_servicio,
          costo_pequeno,
          costo_mediano,
          costo_grande,
          duracion,
          descripcion,
          id_servicio,
          servicio:id_servicio (
            nombre_servicio,
            foto_url
          )
        `)
        .eq('disponibilidad', true)
        .order('tipo_servicio')
      
      // Transformar para compatibilidad
      const serviciosTransformados = (serviciosData || []).map(s => ({
        id_catalogo: s.id_catalogo,
        id_servicio: s.id_servicio,
        tipo_servicio: s.tipo_servicio,
        costo_pequeno: s.costo_pequeno,
        costo_mediano: s.costo_mediano,
        costo_grande: s.costo_grande,
        duracion: s.duracion,
        descripcion: s.descripcion
      }))
      
      setServicios(serviciosTransformados)

      setLoading(false)
    } catch (err) {
      console.error('Error cargando datos:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  // Utilidades de horario
  const parseTime = (t) => {
    if (!t) return null
    const [h,m] = String(t).split(':').map(x => parseInt(x,10))
    return { h, m }
  }

  const timeToString = (h,m) => `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`

  const addMinutes = (h,m,delta) => {
    const total = h*60 + m + delta
    const hh = Math.floor(total/60)
    const mm = total % 60
    return {h: hh, m: mm}
  }

  const combineDateTime = (dateStr, timeStr) => {
    if (!dateStr) return null
    const t = timeStr && timeStr.length >= 4 ? timeStr : '00:00'
    // Construimos ISO local sin zona; el navegador lo interpreta en local
    return new Date(`${dateStr}T${t}`)
  }

  const nombreDiaES = (fechaStr) => {
    const d = new Date(fechaStr)
    const dias = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado']
    return dias[d.getDay()]
  }

  const generarSlots = (h) => {
    const ini = parseTime(h.hora_inicio)
    const fin = parseTime(h.hora_fin)
    const di = parseTime(h.descanso_inicio)
    const df = parseTime(h.descanso_fin)
    const slots = []
    if (!ini || !fin) return slots
    let cur = { ...ini }
    while (cur.h*60 + cur.m < fin.h*60 + fin.m) {
      const label = timeToString(cur.h, cur.m)
      const next = addMinutes(cur.h, cur.m, 30)
      const enDescanso = di && df && (cur.h*60+cur.m >= di.h*60+di.m) && (cur.h*60+cur.m < df.h*60+df.m)
      if (!enDescanso) slots.push(label)
      cur = next
    }
    return slots
  }

  // Recalcular precio cuando cambia servicio/tamaño
  useEffect(() => {
    const srv = servicios.find(s => String(s.id_servicio) === String(formData.id_servicio))
    if (!srv) { setPrecioEstimado(0); return }
    const precio = tamano === 'pequeno' ? srv.costo_pequeno
      : tamano === 'mediano' ? srv.costo_mediano
      : tamano === 'grande' ? srv.costo_grande
      : 0
    setPrecioEstimado(Number(precio || 0))
  }, [formData.id_servicio, tamano, servicios])

  // Cargar horarios y generar slots cuando cambia servicio/fecha
  useEffect(() => {
    const cargarSlots = async () => {
      setSlots([])
      setSlotSeleccionado('')
      if (!formData.id_servicio || !formData.fecha_reserva) return
      const dia = nombreDiaES(formData.fecha_reserva)
      const { data: hrows } = await supabase
        .from('horario')
        .select('*')
        .eq('id_servicio', formData.id_servicio)
        .ilike('dia_semana', dia + '%')
        .eq('disponibilidad', true)
      const all = (hrows || []).flatMap(generarSlots)
      setSlots(all)
    }
    cargarSlots()
  }, [formData.id_servicio, formData.fecha_reserva])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!cliente) {
      alert('Debes iniciar sesión para crear una reserva')
      return
    }

    try {
      // Mensaje previo si es vacunación
      const esVacunacion = formData.tipo_reserva === 'vacunacion'
      const comentariosBase = esVacunacion
        ? `Solicitud de vacunación: el doctor evaluará si procede. ${formData.comentarios || ''}`
        : formData.comentarios || ''

      // Intentar guardar tamaño si existe columna
      let payload = {
        ci_mascota: formData.ci_mascota,
        id_servicio: parseInt(formData.id_servicio),
        fecha_reserva: formData.fecha_reserva,
        hora_reserva: slotSeleccionado || formData.hora_reserva,
        estado_reserva: esVacunacion ? 'pendiente_revision' : 'pendiente',
        notificacion: true,
        comentarios: comentariosBase,
        tipo_reserva: formData.tipo_reserva
      }
      if (tamano) payload.tamano_mascota = tamano

      let insert = await supabase
        .from('reserva')
        .insert([payload])
        .select()

      if (insert.error && String(insert.error?.message || '').includes('tamano_mascota')) {
        delete payload.tamano_mascota
        insert = await supabase
          .from('reserva')
          .insert([payload])
          .select()
      }

      const { error } = insert
      if (error) throw error

      alert('✅ Reserva creada exitosamente')
      setShowModal(false)
      setFormData({
        ci_mascota: '',
        id_servicio: '',
        fecha_reserva: '',
        hora_reserva: '',
        comentarios: '',
        tipo_reserva: 'consulta'
      })
      setTamano('')
      setPrecioEstimado(0)
      setSlots([])
      setSlotSeleccionado('')
      cargarDatos()
    } catch (err) {
      console.error('Error creando reserva:', err)
      alert('Error al crear la reserva: ' + err.message)
    }
  }

  const cancelarReserva = async (reservaObj) => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) return

    try {
      // Regla: no permitir cancelar con menos de 1 hora de anticipación
      const dt = combineDateTime(reservaObj.fecha_reserva, reservaObj.hora_reserva)
      if (dt) {
        const diffMs = dt.getTime() - Date.now()
        const diffMin = diffMs / 60000
        if (diffMin <= 60) {
          alert('No puedes cancelar con menos de 1 hora de anticipación.')
          return
        }
      }

      const { error } = await supabase
        .from('reserva')
        .update({ estado_reserva: 'cancelada' })
        .eq('id_reserva', reservaObj.id_reserva)

      if (error) throw error

      alert('Reserva cancelada')
      cargarDatos()
    } catch (err) {
      console.error('Error cancelando reserva:', err)
      alert('Error al cancelar: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="reservas-page">
        <div className="loading-spinner">Cargando reservas...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="reservas-page">
        <div className="error-message">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="reservas-page">
      <div className="page-header">
        <h1>Mis Reservas</h1>
        <p className="subtitle">Gestiona tus citas veterinarias</p>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Nueva Reserva
        </button>
      </div>

      {alertasReservas.length > 0 && (
        <div className="reserva-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="reserva-body">
            <div className="reserva-detail full-width">
              <span className="icon">🔔</span>
              <div>
                <strong>Recordatorios (24 horas):</strong>
                {alertasReservas.map(a => (
                  <p key={a.id_reserva}>
                    Cita {a.tipo_reserva} el {new Date(a.fecha_reserva).toLocaleDateString('es-ES')} a las {a.hora_reserva}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="reservas-list">
        {reservas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <p>No tienes reservas programadas</p>
            <button className="btn-secondary" onClick={() => setShowModal(true)}>
              Crear mi primera reserva
            </button>
          </div>
        ) : (
          reservas.map((r) => {
            const fechaReserva = new Date(r.fecha_reserva)
            const isPast = fechaReserva < new Date()
            const estadoLabel = r.tipo_reserva === 'vacunacion' && r.estado_reserva === 'pendiente_revision'
              ? 'pendiente revisión'
              : r.estado_reserva
            const estadoClase = estadoLabel.replace(' ', '_')
            
            return (
              <div key={r.id_reserva} className={`reserva-card ${isPast ? 'past' : ''}`}>
                <div className="reserva-header">
                  <div className="reserva-icon">🐾</div>
                  <div className="reserva-info">
                    <h3>{r.mascota?.nombre_mascota || 'Mascota'}</h3>
                    <p className="reserva-especie">{r.mascota?.especie} • {r.mascota?.raza || 'Sin raza'}</p>
                  </div>
                  <span className={`status-badge ${estadoClase}`}>
                    {estadoLabel}
                  </span>
                </div>
                
                <div className="reserva-body">
                  <div className="reserva-detail">
                    <span className="icon">🏥</span>
                    <div>
                      <strong>Servicio:</strong>
                      <p>{r.servicio?.nombre_servicio || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="reserva-detail">
                    <span className="icon">📅</span>
                    <div>
                      <strong>Fecha:</strong>
                      <p>{fechaReserva.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  
                  <div className="reserva-detail">
                    <span className="icon">⏰</span>
                    <div>
                      <strong>Hora:</strong>
                      <p>{r.hora_reserva}</p>
                    </div>
                  </div>

                  {r.servicio?.duracion && (
                    <div className="reserva-detail">
                      <span className="icon">⏱️</span>
                      <div>
                        <strong>Duración:</strong>
                        <p>{r.servicio.duracion} minutos</p>
                      </div>
                    </div>
                  )}

                  {r.comentarios && (
                    <div className="reserva-detail full-width">
                      <span className="icon">💬</span>
                      <div>
                        <strong>Comentarios:</strong>
                        <p>{r.comentarios}</p>
                      </div>
                    </div>
                  )}
                  {r.tipo_reserva === 'vacunacion' && r.estado_reserva === 'pendiente_revision' && (
                    <div className="reserva-detail full-width">
                      <span className="icon">🧪</span>
                      <div>
                        <strong>Vacunación:</strong>
                        <p>Tu solicitud está en revisión por el doctor. Te notificaremos qué doctor te atenderá.</p>
                      </div>
                    </div>
                  )}
                </div>

                {(r.estado_reserva === 'pendiente' || r.estado_reserva === 'pendiente_revision') && !isPast && (
                  <div className="reserva-actions">
                    <button 
                      className="btn-cancel"
                      onClick={() => cancelarReserva(r)}
                    >
                      Cancelar Reserva
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Modal para crear nueva reserva */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nueva Reserva</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="reserva-form">
              <div className="form-group">
                <label htmlFor="mascota">Mascota *</label>
                <select
                  id="mascota"
                  required
                  value={formData.ci_mascota}
                  onChange={(e) => setFormData({...formData, ci_mascota: e.target.value})}
                >
                  <option value="">Selecciona una mascota</option>
                  {mascotas.map(m => (
                    <option key={m.ci_mascota} value={m.ci_mascota}>
                      {m.nombre_mascota} ({m.especie})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="servicio">Servicio *</label>
                <select
                  id="servicio"
                  required
                  value={formData.id_servicio}
                  onChange={(e) => setFormData({...formData, id_servicio: e.target.value})}
                >
                  <option value="">Selecciona un servicio</option>
                  {servicios.map(s => (
                    <option key={s.id_servicio} value={s.id_servicio}>
                      {s.tipo_servicio} - Bs. {s.costo_pequeno}/{s.costo_mediano}/{s.costo_grande}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tamaño y precio estimado</label>
                <div className="size-selector">
                  <button type="button" className={`size-option ${tamano==='pequeno'?'selected':''}`} onClick={() => setTamano('pequeno')}>🐶 Pequeño</button>
                  <button type="button" className={`size-option ${tamano==='mediano'?'selected':''}`} onClick={() => setTamano('mediano')}>🐕 Mediano</button>
                  <button type="button" className={`size-option ${tamano==='grande'?'selected':''}`} onClick={() => setTamano('grande')}>🐕‍🦺 Grande</button>
                </div>
                <div className="price-indicator">Precio: Bs. {Number(precioEstimado||0).toFixed(2)}</div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha">Fecha *</label>
                  <input
                    type="date"
                    id="fecha"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.fecha_reserva}
                    onChange={(e) => setFormData({...formData, fecha_reserva: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Horario disponible *</label>
                  {slots.length === 0 ? (
                    <div style={{color:'var(--text-secondary)'}}>Selecciona servicio y fecha para ver los horarios</div>
                  ) : (
                    <div className="slots-grid">
                      {slots.map(h => (
                        <button
                          key={h}
                          type="button"
                          className={`slot-btn ${slotSeleccionado===h?'selected':''}`}
                          onClick={() => { setSlotSeleccionado(h); setFormData({...formData, hora_reserva: h}) }}
                        >{h}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="tipo_reserva">Tipo de Reserva *</label>
                <select
                  id="tipo_reserva"
                  required
                  value={formData.tipo_reserva}
                  onChange={(e) => setFormData({...formData, tipo_reserva: e.target.value})}
                >
                  <option value="consulta">Consulta</option>
                  <option value="cirugia">Cirugía</option>
                  <option value="vacunacion">Vacunación</option>
                  <option value="limpieza">Limpieza</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="comentarios">Comentarios</label>
                <textarea
                  id="comentarios"
                  rows="3"
                  placeholder="Información adicional sobre la reserva..."
                  value={formData.comentarios}
                  onChange={(e) => setFormData({...formData, comentarios: e.target.value})}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Crear Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reservas
