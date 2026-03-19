import { updateDoseStatus } from '../../api/doseApi'

const STATUS_STYLES = {
  TAKEN:   'bg-green-100 text-green-700 border-green-200',
  MISSED:  'bg-red-100 text-red-700 border-red-200',
  SKIPPED: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  PENDING: 'bg-blue-50 text-blue-700 border-blue-200',
}

const STATUS_ICONS = {
  TAKEN: '✅', MISSED: '❌', SKIPPED: '⏭️', PENDING: '⏳',
}

/**
 * Displays a single dose log entry.
 * Provides Taken / Missed / Skipped action buttons when the dose is PENDING.
 * Calls onStatusChange(updatedDose) after a successful status update.
 */
export default function DoseCard({ dose, onStatusChange }) {
  const time = new Date(dose.scheduledTime).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit',
  })

  const handleStatus = async (status) => {
    try {
      const updated = await updateDoseStatus(dose.id, status)
      onStatusChange?.(updated)
    } catch {
      // Error already shown by Toast via axios interceptor
    }
  }

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${STATUS_STYLES[dose.status]}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{STATUS_ICONS[dose.status]}</span>
        <div>
          <p className="font-medium text-gray-800">{dose.medicationName}</p>
          <p className="text-xs text-gray-500">{dose.medicationDosage} · {time}</p>
        </div>
      </div>

      {dose.status === 'PENDING' && (
        <div className="flex gap-2">
          <button
            onClick={() => handleStatus('TAKEN')}
            className="px-3 py-1 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Taken
          </button>
          <button
            onClick={() => handleStatus('MISSED')}
            className="px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Missed
          </button>
          <button
            onClick={() => handleStatus('SKIPPED')}
            className="px-3 py-1 text-xs font-semibold bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Skip
          </button>
        </div>
      )}

      {dose.status !== 'PENDING' && (
        <span className="text-xs font-semibold uppercase tracking-wide">{dose.status}</span>
      )}
    </div>
  )
}
