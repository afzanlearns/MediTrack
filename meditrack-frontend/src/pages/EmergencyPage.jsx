import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, ArrowLeft } from 'lucide-react'
import { getProfile } from '../api/profileApi'
import { toast } from '../utils/toast'

export default function EmergencyPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    bloodType: '',
    allergies: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    fullName: '',
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfile()
        if (res.data) setProfile((prev) => ({ ...prev, ...res.data }))
      } catch {
        toast.error('Unable to fetch emergency profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="px-5 pt-14">
      <p className="font-mono text-xs text-[#3D5166] animate-pulse">Loading...</p>
    </div>
  )

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="px-5 pt-14 pb-5 flex items-start justify-between">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-[#F0F4F8]">Emergency</h1>
          <p className="font-sans text-sm text-[#3D5166] mt-0.5">ICE medical information</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 font-sans text-sm text-[#3D5166] press"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      </div>

      {/* Patient + Blood Type in one card */}
      <div className="mx-5 mb-4 card overflow-hidden divide-y divide-[#1C2530]">
        <div className="px-5 py-4">
          <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166] mb-1">Patient</p>
          <p className="font-sans text-base font-semibold text-[#F0F4F8]">
            {profile.fullName || 'Not specified'}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166] mb-1">Blood Type</p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-2xl font-bold text-[#F0F4F8]">
              {profile.bloodType || 'N/A'}
            </p>
            {profile.bloodType && (
              <span className="font-mono text-[10px] text-[#00C896] bg-[#00C8961A] px-2 py-0.5 rounded-full">ON FILE</span>
            )}
          </div>
        </div>
      </div>

      {/* Allergies */}
      <div className="mx-5 mb-4 card px-5 py-4">
        <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166] mb-2">
          Allergies & Contraindications
        </p>
        <p className="font-sans text-sm text-[#F0F4F8] leading-relaxed">
          {profile.allergies || 'None disclosed'}
        </p>
      </div>

      {/* Call actions — both as full-width rows in a card */}
      <div className="mx-5 mb-4 card overflow-hidden divide-y divide-[#1C2530]">
        <a
          href="tel:911"
          className="w-full flex items-center gap-4 px-5 py-4 press group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#D95B5B] flex items-center justify-center flex-shrink-0">
            <Phone size={16} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-sans text-sm font-semibold text-[#F0F4F8]">Emergency Dispatch</p>
            <p className="font-mono text-[11px] text-[#3D5166]">Call 911</p>
          </div>
          <span className="font-mono text-[10px] text-[#D95B5B] bg-[#D95B5B1A] px-2 py-0.5 rounded-full">SOS</span>
        </a>
        <a
          href={profile.emergencyContactPhone ? `tel:${profile.emergencyContactPhone}` : '#'}
          className="w-full flex items-center gap-4 px-5 py-4 press"
        >
          <div className="w-9 h-9 rounded-lg bg-[#141B23] border border-[#1C2530] flex items-center justify-center flex-shrink-0">
            <Phone size={16} className="text-[#3D5166]" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-sans text-sm font-semibold text-[#F0F4F8]">
              {profile.emergencyContactName || 'ICE Contact'}
            </p>
            <p className="font-mono text-[11px] text-[#3D5166]">
              {profile.emergencyContactPhone || 'No number on file'}
            </p>
          </div>
        </a>
      </div>

      <div className="mx-5 text-center mt-4">
        <p className="font-mono text-[10px] text-[#3D5166]">For medical personnel use only</p>
      </div>
    </div>
  )
}
