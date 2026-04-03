import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthModalProvider, useAuthModal } from './contexts/AuthModalContext';
import Layout from './components/layout/Layout';
import Toast from './components/ui/Toast';
import AuthModal from './components/auth/AuthModal';
import { Loader2 } from 'lucide-react';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MedicationsPage from './pages/MedicationsPage';
import DoseLogPage from './pages/DoseLogPage';
import VitalsPage from './pages/VitalsPage';
import SymptomsPage from './pages/SymptomsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import DoctorVisitsPage from './pages/DoctorVisitsPage';
import ProfilePage from './pages/ProfilePage';
import EmergencyPage from './pages/EmergencyPage';

// Route Guards
const GuestOrAuthRoute = ({ children }) => {
  const { isAuthenticated, isGuest, isReady } = useAuth();
  if (!isReady) return <LoadingScreen />;
  if (!isAuthenticated && !isGuest) return <Navigate to="/landing" replace />;
  return children;
};

const AuthOnlyRoute = ({ children, featureName }) => {
  const { isAuthenticated, isReady } = useAuth();
  const { openAuthModal } = useAuthModal();
  
  if (!isReady) return <LoadingScreen />;
  if (!isAuthenticated) {
    // We'll show the locked feature component via the Page itself usually, 
    // but the route guard can also trigger the modal if it really needs to 
    // redirect. The logic here is to allow the navigation but the page 
    // will render LockedFeature. However, the prompt says "AuthOnlyRoute: if !isAuthenticated → openAuthModal(featureName) + redirect to /"
    // So let's follow the prompt exactly.
    setTimeout(() => openAuthModal(featureName), 100);
    return <Navigate to="/" replace />;
  }
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isReady } = useAuth();
  if (!isReady) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
    <Loader2 className="w-12 h-12 text-accent animate-spin" />
  </div>
);

function AppContent() {
  const [toast, setToast] = useState(null);

  const showToast = (message, variant = 'success') => {
    setToast({ message, variant });
  };

  return (
    <>
      <Routes>
        <Route path="/landing" element={
          <PublicOnlyRoute>
            <LandingPage />
          </PublicOnlyRoute>
        } />
        <Route path="/login" element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        } />
        
        {/* Guest or Auth Routes */}
        <Route element={<GuestOrAuthRoute><Layout /></GuestOrAuthRoute>}>
          <Route path="/" element={<DashboardPage showToast={showToast} />} />
          <Route path="/medications" element={<MedicationsPage showToast={showToast} />} />
          <Route path="/dose-log" element={<DoseLogPage showToast={showToast} />} />
          <Route path="/vitals" element={<VitalsPage showToast={showToast} />} />
          <Route path="/symptoms" element={<SymptomsPage showToast={showToast} />} />
          <Route path="/doctor-visits" element={<DoctorVisitsPage showToast={showToast} />} />
        </Route>

        {/* Auth Only Routes */}
        <Route element={<GuestOrAuthRoute><Layout /></GuestOrAuthRoute>}>
          <Route path="/prescriptions" element={
            <AuthOnlyRoute featureName="Prescriptions Store">
              <PrescriptionsPage showToast={showToast} />
            </AuthOnlyRoute>
          } />
          <Route path="/appointments" element={
            <AuthOnlyRoute featureName="Appointments">
              <AppointmentsPage showToast={showToast} />
            </AuthOnlyRoute>
          } />
          <Route path="/profile" element={
            <AuthOnlyRoute featureName="Profile">
              <ProfilePage showToast={showToast} />
            </AuthOnlyRoute>
          } />
          <Route path="/emergency" element={
            <AuthOnlyRoute featureName="Emergency Mode">
              <EmergencyPage showToast={showToast} />
            </AuthOnlyRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <AuthModal />
      
      {toast && (
        <Toast 
          message={toast.message} 
          variant={toast.variant} 
          onClose={() => setToast(null)} 
        />
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter 
      future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true 
      }}
    >
      <AuthProvider>
        <AuthModalProvider>
          <AppContent />
        </AuthModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
