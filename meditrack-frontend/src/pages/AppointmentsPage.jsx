import React, { useEffect, useMemo, useState } from 'react';
import { format, isBefore } from 'date-fns';
import { Plus, Clock3, User, MapPin, Trash2, Calendar, CheckCircle, Save, X } from 'lucide-react';
import {
  getAllAppointments,
  createAppointment,
  deleteAppointment,
  markCompleted,
} from '../api/appointmentApi';
import { toast } from '../utils/toast';
import Modal from '../components/shared/Modal';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('upcoming');
  const [formData, setFormData] = useState({
    doctorName: '',
    appointmentDate: format(new Date(), 'yyyy-MM-dd'),
    reason: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await getAllAppointments();
      setAppointments(res.data || []);
    } catch (err) {
      toast.error('Unable to synchronize appointment schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAppointment(formData);
      toast.success('Consultation document scheduled');
      setModalOpen(false);
      setFormData({
        doctorName: '',
        appointmentDate: format(new Date(), 'yyyy-MM-dd'),
        reason: '',
        location: '',
        notes: '',
      });
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to commit appointment record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAppointment(id);
      toast.success('Consultation purged');
      fetchAppointments();
    } catch (err) {
      toast.error('Purge operation failed');
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      await markCompleted(id);
      toast.success('Consultation verified as completed');
      fetchAppointments();
    } catch (err) {
      toast.error('Verification failed');
    }
  };

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const up = [];
    const old = [];

    appointments.forEach((item) => {
      const date = new Date(item.appointmentDate);
      if (item.isCompleted || isBefore(date, now)) old.push(item);
      else up.push(item);
    });

    return { 
      upcoming: up.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)), 
      past: old.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)) 
    };
  }, [appointments]);

  const visible = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="pb-16 max-w-4xl mx-auto px-5">
      {/* Header */}
      <div className="pt-14 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-sans text-3xl font-semibold text-[#F0F4F8]">Appointments</h1>
          <p className="font-mono text-xs text-[#3D5166] mt-2 italic">Clinical consultation management</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-[#00C896] border border-[#00C89640] rounded-lg press bg-[#00C89605]"
        >
          <Plus size={14} />
          Document New Entry
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-10 flex gap-1 border-b border-[#1C2530]">
        {['upcoming', 'past'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] transition-all relative ${
              tab === t ? 'text-[#00C896]' : 'text-[#3D5166] hover:text-[#F0F4F8]'
            }`}
          >
            {t} ({t === 'upcoming' ? upcoming.length : past.length})
            {tab === t && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00C896]" />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4 mb-24">
        {loading ? (
          <div className="flex justify-center py-20">
             <p className="font-mono text-[10px] text-[#3D5166] animate-pulse uppercase tracking-widest">Synchronizing schedule...</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="card py-20 text-center">
             <p className="font-mono text-[10px] text-[#3D5166] uppercase tracking-[0.2em]">Zero consultations documented</p>
          </div>
        ) : (
          visible.map((apt) => (
            <div key={apt.id} className="card p-5 group">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg border flex items-center justify-center ${
                      tab === 'upcoming' ? 'border-[#00C89630] bg-[#00C89605] text-[#00C896]' : 'border-[#1C2530] bg-[#0E151C] text-[#3D5166]'
                    }`}>
                      <Calendar size={20} strokeWidth={1} />
                    </div>
                    <div>
                      <h3 className="font-sans text-lg font-medium text-[#F0F4F8] leading-tight">
                        {apt.reason || 'Unspecified Consultation'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                        <div className="flex items-center gap-1.5 opacity-60">
                          <Clock3 size={12} className="text-[#3D5166]" />
                          <span className="font-mono text-[10px] text-[#3D5166] uppercase tracking-wider">
                            {format(new Date(apt.appointmentDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-60">
                          <User size={12} className="text-[#3D5166]" />
                          <span className="font-mono text-[10px] text-[#3D5166] uppercase tracking-wider">
                             DR. {apt.doctorName || 'UNIDENTIFIED'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {apt.location && (
                    <div className="ml-14 flex items-start gap-2 bg-[#0E151C] p-2 rounded border border-[#1C2530]">
                      <MapPin size={10} className="text-[#3D5166] mt-0.5" />
                      <span className="font-mono text-[10px] text-[#F0F4F8] opacity-50 uppercase tracking-widest">{apt.location}</span>
                    </div>
                  )}

                  {apt.notes && (
                    <p className="ml-14 font-mono text-[10px] text-[#3D5166] leading-relaxed italic border-l border-[#1C2530] pl-3">
                      "{apt.notes}"
                    </p>
                  )}
                </div>

                <div className="flex md:flex-col items-center gap-2">
                  {tab === 'upcoming' ? (
                    <>
                      <button
                        onClick={() => handleMarkCompleted(apt.id)}
                        className="flex-1 md:w-full flex items-center justify-center gap-2 px-4 py-2 font-mono text-[9px] uppercase tracking-widest text-[#00C896] border border-[#00C89630] rounded-lg press hover:bg-[#00C89605]"
                      >
                        <CheckCircle size={12} />
                        Verify Completion
                      </button>
                      <button
                        onClick={() => handleDelete(apt.id)}
                        className="p-2 text-[#3D5166] hover:text-[#D95B5B] transition-colors press"
                        title="Cancel Appointment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-[#3D5166] border border-[#1C2530] rounded flex items-center gap-1.5">
                       <CheckCircle size={10} />
                       Archived
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modernized Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Consultation Data Initialization">
        <form onSubmit={handleAddAppointment} className="space-y-6">
          <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Subject</label>
                <input 
                  type="text"
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                  className="md:col-span-3 bg-transparent font-sans text-sm text-[#F0F4F8] outline-none border-b border-[#1C2530] pb-2 focus:border-[#00C896] transition-colors"
                  placeholder="Primary Reason for Visit"
                  required
                />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Practitioner</label>
                <input 
                  type="text"
                  value={formData.doctorName}
                  onChange={e => setFormData({...formData, doctorName: e.target.value})}
                  className="md:col-span-3 bg-transparent font-sans text-sm text-[#F0F4F8] outline-none border-b border-[#1C2530] pb-2 focus:border-[#00C896] transition-colors"
                  placeholder="Dr. Identifier"
                  required
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Timestamp</label>
                <input 
                  type="date"
                  value={formData.appointmentDate}
                  onChange={e => setFormData({...formData, appointmentDate: e.target.value})}
                  className="md:col-span-3 bg-transparent font-sans text-sm text-[#F0F4F8] outline-none border-b border-[#1C2530] pb-2 focus:border-[#00C896] transition-colors"
                  required
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Facility</label>
                <input 
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="md:col-span-3 bg-transparent font-sans text-sm text-[#F0F4F8] outline-none border-b border-[#1C2530] pb-2 focus:border-[#00C896] transition-colors"
                  placeholder="Clinical Location"
                />
             </div>

             <div className="pt-2">
                <label className="block font-mono text-[9px] uppercase tracking-widest text-[#3D5166] mb-3">Clinical Narrative</label>
                <textarea 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-[#0E151C] border border-[#1C2530] rounded-lg p-3 font-sans text-sm text-[#F0F4F8] outline-none min-h-[100px] resize-none focus:border-[#00C89640]"
                  placeholder="Additional observations or preparation requirements..."
                />
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setModalOpen(false)}
              className="px-6 py-2 font-mono text-[10px] uppercase tracking-widest text-[#3D5166] hover:text-[#F0F4F8] transition-colors"
            >
              Abort
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 font-mono text-[10px] uppercase tracking-widest text-[#0A0E13] bg-[#00C896] rounded-lg press"
            >
              <Save size={14} />
              {saving ? 'Synchronizing...' : 'Initialize Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

