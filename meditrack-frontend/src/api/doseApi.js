import axiosInstance from './axiosInstance'
import { guestStorage } from '../services/guestStorage'

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
    const meds = guestStorage.getMedications().filter((m) => m.isActive !== false && m.active !== false)
    const existing = guestStorage.getDoses().filter((d) => toDateKey(d) === date)

    if (existing.length > 0) return existing

    const slots = ['08:00', '14:00', '20:00']
    const generated = meds.flatMap((med) => {
      const frequency = med.frequency || 'ONCE_DAILY'
      const count =
        frequency === 'THREE_TIMES_DAILY' || frequency === 'EVERY_8_HOURS'
          ? 3
          : frequency === 'TWICE_DAILY'
            ? 2
            : 1

      return slots.slice(0, count).map((time) =>
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

export const updateDoseStatus = async (id, status) => {
  if (isGuest()) return guestStorage.updateDose(id, { status })
  const res = await axiosInstance.patch(`/doses/${id}/status`, { status })
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
