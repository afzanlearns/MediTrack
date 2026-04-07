import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useAuthModal } from '../contexts/AuthModalContext'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

export default function LandingPage() {
  const navigate = useNavigate()
  const { enterGuestMode } = useAuth()
  const { openAuthModal } = useAuthModal()
  const { isInstallable, promptInstall } = useInstallPrompt()

  const handleGetStarted = () => {
    enterGuestMode()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#080B0F] flex flex-col max-w-app mx-auto px-6">
      
      {/* Header */}
      <header className="flex items-center justify-between pt-14 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#00C896] flex items-center justify-center">
            <Heart size={13} strokeWidth={2.5} className="text-[#080B0F]" />
          </div>
          <span className="font-sans font-semibold text-base text-[#F0F4F8]">MediTrack</span>
        </div>
        <button 
          onClick={() => openAuthModal()}
          className="text-sm text-[#8A9BAE] font-sans press"
        >
          Sign in
        </button>
      </header>

      {/* Hero — takes up most of the screen */}
      <div className="flex-1 flex flex-col justify-center pb-8">
        
        {/* Eyebrow tag */}
        <div className="inline-flex items-center gap-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00C896]" />
          <span className="font-mono text-xs text-[#8A9BAE] tracking-widest uppercase">
            Personal Health Record
          </span>
        </div>

        {/* Headline — Instrument Serif, large, line-break intentional */}
        <h1 className="font-display text-[3.25rem] leading-[1.05] text-[#F0F4F8] mb-6">
          Your health,<br />
          <span className="italic text-[#8A9BAE]">always</span> with<br />
          you.
        </h1>

        {/* One-liner */}
        <p className="font-sans text-sm text-[#3D5166] leading-relaxed mb-12 max-w-[260px]">
          Track medications, log vitals, and access emergency info — from any device.
        </p>

        {/* CTAs — stacked, full width */}
        <div className="flex flex-col gap-3">
          {isInstallable && (
            <button 
              onClick={promptInstall}
              className="w-full bg-[#00C896] text-[#080B0F] font-sans font-semibold 
                         text-sm py-4 rounded-xl press"
            >
              Install MediTrack App
            </button>
          )}
          <button 
            onClick={handleGetStarted}
            className={`w-full ${isInstallable ? 'bg-[#0E1318] border border-[#1C2530] text-[#8A9BAE]' : 'bg-[#00C896] text-[#080B0F]'} font-sans font-semibold 
                       text-sm py-4 rounded-xl press`}
          >
            Get Started Free
          </button>
          <button 
            onClick={() => openAuthModal()}
            className="w-full bg-[#0E1318] border border-[#1C2530] text-[#8A9BAE] 
                       font-sans font-medium text-sm py-4 rounded-xl press flex 
                       items-center justify-center gap-2"
          >
            {/* Simple G icon, no full Google branding */}
            <span className="text-[#F0F4F8] font-semibold">G</span>
            Continue with Google
          </button>
        </div>
        
        <p className="text-center text-xs text-[#3D5166] mt-4 font-sans">
          No account needed · Sign in anytime to save your data
        </p>
      </div>

      {/* Feature tags — minimal, bottom of page */}
      <div className="pb-10">
        <p className="text-[10px] font-mono tracking-widest text-[#3D5166] uppercase mb-3">
          Everything you need
        </p>
        <div className="flex flex-wrap gap-2">
          {['Medications', 'Dose Log', 'Vitals', 'Symptoms', 'Visits', 'Emergency'].map(f => (
            <span key={f} className="font-sans text-xs text-[#8A9BAE] bg-[#0E1318] 
                                     border border-[#1C2530] px-3 py-1.5 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

