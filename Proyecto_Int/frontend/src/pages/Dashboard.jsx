import './Dashboard.css'
import SummaryCard from '../components/SummaryCard'
import DoctorCard from '../components/DoctorCard'
import ReservationModal from '../components/ReservationModal'
import PetHistory from '../components/PetHistory'
import { useState } from 'react'

const sampleDoctors = [
  { id: 1, name: 'Dra. Ana Pérez', specialty: 'Medicina General', photo: null },
  { id: 2, name: 'Dr. Luis Gómez', specialty: 'Cirugía', photo: null },
  { id: 3, name: 'Dra. Carla Ruiz', specialty: 'Dermatología', photo: null },
]

const Dashboard = ({ user }) => {
  const [showReserve, setShowReserve] = useState(false)
  const [selectedPet, setSelectedPet] = useState(null)

  // sample stats (in real app fetch from backend)
  const stats = {
    clientes: 124,
    productos: 58,
    servicios: 12,
    reservasHoy: 6,
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Resumen de la clínica y accesos rápidos</p>
      </div>

      <div className="summary-row">
        <SummaryCard title="Clientes" value={stats.clientes} />
        <SummaryCard title="Productos" value={stats.productos} />
        <SummaryCard title="Servicios" value={stats.servicios} />
        <SummaryCard title="Reservas hoy" value={stats.reservasHoy} />
      </div>

      <section className="section">
        <h2>Equipo médico</h2>
        <div className="doctors-row">
          {sampleDoctors.map((d) => (
            <DoctorCard key={d.id} doctor={d} onReserve={() => setShowReserve(true)} />
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Reservas</h2>
        <button className="btn-primary" onClick={() => setShowReserve(true)}>Nueva reserva</button>
      </section>

      <section className="section">
        <h2>Historial de la mascota</h2>
        {user ? (
          <PetHistory userId={user.id} onSelectPet={(p) => setSelectedPet(p)} />
        ) : (
          <p>Inicia sesión para ver el historial de tus mascotas.</p>
        )}
      </section>

      <ReservationModal visible={showReserve} onClose={() => setShowReserve(false)} />
    </div>
  )
}

export default Dashboard
