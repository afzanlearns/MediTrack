import axiosInstance from './axiosInstance'
import { guestStorage } from '../services/guestStorage'

const isGuest = () => 
  !localStorage.getItem('meditrack_token') && 
  localStorage.getItem('meditrack_guest') === 'true'

export const getDashboardSummary = async () => {
  if (isGuest()) return guestStorage.getSummary()
  const res = await axiosInstance.get('/dashboard/summary')
  return res.data
}

const dashboardApi = {
  getDashboardSummary
};

export default dashboardApi;
