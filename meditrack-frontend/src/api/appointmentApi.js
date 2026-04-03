import axiosInstance from './axiosInstance';

export const getAllAppointments = () => axiosInstance.get('/appointments');
export const getUpcomingAppointments = () => axiosInstance.get('/appointments/upcoming');
export const createAppointment = (data) => axiosInstance.post('/appointments', data);
export const updateAppointment = (id, data) => axiosInstance.put(`/appointments/${id}`, data);
export const markCompleted = (id) => axiosInstance.patch(`/appointments/${id}/complete`);
export const deleteAppointment = (id) => axiosInstance.delete(`/appointments/${id}`);
