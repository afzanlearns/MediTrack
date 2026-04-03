import axiosInstance from './axiosInstance';

export const getIceContacts = () => axiosInstance.get('/ice-contacts');
export const createIceContact = (data) => axiosInstance.post('/ice-contacts', data);
export const updateIceContact = (id, data) => axiosInstance.put(`/ice-contacts/${id}`, data);
export const deleteIceContact = (id) => axiosInstance.delete(`/ice-contacts/${id}`);

export const getProfile = () => axiosInstance.get('/profile');
export const updateProfile = (data) => axiosInstance.put('/profile', data);
