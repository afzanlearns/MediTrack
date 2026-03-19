import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

/**
 * Donut-style ring chart showing medication adherence %.
 * Green = taken, Light grey = remaining gap.
 */
export default function AdherenceRingChart({ percentage }) {
  const pct = Math.round(percentage ?? 0)
  const data = [
    { name: 'Taken',   value: pct },
    { name: 'Missed',  value: 100 - pct },
  ]

  const color = pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={64}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill={color} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Centre label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{pct}%</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-600">30-day adherence</p>
    </div>
  )
}
