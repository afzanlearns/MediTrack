import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pill, Calendar, CheckCircle, Check, Search, Activity, Heart, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import { useAuthModal } from '../contexts/AuthModalContext'
import { getDashboardSummary } from '../api/dashboardApi'
import { updateDoseStatus, generateDoses } from '../api/doseApi'
import { mapDoseView, mapSymptomView, mapVitalsView } from '../utils/viewMappers'
import { toast } from '../utils/toast'
import { requestNotificationPermission, subscribeToPushNotifications } from '../services/pushService'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, isGuest } = useAuth()
  const { openAuthModal } = useAuthModal()

  const [isGuestBannerVisible, setGuestBannerVisible] = useState(true)
  const [summary, setSummary] = useState(null)
  const [doses, setDoses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSlowNetwork, setIsSlowNetwork] = useState(false)

  useEffect(() => {
    // Network Information API
    if ('connection' in navigator) {
      const connection = navigator.connection
      setIsSlowNetwork(connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g')
      const updateNetworkStatus = () => {
        setIsSlowNetwork(connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g')
      }
      connection.addEventListener('change', updateNetworkStatus)
      return () => connection.removeEventListener('change', updateNetworkStatus)
    }
  }, [])

  const loadDashboard = async () => {
    setLoading(true)
    try {
      const data = await getDashboardSummary()
      setSummary(data)
      const mappedDoses = (data?.todaysDoses || []).map(mapDoseView)
      setDoses(mappedDoses)
      
      // Update App Badge
      const pendingCount = mappedDoses.filter(d => d.status === 'PENDING' || d.status === 'due').length
      if ('setAppBadge' in navigator && pendingCount > 0) {
        navigator.setAppBadge(pendingCount)
      } else if ('clearAppBadge' in navigator) {
        navigator.clearAppBadge()
      }
    } catch {
      toast.danger('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
    if (!isGuest && user) {
      // Auto prompt push sub or do it quietly if already granted
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
         subscribeToPushNotifications().catch(console.error)
      }
    }
  }, [isGuest, user])

  const handleEnableNotifications = async () => {
    try {
      await requestNotificationPermission()
      await subscribeToPushNotifications()
      toast.success('Push notifications enabled')
    } catch (err) {
      toast.danger('Could not enable notifications')
    }
  }

  const handleDoseStatus = async (dose, status) => {
    let customNotes = null
    if (status === 'TAKEN' || status === 'taken') {
      const resp = window.prompt(`Notes for ${dose.medication}? (Optional)`)
      if (resp !== null) customNotes = resp
    }

    try {
      const updated = await updateDoseStatus(dose.id, status, customNotes)
      setDoses((prev) => prev.map((item) => (item.id === dose.id ? mapDoseView(updated || { ...item, status, notes: customNotes }) : item)))
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

  const stats = useMemo(() => {
    const takenToday = doses.filter((dose) => dose.status === 'TAKEN' || dose.status === 'taken').length
    return [
      { value: summary?.activeMedicationCount ?? 0, label: 'Active Meds',   icon: Pill      },
      { value: doses.length,                       label: "Today's Doses", icon: Calendar  },
      { value: takenToday,                        label: 'Taken Today',   icon: CheckCircle},
    ]
  }, [summary, doses])

  const recentSymptoms = (summary?.recentSymptoms || []).map(mapSymptomView)
  const latestVitals = summary?.latestVitals ? mapVitalsView(summary.latestVitals) : null

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning,'
    if (hour < 18) return 'Good afternoon,'
    return 'Good evening,'
  }

  return (
    <div className="pb-8">
      {/* Header section */}
      <div className="px-5 pt-14 pb-6">
        <p className="font-sans text-sm text-[#3D5166]">{getGreeting()}</p>
        <h1 className="font-display text-[2.5rem] italic text-[#F0F4F8] leading-none mt-0.5">
          {user?.fullName?.split(' ')[0] || 'there'}.
        </h1>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00C896]" />
          <span className="font-mono text-xs text-[#3D5166] tracking-wide">
            {format(new Date(), 'EEEE, MMM d')}
          </span>
        </div>
      </div>

      {/* Guest banner */}
      {isGuest && isGuestBannerVisible && (
        <div className="mx-5 mb-5 flex items-center justify-between 
                        bg-[#0E1318] border border-[#1C2530] rounded-xl px-4 py-3">
          <span className="font-sans text-sm text-[#8A9BAE]">Guest mode</span>
          <button 
            onClick={() => openAuthModal()}
            className="font-sans text-xs font-semibold text-[#080B0F] 
                             bg-[#00C896] px-3 py-1.5 rounded-lg press"
          >
            Sign in
          </button>
        </div>
      )}

      {/* Push Notification Banner */}
      {!isGuest && typeof Notification !== 'undefined' && Notification.permission === 'default' && (
        <div className="mx-5 mb-5 flex items-center justify-between 
                        bg-[#0E1318] border border-[#1C2530] rounded-xl px-4 py-3">
          <span className="font-sans text-xs text-[#8A9BAE]">Enable reminders</span>
          <button 
            onClick={handleEnableNotifications}
            className="font-sans text-xs font-semibold text-[#080B0F] 
                             bg-[#00C896] px-3 py-1.5 rounded-lg press"
          >
            Enable
          </button>
        </div>
      )}

      {/* Stat row */}
      <div className="flex gap-3 px-5 mb-6">
        {stats.map(({ value, label, icon: Icon }) => (
          <div key={label} className="flex-1 card px-3 py-4">
            <Icon size={14} strokeWidth={1.5} className="text-[#3D5166] mb-3" />
            <p className="font-mono text-[1.75rem] font-light text-[#F0F4F8] leading-none">
              {value}
            </p>
            <p className="font-sans text-[11px] text-[#3D5166] mt-1.5 leading-tight">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="flex items-center justify-between px-5 mb-3">
        <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166]">
          Today's Schedule
        </h2>
        <button onClick={handleGenerate} className="font-sans text-xs text-[#00C896] press">Generate</button>
      </div>

      {doses.length === 0 ? (
        <div className="mx-5 card px-4 py-8 text-center">
          <p className="font-sans text-sm text-[#3D5166]">No doses generated for today.</p>
          <button onClick={handleGenerate} className="font-sans text-xs text-[#00C896] mt-2 press">Generate schedule →</button>
        </div>
      ) : (
        doses.map((dose) => {
          const status = dose.status.toLowerCase()
          return (
            <div key={dose.id} className="mx-5 mb-2 card overflow-hidden flex">
              <div className={`w-[3px] flex-shrink-0 ${
                status === 'taken'  ? 'bg-[#00C896]' :
                status === 'due'    ? 'bg-[#E8A838]' :
                status === 'missed' ? 'bg-[#D95B5B]' : 'bg-[#1C2530]'
              }`} />
              <div className="flex-1 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[11px] text-[#3D5166]">{dose.timeLabel}</p>
                  <p className="font-sans text-sm font-medium text-[#F0F4F8] mt-0.5">{dose.medication}</p>
                  <p className="font-sans text-xs text-[#3D5166]">{dose.dosageLabel}</p>
                  
                  {/* Notes display */}
                  {(dose.medicationNotes || dose.notes) && (
                    <div className="mt-2 space-y-1">
                      {dose.medicationNotes && (
                        <p className="font-sans text-[10px] text-[#8A9BAE] italic leading-tight">
                          {dose.medicationNotes}
                        </p>
                      )}
                      {dose.notes && (
                        <p className="font-sans text-[10px] text-[#00C896] italic leading-tight">
                          Note: {dose.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {status === 'taken' ? (
                    <span className="font-mono text-[11px] text-[#00C896] flex items-center gap-1">
                      <Check size={10} /> taken
                    </span>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleDoseStatus(dose, 'TAKEN')}
                        className="font-sans text-xs text-[#00C896] bg-[#00C8961A] 
                                         px-3 py-1.5 rounded-lg press"
                      >
                        Take
                      </button>
                      <button 
                        onClick={() => handleDoseStatus(dose, 'SKIPPED')}
                        className="font-sans text-xs text-[#3D5166] bg-[#141B23] 
                                         px-3 py-1.5 rounded-lg press"
                      >
                        Skip
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })
      )}

      {/* Recent Symptoms */}
      {recentSymptoms.length > 0 && (
        <>
          <div className="flex items-center justify-between px-5 mb-3 mt-8">
            <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166]">
              Recent Symptoms
            </h2>
            <button onClick={() => navigate('/symptoms')} className="font-sans text-xs text-[#00C896] press">View all</button>
          </div>
          {recentSymptoms.map((symptom) => (
            <div key={symptom.id || `${symptom.name}-${symptom.trendDate}`} className="mx-5 mb-2 card px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-sans text-sm font-medium text-[#F0F4F8]">{symptom.name}</p>
                <p className="font-mono text-[11px] text-[#3D5166] mt-0.5">{symptom.dateLabel || format(new Date(symptom.timestamp), 'h:mm a')}</p>
                {symptom.notes && (
                  <p className="font-sans text-[10px] text-[#8A9BAE] italic mt-1">{symptom.notes}</p>
                )}
              </div>
              <span className={`font-mono text-xs px-2 py-0.5 rounded-md ${
                symptom.severity <= 3 ? 'text-[#00C896] bg-[#00C8961A]' :
                symptom.severity <= 6 ? 'text-[#E8A838] bg-[#E8A8381A]' :
                                        'text-[#D95B5B] bg-[#D95B5B1A]'
              }`}>
                {symptom.severity}/10
              </span>
            </div>
          ))}
        </>
      )}

      {/* Latest Vitals */}
      {latestVitals && (
        <div className="mx-5 mb-4 mt-8 card px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166]">
              Latest Vitals
            </h2>
            <span className="font-mono text-[11px] text-[#3D5166]">{latestVitals.recordedDateLabel}</span>
          </div>
          {isSlowNetwork ? (
            <p className="font-mono text-xs text-[#E8A838] mt-2">Charts hidden to save data on slow network.</p>
          ) : (
            <div className="flex">
              {[
                { value: latestVitals.bloodPressureLabel, unit: 'mmHg',  label: 'BP'    },
                { value: latestVitals.bloodSugar ?? '—',    unit: 'mg/dL', label: 'Sugar' },
                { value: latestVitals.heartRate ?? '—',     unit: 'bpm',   label: 'HR'    },
              ].map(({ value, unit, label }, i) => (
                <React.Fragment key={label}>
                  {i > 0 && <div className="w-px bg-[#1C2530] mx-4 self-stretch" />}
                  <div className="flex-1 text-center">
                    <p className="font-mono text-xl font-light text-[#F0F4F8]">{value}</p>
                    <p className="font-mono text-[10px] text-[#3D5166] mt-1">{unit}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
          {latestVitals.notes && (
            <p className="font-sans text-[10px] text-[#8A9BAE] italic mt-3 pt-3 border-t border-[#1C2530]">
              {latestVitals.notes}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

