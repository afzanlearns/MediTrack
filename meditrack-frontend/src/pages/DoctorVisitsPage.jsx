import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAuthModal } from '../contexts/AuthModalContext';
import { Calendar, UserPlus, Clock, Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const DoctorVisitsPage = () => {
    const navigate = useNavigate();
    const { isGuest } = useAuth();
    const { openAuthModal } = useAuthModal();
    const [search, setSearch] = useState('');

    const visits = [
        // Simulated empty state initially for visual polish. 
        // Populate with data later as needed.
    ];

    const filteredVisits = visits.filter(v => v.doctorName.toLowerCase().includes(search.toLowerCase()));

    const handleAdd = () => {
        if (isGuest) openAuthModal();
        else navigate('/visits/new');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pb-6"
        >
            <div className="px-4 pt-12 pb-4 flex justify-between items-center">
                <div>
                     <h1 className="text-[#E8EDF2] text-[2.25rem] font-bold tracking-tight">Visits</h1>
                    <p className="text-[#4A6070] text-sm font-normal mt-0.5">Upcoming appointments</p>
                </div>
                <button 
                    onClick={handleAdd}
                    className="w-9 h-9 bg-[#00D4AA] rounded-full flex items-center justify-center press glow-accent text-[#0A0E13]"
                >
                    <UserPlus size={20} strokeWidth={2.5}/>
                </button>
            </div>

             <div className="mx-4 mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search size={16} className="text-[#3D5166]" />
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search doctors or specialties..."
                    className="w-full bg-[#111720] border border-[#1E2D3D] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#E8EDF2] placeholder:text-[#3D5166] outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/20 transition-colors"
                />
            </div>

            <div className="flex flex-col">
                 {filteredVisits.length === 0 ? (
                     <div className="flex flex-col items-center justify-center mt-12 mb-8 mx-4">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-[#00D4AA]/10 rounded-full blur-2xl animate-pulse"></div>
                            <div className="w-24 h-24 rounded-full bg-[#0F1A24] border border-[#1E2D3D] flex items-center justify-center relative z-10">
                                <Calendar size={40} className="text-[#3D5166]" strokeWidth={1} />
                            </div>
                        </div>
                        <h3 className="text-[#E8EDF2] text-xl font-bold mb-2">No Upcoming Visits</h3>
                        <p className="text-[#4A6070] text-sm text-center max-w-[240px] mb-8 font-sans">
                            Keep track of your medical appointments and attach relevant notes and logs.
                        </p>
                        <button 
                            onClick={handleAdd}
                            className="bg-[#111720] border border-[#1E2D3D] text-[#E8EDF2] px-6 py-3 rounded-lg text-sm font-medium press hover:border-[#00D4AA]/50 transition-colors"
                        >
                            Schedule a Visit
                        </button>
                    </div>
                ) : (
                    filteredVisits.map((visit, index) => (
                        <motion.div
                            key={visit.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                            <div className="mx-4 mb-3 bg-[#111720] border border-[#1E2D3D] rounded-xl p-4 flex gap-4 press" onClick={() => navigate(`/visits/${visit.id}`)}>
                                <div className="w-12 h-12 bg-[#0F1A24] border border-[#1E2D3D] rounded-full flex items-center justify-center shrink-0">
                                     <Calendar size={20} className="text-[#00D4AA]" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[#E8EDF2] font-semibold text-base">{visit.doctorName}</h3>
                                    <p className="text-[#4A6070] text-xs font-medium uppercase tracking-wider mt-0.5 mb-2">{visit.specialty}</p>

                                    <div className="flex flex-col gap-1.5 border-t border-[#1E2D3D] pt-3 mt-1">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-[#3D5166]" />
                                            <span className="text-[#E8EDF2] text-sm font-medium">{visit.date} <span className="text-[#4A6070] font-normal mx-1">•</span> {visit.time}</span>
                                        </div>
                                         <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-[#3D5166]" />
                                            <span className="text-[#4A6070] text-sm line-clamp-1">{visit.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default DoctorVisitsPage;
