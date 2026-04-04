import { useState, useEffect } from 'react'
import Modal from '../shared/Modal.jsx'

const FREQUENCIES = [
  { value: 'ONCE_DAILY',        label: 'Once daily' },
  { value: 'TWICE_DAILY',       label: 'Twice daily' },
  { value: 'THREE_TIMES_DAILY', label: 'Three times daily' },
  { value: 'EVERY_8_HOURS',     label: 'Every 8 hours' },
  { value: 'WEEKLY',            label: 'Weekly' },
]

const EMPTY_FORM = {
  name: '', dosage: '', frequency: 'ONCE_DAILY',
  startDate: '', endDate: '', notes: '',
}

export default function MedicationFormModal({ medication, onSave, onClose }) {
  const [form, setForm]     = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (medication) {
      setForm({
        name:      medication.name ?? '',
        dosage:    medication.dosage ?? '',
        frequency: medication.frequency ?? 'ONCE_DAILY',
        startDate: medication.startDate ?? '',
        endDate:   medication.endDate ?? '',
        notes:     medication.notes ?? '',
      })
    }
  }, [medication])

  const validate = () => {
    const e = {}
    if (!form.name.trim())      e.name      = 'Name is required'
    if (!form.dosage.trim())    e.dosage    = 'Dosage is required'
    if (!form.startDate)        e.startDate = 'Start date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await onSave({
        name:      form.name,
        dosage:    form.dosage,
        frequency: form.frequency,
        startDate: form.startDate,
        endDate:   form.endDate || null,
        notes:     form.notes || null,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const field = (label, key, type = 'text', extra = {}) => (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[key] ? 'border-red-400' : 'border-bg-border'
        }`}
        {...extra}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <Modal title={medication ? 'Edit Medication' : 'Add Medication'} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {field('Medication Name', 'name', 'text', { placeholder: 'e.g. Metformin' })}
        {field('Dosage', 'dosage', 'text', { placeholder: 'e.g. 500mg' })}

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Frequency</label>
          <select
            value={form.frequency}
            onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
            className="w-full px-3 py-2 border border-bg-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FREQUENCIES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {field('Start Date', 'startDate', 'date')}
        {field('End Date (optional)', 'endDate', 'date')}

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-bg-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any additional notes..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-text-secondary border border-bg-border rounded-lg hover:bg-bg-elevated"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : medication ? 'Save Changes' : 'Add Medication'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
