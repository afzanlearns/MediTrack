import React, { useEffect, useMemo, useState, useRef } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
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

export default function VitalsPage() {
  const [activeTab, setActiveTab] = useState('Blood Pressure')
  const [vitals, setVitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const formRef = useRef(null)

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

  const trendData = useMemo(() => 
    vitals.map((item) => ({
      name: format(new Date(item.recordedDate), 'MMM d'),
      bp: item.systolic || 0,
      sugar: Number(item.bloodSugar || 0),
      hr: item.heartRate || 0,
    }))
  , [vitals])

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
      setVitals((prev) => [...prev, mapVitalsView(createdItem || payload)].sort((a, b) => new Date(a.recordedDate) - new Date(b.recordedDate)))
      setForm(emptyForm)
      toast.success('Vitals logged.')
    } catch {
      toast.danger('Failed to log vitals.')
    }
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const inputClass = "w-full bg-[#141B23] border border-[#1C2530] rounded-xl px-4 py-3 font-sans text-sm text-[#F0F4F8] placeholder:text-[#3D5166] focus:border-[#00C89650] transition-colors"

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="px-5 pt-14 pb-5 flex items-start justify-between">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-[#F0F4F8]">Vitals</h1>
          <p className="font-sans text-sm text-[#3D5166] mt-0.5">Health measurements</p>
        </div>
        <button 
          onClick={scrollToForm}
          className="font-sans text-sm font-medium text-[#080B0F] bg-[#00C896] px-4 py-2 rounded-xl press"
        >
          + Log
        </button>
      </div>

      {/* Big readings card */}
      <div className="mx-5 mb-4 card px-5 py-5 overflow-x-auto">
        <div className="flex items-stretch min-w-[320px]">
          {[
            { value: latest?.bloodPressureLabel || '—', unit: 'mmHg', status: 'Normal', label: 'Blood Pressure' },
            { value: latest?.bloodSugar ?? '—',     unit: 'mg/dL',status: 'Normal', label: 'Blood Sugar'    },
            { value: latest?.heartRate ?? '—',      unit: 'bpm',  status: 'Normal', label: 'Heart Rate'     },
          ].map(({ value, unit, status, label }, i) => (
            <React.Fragment key={label}>
              {i > 0 && <div className="w-px bg-[#1C2530] mx-4" />}
              <div className="flex-1 text-center">
                <p className="font-mono text-[2rem] font-light text-[#F0F4F8] leading-none">
                  {value}
                </p>
                <p className="font-mono text-[10px] text-[#3D5166] tracking-wider mt-2 uppercase">
                  {unit}
                </p>
                <p className="font-sans text-[11px] text-[#00C896] mt-1.5">{status}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Chart card */}
      <div className="mx-5 mb-4 card px-4 py-4">
        <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166] mb-4">
          Trend Overview
        </h2>
        
        <div className="flex gap-5 mb-4 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`font-sans text-sm whitespace-nowrap press ${
                activeTab === tab 
                  ? 'text-[#F0F4F8] font-medium border-b border-[#00C896] pb-1' 
                  : 'text-[#3D5166]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#00C896" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#00C896" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1C2530" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#3D5166', fontSize: 10, fontFamily: 'IBM Plex Mono' }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#3D5166', fontSize: 10, fontFamily: 'IBM Plex Mono' }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0E1318', border: '1px solid #1C2530', borderRadius: '8px' }}
                itemStyle={{ color: '#00C896', fontSize: '12px' }}
              />
              <Area 
                type="monotone"
                dataKey={currentDataKey}
                stroke="#00C896"
                strokeWidth={1.5}
                fill="url(#fill)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: '#00C896' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Log form */}
      <div ref={formRef} className="mx-5 mb-4 card px-4 py-4">
        <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166] mb-4">
          Log Today's Vitals
        </h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="date" 
            value={form.recordedDate}
            onChange={(e) => setForm(prev => ({ ...prev, recordedDate: e.target.value }))}
            className={inputClass} 
          />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <input 
              type="number"
              placeholder="Systolic (120)" 
              value={form.systolic}
              onChange={(e) => setForm(prev => ({ ...prev, systolic: e.target.value }))}
              className={inputClass} 
            />
            <input 
              type="number"
              placeholder="Diastolic (80)" 
              value={form.diastolic}
              onChange={(e) => setForm(prev => ({ ...prev, diastolic: e.target.value }))}
              className={inputClass} 
            />
            <input 
              type="number"
              placeholder="Blood Sugar" 
              value={form.bloodSugar}
              onChange={(e) => setForm(prev => ({ ...prev, bloodSugar: e.target.value }))}
              className={inputClass} 
            />
            <input 
              type="number"
              placeholder="Heart Rate" 
              value={form.heartRate}
              onChange={(e) => setForm(prev => ({ ...prev, heartRate: e.target.value }))}
              className={inputClass} 
            />
          </div>
          <textarea 
            placeholder="Notes (optional)" 
            value={form.notes}
            onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
            className={`${inputClass} mt-3 h-20 resize-none`} 
          />
          <button 
            type="submit"
            className="w-full mt-4 bg-[#00C896] text-[#080B0F] font-sans font-semibold text-sm py-3.5 rounded-xl press"
          >
            Save Reading
          </button>
        </form>
      </div>

      {/* History History */}
      <div className="mx-5 mb-10">
        <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166] mb-4">
          Measurement History
        </h2>
        {vitals.length === 0 ? (
          <div className="card py-8 text-center text-[#3D5166] text-xs">No records yet.</div>
        ) : (
          <div className="space-y-3">
            {[...vitals].reverse().map((item) => (
              <div key={item.id || item.recordedDate} className="card px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-[#3D5166]">{item.recordedDateLabel}</span>
                </div>
                <div className="flex gap-4">
                  {item.systolic && (
                    <div>
                      <p className="font-mono text-sm text-[#F0F4F8]">{item.bloodPressureLabel}</p>
                      <p className="font-mono text-[9px] text-[#3D5166] uppercase">BP</p>
                    </div>
                  )}
                  {item.bloodSugar && (
                    <div>
                      <p className="font-mono text-sm text-[#F0F4F8]">{item.bloodSugar} <span className="text-[10px]">mg/dL</span></p>
                      <p className="font-mono text-[9px] text-[#3D5166] uppercase">Sugar</p>
                    </div>
                  )}
                  {item.heartRate && (
                    <div>
                      <p className="font-mono text-sm text-[#F0F4F8]">{item.heartRate} <span className="text-[10px]">bpm</span></p>
                      <p className="font-mono text-[9px] text-[#3D5166] uppercase">HR</p>
                    </div>
                  )}
                </div>
                {item.notes && (
                  <p className="font-sans text-xs text-[#8A9BAE] italic mt-2 pt-2 border-t border-[#1C2530]">
                    {item.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

