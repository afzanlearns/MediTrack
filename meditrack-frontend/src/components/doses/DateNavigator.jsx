/**
 * Simple date navigator with prev/next arrows and a date picker input.
 */
export default function DateNavigator({ date, onChange }) {
  const shift = (days) => {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    onChange(d.toISOString().split('T')[0])
  }

  const isToday = date === new Date().toISOString().split('T')[0]

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => shift(-1)}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 font-bold"
      >
        ‹
      </button>

      <input
        type="date"
        value={date}
        onChange={e => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={() => shift(1)}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 font-bold"
      >
        ›
      </button>

      {!isToday && (
        <button
          onClick={() => onChange(new Date().toISOString().split('T')[0])}
          className="text-xs text-blue-600 hover:underline"
        >
          Today
        </button>
      )}
    </div>
  )
}
