import DoseCard from '../shared/DoseCard.jsx'

const STATUS_OPTIONS = ['ALL', 'PENDING', 'TAKEN', 'MISSED', 'SKIPPED']

export default function DoseList({ doses, onStatusChange, filter, onFilterChange }) {
  const filtered = filter === 'ALL' ? doses : doses.filter(d => d.status === filter)

  return (
    <div>
      {/* Status filter bar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => onFilterChange(s)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
              filter === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-bg-surface text-text-secondary border-bg-border hover:border-blue-400'
            }`}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm font-medium">No doses found for this filter.</p>
          <p className="text-xs mt-1">
            Try clicking "Generate Doses" if this is a new date.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(dose => (
            <DoseCard key={dose.id} dose={dose} onStatusChange={onStatusChange} />
          ))}
        </div>
      )}
    </div>
  )
}
