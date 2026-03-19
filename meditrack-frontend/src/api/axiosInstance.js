import axios from 'axios'

/**
 * Shared Axios instance for all MediTrack API calls.
 * All components import from src/api/ — never call axios directly.
 */
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Global response interceptor.
 * Extracts the error message from the Spring Boot ErrorResponseDTO
 * and dispatches a custom DOM event so Toast.jsx can display it.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'An unexpected error occurred'
    // Dispatch a custom event — Toast.jsx listens for this
    window.dispatchEvent(new CustomEvent('api-error', { detail: message }))
    return Promise.reject(error)
  }
)

export default axiosInstance
