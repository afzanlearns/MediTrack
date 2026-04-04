import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Heart, ShieldAlert, Save, LogOut } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ProfilePage = ({ showToast }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
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
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/profile');
      if (res.data) setProfile(res.data);
    } catch {
      showToast('Failed to load profile', 'danger');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:8080/api/profile', profile);
      showToast('Profile updated');
    } catch {
      showToast('Failed to update profile', 'danger');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" subtitle="Personal details, medical profile, and emergency contact information" />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <Card className="xl:col-span-4 p-6">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-border mx-auto">
              <img
                src={user.picture || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-text-primary">{user.name || profile.fullName || 'User'}</h2>
            <p className="text-sm text-text-secondary">{user.email}</p>
          </div>

          <div className="mt-6 pt-6 border-t border-border space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </Card>

        <form onSubmit={handleUpdate} className="xl:col-span-8 space-y-6">
          <Card className="p-5 space-y-4">
            <h3 className="text-[20px] font-semibold text-text-primary">Personal Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" icon={<User className="w-4 h-4" />} value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
              <Input label="Email" icon={<Mail className="w-4 h-4" />} value={user.email || ''} disabled />
              <Input label="Phone" icon={<Phone className="w-4 h-4" />} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              <Input label="Address" icon={<MapPin className="w-4 h-4" />} value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="text-[20px] font-semibold text-text-primary">Medical Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Blood Type" icon={<Heart className="w-4 h-4" />} value={profile.bloodType} onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })} />
              <Input label="Insurance Provider" value={profile.insuranceProvider} onChange={(e) => setProfile({ ...profile, insuranceProvider: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Allergies and Alerts</label>
              <textarea
                className="w-full border border-border rounded-md px-3 py-2.5 text-sm bg-bg-surface min-h-[90px]"
                value={profile.allergies}
                onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
              />
            </div>
          </Card>

          <Card className="p-5 space-y-4 bg-danger-light/60 border-danger/25">
            <h3 className="text-[20px] font-semibold text-danger flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              ICE Contact
            </h3>
            <p className="text-sm text-text-secondary">Critical emergency contact details shown in emergency mode.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Emergency contact name"
                value={profile.emergencyContactName}
                onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })}
              />
              <Input
                label="Emergency contact phone"
                value={profile.emergencyContactPhone}
                onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })}
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
