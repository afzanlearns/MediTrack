import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

const VitalsPage = () => {
  const [activeTab, setActiveTab] = useState('Blood Pressure');

  const data = [
    { name: 'Jan', bp: 120, sugar: 90, hr: 75 },
    { name: 'Feb', bp: 122, sugar: 95, hr: 78 },
    { name: 'Mar', bp: 118, sugar: 88, hr: 72 },
    { name: 'Apr', bp: 125, sugar: 105, hr: 80 },
    { name: 'May', bp: 123, sugar: 100, hr: 76 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="pb-6"
    >
      <div className="px-4 pt-12 pb-2 flex justify-between items-start">
          <div>
              <h1 className="text-[#E8EDF2] text-[1.75rem] font-bold tracking-tight">Vitals</h1>
              <p className="text-[#4A6070] text-sm font-normal mt-0.5">Health measurements</p>
          </div>
          <button className="bg-[#00D4AA] text-[#0A0E13] text-sm font-semibold px-4 py-2 rounded-lg press">
              + Log
          </button>
      </div>

      <div className="mx-4 mt-4 bg-[#111720] border border-[#1E2D3D] border-t-[#00D4AA33] border-t rounded-xl p-5 shadow-[inset_0_1px_0_#00D4AA20] flex items-stretch">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="font-mono text-[2.5rem] font-light text-[#E8EDF2] leading-none tracking-tight">120/80</p>
            <p className="font-mono text-[#4A6070] text-xs mt-1.5 tracking-widest uppercase">mmHg</p>
            <p className="text-[#00D4AA] text-xs font-medium mt-1">● Normal</p>
        </div>
        
        <div className="w-px bg-[#1E2D3D] self-center h-16 mx-2"></div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="font-mono text-[2.5rem] font-light text-[#E8EDF2] leading-none tracking-tight">98</p>
            <p className="font-mono text-[#4A6070] text-xs mt-1.5 tracking-widest uppercase">mg/dL</p>
            <p className="text-[#00D4AA] text-xs font-medium mt-1">● Normal</p>
        </div>

        <div className="w-px bg-[#1E2D3D] self-center h-16 mx-2"></div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="font-mono text-[2.5rem] font-light text-[#E8EDF2] leading-none tracking-tight">72</p>
            <p className="font-mono text-[#4A6070] text-xs mt-1.5 tracking-widest uppercase">bpm</p>
            <p className="text-[#00D4AA] text-xs font-medium mt-1">● Normal</p>
        </div>
      </div>

      <div className="mx-4 mt-3 bg-[#111720] border border-[#1E2D3D] rounded-xl p-4">
          <h2 className="text-[#E8EDF2] text-sm font-semibold mb-3 font-sans">Trend Overview</h2>
          <div className="bg-[#18222E] rounded-lg p-1 flex gap-1 mb-4">
              {['Blood Pressure', 'Blood Sugar', 'Heart Rate'].map(tab => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${activeTab === tab ? 'bg-[#00D4AA] text-[#0A0E13] font-semibold' : 'text-[#7A8FA6] font-sans'}`}
                 >
                    {tab}
                 </button>
              ))}
          </div>
          <div className="h-[200px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                 <defs>
                   <linearGradient id="vitalsGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.15"/>
                     <stop offset="100%" stopColor="#00D4AA" stopOpacity="0"/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1E2D3D" vertical={false}/>
                 <XAxis dataKey="name" stroke="#3D5166" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                 <YAxis stroke="#3D5166" fontSize={11} tickLine={false} axisLine={false} />
                 <Area 
                    type="monotone" 
                    dataKey={activeTab === 'Blood Pressure' ? 'bp' : activeTab === 'Blood Sugar' ? 'sugar' : 'hr'} 
                    stroke="#00D4AA" 
                    strokeWidth={2} 
                    fill="url(#vitalsGrad)" 
                    activeDot={{ r: 4, fill: '#0A0E13', stroke: '#00D4AA', strokeWidth: 2 }}
                 />
               </AreaChart>
            </ResponsiveContainer>
          </div>
      </div>

      <div className="mx-4 mt-3 mb-10 bg-[#111720] border border-[#1E2D3D] rounded-xl p-4">
         <h2 className="text-[#E8EDF2] text-sm font-semibold mb-3 font-sans">Log Today's Vitals</h2>
         <div className="flex flex-col gap-3">
             <div className="relative">
                 <input 
                    type="date" 
                    className="w-full bg-[#18222E] border border-[#1E2D3D] rounded-lg px-3 py-2.5 text-[#E8EDF2] text-sm outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/20 transition-colors" 
                 />
             </div>
             <div className="grid grid-cols-2 gap-3">
                <input 
                    type="number" 
                    placeholder="Systolic (120)" 
                    className="w-full bg-[#18222E] border border-[#1E2D3D] rounded-lg px-3 py-2.5 text-[#E8EDF2] text-sm placeholder:text-[#3D5166] outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/20 transition-colors" 
                />
                <input 
                    type="number" 
                    placeholder="Diastolic (80)" 
                    className="w-full bg-[#18222E] border border-[#1E2D3D] rounded-lg px-3 py-2.5 text-[#E8EDF2] text-sm placeholder:text-[#3D5166] outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/20 transition-colors" 
                />
                <input 
                    type="number" 
                    placeholder="Blood Sugar" 
                    className="w-full bg-[#18222E] border border-[#1E2D3D] rounded-lg px-3 py-2.5 text-[#E8EDF2] text-sm placeholder:text-[#3D5166] outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/20 transition-colors" 
                />
                <input 
                    type="number" 
                    placeholder="Heart Rate" 
                    className="w-full bg-[#18222E] border border-[#1E2D3D] rounded-lg px-3 py-2.5 text-[#E8EDF2] text-sm placeholder:text-[#3D5166] outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/20 transition-colors" 
                />
             </div>
             <textarea 
                placeholder="Notes (optional)" 
                className="w-full bg-[#18222E] border border-[#1E2D3D] rounded-lg px-3 py-2.5 text-[#E8EDF2] text-sm placeholder:text-[#3D5166] outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/20 transition-colors min-h-[80px] resize-none mt-1"
             />
             <button className="w-full bg-[#00D4AA] text-[#0A0E13] font-semibold py-3 rounded-lg mt-1 press">
                 Log Vitals
             </button>
         </div>
      </div>
    </motion.div>
  );
};

export default VitalsPage;
