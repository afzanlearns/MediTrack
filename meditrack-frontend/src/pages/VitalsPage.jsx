import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { getVitals, logVitals } from '../api/vitalsApi'
import { mapVitalsView } from '../utils/viewMappers'
import { toast } from '../utils/toast'

const TABS = ['Blood Pressure', 'Blood Sugar', 'Heart Rate']

const emptyForm = {
  recordedDate: format(new Date(), 'yyyy-MM-dd'),
  systolic: '',
  diastolic: '',
  bloodSugar: '',
  heartRate: '',
  notes: '',
}

const VitalsPage = () => {
  const [activeTab, setActiveTab] = useState('Blood Pressure')
  const [vitals, setVitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)

  const loadVitals = async () => {
    try {
      const result = await getVitals()
      const raw = Array.isArray(result) ? result : result?.data || []
      setVitals(raw.map(mapVitalsView).sort((a, b) => new Date(a.recordedDate) - new Date(b.recordedDate)))
    } catch {
      toast.danger('Failed to load vitals data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVitals()
  }, [])

  const latest = vitals[vitals.length - 1]

  const trendData = useMemo(
    () =>
      vitals.map((item) => ({
        name: format(new Date(item.recordedDate), 'MMM'),
        bp: item.systolic || 0,
        sugar: Number(item.bloodSugar || 0),
        hr: item.heartRate || 0,
      })),
    [vitals],
  )

  const currentDataKey =
    activeTab === 'Blood Pressure' ? 'bp' : activeTab === 'Blood Sugar' ? 'sugar' : 'hr'

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.recordedDate) {
      toast.info('Please select a date.')
      return
    }

    const payload = {
      recordedDate: form.recordedDate,
      systolic: form.systolic ? Number(form.systolic) : null,
      diastolic: form.diastolic ? Number(form.diastolic) : null,
      bloodSugar: form.bloodSugar ? Number(form.bloodSugar) : null,
      heartRate: form.heartRate ? Number(form.heartRate) : null,
      notes: form.notes || null,
    }

    try {
      const created = await logVitals(payload)
      const createdItem = created?.data ? created.data : created
      setVitals((prev) => [...prev, mapVitalsView(createdItem || payload)])
      setForm(emptyForm)
      toast.success('Vitals logged.')
    } catch {
      toast.danger('Failed to log vitals.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="pb-6"
    >
      <div className="px-4 pt-12">
        <h1 className="text-[1.9rem] font-bold tracking-tight text-[#E8EDF2]">Vitals</h1>
        <p className="text-sm text-[#6E879B]">Health measurements</p>
      </div>

      {loading ? (
        <div className="mx-4 mt-8 flex items-center justify-center rounded-xl border border-[#1E2D3D] bg-[#111720] py-10">
          <Loader2 className="h-6 w-6 animate-spin text-[#00D4AA]" />
        </div>
      ) : (
        <>
          <div className="mx-4 mt-4 flex items-stretch rounded-xl border border-[#1E2D3D] bg-[#111720] p-5">
            <div className="flex-1 text-center">
              <p className="font-mono text-4xl font-light text-[#E8EDF2]">{latest?.bloodPressureLabel || '—'}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-[#4A6070]">mmHg</p>
            </div>
            <div className="mx-2 h-16 w-px bg-[#1E2D3D]" />
            <div className="flex-1 text-center">
              <p className="font-mono text-4xl font-light text-[#E8EDF2]">{latest?.bloodSugar ?? '—'}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-[#4A6070]">mg/dL</p>
            </div>
            <div className="mx-2 h-16 w-px bg-[#1E2D3D]" />
            <div className="flex-1 text-center">
              <p className="font-mono text-4xl font-light text-[#E8EDF2]">{latest?.heartRate ?? '—'}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-[#4A6070]">bpm</p>
            </div>
          </div>

          <div className="mx-4 mt-3 rounded-xl border border-[#1E2D3D] bg-[#111720] p-4">
            <h2 className="mb-3 text-sm font-semibold text-[#E8EDF2]">Trend Overview</h2>
            <div className="mb-4 flex gap-1 rounded-lg bg-[#18222E] p-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-md py-1.5 text-xs transition ${
                    activeTab === tab ? 'bg-[#00D4AA] font-semibold text-[#0A0E13]' : 'text-[#7A8FA6]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="vitalsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#00D4AA" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2D3D" vertical={false} />
                  <XAxis dataKey="name" stroke="#3D5166" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#3D5166" fontSize={11} tickLine={false} axisLine={false} />
                  <Area
                    type="monotone"
                    dataKey={currentDataKey}
                    stroke="#00D4AA"
                    strokeWidth={2}
                    fill="url(#vitalsGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mx-4 mb-10 mt-3 rounded-xl border border-[#1E2D3D] bg-[#111720] p-4">
            <h2 className="mb-3 text-sm font-semibold text-[#E8EDF2]">Log Today's Vitals</h2>
            <div className="space-y-3">
              <input
                type="date"
                value={form.recordedDate}
                onChange={(e) => setForm((prev) => ({ ...prev, recordedDate: e.target.value }))}
                className="w-full rounded-lg border border-[#1E2D3D] bg-[#18222E] px-3 py-2.5 text-sm text-[#E8EDF2] outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={form.systolic}
                  onChange={(e) => setForm((prev) => ({ ...prev, systolic: e.target.value }))}
                  placeholder="Systolic (120)"
                  className="rounded-lg border border-[#1E2D3D] bg-[#18222E] px-3 py-2.5 text-sm text-[#E8EDF2] placeholder:text-[#3D5166] outline-none"
                />
                <input
                  type="number"
                  value={form.diastolic}
                  onChange={(e) => setForm((prev) => ({ ...prev, diastolic: e.target.value }))}
                  placeholder="Diastolic (80)"
                  className="rounded-lg border border-[#1E2D3D] bg-[#18222E] px-3 py-2.5 text-sm text-[#E8EDF2] placeholder:text-[#3D5166] outline-none"
                />
                <input
                  type="number"
                  value={form.bloodSugar}
                  onChange={(e) => setForm((prev) => ({ ...prev, bloodSugar: e.target.value }))}
                  placeholder="Blood Sugar"
                  className="rounded-lg border border-[#1E2D3D] bg-[#18222E] px-3 py-2.5 text-sm text-[#E8EDF2] placeholder:text-[#3D5166] outline-none"
                />
                <input
                  type="number"
                  value={form.heartRate}
                  onChange={(e) => setForm((prev) => ({ ...prev, heartRate: e.target.value }))}
                  placeholder="Heart Rate"
                  className="rounded-lg border border-[#1E2D3D] bg-[#18222E] px-3 py-2.5 text-sm text-[#E8EDF2] placeholder:text-[#3D5166] outline-none"
                />
              </div>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Notes (optional)"
                className="min-h-[90px] w-full resize-none rounded-lg border border-[#1E2D3D] bg-[#18222E] px-3 py-2.5 text-sm text-[#E8EDF2] placeholder:text-[#3D5166] outline-none"
              />
              <button type="submit" className="w-full rounded-lg bg-[#00D4AA] py-3 text-sm font-semibold text-[#0A0E13]">
                Log Vitals
              </button>
            </div>
          </form>
        </>
      )}
    </motion.div>
  )
}

export default VitalsPage
