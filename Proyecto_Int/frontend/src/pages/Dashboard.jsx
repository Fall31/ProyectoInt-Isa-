import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import SummaryCard from '../components/SummaryCard'
import ÚltimasCompras from '../components/ÚltimasCompras'
import './Dashboard.css'

const Dashboard = ({ user }) => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(user)
  const [stats, setStats] = useState({
    mascotas: 0,
    reservas: 0,
    compras: 0,
    ultimaVisita: '-'
  })
  const [mascotas, setMascotas] = useState([])
  const [proximasReservas, setProximasReservas] = useState([])
  const [alertasReservas, setAlertasReservas] = useState([])
  const [alertasVacunas, setAlertasVacunas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarDashboard = useCallback(async () => {
    try {
      setLoading(true)
      
      // Obtener usuario autenticado
      const { data: { user: authUser } } = await supabase.auth.getUser()
      setCurrentUser(authUser)

      if (!authUser) {
        navigate('/iniciar-sesion')
        return
      }

      // Verificar primero si es personal (no debería estar aquí)
      const { data: personalCheck } = await supabase
        .from('personal')
        .select('ci_personal')
        .eq('user_id', authUser.id)
        .maybeSingle()

      if (personalCheck) {
        console.warn('Usuario es personal, redirigiendo a dashboard de personal')
        navigate('/dashboard-personal')
        return
      }

      // Obtener datos del cliente
      const { data: cliente } = await supabase
        .from('cliente')
        .select('*')
        .eq('user_id', authUser.id)
        .single()

      if (cliente) {
        // Cargar mascotas del cliente
        const { data: mascotasData, count: mascotasCount } = await supabase
          .from('mascota')
          .select('*', { count: 'exact' })
          .eq('ci_cliente', cliente.ci_cliente)

        setMascotas(mascotasData || [])

        // Cargar reservas activas
        const { data: reservasData, count: reservasCount } = await supabase
          .from('reserva')
          .select('*, servicio(*)')
          .eq('ci_cliente', cliente.ci_cliente)
          .gte('fecha_reserva', new Date().toISOString().split('T')[0])
          .order('fecha_reserva', { ascending: true })
          .limit(3)

        const listaReservas = reservasData || []
        setProximasReservas(listaReservas)

        // Recordatorios de reservas próximas (24h)
        const ahora = Date.now()
        const unDia = 24 * 60 * 60 * 1000
        const toTs = (r) => new Date(`${r.fecha_reserva}T${r.hora_reserva || '00:00'}`).getTime()
        const recordatorios = listaReservas
          .map(r => ({ ...r, ts: toTs(r) }))
          .filter(r => r.ts && r.ts > ahora && (r.ts - ahora) <= unDia)
          .sort((a,b) => a.ts - b.ts)
        setAlertasReservas(recordatorios)

        // Obtener última visita
        const { data: ultimaAtencion } = await supabase
          .from('atencion')
          .select('fecha_atencion')
          .eq('ci_cliente', cliente.ci_cliente)
          .order('fecha_atencion', { ascending: false })
          .limit(1)
          .single()

        setStats({
          mascotas: mascotasCount || 0,
          reservas: reservasCount || 0,
          compras: 0, // TODO: implementar cuando haya tabla de compras
          ultimaVisita: ultimaAtencion 
            ? new Date(ultimaAtencion.fecha_atencion).toLocaleDateString('es-ES')
            : '-'
        })

        // Alertas de vacunas próximas (7 días) para todas las mascotas
        const ciMascotas = (mascotasData || []).map(m => m.ci_mascota)
        let vacunasProximas = []
        if (ciMascotas.length) {
          for (const ci of ciMascotas) {
            const dataVac = await supabase
              .from('vacuna')
              .select('id_vacuna, nombre_vacuna, fecha_proxima')
              .eq('id_historial', ci)
            const hoy = Date.now()
            const siete = 7 * 24 * 60 * 60 * 1000
            const avisos = (dataVac.data || [])
              .filter(v => v.fecha_proxima)
              .map(v => ({ ...v, ts: new Date(v.fecha_proxima).getTime(), ci_mascota: ci }))
              .filter(v => v.ts > hoy && (v.ts - hoy) <= siete)
            vacunasProximas = vacunasProximas.concat(avisos)
          }
          vacunasProximas.sort((a,b) => a.ts - b.ts)
          setAlertasVacunas(vacunasProximas)
        }
      }

      setLoading(false)
    } catch (err) {
      console.error('Error cargando dashboard:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    cargarDashboard()
  }, [cargarDashboard])

  if (loading) {
    return <div className="dashboard-loading">Cargando dashboard...</div>
  }

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🏥 Dashboard VetCare</h1>
          <p className="subtitle">¡Bienvenido de nuevo, {currentUser?.email?.split('@')[0] || 'Usuario'}!</p>
          <p className="date-time">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="summary-row">
        <SummaryCard 
          title="🐾 Mis Mascotas" 
          value={stats.mascotas} 
          trend="+1 este mes"
          color="primary"
        />
        <SummaryCard 
          title="📅 Reservas Activas" 
          value={stats.reservas} 
          trend="Próximas citas"
          color="success"
        />
        <SummaryCard 
          title="🛍️ Compras" 
          value={stats.compras} 
          trend="Total realizadas"
          color="warning"
        />
        <SummaryCard 
          title="📊 Última Visita" 
          value={stats.ultimaVisita || '-'} 
          trend="Historial activo"
          color="info"
        />
      </div>

      <section className="section quick-access-section">
        <h2>⚡ Accesos Rápidos</h2>
        <div className="quick-actions">
          <button className="action-card card-primary" onClick={() => navigate('/mascotas')}>
            <div className="action-icon">🐾</div>
            <div className="action-content">
              <h3>Mis Mascotas</h3>
              <p>Gestionar mascotas</p>
            </div>
          </button>
          <button className="action-card card-success" onClick={() => navigate('/reservas')}>
            <div className="action-icon">📅</div>
            <div className="action-content">
              <h3>Nueva Reserva</h3>
              <p>Agendar cita</p>
            </div>
          </button>
          <button className="action-card card-warning" onClick={() => navigate('/catalogo-productos')}>
            <div className="action-icon">🛍️</div>
            <div className="action-content">
              <h3>Tienda</h3>
              <p>Ver productos</p>
            </div>
          </button>
          <button className="action-card card-info" onClick={() => navigate('/perfil')}>
            <div className="action-icon">👤</div>
            <div className="action-content">
              <h3>Mi Perfil</h3>
              <p>Editar datos</p>
            </div>
          </button>
          <button className="action-card card-warning" onClick={() => navigate('/historial-facturas')}>
            <div className="action-icon">📋</div>
            <div className="action-content">
              <h3>Mis Compras</h3>
              <p>Ver historial</p>
            </div>
          </button>
        </div>
      </section>

      {(alertasReservas.length > 0 || alertasVacunas.length > 0) && (
        <section className="section">
          <h2>🔔 Recordatorios</h2>
          {alertasReservas.length > 0 && (
            <div className="reserva-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <div className="reserva-body">
                <div className="reserva-detail full-width">
                  <span className="icon">📅</span>
                  <div>
                    <strong>Reservas en las próximas 24 horas:</strong>
                    {alertasReservas.map(a => (
                      <p key={a.id_reserva}>Cita {a.tipo_reserva} el {new Date(a.fecha_reserva).toLocaleDateString('es-ES')} a las {a.hora_reserva}</p>
                    ))}
                    <button className="btn-primary" onClick={() => navigate('/reservas')}>Ver reservas</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {alertasVacunas.length > 0 && (
            <div className="reserva-card">
              <div className="reserva-body">
                <div className="reserva-detail full-width">
                  <span className="icon">💉</span>
                  <div>
                    <strong>Vacunas próximas (7 días):</strong>
                    {alertasVacunas.map(v => (
                      <p key={v.id_vacuna}>{v.nombre_vacuna || 'Vacuna'} programada para el {new Date(v.fecha_proxima).toLocaleDateString('es-ES')}</p>
                    ))}
                    <button className="btn-primary" onClick={() => navigate('/mascotas')}>Ver vacunas</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      <div className="dashboard-grid">
        <section className="section mascotas-section">
          <div className="section-header">
            <h2>🐕 Mis Mascotas Registradas</h2>
            <button className="btn-add" onClick={() => navigate('/mascotas')}>
              + Agregar Mascota
            </button>
          </div>
          {mascotas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🐾</div>
              <p>No tienes mascotas registradas</p>
              <button className="btn-primary" onClick={() => navigate('/mascotas')}>
                Registrar Primera Mascota
              </button>
            </div>
          ) : (
            <div className="mascotas-preview">
              {mascotas.slice(0, 4).map((m, index) => (
                <div key={m.ci_mascota} className="mascota-mini-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="mascota-mini-icon">
                    {m.especie === 'Perro' ? '🐕' : m.especie === 'Gato' ? '🐈' : '🐾'}
                  </div>
                  <div className="mascota-info">
                    <h4>{m.nombre_mascota}</h4>
                    <p className="mascota-details">{m.especie} • {m.raza || 'Sin raza'}</p>
                    <p className="mascota-meta">{m.sexo} • {m.color || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {mascotas.length > 4 && (
            <button onClick={() => navigate('/mascotas')} className="see-more-btn">
              Ver todas las mascotas ({mascotas.length}) →
            </button>
          )}
        </section>

        {proximasReservas.length > 0 && (
          <section className="section reservas-section">
            <div className="section-header">
              <h2>📅 Próximas Citas</h2>
              <button className="btn-add" onClick={() => navigate('/reservas')}>
                + Nueva Reserva
              </button>
            </div>
            <div className="reservas-preview">
              {proximasReservas.map((reserva, index) => (
                <div key={reserva.id_reserva} className="reserva-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="reserva-icon">📅</div>
                  <div className="reserva-info">
                    <h4>{reserva.servicio?.nombre_servicio || 'Servicio'}</h4>
                    <p className="reserva-date">
                      📆 {new Date(reserva.fecha_reserva).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                    </p>
                    <p className="reserva-time">🕐 {reserva.hora_reserva}</p>
                  </div>
                  <div className={`status-badge status-${reserva.estado_reserva}`}>
                    {reserva.estado_reserva}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECCIÓN ÚLTIMAS COMPRAS */}
        <section className="compras-section">
          <h3>🛍️ Últimas Compras</h3>
          <ÚltimasCompras />
        </section>
      </div>
    </div>
  )
}

export default Dashboard
