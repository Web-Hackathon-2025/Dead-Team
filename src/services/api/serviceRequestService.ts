import apiClient from './apiClient'
import { 
  ServiceRequest, 
  CreateServiceRequestRequest, 
  UpdateServiceRequestRequest, 
  ServiceRequestStatus,
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '@/types/api.types'

export const serviceRequestService = {
  /**
   * Get all service requests (admin only)
   */
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<ServiceRequest>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<ServiceRequest>>>('/ServiceRequest', {
      params
    })
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch service requests')
  },

  /**
   * Get service request by ID
   */
  async getById(id: string): Promise<ServiceRequest> {
    const response = await apiClient.get<ApiResponse<ServiceRequest>>(`/ServiceRequest/${id}`)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch service request')
  },

  /**
   * Get service requests by customer ID
   */
  async getByCustomerId(customerId: string): Promise<ServiceRequest[]> {
    const response = await apiClient.get<ApiResponse<ServiceRequest[]>>(`/ServiceRequest/customer/${customerId}`)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch requests')
  },

  /**
   * Get service requests by provider ID
   */
  async getByProviderId(providerId: string): Promise<ServiceRequest[]> {
    const response = await apiClient.get<ApiResponse<ServiceRequest[]>>(`/ServiceRequest/provider/${providerId}`)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch requests')
  },

  /**
   * Get customer's own service requests
   */
  async getMyRequests(): Promise<ServiceRequest[]> {
    const response = await apiClient.get<ApiResponse<ServiceRequest[]>>('/ServiceRequest/my-requests')
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch your requests')
  },

  /**
   * Get provider's received requests
   */
  async getReceivedRequests(): Promise<ServiceRequest[]> {
    const response = await apiClient.get<ApiResponse<ServiceRequest[]>>('/ServiceRequest/received-requests')
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch received requests')
  },

  /**
   * Create new service request
   */
  async create(data: CreateServiceRequestRequest): Promise<ServiceRequest> {
    const response = await apiClient.post<ApiResponse<ServiceRequest>>('/ServiceRequest', data)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to create service request')
  },

  /**
   * Update service request
   */
  async update(id: string, data: UpdateServiceRequestRequest): Promise<ServiceRequest> {
    const response = await apiClient.put<ApiResponse<ServiceRequest>>(`/ServiceRequest/${id}`, data)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to update service request')
  },

  /**
   * Update service request status
   */
  async updateStatus(id: string, status: ServiceRequestStatus): Promise<ServiceRequest> {
    const response = await apiClient.patch<ApiResponse<ServiceRequest>>(`/ServiceRequest/${id}/status`, {
      status
    })
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to update status')
  },

  /**
   * Accept service request (provider)
   */
  async accept(id: string, quotedPrice?: number): Promise<ServiceRequest> {
    return this.updateStatus(id, ServiceRequestStatus.Accepted)
  },

  /**
   * Reject service request (provider)
   */
  async reject(id: string): Promise<ServiceRequest> {
    return this.updateStatus(id, ServiceRequestStatus.Rejected)
  },

  /**
   * Start service (provider)
   */
  async startService(id: string): Promise<ServiceRequest> {
    return this.updateStatus(id, ServiceRequestStatus.InProgress)
  },

  /**
   * Complete service (provider)
   */
  async complete(id: string): Promise<ServiceRequest> {
    return this.updateStatus(id, ServiceRequestStatus.Completed)
  },

  /**
   * Cancel service request (customer)
   */
  async cancel(id: string): Promise<ServiceRequest> {
    return this.updateStatus(id, ServiceRequestStatus.Cancelled)
  },

  /**
   * Delete service request
   */
  async delete(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse>(`/ServiceRequest/${id}`)
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete service request')
    }
  },
}

export default serviceRequestService





