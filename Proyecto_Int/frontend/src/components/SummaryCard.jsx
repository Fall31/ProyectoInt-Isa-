import './SummaryCard.css'

const SummaryCard = ({ title, value }) => {
  return (
    <div className="summary-card">
      <div className="summary-card-inner">
        <div className="summary-title">{title}</div>
        <div className="summary-value">{value}</div>
      </div>
    </div>
  )
}

export default SummaryCard
