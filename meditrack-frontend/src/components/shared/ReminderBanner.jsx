/**
 * Shows a dismissible banner at the top of the Dashboard
 * when there are doses due within 30 minutes.
 */
export default function ReminderBanner({ reminders, onDismiss }) {
  if (!reminders || reminders.length === 0) return null

  return (
    <div className="flex items-start gap-3 p-4 mb-5 bg-amber-50 border border-amber-200 rounded-xl">
      <span className="text-2xl">⏰</span>
      <div className="flex-1">
        <p className="font-semibold text-amber-800">
          {reminders.length} dose{reminders.length > 1 ? 's' : ''} due soon!
        </p>
        <ul className="mt-1 text-sm text-amber-700 space-y-0.5">
          {reminders.map(r => (
            <li key={r.id}>
              {r.medicationName} ({r.medicationDosage}) — due at{' '}
              {new Date(r.scheduledTime).toLocaleTimeString([], {
                hour: '2-digit', minute: '2-digit',
              })}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onDismiss}
        className="text-amber-500 hover:text-amber-700 text-xl leading-none"
      >
        ×
      </button>
    </div>
  )
}
