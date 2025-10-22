import React from 'react'
import { useServicios } from '@/hooks'
import { Servicio } from '@/domain'
import './CatalogoServicios.css'

const CatalogoServicios = () => {
  const { servicios, loading, error } = useServicios()

  const abrirReserva = (servicio) => {
    window.location.href = `/reservas?servicio=${servicio.id_servicio}`
  }

  if (loading) {
    return (
      <div className="catalogo-servicios">
        <div className="loading-spinner">Cargando servicios...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="catalogo-servicios">
        <div className="error-message">Error: {error}</div>
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
        {servicios.map(s => {
          const servicio = s instanceof Servicio ? s : Servicio.fromAPI(s)
          
          return (
            <div key={servicio.id_servicio} className="service-card">
              <div className="service-icon">🏥</div>
              <div className="service-info">
                <h3>{servicio.nombre_servicio}</h3>
                {servicio.descripcion && <p className="service-desc">{servicio.descripcion}</p>}
                <div className="service-details">
                  <span className="duracion">⏱️ {servicio.duracion} min</span>
                  <span className="categoria">{servicio.categoria || 'General'}</span>
                  {servicio.estaDisponible() && <span className="badge-disponible">✓ Disponible</span>}
                </div>
                <div className="service-footer">
                  <div className="pricing">
                    <span className="price-label">Desde</span>
                    <span className="price">${servicio.precio_base.toFixed(2)}</span>
                  </div>
                  <button 
                    className="btn-secondary"
                    onClick={() => abrirReserva(servicio)}
                    disabled={!servicio.estaDisponible()}
                  >
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CatalogoServicios
