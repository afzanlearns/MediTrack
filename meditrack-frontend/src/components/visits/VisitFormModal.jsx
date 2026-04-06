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
    } catch {
      // toast is handled in parent
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

  const inputClass = "w-full bg-[#141B23] border border-[#1C2530] rounded-xl px-4 py-2.5 font-sans text-sm text-[#F0F4F8] placeholder:text-[#3D5166] focus:border-[#00C89650] outline-none transition-colors"
  const labelClass = "block text-[10px] font-mono uppercase tracking-widest text-[#3D5166] mb-1.5 ml-1"

  return (
    <Modal title={visit ? 'Edit Visit' : 'Log Doctor Visit'} onClose={onClose}>
      <div className="flex flex-col gap-5">

        {/* Doctor name */}
        <div>
          <label className={labelClass}>Doctor Name</label>
          <input
            type="text"
            value={form.doctorName}
            onChange={e => setForm(f => ({ ...f, doctorName: e.target.value }))}
            placeholder="e.g. Dr. Priya Sharma"
            className={`${inputClass} ${errors.doctorName ? 'border-[#D95B5B50]' : ''}`}
          />
          {errors.doctorName && <p className="text-[10px] text-[#D95B5B] mt-1 ml-1">{errors.doctorName}</p>}
        </div>

        {/* Visit date */}
        <div>
          <label className={labelClass}>Visit Date</label>
          <input
            type="date"
            value={form.visitDate}
            onChange={e => setForm(f => ({ ...f, visitDate: e.target.value }))}
            className={`${inputClass} ${errors.visitDate ? 'border-[#D95B5B50]' : ''}`}
          />
          {errors.visitDate && <p className="text-[10px] text-[#D95B5B] mt-1 ml-1">{errors.visitDate}</p>}
        </div>

        {/* Diagnosis */}
        <div>
          <label className={labelClass}>Diagnosis (optional)</label>
          <input
            type="text"
            value={form.diagnosis}
            onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))}
            placeholder="e.g. Hypertension follow-up"
            className={inputClass}
          />
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            rows={3}
            placeholder="Additional notes from the visit..."
            className={`${inputClass} h-24 resize-none`}
          />
        </div>

        {/* Linked medications multi-select */}
        <div>
          <label className={labelClass}>
            Link Medications (optional)
          </label>
          {medications && medications.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {medications.map(m => (
                <label
                  key={m.id}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                    form.medicationIds.includes(m.id)
                      ? 'border-[#00C89650] bg-[#00C8960A] text-[#F0F4F8]'
                      : 'border-[#1C2530] bg-[#141B23] text-[#3D5166] hover:border-[#3D516650]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.medicationIds.includes(m.id)}
                    onChange={() => toggleMed(m.id)}
                    className="accent-[#00C896]"
                  />
                  <span className="truncate">{m.name}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-[#3D5166] italic ml-1">No active medications available to link.</p>
          )}
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
            {saving ? 'Saving…' : visit ? 'Save Changes' : 'Log Visit'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
