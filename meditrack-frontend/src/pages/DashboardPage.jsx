import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAuthModal } from '../contexts/AuthModalContext';
import { Bell, Info, X, Calendar, Zap, ClipboardList, Pill, Activity, CheckCircle, Shield, Check } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  };

  const GreetingHeader = () => (
    <div className="px-4 pt-12 pb-6 bg-[#111720]">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[#7A8FA6] text-sm font-normal tracking-wide">{getGreeting()}</p>
          <h1 className="text-[#E8EDF2] text-[2.25rem] font-bold tracking-tight leading-none mt-0.5">{user?.fullName?.split(' ')[0] || 'there'}.</h1>
        </div>
        <button className="text-[#7A8FA6] active:text-[#00D4AA] transition-colors mt-2">
          <Bell size={20} />
        </button>
      </div>
      <div className="mt-3">
        <div className="inline-flex items-center gap-1.5 bg-[#111720] border border-[#1E2D3D] px-3 py-1 rounded-full mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
          <span className="font-mono text-[#4A6070] text-xs tracking-wide">{format(new Date(), 'EEEE, MMM d')}</span>
        </div>
      </div>
    </div>
  );

  const GuestBanner = () => {
    const { openAuthModal } = useAuthModal();
    const [isVisible, setIsVisible] = useState(true);

    if (!isGuest || !isVisible) return null;

    return (
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-4 mb-4 bg-[#111720] rounded-xl overflow-hidden flex border border-[#00D4AA20]">
        <div className="w-[3px] bg-[#00D4AA] flex-shrink-0" />
        <div className="flex-1 flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
            <Shield size={15} strokeWidth={1.75} className="text-[#00D4AA]" />
            <span className="text-[#7A8FA6] text-sm">Using guest mode</span>
            </div>
            <div className="flex items-center gap-2">
                <button
                onClick={() => openAuthModal()}
                className="bg-[#00D4AA] text-[#0A0E13] text-xs font-semibold px-3 py-1.5 rounded-lg press"
                >
                Sign in
                </button>
                <button onClick={() => setIsVisible(false)} className="text-[#3D5166] press p-1">
                <X size={14} />
                </button>
            </div>
        </div>
      </motion.div>
    );
  };

  const StatCard = ({ icon: Icon, value, label, accent }) => (
    <div className={`flex-1 bg-[#111720] rounded-xl p-4 border border-[#1E2D3D] border-t-2 border-t-[${accent}] overflow-hidden`}>
      <Icon size={15} strokeWidth={1.75} className={`text-[${accent}] mb-2`} />
      <p className="font-mono text-[2rem] font-medium text-[#E8EDF2] leading-none mb-1">{value}</p>
      <p className="text-[#4A6070] text-xs font-sans mt-1.5">{label}</p>
    </div>
  );

  const DoseCard = ({ dose }) => {
    const statusStyles = {
      PENDING: { bg: 'bg-[#F59E0B]' },
      TAKEN: { bg: 'bg-[#00D4AA]' },
      MISSED: { bg: 'bg-[#EF4444]' },
      SKIPPED: { bg: 'bg-[#1E2D3D]' },
    };
    const { bg } = statusStyles[dose.status] || { bg: 'bg-[#1E2D3D]' };

    return (
      <div className="mx-4 mb-2 bg-[#111720] rounded-xl overflow-hidden flex">
        <div className={`w-[3px] flex-shrink-0 ${bg}`}></div>
        <div className="flex-1 px-4 py-3">
             <p className="font-mono text-[#4A6070] text-xs">{dose.time}</p>
             <p className="font-sans font-semibold text-[#E8EDF2] text-sm mt-0.5">{dose.medication}</p>
             <p className="font-sans text-[#4A6070] text-xs">{dose.dosage}</p>
        </div>
        <div className="flex items-center gap-2 pr-3">
          {dose.status === 'PENDING' ? (
            <>
              <button className="bg-[#00D4AA15] text-[#00D4AA] text-xs px-2.5 py-1.5 rounded-lg font-medium active:scale-95 transition-transform">Take</button>
              <button className="bg-[#18222E] text-[#4A6070] text-xs px-2.5 py-1.5 rounded-lg font-medium active:scale-95 transition-transform">Skip</button>
            </>
          ) : dose.status === 'TAKEN' ? (
             <span className="flex items-center gap-1 bg-[#00D4AA15] text-[#00D4AA] text-xs px-2.5 py-1.5 rounded-lg font-medium">
               <Check size={11} strokeWidth={2}/> Taken
             </span>
          ) : (
            <div className={`text-xs font-medium rounded-lg px-2.5 py-1.5 ${dose.status === 'MISSED' ? 'bg-[#EF44441A] text-[#EF4444]' : 'bg-[#18222E] text-[#7A8FA6]'}`}>
              {dose.status}
            </div>
          )}
        </div>
      </div>
    );
  };

  const severityColor = (s) => {
    if (s <= 3) return 'bg-[#00D4AA0D] text-[#00D4AA] border-[#00D4AA20]'
    if (s <= 6) return 'bg-[#F59E0B0D] text-[#F59E0B] border-[#F59E0B20]'
    return 'bg-[#EF44440D] text-[#EF4444] border-[#EF444420]'
  }

  const stats = [
    { icon: Pill, value: 3, label: 'Active Meds', accent: '#00D4AA' },
    { icon: ClipboardList, value: 8, label: "Today's Doses", accent: '#3B82F6' },
    { icon: CheckCircle, value: 2, label: 'Taken Today', accent: '#F59E0B' },
  ];

  const doses = [
    { time: '08:00 AM', medication: 'Metformin', dosage: '500 mg', status: 'TAKEN' },
    { time: '12:30 PM', medication: 'Lisinopril', dosage: '10 mg', status: 'PENDING' },
    { time: '09:00 PM', medication: 'Atorvastatin', dosage: '20 mg', status: 'PENDING' },
  ];
  
  const symptoms = [
      { name: 'Headache', date: '2 hours ago', severity: 4 },
      { name: 'Nausea', date: 'Yesterday', severity: 2 },
  ];

  return (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <GreetingHeader />
      <GuestBanner />

      <div className="flex mx-4 gap-3 mb-6 mt-4">
        {/* Render stats manually for pure tailwind classes to hit the colors properly without dynamic template literals struggling in post-CSS */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0 }} className="flex-1 bg-[#111720] rounded-xl p-4 border border-[#1E2D3D] border-t-2 border-t-[#00D4AA] overflow-hidden">
            <Pill size={15} strokeWidth={1.75} className="text-[#00D4AA] mb-2" />
            <p className="font-mono text-[2rem] font-medium text-[#E8EDF2] leading-none mb-1">3</p>
            <p className="text-[#4A6070] text-xs mt-1.5 font-sans">Active Meds</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.05 }} className="flex-1 bg-[#111720] rounded-xl p-4 border border-[#1E2D3D] border-t-2 border-t-[#3B82F6] overflow-hidden">
            <ClipboardList size={15} strokeWidth={1.75} className="text-[#3B82F6] mb-2" />
            <p className="font-mono text-[2rem] font-medium text-[#E8EDF2] leading-none mb-1">8</p>
            <p className="text-[#4A6070] text-xs mt-1.5 font-sans">Today's Doses</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }} className="flex-1 bg-[#111720] rounded-xl p-4 border border-[#1E2D3D] border-t-2 border-t-[#F59E0B] overflow-hidden">
            <CheckCircle size={15} strokeWidth={1.75} className="text-[#F59E0B] mb-2" />
            <p className="font-mono text-[2rem] font-medium text-[#E8EDF2] leading-none mb-1">2</p>
            <p className="text-[#4A6070] text-xs mt-1.5 font-sans">Taken Today</p>
        </motion.div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center px-4 mb-3">
          <h2 className="text-[#E8EDF2] text-sm font-semibold tracking-wide">Today's Schedule</h2>
          <button className="text-[#00D4AA] text-xs font-medium cursor-pointer press">
            Generate
          </button>
        </div>
        {doses.length > 0 ? (
          doses.map((dose, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.05 }}>
                  <DoseCard dose={dose} />
              </motion.div>
          ))
        ) : (
          <div className="mx-4 bg-[#111720] border border-[#1E2D3D] rounded-xl py-8 text-center">
            <ClipboardList size={28} className="text-[#3D5166] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#E8EDF2] mb-1">No doses today</p>
            <p className="text-xs text-[#7A8FA6]">Add a medication to begin</p>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center px-4 mb-3">
            <h2 className="text-[#E8EDF2] text-sm font-semibold tracking-wide">Recent Symptoms</h2>
            <span className="text-[#00D4AA] text-xs font-medium cursor-pointer press" onClick={() => navigate('/symptoms')}>View all</span>
        </div>
        {symptoms.length > 0 ? symptoms.map((symptom, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.05 }}>
                <div className="mx-4 mb-2 bg-[#111720] rounded-xl px-4 py-3 flex justify-between items-center">
                    <div>
                        <p className="text-[#E8EDF2] text-sm font-medium font-sans">{symptom.name}</p>
                        <p className="text-[#3D5166] text-xs font-sans mt-0.5">{symptom.date}</p>
                    </div>
                    <span className={`font-mono text-xs px-2 py-0.5 rounded-full border ${severityColor(symptom.severity)}`}>
                        {symptom.severity}/10
                    </span>
                </div>
            </motion.div>
        )) : (
             <div className="mx-4 bg-[#111720] rounded-xl px-4 py-5 text-center">
                <p className="text-sm text-[#7A8FA6]">No symptoms logged recently</p>
                <span className="text-xs text-[#00D4AA] cursor-pointer mt-2 inline-block press" onClick={() => navigate('/symptoms')}>Log a symptom</span>
             </div>
        )}
      </div>

    </motion.div>
  );
};

export default DashboardPage;
