import React, { useEffect, useMemo, useState } from 'react';
import { format, isBefore } from 'date-fns';
import { Plus, Clock3, User, MapPin, CalendarDays, Trash2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import {
  getAllAppointments,
  createAppointment,
  deleteAppointment,
  markCompleted,
} from '../api/appointmentApi';

const AppointmentsPage = ({ showToast }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
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
    } catch {
      showToast('Failed to load appointments', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      await createAppointment(formData);
      showToast('Appointment scheduled');
      setModalOpen(false);
      setFormData({
        doctorName: '',
        appointmentDate: format(new Date(), 'yyyy-MM-dd'),
        reason: '',
        location: '',
        notes: '',
      });
      fetchAppointments();
    } catch {
      showToast('Failed to add appointment', 'danger');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAppointment(id);
      showToast('Appointment removed');
      fetchAppointments();
    } catch {
      showToast('Failed to remove appointment', 'danger');
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      await markCompleted(id);
      showToast('Appointment marked as completed');
      fetchAppointments();
    } catch {
      showToast('Failed to update appointment', 'danger');
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

    return { upcoming: up, past: old };
  }, [appointments]);

  const visible = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        subtitle="Manage upcoming consultations and visit history"
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        }
      />

      <Card className="p-3">
        <div className="inline-flex rounded-md border border-border overflow-hidden">
          <button
            className={`px-4 h-10 text-sm font-medium ${tab === 'upcoming' ? 'bg-accent-light text-[#4B7A4B]' : 'bg-bg-surface text-text-secondary'}`}
            onClick={() => setTab('upcoming')}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            className={`px-4 h-10 text-sm font-medium border-l border-border ${tab === 'past' ? 'bg-accent-light text-[#4B7A4B]' : 'bg-bg-surface text-text-secondary'}`}
            onClick={() => setTab('past')}
          >
            Past ({past.length})
          </button>
        </div>
      </Card>

      {visible.length === 0 && !loading ? (
        <Card className="p-10">
          <EmptyState
            icon={CalendarDays}
            title={tab === 'upcoming' ? 'No upcoming appointments' : 'No past appointments'}
            description={tab === 'upcoming' ? 'Schedule your next consultation to stay on track.' : 'Past visit history will appear here.'}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {visible.map((apt) => (
            <Card
              key={apt.id}
              className={`p-4 ${tab === 'upcoming' ? 'border-l-4 border-l-accent bg-accent-light/20' : ''}`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-text-primary">{apt.reason || 'Medical appointment'}</h3>
                    {tab === 'upcoming' && <Badge variant="success">Upcoming</Badge>}
                  </div>
                  <p className="text-sm text-text-secondary flex items-center gap-1.5"><Clock3 className="w-4 h-4" />{format(new Date(apt.appointmentDate), 'EEEE, MMM d, yyyy')}</p>
                  <p className="text-sm text-text-secondary flex items-center gap-1.5"><User className="w-4 h-4" />{apt.doctorName || 'Doctor not specified'}</p>
                  {apt.location && <p className="text-sm text-text-secondary flex items-center gap-1.5"><MapPin className="w-4 h-4" />{apt.location}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {tab === 'upcoming' ? (
                    <>
                      <button
                        onClick={() => handleMarkCompleted(apt.id)}
                        className="h-9 px-3 rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-page-bg inline-flex items-center text-sm"
                      >
                        Mark completed
                      </button>
                      <button
                        onClick={() => handleDelete(apt.id)}
                        className="h-9 px-3 rounded-md border border-border text-text-secondary hover:text-danger hover:bg-danger-light inline-flex items-center text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <Badge variant="default">Completed</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Schedule Appointment">
        <form onSubmit={handleAddAppointment} className="space-y-4">
          <Input
            label="Doctor"
            value={formData.doctorName}
            onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
            required
          />
          <Input
            label="Reason"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Date" type="date" value={formData.appointmentDate} onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })} required />
          </div>
          <Input label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-primary">Notes</label>
            <textarea
              className="w-full border border-border rounded-md px-3 py-2.5 text-sm bg-bg-surface min-h-[90px]"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save appointment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
