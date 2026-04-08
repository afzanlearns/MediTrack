import React, { useEffect, useMemo, useState } from 'react'
import { Search, UserPlus, Calendar, Clock, Pencil, Trash2, Stethoscope } from 'lucide-react'
import { getVisits, createVisit, updateVisit, deleteVisit } from '../api/visitApi'
import { getActiveMeds } from '../api/medicationApi'
import VisitFormModal from '../components/visits/VisitFormModal'
import { mapVisitView } from '../utils/viewMappers'
import { toast } from '../utils/toast'
import ConfirmDialog from '../components/ui/ConfirmDialog'

export default function DoctorVisitsPage() {
  const [search, setSearch] = useState('')
  const [visits, setVisits] = useState([])
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVisit, setEditingVisit] = useState(null)
  const [visitToDelete, setVisitToDelete] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [visitData, medData] = await Promise.all([getVisits(), getActiveMeds()])
      setVisits((visitData || []).map(mapVisitView))
      setMedications(medData || [])
    } catch {
      toast.danger('Unable to load visits.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredVisits = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return visits
    return visits.filter((v) => v.doctorName.toLowerCase().includes(query))
  }, [visits, search])

  const handleAdd = () => {
    setEditingVisit(null)
    setIsModalOpen(true)
  }

  const handleEdit = (visit) => {
    setEditingVisit(visit)
    setIsModalOpen(true)
  }

  const handleSave = async (payload) => {
    try {
      if (editingVisit) {
        const updated = await updateVisit(editingVisit.id, payload)
        setVisits((prev) => prev.map((visit) => (visit.id === editingVisit.id ? mapVisitView(updated || visit) : visit)))
        toast.success('Visit updated.')
      } else {
        const created = await createVisit(payload)
        setVisits((prev) => [mapVisitView(created || payload), ...prev])
        toast.success('Visit added.')
      }
      setIsModalOpen(false)
    } catch {
      toast.danger('Failed to save visit.')
    }
  }

  const confirmDelete = (id) => {
    setVisitToDelete(id)
  }

  const handleDelete = async () => {
    if (!visitToDelete) return
    try {
      await deleteVisit(visitToDelete)
      setVisits((prev) => prev.filter((visit) => visit.id !== visitToDelete))
      toast.success('Visit deleted.')
    } catch {
      toast.danger('Unable to delete visit.')
    } finally {
      setVisitToDelete(null)
    }
  }

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="px-5 pt-14 pb-5 flex items-start justify-between">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-[#F0F4F8]">Visits</h1>
          <p className="font-sans text-sm text-[#3D5166] mt-0.5">Upcoming appointments</p>
        </div>
        <button 
          onClick={handleAdd}
          className="w-9 h-9 rounded-full bg-[#00C896] flex items-center justify-center press"
        >
          <UserPlus size={18} strokeWidth={2.5} className="text-[#080B0F]" />
        </button>
      </div>

      {/* Search */}
      <div className="mx-5 mb-4 flex items-center gap-3 bg-[#0E1318] border border-[#1C2530] 
                      rounded-xl px-4 py-3">
        <Search size={14} strokeWidth={1.5} className="text-[#3D5166] flex-shrink-0" />
        <input 
          placeholder="Search doctors..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 font-sans text-sm text-[#F0F4F8] placeholder:text-[#3D5166] bg-transparent outline-none" 
        />
      </div>

      {/* Visit list */}
      <div className="space-y-3">
        {filteredVisits.length === 0 && !loading ? (
          <div className="mx-5 py-20 flex flex-col items-center justify-center border border-dashed border-[#1C2530] rounded-2xl">
            <Stethoscope size={32} strokeWidth={1} className="text-[#1C2530] mb-4" />
            <h3 className="font-sans text-sm font-medium text-[#8A9BAE]">No upcoming visits</h3>
            <button 
              onClick={handleAdd}
              className="mt-4 font-sans text-xs text-[#00C896] press"
            >
              + Schedule visit
            </button>
          </div>
        ) : (
          filteredVisits.map((visit) => (
            <div key={visit.id} className="mx-5 mb-3 card px-4 py-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-sans text-base font-semibold text-[#F0F4F8]">{visit.doctorName}</h3>
                  <p className="font-mono text-[10px] tracking-wider text-[#3D5166] uppercase mt-0.5">
                    {visit.diagnosis || 'General Consultation'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(visit)} className="text-[#3D5166] press"><Pencil size={14} /></button>
                  <button onClick={() => confirmDelete(visit.id)} className="text-[#3D5166] press"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={12} className="text-[#00C896]" />
                <span className="font-mono text-xs text-[#8A9BAE]">{visit.dateLabel}</span>
              </div>
              {visit.notes && (
                <p className="font-sans text-xs text-[#3D5166] leading-relaxed border-t border-[#1C2530] pt-3">
                  {visit.notes}
                </p>
              )}
              {visit.medications?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {visit.medications.map((med) => (
                    <span key={med.id || med} className="font-sans text-[10px] text-[#8A9BAE] bg-[#141B23] border border-[#1C2530] px-2 py-0.5 rounded-full">
                      {med.name || med}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <VisitFormModal
          visit={editingVisit}
          medications={medications}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false)
            setEditingVisit(null)
          }}
        />
      )}

      <ConfirmDialog 
        isOpen={!!visitToDelete}
        onClose={() => setVisitToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Visit"
        message="Are you sure you want to delete this doctor visit? This action cannot be undone."
      />
    </div>
  )
}

