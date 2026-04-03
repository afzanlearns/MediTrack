import axiosInstance from './axiosInstance'
import { guestStorage } from '../services/guestStorage'

const isGuest = () => 
  !localStorage.getItem('meditrack_token') && 
  localStorage.getItem('meditrack_guest') === 'true'

export const getMedications = async () => {
  if (isGuest()) return guestStorage.getMedications()
  const res = await axiosInstance.get('/medications')
  return res.data
}

export const createMedication = async (data) => {
  if (isGuest()) return guestStorage.saveMedication(data)
  const res = await axiosInstance.post('/medications', data)
  return res.data
}

export const updateMedication = async (id, data) => {
  if (isGuest()) return guestStorage.updateMedication(id, data)
  const res = await axiosInstance.put(`/medications/${id}`, data)
  return res.data
}

export const deleteMedication = async (id) => {
  if (isGuest()) return guestStorage.deleteMedication(id)
  const res = await axiosInstance.delete(`/medications/${id}`)
  return res.data
}

export const getActiveMeds = async () => {
  if (isGuest()) return guestStorage.getMedications().filter(m => m.active !== false)
  const res = await axiosInstance.get('/medications/active')
  return res.data
}

export const getMedicationById = async (id) => {
  if (isGuest()) return guestStorage.getMedications().find(m => m.id === id)
  const res = await axiosInstance.get(`/medications/${id}`)
  return res.data
}

const medicationApi = {
  getMedications,
  getActiveMeds,
  getMedicationById,
  createMedication,
  updateMedication,
  deleteMedication
};

export default medicationApi;
