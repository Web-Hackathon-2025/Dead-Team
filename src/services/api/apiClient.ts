import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import config from '@/config/environment'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(config.tokenKey)
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Clear auth data
      localStorage.removeItem(config.tokenKey)
      localStorage.removeItem(config.userKey)
      localStorage.removeItem(config.refreshTokenKey)
      
      // Redirect to login
      window.location.href = '/login'
      
      return Promise.reject(error)
    }

    // Handle other errors
    const errorMessage = error.response?.data 
      ? (error.response.data as any).message || 'An error occurred'
      : error.message || 'Network error'

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    })
  }
)

export default apiClient



