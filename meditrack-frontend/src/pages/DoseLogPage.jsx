import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/shell/PageHeader';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';

const DoseLogPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Pending', 'Taken', 'Missed', 'Skipped'];
  
  const doses = [
    { time: '08:00 AM', medication: 'Metformin', dosage: '500 mg', status: 'TAKEN' },
    { time: '12:30 PM', medication: 'Lisinopril', dosage: '10 mg', status: 'PENDING' },
    { time: '09:00 PM', medication: 'Atorvastatin', dosage: '20 mg', status: 'PENDING' },
  ];

  const DoseCard = ({ dose }) => {
    const statusStyles = {
      PENDING: { accent: 'bg-warn' },
      TAKEN: { accent: 'bg-pos' },
      MISSED: { accent: 'bg-neg' },
      SKIPPED: { accent: 'bg-ink-4' },
    };
    const { accent } = statusStyles[dose.status];

    return (
      <div className="bg-surface border border-edge rounded-xl shadow-xs overflow-hidden">
        <div className="flex items-center">
          <div className={`w-1.5 h-full self-stretch ${accent}`}></div>
          <div className="flex-1 flex items-center gap-3 px-4 py-3.5">
            <p className="text-xs font-mono text-ink-3 w-12 flex-shrink-0">{dose.time}</p>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{dose.medication}</p>
              <p className="text-xs text-ink-3">{dose.dosage}</p>
            </div>
          </div>
        </div>
        {dose.status === 'PENDING' && (
          <div className="px-4 py-3 grid grid-cols-3 gap-2 border-t border-edge">
            <button className="bg-pos text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5">
              <Check size={13} /> Mark Taken
            </button>
            <button className="bg-neg-bg border border-neg/20 text-neg-text rounded-xl py-2.5 text-xs font-bold">
              Missed
            </button>
            <button className="bg-surface-3 text-ink-2 rounded-xl py-2.5 text-xs font-bold">
              Skip
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <PageHeader
        title="Dose Log"
        subtitle="Track daily intake"
        right={<button className="text-brand text-sm font-bold">Generate</button>}
      />

      <div className="mx-5 mb-4 bg-surface border border-edge rounded-xl flex items-center h-12">
        <button onClick={() => setCurrentDate(subDays(currentDate, 1))} className="w-12 h-full flex items-center justify-center border-r border-edge text-ink-3 active:bg-surface-2 transition">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 text-center text-sm font-bold text-ink">
          {format(currentDate, 'MMMM d, yyyy')}
        </div>
        <button onClick={() => setCurrentDate(addDays(currentDate, 1))} className="w-12 h-full flex items-center justify-center border-l border-edge text-ink-3 active:bg-surface-2 transition">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mx-5 mb-4 flex gap-2 overflow-x-auto pb-1 scroll-snap-x">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`snap-start flex-shrink-0 text-xs font-bold rounded-full px-4 py-2 transition ${
              activeFilter === filter ? 'bg-brand text-white' : 'bg-surface border border-edge text-ink-3'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="px-5 flex flex-col gap-2 pb-24">
        {doses.map((dose, i) => <DoseCard key={i} dose={dose} />)}
      </div>
    </motion.div>
  );
};

export default DoseLogPage;
