const FREQ_LABELS = {
  ONCE_DAILY:         'Once daily',
  TWICE_DAILY:        'Twice daily',
  THREE_TIMES_DAILY:  'Three times daily',
  EVERY_8_HOURS:      'Every 8 hours',
  WEEKLY:             'Weekly',
}

export default function MedicationTable({ medications, onEdit, onDelete }) {
  if (!medications || medications.length === 0) {
    return (
      <div className="text-center py-16 text-text-secondary">
        <p className="text-4xl mb-3">💊</p>
        <p className="text-base font-medium">No medications added yet.</p>
        <p className="text-sm mt-1">Click "Add Medication" to get started.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-bg-border">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-bg-elevated">
          <tr>
            {['Name','Dosage','Frequency','Start Date','End Date','Status','Actions'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-bg-surface divide-y divide-gray-100">
          {medications.map(med => (
            <tr key={med.id} className="hover:bg-bg-elevated">
              <td className="px-4 py-3 font-medium text-text-secondary">{med.name}</td>
              <td className="px-4 py-3 text-text-secondary">{med.dosage}</td>
              <td className="px-4 py-3 text-text-secondary">{FREQ_LABELS[med.frequency] ?? med.frequency}</td>
              <td className="px-4 py-3 text-text-secondary">{med.startDate}</td>
              <td className="px-4 py-3 text-text-secondary">{med.endDate ?? '—'}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  med.isActive ? 'bg-green-100 text-green-700' : 'bg-bg-elevated text-text-muted'
                }`}>
                  {med.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(med)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    Edit
                  </button>
                  {med.isActive && (
                    <button
                      onClick={() => onDelete(med.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
