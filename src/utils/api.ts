// utils/api.ts
import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { notify } from '@/utils/notify'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://albab.code7x.com/api/dashboard',
  timeout: import.meta.env.VITE_API_TIMEOUT || 10000,
})

// Add token to requests if available (except for auth endpoints)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  const resetToken = localStorage.getItem('reset_token')
  const isAuthEndpoint = config.url?.includes('/auth/') || config.url?.includes('/login')
  
  // Use reset token for password reset endpoint
  if (resetToken && config.url?.includes('/reset-password')) {
    config.headers.Authorization = `Bearer ${resetToken}`
  }
  // Use regular token for other endpoints
  else if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Set Accept-Language header for backend localization
  const currentLocale = localStorage.getItem('locale') || 'en'
  config.headers['Accept-Language'] = currentLocale
  
  // Set Content-Type for FormData
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data'
  }
  
  return config
})

// Handle responses and errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err)
    
    // Handle authentication errors
    if (err.response?.status === 401 || err.response?.status === 403) {
      // Clear auth data using store
      const authStore = useAuthStore()
      authStore.clearAuthData()
      
      // Show notification to user
      notify('warning', 'err.response?.data?.message || Session expired ', 'err.response?.data?.errors?.permission ||Please login again ')
      
      // Redirect to login page using Vue Router
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }
    
    // Handle network errors or server errors that might indicate auth issues
    if (!err.response && err.code === 'NETWORK_ERROR') {
      console.warn('Network error detected, but not redirecting to avoid infinite loops')
    }
    
    return Promise.reject(err)
  }
)



export default api
