import axiosInstance from './axiosInstance'

export const getSymptoms     = (params) => axiosInstance.get('/symptoms', { params }).then(r => r.data)
export const getSymptomNames = ()        => axiosInstance.get('/symptoms/names').then(r => r.data)
export const logSymptom      = (data)    => axiosInstance.post('/symptoms', data).then(r => r.data)
export const updateSymptom   = (id, data)=> axiosInstance.put(`/symptoms/${id}`, data).then(r => r.data)
export const deleteSymptom   = (id)      => axiosInstance.delete(`/symptoms/${id}`)
