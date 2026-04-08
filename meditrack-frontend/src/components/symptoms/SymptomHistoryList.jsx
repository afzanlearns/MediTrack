import React, { useState } from 'react'
import { deleteSymptom } from '../../api/symptomApi'
import ConfirmDialog from '../ui/ConfirmDialog'
const SEV_COLOR = (s) => {
  if (s <= 3) return 'bg-green-100 text-green-700'
  if (s <= 6) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
}

export default function SymptomHistoryList({ symptoms, onDeleted }) {
  const [symptomToDelete, setSymptomToDelete] = useState(null)

  const confirmDelete = (id) => {
    setSymptomToDelete(id)
  }

  const handleDelete = async () => {
    if (!symptomToDelete) return
    try {
      await deleteSymptom(symptomToDelete)
      onDeleted(symptomToDelete)
    } catch {
      // Toast handles the error display
    } finally {
      setSymptomToDelete(null)
    }
  }

  if (!symptoms || symptoms.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        <p className="text-sm">No symptom entries match your filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-bg-border">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-bg-elevated">
          <tr>
            {['Date', 'Symptom', 'Severity', 'Notes', ''].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-bg-surface divide-y divide-gray-100">
          {symptoms.map(s => (
            <tr key={s.id} className="hover:bg-bg-elevated">
              <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                {new Date(s.symptomDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 font-medium text-text-secondary">{s.symptomName}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${SEV_COLOR(s.severity)}`}>
                  {s.severity}/10
                </span>
              </td>
              <td className="px-4 py-3 text-text-muted max-w-xs truncate">{s.notes || '—'}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => confirmDelete(s.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog 
        isOpen={!!symptomToDelete}
        onClose={() => setSymptomToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Symptom"
        message="Are you sure you want to delete this symptom entry?"
      />
    </div>
  )
}
