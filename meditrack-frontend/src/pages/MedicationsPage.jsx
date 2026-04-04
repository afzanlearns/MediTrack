import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import MedicationFormModal from '../components/medications/MedicationFormModal'
import { getMedications, createMedication, updateMedication, deleteMedication } from '../api/medicationApi'
import { mapMedicationView } from '../utils/viewMappers'
import { toast } from '../utils/toast'

const MedicationsPage = () => {
  const [medications, setMedications] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMedication, setEditingMedication] = useState(null)

  const loadMedications = async () => {
    setError('')
    try {
      const data = await getMedications()
      setMedications((data || []).map(mapMedicationView))
    } catch {
      setError('Unable to load medications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMedications()
  }, [])

  const filteredMeds = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return medications
    return medications.filter((m) => m.name.toLowerCase().includes(query))
  }, [medications, search])

  const handleCreate = () => {
    setEditingMedication(null)
    setIsModalOpen(true)
  }

  const handleEdit = (med) => {
    setEditingMedication(med)
    setIsModalOpen(true)
  }

  const handleSave = async (payload) => {
    if (editingMedication) {
      const updated = await updateMedication(editingMedication.id, payload)
      setMedications((prev) =>
        prev.map((med) => (med.id === editingMedication.id ? mapMedicationView(updated || { ...med, ...payload }) : med)),
      )
      toast.success('Medication updated.')
      return
    }

    const created = await createMedication(payload)
    setMedications((prev) => [mapMedicationView(created || payload), ...prev])
    toast.success('Medication added.')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this medication?')) return
    try {
      await deleteMedication(id)
      setMedications((prev) => prev.filter((med) => med.id !== id))
      toast.success('Medication deleted.')
    } catch {
      toast.danger('Failed to delete medication.')
    }
  }

  const activeCount = medications.filter((med) => med.isActive).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="pb-6"
    >
      <div className="px-4 pb-4 pt-12">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-[1.9rem] font-bold tracking-tight text-[#E8EDF2]">Medications</h1>
            <p className="mt-0.5 text-sm text-[#6E879B]">{activeCount} active</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00D4AA] text-[#0A0E13] transition-transform active:scale-95"
            aria-label="Add medication"
          >
            <Plus size={20} strokeWidth={2.4} />
          </button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3D5166]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medications..."
            className="w-full rounded-xl border border-[#1E2D3D] bg-[#111720] py-2.5 pl-10 pr-3 text-sm text-[#E8EDF2] placeholder:text-[#3D5166] outline-none transition focus:border-[#00D4AA66]"
          />
        </div>
      </div>

      {loading ? (
        <div className="mx-4 mt-8 flex items-center justify-center rounded-xl border border-[#1E2D3D] bg-[#111720] py-10">
          <Loader2 className="h-6 w-6 animate-spin text-[#00D4AA]" />
        </div>
      ) : error ? (
        <div className="mx-4 mt-6 rounded-xl border border-[#EF444433] bg-[#EF44440D] p-4">
          <p className="text-sm text-[#FCA5A5]">{error}</p>
          <button onClick={loadMedications} className="mt-2 text-xs font-semibold text-[#E8EDF2] underline">
            Retry
          </button>
        </div>
      ) : filteredMeds.length === 0 ? (
        <div className="mx-4 mt-8 rounded-xl border border-[#1E2D3D] bg-[#111720] py-10 text-center">
          <p className="text-sm text-[#8BA3BA]">No medications found.</p>
        </div>
      ) : (
        <div className="space-y-3 px-4">
          {filteredMeds.map((med, index) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16, delay: index * 0.03 }}
              className="overflow-hidden rounded-2xl border border-[#1E2D3D] bg-[#111720]"
            >
              <div className="flex items-start justify-between px-4 pb-3 pt-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        med.isActive ? 'bg-[#00D4AA] shadow-[0_0_10px_#00D4AA]' : 'bg-[#4A6070]'
                      }`}
                    />
                    <h3 className="text-base font-semibold text-[#E8EDF2]">{med.name}</h3>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-[#00D4AA33] bg-[#00D4AA14] px-2 py-0.5 text-xs text-[#00D4AA]">
                      {med.dosage}
                    </span>
                    <span className="rounded-md border border-[#213549] bg-[#18222E] px-2 py-0.5 text-xs text-[#6E879B]">
                      {med.frequencyLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#4A6070]">Started {med.startDateLabel}</p>
                </div>
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    med.isActive ? 'bg-[#00D4AA1A] text-[#00D4AA]' : 'bg-[#18222E] text-[#6E879B]'
                  }`}
                >
                  {med.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center gap-4 border-t border-[#1E2D3D] px-4 py-2.5">
                <button
                  onClick={() => handleEdit(med)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#00D4AA]"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(med.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#F87171]"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <MedicationFormModal
          medication={editingMedication}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false)
            setEditingMedication(null)
          }}
        />
      )}
    </motion.div>
  )
}

export default MedicationsPage
