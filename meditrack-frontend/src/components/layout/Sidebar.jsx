import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Pill, ClipboardList, Activity,
  Thermometer, FileText, Calendar, Stethoscope,
  User, LogOut, Lock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';

const navItems = [
  { label: 'Dashboard',     path: '/',              icon: LayoutDashboard, requiresAuth: false },
  { label: 'Medications',   path: '/medications',   icon: Pill,            requiresAuth: false },
  { label: 'Dose Log',      path: '/dose-log',      icon: ClipboardList,   requiresAuth: false },
  { label: 'Vitals',        path: '/vitals',        icon: Activity,        requiresAuth: false },
  { label: 'Symptoms',      path: '/symptoms',      icon: Thermometer,     requiresAuth: false },
  { label: 'Prescriptions', path: '/prescriptions', icon: FileText,        requiresAuth: true },
  { label: 'Appointments',  path: '/appointments',  icon: Calendar,        requiresAuth: true },
  { label: 'Doctor Visits', path: '/doctor-visits', icon: Stethoscope,     requiresAuth: false },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isGuest, logout, isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleNavClick = (e, item) => {
    if (item.requiresAuth && !isAuthenticated) {
      e.preventDefault();
      openAuthModal(item.label);
    }
    onClose?.();
  };

  return (
    <aside
      className={`w-[236px] h-screen bg-sidebar border-r border-border flex flex-col fixed left-0 top-0 z-50 transition-transform duration-200 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="px-6 py-6 border-b border-border">
        <h1 className="text-navy font-semibold text-xl tracking-tight">MediTrack</h1>
        <p className="text-sidebar-text text-xs font-medium uppercase tracking-[0.12em] mt-1">Personal Health Record</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={(e) => handleNavClick(e, item)}
            className={({ isActive }) => `
              flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border-l-2
              ${isActive 
                ? 'bg-sidebar-active text-sidebar-text-active border-l-accent' 
                : 'text-sidebar-text border-l-transparent hover:bg-sidebar-hover hover:text-text-primary'}
              ${item.requiresAuth && isGuest ? 'opacity-70' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </div>
            {item.requiresAuth && isGuest && (
              <Lock className="w-3 h-3 text-sidebar-text/50" />
            )}
          </NavLink>
        ))}

        <div className="border-t border-border mx-3 my-3" />
        
        <NavLink
          to="/profile"
          onClick={(e) => handleNavClick(e, { label: 'Profile', requiresAuth: true })}
          className={({ isActive }) => `
            flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border-l-2
            ${isActive 
              ? 'bg-sidebar-active text-sidebar-text-active border-l-accent' 
              : 'text-sidebar-text border-l-transparent hover:bg-sidebar-hover hover:text-text-primary'}
            ${isGuest ? 'opacity-70' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            <User className="w-[18px] h-[18px]" />
            Profile
          </div>
          {isGuest && (
            <Lock className="w-3 h-3 text-sidebar-text/50" />
          )}
        </NavLink>
      </nav>

      <div className="p-3 border-t border-border">
        {isGuest ? (
          <div className="bg-white rounded-lg p-3 flex items-center gap-3 border border-border">
            <div className="w-8 h-8 rounded-full bg-accent-light text-[#4B7A4B] flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-sm font-medium truncate">Guest User</p>
              <p className="text-sidebar-text text-xs truncate">Not signed in</p>
            </div>
            <button 
              onClick={() => openAuthModal()}
              className="text-[10px] bg-accent text-white rounded px-2 py-1 font-semibold hover:bg-accent-hover transition-colors shrink-0"
            >
              Sign in
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-3 flex items-center gap-3 border border-border">
            <div className="w-8 h-8 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center shrink-0 overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.fullName)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-sm font-medium truncate">{user?.fullName || 'User'}</p>
              <p className="text-sidebar-text text-xs truncate">{user?.email || 'user@example.com'}</p>
            </div>
            <button 
              onClick={logout}
              className="text-sidebar-text hover:text-text-primary transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
