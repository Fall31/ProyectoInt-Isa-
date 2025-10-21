import React, { useEffect, useState } from 'react'
import { serviciosAPI } from '../lib/api'
import './CatalogoServicios.css'

const CatalogoServicios = () => {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadServicios = async () => {
      try {
        const data = await serviciosAPI.getAll()
        setServicios(data.servicios || [])
      } catch (error) {
        console.error('Error cargando servicios:', error)
        // Fallback a datos estáticos
        setServicios([
          { id_servicio: 1, nombre_servicio: 'Consulta general', precio_base: 20.00, duracion: 30, descripcion: 'Examen médico completo' },
          { id_servicio: 2, nombre_servicio: 'Vacunación', precio_base: 15.00, duracion: 15, descripcion: 'Aplicación de vacunas' },
          { id_servicio: 3, nombre_servicio: 'Corte de pelo', precio_base: 30.00, duracion: 60, descripcion: 'Grooming profesional' },
        ])
      } finally {
        setLoading(false)
      }
    }
    loadServicios()
  }, [])

  const abrirReserva = (servicio) => {
    // Redirigir a página de reservas con el servicio preseleccionado
    window.location.href = `/reservas?servicio=${servicio.id_servicio}`
  }

  if (loading) {
    return (
      <div className="catalogo-servicios">
        <div className="loading-spinner">Cargando servicios...</div>
      </div>
    )
  }

  return (
    <div className="catalogo-servicios">
      <div className="page-header">
        <h1>Catálogo de Servicios</h1>
        <p className="subtitle">Servicios profesionales para el cuidado de tu mascota</p>
      </div>
      
      <div className="services-grid">
        {servicios.map(s => (
          <div key={s.id_servicio} className="service-card">
            <div className="service-icon">🏥</div>
            <div className="service-info">
              <h3>{s.nombre_servicio}</h3>
              {s.descripcion && <p className="service-desc">{s.descripcion}</p>}
              <div className="service-details">
                <span className="duracion">⏱️ {s.duracion} min</span>
                <span className="categoria">{s.categoria || 'General'}</span>
              </div>
              <div className="service-footer">
                <div className="pricing">
                  <span className="price-label">Desde</span>
                  <span className="price">${s.precio_base.toFixed(2)}</span>
                </div>
                <button 
                  className="btn-secondary"
                  onClick={() => abrirReserva(s)}
                >
                  Reservar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CatalogoServicios
