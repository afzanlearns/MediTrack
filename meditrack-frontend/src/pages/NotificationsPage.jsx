import React, { useEffect, useState } from 'react'
import { Bell, BellOff, Clock, CheckCircle } from 'lucide-react'
import { toast } from '../utils/toast'

const STORAGE_KEY = 'meditrack_notifications'

const defaultPrefs = {
  enabled: false,
  medications: true,
  medicationTime: '08:00',
  appointments: true,
  appointmentHoursBefore: '24',
  symptoms: false,
  symptomTime: '20:00',
  dailySummary: false,
  summaryTime: '07:00',
}

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 press flex-shrink-0 ${
        checked ? 'bg-[#00C896]' : 'bg-[#1C2530]'
      }`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState(defaultPrefs)
  const [permissionStatus, setPermissionStatus] = useState('default')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { setPrefs({ ...defaultPrefs, ...JSON.parse(saved) }) } catch {}
    }
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission)
    }
  }, [])

  const set = (key, value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }))
  }

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.info('This browser does not support notifications.')
      return
    }
    const result = await Notification.requestPermission()
    setPermissionStatus(result)
    if (result === 'granted') {
      set('enabled', true)
      toast.success('Notifications enabled!')
      new Notification('MediTrack', {
        body: 'Reminders are now active.',
        icon: '/favicon.ico',
      })
    } else {
      toast.info('Notification permission denied.')
    }
  }

  const handleMasterToggle = async (val) => {
    if (val && permissionStatus !== 'granted') {
      await requestPermission()
      return
    }
    set('enabled', val)
  }

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    toast.success('Notification preferences saved.')
  }

  const inputClass = "bg-[#141B23] border border-[#1C2530] rounded-xl px-3 py-2 font-mono text-xs text-[#F0F4F8] outline-none focus:border-[#00C89650] transition-colors"

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="px-5 pt-14 pb-5">
        <h1 className="font-sans text-2xl font-semibold text-[#F0F4F8]">Notifications</h1>
        <p className="font-sans text-sm text-[#3D5166] mt-0.5">Reminder preferences</p>
      </div>

      {/* Permission status banner */}
      {permissionStatus === 'denied' && (
        <div className="mx-5 mb-4 rounded-xl border border-[#D95B5B30] bg-[#D95B5B08] px-4 py-3 flex items-center gap-3">
          <BellOff size={16} className="text-[#D95B5B] flex-shrink-0" />
          <p className="font-sans text-xs text-[#D95B5B]">
            Notifications blocked in browser settings. Enable them in your browser to use reminders.
          </p>
        </div>
      )}

      {/* Master toggle */}
      <div className="mx-5 mb-4 card px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell size={18} strokeWidth={1.5} className="text-[#3D5166]" />
          <div>
            <p className="font-sans text-sm font-semibold text-[#F0F4F8]">Enable Reminders</p>
            <p className="font-sans text-xs text-[#3D5166] mt-0.5">Allow browser notifications</p>
          </div>
        </div>
        <Toggle checked={prefs.enabled} onChange={handleMasterToggle} />
      </div>

      {/* Reminder settings — only shown when enabled */}
      {prefs.enabled && (
        <>
          {/* Medication reminders */}
          <div className="mx-5 mb-4 card overflow-hidden divide-y divide-[#1C2530]">
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166]">
                  Medication Reminders
                </p>
                <p className="font-sans text-sm font-medium text-[#F0F4F8] mt-1">Dose time alerts</p>
              </div>
              <Toggle checked={prefs.medications} onChange={(v) => set('medications', v)} />
            </div>
            {prefs.medications && (
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#3D5166]">
                  <Clock size={13} />
                  <span className="font-sans text-xs">Daily reminder at</span>
                </div>
                <input
                  type="time"
                  value={prefs.medicationTime}
                  onChange={(e) => set('medicationTime', e.target.value)}
                  className={inputClass}
                />
              </div>
            )}
          </div>

          {/* Appointment reminders */}
          <div className="mx-5 mb-4 card overflow-hidden divide-y divide-[#1C2530]">
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166]">
                  Appointment Reminders
                </p>
                <p className="font-sans text-sm font-medium text-[#F0F4F8] mt-1">Upcoming visit alerts</p>
              </div>
              <Toggle checked={prefs.appointments} onChange={(v) => set('appointments', v)} />
            </div>
            {prefs.appointments && (
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#3D5166]">
                  <Clock size={13} />
                  <span className="font-sans text-xs">Remind me</span>
                </div>
                <select
                  value={prefs.appointmentHoursBefore}
                  onChange={(e) => set('appointmentHoursBefore', e.target.value)}
                  className={inputClass}
                >
                  <option value="1">1 hour before</option>
                  <option value="3">3 hours before</option>
                  <option value="12">12 hours before</option>
                  <option value="24">1 day before</option>
                  <option value="48">2 days before</option>
                </select>
              </div>
            )}
          </div>

          {/* Symptom logging */}
          <div className="mx-5 mb-4 card overflow-hidden divide-y divide-[#1C2530]">
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166]">
                  Symptom Log Reminder
                </p>
                <p className="font-sans text-sm font-medium text-[#F0F4F8] mt-1">Daily check-in prompt</p>
              </div>
              <Toggle checked={prefs.symptoms} onChange={(v) => set('symptoms', v)} />
            </div>
            {prefs.symptoms && (
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#3D5166]">
                  <Clock size={13} />
                  <span className="font-sans text-xs">Remind me at</span>
                </div>
                <input
                  type="time"
                  value={prefs.symptomTime}
                  onChange={(e) => set('symptomTime', e.target.value)}
                  className={inputClass}
                />
              </div>
            )}
          </div>

          {/* Daily summary */}
          <div className="mx-5 mb-4 card overflow-hidden divide-y divide-[#1C2530]">
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166]">
                  Daily Summary
                </p>
                <p className="font-sans text-sm font-medium text-[#F0F4F8] mt-1">Morning health digest</p>
              </div>
              <Toggle checked={prefs.dailySummary} onChange={(v) => set('dailySummary', v)} />
            </div>
            {prefs.dailySummary && (
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#3D5166]">
                  <Clock size={13} />
                  <span className="font-sans text-xs">Send at</span>
                </div>
                <input
                  type="time"
                  value={prefs.summaryTime}
                  onChange={(e) => set('summaryTime', e.target.value)}
                  className={inputClass}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Save button */}
      <div className="mx-5 mt-2">
        <button
          onClick={handleSave}
          className="w-full bg-[#00C896] text-[#080B0F] font-sans font-semibold text-sm py-3.5 rounded-xl press flex items-center justify-center gap-2"
        >
          <CheckCircle size={15} />
          Save Preferences
        </button>
      </div>
    </div>
  )
}
