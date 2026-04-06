import React, { useEffect, useState } from 'react'
import { User, ShieldAlert } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getProfile, updateProfile } from '../api/profileApi'
import { toast } from '../utils/toast'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    address: '',
    bloodType: '',
    allergies: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceProvider: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await getProfile()
      if (res.data) setProfile(res.data)
    } catch (err) {
      toast.error('Unable to retrieve medical profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(profile)
      toast.success('Profile saved.')
    } catch (err) {
      toast.error('Failed to update information')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full bg-[#141B23] border border-[#1C2530] rounded-xl px-4 py-3 font-sans text-sm text-[#F0F4F8] placeholder:text-[#3D5166] focus:border-[#00C89650] transition-colors outline-none"

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
          <h1 className="font-sans text-2xl font-semibold text-[#F0F4F8]">Profile</h1>
          <p className="font-sans text-sm text-[#3D5166] mt-0.5">Identification & medical history</p>
        </div>
        <button
          onClick={logout}
          className="font-sans text-sm font-medium text-[#D95B5B] border border-[#D95B5B40] px-4 py-2 rounded-xl press"
        >
          Sign Out
        </button>
      </div>

      {/* Identity card */}
      <div className="mx-5 mb-4 card px-5 py-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-[#1C2530] bg-[#141B23] flex items-center justify-center flex-shrink-0">
          {user?.picture ? (
            <img src={user.picture} alt="" className="w-full h-full object-cover" />
          ) : (
            <User size={20} className="text-[#3D5166]" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-sans text-base font-semibold text-[#F0F4F8] truncate">{user?.name || profile.fullName || 'Authorized User'}</p>
          <p className="font-mono text-[11px] text-[#3D5166] mt-0.5 truncate">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleUpdate}>
        {/* Personal Info */}
        <div className="mx-5 mb-4 card px-4 py-4">
          <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166] mb-4">
            Personal Information
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              value={profile.fullName}
              onChange={e => setProfile({...profile, fullName: e.target.value})}
              className={inputClass}
              placeholder="Full Name"
            />
            <input
              type="text"
              value={profile.phone}
              onChange={e => setProfile({...profile, phone: e.target.value})}
              className={inputClass}
              placeholder="Phone Number"
            />
            <input
              type="text"
              value={profile.address}
              onChange={e => setProfile({...profile, address: e.target.value})}
              className={inputClass}
              placeholder="Address / Location"
            />
          </div>
        </div>

        {/* Clinical Profile */}
        <div className="mx-5 mb-4 card px-4 py-4">
          <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166] mb-4">
            Clinical Profile
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              value={profile.bloodType}
              onChange={e => setProfile({...profile, bloodType: e.target.value})}
              className={inputClass}
              placeholder="Blood Type (e.g. A+)"
            />
            <input
              type="text"
              value={profile.insuranceProvider}
              onChange={e => setProfile({...profile, insuranceProvider: e.target.value})}
              className={inputClass}
              placeholder="Insurance Provider & Policy"
            />
            <textarea
              value={profile.allergies}
              onChange={e => setProfile({...profile, allergies: e.target.value})}
              className={`${inputClass} h-24 resize-none`}
              placeholder="Allergies & medical alerts..."
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mx-5 mb-4 card px-4 py-4">
          <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166] mb-1">
            Emergency Contact
          </h2>
          <p className="font-sans text-xs text-[#3D5166] mb-4">In Case of Emergency (ICE)</p>
          <div className="space-y-3">
            <input
              type="text"
              value={profile.emergencyContactName}
              onChange={e => setProfile({...profile, emergencyContactName: e.target.value})}
              className={inputClass}
              placeholder="Contact Name"
            />
            <input
              type="text"
              value={profile.emergencyContactPhone}
              onChange={e => setProfile({...profile, emergencyContactPhone: e.target.value})}
              className={inputClass}
              placeholder="Contact Phone"
            />
          </div>
        </div>

        <div className="mx-5 mb-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#00C896] text-[#080B0F] font-sans font-semibold text-sm py-3.5 rounded-xl press"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
