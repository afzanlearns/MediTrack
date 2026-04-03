import axiosInstance from './axiosInstance'
import { guestStorage } from '../services/guestStorage'

const isGuest = () => 
  !localStorage.getItem('meditrack_token') && 
  localStorage.getItem('meditrack_guest') === 'true'

export const getVisits = async () => {
  if (isGuest()) return guestStorage.getVisits()
  const res = await axiosInstance.get('/visits')
  return res.data
}

export const getVisitById = async (id) => {
  if (isGuest()) return guestStorage.getVisits().find(v => v.id === id)
  const res = await axiosInstance.get(`/visits/${id}`)
  return res.data
}

export const saveVisit = async (data) => {
  if (isGuest()) return guestStorage.saveVisit(data)
  const res = await axiosInstance.post('/visits', data)
  return res.data
}

export const createVisit = async (data) => {
  if (isGuest()) return guestStorage.saveVisit(data)
  const res = await axiosInstance.post('/visits', data)
  return res.data
}

export const updateVisit = async (id, data) => {
  if (isGuest()) return guestStorage.updateVisit(id, data)
  const res = await axiosInstance.put(`/visits/${id}`, data)
  return res.data
}

export const deleteVisit = async (id) => {
  if (isGuest()) return guestStorage.deleteVisit(id)
  const res = await axiosInstance.delete(`/visits/${id}`)
  return res.data
}

export const linkMedication = async (visitId, medId) => {
  if (isGuest()) {
    const visit = guestStorage.getVisits().find(v => v.id === visitId);
    if (visit) {
      visit.linkedMedications = visit.linkedMedications || [];
      visit.linkedMedications.push(medId);
      guestStorage.updateVisit(visitId, visit);
    }
    return visit;
  }
  const res = await axiosInstance.post(`/visits/${visitId}/medications/${medId}`)
  return res.data
}

export const unlinkMedication = async (visitId, medId) => {
  if (isGuest()) {
    const visit = guestStorage.getVisits().find(v => v.id === visitId);
    if (visit) {
      visit.linkedMedications = visit.linkedMedications?.filter(id => id !== medId);
      guestStorage.updateVisit(visitId, visit);
    }
    return visit;
  }
  const res = await axiosInstance.delete(`/visits/${visitId}/medications/${medId}`)
  return res.data
}

const visitApi = {
  getVisits,
  getVisitById,
  saveVisit,
  createVisit,
  updateVisit,
  deleteVisit,
  linkMedication,
  unlinkMedication
};

export default visitApi;
