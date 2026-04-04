import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { Trash2, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { getSymptoms, logSymptom, deleteSymptom } from '../api/symptomApi'
import { mapSymptomView } from '../utils/viewMappers'
import { toast } from '../utils/toast'

const SymptomsPage = () => {
  const [severity, setSeverity] = useState(5)
  const [symptoms, setSymptoms] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    symptomName: '',
    symptomDate: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  })

  const loadSymptoms = async () => {
    try {
      const data = await getSymptoms()
      const mapped = (data || []).map(mapSymptomView)
      mapped.sort((a, b) => new Date(b.trendDate) - new Date(a.trendDate))
      setSymptoms(mapped)
    } catch {
      toast.danger('Unable to load symptoms.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSymptoms()
  }, [])

  const severityColor = (value) => {
    if (value <= 3) return 'bg-[#00D4AA1A] text-[#00D4AA] border-[#00D4AA33]'
    if (value <= 6) return 'bg-[#F59E0B1A] text-[#F59E0B] border-[#F59E0B33]'
    return 'bg-[#EF44441A] text-[#F87171] border-[#EF444433]'
  }

  const chartData = useMemo(() => {
    return [...symptoms]
      .reverse()
      .map((item) => ({ date: format(new Date(item.trendDate), 'MMM d'), severity: item.severity }))
  }, [symptoms])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.symptomName.trim()) {
      toast.info('Please enter symptom name.')
      return
    }

    const payload = {
      symptomName: form.symptomName.trim(),
      symptomDate: form.symptomDate,
      severity: Number(severity),
      notes: form.notes || null,
    }

    try {
      const created = await logSymptom(payload)
      setSymptoms((prev) => [mapSymptomView(created || payload), ...prev])
      setForm({ symptomName: '', symptomDate: format(new Date(), 'yyyy-MM-dd'), notes: '' })
      setSeverity(5)
      toast.success('Symptom logged.')
    } catch {
      toast.danger('Failed to log symptom.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this symptom entry?')) return
    try {
      await deleteSymptom(id)
      setSymptoms((prev) => prev.filter((item) => item.id !== id))
      toast.success('Symptom entry deleted.')
    } catch {
      toast.danger('Could not delete symptom.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="pb-8"
    >
      <div className="px-4 pt-12">
        <h1 className="text-[1.9rem] font-bold text-[#E8EDF2]">Symptoms</h1>
        <p className="text-sm text-[#6E879B]">Log and track patterns</p>
      </div>

      <div className="mx-4 mt-4 rounded-xl border border-[#1E2D3D] bg-[#111720]">
        <h2 className="border-b border-[#1E2D3D] px-4 pb-3 pt-4 text-sm font-semibold text-[#E8EDF2]">Log a Symptom</h2>
        <form onSubmit={handleSubmit} className="space-y-4 px-4 py-4">
          <input
            type="text"
            value={form.symptomName}
            onChange={(e) => setForm((prev) => ({ ...prev, symptomName: e.target.value }))}
            placeholder="Symptom name"
            className="w-full rounded-xl border border-[#1E2D3D] bg-[#18222E] px-4 py-3 text-sm text-[#E8EDF2] placeholder:text-[#3D5166] outline-none"
          />
          <input
            type="date"
            value={form.symptomDate}
            onChange={(e) => setForm((prev) => ({ ...prev, symptomDate: e.target.value }))}
            className="w-full rounded-xl border border-[#1E2D3D] bg-[#18222E] px-4 py-3 text-sm text-[#E8EDF2] outline-none"
          />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-[#E8EDF2]">Severity</label>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${severityColor(severity)}`}>
                {severity}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <textarea
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Notes (optional)"
            rows={3}
            className="w-full rounded-xl border border-[#1E2D3D] bg-[#18222E] px-4 py-3 text-sm text-[#E8EDF2] placeholder:text-[#3D5166] outline-none"
          />

          <button type="submit" className="w-full rounded-xl bg-[#00D4AA] py-3 text-sm font-semibold text-[#0A0E13]">
            Log Symptom
          </button>
        </form>
      </div>

      <div className="mx-4 mt-3 rounded-xl border border-[#1E2D3D] bg-[#111720]">
        <h2 className="border-b border-[#1E2D3D] px-4 py-3.5 text-sm font-semibold text-[#E8EDF2]">Severity Trend</h2>
        <div className="h-[180px] px-2 py-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D3D" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#4A6070" fontSize={10} />
              <YAxis domain={[0, 10]} tickLine={false} axisLine={false} stroke="#4A6070" fontSize={10} />
              <Line type="monotone" dataKey="severity" strokeWidth={2.5} stroke="#00D4AA" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mx-4 mb-24 mt-3 overflow-hidden rounded-xl border border-[#1E2D3D] bg-[#111720]">
        <h2 className="border-b border-[#1E2D3D] px-4 py-3.5 text-sm font-semibold text-[#E8EDF2]">History</h2>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-[#00D4AA]" />
          </div>
        ) : symptoms.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#8BA3BA]">No symptom entries yet.</div>
        ) : (
          symptoms.map((item) => (
            <div key={item.id || `${item.name}-${item.trendDate}`} className="flex items-center justify-between border-b border-[#1E2D3D] px-4 py-3 last:border-0">
              <div>
                <p className="text-sm font-semibold text-[#E8EDF2]">{item.name}</p>
                <p className="text-xs text-[#4A6070]">{item.dateLabel}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${severityColor(item.severity)}`}>
                  {item.severity}/10
                </span>
                {item.id && (
                  <button onClick={() => handleDelete(item.id)} className="text-[#6E879B] transition hover:text-[#F87171]">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}

export default SymptomsPage
