import axiosInstance from './axiosInstance';
import { guestStorage } from '../services/guestStorage'

const isGuest = () => 
  !localStorage.getItem('meditrack_token') && 
  localStorage.getItem('meditrack_guest') === 'true'

export const getVitals = async (from, to) => {
  if (isGuest()) {
    const vitals = guestStorage.getVitals();
    const filtered = vitals.filter(v => {
      const d = v.createdAt || v.date;
      return (!from || d >= from) && (!to || d <= to);
    });
    return { data: filtered };
  }
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  return axiosInstance.get('/vitals', { params });
};

export const saveVitals = async (data) => {
  if (isGuest()) return guestStorage.saveVitals(data)
  const res = await axiosInstance.post('/vitals', data)
  return res.data
}

export const logVitals = async (data) => {
  if (isGuest()) return guestStorage.saveVitals(data)
  return axiosInstance.post('/vitals', data);
}

export const updateVitals = async (id, data) => {
  if (isGuest()) return guestStorage.updateItem('vitals', id, data)
  return axiosInstance.put(`/vitals/${id}`, data);
}

export const deleteVitals = async (id) => {
  if (isGuest()) return guestStorage.deleteVitals(id)
  return axiosInstance.delete(`/vitals/${id}`);
}

const vitalsApi = {
  getVitals,
  saveVitals,
  logVitals,
  updateVitals,
  deleteVitals
};

export default vitalsApi;
