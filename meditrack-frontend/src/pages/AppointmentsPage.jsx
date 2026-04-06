import React, { useEffect, useMemo, useState } from 'react'
import { format, isBefore } from 'date-fns'
import { Plus, Trash2, CheckCheck } from 'lucide-react'
import {
  getAllAppointments,
  createAppointment,
  deleteAppointment,
  markCompleted,
} from '../api/appointmentApi'
import { toast } from '../utils/toast'

const emptyForm = {
  doctorName: '',
  appointmentDate: format(new Date(), 'yyyy-MM-dd'),
  reason: '',
  location: '',
  notes: '',
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('upcoming')
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { fetchAppointments() }, [])

  const fetchAppointments = async () => {
    try {
      const res = await getAllAppointments()
      setAppointments(res.data || [])
    } catch {
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createAppointment(form)
      toast.success('Appointment scheduled.')
      setForm(emptyForm)
      setShowForm(false)
      fetchAppointments()
    } catch {
      toast.error('Failed to add appointment')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteAppointment(id)
      toast.success('Appointment removed.')
      fetchAppointments()
    } catch {
      toast.error('Failed to remove appointment')
    }
  }

  const handleMarkCompleted = async (id) => {
    try {
      await markCompleted(id)
      toast.success('Marked as completed.')
      fetchAppointments()
    } catch {
      toast.error('Failed to update appointment')
    }
  }

  const { upcoming, past } = useMemo(() => {
    const now = new Date()
    const up = [], old = []
    appointments.forEach((item) => {
      if (item.isCompleted || isBefore(new Date(item.appointmentDate), now)) old.push(item)
      else up.push(item)
    })
    return {
      upcoming: up.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)),
      past: old.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)),
    }
  }, [appointments])

  const visible = tab === 'upcoming' ? upcoming : past

  const inputClass = "w-full bg-[#141B23] border border-[#1C2530] rounded-xl px-4 py-3 font-sans text-sm text-[#F0F4F8] placeholder:text-[#3D5166] focus:border-[#00C89650] transition-colors outline-none"

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-5 pt-14 pb-5 flex items-start justify-between">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-[#F0F4F8]">Appointments</h1>
          <p className="font-sans text-sm text-[#3D5166] mt-0.5">{upcoming.length} upcoming</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-9 h-9 rounded-full bg-[#00C896] flex items-center justify-center press"
        >
          <Plus size={18} strokeWidth={2.5} className="text-[#080B0F]" />
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mx-5 mb-4 card px-4 py-4">
          <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#3D5166] mb-4">
            New Appointment
          </h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <input
              type="text"
              placeholder="Doctor Name"
              value={form.doctorName}
              onChange={e => setForm({...form, doctorName: e.target.value})}
              className={inputClass}
              required
            />
            <input
              type="text"
              placeholder="Reason / Specialty"
              value={form.reason}
              onChange={e => setForm({...form, reason: e.target.value})}
              className={inputClass}
            />
            <input
              type="date"
              value={form.appointmentDate}
              onChange={e => setForm({...form, appointmentDate: e.target.value})}
              className={inputClass}
              required
            />
            <input
              type="text"
              placeholder="Location (optional)"
              value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
              className={inputClass}
            />
            <textarea
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={e => setForm({...form, notes: e.target.value})}
              className={`${inputClass} h-20 resize-none`}
            />
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#00C896] text-[#080B0F] font-sans font-semibold text-sm py-3.5 rounded-xl press"
            >
              {saving ? 'Saving...' : 'Schedule Appointment'}
            </button>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="mx-5 mb-4 flex gap-5 border-b border-[#1C2530] pb-0">
        {['upcoming', 'past'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-sans text-sm pb-3 press ${
              tab === t
                ? 'text-[#F0F4F8] font-medium border-b-2 border-[#00C896] -mb-px'
                : 'text-[#3D5166]'
            }`}
          >
            {t[0].toUpperCase() + t.slice(1)} ({t === 'upcoming' ? upcoming.length : past.length})
          </button>
        ))}
      </div>

      {/* Appointment list */}
      <div className="space-y-3">
        {loading ? (
          <div className="mx-5 py-10 text-center">
            <p className="font-mono text-xs text-[#3D5166] animate-pulse">Loading...</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="mx-5 py-12 text-center card text-sm text-[#3D5166]">
            No {tab} appointments.
          </div>
        ) : (
          visible.map((apt) => (
            <div key={apt.id} className="mx-5 card overflow-hidden">
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-sans text-base font-semibold text-[#F0F4F8]">
                    {apt.reason || 'Appointment'}
                  </h3>
                  <span className="font-mono text-[10px] text-[#3D5166] bg-[#141B23] px-2 py-0.5 rounded-md ml-2 flex-shrink-0">
                    {format(new Date(apt.appointmentDate), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#3D5166]">Dr. {apt.doctorName || 'Unknown'}</p>
                {apt.location && (
                  <p className="font-mono text-[11px] text-[#3D5166] mt-0.5">{apt.location}</p>
                )}
              </div>
              {tab === 'upcoming' && (
                <div className="border-t border-[#1C2530] px-4 py-2.5 flex gap-4">
                  <button
                    onClick={() => handleMarkCompleted(apt.id)}
                    className="flex items-center gap-1.5 text-[#00C896] text-xs font-sans press"
                  >
                    <CheckCheck size={11} /> Done
                  </button>
                  <button
                    onClick={() => handleDelete(apt.id)}
                    className="flex items-center gap-1.5 text-[#D95B5B] text-xs font-sans press"
                  >
                    <Trash2 size={11} /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
