import axiosInstance from './axiosInstance'
import { guestStorage } from '../services/guestStorage'

const parseCustomGuestTimes = (str) => {
  return str.split(',').map(s => {
    const t = s.trim().toUpperCase()
    if (!t) return null
    // Try to parse AM/PM
    const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/)
    if (!match) return t // Fallback to raw string if it's already 24h or weird
    
    let [_, hh, mm, p] = match
    let h = parseInt(hh)
    if (p === 'PM' && h < 12) h += 12
    if (p === 'AM' && h === 12) h = 0
    return `${String(h).padStart(2, '0')}:${mm}`
  }).filter(Boolean)
}

const isGuest = () =>
  !localStorage.getItem('meditrack_token') &&
  localStorage.getItem('meditrack_guest') === 'true'

const toDateKey = (dose) => {
  if (dose.date) return dose.date
  if (dose.scheduledTime) return String(dose.scheduledTime).slice(0, 10)
  if (dose.createdAt) return String(dose.createdAt).slice(0, 10)
  return null
}

export const getDosesForDate = async (date) => {
  if (isGuest()) {
    return guestStorage.getDoses().filter((dose) => toDateKey(dose) === date)
  }
  const res = await axiosInstance.get('/doses', { params: { date } })
  return res.data
}

export const getDosesByRange = async (from, to, status) => {
  if (isGuest()) {
    return guestStorage.getDoses().filter((dose) => {
      const doseDate = toDateKey(dose)
      if (!doseDate) return false
      const inRange = doseDate >= from && doseDate <= to
      const matchesStatus = !status || dose.status === status
      return inRange && matchesStatus
    })
  }

  const res = await axiosInstance.get('/doses', {
    params: { from, to, ...(status ? { status } : {}) },
  })
  return res.data
}

export const generateDoses = async (date) => {
  if (isGuest()) {
    const meds = guestStorage.getMedications().filter((m) => {
      const active = m.isActive !== false && m.active !== false
      const started = !m.startDate || m.startDate <= date
      const notEnded = !m.endDate || m.endDate >= date
      return active && started && notEnded
    })
    const existing = guestStorage.getDoses().filter((d) => toDateKey(d) === date)

    if (existing.length > 0) return existing

    const slots = ['08:00', '14:00', '20:00']
    const generated = meds.flatMap((med) => {
      const frequency = med.frequency || 'ONCE_DAILY'
      
      let times = []
      if (frequency === 'CUSTOM' && med.customTimings) {
        times = parseCustomGuestTimes(med.customTimings)
      } else {
        const count =
          frequency === 'THREE_TIMES_DAILY' || frequency === 'EVERY_8_HOURS'
            ? 3
            : frequency === 'TWICE_DAILY'
              ? 2
              : 1
        times = slots.slice(0, count)
      }

      return times.map((time) =>
        guestStorage.saveDose({
          medicationId: med.id,
          medicationName: med.name,
          medicationDosage: med.dosage,
          date,
          time,
          status: 'PENDING',
        }),
      )
    })

    // Return the full list for today
    return guestStorage.getDoses().filter((d) => toDateKey(d) === date)
  }

  const res = await axiosInstance.post('/doses/generate', null, { params: { date } })
  return res.data
}

export const updateDoseStatus = async (id, status, notes = null) => {
  if (isGuest()) return guestStorage.updateDose(id, { status, notes })
  const res = await axiosInstance.patch(`/doses/${id}/status`, { status, notes })
  return res.data
}

export const createDose = async (data) => {
  if (isGuest()) return guestStorage.saveDose(data)
  const res = await axiosInstance.post('/doses', data)
  return res.data
}

const doseApi = {
  getDosesForDate,
  getDosesByRange,
  generateDoses,
  updateDoseStatus,
  createDose,
}

export default doseApi
