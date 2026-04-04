import React, { useEffect, useMemo, useState } from 'react'
import { Search, UserPlus, Calendar, Clock, Loader2, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { getVisits, createVisit, updateVisit, deleteVisit } from '../api/visitApi'
import { getActiveMeds } from '../api/medicationApi'
import VisitFormModal from '../components/visits/VisitFormModal'
import { mapVisitView } from '../utils/viewMappers'
import { toast } from '../utils/toast'

const DoctorVisitsPage = () => {
  const [search, setSearch] = useState('')
  const [visits, setVisits] = useState([])
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVisit, setEditingVisit] = useState(null)

  const loadData = async () => {
    setError('')
    setLoading(true)
    try {
      const [visitData, medData] = await Promise.all([getVisits(), getActiveMeds()])
      setVisits((visitData || []).map(mapVisitView))
      setMedications(medData || [])
    } catch {
      setError('Unable to load visits.')
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
    if (editingVisit) {
      const updated = await updateVisit(editingVisit.id, payload)
      setVisits((prev) => prev.map((visit) => (visit.id === editingVisit.id ? mapVisitView(updated || visit) : visit)))
      toast.success('Visit updated.')
      return
    }

    const created = await createVisit(payload)
    setVisits((prev) => [mapVisitView(created || payload), ...prev])
    toast.success('Visit added.')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this visit?')) return
    try {
      await deleteVisit(id)
      setVisits((prev) => prev.filter((visit) => visit.id !== id))
      toast.success('Visit deleted.')
    } catch {
      toast.danger('Unable to delete visit.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="pb-8"
    >
      <div className="px-4 pt-12 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-[#E8EDF2] text-[2.1rem] font-bold tracking-tight">Visits</h1>
          <p className="text-[#6E879B] text-sm mt-0.5">Upcoming appointments</p>
        </div>
        <button
          onClick={handleAdd}
          className="w-10 h-10 bg-[#00D4AA] rounded-xl flex items-center justify-center text-[#0A0E13]"
          aria-label="Add visit"
        >
          <UserPlus size={20} strokeWidth={2.3} />
        </button>
      </div>

      <div className="mx-4 mb-4 relative">
        <Search className="absolute inset-y-0 left-0 my-auto ml-3.5 h-4 w-4 text-[#3D5166]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctors..."
          className="w-full bg-[#111720] border border-[#1E2D3D] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#E8EDF2] placeholder:text-[#3D5166] outline-none"
        />
      </div>

      {loading ? (
        <div className="mx-4 mt-8 flex items-center justify-center rounded-xl border border-[#1E2D3D] bg-[#111720] py-10">
          <Loader2 className="h-6 w-6 animate-spin text-[#00D4AA]" />
        </div>
      ) : error ? (
        <div className="mx-4 rounded-xl border border-[#EF444433] bg-[#EF44440D] p-4">
          <p className="text-sm text-[#FCA5A5]">{error}</p>
          <button onClick={loadData} className="mt-2 text-xs font-semibold text-[#E8EDF2] underline">
            Retry
          </button>
        </div>
      ) : filteredVisits.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-12 mb-8 mx-4">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#00D4AA]/10 rounded-full blur-2xl animate-pulse" />
            <div className="w-24 h-24 rounded-full bg-[#0F1A24] border border-[#1E2D3D] flex items-center justify-center relative z-10">
              <Calendar size={40} className="text-[#3D5166]" strokeWidth={1} />
            </div>
          </div>
          <h3 className="text-[#E8EDF2] text-xl font-bold mb-2">No Upcoming Visits</h3>
          <p className="text-[#4A6070] text-sm text-center max-w-[260px] mb-8">
            Keep track of your medical appointments and attach relevant notes and linked medications.
          </p>
          <button
            onClick={handleAdd}
            className="bg-[#111720] border border-[#1E2D3D] text-[#E8EDF2] px-6 py-3 rounded-lg text-sm font-medium"
          >
            Schedule a Visit
          </button>
        </div>
      ) : (
        <div className="space-y-3 px-4">
          {filteredVisits.map((visit, index) => (
            <motion.div
              key={visit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16, delay: index * 0.03 }}
              className="rounded-xl border border-[#1E2D3D] bg-[#111720] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[#E8EDF2] font-semibold text-base">{visit.doctorName}</h3>
                  <p className="text-[#4A6070] text-xs uppercase tracking-wider mt-0.5">
                    {visit.diagnosis || 'General Consultation'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(visit)} className="text-[#00D4AA]">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(visit.id)} className="text-[#F87171]">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-3 border-t border-[#1E2D3D] pt-3 text-sm">
                <div className="flex items-center gap-2 text-[#8BA3BA]">
                  <Clock size={14} className="text-[#3D5166]" />
                  <span>{visit.dateLabel}</span>
                </div>
                {visit.notes && (
                  <p className="mt-2 text-xs leading-relaxed text-[#5E7388]">{visit.notes}</p>
                )}
                {visit.medications?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {visit.medications.map((med) => (
                      <span key={med.id || med} className="rounded-md border border-[#213549] bg-[#18222E] px-2 py-0.5 text-[11px] text-[#8BA3BA]">
                        {med.name || med}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
    </motion.div>
  )
}

export default DoctorVisitsPage
