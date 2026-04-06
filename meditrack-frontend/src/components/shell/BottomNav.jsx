import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Pill, Activity, Stethoscope, Grid2x2 } from 'lucide-react'

// 5 tabs. No labels on inactive. Active tab shows label + top line.
const tabs = [
  { path: '/dashboard',    icon: Home,       label: 'Home'   },
  { path: '/medications',  icon: Pill,       label: 'Meds'   },
  { path: '/vitals',       icon: Activity,   label: 'Vitals' },
  { path: '/doctor-visits',icon: Stethoscope,label: 'Visits' },
  { path: '/more',         icon: Grid2x2,    label: 'More'   },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-app mx-auto bg-[#0E1318] border-t border-[#1C2530] h-16 flex">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <Link key={path} to={path} className="flex-1 flex flex-col items-center justify-center relative press">
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] 
                                rounded-full bg-[#00C896] nav-glow" />
              )}
              <Icon 
                size={19} 
                strokeWidth={active ? 2 : 1.5}
                className={active ? 'text-[#F0F4F8]' : 'text-[#3D5166]'}
              />
              {active && (
                <span className="text-[10px] font-medium text-[#F0F4F8] mt-0.5 font-sans">
                  {label}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

