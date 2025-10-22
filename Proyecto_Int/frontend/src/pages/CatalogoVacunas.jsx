import React, { useState } from 'react'
import './CatalogoVacunas.css'

// Datos estáticos de vacunas (pueden migrarse a un servicio después si es necesario)
const VACUNAS_DATA = [
  { id: 1, nombre: 'Vacuna Antirrábica', descripcion: 'Protege contra la rabia', precio: 50 },
  { id: 2, nombre: 'Vacuna Triple Felina', descripcion: 'Protege contra enfermedades comunes en gatos', precio: 80 },
  { id: 3, nombre: 'Vacuna Parvovirus', descripcion: 'Protege contra el parvovirus canino', precio: 60 },
]

const CatalogoVacunas = () => {
  const [vacunas] = useState(VACUNAS_DATA)

  return (
    <div className="catalogo-vacunas">
      <h1>Catálogo de Vacunas</h1>
      <div className="vacunas-list">
        {vacunas.map((vacuna) => (
          <div key={vacuna.id} className="vacuna-item">
            <h2>{vacuna.nombre}</h2>
            <p>{vacuna.descripcion}</p>
            <p>Precio: Bs. {vacuna.precio}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CatalogoVacunas