import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Menu, LogIn } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';

const navItems = [
  { label: 'Dashboard',     path: '/' },
  { label: 'Medications',   path: '/medications' },
  { label: 'Dose Log',      path: '/dose-log' },
  { label: 'Vitals',        path: '/vitals' },
  { label: 'Symptoms',      path: '/symptoms' },
  { label: 'Prescriptions', path: '/prescriptions' },
  { label: 'Appointments',  path: '/appointments' },
  { label: 'Doctor Visits', path: '/doctor-visits' },
  { label: 'Profile',       path: '/profile' },
];

const TopBar = ({ onToggleSidebar }) => {
  const { user, isGuest } = useAuth();
  const { openAuthModal } = useAuthModal();
  const location = useLocation();
  const navigate = useNavigate();
  const [hasPendingReminders, setHasPendingReminders] = useState(false);

  const currentPage = navItems.find(item => 
    item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
  );

  useEffect(() => {
    if (isGuest) return; // Reminders need auth

    const checkReminders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/reminders/pending');
        setHasPendingReminders(response.data.length > 0);
      } catch (err) {
        // Silent error for polling
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [isGuest]);

  const handleEmergency = () => {
    if (isGuest) {
      openAuthModal('Emergency Mode');
      return;
    }
    navigate('/emergency');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-[72px] bg-page-bg/95 border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 fixed top-0 right-0 left-0 lg:left-[236px] z-30 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-white rounded-md transition-colors text-text-secondary border border-border"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-text-primary">
          {currentPage?.label || 'MediTrack'}
        </h2>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button className="p-2.5 hover:bg-white rounded-md transition-colors relative text-text-secondary border border-border">
          <Bell className="w-4 h-4" />
          {hasPendingReminders && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border border-white" />
          )}
        </button>

        <Button
          variant="outline"
          size="sm" 
          className="text-danger border-danger/30 hover:bg-danger-light"
          onClick={handleEmergency}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Emergency
        </Button>

        {isGuest ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => openAuthModal()}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign in
          </Button>
        ) : (
          <div className="w-9 h-9 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center cursor-pointer overflow-hidden border border-white shadow-soft">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              getInitials(user?.fullName)
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
