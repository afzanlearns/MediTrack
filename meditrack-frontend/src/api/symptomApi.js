import axiosInstance from './axiosInstance'
import { guestStorage } from '../services/guestStorage'

const isGuest = () => 
  !localStorage.getItem('meditrack_token') && 
  localStorage.getItem('meditrack_guest') === 'true'

export const getSymptoms = async (params) => {
  if (isGuest()) return guestStorage.getSymptoms()
  const res = await axiosInstance.get('/symptoms', { params })
  return res.data
}

export const getSymptomNames = async () => {
  if (isGuest()) {
    const syms = guestStorage.getSymptoms();
    return Array.from(new Set(syms.map(s => s.name)));
  }
  const res = await axiosInstance.get('/symptoms/names')
  return res.data
}

export const saveSymptom = async (data) => {
  if (isGuest()) return guestStorage.saveSymptom(data)
  const res = await axiosInstance.post('/symptoms', data)
  return res.data
}

export const logSymptom = async (data) => {
  if (isGuest()) return guestStorage.saveSymptom(data)
  const res = await axiosInstance.post('/symptoms', data)
  return res.data
}

export const updateSymptom = async (id, data) => {
  if (isGuest()) return guestStorage.updateItem('symptoms', id, data)
  const res = await axiosInstance.put(`/symptoms/${id}`, data)
  return res.data
}

export const deleteSymptom = async (id) => {
  if (isGuest()) return guestStorage.deleteSymptom(id)
  const res = await axiosInstance.delete(`/symptoms/${id}`)
  return res.data
}

const symptomApi = {
  getSymptoms,
  getSymptomNames,
  saveSymptom,
  logSymptom,
  updateSymptom,
  deleteSymptom
};

export default symptomApi;
