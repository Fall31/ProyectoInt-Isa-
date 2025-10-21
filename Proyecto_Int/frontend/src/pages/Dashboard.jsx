import './Dashboard.css'
import SummaryCard from '../components/SummaryCard'
import ReservationModal from '../components/ReservationModal'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const Dashboard = ({ user }) => {
  const navigate = useNavigate()
  const [showReserve, setShowReserve] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    mascotas: 0,
    reservas: 0,
    compras: 0,
    ultimaVisita: null
  })
  const [mascotas, setMascotas] = useState([])

  const checkAuth = useCallback(async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      navigate('/iniciar-sesion')
    }
  }, [navigate])

  const fetchDashboardData = useCallback(async () => {
    if (!user) return
    try {
      // Fetch mascotas
      const mascotasRes = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas/${user.id}`)
      const mascotasData = await mascotasRes.json()
      const mascotasList = mascotasData.mascotas || []
      setMascotas(mascotasList)

      setStats({
        mascotas: mascotasList.length,
        reservas: 0,
        compras: 0,
        ultimaVisita: null
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    } else {
      checkAuth()
    }
  }, [user, fetchDashboardData, checkAuth])

  if (loading) {
    return <div className="dashboard-loading">Cargando dashboard...</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Bienvenido {user?.email || 'Usuario'}</p>
      </div>

      <div className="summary-row">
        <SummaryCard title="Mis Mascotas" value={stats.mascotas} />
        <SummaryCard title="Reservas Activas" value={stats.reservas} />
        <SummaryCard title="Compras" value={stats.compras} />
        <SummaryCard title="Última Visita" value={stats.ultimaVisita || '-'} />
      </div>

      <section className="section">
        <h2>Accesos Rápidos</h2>
        <div className="quick-actions">
          <button className="action-card" onClick={() => navigate('/mascotas')}>
            <span className="icon">🐾</span>
            <span>Mis Mascotas</span>
          </button>
          <button className="action-card" onClick={() => navigate('/reservas')}>
            <span className="icon">📅</span>
            <span>Nueva Reserva</span>
          </button>
          <button className="action-card" onClick={() => navigate('/catalogo-productos')}>
            <span className="icon">🛍️</span>
            <span>Tienda</span>
          </button>
          <button className="action-card" onClick={() => navigate('/perfil')}>
            <span className="icon">👤</span>
            <span>Mi Perfil</span>
          </button>
        </div>
      </section>

      <section className="section">
        <h2>Mis Mascotas Registradas</h2>
        {mascotas.length === 0 ? (
          <p>No tienes mascotas registradas. <a href="/mascotas">Registra tu primera mascota</a></p>
        ) : (
          <div className="mascotas-preview">
            {mascotas.slice(0, 3).map((m) => (
              <div key={m.ci_mascota} className="mascota-mini-card">
                <div className="mascota-mini-icon">🐾</div>
                <div>
                  <h4>{m.nombre_mascota}</h4>
                  <p>{m.especie} • {m.raza || 'Sin raza'}</p>
                </div>
              </div>
            ))}
            {mascotas.length > 3 && (
              <button onClick={() => navigate('/mascotas')} className="see-more-btn">
                Ver todas ({mascotas.length})
              </button>
            )}
          </div>
        )}
      </section>

      <ReservationModal visible={showReserve} onClose={() => setShowReserve(false)} />
    </div>
  )
}

export default Dashboard
