import { useState, useEffect, useRef } from 'react'
import { getPendingReminders } from '../../api/reminderApi'

export default function TopBar({ title }) {
  const [reminders, setReminders]     = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Poll the reminders endpoint every 60 seconds
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const data = await getPendingReminders()
        setReminders(data)
      } catch {
        // Silently fail — bell just shows 0
      }
    }

    fetchReminders()
    const interval = setInterval(fetchReminders, 60_000)
    return () => clearInterval(interval)   // Cleanup on unmount
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      {/* Reminder Bell */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(v => !v)}
          className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600"
          aria-label="Upcoming dose reminders"
        >
          <span className="text-xl">🔔</span>
          {reminders.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs
                             rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {reminders.length}
            </span>
          )}
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200
                          rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700">Upcoming Doses</p>
              <p className="text-xs text-gray-500">Due within the next 30 minutes</p>
            </div>
            {reminders.length === 0 ? (
              <p className="px-4 py-4 text-sm text-gray-500 text-center">
                No doses due soon 🎉
              </p>
            ) : (
              <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                {reminders.map(r => (
                  <li key={r.id} className="px-4 py-3 flex items-start gap-3">
                    <span className="text-lg mt-0.5">💊</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{r.medicationName}</p>
                      <p className="text-xs text-gray-500">{r.medicationDosage}</p>
                      <p className="text-xs text-blue-600 font-medium mt-0.5">
                        Due at {new Date(r.scheduledTime).toLocaleTimeString([], {
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
