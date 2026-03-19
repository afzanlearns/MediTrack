import { useState, useEffect } from 'react'
import { getSymptoms, getSymptomNames, logSymptom } from '../api/symptomApi'
import SeverityLineChart from '../components/symptoms/SeverityLineChart.jsx'
import AddSymptomForm from '../components/symptoms/AddSymptomForm.jsx'
import SymptomHistoryList from '../components/symptoms/SymptomHistoryList.jsx'

export default function SymptomsPage() {
  const [symptoms, setSymptoms]         = useState([])
  const [names, setNames]               = useState([])
  const [loading, setLoading]           = useState(true)

  // Filter state
  const defaultFrom = new Date(Date.now() - 30 * 864e5).toISOString().split('T')[0]
  const defaultTo   = new Date().toISOString().split('T')[0]
  const [selectedName, setSelectedName] = useState('')
  const [from, setFrom]                 = useState(defaultFrom)
  const [to, setTo]                     = useState(defaultTo)

  const fetchSymptoms = async () => {
    setLoading(true)
    try {
      const params = {}
      if (selectedName) params.name = selectedName
      if (from) params.from = from
      if (to)   params.to   = to
      const data = await getSymptoms(params)
      setSymptoms(data)
    } catch {
      // Toast handles errors
    } finally {
      setLoading(false)
    }
  }

  const fetchNames = async () => {
    try { setNames(await getSymptomNames()) } catch {}
  }

  // Fetch on mount and whenever filters change
  useEffect(() => { fetchSymptoms() }, [selectedName, from, to])
  useEffect(() => { fetchNames() }, [])

  const handleLog = async (data) => {
    await logSymptom(data)
    await Promise.all([fetchSymptoms(), fetchNames()])
  }

  const handleDeleted = (id) => {
    setSymptoms(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Symptom Journal</h2>
        <p className="text-sm text-gray-500">Track and visualise symptom severity over time.</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Symptom</label>
          <select
            value={selectedName}
            onChange={e => setSelectedName(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All symptoms</option>
            {names.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
          <input
            type="date" value={from}
            onChange={e => setFrom(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
          <input
            type="date" value={to}
            onChange={e => setTo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => { setSelectedName(''); setFrom(defaultFrom); setTo(defaultTo) }}
          className="text-xs text-blue-600 hover:underline"
        >
          Reset
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Severity Trend {selectedName ? `— ${selectedName}` : '(All Symptoms)'}
        </h3>
        {loading ? (
          <p className="text-sm text-gray-400 animate-pulse py-8 text-center">Loading chart…</p>
        ) : (
          <SeverityLineChart symptoms={symptoms} />
        )}
      </div>

      {/* Log form */}
      <AddSymptomForm onSave={handleLog} />

      {/* History table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          History ({symptoms.length} entries)
        </h3>
        {loading ? (
          <p className="text-sm text-gray-400 animate-pulse">Loading…</p>
        ) : (
          <SymptomHistoryList symptoms={symptoms} onDeleted={handleDeleted} />
        )}
      </div>
    </div>
  )
}
