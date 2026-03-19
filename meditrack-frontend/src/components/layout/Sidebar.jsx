import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/',           label: 'Dashboard',      icon: '🏠' },
  { to: '/medications',label: 'Medications',    icon: '💊' },
  { to: '/doses',      label: 'Dose Log',       icon: '📋' },
  { to: '/symptoms',   label: 'Symptoms',       icon: '📈' },
  { to: '/visits',     label: 'Doctor Visits',  icon: '🩺' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col py-6 px-3 shrink-0">
      {/* Brand */}
      <div className="mb-8 px-3">
        <span className="text-2xl font-bold text-blue-400">Medi</span>
        <span className="text-2xl font-bold text-white">Track</span>
        <p className="text-xs text-gray-400 mt-1">Health & Medication Tracker</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
