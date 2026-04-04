import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthModalProvider } from './contexts/AuthModalContext';
import AppShell from './components/shell/AppShell';
import AuthModal from './components/auth/AuthModal';
import { Loader2 } from 'lucide-react';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import MedicationsPage from './pages/MedicationsPage';
import DoseLogPage from './pages/DoseLogPage';
import VitalsPage from './pages/VitalsPage';
import SymptomsPage from './pages/SymptomsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import DoctorVisitsPage from './pages/DoctorVisitsPage';
import MorePage from './pages/MorePage';
import LockedPage from './pages/LockedPage';

const AppRoutes = () => {
  const { isAuthenticated, isGuest, isReady } = useAuth();

  if (!isReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-surface">
        <Loader2 className="w-12 h-12 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated || isGuest ? <Navigate to="/dashboard" /> : <LandingPage />} />
      
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/medications" element={<MedicationsPage />} />
        <Route path="/dose-log" element={<DoseLogPage />} />
        <Route path="/vitals" element={<VitalsPage />} />
        <Route path="/symptoms" element={<SymptomsPage />} />
        <Route path="/doctor-visits" element={<DoctorVisitsPage />} />
        <Route path="/more" element={<MorePage />} />
        
        {/* Auth-gated routes */}
        <Route path="/appointments" element={isAuthenticated ? <AppointmentsPage /> : <LockedPage featureName="Appointments" />} />
        <Route path="/prescriptions" element={isAuthenticated ? <PrescriptionsPage /> : <LockedPage featureName="Prescriptions" />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <LockedPage featureName="Profile" />} />
        <Route path="/emergency" element={isAuthenticated ? <EmergencyPage /> : <LockedPage featureName="Emergency Contact" />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthModalProvider>
          <AppRoutes />
          <AuthModal />
        </AuthModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
