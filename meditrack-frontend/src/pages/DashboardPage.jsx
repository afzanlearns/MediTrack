import { useState, useEffect } from 'react'
import { getDashboardSummary } from '../api/dashboardApi'
import { getPendingReminders } from '../api/reminderApi'
import AdherenceRingChart from '../components/dashboard/AdherenceRingChart.jsx'
import TodaysDoseList from '../components/dashboard/TodaysDoseList.jsx'
import RecentSymptomsWidget from '../components/dashboard/RecentSymptomsWidget.jsx'
import ReminderBanner from '../components/shared/ReminderBanner.jsx'

export default function DashboardPage() {
  const [summary, setSummary]         = useState(null)
  const [reminders, setReminders]     = useState([])
  const [bannerDismissed, setBanner]  = useState(false)
  const [loading, setLoading]         = useState(true)

  const fetchAll = async () => {
    try {
      const [s, r] = await Promise.all([getDashboardSummary(), getPendingReminders()])
      setSummary(s)
      setReminders(r)
    } catch {
      // Toast handles errors
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  // When a dose status changes, refresh the dashboard summary
  const handleDoseStatusChange = () => fetchAll()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p className="text-sm animate-pulse">Loading dashboard…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Reminder banner */}
      {!bannerDismissed && reminders.length > 0 && (
        <ReminderBanner reminders={reminders} onDismiss={() => setBanner(true)} />
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon="💊" label="Active Medications" value={summary?.activeMedicationCount ?? 0} />
        <StatCard icon="📋" label="Today's Doses"      value={summary?.todaysDoses?.length ?? 0} />
        <StatCard
          icon="✅"
          label="Taken Today"
          value={summary?.todaysDoses?.filter(d => d.status === 'TAKEN').length ?? 0}
          color="text-green-600"
        />
        <StatCard
          icon="📈"
          label="Adherence (30d)"
          value={`${Math.round(summary?.adherencePercentage ?? 0)}%`}
          color={summary?.adherencePercentage >= 80 ? 'text-green-600' : 'text-amber-600'}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's doses — takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Today's Schedule</h2>
          <TodaysDoseList
            doses={summary?.todaysDoses ?? []}
            onStatusChange={handleDoseStatusChange}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Adherence ring */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col items-center">
            <h2 className="text-base font-semibold text-gray-800 mb-4 self-start">Adherence</h2>
            <AdherenceRingChart percentage={summary?.adherencePercentage ?? 0} />
          </div>

          {/* Recent symptoms */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Symptoms</h2>
            <RecentSymptomsWidget symptoms={summary?.recentSymptoms ?? []} />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color = 'text-gray-800' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
