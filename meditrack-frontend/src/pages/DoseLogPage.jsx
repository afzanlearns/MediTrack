import { useState, useEffect, useCallback } from 'react'
import { getDosesForDate, generateDoses } from '../api/doseApi'
import DateNavigator from '../components/doses/DateNavigator.jsx'
import DoseList from '../components/doses/DoseList.jsx'

export default function DoseLogPage() {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate]       = useState(today)
  const [doses, setDoses]     = useState([])
  const [filter, setFilter]   = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  const fetchDoses = useCallback(async (d) => {
    setLoading(true)
    try {
      const data = await getDosesForDate(d)
      setDoses(data)
    } catch {
      // Toast handles errors
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch doses whenever the selected date changes
  useEffect(() => { fetchDoses(date) }, [date, fetchDoses])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await generateDoses(date)
      await fetchDoses(date)
    } catch {
      // Toast handles errors
    } finally {
      setGenerating(false)
    }
  }

  // When a DoseCard status changes, update it in local state (no full refetch needed)
  const handleStatusChange = (updatedDose) => {
    setDoses(prev => prev.map(d => d.id === updatedDose.id ? updatedDose : d))
  }

  const pending = doses.filter(d => d.status === 'PENDING').length
  const taken   = doses.filter(d => d.status === 'TAKEN').length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Dose Log</h2>
          {!loading && doses.length > 0 && (
            <p className="text-sm text-gray-500">
              {taken} taken · {pending} pending · {doses.length} total
            </p>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 shadow-sm"
        >
          {generating ? 'Generating…' : '⚡ Generate Doses'}
        </button>
      </div>

      {/* Date navigator */}
      <DateNavigator date={date} onChange={(d) => { setDate(d); setFilter('ALL') }} />

      {/* Hint when no doses */}
      {!loading && doses.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
          No doses found for <strong>{date}</strong>. Click{' '}
          <strong>Generate Doses</strong> to create today's schedule from your active medications.
        </div>
      )}

      {/* Dose list with filter */}
      {loading ? (
        <p className="text-sm text-gray-400 animate-pulse">Loading doses…</p>
      ) : (
        <DoseList
          doses={doses}
          filter={filter}
          onFilterChange={setFilter}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}
