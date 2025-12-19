// API Request/Response Types based on Backend DTOs

// ============= Auth Types =============
export interface LoginRequest {
  email: string
  password: string
  userType: 'Customer' | 'ServiceProvider' | 'Admin'
}

export interface LoginResponse {
  token: string
  refreshToken: string
  expiration: string
  user: UserResponse
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  phoneNumber: string
  userType: 'Customer' | 'ServiceProvider'
  // For Service Provider
  businessName?: string
  skills?: string
  specializations?: string
  experienceInYears?: number
  hourlyRate?: number
  availability?: string
  address?: string
  city?: string
}

export interface RegisterResponse {
  token: string
  refreshToken: string
  expiration: string
  user: UserResponse
}

export interface UserResponse {
  id: string
  email: string
  fullName: string
  role: string
  profileId?: string // Customer or ServiceProvider ID
  isActive: boolean
}

// ============= Customer Types =============
export interface CustomerProfile {
  id: string
  userId: string
  fullName: string
  phoneNumber: string
  address: string
  city: string
  profilePictureUrl?: string
  createdAt: string
  updatedAt?: string
}

export interface UpdateCustomerRequest {
  fullName?: string
  phoneNumber?: string
  address?: string
  city?: string
  profilePictureUrl?: string
}

// ============= Service Provider Types =============
export interface ServiceProviderProfile {
  id: string
  userId: string
  businessName: string
  skills: string
  specializations: string
  experienceInYears: number
  hourlyRate: number
  availability: string
  averageRating: number
  totalReviews: number
  profilePictureUrl?: string
  address: string
  city: string
  phoneNumber?: string
  isVerified: boolean
  createdAt: string
  updatedAt?: string
}

export interface UpdateServiceProviderRequest {
  businessName?: string
  skills?: string
  specializations?: string
  experienceInYears?: number
  hourlyRate?: number
  availability?: string
  address?: string
  city?: string
  phoneNumber?: string
  profilePictureUrl?: string
}

// ============= Service Types =============
export interface Service {
  id: string
  serviceProviderId: string
  serviceCategoryId: string
  title: string
  description: string
  minPrice: number
  maxPrice: number
  estimatedDuration: string
  location: string
  area: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
  serviceCategory?: ServiceCategory
  serviceProvider?: ServiceProviderProfile
}

export interface CreateServiceRequest {
  serviceCategoryId: string
  title: string
  description: string
  minPrice: number
  maxPrice: number
  estimatedDuration: string
  location: string
  area: string
}

export interface UpdateServiceRequest {
  title?: string
  description?: string
  minPrice?: number
  maxPrice?: number
  estimatedDuration?: string
  location?: string
  area?: string
  isActive?: boolean
}

// ============= Service Category Types =============
export interface ServiceCategory {
  id: string
  name: string
  description?: string
  iconUrl?: string
  isActive: boolean
  createdAt: string
}

// ============= Service Request Types =============
export enum ServiceRequestStatus {
  Pending = 0,
  Accepted = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
  Rejected = 5
}

export interface ServiceRequest {
  id: string
  customerId: string
  serviceProviderId: string
  serviceId: string
  description: string
  location: string
  preferredDate?: string
  customerNotes?: string
  providerNotes?: string
  quotedPrice?: number
  status: ServiceRequestStatus
  createdAt: string
  updatedAt?: string
  customer?: CustomerProfile
  serviceProvider?: ServiceProviderProfile
  service?: Service
  review?: Review
}

export interface CreateServiceRequestRequest {
  serviceId: string
  serviceProviderId: string
  description: string
  location: string
  preferredDate?: string
  customerNotes?: string
}

export interface UpdateServiceRequestRequest {
  status?: ServiceRequestStatus
  providerNotes?: string
  quotedPrice?: number
  preferredDate?: string
}

// ============= Review Types =============
export interface Review {
  id: string
  serviceRequestId: string
  customerId: string
  serviceProviderId: string
  rating: number
  comment?: string
  createdAt: string
  customer?: CustomerProfile
  serviceProvider?: ServiceProviderProfile
  serviceRequest?: ServiceRequest
}

export interface CreateReviewRequest {
  serviceRequestId: string
  rating: number
  comment?: string
}

// ============= Pagination =============
export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  pageNumber?: number
  pageSize?: number
}

// ============= API Response =============
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  success: boolean
  errors?: string[]
}

// ============= Error Response =============
export interface ApiError {
  message: string
  status?: number
  data?: any
}

