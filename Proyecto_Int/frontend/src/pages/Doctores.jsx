import React, { useState } from 'react'
import './Doctores.css'

// Datos estáticos de doctores (pueden migrarse a un servicio después)
const DOCTORES_DATA = [
  { id: 1, name: 'Dra. Ana Pérez', specialty: 'Medicina General', bio: '10 años de experiencia en perros y gatos.' },
  { id: 2, name: 'Dr. Luis Gómez', specialty: 'Cirugía', bio: 'Especialista en procedimientos quirúrgicos de emergencia.' },
  { id: 3, name: 'Dra. Carla Ruiz', specialty: 'Dermatología', bio: 'Atención a problemas de piel y alergias.' },
]

const Doctores = () => {
  const [doctors] = useState(DOCTORES_DATA)

  return (
    <div className="doctores-page">
      <div className="page-header">
        <h1>Doctores</h1>
        <p className="subtitle">Conoce a nuestro equipo médico</p>
      </div>

      <div className="doctors-grid">
        {doctors.map((d) => (
          <div key={d.id} className="doctor-card-page">
            <div className="avatar-large">{d.name.split(' ')[1][0]}</div>
            <div className="doctor-details">
              <div className="doctor-name">{d.name}</div>
              <div className="doctor-specialty">{d.specialty}</div>
              <p className="doctor-bio">{d.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Doctores
