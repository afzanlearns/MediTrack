import { useState } from 'react'
import ConfirmDialog from '../ui/ConfirmDialog'
export default function VisitCard({ visit, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)

  const [showConfirm, setShowConfirm] = useState(false)

  const confirmDelete = () => {
    setShowConfirm(true)
  }

  const handleDelete = () => {
    onDelete(visit.id)
    setShowConfirm(false)
  }

  return (
    <div className="bg-bg-surface rounded-xl border border-bg-border overflow-hidden">
      {/* Header row */}
      <div
        className="flex items-start justify-between p-4 cursor-pointer hover:bg-bg-elevated"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-lg shrink-0">
            🩺
          </div>
          <div>
            <p className="font-semibold text-text-secondary">Dr. {visit.doctorName}</p>
            <p className="text-xs text-text-muted">
              {new Date(visit.visitDate).toLocaleDateString([], {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
            {visit.diagnosis && (
              <p className="text-xs text-text-secondary mt-0.5">
                <span className="font-medium">Dx:</span> {visit.diagnosis}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-3 shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onEdit(visit) }}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50"
          >
            Edit
          </button>
          <button
            onClick={e => { e.stopPropagation(); confirmDelete() }}
            className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50"
          >
            Delete
          </button>
          <span className="text-text-secondary text-sm">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-bg-border bg-bg-elevated space-y-3">
          {visit.notes && (
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Notes</p>
              <p className="text-sm text-text-secondary mt-0.5">{visit.notes}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Medications</p>
            {visit.medications && visit.medications.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {visit.medications.map(m => (
                  <span
                    key={m.id}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                  >
                    💊 {m.name} ({m.dosage})
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-secondary mt-1">No medications linked.</p>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Visit"
        message={`Are you sure you want to delete the visit with Dr. ${visit.doctorName}?`}
      />
    </div>
  )
}
