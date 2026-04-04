import { useState } from 'react'

const EMPTY = { symptomName: '', severity: 5, symptomDate: '', notes: '' }

export default function AddSymptomForm({ onSave }) {
  const [form, setForm]     = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.symptomName.trim()) e.symptomName = 'Symptom name is required'
    if (!form.symptomDate)        e.symptomDate = 'Date is required'
    if (form.severity < 1 || form.severity > 10) e.severity = 'Must be 1–10'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await onSave({
        symptomName: form.symptomName,
        severity:    Number(form.severity),
        symptomDate: form.symptomDate,
        notes:       form.notes || null,
      })
      setForm(EMPTY)
      setErrors({})
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-bg-surface rounded-xl border border-bg-border p-5">
      <h3 className="text-sm font-semibold text-text-secondary mb-4">Log a Symptom</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Symptom name */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Symptom Name</label>
          <input
            type="text"
            value={form.symptomName}
            onChange={e => setForm(f => ({ ...f, symptomName: e.target.value }))}
            placeholder="e.g. Headache, Nausea"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.symptomName ? 'border-red-400' : 'border-bg-border'
            }`}
          />
          {errors.symptomName && <p className="text-xs text-red-500 mt-1">{errors.symptomName}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Date</label>
          <input
            type="date"
            value={form.symptomDate}
            onChange={e => setForm(f => ({ ...f, symptomDate: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.symptomDate ? 'border-red-400' : 'border-bg-border'
            }`}
          />
          {errors.symptomDate && <p className="text-xs text-red-500 mt-1">{errors.symptomDate}</p>}
        </div>

        {/* Severity slider */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Severity — <span className="text-blue-600 font-bold">{form.severity}/10</span>
          </label>
          <input
            type="range"
            min={1} max={10} step={1}
            value={form.severity}
            onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-text-secondary mt-0.5">
            <span>1 (Mild)</span><span>10 (Severe)</span>
          </div>
          {errors.severity && <p className="text-xs text-red-500 mt-1">{errors.severity}</p>}
        </div>

        {/* Notes */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-text-secondary mb-1">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            rows={2}
            placeholder="Any additional context..."
            className="w-full px-3 py-2 border border-bg-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Log Symptom'}
        </button>
      </div>
    </div>
  )
}
