import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import Toast from '../shared/Toast.jsx'

const pageTitles = {
  '/':            'Dashboard',
  '/medications': 'Medications',
  '/doses':       'Dose Log',
  '/symptoms':    'Symptom Journal',
  '/visits':      'Doctor Visits',
}

export default function Layout() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] ?? 'MediTrack'

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title={title} />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Global toast notification — listens for 'api-error' events */}
      <Toast />
    </div>
  )
}
