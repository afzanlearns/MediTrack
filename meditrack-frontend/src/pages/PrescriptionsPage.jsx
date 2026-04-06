import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { FileText, Download, Trash2, UploadCloud } from 'lucide-react'
import {
  getPrescriptions,
  uploadPrescription,
  downloadPrescription,
  deletePrescription,
} from '../api/prescriptionApi'
import { toast } from '../utils/toast'

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    prescribedDate: format(new Date(), 'yyyy-MM-dd'),
    doctorName: '',
    notes: '',
    file: null,
  })

  useEffect(() => { fetchPrescriptions() }, [])

  const fetchPrescriptions = async () => {
    try {
      const res = await getPrescriptions()
      setPrescriptions(res.data || [])
    } catch {
      toast.error('Failed to load prescriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!form.file) {
      toast.info('Please select a file to upload')
      return
    }
    setSaving(true)
    const data = new FormData()
    data.append('prescribedDate', form.prescribedDate)
    data.append('doctorName', form.doctorName)
    data.append('notes', form.notes)
    data.append('file', form.file)
    try {
      await uploadPrescription(data)
      toast.success('Prescription uploaded.')
      setForm({ prescribedDate: format(new Date(), 'yyyy-MM-dd'), doctorName: '', notes: '', file: null })
      fetchPrescriptions()
    } catch {
      toast.error('Failed to upload prescription')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deletePrescription(id)
      toast.success('Prescription removed.')
      fetchPrescriptions()
    } catch {
      toast.error('Failed to delete prescription')
    }
  }

  const handleDownload = async (id) => {
    try {
      const blobUrl = await downloadPrescription(id)
      window.open(blobUrl, '_blank')
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000)
    } catch {
      toast.error('Failed to download prescription')
    }
  }

  const inputClass = "w-full bg-[#141B23] border border-[#1C2530] rounded-xl px-4 py-3 font-sans text-sm text-[#F0F4F8] placeholder:text-[#3D5166] focus:border-[#00C89650] transition-colors outline-none"

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-5 pt-14 pb-5">
        <h1 className="font-sans text-2xl font-semibold text-[#F0F4F8]">Prescriptions</h1>
        <p className="font-sans text-sm text-[#3D5166] mt-0.5">Uploaded prescription documents</p>
      </div>

      {/* Upload form */}
      <div className="mx-5 mb-4 card px-4 py-4">
        <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166] mb-4">
          Upload Document
        </h2>
        <form onSubmit={handleUpload} className="space-y-3">
          <input
            type="text"
            placeholder="Doctor Name"
            value={form.doctorName}
            onChange={e => setForm({...form, doctorName: e.target.value})}
            className={inputClass}
            required
          />
          <input
            type="date"
            value={form.prescribedDate}
            onChange={e => setForm({...form, prescribedDate: e.target.value})}
            className={inputClass}
            required
          />
          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={e => setForm({...form, notes: e.target.value})}
            className={`${inputClass} h-20 resize-none`}
          />
          {/* File drop zone */}
          <label className="block border border-dashed border-[#1C2530] rounded-xl p-5 bg-[#141B23] text-center cursor-pointer hover:border-[#00C89650] transition-colors">
            <input
              type="file"
              className="hidden"
              onChange={e => setForm({...form, file: e.target.files?.[0] || null})}
            />
            <UploadCloud size={22} className="mx-auto text-[#3D5166] mb-2" />
            <p className="font-sans text-sm text-[#3D5166]">
              {form.file ? form.file.name : 'Tap to select file'}
            </p>
            <p className="font-mono text-[10px] text-[#3D5166] mt-1">PDF, JPG, or PNG</p>
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#00C896] text-[#080B0F] font-sans font-semibold text-sm py-3.5 rounded-xl press"
          >
            {saving ? 'Uploading...' : 'Upload Prescription'}
          </button>
        </form>
      </div>

      {/* Prescription list */}
      {loading ? (
        <div className="mx-5 py-10 text-center">
          <p className="font-mono text-xs text-[#3D5166] animate-pulse">Loading...</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="mx-5 py-12 text-center card text-sm text-[#3D5166]">
          No prescriptions uploaded yet.
        </div>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((doc) => (
            <div key={doc.id} className="mx-5 card overflow-hidden">
              <div className="px-4 pt-4 pb-3 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#00C8961A] border border-[#00C89630] flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-[#00C896]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-semibold text-[#F0F4F8] truncate">
                    {doc.originalName || doc.fileName}
                  </p>
                  <p className="font-mono text-[11px] text-[#3D5166] mt-0.5">
                    Dr. {doc.doctorName || 'Unknown'} · {format(new Date(doc.prescribedDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="border-t border-[#1C2530] px-4 py-2.5 flex gap-4">
                <button
                  onClick={() => handleDownload(doc.id)}
                  className="flex items-center gap-1.5 text-[#00C896] text-xs font-sans press"
                >
                  <Download size={11} /> Download
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="flex items-center gap-1.5 text-[#D95B5B] text-xs font-sans press"
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
