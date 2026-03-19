import { useState, useEffect } from 'react'
import { getVisits, createVisit, updateVisit, deleteVisit } from '../api/visitApi'
import { getActiveMeds } from '../api/medicationApi'
import VisitTimeline from '../components/visits/VisitTimeline.jsx'
import VisitFormModal from '../components/visits/VisitFormModal.jsx'

export default function DoctorVisitsPage() {
  const [visits, setVisits]         = useState([])
  const [medications, setMeds]      = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  const fetchAll = async () => {
    try {
      const [v, m] = await Promise.all([getVisits(), getActiveMeds()])
      setVisits(v)
      setMeds(m)
    } catch {
      // Toast handles errors
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleSave = async (formData) => {
    if (editTarget) {
      await updateVisit(editTarget.id, formData)
    } else {
      await createVisit(formData)
    }
    await fetchAll()
  }

  const handleEdit = (visit) => {
    setEditTarget(visit)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    try {
      await deleteVisit(id)
      setVisits(prev => prev.filter(v => v.id !== id))
    } catch {
      // Toast handles errors
    }
  }

  const handleAdd = () => {
    setEditTarget(null)
    setShowModal(true)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Doctor Visits</h2>
          <p className="text-sm text-gray-500">{visits.length} visit{visits.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm"
        >
          + Add Visit
        </button>
      </div>

      {/* Timeline */}
      {loading ? (
        <p className="text-sm text-gray-400 animate-pulse">Loading visits…</p>
      ) : (
        <VisitTimeline
          visits={visits}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      {showModal && (
        <VisitFormModal
          visit={editTarget}
          medications={medications}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
