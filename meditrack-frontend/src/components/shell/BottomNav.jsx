import React from 'react'
import { NavLink } from 'react-router-dom'
import { House, Pill, Activity, Stethoscope, Grid3X3 } from 'lucide-react'
import { motion } from 'framer-motion'

const tabs = [
  { label: 'Home', path: '/dashboard', icon: House },
  { label: 'Meds', path: '/medications', icon: Pill },
  { label: 'Vitals', path: '/vitals', icon: Activity },
  { label: 'Visits', path: '/doctor-visits', icon: Stethoscope },
  { label: 'More', path: '/more', icon: Grid3X3 },
]

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1E2D3D] bg-[#111720]/95 backdrop-blur lg:left-1/2 lg:w-[480px] lg:-translate-x-1/2">
      <div className="mx-auto flex h-16 w-full max-w-[480px]">
        {tabs.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} className="relative flex flex-1 flex-col items-center justify-center gap-0.5 pt-2 pb-1">
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="tab-top-glow"
                    className="absolute top-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-[#00D4AA] shadow-[0_0_10px_#00D4AA]"
                    initial={false}
                  />
                )}
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.7}
                  className={isActive ? 'text-[#00D4AA]' : 'text-[#3D5166]'}
                />
                <span className={`text-[10px] font-medium ${isActive ? 'text-[#00D4AA]' : 'text-[#3D5166]'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
