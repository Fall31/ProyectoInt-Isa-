import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const HomeStats = () => {
  const [stats] = useState({
    mascotas: 150,
    doctores: 8,
    servicios: 12,
    productos: 45
  })

  return (
    <div className="home-stats">
      <div className="stat-item">
        <div className="stat-icon">🐾</div>
        <h3>{stats.mascotas}+</h3>
        <p>Mascotas cuidadas</p>
      </div>
      
      <div className="stat-item">
        <div className="stat-icon">👨‍⚕️</div>
        <h3>{stats.doctores}+</h3>
        <p>Profesionales</p>
      </div>
      
      <div className="stat-item">
        <div className="stat-icon">🏥</div>
        <h3>{stats.servicios}+</h3>
        <p>Servicios disponibles</p>
      </div>
      
      <div className="stat-item">
        <div className="stat-icon">🛒</div>
        <h3>{stats.productos}+</h3>
        <p>Productos disponibles</p>
      </div>
    </div>
  )
}

export default HomeStats
