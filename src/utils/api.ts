// utils/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
})

// Add token to requests if available (except for auth endpoints)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  const isAuthEndpoint = config.url?.includes('/auth/')
  
  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle responses and errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err)
    return Promise.reject(err)
  }
)



export default api
