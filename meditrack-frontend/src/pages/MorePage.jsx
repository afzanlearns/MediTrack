import React from 'react';
import { motion } from 'framer-motion';
import { Settings, HelpCircle, FileText, Download, LogOut, ChevronRight, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const items = [
    { label: 'Profile Settings', icon: User, path: '/profile', section: 'Account' },
    { label: 'Notifications', icon: Settings, path: '/settings', section: 'Account' },
    { label: 'Data Export', icon: Download, path: '/export', section: 'Data' },
    { label: 'Terms of Service', icon: FileText, path: '/terms', section: 'Legal' },
    { label: 'Help & Support', icon: HelpCircle, path: '/support', section: 'Legal' },
];

const MorePage = () => {
    const { user, logout } = useAuth();

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pb-24 pt-12 px-4"
        >
             <h1 className="text-[#E8EDF2] text-[2.25rem] font-bold tracking-tight mb-8">More</h1>

            <div className="space-y-6">
                <div>
                     <p className="text-[#2A3D50] text-[10px] font-semibold tracking-[0.15em] uppercase mb-3 ml-2">Account</p>
                    <div className="bg-[#111720] border border-[#1E2D3D] rounded-xl overflow-hidden divide-y divide-[#1E2D3D]">
                        {items.filter(i => i.section === 'Account').map((item, index) => (
                             <motion.button 
                                key={index}
                                className="w-full flex items-center justify-between p-4 group press"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#18222E] flex items-center justify-center text-[#4A6070] group-hover:text-[#00D4AA] transition-colors">
                                        <item.icon size={18} strokeWidth={2}/>
                                    </div>
                                    <span className="text-[#E8EDF2] font-medium text-[15px]">{item.label}</span>
                                </div>
                                <ChevronRight size={18} className="text-[#3D5166] group-hover:text-[#00D4AA] transition-colors" />
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-[#2A3D50] text-[10px] font-semibold tracking-[0.15em] uppercase mb-3 ml-2">Data</p>
                    <div className="bg-[#111720] border border-[#1E2D3D] rounded-xl overflow-hidden divide-y divide-[#1E2D3D]">
                        {items.filter(i => i.section === 'Data').map((item, index) => (
                             <motion.button 
                                key={index}
                                className="w-full flex items-center justify-between p-4 group press"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#18222E] flex items-center justify-center text-[#4A6070] group-hover:text-[#00D4AA] transition-colors">
                                        <item.icon size={18} strokeWidth={2}/>
                                    </div>
                                    <span className="text-[#E8EDF2] font-medium text-[15px]">{item.label}</span>
                                </div>
                                <ChevronRight size={18} className="text-[#3D5166] group-hover:text-[#00D4AA] transition-colors" />
                            </motion.button>
                        ))}
                    </div>
                </div>
                
                 <div>
                    <p className="text-[#2A3D50] text-[10px] font-semibold tracking-[0.15em] uppercase mb-3 ml-2">Legal</p>
                    <div className="bg-[#111720] border border-[#1E2D3D] rounded-xl overflow-hidden divide-y divide-[#1E2D3D]">
                        {items.filter(i => i.section === 'Legal').map((item, index) => (
                             <motion.button 
                                key={index}
                                className="w-full flex items-center justify-between p-4 group press"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#18222E] flex items-center justify-center text-[#4A6070] group-hover:text-[#00D4AA] transition-colors">
                                        <item.icon size={18} strokeWidth={2}/>
                                    </div>
                                    <span className="text-[#E8EDF2] font-medium text-[15px]">{item.label}</span>
                                </div>
                                <ChevronRight size={18} className="text-[#3D5166] group-hover:text-[#00D4AA] transition-colors" />
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    <button 
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-xl font-medium press hover:bg-[#EF4444]/20 transition-colors"
                    >
                        <LogOut size={18} strokeWidth={2.5}/>
                        Sign Out
                    </button>
                    {user && <p className="text-center text-[#4A6070] text-xs mt-3">Logged in as {user?.email}</p>}
                </div>
            </div>
        </motion.div>
    );
};

export default MorePage;
