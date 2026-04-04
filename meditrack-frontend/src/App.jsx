import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AuthModalProvider } from './contexts/AuthModalContext'
import AppShell from './components/shell/AppShell'
import AuthModal from './components/auth/AuthModal'
import Toast from './components/shared/Toast'

import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import MedicationsPage from './pages/MedicationsPage'
import DoseLogPage from './pages/DoseLogPage'
import VitalsPage from './pages/VitalsPage'
import SymptomsPage from './pages/SymptomsPage'
import DoctorVisitsPage from './pages/DoctorVisitsPage'
import MorePage from './pages/MorePage'
import LockedPage from './pages/LockedPage'

import PrescriptionsPage from './pages/PrescriptionsPage'
import AppointmentsPage from './pages/AppointmentsPage'
import ProfilePage from './pages/ProfilePage'
import EmergencyPage from './pages/EmergencyPage'

const AppRoutes = () => {
  const { isAuthenticated, isGuest, isReady } = useAuth()

  if (!isReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0A0E13]">
        <Loader2 className="h-12 w-12 animate-spin text-[#00D4AA]" />
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated || isGuest ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />

      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/medications" element={<MedicationsPage />} />
        <Route path="/dose-log" element={<DoseLogPage />} />
        <Route path="/vitals" element={<VitalsPage />} />
        <Route path="/symptoms" element={<SymptomsPage />} />
        <Route path="/doctor-visits" element={<DoctorVisitsPage />} />
        <Route path="/more" element={<MorePage />} />

        <Route
          path="/appointments"
          element={isAuthenticated ? <AppointmentsPage /> : <LockedPage featureName="Appointments" />}
        />
        <Route
          path="/prescriptions"
          element={
            isAuthenticated ? <PrescriptionsPage /> : <LockedPage featureName="Prescriptions" />
          }
        />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <LockedPage featureName="Profile" />} />
        <Route
          path="/emergency"
          element={
            isAuthenticated ? <EmergencyPage /> : <LockedPage featureName="Emergency Contact" />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthModalProvider>
          <AppRoutes />
          <AuthModal />
          <Toast />
        </AuthModalProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
