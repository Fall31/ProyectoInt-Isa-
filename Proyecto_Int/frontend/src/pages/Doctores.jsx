import React, { useState, useEffect } from 'react'
import supabaseServices from '../services/supabase'
import { supabase } from '../lib/supabaseClient'
import './Doctores.css'

// Helper: agrupar horarios por día y generar slots disponibles
function agruparHorariosPorDia(horarios) {
  const porDia = {}
  (horarios || []).forEach(h => {
    porDia[h.dia_semana] = porDia[h.dia_semana] || []
    porDia[h.dia_semana].push(h)
  })
  return porDia
}

const Doctores = () => {
  const [doctores, setDoctores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [horariosPorDoctor, setHorariosPorDoctor] = useState({})

  useEffect(() => {
    cargarDoctores()
  }, [])

  const cargarDoctores = async () => {
    try {
      setLoading(true)
      const data = await supabaseServices.doctores.getAll()

      // Mapear especialidades reales desde tablas personal_especialidad y especialidad
      const cis = (data || []).map(d => d.ci_personal)
      let especialidadesPorCI = {}
      if (cis.length > 0) {
        const { data: pesp } = await supabase
          .from('personal_especialidad')
          .select('ci_personal, id_especialidad')
          .in('ci_personal', cis)

        const idsEsp = [...new Set((pesp || []).map(e => e.id_especialidad))]
        let espMap = {}
        if (idsEsp.length > 0) {
          const { data: esp } = await supabase
            .from('especialidad')
            .select('id_especialidad, nombre_especialidad')
            .in('id_especialidad', idsEsp)
          espMap = Object.fromEntries((esp || []).map(x => [x.id_especialidad, x.nombre_especialidad]))
        }

        especialidadesPorCI = (pesp || []).reduce((acc, row) => {
          acc[row.ci_personal] = acc[row.ci_personal] || []
          const nombre = espMap[row.id_especialidad]
          if (nombre) acc[row.ci_personal].push(nombre)
          return acc
        }, {})
      }

      // Cargar horarios por doctor desde tabla `horario_personal` + `horario`
      let horariosMap = {}
      if (cis.length > 0) {
        const { data: hpers } = await supabase
          .from('horario_personal')
          .select('ci_personal, id_horario')
          .in('ci_personal', cis)

        const idsHorario = [...new Set((hpers || []).map(x => x.id_horario))]
        let horarios = []
        if (idsHorario.length > 0) {
          const { data: hrows } = await supabase
            .from('horario')
            .select('id_horario, id_servicio, dia_semana, hora_inicio, hora_fin, descanso_inicio, descanso_fin, disponibilidad, es_emergencia')
            .in('id_horario', idsHorario)
          horarios = hrows || []
        }

        // map ci_personal -> horarios
        horariosMap = (hpers || []).reduce((acc, row) => {
          acc[row.ci_personal] = acc[row.ci_personal] || []
          const h = horarios.find(x => x.id_horario === row.id_horario)
          if (h) acc[row.ci_personal].push(h)
          return acc
        }, {})
      }

      const enriched = (data || []).map(d => ({
        ...d,
        especialidades: especialidadesPorCI[d.ci_personal] || [],
        horarios: horariosMap[d.ci_personal] || []
      }))

      setDoctores(enriched)
      setHorariosPorDoctor(Object.fromEntries(enriched.map(d => [d.ci_personal, agruparHorariosPorDia(d.horarios)])))
    } catch (err) {
      console.error('Error cargando doctores:', err)
      setError('No se pudieron cargar los doctores')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="doctores-page">
        <div className="loading-spinner">Cargando doctores...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="doctores-page">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="doctores-page">
      <div className="page-header">
        <h1>Nuestro Equipo Médico</h1>
        <p className="subtitle">Profesionales certificados con horarios y servicios disponibles</p>
      </div>

      <div className="doctors-grid">
        {doctores.length === 0 ? (
          <p className="no-data">No hay doctores disponibles en este momento.</p>
        ) : (
          doctores.map((doctor) => {
            const iniciales = `${(doctor.nombre_personal || '')[0] || ''}${(doctor.primer_apellido || '')[0] || ''}`
            const nombreCompleto = `${doctor.nombre_personal || ''} ${doctor.primer_apellido || ''}`.trim()
            const horariosAgrupados = horariosPorDoctor[doctor.ci_personal] || {}
            
            return (
              <div key={doctor.ci_personal} className="doctor-card-page">
                <div className="doctor-top">
                  <div className="doctor-avatar">
                    <div className="avatar-circle">{iniciales}</div>
                    {doctor.estado === 'activo' && <span className="status-badge">✓ Activo</span>}
                  </div>
                  <div className="doctor-details">
                    <div className="doctor-name">{nombreCompleto}</div>
                    <div className="doctor-specialty">
                      <span className="icon">🩺</span>
                      {doctor.especialidades?.length ? doctor.especialidades.join(', ') : (doctor.titulo_universitario || 'Veterinario')}
                    </div>
                    <div className="doctor-contacts">
                      {doctor.correo_personal && (
                        <div className="doctor-contact"><span className="icon">📧</span><a href={`mailto:${doctor.correo_personal}`}>{doctor.correo_personal}</a></div>
                      )}
                      {doctor.telefono_personal && (
                        <div className="doctor-contact"><span className="icon">📞</span><a href={`tel:${doctor.telefono_personal}`}>{doctor.telefono_personal}</a></div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="doctor-schedule">
                  <div className="schedule-title">Horarios</div>
                  {Object.keys(horariosAgrupados).length === 0 ? (
                    <div className="schedule-empty">No tiene horarios asignados</div>
                  ) : (
                    <div className="schedule-grid">
                      {Object.entries(horariosAgrupados).map(([dia, slots]) => (
                        <div key={dia} className="schedule-day">
                          <div className="day-name">{dia}</div>
                          <div className="day-slots">
                            {slots.map(s => (
                              <span key={s.id_horario} className={`slot ${s.disponibilidad ? 'on' : 'off'}`}>
                                {s.hora_inicio} - {s.hora_fin}
                                {s.descanso_inicio && s.descanso_fin ? ` (descanso ${s.descanso_inicio}-${s.descanso_fin})` : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="doctor-actions">
                  <button className="btn-primary" onClick={() => window.location.href = '/reservas'}>
                    Reservar con {doctor.nombre_personal}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Doctores
