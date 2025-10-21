import './Reservas.css'
import { useState } from 'react'

const Reservas = () => {
		const [reservas] = useState([
		{ id: 1, pet: 'Firulais', owner: 'Juan', date: '2025-10-20 10:00' },
		{ id: 2, pet: 'Mishi', owner: 'María', date: '2025-10-21 14:30' },
	])

	return (
		<div className="reservas-page">
			<div className="page-header">
				<h1>Reservas</h1>
				<p className="subtitle">Lista de próximas reservas</p>
			</div>

			<div className="reservas-list">
				{reservas.map((r) => (
					<div key={r.id} className="reserva-card">
						<div>
							<div className="reserva-pet">{r.pet}</div>
							<div className="reserva-owner">Dueño: {r.owner}</div>
						</div>
						<div className="reserva-date">{r.date}</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Reservas
