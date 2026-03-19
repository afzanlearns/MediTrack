import { useState, useEffect } from 'react'
import { getMedications, createMedication, updateMedication, deleteMedication } from '../api/medicationApi'
import MedicationTable from '../components/medications/MedicationTable.jsx'
import MedicationFormModal from '../components/medications/MedicationFormModal.jsx'

export default function MedicationsPage() {
  const [medications, setMedications] = useState([])
  const [loading, setLoading]         = useState(true)
  const [showModal, setShowModal]     = useState(false)
  const [editTarget, setEditTarget]   = useState(null)   // null = add mode
  const [search, setSearch]           = useState('')

  const fetchMeds = async () => {
    try {
      const data = await getMedications()
      setMedications(data)
    } catch {
      // Toast handles errors
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMeds() }, [])

  const handleSave = async (formData) => {
    if (editTarget) {
      await updateMedication(editTarget.id, formData)
    } else {
      await createMedication(formData)
    }
    await fetchMeds()
  }

  const handleEdit = (med) => {
    setEditTarget(med)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this medication? Its dose history will be kept.')) return
    try {
      await deleteMedication(id)
      await fetchMeds()
    } catch {
      // Toast handles errors
    }
  }

  const handleAdd = () => {
    setEditTarget(null)
    setShowModal(true)
  }

  const filtered = medications.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.dosage.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Medications</h2>
          <p className="text-sm text-gray-500">
            {medications.filter(m => m.isActive).length} active ·{' '}
            {medications.length} total
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm"
        >
          + Add Medication
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or dosage…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Table */}
      {loading ? (
        <p className="text-sm text-gray-400 animate-pulse">Loading medications…</p>
      ) : (
        <MedicationTable
          medications={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      {showModal && (
        <MedicationFormModal
          medication={editTarget}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
