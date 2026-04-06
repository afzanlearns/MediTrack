import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, User, Settings, Download, FileText, HelpCircle, ChevronRight, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from '../utils/toast'

const sections = [
  {
    name: 'Account',
    items: [
      { label: 'Profile Settings', icon: User, path: '/profile' },
      { label: 'Emergency Contact', icon: ShieldAlert, path: '/emergency' },
      { label: 'Notifications', icon: Settings, locked: true },
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
      { label: 'Terms of Service', icon: FileText, locked: true },
      { label: 'Help & Support', icon: HelpCircle, locked: true },
    ]
  }
]

export default function MorePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleItemClick = async (item) => {
    if (item.action === 'export-summary') {
      try {
        const token = localStorage.getItem('meditrack_token')
        if (!token) throw new Error()
        
        toast.info("Generating export... Please wait")
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
        toast.success("Export downloaded successfully")
      } catch (err) {
        toast.error("Failed to generate export. Please sign in.")
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
      <div className="px-5 pt-14 pb-12">
        <h1 className="font-sans text-3xl font-semibold text-[#F0F4F8]">Settings</h1>
        <p className="font-mono text-xs text-[#3D5166] mt-2 italic">Precision tools for your health data</p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.name}>
            <p className="ml-5 mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#3D5166]">
              {section.name}
            </p>
            <div className="mx-5 card overflow-hidden divide-y divide-[#1C2530]">
              {section.items.map((item) => (
                <button 
                  key={item.label}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between px-4 py-4 press ${item.locked ? 'opacity-40 grayscale-[0.5]' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} strokeWidth={1.5} className={item.locked ? 'text-[#1C2530]' : 'text-[#3D5166]'} />
                    <span className="font-sans text-sm text-[#F0F4F8]">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.locked && (
                      <span className="font-mono text-[7px] border border-[#1C2530] px-1.5 py-0.5 rounded text-[#3D5166] uppercase tracking-widest">
                        Locked
                      </span>
                    )}
                    <ChevronRight size={14} className="text-[#1C2530]" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Sign Out */}
        <div className="px-5 pt-8 pb-12 mt-4 border-t border-[#1C2530]">
          <button 
            onClick={logout}
            className="w-full font-mono text-xs tracking-widest uppercase text-[#D95B5B] py-4 rounded-xl border border-[#D95B5B20] bg-[#D95B5B05] press"
          >
            Terminate Session
          </button>
          <p className="text-center font-mono text-[10px] text-[#3D5166] mt-4">
            MediTrack v2.4.0 · Precision Health Systems
          </p>
          {user && (
            <p className="text-center font-mono text-[9px] text-[#222E3A] mt-2">
               IDENTITY: {user?.email}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

