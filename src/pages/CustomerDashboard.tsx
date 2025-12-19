import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MapPin, 
  Star, 
  Clock, 
  Calendar,
  Edit,
  LogOut,
  Phone
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Header } from '../components/ui/header-3'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { requestStorage, reviewStorage, ServiceRequest as StorageRequest, Review, createReviewNotification } from '../lib/storage'

interface ServiceRequest {
  id: string
  providerName: string
  category: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  date: string
  time: string
  address: string
  price: string
  providerPhone?: string
}

const CustomerDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'requests' | 'reviews' | 'profile'>('requests')
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [userReviews, setUserReviews] = useState<Review[]>([])
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+92 300 1234567',
    location: 'Karachi, Pakistan',
    address: '123 Main Street, Karachi'
  })
  const [showReviewModal, setShowReviewModal] = useState<string | null>(null)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })

  // Load data from localStorage on mount
  useEffect(() => {
    if (user) {
      // Load requests
      const requests = requestStorage.getByCustomerId(user.id)
      // Convert to local interface format
      const formattedRequests: ServiceRequest[] = requests.map(req => ({
        id: req.id,
        providerName: req.providerName,
        category: req.category,
        status: req.status,
        date: req.preferredDate,
        time: req.preferredTime,
        address: req.location,
        price: req.price || 'TBD',
        providerPhone: req.providerPhone
      }))
      setServiceRequests(formattedRequests)

      // Load reviews
      const reviews = reviewStorage.getByCustomerId(user.id)
      setUserReviews(reviews)
    }
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleCancelRequest = (requestId: string) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      setServiceRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: 'cancelled' as const } : req
        )
      )
      alert('Request cancelled successfully!')
    }
  }

  const handleWhatsApp = (phone?: string) => {
    if (!phone) {
      alert('Phone number not available')
      return
    }
    // Remove any spaces, dashes, or plus signs for WhatsApp URL
    const cleanPhone = phone.replace(/[\s\-+]/g, '')
    const whatsappUrl = `https://wa.me/${cleanPhone}`
    window.open(whatsappUrl, '_blank')
  }

  const handleTrackService = (requestId: string) => {
    const request = serviceRequests.find(r => r.id === requestId)
    alert(`Tracking service: ${request?.providerName} - ${request?.category}`)
  }

  const handleLeaveReview = (requestId: string) => {
    setShowReviewModal(requestId)
  }

  const handleSubmitReview = () => {
    if (showReviewModal && user) {
      // Find the request
      const request = serviceRequests.find(req => req.id === showReviewModal)
      if (!request) return

      // Get the full request from storage to get provider details
      const fullRequest = requestStorage.getById(showReviewModal)
      if (!fullRequest) return

      // Validation
      if (!reviewData.comment.trim()) {
        alert('Please write a comment for your review')
        return
      }

      // Create review
      const newReview = reviewStorage.create({
        customerId: user.id,
        customerName: user.name,
        providerId: fullRequest.providerId,
        providerName: fullRequest.providerName,
        requestId: showReviewModal,
        rating: reviewData.rating,
        comment: reviewData.comment,
        service: fullRequest.service
      })

      // Create notification for provider
      createReviewNotification(newReview)

      // Update request status to completed
      requestStorage.update(showReviewModal, { status: 'completed' })

      // Update local state
      setServiceRequests(prev => 
        prev.map(req => 
          req.id === showReviewModal ? { ...req, status: 'completed' as const } : req
        )
      )

      // Add to local reviews
      setUserReviews(prev => [...prev, newReview])

      setShowReviewModal(null)
      setReviewData({ rating: 5, comment: '' })
      alert('Thank you for your review!')
    }
  }

  const handleSaveProfile = () => {
    alert('Profile updated successfully!')
  }

  const getStatusColor = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              My Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your service requests, reviews, and profile
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'requests'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            My Requests ({serviceRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'reviews'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Profile
          </button>
        </div>

        {/* My Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {serviceRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{request.providerName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 mr-2">Category:</span>
                        {request.category}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        {request.date} at {request.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2" />
                        {request.address}
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-primary">{request.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {request.status === 'pending' && (
                      <>
                        <Button 
                          variant="outline" 
                          className="w-full bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                          onClick={() => handleWhatsApp(request.providerPhone)}
                        >
                          <Phone size={16} className="mr-2" />
                          WhatsApp
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleCancelRequest(request.id)}
                        >
                          Cancel Request
                        </Button>
                      </>
                    )}
                    {request.status === 'confirmed' && (
                      <>
                        <Button 
                          className="w-full bg-primary"
                          onClick={() => handleTrackService(request.id)}
                        >
                          <Clock size={16} className="mr-2" />
                          Track Service
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                          onClick={() => handleWhatsApp(request.providerPhone)}
                        >
                          <Phone size={16} className="mr-2" />
                          WhatsApp
                        </Button>
                      </>
                    )}
                    {request.status === 'in-progress' && (
                      <>
                        <Button className="w-full bg-primary">
                          <Clock size={16} className="mr-2" />
                          Service in Progress
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                          onClick={() => handleWhatsApp(request.providerPhone)}
                        >
                          <Phone size={16} className="mr-2" />
                          WhatsApp
                        </Button>
                      </>
                    )}
                    {request.status === 'completed' && (
                      <>
                        <Button 
                          className="w-full bg-primary"
                          onClick={() => handleLeaveReview(request.id)}
                        >
                          <Star size={16} className="mr-2" />
                          Leave Review
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                          onClick={() => handleWhatsApp(request.providerPhone)}
                        >
                          <Phone size={16} className="mr-2" />
                          WhatsApp
                        </Button>
                      </>
                    )}
                    {request.status === 'cancelled' && (
                      <Button variant="outline" className="w-full" disabled>
                        Cancelled
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Reviews</h2>
            {userReviews.length === 0 ? (
              <div className="text-center py-12">
                <Star size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No reviews yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Complete a service to leave your first review
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{review.providerName}</h3>
                        <p className="text-sm text-gray-600">{review.service}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{profileData.name}</h3>
                  <p className="text-gray-600">Customer</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <Button className="bg-primary" onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Leave a Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={star <= reviewData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                  placeholder="Share your experience..."
                />
              </div>
              <div className="flex gap-2">
                <Button className="bg-primary flex-1" onClick={handleSubmitReview}>
                  Submit Review
                </Button>
                <Button variant="outline" onClick={() => setShowReviewModal(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default CustomerDashboard
