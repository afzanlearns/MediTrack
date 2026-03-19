import DoseCard from '../shared/DoseCard.jsx'

export default function TodaysDoseList({ doses, onStatusChange }) {
  if (!doses || doses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-3xl mb-2">💊</p>
        <p className="text-sm">No doses scheduled for today.</p>
        <p className="text-xs mt-1">Add a medication to get started.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {doses.map(dose => (
        <DoseCard key={dose.id} dose={dose} onStatusChange={onStatusChange} />
      ))}
    </div>
  )
}
