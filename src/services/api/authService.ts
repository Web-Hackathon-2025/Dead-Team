import apiClient from './apiClient'
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ApiResponse } from '@/types/api.types'
import config from '@/config/environment'

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/Auth/login', credentials)
    
    if (response.data.success && response.data.data) {
      // Store token and user info
      localStorage.setItem(config.tokenKey, response.data.data.token)
      localStorage.setItem(config.refreshTokenKey, response.data.data.refreshToken)
      localStorage.setItem(config.userKey, JSON.stringify(response.data.data.user))
      
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Login failed')
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>('/Auth/register', data)
    
    if (response.data.success && response.data.data) {
      // Store token and user info
      localStorage.setItem(config.tokenKey, response.data.data.token)
      localStorage.setItem(config.refreshTokenKey, response.data.data.refreshToken)
      localStorage.setItem(config.userKey, JSON.stringify(response.data.data.user))
      
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Registration failed')
  },

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(config.tokenKey)
    localStorage.removeItem(config.refreshTokenKey)
    localStorage.removeItem(config.userKey)
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    const userJson = localStorage.getItem(config.userKey)
    return userJson ? JSON.parse(userJson) : null
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(config.tokenKey)
    return !!token
  },

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem(config.tokenKey)
  },

  /**
   * Refresh token
   */
  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem(config.refreshTokenKey)
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/Auth/refresh-token', {
      refreshToken
    })
    
    if (response.data.success && response.data.data) {
      // Update tokens
      localStorage.setItem(config.tokenKey, response.data.data.token)
      localStorage.setItem(config.refreshTokenKey, response.data.data.refreshToken)
      
      return response.data.data
    }
    
    throw new Error('Token refresh failed')
  },
}

export default authService


