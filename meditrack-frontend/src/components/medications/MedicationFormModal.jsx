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
    } catch {
      // toast is handled in parent
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full bg-[#141B23] border border-[#1C2530] rounded-xl px-4 py-2.5 font-sans text-sm text-[#F0F4F8] placeholder:text-[#3D5166] focus:border-[#00C89650] outline-none transition-colors"
  const labelClass = "block text-[10px] font-mono uppercase tracking-widest text-[#3D5166] mb-1.5 ml-1"

  const field = (label, key, type = 'text', extra = {}) => (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className={`${inputClass} ${errors[key] ? 'border-[#D95B5B50]' : ''}`}
        {...extra}
      />
      {errors[key] && <p className="text-[10px] text-[#D95B5B] mt-1 ml-1">{errors[key]}</p>}
    </div>
  )

  return (
    <Modal title={medication ? 'Edit Medication' : 'Add Medication'} onClose={onClose}>
      <div className="flex flex-col gap-5">
        {field('Medication Name', 'name', 'text', { placeholder: 'e.g. Metformin' })}
        {field('Dosage', 'dosage', 'text', { placeholder: 'e.g. 500mg' })}

        <div>
          <label className={labelClass}>Frequency</label>
          <select
            value={form.frequency}
            onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
            className={inputClass}
          >
            {FREQUENCIES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {field('Start Date', 'startDate', 'date')}
          {field('End Date', 'endDate', 'date')}
        </div>

        <div>
          <label className={labelClass}>Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            rows={3}
            className={`${inputClass} h-24 resize-none`}
            placeholder="Any additional notes..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-medium text-[#3D5166] border border-[#1C2530] rounded-xl hover:bg-[#141B23] transition-colors press"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 px-4 py-3 text-sm font-semibold text-[#080B0F] bg-[#00C896] rounded-xl disabled:opacity-50 press"
          >
            {saving ? 'Saving…' : medication ? 'Save Changes' : 'Add Medication'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
