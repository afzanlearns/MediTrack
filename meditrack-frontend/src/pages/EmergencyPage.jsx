import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Phone, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import axios from 'axios';

const EmergencyPage = ({ showToast }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    bloodType: 'Unknown',
    allergies: 'No data available',
    emergencyContactName: 'Primary Contact',
    emergencyContactPhone: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/profile');
        if (res.data) {
          setProfile((prev) => ({ ...prev, ...res.data }));
        }
      } catch {
        if (showToast) {
          showToast('Unable to fetch emergency profile details', 'warning');
        }
      }
    };
    load();
  }, [showToast]);

  return (
    <div className="fixed inset-0 z-50 bg-bg-surface text-[#111827] overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8 min-h-screen flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-danger/25 bg-danger-light text-danger text-sm font-semibold">
            <AlertTriangle className="w-4 h-4" />
            Emergency Mode
          </div>
        </div>

        <div className="rounded-xl border border-border p-8 flex-1 flex flex-col justify-center gap-8">
          <div>
            <p className="text-sm uppercase tracking-[0.12em] text-text-secondary">Blood Type</p>
            <h1 className="text-6xl font-semibold mt-2">{profile.bloodType || 'Unknown'}</h1>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.12em] text-text-secondary">Allergies</p>
            <p className="text-3xl font-semibold mt-3 leading-tight">{profile.allergies || 'No known allergies listed'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <a
              href="tel:911"
              className="h-14 rounded-lg bg-danger text-white flex items-center justify-center font-semibold text-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Emergency Services
            </a>
            <a
              href={profile.emergencyContactPhone ? `tel:${profile.emergencyContactPhone}` : '#'}
              className="h-14 rounded-lg border border-border bg-page-bg flex items-center justify-center font-semibold text-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              {profile.emergencyContactName || 'ICE Contact'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
