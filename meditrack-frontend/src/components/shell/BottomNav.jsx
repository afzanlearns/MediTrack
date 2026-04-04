import React from 'react';
import { NavLink } from 'react-router-dom';
import { House, Pill, Activity, Stethoscope, Grid3X3 } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { label: 'Home', path: '/dashboard', icon: House },
  { label: 'Meds', path: '/medications', icon: Pill },
  { label: 'Vitals', path: '/vitals', icon: Activity },
  { label: 'Visits', path: '/doctor-visits', icon: Stethoscope },
  { label: 'More', path: '/more', icon: Grid3X3 },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 w-[100vw] lg:w-[480px] z-50 bg-[#111720] border-t border-[#1E2D3D] h-16 lg:left-1/2 lg:-translate-x-1/2">
      <div className="flex h-full w-full">
        {tabs.map(({ label, path, icon: Icon }) => (
          <NavLink 
            key={path} 
            to={path} 
            className="flex-1 flex flex-col items-center justify-center relative pt-2 pb-1 gap-0.5"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="tab-top-glow"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-[#00D4AA] shadow-[0_0_8px_#00D4AA]"
                    initial={false}
                  />
                )}
                <Icon 
                    size={20} 
                    strokeWidth={isActive ? 2 : 1.5} 
                    className={isActive ? 'text-[#00D4AA]' : 'text-[#3D5166]'}
                />
                <span className={`text-[10px] font-medium font-sans ${isActive ? 'text-[#00D4AA]' : 'text-[#3D5166]'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
