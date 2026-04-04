import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAuthModal } from '../contexts/AuthModalContext';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MedicationsPage = () => {
    const navigate = useNavigate();
    const { isGuest } = useAuth();
    const { openAuthModal } = useAuthModal();
    const [search, setSearch] = useState('');

    const medications = [
        { id: 1, name: 'Lisinopril', dosage: '10 mg', active: true, frequency: 'Daily', startDate: 'Oct 12, 2023' },
        { id: 2, name: 'Metformin', dosage: '500 mg', active: true, frequency: 'Twice daily', startDate: 'Nov 5, 2023' },
        { id: 3, name: 'Amoxicillin', dosage: '250 mg', active: false, frequency: 'Every 8 hours', startDate: 'Jan 10, 2024' },
    ];

    const filteredMeds = medications.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

    const handleAdd = () => {
        if (isGuest) openAuthModal();
        else navigate('/medications/new');
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
                    <h1 className="text-[#E8EDF2] text-[1.75rem] font-bold tracking-tight">Medications</h1>
                    <p className="text-[#4A6070] text-sm font-normal mt-0.5">2 active</p>
                </div>
                <button 
                    onClick={handleAdd}
                    className="w-9 h-9 bg-[#00D4AA] rounded-full flex items-center justify-center press glow-accent text-[#0A0E13]"
                >
                    <Plus size={20} strokeWidth={2.5}/>
                </button>
            </div>

            <div className="mx-4 mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search size={16} className="text-[#3D5166]" />
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search medications..."
                    className="w-full bg-[#111720] border border-[#1E2D3D] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#E8EDF2] placeholder:text-[#3D5166] outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/20 transition-colors"
                />
            </div>

            <div className="flex flex-col">
                {filteredMeds.map((med, index) => (
                    <motion.div
                        key={med.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                        <div className="mx-4 mb-3 bg-[#111720] border border-[#1E2D3D] rounded-xl overflow-hidden">
                            <div className="px-4 pt-4 pb-3 flex justify-between items-start">
                                <div className="flex flex-col gap-2 relative w-full">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            <div className={`w-2 h-2 rounded-full ${med.active ? 'bg-[#00D4AA] shadow-[0_0_8px_#00D4AA]' : 'bg-[#3D5166]'}`} />
                                            <h3 className="text-[#E8EDF2] font-semibold text-base ml-2 font-sans">{med.name}</h3>
                                        </div>
                                        <div className={`text-xs px-2.5 py-1 rounded-md font-medium ${med.active ? 'bg-[#00D4AA1A] text-[#00D4AA]' : 'bg-[#18222E] text-[#4A6070]'}`}>
                                            {med.active ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>
                                    <div className="flex gap-2.5 mt-0.5">
                                        <span className="font-mono text-[#00D4AA] text-xs bg-[#00D4AA0D] border border-[#00D4AA20] px-2 py-0.5 rounded-md">
                                            {med.dosage}
                                        </span>
                                        <span className="text-[#4A6070] text-xs bg-[#18222E] border border-[#1E2D3D] px-2 py-0.5 rounded-md font-sans">
                                            {med.frequency}
                                        </span>
                                    </div>
                                    <p className="text-[#4A6070] text-xs mt-1.5 font-sans">Started {med.startDate}</p>
                                </div>
                            </div>
                            <div className="border-t border-[#1E2D3D] px-4 py-2.5 flex gap-4">
                                <button className="text-[#00D4AA] text-xs flex items-center gap-1.5 font-medium press">
                                    <Pencil size={12} strokeWidth={2.5} /> Edit
                                </button>
                                <button className="text-[#EF4444] text-xs flex items-center gap-1.5 font-medium press">
                                    <Trash2 size={12} strokeWidth={2.5} /> Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredMeds.length === 0 && (
                <div className="text-center mt-12 mx-4">
                    <p className="text-[#4A6070] text-sm font-sans">No medications found.</p>
                </div>
            )}
        </motion.div>
    );
};

export default MedicationsPage;
