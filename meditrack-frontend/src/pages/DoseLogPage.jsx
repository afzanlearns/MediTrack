import React, { useEffect, useMemo, useState } from 'react'
import { format, addDays, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Check, AlertCircle, FastForward } from 'lucide-react'
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

  const dateKey = format(currentDate, 'yyyy-MM-dd')

  const loadDoses = async () => {
    setLoading(true)
    try {
      const data = await getDosesForDate(dateKey)
      setDoses((data || []).map(mapDoseView))
    } catch {
      toast.error('Unable to load doses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDoses() }, [dateKey])

  const filtered = useMemo(() => {
    if (activeFilter === 'ALL') return doses
    return doses.filter(d => d.status === activeFilter)
  }, [doses, activeFilter])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const created = await generateDoses(dateKey)
      setDoses((created || []).map(mapDoseView))
      toast.success('Dose schedule generated.')
    } catch {
      toast.error('Could not generate doses')
    } finally {
      setGenerating(false)
    }
  }

  const handleStatus = async (dose, status) => {
    try {
      const updated = await updateDoseStatus(dose.id, status)
      setDoses(prev =>
        prev.map(item => item.id === dose.id ? mapDoseView(updated || { ...item, status }) : item)
      )
    } catch {
      toast.error('Unable to update dose status')
    }
  }

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-5 pt-14 pb-5 flex items-start justify-between">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-[#F0F4F8]">Dose Log</h1>
          <p className="font-sans text-sm text-[#3D5166] mt-0.5">Daily medication tracker</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="font-sans text-sm font-medium text-[#080B0F] bg-[#00C896] px-4 py-2 rounded-xl press"
        >
          {generating ? '...' : 'Generate'}
        </button>
      </div>

      {/* Date selector */}
      <div className="mx-5 mb-4 card flex items-center overflow-hidden">
        <button
          onClick={() => setCurrentDate(subDays(currentDate, 1))}
          className="flex h-12 w-12 items-center justify-center border-r border-[#1C2530] text-[#3D5166] press flex-shrink-0"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1 text-center font-sans text-sm font-semibold text-[#F0F4F8]">
          {format(currentDate, 'MMMM d, yyyy')}
        </div>
        <button
          onClick={() => setCurrentDate(addDays(currentDate, 1))}
          className="flex h-12 w-12 items-center justify-center border-l border-[#1C2530] text-[#3D5166] press flex-shrink-0"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Filter chips */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 font-sans text-xs font-semibold transition-colors press ${
              activeFilter === f
                ? 'border-[#00C89660] bg-[#00C8961A] text-[#00C896]'
                : 'border-[#1C2530] bg-[#141B23] text-[#3D5166]'
            }`}
          >
            {f === 'ALL' ? 'All' : f[0] + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Dose list */}
      <div className="space-y-3">
        {loading ? (
          <div className="mx-5 py-10 text-center">
            <p className="font-mono text-xs text-[#3D5166] animate-pulse">Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mx-5 py-12 text-center card text-sm text-[#3D5166]">
            No doses for this filter.
          </div>
        ) : (
          filtered.map(dose => (
            <div key={dose.id} className="mx-5 card overflow-hidden">
              <div className="px-4 py-3.5 flex items-center gap-3">
                <p className="w-14 font-mono text-xs text-[#3D5166] flex-shrink-0">{dose.timeLabel}</p>
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-semibold text-[#F0F4F8] truncate">{dose.medication}</p>
                  <p className="font-mono text-[11px] text-[#3D5166]">{dose.dosage}</p>
                </div>
                {dose.status !== 'PENDING' && (
                  <span className={`font-mono text-[10px] tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${
                    dose.status === 'TAKEN' ? 'text-[#00C896] bg-[#00C8961A]' :
                    dose.status === 'MISSED' ? 'text-[#D95B5B] bg-[#D95B5B1A]' :
                    'text-[#3D5166] bg-[#141B23]'
                  }`}>
                    {dose.status}
                  </span>
                )}
              </div>
              {dose.status === 'PENDING' && (
                <div className="border-t border-[#1C2530] px-4 py-2.5 flex gap-4">
                  <button
                    onClick={() => handleStatus(dose, 'TAKEN')}
                    className="flex items-center gap-1.5 text-[#00C896] text-xs font-sans press"
                  >
                    <Check size={11} /> Taken
                  </button>
                  <button
                    onClick={() => handleStatus(dose, 'MISSED')}
                    className="flex items-center gap-1.5 text-[#D95B5B] text-xs font-sans press"
                  >
                    <AlertCircle size={11} /> Missed
                  </button>
                  <button
                    onClick={() => handleStatus(dose, 'SKIPPED')}
                    className="flex items-center gap-1.5 text-[#3D5166] text-xs font-sans press"
                  >
                    <FastForward size={11} /> Skip
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
