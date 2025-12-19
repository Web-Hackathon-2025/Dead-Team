// Central storage management for the application

export interface ServiceRequest {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  providerId: string
  providerName: string
  providerPhone: string
  service: string
  category: string
  description: string
  location: string
  preferredDate: string
  preferredTime: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  price?: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  customerId: string
  customerName: string
  providerId: string
  providerName: string
  requestId: string
  rating: number
  comment: string
  service: string
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  type: 'new_request' | 'request_update' | 'review_received' | 'request_cancelled'
  title: string
  message: string
  read: boolean
  createdAt: string
  relatedId?: string
}

// Storage keys
const STORAGE_KEYS = {
  REQUESTS: 'karigar_requests',
  REVIEWS: 'karigar_reviews',
  NOTIFICATIONS: 'karigar_notifications',
}

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error)
    return defaultValue
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

// Service Requests
export const requestStorage = {
  getAll: (): ServiceRequest[] => {
    return getFromStorage<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, [])
  },

  getById: (id: string): ServiceRequest | undefined => {
    const requests = requestStorage.getAll()
    return requests.find(r => r.id === id)
  },

  getByCustomerId: (customerId: string): ServiceRequest[] => {
    const requests = requestStorage.getAll()
    return requests.filter(r => r.customerId === customerId)
  },

  getByProviderId: (providerId: string): ServiceRequest[] => {
    const requests = requestStorage.getAll()
    return requests.filter(r => r.providerId === providerId)
  },

  create: (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>): ServiceRequest => {
    const requests = requestStorage.getAll()
    const newRequest: ServiceRequest = {
      ...request,
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    requests.push(newRequest)
    saveToStorage(STORAGE_KEYS.REQUESTS, requests)
    return newRequest
  },

  update: (id: string, updates: Partial<ServiceRequest>): ServiceRequest | null => {
    const requests = requestStorage.getAll()
    const index = requests.findIndex(r => r.id === id)
    if (index === -1) return null

    requests[index] = {
      ...requests[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    saveToStorage(STORAGE_KEYS.REQUESTS, requests)
    return requests[index]
  },

  delete: (id: string): boolean => {
    const requests = requestStorage.getAll()
    const filtered = requests.filter(r => r.id !== id)
    if (filtered.length === requests.length) return false
    saveToStorage(STORAGE_KEYS.REQUESTS, filtered)
    return true
  },
}

// Reviews
export const reviewStorage = {
  getAll: (): Review[] => {
    return getFromStorage<Review[]>(STORAGE_KEYS.REVIEWS, [])
  },

  getById: (id: string): Review | undefined => {
    const reviews = reviewStorage.getAll()
    return reviews.find(r => r.id === id)
  },

  getByCustomerId: (customerId: string): Review[] => {
    const reviews = reviewStorage.getAll()
    return reviews.filter(r => r.customerId === customerId)
  },

  getByProviderId: (providerId: string): Review[] => {
    const reviews = reviewStorage.getAll()
    return reviews.filter(r => r.providerId === providerId)
  },

  create: (review: Omit<Review, 'id' | 'createdAt'>): Review => {
    const reviews = reviewStorage.getAll()
    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    reviews.push(newReview)
    saveToStorage(STORAGE_KEYS.REVIEWS, reviews)
    return newReview
  },

  delete: (id: string): boolean => {
    const reviews = reviewStorage.getAll()
    const filtered = reviews.filter(r => r.id !== id)
    if (filtered.length === reviews.length) return false
    saveToStorage(STORAGE_KEYS.REVIEWS, filtered)
    return true
  },
}

// Notifications
export const notificationStorage = {
  getAll: (): Notification[] => {
    return getFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, [])
  },

  getByUserId: (userId: string): Notification[] => {
    const notifications = notificationStorage.getAll()
    return notifications.filter(n => n.userId === userId)
  },

  getUnreadCount: (userId: string): number => {
    const notifications = notificationStorage.getByUserId(userId)
    return notifications.filter(n => !n.read).length
  },

  create: (notification: Omit<Notification, 'id' | 'createdAt'>): Notification => {
    const notifications = notificationStorage.getAll()
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    notifications.push(newNotification)
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications)
    return newNotification
  },

  markAsRead: (id: string): boolean => {
    const notifications = notificationStorage.getAll()
    const notification = notifications.find(n => n.id === id)
    if (!notification) return false
    notification.read = true
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications)
    return true
  },

  markAllAsRead: (userId: string): void => {
    const notifications = notificationStorage.getAll()
    notifications.forEach(n => {
      if (n.userId === userId) n.read = true
    })
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications)
  },

  delete: (id: string): boolean => {
    const notifications = notificationStorage.getAll()
    const filtered = notifications.filter(n => n.id !== id)
    if (filtered.length === notifications.length) return false
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, filtered)
    return true
  },
}

// Helper to create notification when a request is created
export function createRequestNotification(request: ServiceRequest): void {
  notificationStorage.create({
    userId: request.providerId,
    type: 'new_request',
    title: 'New Service Request',
    message: `${request.customerName} requested ${request.service}`,
    read: false,
    relatedId: request.id,
  })
}

// Helper to create notification when a request status changes
export function createRequestUpdateNotification(request: ServiceRequest, previousStatus: string): void {
  notificationStorage.create({
    userId: request.customerId,
    type: 'request_update',
    title: 'Request Status Updated',
    message: `Your ${request.service} request is now ${request.status}`,
    read: false,
    relatedId: request.id,
  })
}

// Helper to create notification when a review is received
export function createReviewNotification(review: Review): void {
  notificationStorage.create({
    userId: review.providerId,
    type: 'review_received',
    title: 'New Review Received',
    message: `${review.customerName} left a ${review.rating}-star review`,
    read: false,
    relatedId: review.id,
  })
}

