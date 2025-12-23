import apiClient from './apiClient'
import { 
  ServiceProviderProfile, 
  UpdateServiceProviderRequest, 
  ApiResponse, 
  PaginatedResponse,
  PaginationParams 
} from '@/types/api.types'

export const serviceProviderService = {
  /**
   * Get service provider profile
   */
  async getProfile(): Promise<ServiceProviderProfile> {
    const response = await apiClient.get<ApiResponse<ServiceProviderProfile>>('/ServiceProvider/profile')
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch profile')
  },

  /**
   * Get service provider by ID
   */
  async getById(id: string): Promise<ServiceProviderProfile> {
    const response = await apiClient.get<ApiResponse<ServiceProviderProfile>>(`/ServiceProvider/${id}`)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch service provider')
  },

  /**
   * Update service provider profile
   */
  async updateProfile(data: UpdateServiceProviderRequest): Promise<ServiceProviderProfile> {
    const response = await apiClient.put<ApiResponse<ServiceProviderProfile>>('/ServiceProvider/profile', data)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to update profile')
  },

  /**
   * Get all service providers with pagination
   */
  async getAll(params?: PaginationParams & {
    city?: string
    category?: string
    minRating?: number
    searchTerm?: string
  }): Promise<PaginatedResponse<ServiceProviderProfile>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<ServiceProviderProfile>>>('/ServiceProvider', {
      params
    })
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch service providers')
  },

  /**
   * Search service providers
   */
  async search(searchTerm: string, params?: PaginationParams): Promise<PaginatedResponse<ServiceProviderProfile>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<ServiceProviderProfile>>>('/ServiceProvider/search', {
      params: {
        searchTerm,
        ...params
      }
    })
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Search failed')
  },

  /**
   * Get service providers by city
   */
  async getByCity(city: string, params?: PaginationParams): Promise<PaginatedResponse<ServiceProviderProfile>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<ServiceProviderProfile>>>(`/ServiceProvider/city/${city}`, {
      params
    })
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch providers')
  },

  /**
   * Get service providers by category
   */
  async getByCategory(categoryId: string, params?: PaginationParams): Promise<PaginatedResponse<ServiceProviderProfile>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<ServiceProviderProfile>>>(`/ServiceProvider/category/${categoryId}`, {
      params
    })
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch providers')
  },

  /**
   * Get top rated service providers
   */
  async getTopRated(limit: number = 10): Promise<ServiceProviderProfile[]> {
    const response = await apiClient.get<ApiResponse<ServiceProviderProfile[]>>('/ServiceProvider/top-rated', {
      params: { limit }
    })
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch top rated providers')
  },
}

export default serviceProviderService



