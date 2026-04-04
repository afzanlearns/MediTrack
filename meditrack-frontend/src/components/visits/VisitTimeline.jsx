import VisitCard from './VisitCard.jsx'

export default function VisitTimeline({ visits, onEdit, onDelete }) {
  if (!visits || visits.length === 0) {
    return (
      <div className="text-center py-16 text-text-secondary">
        <p className="text-4xl mb-3">🩺</p>
        <p className="text-base font-medium">No doctor visits recorded yet.</p>
        <p className="text-sm mt-1">Click "Add Visit" to log your first appointment.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-bg-elevated -z-0" />

      <div className="space-y-4 relative">
        {visits.map(visit => (
          <div key={visit.id} className="pl-10 relative">
            {/* Timeline dot */}
            <div className="absolute left-3.5 top-5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-200" />
            <VisitCard visit={visit} onEdit={onEdit} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  )
}
