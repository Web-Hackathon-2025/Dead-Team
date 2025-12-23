import apiClient from './apiClient'
import { 
  Review, 
  CreateReviewRequest, 
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '@/types/api.types'

export const reviewService = {
  /**
   * Get all reviews (admin only)
   */
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Review>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Review>>>('/Review', {
      params
    })
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch reviews')
  },

  /**
   * Get review by ID
   */
  async getById(id: string): Promise<Review> {
    const response = await apiClient.get<ApiResponse<Review>>(`/Review/${id}`)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch review')
  },

  /**
   * Get reviews by customer ID
   */
  async getByCustomerId(customerId: string): Promise<Review[]> {
    const response = await apiClient.get<ApiResponse<Review[]>>(`/Review/customer/${customerId}`)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch reviews')
  },

  /**
   * Get reviews by provider ID
   */
  async getByProviderId(providerId: string, params?: PaginationParams): Promise<PaginatedResponse<Review>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Review>>>(`/Review/provider/${providerId}`, {
      params
    })
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch reviews')
  },

  /**
   * Get review by service request ID
   */
  async getByServiceRequestId(serviceRequestId: string): Promise<Review> {
    const response = await apiClient.get<ApiResponse<Review>>(`/Review/service-request/${serviceRequestId}`)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch review')
  },

  /**
   * Create new review
   */
  async create(data: CreateReviewRequest): Promise<Review> {
    const response = await apiClient.post<ApiResponse<Review>>('/Review', data)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to create review')
  },

  /**
   * Update review
   */
  async update(id: string, data: { rating?: number; comment?: string }): Promise<Review> {
    const response = await apiClient.put<ApiResponse<Review>>(`/Review/${id}`, data)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to update review')
  },

  /**
   * Delete review
   */
  async delete(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse>(`/Review/${id}`)
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete review')
    }
  },

  /**
   * Get my reviews (customer's own reviews)
   */
  async getMyReviews(): Promise<Review[]> {
    const response = await apiClient.get<ApiResponse<Review[]>>('/Review/my-reviews')
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to fetch your reviews')
  },
}

export default reviewService



