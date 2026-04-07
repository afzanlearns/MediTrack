import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldAlert, User, Bell, Download, FileText, HelpCircle,
  ChevronRight, Calendar, Pill, Activity,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from '../utils/toast'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

const sections = [
  {
    name: 'Account',
    items: [
      { label: 'Profile Settings',   icon: User,       path: '/profile'       },
      { label: 'Emergency Contact',  icon: ShieldAlert, path: '/emergency'     },
      { label: 'Notifications',      icon: Bell,        path: '/notifications' },
    ]
  },
  {
    name: 'Clinical',
    items: [
      { label: 'Appointments',   icon: Calendar,  path: '/appointments'  },
      { label: 'Prescriptions',  icon: FileText,  path: '/prescriptions' },
      { label: 'Symptoms',       icon: Activity,  path: '/symptoms'      },
      { label: 'Dose Log',       icon: Pill,      path: '/dose-log'      },
    ]
  },
  {
    name: 'Data',
    items: [
      { label: 'Data Export', icon: Download, action: 'export-summary' },
    ]
  },
  {
    name: 'Legal',
    items: [
      { label: 'Terms of Service', icon: FileText,    locked: true },
      { label: 'Help & Support',   icon: HelpCircle,  locked: true },
    ]
  }
]

export default function MorePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { isInstallable, promptInstall } = useInstallPrompt()

  const handleItemClick = async (item) => {
    if (item.action === 'export-summary') {
      try {
        const token = localStorage.getItem('meditrack_token')
        if (!token) throw new Error()
        toast.info('Generating export... Please wait')
        const res = await fetch('http://localhost:8080/api/export/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error()
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `meditrack-health-summary-${new Date().toISOString().split('T')[0]}.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success('Export downloaded successfully')
      } catch {
        toast.error('Failed to generate export. Please sign in.')
      }
      return
    }
    if (item.path && !item.locked) {
      navigate(item.path)
      return
    }
    toast.info(`${item.label} is coming soon.`)
  }

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="px-5 pt-14 pb-5">
        <h1 className="font-sans text-2xl font-semibold text-[#F0F4F8]">More</h1>
        <p className="font-sans text-sm text-[#3D5166] mt-0.5">Settings & clinical records</p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.name}>
            <p className="mx-5 mb-2 font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166]">
              {section.name}
            </p>
            <div className="mx-5 card overflow-hidden divide-y divide-[#1C2530]">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between px-4 py-4 press ${item.locked ? 'opacity-40' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} strokeWidth={1.5} className="text-[#3D5166]" />
                    <span className="font-sans text-sm text-[#F0F4F8]">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.locked && (
                      <span className="font-mono text-[9px] border border-[#1C2530] px-1.5 py-0.5 rounded text-[#3D5166] uppercase tracking-widest">
                        Soon
                      </span>
                    )}
                    <ChevronRight size={14} className="text-[#1C2530]" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Install Block */}
        {isInstallable && (
          <div className="mx-5 pt-2 pb-2">
            <button
              onClick={promptInstall}
              className="w-full font-sans text-sm font-medium text-[#080B0F] py-3.5 rounded-xl border border-[#00C896] bg-[#00C896] press"
            >
              Install MediTrack App
            </button>
          </div>
        )}

        {/* Sign Out */}
        <div className="mx-5 pt-2 pb-12">
          <button
            onClick={logout}
            className="w-full font-sans text-sm font-medium text-[#D95B5B] py-3.5 rounded-xl border border-[#D95B5B30] bg-[#D95B5B08] press"
          >
            Sign Out
          </button>
          {user && (
            <p className="text-center font-mono text-[10px] text-[#3D5166] mt-4">{user?.email}</p>
          )}
        </div>
      </div>
    </div>
  )
}
