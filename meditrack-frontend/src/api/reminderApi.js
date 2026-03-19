import axiosInstance from './axiosInstance'

export const getPendingReminders = () =>
  axiosInstance.get('/reminders/pending').then(r => r.data)
