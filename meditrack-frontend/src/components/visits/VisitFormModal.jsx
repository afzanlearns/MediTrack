import { useState, useEffect } from 'react'
import Modal from '../shared/Modal.jsx'

const EMPTY = { doctorName: '', visitDate: '', diagnosis: '', notes: '', medicationIds: [] }

export default function VisitFormModal({ visit, medications, onSave, onClose }) {
  const [form, setForm]     = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (visit) {
      setForm({
        doctorName:    visit.doctorName ?? '',
        visitDate:     visit.visitDate ?? '',
        diagnosis:     visit.diagnosis ?? '',
        notes:         visit.notes ?? '',
        medicationIds: visit.medications?.map(m => m.id) ?? [],
      })
    }
  }, [visit])

  const validate = () => {
    const e = {}
    if (!form.doctorName.trim()) e.doctorName = 'Doctor name is required'
    if (!form.visitDate)         e.visitDate  = 'Visit date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await onSave({
        doctorName:    form.doctorName,
        visitDate:     form.visitDate,
        diagnosis:     form.diagnosis || null,
        notes:         form.notes || null,
        medicationIds: form.medicationIds,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const toggleMed = (id) => {
    setForm(f => ({
      ...f,
      medicationIds: f.medicationIds.includes(id)
        ? f.medicationIds.filter(x => x !== id)
        : [...f.medicationIds, id],
    }))
  }

  return (
    <Modal title={visit ? 'Edit Visit' : 'Log Doctor Visit'} onClose={onClose} size="lg">
      <div className="flex flex-col gap-4">

        {/* Doctor name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
          <input
            type="text"
            value={form.doctorName}
            onChange={e => setForm(f => ({ ...f, doctorName: e.target.value }))}
            placeholder="e.g. Dr. Priya Sharma"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.doctorName ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.doctorName && <p className="text-xs text-red-500 mt-1">{errors.doctorName}</p>}
        </div>

        {/* Visit date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
          <input
            type="date"
            value={form.visitDate}
            onChange={e => setForm(f => ({ ...f, visitDate: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.visitDate ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.visitDate && <p className="text-xs text-red-500 mt-1">{errors.visitDate}</p>}
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis (optional)</label>
          <input
            type="text"
            value={form.diagnosis}
            onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))}
            placeholder="e.g. Hypertension follow-up"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            rows={3}
            placeholder="Additional notes from the visit..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Linked medications multi-select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link Medications (optional)
          </label>
          {medications && medications.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {medications.map(m => (
                <label
                  key={m.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                    form.medicationIds.includes(m.id)
                      ? 'border-blue-400 bg-blue-50 text-blue-800'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.medicationIds.includes(m.id)}
                    onChange={() => toggleMed(m.id)}
                    className="accent-blue-600"
                  />
                  <span className="truncate">{m.name} ({m.dosage})</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No active medications available to link.</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : visit ? 'Save Changes' : 'Log Visit'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
