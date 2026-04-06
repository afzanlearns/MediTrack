import React, { useEffect, useMemo, useState, useRef } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { format } from 'date-fns'
import { Trash2, Plus } from 'lucide-react'
import { getSymptoms, logSymptom, deleteSymptom } from '../api/symptomApi'
import { mapSymptomView } from '../utils/viewMappers'
import { toast } from '../utils/toast'

export default function SymptomsPage() {
  const [severity, setSeverity] = useState(5)
  const [symptoms, setSymptoms] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    symptomName: '',
    symptomDate: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  })
  const formRef = useRef(null)

  const loadSymptoms = async () => {
    try {
      const data = await getSymptoms()
      const mapped = (data || []).map(mapSymptomView)
      mapped.sort((a, b) => new Date(b.trendDate) - new Date(a.trendDate))
      setSymptoms(mapped)
    } catch {
      toast.error('Unable to load symptom records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadSymptoms() }, [])

  const chartData = useMemo(() =>
    [...symptoms].reverse().map((item) => ({
      date: format(new Date(item.trendDate), 'MMM d'),
      severity: item.severity,
    }))
  , [symptoms])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.symptomName.trim()) {
      toast.info('Enter a symptom name')
      return
    }
    setSaving(true)
    try {
      const payload = { ...form, severity }
      const created = await logSymptom(payload)
      setSymptoms(prev => [mapSymptomView(created || payload), ...prev])
      setForm({ symptomName: '', symptomDate: format(new Date(), 'yyyy-MM-dd'), notes: '' })
      setSeverity(5)
      toast.success('Symptom logged.')
    } catch {
      toast.error('Failed to log symptom')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteSymptom(id)
      setSymptoms(prev => prev.filter(s => s.id !== id))
      toast.success('Symptom removed.')
    } catch {
      toast.error('Failed to delete symptom')
    }
  }

  const inputClass = "w-full bg-[#141B23] border border-[#1C2530] rounded-xl px-4 py-3 font-sans text-sm text-[#F0F4F8] placeholder:text-[#3D5166] focus:border-[#00C89650] transition-colors outline-none"

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="px-5 pt-14 pb-5 flex items-start justify-between">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-[#F0F4F8]">Symptoms</h1>
          <p className="font-sans text-sm text-[#3D5166] mt-0.5">{symptoms.length} recorded</p>
        </div>
        <button
          onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="font-sans text-sm font-medium text-[#080B0F] bg-[#00C896] px-4 py-2 rounded-xl press"
        >
          + Log
        </button>
      </div>

      {/* Chart card */}
      {chartData.length > 0 && (
        <div className="mx-5 mb-4 card px-4 py-4">
          <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166] mb-4">
            Severity Trend
          </h2>
          <div className="h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C896" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#00C896" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1C2530" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#3D5166', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fill: '#3D5166', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0E1318', border: '1px solid #1C2530', borderRadius: '8px' }}
                  itemStyle={{ color: '#00C896', fontSize: '12px' }}
                />
                <Area
                  type="monotone" dataKey="severity"
                  stroke="#00C896" strokeWidth={1.5}
                  fill="url(#fill)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: '#00C896' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Log form */}
      <div ref={formRef} className="mx-5 mb-4 card px-4 py-4">
        <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166] mb-4">
          Log Symptom
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Symptom name"
            value={form.symptomName}
            onChange={e => setForm({...form, symptomName: e.target.value})}
            className={inputClass}
            required
          />
          <input
            type="date"
            value={form.symptomDate}
            onChange={e => setForm({...form, symptomDate: e.target.value})}
            className={inputClass}
          />
          {/* Severity slider */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-sans text-xs text-[#3D5166]">Severity</span>
              <span className="font-mono text-xs text-[#00C896]">{severity}/10</span>
            </div>
            <input
              type="range"
              min={1} max={10}
              value={severity}
              onChange={e => setSeverity(Number(e.target.value))}
              className="w-full accent-[#00C896]"
            />
          </div>
          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={e => setForm({...form, notes: e.target.value})}
            className={`${inputClass} h-20 resize-none`}
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#00C896] text-[#080B0F] font-sans font-semibold text-sm py-3.5 rounded-xl press"
          >
            {saving ? 'Saving...' : 'Save Symptom'}
          </button>
        </form>
      </div>

      {/* History list */}
      <div className="space-y-3">
        {loading ? (
          <div className="mx-5 py-10 text-center">
            <p className="font-mono text-xs text-[#3D5166] animate-pulse">Loading...</p>
          </div>
        ) : symptoms.length === 0 ? (
          <div className="mx-5 py-12 text-center card text-sm text-[#3D5166]">
            No symptoms recorded yet.
          </div>
        ) : (
          symptoms.map(item => (
            <div key={item.id} className="mx-5 card overflow-hidden">
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-sans text-base font-semibold text-[#F0F4F8]">{item.name}</h3>
                  <span className={`font-mono text-[10px] tracking-wide px-2 py-0.5 rounded-full ${
                    item.severity >= 7 ? 'text-[#D95B5B] bg-[#D95B5B1A]' :
                    item.severity >= 4 ? 'text-[#00C896] bg-[#00C8961A]' : 'text-[#3D5166] bg-[#141B23]'
                  }`}>
                    {item.severity}/10
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#3D5166]">{item.dateLabel}</p>
                {item.notes && (
                  <p className="font-sans text-xs text-[#3D5166] mt-1.5 italic">{item.notes}</p>
                )}
              </div>
              <div className="border-t border-[#1C2530] px-4 py-2.5 flex gap-4">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1.5 text-[#D95B5B] text-xs font-sans press"
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
