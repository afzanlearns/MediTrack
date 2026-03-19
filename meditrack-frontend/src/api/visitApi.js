import axiosInstance from './axiosInstance'

export const getVisits       = ()           => axiosInstance.get('/visits').then(r => r.data)
export const getVisitById    = (id)         => axiosInstance.get(`/visits/${id}`).then(r => r.data)
export const createVisit     = (data)       => axiosInstance.post('/visits', data).then(r => r.data)
export const updateVisit     = (id, data)   => axiosInstance.put(`/visits/${id}`, data).then(r => r.data)
export const deleteVisit     = (id)         => axiosInstance.delete(`/visits/${id}`)
export const linkMedication  = (visitId, medId) => axiosInstance.post(`/visits/${visitId}/medications/${medId}`).then(r => r.data)
export const unlinkMedication= (visitId, medId) => axiosInstance.delete(`/visits/${visitId}/medications/${medId}`)
