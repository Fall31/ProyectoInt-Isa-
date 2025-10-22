import React from 'react'
import { useReservas } from '@/hooks'
import './Reservas.css'

const Reservas = () => {
  const { reservas, loading, error } = useReservas()

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
        <h1>Reservas</h1>
        <p className="subtitle">Lista de próximas reservas</p>
      </div>

      <div className="reservas-list">
        {reservas.length === 0 ? (
          <p>No tienes reservas programadas.</p>
        ) : (
          reservas.map((r) => (
            <div key={r.id_reserva} className="reserva-card">
              <div>
                <div className="reserva-pet">{r.nombre_mascota || 'Mascota'}</div>
                <div className="reserva-owner">Servicio: {r.nombre_servicio || '-'}</div>
              </div>
              <div className="reserva-date">
                {r.fecha_reserva ? new Date(r.fecha_reserva).toLocaleString() : '-'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Reservas
