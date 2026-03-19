import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import MedicationsPage from './pages/MedicationsPage.jsx'
import DoseLogPage from './pages/DoseLogPage.jsx'
import SymptomsPage from './pages/SymptomsPage.jsx'
import DoctorVisitsPage from './pages/DoctorVisitsPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="medications" element={<MedicationsPage />} />
          <Route path="doses" element={<DoseLogPage />} />
          <Route path="symptoms" element={<SymptomsPage />} />
          <Route path="visits" element={<DoctorVisitsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
