import React, { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import MedicationFormModal from '../components/medications/MedicationFormModal'
import { getMedications, createMedication, updateMedication, deleteMedication } from '../api/medicationApi'
import { mapMedicationView } from '../utils/viewMappers'
import { toast } from '../utils/toast'

export default function MedicationsPage() {
  const [medications, setMedications] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMedication, setEditingMedication] = useState(null)

  const loadMedications = async () => {
    setLoading(true)
    try {
      const data = await getMedications()
      setMedications((data || []).map(mapMedicationView))
    } catch {
      toast.danger('Unable to load medications.')
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
    try {
      if (editingMedication) {
        const updated = await updateMedication(editingMedication.id, payload)
        setMedications((prev) =>
          prev.map((med) => (med.id === editingMedication.id ? mapMedicationView(updated || { ...med, ...payload }) : med)),
        )
        toast.success('Medication updated.')
      } else {
        const created = await createMedication(payload)
        setMedications((prev) => [mapMedicationView(created || payload), ...prev])
        toast.success('Medication added.')
      }
      setIsModalOpen(false)
    } catch {
      toast.danger('Failed to save medication.')
    }
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
    <div className="pb-8">
      {/* Header */}
      <div className="px-5 pt-14 pb-5 flex items-start justify-between">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-[#F0F4F8]">Medications</h1>
          <p className="font-mono text-xs text-[#3D5166] mt-1">{activeCount} active</p>
        </div>
        <button 
          onClick={handleCreate}
          className="w-9 h-9 rounded-full bg-[#00C896] flex items-center justify-center press"
        >
          <Plus size={18} strokeWidth={2.5} className="text-[#080B0F]" />
        </button>
      </div>

      {/* Search */}
      <div className="mx-5 mb-4 flex items-center gap-3 bg-[#0E1318] border border-[#1C2530] 
                      rounded-xl px-4 py-3">
        <Search size={14} strokeWidth={1.5} className="text-[#3D5166] flex-shrink-0" />
        <input 
          placeholder="Search medications..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 font-sans text-sm text-[#F0F4F8] placeholder:text-[#3D5166] bg-transparent outline-none" 
        />
      </div>

      {/* Medication list */}
      <div className="space-y-3">
        {filteredMeds.length === 0 && !loading ? (
          <div className="mx-5 py-12 text-center card text-sm text-[#3D5166]">
            No medications found.
          </div>
        ) : (
          filteredMeds.map((med) => (
            <div key={med.id} className="mx-5 mb-3 card overflow-hidden">
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${med.isActive ? 'bg-[#00C896]' : 'bg-[#3D5166]'}`} />
                    <h3 className="font-sans text-base font-semibold text-[#F0F4F8]">{med.name}</h3>
                  </div>
                  <span className={`font-mono text-[10px] tracking-wide px-2 py-0.5 rounded-full ${
                    med.isActive 
                      ? 'text-[#00C896] bg-[#00C8961A]' 
                      : 'text-[#3D5166] bg-[#141B23]'
                  }`}>
                    {med.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                {/* Chips — dosage in accent-tinted mono, frequency plain */}
                <div className="flex gap-2 mt-1">
                  <span className="font-mono text-xs text-[#00C896] bg-[#00C8961A] px-2 py-0.5 rounded-md">
                    {med.dosage}
                  </span>
                  <span className="font-mono text-xs text-[#3D5166] bg-[#141B23] px-2 py-0.5 rounded-md">
                    {med.frequencyLabel}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#3D5166] mt-2">Started {med.startDateLabel}</p>
              </div>
              {/* Action row — separated by top border */}
              <div className="border-t border-[#1C2530] px-4 py-2.5 flex gap-4">
                <button 
                  onClick={() => handleEdit(med)}
                  className="flex items-center gap-1.5 text-[#00C896] text-xs font-sans press"
                >
                  <Pencil size={11} /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(med.id)}
                  className="flex items-center gap-1.5 text-[#D95B5B] text-xs font-sans press"
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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
    </div>
  )
}

