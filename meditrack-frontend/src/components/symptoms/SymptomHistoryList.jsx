import { deleteSymptom } from '../../api/symptomApi'

const SEV_COLOR = (s) => {
  if (s <= 3) return 'bg-green-100 text-green-700'
  if (s <= 6) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
}

export default function SymptomHistoryList({ symptoms, onDeleted }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this symptom entry?')) return
    try {
      await deleteSymptom(id)
      onDeleted(id)
    } catch {
      // Toast handles the error display
    }
  }

  if (!symptoms || symptoms.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">No symptom entries match your filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Date', 'Symptom', 'Severity', 'Notes', ''].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {symptoms.map(s => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                {new Date(s.symptomDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 font-medium text-gray-800">{s.symptomName}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${SEV_COLOR(s.severity)}`}>
                  {s.severity}/10
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{s.notes || '—'}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
