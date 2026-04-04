const SEVERITY_COLOR = (s) => {
  if (s <= 3) return 'bg-green-100 text-green-700'
  if (s <= 6) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
}

export default function RecentSymptomsWidget({ symptoms }) {
  if (!symptoms || symptoms.length === 0) {
    return (
      <div className="text-center py-6 text-text-secondary">
        <p className="text-2xl mb-1">📋</p>
        <p className="text-sm">No symptoms logged yet.</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {symptoms.map(s => (
        <li key={s.id} className="flex items-center justify-between text-sm">
          <div>
            <span className="font-medium text-text-secondary">{s.symptomName}</span>
            <span className="text-text-secondary ml-2 text-xs">
              {new Date(s.symptomDate).toLocaleDateString()}
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${SEVERITY_COLOR(s.severity)}`}>
            {s.severity}/10
          </span>
        </li>
      ))}
    </ul>
  )
}
