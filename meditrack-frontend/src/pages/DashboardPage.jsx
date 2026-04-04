import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, X, ClipboardList, Pill, CheckCircle, Shield, Check, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useAuthModal } from '../contexts/AuthModalContext'
import { getDashboardSummary } from '../api/dashboardApi'
import { updateDoseStatus, generateDoses } from '../api/doseApi'
import { mapDoseView, mapSymptomView, mapVitalsView } from '../utils/viewMappers'
import { toast } from '../utils/toast'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, isGuest } = useAuth()
  const { openAuthModal } = useAuthModal()

  const [isGuestBannerVisible, setGuestBannerVisible] = useState(true)
  const [summary, setSummary] = useState(null)
  const [doses, setDoses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning,'
    if (hour < 18) return 'Good afternoon,'
    return 'Good evening,'
  }

  const loadDashboard = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await getDashboardSummary()
      setSummary(data)
      setDoses((data?.todaysDoses || []).map(mapDoseView))
    } catch {
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const stats = useMemo(() => {
    const takenToday = doses.filter((dose) => dose.status === 'TAKEN').length
    return [
      { value: summary?.activeMedicationCount ?? 0, label: 'Active Meds', color: '#00D4AA', icon: Pill },
      { value: doses.length, label: "Today's Doses", color: '#3B82F6', icon: ClipboardList },
      { value: takenToday, label: 'Taken Today', color: '#F59E0B', icon: CheckCircle },
    ]
  }, [summary, doses])

  const recentSymptoms = (summary?.recentSymptoms || []).map(mapSymptomView)
  const latestVitals = summary?.latestVitals ? mapVitalsView(summary.latestVitals) : null

  const handleDoseStatus = async (dose, status) => {
    try {
      const updated = await updateDoseStatus(dose.id, status)
      setDoses((prev) => prev.map((item) => (item.id === dose.id ? mapDoseView(updated || { ...item, status }) : item)))
    } catch {
      toast.danger('Unable to update dose status.')
    }
  }

  const handleGenerate = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const generated = await generateDoses(today)
      setDoses((generated || []).map(mapDoseView))
      toast.success('Today\'s doses generated.')
    } catch {
      toast.danger('Could not generate doses.')
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="px-4 pt-12 pb-6 bg-[#111720] border-b border-[#1E2D3D]">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[#7A8FA6] text-sm">{getGreeting()}</p>
            <h1 className="text-[#E8EDF2] text-[2.2rem] font-bold leading-none mt-1">
              {user?.fullName?.split(' ')[0] || 'there'}.
            </h1>
          </div>
          <button className="text-[#7A8FA6] mt-2" onClick={() => toast.info('Notifications are coming soon.')}>
            <Bell size={20} />
          </button>
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#1E2D3D] px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
          <span className="font-mono text-xs text-[#4A6070]">{format(new Date(), 'EEEE, MMM d')}</span>
        </div>
      </div>

      {isGuest && isGuestBannerVisible && (
        <div className="mx-4 mt-3 flex items-center justify-between rounded-xl border border-[#00D4AA33] bg-[#111720] px-4 py-3">
          <div className="flex items-center gap-2.5 text-sm text-[#8BA3BA]">
            <Shield size={15} className="text-[#00D4AA]" /> Using guest mode
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => openAuthModal()} className="rounded-lg bg-[#00D4AA] px-3 py-1.5 text-xs font-semibold text-[#0A0E13]">
              Sign in
            </button>
            <button onClick={() => setGuestBannerVisible(false)} className="text-[#4A6070]">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mx-4 mt-8 flex items-center justify-center rounded-xl border border-[#1E2D3D] bg-[#111720] py-10">
          <Loader2 className="h-6 w-6 animate-spin text-[#00D4AA]" />
        </div>
      ) : error ? (
        <div className="mx-4 mt-6 rounded-xl border border-[#EF444433] bg-[#EF44440D] p-4">
          <p className="text-sm text-[#FCA5A5]">{error}</p>
          <button onClick={loadDashboard} className="mt-2 text-xs font-semibold text-[#E8EDF2] underline">Retry</button>
        </div>
      ) : (
        <>
          <div className="mx-4 mt-4 grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-[#1E2D3D] bg-[#111720] p-4"
                style={{ borderTopColor: stat.color, borderTopWidth: 2 }}
              >
                <stat.icon size={15} className="mb-2" style={{ color: stat.color }} />
                <p className="font-mono text-[2rem] leading-none text-[#E8EDF2]">{stat.value}</p>
                <p className="mt-1.5 text-xs text-[#4A6070]">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between px-4">
              <h2 className="text-sm font-semibold text-[#E8EDF2]">Today's Schedule</h2>
              <button onClick={handleGenerate} className="text-xs font-semibold text-[#00D4AA]">Generate</button>
            </div>
            {doses.length === 0 ? (
              <div className="mx-4 rounded-xl border border-[#1E2D3D] bg-[#111720] py-7 text-center text-sm text-[#8BA3BA]">
                No doses generated for today.
              </div>
            ) : (
              doses.map((dose) => (
                <div key={dose.id} className="mx-4 mb-2 overflow-hidden rounded-xl border border-[#1E2D3D] bg-[#111720]">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-xs font-mono text-[#4A6070]">{dose.timeLabel}</p>
                      <p className="mt-0.5 text-sm font-semibold text-[#E8EDF2]">{dose.medication}</p>
                      <p className="text-xs text-[#4A6070]">{dose.dosage}</p>
                    </div>
                    {dose.status === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleDoseStatus(dose, 'TAKEN')} className="rounded-lg bg-[#00D4AA1A] px-2.5 py-1.5 text-xs font-semibold text-[#00D4AA]">Take</button>
                        <button onClick={() => handleDoseStatus(dose, 'SKIPPED')} className="rounded-lg bg-[#18222E] px-2.5 py-1.5 text-xs font-semibold text-[#8BA3BA]">Skip</button>
                      </div>
                    ) : dose.status === 'TAKEN' ? (
                      <span className="flex items-center gap-1 rounded-lg bg-[#00D4AA1A] px-2.5 py-1.5 text-xs font-semibold text-[#00D4AA]">
                        <Check size={11} /> Taken
                      </span>
                    ) : (
                      <span className="rounded-lg bg-[#18222E] px-2.5 py-1.5 text-xs font-semibold text-[#8BA3BA]">{dose.status}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between px-4">
              <h2 className="text-sm font-semibold text-[#E8EDF2]">Recent Symptoms</h2>
              <button onClick={() => navigate('/symptoms')} className="text-xs font-semibold text-[#00D4AA]">View all</button>
            </div>
            {recentSymptoms.length === 0 ? (
              <div className="mx-4 rounded-xl border border-[#1E2D3D] bg-[#111720] py-5 text-center text-sm text-[#8BA3BA]">
                No recent symptoms logged.
              </div>
            ) : (
              recentSymptoms.map((symptom) => (
                <div key={symptom.id || `${symptom.name}-${symptom.trendDate}`} className="mx-4 mb-2 flex items-center justify-between rounded-xl bg-[#111720] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#E8EDF2]">{symptom.name}</p>
                    <p className="text-xs text-[#3D5166]">{symptom.dateLabel}</p>
                  </div>
                  <span className="rounded-full border border-[#213549] bg-[#18222E] px-2 py-0.5 text-xs text-[#8BA3BA]">
                    {symptom.severity}/10
                  </span>
                </div>
              ))
            )}
          </div>

          {latestVitals && (
            <div className="mx-4 mt-6 mb-8 rounded-xl border border-[#1E2D3D] bg-[#111720] p-4">
              <h3 className="text-sm font-semibold text-[#E8EDF2]">Latest Vitals</h3>
              <p className="mt-1 text-xs text-[#4A6070]">{latestVitals.recordedDateLabel}</p>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-[#18222E] py-2">
                  <p className="font-mono text-sm text-[#E8EDF2]">{latestVitals.bloodPressureLabel}</p>
                  <p className="text-[10px] text-[#4A6070]">BP</p>
                </div>
                <div className="rounded-lg bg-[#18222E] py-2">
                  <p className="font-mono text-sm text-[#E8EDF2]">{latestVitals.bloodSugar ?? '—'}</p>
                  <p className="text-[10px] text-[#4A6070]">Sugar</p>
                </div>
                <div className="rounded-lg bg-[#18222E] py-2">
                  <p className="font-mono text-sm text-[#E8EDF2]">{latestVitals.heartRate ?? '—'}</p>
                  <p className="text-[10px] text-[#4A6070]">HR</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}

export default DashboardPage
