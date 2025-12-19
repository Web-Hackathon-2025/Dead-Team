import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  Edit,
  Plus,
  Trash2,
  LogOut
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Header } from '../components/ui/header-3'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { requestStorage, reviewStorage, createRequestUpdateNotification } from '../lib/storage'

interface Service {
  id: string
  name: string
  description: string
  price: string
  duration: string
  category: string
}

interface ServiceRequest {
  id: string
  customerName: string
  customerPhone: string
  service: string
  date: string
  time: string
  address: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  price: string
  notes?: string
}

const ServiceProviderDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'services' | 'profile' | 'availability'>('overview')
  const [showAddService, setShowAddService] = useState(false)
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: ''
  })
  
  // Mock data
  const stats = {
    totalRequests: 24,
    pendingRequests: 3,
    completedServices: 18,
    averageRating: 4.7,
    totalEarnings: 'Rs. 45,000',
    thisMonthEarnings: 'Rs. 12,500'
  }

  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Pipe Repair',
      description: 'Fix leaking or broken pipes',
      price: 'Rs. 2,500',
      duration: '2-3 hours',
      category: 'Plumber'
    },
    {
      id: '2',
      name: 'Drain Cleaning',
      description: 'Unclog and clean blocked drains',
      price: 'Rs. 1,500',
      duration: '1-2 hours',
      category: 'Plumber'
    },
    {
      id: '3',
      name: 'Faucet Installation',
      description: 'Install new faucets and fixtures',
      price: 'Rs. 3,000',
      duration: '2 hours',
      category: 'Plumber'
    },
  ])
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [profileData, setProfileData] = useState({
    businessName: user?.name || 'Ahmed Plumbing Services',
    category: 'Plumber',
    phone: '+92 300 1234567',
    email: user?.email || 'ahmed@plumbing.com',
    location: 'Gulshan-e-Iqbal, Karachi',
    description: 'Expert plumber with 10+ years of experience. Available 24/7 for emergencies.'
  })
  const [editingService, setEditingService] = useState<string | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    if (user) {
      // Load requests for this provider
      const requests = requestStorage.getByProviderId(user.id)
      // Convert to local interface format
      const formattedRequests: ServiceRequest[] = requests.map(req => ({
        id: req.id,
        customerName: req.customerName,
        customerPhone: req.customerPhone,
        service: req.service,
        date: req.preferredDate,
        time: req.preferredTime,
        address: req.location,
        status: req.status,
        price: req.price || 'TBD',
        notes: req.description
      }))
      setServiceRequests(formattedRequests)
    }
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const availability = [
    { day: 'Monday', slots: ['9:00 AM - 12:00 PM', '2:00 PM - 6:00 PM'] },
    { day: 'Tuesday', slots: ['9:00 AM - 12:00 PM', '2:00 PM - 6:00 PM'] },
    { day: 'Wednesday', slots: ['9:00 AM - 12:00 PM', '2:00 PM - 6:00 PM'] },
    { day: 'Thursday', slots: ['9:00 AM - 12:00 PM', '2:00 PM - 6:00 PM'] },
    { day: 'Friday', slots: ['9:00 AM - 12:00 PM'] },
    { day: 'Saturday', slots: ['10:00 AM - 2:00 PM'] },
    { day: 'Sunday', slots: [] },
  ]

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

  const handleAcceptRequest = (requestId: string) => {
    // Update in localStorage
    const updatedRequest = requestStorage.update(requestId, { status: 'confirmed' })
    if (updatedRequest) {
      createRequestUpdateNotification(updatedRequest, 'pending')
      // Update local state
      setServiceRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: 'confirmed' as const } : req
        )
      )
      alert('Request accepted successfully!')
    }
  }

  const handleRejectRequest = (requestId: string) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      // Update in localStorage
      const updatedRequest = requestStorage.update(requestId, { status: 'cancelled' })
      if (updatedRequest) {
        createRequestUpdateNotification(updatedRequest, updatedRequest.status)
        // Update local state
        setServiceRequests(prev =>
          prev.map(req =>
            req.id === requestId ? { ...req, status: 'cancelled' as const } : req
          )
        )
        alert('Request rejected.')
      }
    }
  }

  const handleStartService = (requestId: string) => {
    // Update in localStorage
    const updatedRequest = requestStorage.update(requestId, { status: 'in-progress' })
    if (updatedRequest) {
      createRequestUpdateNotification(updatedRequest, 'confirmed')
      // Update local state
      setServiceRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: 'in-progress' as const } : req
        )
      )
      alert('Service started!')
    }
  }

  const handleMarkComplete = (requestId: string) => {
    // Update in localStorage
    const updatedRequest = requestStorage.update(requestId, { status: 'completed' })
    if (updatedRequest) {
      createRequestUpdateNotification(updatedRequest, 'in-progress')
      // Update local state
      setServiceRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: 'completed' as const } : req
        )
      )
      alert('Service marked as completed!')
    }
  }

  const handleReschedule = (requestId: string) => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):')
    const newTime = prompt('Enter new time (e.g., 10:00 AM):')
    if (newDate && newTime) {
      setServiceRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, date: newDate, time: newTime } : req
        )
      )
      alert('Request rescheduled successfully!')
    }
  }

  const handleWhatsApp = (phone: string) => {
    // Remove any spaces, dashes, or plus signs for WhatsApp URL
    const cleanPhone = phone.replace(/[\s\-+]/g, '')
    const whatsappUrl = `https://wa.me/${cleanPhone}`
    window.open(whatsappUrl, '_blank')
  }

  const handleAddService = () => {
    if (!newService.name || !newService.category || !newService.price) {
      alert('Please fill in all required fields (Name, Category, Price)')
      return
    }
    const service: Service = {
      id: Date.now().toString(),
      ...newService
    }
    setServices(prev => [...prev, service])
    setNewService({ name: '', description: '', price: '', duration: '', category: '' })
    setShowAddService(false)
    alert('Service added successfully!')
  }

  const handleEditService = (serviceId: string) => {
    setEditingService(serviceId)
    const service = services.find(s => s.id === serviceId)
    if (service) {
      setNewService({
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category: service.category
      })
      setShowAddService(true)
    }
  }

  const handleUpdateService = () => {
    if (editingService) {
      setServices(prev =>
        prev.map(s =>
          s.id === editingService ? { ...s, ...newService } : s
        )
      )
      setNewService({ name: '', description: '', price: '', duration: '', category: '' })
      setShowAddService(false)
      setEditingService(null)
      alert('Service updated successfully!')
    }
  }

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(s => s.id !== serviceId))
      alert('Service deleted successfully!')
    }
  }

  const handleSaveProfile = () => {
    alert('Profile updated successfully!')
  }

  const handleEditAvailability = () => {
    alert('Availability editing feature coming soon!')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Service Provider Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your services, requests, and bookings
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'requests', label: `Requests (${stats.pendingRequests})` },
            { id: 'services', label: 'My Services' },
            { id: 'availability', label: 'Availability' },
            { id: 'profile', label: 'Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stats.totalRequests}</span>
                </div>
                <p className="text-gray-600 text-sm">Total Requests</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Clock className="text-yellow-600" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</span>
                </div>
                <p className="text-gray-600 text-sm">Pending Requests</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stats.completedServices}</span>
                </div>
                <p className="text-gray-600 text-sm">Completed Services</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Star className="text-purple-600 fill-purple-600" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stats.averageRating}</span>
                </div>
                <p className="text-gray-600 text-sm">Average Rating</p>
              </div>
            </div>

            {/* Earnings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-sm border border-gray-200 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Total Earnings</p>
                    <p className="text-3xl font-bold">{stats.totalEarnings}</p>
                  </div>
                  <TrendingUp size={32} className="text-white/80" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">This Month</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.thisMonthEarnings}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Requests</h2>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('requests')}>
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {serviceRequests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{request.customerName}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{request.service} • {request.date} at {request.time}</p>
                    </div>
                    <span className="font-semibold text-primary">{request.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {serviceRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{request.customerName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 mr-2">Service:</span>
                        {request.service}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon size={16} className="mr-2" />
                        {request.date} at {request.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2" />
                        {request.address}
                      </div>
                      <div className="flex items-center">
                        <Phone size={16} className="mr-2" />
                        {request.customerPhone}
                      </div>
                      {request.notes && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700">Notes: </span>
                          <span className="text-gray-600">{request.notes}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center text-primary font-semibold">
                      <span>{request.price}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:w-48">
                    {request.status === 'pending' && (
                      <>
                        <Button 
                          className="w-full bg-primary"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          <XCircle size={16} className="mr-2" />
                          Reject
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleReschedule(request.id)}
                        >
                          <CalendarIcon size={16} className="mr-2" />
                          Reschedule
                        </Button>
                      </>
                    )}
                    {request.status === 'confirmed' && (
                      <>
                        <Button 
                          className="w-full bg-primary"
                          onClick={() => handleStartService(request.id)}
                        >
                          <Clock size={16} className="mr-2" />
                          Start Service
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                          onClick={() => handleWhatsApp(request.customerPhone)}
                        >
                          <Phone size={16} className="mr-2" />
                          WhatsApp
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleReschedule(request.id)}
                        >
                          <CalendarIcon size={16} className="mr-2" />
                          Reschedule
                        </Button>
                      </>
                    )}
                    {request.status === 'in-progress' && (
                      <>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleMarkComplete(request.id)}
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Mark Complete
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                          onClick={() => handleWhatsApp(request.customerPhone)}
                        >
                          <Phone size={16} className="mr-2" />
                          WhatsApp
                        </Button>
                      </>
                    )}
                    {request.status === 'completed' && (
                      <Button 
                        variant="outline" 
                        className="w-full bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                        onClick={() => handleWhatsApp(request.customerPhone)}
                      >
                        <Phone size={16} className="mr-2" />
                        WhatsApp
                      </Button>
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

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Services</h2>
              <Button 
                className="bg-primary"
                onClick={() => setShowAddService(!showAddService)}
              >
                <Plus size={16} className="mr-2" />
                Add Service
              </Button>
            </div>

            {/* Add Service Form */}
            {showAddService && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Service</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                    <input
                      type="text"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Pipe Repair"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input
                      type="text"
                      value={newService.category}
                      onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Plumber"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="text"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Rs. 2,500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <input
                      type="text"
                      value={newService.duration}
                      onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 2-3 hours"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={3}
                      placeholder="Describe the service..."
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    className="bg-primary" 
                    onClick={editingService ? handleUpdateService : handleAddService}
                  >
                    {editingService ? 'Update Service' : 'Add Service'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddService(false)
                      setEditingService(null)
                      setNewService({ name: '', description: '', price: '', duration: '', category: '' })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Services List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-primary font-semibold">{service.price}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{service.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditService(service.id)}
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Availability Schedule</h2>
              <Button variant="outline" onClick={handleEditAvailability}>
                <Edit size={16} className="mr-2" />
                Edit Schedule
              </Button>
            </div>
            <div className="space-y-4">
              {availability.map((day) => (
                <div
                  key={day.day}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="font-semibold text-gray-900 mb-2 md:mb-0 md:w-32">{day.day}</div>
                  <div className="flex flex-wrap gap-2">
                    {day.slots.length > 0 ? (
                      day.slots.map((slot, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium"
                        >
                          {slot}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Not available</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
                  {profileData.businessName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{profileData.businessName}</h3>
                  <p className="text-gray-600">{profileData.category}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="fill-yellow-400 text-yellow-400" size={16} />
                    <span className="font-semibold">4.8</span>
                    <span className="text-gray-600 text-sm">(127 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={profileData.businessName}
                    onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={profileData.category}
                    onChange={(e) => setProfileData({ ...profileData, category: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={profileData.description}
                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
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

      <Footer />
    </div>
  )
}

export default ServiceProviderDashboard

