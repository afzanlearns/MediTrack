import React, { useEffect, useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { Trash2, Loader2, Activity, Calendar, History, Save } from 'lucide-react'
import { format } from 'date-fns'
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

  const loadSymptoms = async () => {
    try {
      const data = await getSymptoms()
      const mapped = (data || []).map(mapSymptomView)
      mapped.sort((a, b) => new Date(b.trendDate) - new Date(a.trendDate))
      setSymptoms(mapped)
    } catch (err) {
      toast.error('Unable to synchronize symptom records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSymptoms()
  }, [])

  const chartData = useMemo(() => {
    return [...symptoms]
      .reverse()
      .map((item) => ({ 
        date: format(new Date(item.trendDate), 'MMM d'), 
        severity: item.severity 
      }))
  }, [symptoms])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.symptomName.trim()) {
      toast.info('Enter symptom identification')
      return
    }

    setSaving(true)
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
      toast.success('Symptom event logged')
    } catch (err) {
      toast.error('Failed to log event data')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteSymptom(id)
      setSymptoms((prev) => prev.filter((item) => item.id !== id))
      toast.success('Record purged')
    } catch (err) {
      toast.error('Purge operation failed')
    }
  }

  return (
    <div className="pb-16 max-w-4xl mx-auto px-5">
      {/* Header */}
      <div className="pt-14 pb-10">
        <h1 className="font-sans text-3xl font-semibold text-[#F0F4F8]">Symptoms</h1>
        <p className="font-mono text-xs text-[#3D5166] mt-2 italic">Pattern recognition & severity tracking</p>
      </div>

      <div className="space-y-10">
        {/* Entry Log Form */}
        <section>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#3D5166]">Event Identification</p>
          <div className="card divide-y divide-[#1C2530]">
            <form onSubmit={handleSubmit}>
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Symptom</label>
                <input 
                  type="text"
                  value={form.symptomName}
                  onChange={e => setForm({...form, symptomName: e.target.value})}
                  className="md:col-span-3 bg-transparent font-sans text-sm text-[#F0F4F8] outline-none"
                  placeholder="Subjective identification (e.g. Headache)"
                />
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Timestamp</label>
                <div className="md:col-span-3 flex items-center gap-4">
                  <input 
                    type="date"
                    value={form.symptomDate}
                    onChange={e => setForm({...form, symptomDate: e.target.value})}
                    className="bg-transparent font-sans text-sm text-[#F0F4F8] outline-none"
                  />
                </div>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Intensity</label>
                <div className="md:col-span-3 flex items-center gap-6">
                  <input 
                    type="range"
                    min="1"
                    max="10"
                    value={severity}
                    onChange={e => setSeverity(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="font-mono text-xs text-[#00C896] min-w-[3rem] text-right">
                    LVL {severity}/10
                  </span>
                </div>
              </div>

              <div className="p-4">
                <label className="block font-mono text-[9px] uppercase tracking-widest text-[#3D5166] mb-3">Narrative Notes</label>
                <textarea 
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                  className="w-full bg-transparent font-sans text-sm text-[#F0F4F8] outline-none min-h-[80px] resize-none"
                  placeholder="Clinical context or triggers..."
                />
              </div>

              <div className="p-4 border-t border-[#1C2530] flex justify-end">
                <button 
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#00C896] px-6 py-2 border border-[#00C89640] rounded-lg press bg-[#00C89605]"
                >
                  <Save size={12} />
                  {saving ? 'Synchronizing...' : 'Log Event Data'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Severity Trend Visualization */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Activity size={12} className="text-[#3D5166]" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#3D5166]">Linear Severity Index</p>
          </div>
          <div className="card h-48 p-6">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1C2530" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: '#3D5166', fontFamily: 'IBM Plex Mono' }} 
                    dy={10}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: '#3D5166', fontFamily: 'IBM Plex Mono' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0E13', border: '1px solid #1C2530', padding: '10px' }}
                    labelStyle={{ color: '#00C896', fontSize: '10px', marginBottom: '4px' }}
                    itemStyle={{ color: '#F0F4F8', fontSize: '12px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="severity" 
                    stroke="#00C896" 
                    strokeWidth={2} 
                    dot={{ fill: '#00C896', r: 3 }}
                    activeDot={{ r: 5, stroke: '#080B0F', strokeWidth: 2 }}
                    connectNulls
                  />
               </LineChart>
             </ResponsiveContainer>
          </div>
        </section>

        {/* Historical Records */}
        <section className="mb-24">
          <div className="flex items-center gap-2 mb-4">
            <History size={12} className="text-[#3D5166]" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#3D5166]">Persistent History</p>
          </div>
          {loading ? (
             <div className="flex justify-center py-10">
                <p className="font-mono text-[10px] text-[#3D5166] animate-pulse uppercase tracking-[0.2em]">Syncing events...</p>
             </div>
          ) : symptoms.length === 0 ? (
             <div className="card py-12 text-center">
                <p className="font-mono text-[10px] text-[#3D5166] uppercase tracking-widest tracking-[0.2em]">Zero events documented</p>
             </div>
          ) : (
            <div className="card divide-y divide-[#1C2530]">
              {symptoms.map(item => (
                <div key={item.id} className="p-4 flex items-center justify-between group">
                   <div className="flex-1 pr-6">
                      <div className="flex items-center gap-3">
                         <span className="font-sans text-sm font-medium text-[#F0F4F8]">{item.name}</span>
                         <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-[#1C2530] text-[#3D5166] uppercase">
                            LVL {item.severity}
                         </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 opacity-60">
                         <Calendar className="text-[#1C2530]" size={10} />
                         <span className="font-mono text-[10px] text-[#3D5166] tracking-widest">{item.dateLabel}</span>
                      </div>
                      {item.notes && (
                         <p className="mt-2 font-mono text-[10px] text-[#3D5166] leading-relaxed italic">{item.notes}</p>
                      )}
                   </div>
                   <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-[#3D5166] hover:text-[#D95B5B] transition-colors press"
                   >
                     <Trash2 size={14} />
                   </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
