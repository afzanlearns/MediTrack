import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, getIceContacts, createIceContact, deleteIceContact } from '../api/profileApi'
import { toast } from '../utils/toast'
import { Phone, ArrowLeft, Plus, Trash2, X } from 'lucide-react'

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
  const [iceContacts, setIceContacts] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [newContact, setNewContact] = useState({ fullName: '', phonePrimary: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [profRes, iceRes] = await Promise.all([
          getProfile(),
          getIceContacts()
        ])
        if (profRes.data) setProfile((prev) => ({ ...prev, ...profRes.data }))
        if (iceRes.data) setIceContacts(iceRes.data)
      } catch {
        toast.error('Unable to fetch emergency data')
      } finally {
        setLoading(false)
      }
    }
    load()

    // Trigger vibration on Emergency Mode activation
    if ('vibrate' in navigator) {
      navigator.vibrate([500, 200, 500, 200, 500])
    }

    // Request screen wake lock so it doesn't dim while paramedics read it
    let wakeLock = null
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen')
        }
      } catch (err) {
        console.warn('Wake Lock error:', err)
      }
    }
    requestWakeLock()

    return () => {
      if (wakeLock) {
        wakeLock.release()
      }
    }
  }, [])

  const handleAddContact = async (e) => {
    e.preventDefault()
    if (!newContact.fullName || !newContact.phonePrimary) {
      toast.error('Please fill in both name and number')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await createIceContact({
        fullName: newContact.fullName,
        phonePrimary: newContact.phonePrimary,
        priorityOrder: iceContacts.length + 1
      })
      setIceContacts([...iceContacts, res.data])
      setIsAdding(false)
      setNewContact({ fullName: '', phonePrimary: '' })
      toast.success('Emergency contact added')
    } catch (err) {
      toast.error('Failed to add contact')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Remove this emergency contact?')) return
    try {
      await deleteIceContact(id)
      setIceContacts(iceContacts.filter(c => c.id !== id))
      toast.success('Contact removed')
    } catch (err) {
      toast.error('Failed to remove contact')
    }
  }

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

      {/* Personal Emergency Numbers */}
      <div className="mx-5 mb-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166]">
            Personal Emergency Numbers ({iceContacts.length}/5)
          </p>
          {iceContacts.length < 5 && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1 font-sans text-xs font-medium text-[#00C896] press"
            >
              <Plus size={12} />
              Add New
            </button>
          )}
        </div>

        {/* Existing Contacts List */}
        <div className="card overflow-hidden divide-y divide-[#1C2530]">
          {/* Dispatch 911 (Always First) */}
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
            <span className="font-mono text-[10px] text-[#D95B5B] bg-[#D95B5B1A] px-2 py-0.5 rounded-full uppercase">SOS</span>
          </a>

          {/* Primary ICE from profile (Legacy compatibility) */}
          {profile.emergencyContactPhone && (
            <a
              href={`tel:${profile.emergencyContactPhone}`}
              className="w-full flex items-center gap-4 px-5 py-4 press"
            >
              <div className="w-9 h-9 rounded-lg bg-[#141B23] border border-[#1C2530] flex items-center justify-center flex-shrink-0">
                <Phone size={16} className="text-[#3D5166]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-sans text-sm font-semibold text-[#F0F4F8]">
                  {profile.emergencyContactName || 'Primary ICE'}
                </p>
                <p className="font-mono text-[11px] text-[#3D5166]">
                  {profile.emergencyContactPhone}
                </p>
              </div>
            </a>
          )}

          {/* Custom ICE Contacts */}
          {iceContacts.map((contact) => (
            <div key={contact.id} className="relative group">
              <a
                href={`tel:${contact.phonePrimary}`}
                className="w-full flex items-center gap-4 px-5 py-4 press"
              >
                <div className="w-9 h-9 rounded-lg bg-[#141B23] border border-[#1C2530] flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-[#3D5166]" />
                </div>
                <div className="flex-1 text-left pr-10">
                  <p className="font-sans text-sm font-semibold text-[#F0F4F8]">
                    {contact.fullName}
                  </p>
                  <p className="font-mono text-[11px] text-[#3D5166]">
                    {contact.phonePrimary}
                  </p>
                </div>
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteContact(contact.id)
                }}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-[#3D5166] hover:text-[#D95B5B] transition-colors"
                title="Remove Contact"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {/* No contacts message (if both profile ICE and custom ICE are empty) */}
          {!profile.emergencyContactPhone && iceContacts.length === 0 && (
            <div className="px-5 py-8 text-center">
              <p className="font-sans text-sm text-[#3D5166]">No personal emergency numbers configured.</p>
            </div>
          )}
        </div>

        {/* Add Contact Form (Inline) */}
        {isAdding && (
          <div className="mt-3 card p-4 border border-[#00C89633] animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center justify-between mb-4">
              <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#00C896]">
                New Emergency Contact
              </p>
              <button onClick={() => setIsAdding(false)} className="text-[#3D5166]">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddContact} className="space-y-3">
              <div>
                <label className="block font-sans text-[10px] font-semibold text-[#3D5166] uppercase mb-1">Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#141B23] border border-[#1C2530] rounded px-3 py-2 text-sm text-[#F0F4F8] focus:border-[#00C896] outline-none transition-colors"
                  value={newContact.fullName}
                  onChange={(e) => setNewContact({ ...newContact, fullName: e.target.value })}
                  autoFocus
                />
              </div>
              <div>
                <label className="block font-sans text-[10px] font-semibold text-[#3D5166] uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +1 234 567 890"
                  className="w-full bg-[#141B23] border border-[#1C2530] rounded px-3 py-2 text-sm text-[#F0F4F8] focus:border-[#00C896] outline-none transition-colors"
                  value={newContact.phonePrimary}
                  onChange={(e) => setNewContact({ ...newContact, phonePrimary: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00C896] text-[#0A0F14] font-sans text-sm font-semibold py-2.5 rounded transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Save Contact'}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="mx-5 text-center mt-4">
        <p className="font-mono text-[10px] text-[#3D5166]">For medical personnel use only</p>
      </div>
    </div>
  )
}
