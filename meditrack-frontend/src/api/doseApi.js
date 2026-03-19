import axiosInstance from './axiosInstance'

/** Fetch doses for a specific date (YYYY-MM-DD) */
export const getDosesForDate = (date) =>
  axiosInstance.get('/doses', { params: { date } }).then(r => r.data)

/** Fetch doses within a date range, with optional status filter */
export const getDosesByRange = (from, to, status) =>
  axiosInstance.get('/doses', { params: { from, to, ...(status ? { status } : {}) } }).then(r => r.data)

/** Auto-generate PENDING dose entries for a given date */
export const generateDoses = (date) =>
  axiosInstance.post('/doses/generate', null, { params: { date } }).then(r => r.data)

/** Update a dose's status (TAKEN | MISSED | SKIPPED) */
export const updateDoseStatus = (id, status) =>
  axiosInstance.patch(`/doses/${id}/status`, { status }).then(r => r.data)
