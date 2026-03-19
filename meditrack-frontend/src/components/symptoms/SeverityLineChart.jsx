import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'

/**
 * Line chart showing symptom severity over time.
 * Expects an array of { symptomDate, severity } objects sorted by date.
 */
export default function SeverityLineChart({ symptoms }) {
  if (!symptoms || symptoms.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400">
        <div className="text-center">
          <p className="text-2xl mb-1">📈</p>
          <p className="text-sm">No data to display. Log some symptoms first.</p>
        </div>
      </div>
    )
  }

  const data = symptoms.map(s => ({
    date: s.symptomDate,
    severity: s.severity,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 16, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          tickFormatter={d => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric' })}
        />
        <YAxis
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
        />
        <Tooltip
          formatter={(val) => [`${val}/10`, 'Severity']}
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
        />
        <ReferenceLine y={7} stroke="#fca5a5" strokeDasharray="4 4" label={{ value: 'High', fontSize: 10, fill: '#ef4444' }} />
        <Line
          type="monotone"
          dataKey="severity"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4, fill: '#3b82f6' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
