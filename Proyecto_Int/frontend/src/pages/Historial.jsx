import './Historial.css'

const Historial = () => {
	const entries = [
		{ id: 1, pet: 'Firulais', date: '2024-03-10', note: 'Vacunación completa' },
		{ id: 2, pet: 'Mishi', date: '2023-06-12', note: 'Esterilización' },
	]

	return (
		<div className="historial-page">
			<div className="page-header">
				<h1>Historial de mascotas</h1>
				<p className="subtitle">Registros médicos y atención</p>
			</div>

			<div className="history-list">
				{entries.map((e) => (
					<div key={e.id} className="history-card">
						<div className="history-left">
							<div className="pet-name">{e.pet}</div>
							<div className="history-date">{e.date}</div>
						</div>
						<div className="history-note">{e.note}</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Historial
