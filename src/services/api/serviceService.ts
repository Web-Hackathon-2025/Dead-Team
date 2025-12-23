import apiClient from './apiClient'
import { 
  Service, 
  CreateServiceRequest, 
  UpdateServiceRequest, 
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  ServiceCategory
} from '@/types/api.types'

export const serviceService = {
  /**
   * Get all services with pagination
   */
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Service>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Service>>>('/Service', {
      params
    })
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch services')
  },

  /**
   * Get service by ID
   */
  async getById(id: string): Promise<Service> {
    const response = await apiClient.get<ApiResponse<Service>>(`/Service/${id}`)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch service')
  },

  /**
   * Get services by provider ID
   */
  async getByProviderId(providerId: string): Promise<Service[]> {
    const response = await apiClient.get<ApiResponse<Service[]>>(`/Service/provider/${providerId}`)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch services')
  },

  /**
   * Get services by category
   */
  async getByCategory(categoryId: string, params?: PaginationParams): Promise<PaginatedResponse<Service>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Service>>>(`/Service/category/${categoryId}`, {
      params
    })
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch services')
  },

  /**
   * Create new service
   */
  async create(data: CreateServiceRequest): Promise<Service> {
    const response = await apiClient.post<ApiResponse<Service>>('/Service', data)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to create service')
  },

  /**
   * Update service
   */
  async update(id: string, data: UpdateServiceRequest): Promise<Service> {
    const response = await apiClient.put<ApiResponse<Service>>(`/Service/${id}`, data)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to update service')
  },

  /**
   * Delete service
   */
  async delete(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse>(`/Service/${id}`)
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete service')
    }
  },

  /**
   * Search services
   */
  async search(searchTerm: string, params?: PaginationParams): Promise<PaginatedResponse<Service>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Service>>>('/Service/search', {
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
   * Get all service categories
   */
  async getCategories(): Promise<ServiceCategory[]> {
    const response = await apiClient.get<ApiResponse<ServiceCategory[]>>('/ServiceCategory')
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch categories')
  },

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<ServiceCategory> {
    const response = await apiClient.get<ApiResponse<ServiceCategory>>(`/ServiceCategory/${id}`)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch category')
  },
}

export default serviceService



