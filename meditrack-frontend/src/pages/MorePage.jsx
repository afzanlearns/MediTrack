import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Settings, HelpCircle, FileText, Download, LogOut, ChevronRight, User, ShieldAlert } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from '../utils/toast'

const items = [
  { label: 'Profile Settings', icon: User, path: '/profile', section: 'Account', locked: true },
  { label: 'Emergency Contact', icon: ShieldAlert, path: '/emergency', section: 'Account', locked: true },
  { label: 'Notifications', icon: Settings, section: 'Account' },
  { label: 'Data Export', icon: Download, section: 'Data' },
  { label: 'Terms of Service', icon: FileText, section: 'Legal' },
  { label: 'Help & Support', icon: HelpCircle, section: 'Legal' },
]

const MorePage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleItemClick = (item) => {
    if (item.path) {
      navigate(item.path)
      return
    }
    toast.info(`${item.label} is coming soon.`)
  }

  const renderSection = (name) => (
    <div>
      <p className="ml-2 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#2A3D50]">{name}</p>
      <div className="divide-y divide-[#1E2D3D] overflow-hidden rounded-xl border border-[#1E2D3D] bg-[#111720]">
        {items
          .filter((item) => item.section === name)
          .map((item) => (
            <motion.button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className="group flex w-full items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18222E] text-[#4A6070] transition-colors group-hover:text-[#00D4AA]">
                  <item.icon size={18} strokeWidth={2} />
                </div>
                <span className="text-[15px] font-medium text-[#E8EDF2]">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-[#3D5166] transition-colors group-hover:text-[#00D4AA]" />
            </motion.button>
          ))}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="pb-24 pt-12 px-4"
    >
      <h1 className="mb-8 text-[2.25rem] font-bold tracking-tight text-[#E8EDF2]">More</h1>

      <div className="space-y-6">
        {renderSection('Account')}
        {renderSection('Data')}
        {renderSection('Legal')}

        <div className="mt-8">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-xl font-medium hover:bg-[#EF4444]/20 transition-colors"
          >
            <LogOut size={18} strokeWidth={2.5} />
            Sign Out
          </button>
          {user && <p className="mt-3 text-center text-xs text-[#4A6070]">Logged in as {user?.email}</p>}
        </div>
      </div>
    </motion.div>
  )
}

export default MorePage
