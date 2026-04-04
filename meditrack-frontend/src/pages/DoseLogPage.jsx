import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Loader2, Check } from 'lucide-react'
import { format, addDays, subDays } from 'date-fns'
import { getDosesForDate, generateDoses, updateDoseStatus } from '../api/doseApi'
import { mapDoseView } from '../utils/viewMappers'
import { toast } from '../utils/toast'

const FILTERS = ['ALL', 'PENDING', 'TAKEN', 'MISSED', 'SKIPPED']

const DoseLogPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [doses, setDoses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const dateKey = format(currentDate, 'yyyy-MM-dd')

  const loadDoses = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getDosesForDate(dateKey)
      setDoses((data || []).map(mapDoseView))
    } catch {
      setError('Unable to load doses for this date.')
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
    try {
      const created = await generateDoses(dateKey)
      setDoses((created || []).map(mapDoseView))
      toast.success('Dose schedule generated.')
    } catch {
      toast.danger('Could not generate doses.')
    }
  }

  const handleStatus = async (dose, status) => {
    try {
      const updated = await updateDoseStatus(dose.id, status)
      setDoses((prev) =>
        prev.map((item) => (item.id === dose.id ? mapDoseView(updated || { ...item, status }) : item)),
      )
    } catch {
      toast.danger('Unable to update dose status.')
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
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-[1.9rem] font-bold text-[#E8EDF2]">Dose Log</h1>
            <p className="text-sm text-[#6E879B]">Track daily intake</p>
          </div>
          <button
            onClick={handleGenerate}
            className="rounded-lg border border-[#00D4AA44] bg-[#00D4AA14] px-3 py-2 text-xs font-semibold text-[#00D4AA]"
          >
            Generate
          </button>
        </div>

        <div className="mb-4 flex items-center rounded-xl border border-[#1E2D3D] bg-[#111720]">
          <button
            onClick={() => setCurrentDate(subDays(currentDate, 1))}
            className="flex h-12 w-12 items-center justify-center border-r border-[#1E2D3D] text-[#6E879B]"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1 text-center text-sm font-semibold text-[#E8EDF2]">
            {format(currentDate, 'MMMM d, yyyy')}
          </div>
          <button
            onClick={() => setCurrentDate(addDays(currentDate, 1))}
            className="flex h-12 w-12 items-center justify-center border-l border-[#1E2D3D] text-[#6E879B]"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition ${
                activeFilter === filter
                  ? 'border-[#00D4AA66] bg-[#00D4AA1A] text-[#00D4AA]'
                  : 'border-[#1E2D3D] bg-[#111720] text-[#6E879B]'
              }`}
            >
              {filter === 'ALL' ? 'All' : `${filter[0]}${filter.slice(1).toLowerCase()}`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 px-4">
        {loading ? (
          <div className="flex items-center justify-center rounded-xl border border-[#1E2D3D] bg-[#111720] py-10">
            <Loader2 className="h-6 w-6 animate-spin text-[#00D4AA]" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-[#EF444433] bg-[#EF44440D] p-4">
            <p className="text-sm text-[#FCA5A5]">{error}</p>
            <button onClick={loadDoses} className="mt-2 text-xs font-semibold text-[#E8EDF2] underline">
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-[#1E2D3D] bg-[#111720] py-10 text-center">
            <p className="text-sm text-[#8BA3BA]">No doses for this filter.</p>
          </div>
        ) : (
          filtered.map((dose) => (
            <div key={dose.id} className="overflow-hidden rounded-xl border border-[#1E2D3D] bg-[#111720]">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <p className="w-16 text-xs font-mono text-[#6E879B]">{dose.timeLabel}</p>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#E8EDF2]">{dose.medication}</p>
                  <p className="text-xs text-[#4A6070]">{dose.dosage}</p>
                </div>
                {dose.status !== 'PENDING' && (
                  <span className="rounded-md bg-[#18222E] px-2.5 py-1 text-xs font-semibold text-[#8BA3BA]">
                    {dose.status}
                  </span>
                )}
              </div>

              {dose.status === 'PENDING' && (
                <div className="grid grid-cols-3 gap-2 border-t border-[#1E2D3D] px-3 pb-3 pt-2">
                  <button
                    onClick={() => handleStatus(dose, 'TAKEN')}
                    className="flex items-center justify-center gap-1 rounded-lg bg-[#00D4AA] py-2 text-xs font-semibold text-[#0A0E13]"
                  >
                    <Check size={13} /> Taken
                  </button>
                  <button
                    onClick={() => handleStatus(dose, 'MISSED')}
                    className="rounded-lg border border-[#EF444466] bg-[#EF44441A] py-2 text-xs font-semibold text-[#FCA5A5]"
                  >
                    Missed
                  </button>
                  <button
                    onClick={() => handleStatus(dose, 'SKIPPED')}
                    className="rounded-lg border border-[#2B3D50] bg-[#18222E] py-2 text-xs font-semibold text-[#8BA3BA]"
                  >
                    Skip
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}

export default DoseLogPage
