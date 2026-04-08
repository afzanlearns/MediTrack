import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pill, Calendar, CheckCircle, Check, Search, Activity, Heart, Clock, RotateCcw, Bell, ChevronDown, PlusCircle, Stethoscope, AlertCircle } from 'lucide-react'
import { format, differenceInMinutes, isPast } from 'date-fns'
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
  const [showTaken, setShowTaken] = useState(false)
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
      if (status === 'PENDING') toast.success('Dose reset back to pending.')
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

  // ─── Derived Logic ────────────────────────────────────────────────────────
  
  const { pendingDoses, takenDoses, todaysDoses, takenToday, progressPercent } = useMemo(() => {
    const p = doses.filter(d => d.status === 'PENDING' || d.status === 'due')
    const t = doses.filter(d => d.status === 'TAKEN' || d.status === 'taken')
    const total = doses.length
    const taken = t.length
    const percent = total > 0 ? Math.round((taken / total) * 100) : 0
    return { pendingDoses: p, takenDoses: t, todaysDoses: total, takenToday: taken, progressPercent: percent }
  }, [doses])

  const nextDoseInfo = useMemo(() => {
    if (pendingDoses.length === 0) return { label: '—', isNow: false }
    
    const next = pendingDoses[0]
    const scheduledDate = new Date(next.scheduledAt)
    if (isNaN(scheduledDate.getTime())) return { label: '—', isNow: false }

    const diffMin = differenceInMinutes(scheduledDate, new Date())
    
    if (diffMin <= 0) return { label: 'Now', isNow: true }
    if (diffMin < 60) return { label: `${diffMin}m`, isNow: false }
    return { label: `${Math.floor(diffMin / 60)}h`, isNow: false }
  }, [pendingDoses])

  const isPastDue = (doseTime) => {
    const d = new Date(doseTime)
    return !isNaN(d.getTime()) && isPast(d)
  }

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const recentSymptoms = (summary?.recentSymptoms || []).map(mapSymptomView)
  const latestVitals = summary?.latestVitals ? mapVitalsView(summary.latestVitals) : null

  // ─── Formatters ──────────────────────────────────────────────────────────
  
  const formatTimeAgo = (dateStr) => {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return 'recently'
    const diff = differenceInMinutes(new Date(), d)
    if (diff < 1) return 'Just now'
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return format(d, 'MMM d')
  }

  return (
    <div className="pb-12 bg-[#080B0F] min-h-screen">
      {/* 1. Header */}
      <div className="px-5 pt-12 pb-5 flex items-start justify-between">
        <div>
          <p className="font-sans text-xs font-medium text-[#3D5166] uppercase tracking-wider">
            {getGreeting()},
          </p>
          <h1 className="font-display text-[2.25rem] italic text-[#F0F4F8] leading-none mt-1">
            {user?.fullName?.split(' ')[0] || 'there'}.
          </h1>
          <div className="flex items-center gap-1.5 mt-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00C896]" />
            <span className="font-mono text-[11px] text-[#3D5166] tracking-wide">
              {format(new Date(), 'EEEE, MMM d')}
            </span>
          </div>
        </div>

        <button className="mt-1 w-10 h-10 rounded-xl bg-[#0E1318] border border-[#1C2530] 
                           flex items-center justify-center relative press">
          <Bell size={18} strokeWidth={1.5} className="text-[#8A9BAE]" />
          {pendingDoses.length > 0 && (
            <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#E8A838]" />
          )}
        </button>
      </div>

      {/* 2. Daily Progress Bar */}
      {todaysDoses > 0 && (
        <div className="mx-5 mb-5 card px-4 py-4 border-[#1C2530] bg-[#0E1318]">
          <div className="flex items-center justify-between mb-3">
            <p className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#3D5166]">
              Today's Adherence
            </p>
            <p className="font-mono text-[11px] text-[#8A9BAE]">
              <span className="text-[#00C896] font-bold">{takenToday}</span> / {todaysDoses} doses
            </p>
          </div>
          
          <div className="h-1.5 bg-[#141B23] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#00C896] rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,200,150,0.4)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="font-sans text-[11px] text-[#3D5166] mt-2.5 font-medium">
            {takenToday === 0 ? 'No doses taken yet today' : 
             takenToday === todaysDoses ? <span className="text-[#00C896]">Daily goal achieved! ✓</span> :
             `${todaysDoses - takenToday} dose${todaysDoses - takenToday > 1 ? 's' : ''} remaining`}
          </p>
        </div>
      )}

      {/* 3. Stat Row */}
      <div className="flex gap-2.5 px-5 mb-6">
        <div className="flex-1 card px-3 py-4 bg-[#0E1318] border-[#1C2530]">
          <Pill size={14} strokeWidth={1.5} className="text-[#3D5166] mb-3" />
          <p className="font-mono text-2xl font-light text-[#F0F4F8] leading-none">
            {summary?.activeMedicationCount ?? 0}
          </p>
          <p className="font-sans text-[10px] text-[#3D5166] mt-2 uppercase tracking-tighter">Active Meds</p>
        </div>

        <div className="flex-1 card px-3 py-4 bg-[#0E1318] border-[#1C2530]">
          <Clock size={14} strokeWidth={1.5} className="text-[#3D5166] mb-3" />
          <p className={`font-mono text-2xl font-light leading-none ${nextDoseInfo.isNow ? 'text-[#E8A838]' : 'text-[#F0F4F8]'}`}>
            {nextDoseInfo.label}
          </p>
          <p className="font-sans text-[10px] text-[#3D5166] mt-2 uppercase tracking-tighter">Next Dose</p>
        </div>

        <div className="flex-1 card px-3 py-4 bg-[#0E1318] border-[#1C2530]">
          <CheckCircle size={14} strokeWidth={1.5} className="text-[#3D5166] mb-3" />
          <p className="font-mono text-2xl font-light text-[#F0F4F8] leading-none">
            {takenToday}<span className="text-sm text-[#3D5166] ml-0.5">/{todaysDoses}</span>
          </p>
          <p className="font-sans text-[10px] text-[#3D5166] mt-2 uppercase tracking-tighter">Completed</p>
        </div>
      </div>

      {/* 4. Today's Schedule */}
      <div className="flex items-center justify-between px-5 mb-3">
        <h2 className="font-sans text-xs font-bold tracking-[0.12em] uppercase text-[#3D5166]">
          Daily Schedule
        </h2>
        <button onClick={handleGenerate} className="font-sans text-[11px] font-semibold text-[#00C896] hover:underline press">
          Re-sync
        </button>
      </div>

      {pendingDoses.length > 0 ? (
        pendingDoses.map((dose) => (
          <div key={dose.id} className="mx-5 mb-2.5 card overflow-hidden flex bg-[#0E1318] border-[#1C2530]">
            <div className={`w-[3px] flex-shrink-0 ${isPastDue(dose.scheduledAt) ? 'bg-[#D95B5B]' : 'bg-[#E8A838]'}`} />
            <div className="flex-1 px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[11px] text-[#3D5166]">{dose.timeLabel}</p>
                <p className="font-sans text-[15px] font-semibold text-[#F0F4F8] mt-0.5 truncate uppercase tracking-tight">
                  {dose.medication}
                </p>
                <p className="font-sans text-xs text-[#3D5166] mt-0.5">{dose.dosageLabel}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                  onClick={() => handleDoseStatus(dose, 'TAKEN')}
                  className="font-sans text-[11px] font-bold text-[#00C896] bg-[#00C89615] 
                             px-3.5 py-2 rounded-lg press border border-[#00C89630]"
                >
                  Take
                </button>
                <button 
                  onClick={() => handleDoseStatus(dose, 'SKIPPED')}
                  className="font-sans text-[11px] font-bold text-[#3D5166] bg-[#141B23] 
                             px-3.5 py-2 rounded-lg press"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        ))
      ) : todaysDoses > 0 && takenToday === todaysDoses ? (
        <div className="mx-5 mb-6 card px-4 py-6 bg-[#0E131810] border-dashed border-[#1C2530] text-center">
          <Check size={24} className="text-[#00C89660] mx-auto mb-2" />
          <p className="font-sans text-sm text-[#3D5166]">No more doses remaining for today.</p>
        </div>
      ) : (
        <div className="mx-5 mb-6 card px-4 py-8 text-center bg-[#0E1318] border-[#1C2530]">
          <p className="font-sans text-sm text-[#3D5166]">No schedule generated for today.</p>
          <button onClick={handleGenerate} className="font-sans text-xs font-bold text-[#00C896] mt-3 underline press tracking-wide">
            GENERATE SCHEDULE →
          </button>
        </div>
      )}

      {/* Taken doses collapsed */}
      {takenDoses.length > 0 && (
        <div className="mx-5 mb-6">
          <button 
            onClick={() => setShowTaken(!showTaken)}
            className="w-full card px-4 py-3.5 flex items-center justify-between press bg-[#0E131840] border-[#1C2530] hover:bg-[#0E131860]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00C896]" />
              <span className="font-sans text-[13px] font-medium text-[#8A9BAE]">
                {takenDoses.length} dose{takenDoses.length > 1 ? 's' : ''} taken
              </span>
            </div>
            <ChevronDown 
              size={14} 
              strokeWidth={2} 
              className={`text-[#3D5166] transition-transform duration-300 ${showTaken ? 'rotate-180' : ''}`}
            />
          </button>

          {showTaken && (
            <div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              {takenDoses.map(dose => (
                <div key={dose.id} className="card overflow-hidden flex bg-[#0E131820] border-[#1C2530] opacity-60 scale-[0.98] mx-2">
                  <div className="w-[2px] flex-shrink-0 bg-[#00C896]" />
                  <div className="flex-1 px-4 py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[10px] text-[#3D5166]">{dose.timeLabel}</p>
                      <p className="font-sans text-sm text-[#F0F4F8] mt-0.5">{dose.medication}</p>
                    </div>
                    <button 
                      onClick={() => handleDoseStatus(dose, 'PENDING')}
                      className="text-[#3D5166] hover:text-[#00C896] flex items-center gap-1 press"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Quick Actions grid */}
      <div className="px-5 mb-8">
        <p className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#3D5166] mb-3">
          Quick Actions
        </p>
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { icon: PlusCircle,   label: 'Add Med',    path: '/medications',   color: '#00C896' },
            { icon: Activity,     label: 'Log Vitals', path: '/vitals',        color: '#5B8FD9' },
            { icon: AlertCircle,  label: 'Symptom',    path: '/symptoms',      color: '#E8A838' },
            { icon: Stethoscope,  label: 'Visit',      path: '/doctor-visits', color: '#8A9BAE' },
          ].map(({ icon: Icon, label, path, color }) => (
            <Link 
              key={label} 
              to={path}
              className="card flex flex-col items-center justify-center py-4 gap-2 press bg-[#0E1318] border-[#1C2530] hover:border-[#F0F4F820]"
            >
              <Icon size={20} strokeWidth={1.5} style={{ color }} />
              <span className="font-sans text-[10px] font-bold text-[#3D5166] text-center uppercase tracking-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 6. Recent Symptoms */}
      <div className="flex items-center justify-between px-5 mb-3">
        <h2 className="font-sans text-xs font-bold tracking-[0.12em] uppercase text-[#3D5166]">
          Recent Activity
        </h2>
        <Link to="/symptoms" className="font-sans text-[11px] font-semibold text-[#00C896] hover:underline press">
          History
        </Link>
      </div>

      {recentSymptoms.length === 0 ? (
        <div className="mx-5 mb-8 card px-4 py-5 text-center bg-[#0E1318] border-[#1C2530] border-dashed">
          <p className="font-sans text-sm text-[#3D5166]">No symptoms logged recently.</p>
        </div>
      ) : (
        <div className="space-y-2 mb-8">
          {recentSymptoms.slice(0, 2).map((symptom) => (
            <div key={symptom.id} className="mx-5 card px-4 py-3.5 flex items-center justify-between bg-[#0E1318] border-[#1C2530]">
              <div className="min-w-0">
                <p className="font-sans text-[14px] font-semibold text-[#F0F4F8] truncate">{symptom.name}</p>
                <p className="font-mono text-[10px] text-[#3D5166] mt-0.5 uppercase tracking-widest">
                  {formatTimeAgo(symptom.symptomDate || symptom.timestamp)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  symptom.severity <= 3 ? 'text-[#00C896] bg-[#00C8961A]' :
                  symptom.severity <= 6 ? 'text-[#E8A838] bg-[#E8A8381A]' :
                                          'text-[#D95B5B] bg-[#D95B5B1A]'
                }`}>
                  {symptom.severity}/10
                </span>
                {symptom.notes && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3D516620]" title="Has notes" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7. Latest Vitals Widget */}
      <div className="flex items-center justify-between px-5 mb-3">
        <h2 className="font-sans text-xs font-bold tracking-[0.12em] uppercase text-[#3D5166]">
          Latest Vitals
        </h2>
        <Link to="/vitals" className="font-sans text-[11px] font-semibold text-[#00C896] hover:underline press">
          New Log
        </Link>
      </div>

      {latestVitals ? (
        <div className="mx-5 mb-10 card px-4 py-6 border-[#1C2530] bg-[#0E1318]">
          <div className="flex items-center justify-between mb-5">
             <div className="flex items-center gap-2">
               <Activity size={12} className="text-[#00C896]" />
               <span className="font-sans text-[10px] font-bold text-[#3D5166] uppercase tracking-[0.1em]">Pulse Check</span>
             </div>
             <span className="font-mono text-[10px] text-[#3D5166] uppercase">{latestVitals.recordedDateLabel}</span>
          </div>
          
          <div className="flex items-stretch">
            {[
              { value: latestVitals.bloodPressureLabel, unit: 'mmHg',  label: 'BP'    },
              { value: latestVitals.bloodSugar ?? '—',    unit: 'mg/dL', label: 'SUGAR' },
              { value: latestVitals.heartRate ?? '—',     unit: 'bpm',   label: 'HR'    },
            ].map(({ value, unit, label }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <div className="w-px bg-[#1C2530] mx-4 self-stretch" />}
                <div className="flex-1 text-center">
                  <p className="font-mono text-2xl font-light text-[#F0F4F8] leading-none tracking-tight">{value}</p>
                  <p className="font-mono text-[9px] text-[#3D5166] mt-2 font-bold tracking-[0.15em]">{label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
          
          {latestVitals.notes && (
            <div className="mt-5 pt-4 border-t border-[#1C2530] flex gap-3">
              <div className="w-1 h-1 rounded-full bg-[#00C896] mt-1.5 flex-shrink-0" />
              <p className="font-sans text-[11px] text-[#8A9BAE] italic leading-relaxed">
                {latestVitals.notes}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mx-5 mb-10 card px-4 py-8 text-center bg-[#0E1318] border-[#1C2530] border-dashed">
          <p className="font-sans text-sm text-[#3D5166] mb-3">No vitals logged yet</p>
          <Link to="/vitals" className="font-sans text-xs font-bold text-[#00C896] uppercase underline tracking-widest press">
            Record first reading
          </Link>
        </div>
      )}
    </div>
  )
}

