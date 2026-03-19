import axiosInstance from './axiosInstance'

export const getMedications    = ()           => axiosInstance.get('/medications').then(r => r.data)
export const getActiveMeds     = ()           => axiosInstance.get('/medications/active').then(r => r.data)
export const getMedicationById = (id)         => axiosInstance.get(`/medications/${id}`).then(r => r.data)
export const createMedication  = (data)       => axiosInstance.post('/medications', data).then(r => r.data)
export const updateMedication  = (id, data)   => axiosInstance.put(`/medications/${id}`, data).then(r => r.data)
export const deleteMedication  = (id)         => axiosInstance.delete(`/medications/${id}`)
