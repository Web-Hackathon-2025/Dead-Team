import apiClient from './apiClient'
import { CustomerProfile, UpdateCustomerRequest, ApiResponse } from '@/types/api.types'

export const customerService = {
  /**
   * Get customer profile by user ID
   */
  async getProfile(): Promise<CustomerProfile> {
    const response = await apiClient.get<ApiResponse<CustomerProfile>>('/Customer/profile')
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch profile')
  },

  /**
   * Get customer by ID
   */
  async getById(id: string): Promise<CustomerProfile> {
    const response = await apiClient.get<ApiResponse<CustomerProfile>>(`/Customer/${id}`)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch customer')
  },

  /**
   * Update customer profile
   */
  async updateProfile(data: UpdateCustomerRequest): Promise<CustomerProfile> {
    const response = await apiClient.put<ApiResponse<CustomerProfile>>('/Customer/profile', data)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to update profile')
  },

  /**
   * Get all customers (admin only)
   */
  async getAll(): Promise<CustomerProfile[]> {
    const response = await apiClient.get<ApiResponse<CustomerProfile[]>>('/Customer')
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch customers')
  },
}

export default customerService



