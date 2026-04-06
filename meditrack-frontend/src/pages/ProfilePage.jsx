import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Heart, ShieldAlert, Save, LogOut, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, updateProfile } from '../api/profileApi';
import { toast } from '../utils/toast';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    address: '',
    bloodType: '',
    allergies: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceProvider: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      if (res.data) setProfile(res.data);
    } catch (err) {
      toast.error('Unable to retrieve medical profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profile);
      toast.success('Medical profile synchronized');
    } catch (err) {
      toast.error('Failed to update information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#3D5166] animate-pulse">Syncing Profile...</p>
    </div>
  );

  return (
    <div className="pb-16 max-w-4xl mx-auto px-5">
      {/* Header */}
      <div className="pt-14 pb-10">
        <h1 className="font-sans text-3xl font-semibold text-[#F0F4F8]">Profile</h1>
        <p className="font-mono text-xs text-[#3D5166] mt-2 italic">Standard identification & medical history</p>
      </div>

      <div className="space-y-10">
        {/* Identity Card */}
        <div className="card p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-[#1C2530] bg-[#0E151C] flex items-center justify-center">
              {user?.picture ? (
                <img src={user.picture} alt="" className="w-full h-full object-cover grayscale" />
              ) : (
                <User size={32} className="text-[#1C2530]" />
              )}
            </div>
            <div className="absolute inset-0 bg-[#080B0F80] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full cursor-pointer">
              <Camera size={18} className="text-[#F0F4F8]" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-sans text-xl font-medium text-[#F0F4F8]">{user?.name || profile.fullName || 'Authorized User'}</h2>
            <p className="font-mono text-[10px] text-[#3D5166] uppercase mt-1 tracking-wider">{user?.email}</p>
            <p className="font-mono text-[9px] text-[#00C896] mt-2 tracking-widest">ENCRYPTED IDENTITY ACCESS</p>
          </div>

          <button 
            onClick={logout}
            className="px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-[#D95B5B] border border-[#D95B5B30] rounded-lg press"
          >
            Sign Out
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          {/* Personal Info */}
          <section>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#3D5166]">
              Personal Information
            </p>
            <div className="card divide-y divide-[#1C2530]">
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Full Name</label>
                <input 
                  type="text"
                  value={profile.fullName}
                  onChange={e => setProfile({...profile, fullName: e.target.value})}
                  className="md:col-span-3 bg-transparent font-sans text-sm text-[#F0F4F8] outline-none"
                  placeholder="Legal Name"
                />
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Phone</label>
                <input 
                  type="text"
                  value={profile.phone}
                  onChange={e => setProfile({...profile, phone: e.target.value})}
                  className="md:col-span-3 bg-transparent font-sans text-sm text-[#F0F4F8] outline-none"
                  placeholder="+X XXX XXX XXXX"
                />
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Location</label>
                <input 
                  type="text"
                  value={profile.address}
                  onChange={e => setProfile({...profile, address: e.target.value})}
                  className="md:col-span-3 bg-transparent font-sans text-sm text-[#F0F4F8] outline-none"
                  placeholder="Primary Residence"
                />
              </div>
            </div>
          </section>

          {/* Medical Info */}
          <section>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#3D5166]">
              Clinical Profile
            </p>
            <div className="card divide-y divide-[#1C2530]">
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Blood Type</label>
                <input 
                  type="text"
                  value={profile.bloodType}
                  onChange={e => setProfile({...profile, bloodType: e.target.value})}
                  className="md:col-span-3 bg-transparent font-sans text-sm text-[#F0F4F8] outline-none placeholder:text-[#1C2530]"
                  placeholder="e.g. A POSITIVE"
                />
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Insurance</label>
                <input 
                  type="text"
                  value={profile.insuranceProvider}
                  onChange={e => setProfile({...profile, insuranceProvider: e.target.value})}
                  className="md:col-span-3 bg-transparent font-sans text-sm text-[#F0F4F8] outline-none"
                  placeholder="Provider & Policy Number"
                />
              </div>
              <div className="p-4">
                <label className="block font-mono text-[9px] uppercase tracking-widest text-[#3D5166] mb-3">Allergies & Medical Alerts</label>
                <textarea 
                  value={profile.allergies}
                  onChange={e => setProfile({...profile, allergies: e.target.value})}
                  className="w-full bg-transparent font-sans text-sm text-[#F0F4F8] outline-none min-h-[100px] resize-none"
                  placeholder="List any critical allergies or chronic conditions..."
                />
              </div>
            </div>
          </section>

          {/* ICE Contact */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert size={14} className="text-[#D95B5B]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D95B5B]">
                In Case of Emergency (ICE)
              </p>
            </div>
            <div className="card divide-y divide-[#1C2530] border-[#D95B5B20]">
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Proxy Name</label>
                <input 
                  type="text"
                  value={profile.emergencyContactName}
                  onChange={e => setProfile({...profile, emergencyContactName: e.target.value})}
                  className="md:col-span-3 bg-transparent font-sans text-sm text-[#F0F4F8] outline-none"
                  placeholder="Primary Emergency Proxy"
                />
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Proxy Phone</label>
                <input 
                  type="text"
                  value={profile.emergencyContactPhone}
                  onChange={e => setProfile({...profile, emergencyContactPhone: e.target.value})}
                  className="md:col-span-3 bg-transparent font-sans text-sm text-[#F0F4F8] outline-none"
                  placeholder="Direct Emergency Line"
                />
              </div>
            </div>
          </section>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={saving}
              className="w-full card py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-[#00C896] border-[#00C89650] bg-[#00C89610] press flex items-center justify-center gap-2"
            >
              <Save size={14} />
              {saving ? 'Synchronizing...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

