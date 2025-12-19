import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { 
  Search, 
  MapPin, 
  Star, 
  Filter,
  Wrench,
  Zap,
  GraduationCap,
  Sparkles,
  Wind,
  Car,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  X,
  Calendar,
  Clock,
  MessageSquare
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Header } from '../components/ui/header-3'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { requestStorage, createRequestNotification } from '../lib/storage'

interface ServiceProvider {
  id: string
  name: string
  category: string
  rating: number
  reviewCount: number
  location: string
  distance: string
  priceRange: string
  availability: 'available' | 'busy' | 'unavailable'
  image?: string
  services: string[]
  description: string
  phone: string
  email?: string
  experience?: string
}

interface Category {
  id: string
  name: string
  icon: typeof Wrench
  count: number
}

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all')
  const [priceRange, setPriceRange] = useState<string>('all')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all')
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    rating: false,
    availability: false,
    price: false
  })
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    service: '',
    description: '',
    location: '',
    preferredDate: '',
    preferredTime: '',
  })
  const [bookingError, setBookingError] = useState('')
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false)

  const categories: Category[] = [
    { id: 'all', name: 'All Services', icon: Filter, count: 24 },
    { id: 'Plumber', name: 'Plumber', icon: Wrench, count: 8 },
    { id: 'Electrician', name: 'Electrician', icon: Zap, count: 6 },
    { id: 'Tutor', name: 'Tutor', icon: GraduationCap, count: 5 },
    { id: 'Cleaner', name: 'Cleaner', icon: Sparkles, count: 3 },
    { id: 'AC Technician', name: 'AC Technician', icon: Wind, count: 2 },
    { id: 'Mechanic', name: 'Mechanic', icon: Car, count: 4 },
  ]

  // Mock data - in real app, this would come from API
  const serviceProviders: ServiceProvider[] = [
    {
      id: '1',
      name: 'Ahmed Plumbing Services',
      category: 'Plumber',
      rating: 4.8,
      reviewCount: 127,
      location: 'Gulshan-e-Iqbal',
      distance: '2.5 km',
      priceRange: 'Rs. 1,500 - 3,000',
      availability: 'available',
      services: ['Pipe Repair', 'Drain Cleaning', 'Faucet Installation'],
      description: 'Expert plumber with 10+ years of experience. Available 24/7 for emergencies.',
      phone: '+923001234567',
      email: 'ahmed@plumbing.com',
      experience: '10+ years'
    },
    {
      id: '2',
      name: 'Hassan Electric Works',
      category: 'Electrician',
      rating: 4.9,
      reviewCount: 89,
      location: 'DHA Phase 5',
      distance: '3.2 km',
      priceRange: 'Rs. 2,000 - 5,000',
      availability: 'available',
      services: ['Wiring', 'Panel Installation', 'Repairs'],
      description: 'Licensed electrician specializing in residential and commercial work.',
      phone: '+923211234567',
      email: 'hassan@electric.com',
      experience: '8+ years'
    },
    {
      id: '3',
      name: 'Fatima Tutoring',
      category: 'Tutor',
      rating: 4.7,
      reviewCount: 56,
      location: 'Clifton',
      distance: '1.8 km',
      priceRange: 'Rs. 500 - 1,500/hour',
      availability: 'busy',
      services: ['Math', 'Science', 'English'],
      description: 'Experienced tutor offering personalized learning sessions.',
      phone: '+923221234567',
      email: 'fatima@tutoring.com',
      experience: '5+ years'
    },
    {
      id: '4',
      name: 'Clean Pro Services',
      category: 'Cleaner',
      rating: 4.6,
      reviewCount: 203,
      location: 'PECHS',
      distance: '4.1 km',
      priceRange: 'Rs. 1,000 - 2,500',
      availability: 'available',
      services: ['Deep Cleaning', 'Office Cleaning', 'Carpet Cleaning'],
      description: 'Professional cleaning services for homes and offices.',
      phone: '+923231234567',
      email: 'info@cleanpro.com',
      experience: '7+ years'
    },
    {
      id: '5',
      name: 'Cool Air Solutions',
      category: 'AC Technician',
      rating: 4.9,
      reviewCount: 145,
      location: 'Bahadurabad',
      distance: '3.5 km',
      priceRange: 'Rs. 2,500 - 4,000',
      availability: 'available',
      services: ['AC Installation', 'AC Repair', 'AC Maintenance'],
      description: 'Expert AC technicians for all your cooling needs.',
      phone: '+923241234567',
      email: 'cool@airsolutions.com',
      experience: '12+ years'
    },
    {
      id: '6',
      name: 'Auto Care Garage',
      category: 'Mechanic',
      rating: 4.8,
      reviewCount: 178,
      location: 'Korangi',
      distance: '5.2 km',
      priceRange: 'Rs. 1,500 - 5,000',
      availability: 'available',
      services: ['Engine Repair', 'Oil Change', 'Brake Service'],
      description: 'Trusted auto mechanics with 15+ years of experience.',
      phone: '+923251234567',
      email: 'autocare@garage.com',
      experience: '15+ years'
    },
    {
      id: '7',
      name: 'Master Plumber',
      category: 'Plumber',
      rating: 4.5,
      reviewCount: 92,
      location: 'Saddar',
      distance: '6.0 km',
      priceRange: 'Rs. 1,200 - 2,800',
      availability: 'busy',
      services: ['Leak Repair', 'Water Heater', 'Bathroom Plumbing'],
      description: 'Reliable plumbing services at affordable prices.',
      phone: '+923261234567',
      email: 'master@plumber.com',
      experience: '9+ years'
    },
    {
      id: '8',
      name: 'Bright Electric',
      category: 'Electrician',
      rating: 4.7,
      reviewCount: 134,
      location: 'Gulistan-e-Johar',
      distance: '4.8 km',
      priceRange: 'Rs. 1,800 - 4,500',
      availability: 'available',
      services: ['Lighting', 'Switch Installation', 'Electrical Troubleshooting'],
      description: 'Certified electricians for all electrical needs.',
      phone: '+923271234567',
      email: 'bright@electric.com',
      experience: '6+ years'
    },
  ]

  const handleWhatsApp = (phone: string) => {
    // Remove any spaces, dashes, or plus signs for WhatsApp URL
    const cleanPhone = phone.replace(/[\s\-+]/g, '')
    const whatsappUrl = `https://wa.me/${cleanPhone}`
    window.open(whatsappUrl, '_blank')
  }

  const handleRequestService = (provider: ServiceProvider) => {
    if (!isAuthenticated) {
      alert('Please login to request a service')
      navigate('/login')
      return
    }

    if (user?.type !== 'customer') {
      alert('Only customers can request services')
      return
    }

    setSelectedProvider(provider)
    setShowBookingModal(true)
    // Pre-fill service name
    setBookingForm(prev => ({
      ...prev,
      service: provider.services[0] || provider.category
    }))
  }

  const handleBookingFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBookingForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setBookingError('')
  }

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProvider || !user) return

    // Validation
    if (!bookingForm.service || !bookingForm.description || !bookingForm.location || 
        !bookingForm.preferredDate || !bookingForm.preferredTime) {
      setBookingError('Please fill in all required fields')
      return
    }

    // Check if date is in the past
    const selectedDate = new Date(bookingForm.preferredDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      setBookingError('Please select a future date')
      return
    }

    setIsSubmittingBooking(true)

    try {
      // Create service request
      const newRequest = requestStorage.create({
        customerId: user.id,
        customerName: user.name,
        customerPhone: '+923001234567', // Mock phone
        customerEmail: user.email,
        providerId: selectedProvider.id,
        providerName: selectedProvider.name,
        providerPhone: selectedProvider.phone,
        service: bookingForm.service,
        category: selectedProvider.category,
        description: bookingForm.description,
        location: bookingForm.location,
        preferredDate: bookingForm.preferredDate,
        preferredTime: bookingForm.preferredTime,
        status: 'pending',
        price: selectedProvider.priceRange,
      })

      // Create notification for provider
      createRequestNotification(newRequest)

      // Success
      alert('Service request submitted successfully! The provider will contact you soon.')
      
      // Reset and close
      setShowBookingModal(false)
      setBookingForm({
        service: '',
        description: '',
        location: '',
        preferredDate: '',
        preferredTime: '',
      })
      setSelectedProvider(null)
      
      // Optionally navigate to dashboard
      navigate('/dashboard/customer')
    } catch (error) {
      setBookingError('Failed to submit request. Please try again.')
      console.error('Booking error:', error)
    } finally {
      setIsSubmittingBooking(false)
    }
  }

  const toggleFilter = (filterName: keyof typeof expandedFilters) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }

  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const serviceParam = searchParams.get('service')
    const locationParam = searchParams.get('location')

    if (categoryParam) {
      // Map URL parameter to category name
      const categoryMap: Record<string, string> = {
        'plumber': 'Plumber',
        'electrician': 'Electrician',
        'tutor': 'Tutor',
        'cleaner': 'Cleaner',
        'ac-technician': 'AC Technician',
        'mechanic': 'Mechanic'
      }
      const mappedCategory = categoryMap[categoryParam.toLowerCase()] || categoryParam
      setSelectedCategory(mappedCategory)
    }

    // Handle service search parameter
    if (serviceParam) {
      setSearchQuery(serviceParam)
    }

    // Location parameter could be used for distance filtering in a real app
    // For now, we'll just log it
    if (locationParam) {
      console.log('Filtering by location:', locationParam)
    }
  }, [searchParams])

  const getAvailabilityColor = (availability: ServiceProvider['availability']) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'busy': return 'bg-yellow-100 text-yellow-800'
      case 'unavailable': return 'bg-red-100 text-red-800'
    }
  }

  // Helper function to extract max price from price range string
  const extractMaxPrice = (priceRangeStr: string): number => {
    // Extract numbers from string like "Rs. 1,500 - 3,000"
    const matches = priceRangeStr.match(/[\d,]+/g)
    if (!matches || matches.length < 2) return 0
    // Get the second number (max price) and remove commas
    return parseInt(matches[1].replace(/,/g, ''), 10)
  }

  const filteredProviders = serviceProviders.filter(provider => {
    // Category filter
    const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory
    
    // Search filter
    const matchesSearch = searchQuery === '' || 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      provider.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Rating filter
    const matchesRating = ratingFilter === 'all' || 
      (ratingFilter === '4+' && provider.rating >= 4) ||
      (ratingFilter === '4.5+' && provider.rating >= 4.5) ||
      (ratingFilter === '4.8+' && provider.rating >= 4.8)
    
    // Availability filter
    const matchesAvailability = availabilityFilter === 'all' || 
      provider.availability === availabilityFilter
    
    // Price range filter
    let matchesPrice = true
    if (priceRange !== 'all') {
      const maxPrice = extractMaxPrice(provider.priceRange)
      if (priceRange === 'under-2000') {
        matchesPrice = maxPrice < 2000
      } else if (priceRange === '2000-5000') {
        matchesPrice = maxPrice >= 2000 && maxPrice <= 5000
      } else if (priceRange === 'above-5000') {
        matchesPrice = maxPrice > 5000
      }
    }
    
    return matchesCategory && matchesSearch && matchesRating && matchesAvailability && matchesPrice
  })

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    if (categoryId === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category: categoryId })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Find Service Providers
          </h1>
          <p className="text-gray-600">
            Discover trusted professionals in your area
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Filter size={20} className="mr-2" />
                Filters
              </h2>

              {/* Category Filter */}
              <div className="mb-4 border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleFilter('category')}
                  className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 mb-3"
                >
                  <span>Category</span>
                  {expandedFilters.category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedFilters.category && (
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon
                      return (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryChange(category.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <div className="flex items-center">
                            <Icon size={18} className="mr-2" />
                            {category.name}
                          </div>
                          <span className={`text-xs ${
                            selectedCategory === category.id ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            {category.count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Rating Filter */}
              <div className="mb-4 border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleFilter('rating')}
                  className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 mb-3"
                >
                  <span>Minimum Rating</span>
                  {expandedFilters.rating ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedFilters.rating && (
                  <div className="space-y-2">
                    {['all', '4+', '4.5+', '4.8+'].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setRatingFilter(rating)}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                          ratingFilter === rating
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {rating === 'all' ? 'All Ratings' : `${rating} Stars`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Availability Filter */}
              <div className="mb-4 border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleFilter('availability')}
                  className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 mb-3"
                >
                  <span>Availability</span>
                  {expandedFilters.availability ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedFilters.availability && (
                  <div className="space-y-2">
                    {['all', 'available', 'busy'].map((availability) => (
                      <button
                        key={availability}
                        onClick={() => setAvailabilityFilter(availability)}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left capitalize ${
                          availabilityFilter === availability
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {availability === 'all' ? 'All' : availability}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range Filter */}
              <div>
                <button
                  onClick={() => toggleFilter('price')}
                  className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 mb-3"
                >
                  <span>Price Range</span>
                  {expandedFilters.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedFilters.price && (
                  <div className="space-y-2">
                    {['all', 'low', 'medium', 'high'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setPriceRange(range)}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left capitalize ${
                          priceRange === range
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {range === 'all' ? 'All Prices' : range}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search services, providers, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-600">
                Found <span className="font-semibold text-gray-900">{filteredProviders.length}</span> service providers
                {selectedCategory !== 'all' && (
                  <span> in <span className="font-semibold">{selectedCategory}</span></span>
                )}
              </p>
            </div>

            {/* Service Providers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Provider Image/Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 relative">
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(provider.availability)}`}>
                        {provider.availability === 'available' ? 'Available' : provider.availability === 'busy' ? 'Busy' : 'Unavailable'}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Star className="fill-yellow-400 text-yellow-400" size={16} />
                        <span className="font-semibold text-sm">{provider.rating}</span>
                        <span className="text-xs text-gray-600">({provider.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Provider Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{provider.name}</h3>
                        <p className="text-sm text-gray-600">{provider.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <MapPin size={16} className="mr-1" />
                      <span>{provider.location}</span>
                      <span className="mx-2">•</span>
                      <span>{provider.distance} away</span>
                    </div>

                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{provider.description}</p>

                    {/* Services Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {provider.services.slice(0, 3).map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {service}
                        </span>
                      ))}
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center text-primary font-semibold">
                        <span>{provider.priceRange}</span>
                      </div>
                      <Button 
                        className="bg-primary hover:bg-primary-dark"
                        onClick={() => setSelectedProvider(provider)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProviders.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No service providers found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Provider Profile Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8 relative">
            <button
              onClick={() => setSelectedProvider(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedProvider.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedProvider.name}</h2>
                  <p className="text-gray-600 mb-2">{selectedProvider.category}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <Star className="fill-yellow-400 text-yellow-400" size={16} />
                      <span className="font-semibold ml-1">{selectedProvider.rating}</span>
                      <span className="text-gray-600 ml-1">({selectedProvider.reviewCount} reviews)</span>
                    </div>
                    {selectedProvider.experience && (
                      <span className="text-gray-600">• {selectedProvider.experience}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(selectedProvider.availability)}`}>
                  {selectedProvider.availability === 'available' ? 'Available Now' : selectedProvider.availability === 'busy' ? 'Busy' : 'Unavailable'}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-700">{selectedProvider.description}</p>
              </div>

              {/* Services */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Services Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.services.map((service, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <MapPin size={18} className="mr-3 text-gray-500" />
                    <span>{selectedProvider.location} • {selectedProvider.distance} away</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone size={18} className="mr-3 text-gray-500" />
                    <span>{selectedProvider.phone}</span>
                  </div>
                  {selectedProvider.email && (
                    <div className="flex items-center text-gray-700">
                      <Mail size={18} className="mr-3 text-gray-500" />
                      <span>{selectedProvider.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pricing</h3>
                <p className="text-primary font-semibold text-lg">{selectedProvider.priceRange}</p>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <Button
                  className="w-full bg-primary hover:bg-primary-dark"
                  onClick={() => handleRequestService(selectedProvider)}
                  disabled={!isAuthenticated || user?.type !== 'customer'}
                >
                  <Calendar size={18} className="mr-2" />
                  Request Service
                </Button>
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleWhatsApp(selectedProvider.phone)}
                  >
                    <Phone size={18} className="mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      window.location.href = `tel:${selectedProvider.phone}`
                    }}
                  >
                    <Phone size={18} className="mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8 relative">
            <button
              onClick={() => {
                setShowBookingModal(false)
                setBookingError('')
              }}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Service</h2>
              <p className="text-gray-600 mb-6">
                Fill in the details below to request a service from {selectedProvider.name}
              </p>

              <form onSubmit={handleSubmitBooking} className="space-y-4">
                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service"
                    value={bookingForm.service}
                    onChange={handleBookingFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select a service</option>
                    {selectedProvider.services.map((service, idx) => (
                      <option key={idx} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={bookingForm.description}
                    onChange={handleBookingFormChange}
                    placeholder="Describe the work you need done..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={bookingForm.location}
                    onChange={handleBookingFormChange}
                    placeholder="Enter your address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={bookingForm.preferredDate}
                      onChange={handleBookingFormChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="preferredTime"
                      value={bookingForm.preferredTime}
                      onChange={handleBookingFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Price Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Estimated Price Range:</span>
                    <span className="text-primary font-semibold">{selectedProvider.priceRange}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Final price will be confirmed by the service provider
                  </p>
                </div>

                {/* Error Message */}
                {bookingError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {bookingError}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowBookingModal(false)
                      setBookingError('')
                    }}
                    disabled={isSubmittingBooking}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-dark"
                    disabled={isSubmittingBooking}
                  >
                    {isSubmittingBooking ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default ServicesPage

