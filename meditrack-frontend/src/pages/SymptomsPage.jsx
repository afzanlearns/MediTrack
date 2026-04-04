import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/shell/PageHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Thermometer, Trash2 } from 'lucide-react';

const SymptomsPage = () => {
  const [severity, setSeverity] = useState(5);
  const [symptoms, setSymptoms] = useState([
    { name: 'Headache', date: '2023-04-01', severity: 4 },
    { name: 'Nausea', date: '2023-04-01', severity: 6 },
    { name: 'Fatigue', date: '2023-03-31', severity: 8 },
  ]);

  const severityColor = (s) => {
    if (s <= 3) return 'bg-pos-bg text-pos-text';
    if (s <= 6) return 'bg-warn-bg text-warn-text';
    return 'bg-neg-bg text-neg-text';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <PageHeader title="Symptoms" subtitle="Log and track patterns" />

      <div className="mx-5 mb-4 bg-surface border border-edge rounded-xl shadow-xs overflow-hidden">
        <h2 className="px-4 pt-4 pb-3 border-b border-edge text-sm font-bold text-ink">Log a Symptom</h2>
        <form className="px-4 py-4 flex flex-col gap-4">
          <input type="text" placeholder="Symptom name" className="bg-surface-2 border border-edge rounded-xl px-4 py-3.5 text-sm" />
          <input type="date" className="bg-surface-2 border border-edge rounded-xl px-4 py-3.5 text-sm" />
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-ink">Severity</label>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${severityColor(severity)}`}>
                {severity}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-[9px] text-ink-4 font-medium">
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
          </div>

          <textarea placeholder="Notes (optional)" rows="3" className="bg-surface-2 border border-edge rounded-xl px-4 py-3.5 text-sm"></textarea>
          <button type="submit" className="bg-brand text-white rounded-xl py-4 text-sm font-bold w-full">Log Symptom</button>
        </form>
      </div>

      <div className="mx-5 mb-4 bg-surface border border-edge rounded-xl shadow-xs">
        <div className="px-4 py-3.5 border-b border-edge flex justify-between">
          <h2 className="text-sm font-bold text-ink">Severity Trend</h2>
          <select className="text-xs text-brand border-0 bg-transparent cursor-pointer font-semibold">
            <option>Headache</option>
            <option>All Symptoms</option>
          </select>
        </div>
        <div className="px-2 py-4 h-[180px]">
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={symptoms.filter(s => s.name === 'Headache')}>
              <CartesianGrid strokeDasharray="4 4" stroke="#EEEEF5" />
              <XAxis dataKey="date" fontSize={10} fill="#ADADC4" tickLine={false} axisLine={false} />
              <YAxis domain={[0, 10]} fontSize={10} fill="#ADADC4" tickLine={false} axisLine={false} />
              <Line type="monotone" dataKey="severity" strokeWidth={2.5} stroke="#5B5BD6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mx-5 mb-24 bg-surface border border-edge rounded-xl shadow-xs overflow-hidden">
        <h2 className="px-4 py-3.5 border-b border-edge text-sm font-bold text-ink">History</h2>
        {symptoms.map((symptom, i) => (
          <div key={i} className="px-4 py-3.5 flex justify-between items-center border-b border-edge last:border-0">
            <div>
              <p className="text-sm font-semibold text-ink">{symptom.name}</p>
              <p className="text-xs text-ink-3">{symptom.date}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${severityColor(symptom.severity)}`}>
                {symptom.severity}/10
              </span>
              <button>
                <Trash2 size={14} className="text-ink-4 active:text-neg" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SymptomsPage;
