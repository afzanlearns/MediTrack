import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Phone, ArrowLeft, Activity } from 'lucide-react';
import { getProfile } from '../api/profileApi';
import { toast } from '../utils/toast';

export default function EmergencyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    bloodType: 'UNKNOWN',
    allergies: 'NO DATA RECORDED',
    emergencyContactName: 'NOT SPECIFIED',
    emergencyContactPhone: '',
    fullName: '',
    dateOfBirth: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfile();
        if (res.data) {
          setProfile((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        toast.error('Unable to fetch emergency profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#080B0F] text-[#F0F4F8] overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-12 min-h-screen flex flex-col">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#3D5166] press"
          >
            <ArrowLeft size={14} />
            Termination
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1 border border-[#D95B5B50] bg-[#D95B5B10] rounded">
            <ShieldAlert size={12} className="text-[#D95B5B]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#D95B5B] font-bold">
              Emergency Protocol v1.0
            </span>
          </div>
        </div>

        {/* Clinical Identity */}
        <div className="mb-12 border-l-2 border-[#D95B5B] pl-6 py-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#3D5166] mb-1">Authenticated Subject</p>
          <h1 className="font-sans text-4xl font-semibold tracking-tight text-[#F0F4F8]">
            {profile.fullName || 'UNIDENTIFIED'}
          </h1>
          <div className="flex gap-4 mt-3">
             <div className="flex flex-col">
                <span className="font-mono text-[8px] uppercase text-[#1C2530] tracking-widest font-bold">DOB</span>
                <span className="font-mono text-xs text-[#3D5166]">{profile.dateOfBirth || '-- / -- / --'}</span>
             </div>
             <div className="flex flex-col">
                <span className="font-mono text-[8px] uppercase text-[#1C2530] tracking-widest font-bold">System ID</span>
                <span className="font-mono text-xs text-[#3D5166]">MT-PRX-001</span>
             </div>
          </div>
        </div>

        {/* Data Grid */}
        <div className="space-y-6 flex-1">
          {/* Blood Type Card */}
          <div className="card p-8 border-[#D95B5B30]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#3D5166]">Core Blood Registry</span>
              <Activity size={16} className="text-[#D95B5B]" />
            </div>
            <h2 className="font-sans text-7xl font-bold text-[#F0F4F8] leading-none">
              {profile.bloodType || 'N/A'}
            </h2>
          </div>

          {/* Allergies Card */}
          <div className="card p-8 bg-[#D95B5B05] border-[#D95B5B20]">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D95B5B] mb-4">
              Critical Allergies & Contraindications
            </p>
            <p className="font-sans text-2xl font-medium text-[#F0F4F8] leading-snug">
              {profile.allergies || 'NONE DISCLOSED'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="tel:911"
              className="group p-6 rounded-xl border border-[#D95B5B] bg-[#D95B5B] flex flex-col items-center justify-center gap-2 press"
            >
              <Phone size={24} className="text-white" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white font-bold font-sans">
                Emergency Dispatch
              </span>
            </a>
            
            <a
              href={profile.emergencyContactPhone ? `tel:${profile.emergencyContactPhone}` : '#'}
              className="group p-6 rounded-xl border border-[#1C2530] bg-[#0E151C] flex flex-col items-center justify-center gap-2 press hover:border-[#F0F4F820]"
            >
              <Phone size={24} className="text-[#3D5166] group-hover:text-[#F0F4F8]" />
              <div className="text-center">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#3D5166] group-hover:text-[#F0F4F8]">
                  Primary Proxy
                </span>
                <span className="block font-sans text-xs text-[#F0F4F8] mt-1 opacity-60">
                  {profile.emergencyContactName || 'ICE'}
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* Legal / System Footer */}
        <div className="mt-12 text-center">
          <p className="font-mono text-[8px] text-[#1C2530] uppercase tracking-[0.4em] leading-relaxed">
            Authorized for medical personnel use only.<br/>
            MediTrack Precision Health Systems · Secure Link Active
          </p>
        </div>
      </div>
    </div>
  );
}

