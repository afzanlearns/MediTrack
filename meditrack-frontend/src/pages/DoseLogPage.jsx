import React, { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Loader2, Check, Clock, Calendar, Database, Activity, Circle, CheckCircle2, AlertCircle, FastForward } from 'lucide-react'
import { format, addDays, subDays } from 'date-fns'
import { getDosesForDate, generateDoses, updateDoseStatus } from '../api/doseApi'
import { mapDoseView } from '../utils/viewMappers'
import { toast } from '../utils/toast'

const FILTERS = ['ALL', 'PENDING', 'TAKEN', 'MISSED', 'SKIPPED']

export default function DoseLogPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [doses, setDoses] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  const dateKey = format(currentDate, 'yyyy-MM-dd')

  const loadDoses = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getDosesForDate(dateKey)
      setDoses((data || []).map(mapDoseView))
    } catch {
      setError('Unable to synchronize dose registry.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDoses()
  }, [dateKey])

  const filtered = useMemo(() => {
    if (activeFilter === 'ALL') return doses
    return doses.filter((dose) => dose.status === activeFilter)
  }, [doses, activeFilter])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const created = await generateDoses(dateKey)
      setDoses((created || []).map(mapDoseView))
      toast.success('Dose sequence generated')
    } catch {
      toast.error('Failed to initialize dose sequence')
    } finally {
      setGenerating(false)
    }
  }

  const handleStatus = async (dose, status) => {
    try {
      const updated = await updateDoseStatus(dose.id, status)
      setDoses((prev) =>
        prev.map((item) => (item.id === dose.id ? mapDoseView(updated || { ...item, status }) : item)),
      )
      toast.success(`Dose marked as ${status.toLowerCase()}`)
    } catch {
      toast.error('Unable to commit status change')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'TAKEN': return <CheckCircle2 size={12} className="text-[#00C896]" />
      case 'MISSED': return <AlertCircle size={12} className="text-[#D95B5B]" />
      case 'SKIPPED': return <FastForward size={12} className="text-[#3D5166]" />
      default: return <Circle size={12} className="text-[#1C2530]" />
    }
  }

  return (
    <div className="pb-16 max-w-4xl mx-auto px-5">
      {/* Header */}
      <div className="pt-14 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-sans text-3xl font-semibold text-[#F0F4F8]">Dose Log</h1>
          <p className="font-mono text-xs text-[#3D5166] mt-2 italic">Medication adherence tracking</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#00C896] border border-[#00C89640] rounded-lg press bg-[#00C89605]"
        >
          <Database size={12} />
          {generating ? 'Processing...' : 'Generate Sequence'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Date Selector */}
        <div className="card flex items-center p-1 overflow-hidden">
          <button
            onClick={() => setCurrentDate(subDays(currentDate, 1))}
            className="p-4 text-[#3D5166] hover:text-[#F0F4F8] transition-colors press"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1 text-center py-4 border-x border-[#1C2530] flex items-center justify-center gap-3">
             <Calendar size={14} className="text-[#3D5166]" />
             <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F0F4F8]">
               {format(currentDate, 'MMMM dd, yyyy')}
             </span>
          </div>
          <button
            onClick={() => setCurrentDate(addDays(currentDate, 1))}
            className="p-4 text-[#3D5166] hover:text-[#F0F4F8] transition-colors press"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-4 py-2 font-mono text-[10px] uppercase tracking-widest rounded-full transition-all border ${
                activeFilter === filter
                  ? 'border-[#00C89660] bg-[#00C89610] text-[#00C896]'
                  : 'border-[#1C2530] bg-transparent text-[#3D5166] hover:text-[#F0F4F8] hover:border-[#F0F4F820]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3 mb-24">
          {loading ? (
            <div className="card py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-[#3D5166]" />
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Accessing records...</p>
            </div>
          ) : error ? (
            <div className="card p-10 text-center border-[#D95B5B20]">
              <p className="font-mono text-[10px] text-[#D95B5B] uppercase tracking-widest mb-4">{error}</p>
              <button 
                onClick={loadDoses} 
                className="px-4 py-2 font-mono text-[9px] uppercase tracking-widest text-[#F0F4F8] border border-[#1C2530] rounded press"
              >
                Retry Request
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="card py-24 text-center border-dashed border-[#1C2530]">
              <Activity className="mx-auto text-[#1C2530] mb-4 opacity-20" size={32} strokeWidth={1} />
              <p className="font-mono text-[10px] text-[#3D5166] uppercase tracking-[0.2em]">Zero dose records found for selection</p>
            </div>
          ) : (
            filtered.map((dose) => (
              <div key={dose.id} className="card p-4 transition-all hover:border-[#F0F4F810]">
                <div className="flex items-center gap-5">
                  <div className="w-14 shrink-0 font-mono text-[11px] text-[#3D5166] tracking-tighter">
                    {dose.timeLabel}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-sans text-sm font-medium text-[#F0F4F8]">{dose.medication}</p>
                      {dose.status !== 'PENDING' && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#1C2530] bg-[#0E151C]">
                           {getStatusIcon(dose.status)}
                           <span className="font-mono text-[8px] text-[#3D5166] uppercase tracking-widest">{dose.status}</span>
                        </div>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-[#3D5166] mt-0.5 uppercase tracking-widest">{dose.dosage}</p>
                  </div>
                  
                  {dose.status === 'PENDING' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStatus(dose, 'TAKEN')}
                        className="p-2.5 rounded-lg bg-[#00C896] text-[#0A0E13] press hover:shadow-[0_0_15px_-3px_rgba(0,200,150,0.3)]"
                        title="Mark Taken"
                      >
                        <Check size={14} strokeWidth={3} />
                      </button>
                      <button
                        onClick={() => handleStatus(dose, 'MISSED')}
                        className="p-2.5 rounded-lg border border-[#D95B5B40] text-[#D95B5B] press hover:bg-[#D95B5B05]"
                        title="Mark Missed"
                      >
                        <AlertCircle size={14} />
                      </button>
                      <button
                        onClick={() => handleStatus(dose, 'SKIPPED')}
                        className="p-2.5 rounded-lg border border-[#1C2530] text-[#3D5166] press hover:text-[#F0F4F8]"
                        title="Mark Skipped"
                      >
                        <FastForward size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
