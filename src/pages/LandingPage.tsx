import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSearch from '../components/HeroSearch'
import CategoryCard from '../components/CategoryCard'
import FeatureSection from '../components/FeatureSection'
import TestimonialCard from '../components/TestimonialCard'
import {
  Wrench,
  Zap,
  GraduationCap,
  Sparkles,
  Wind,
  Car,
  Search,
  MessageSquare,
  CheckCircle,
  Shield,
  DollarSign,
  Clock,
  Star,
  ArrowRight,
} from 'lucide-react'

const LandingPage = () => {
  const categories = [
    { icon: Wrench, title: 'Plumber', href: '/services/plumber' },
    { icon: Zap, title: 'Electrician', href: '/services/electrician' },
    { icon: GraduationCap, title: 'Tutor', href: '/services/tutor' },
    { icon: Sparkles, title: 'Cleaner', href: '/services/cleaner' },
    { icon: Wind, title: 'AC Technician', href: '/services/ac-technician' },
    { icon: Car, title: 'Mechanic', href: '/services/mechanic' },
  ]

  const howItWorks = [
    {
      icon: Search,
      title: 'Search Nearby Services',
      description: 'Find verified local service providers in your area. Browse profiles, read reviews, and compare prices.',
    },
    {
      icon: MessageSquare,
      title: 'Send a Service Request',
      description: 'Connect directly with providers. Share your requirements and get instant quotes.',
    },
    {
      icon: CheckCircle,
      title: 'Get the Job Done',
      description: 'Track your service request in real-time. Leave reviews and build trust in your community.',
    },
  ]

  const trustFeatures = [
    {
      icon: Shield,
      title: 'Verified Service Providers',
      description: 'All Karigars are background-checked and verified for your peace of mind.',
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      description: 'See upfront pricing with no hidden fees. Compare quotes from multiple providers.',
    },
    {
      icon: Star,
      title: 'Real User Reviews',
      description: 'Read authentic reviews from customers in your neighborhood.',
    },
    {
      icon: Clock,
      title: 'Availability-Based Booking',
      description: 'Book services based on real-time availability. No more waiting or guessing.',
    },
  ]

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Homeowner',
      rating: 5,
      text: 'Found an excellent plumber within minutes. The service was professional, on-time, and reasonably priced. Karigar made it so easy!',
      location: 'Mumbai, Maharashtra',
    },
    {
      name: 'Priya Sharma',
      role: 'Small Business Owner',
      rating: 5,
      text: 'As a business owner, I needed reliable electricians. Karigar connected me with verified professionals who understood my needs.',
      location: 'Delhi, NCR',
    },
    {
      name: 'Amit Patel',
      role: 'Parent',
      rating: 5,
      text: 'Found a great tutor for my daughter through Karigar. The platform is trustworthy and the reviews helped me make the right choice.',
      location: 'Bangalore, Karnataka',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 text-balance">
              Find trusted local services, right when you need them.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 text-balance">
              Connect with verified service providers in your neighborhood. From plumbers to tutors, 
              discover skilled professionals who deliver quality work.
            </p>
            
            {/* Search Bar */}
            <div className="mb-8">
              <HeroSearch />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/services"
                className="bg-primary text-white px-8 py-4 rounded-full hover:bg-[#059669] transition-colors duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Find a Karigar Near You
              </a>
              <a
                href="/become-provider"
                className="bg-white text-primary border-2 border-primary px-8 py-4 rounded-full hover:bg-primary/5 transition-colors duration-200 font-semibold text-lg"
              >
                Offer Your Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How Karigar Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Karigar Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to get the service you need, when you need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <FeatureSection
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                />
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10" style={{ width: 'calc(100% - 4rem)', marginLeft: '2rem' }} />
                )}
              </div>
            ))}
          </div>

          {/* Customer vs Provider Flow */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Customers</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="text-primary mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Find nearby experts in your area</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="text-primary mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Track service requests in real-time</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="text-primary mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Rate and review service providers</span>
                </li>
              </ul>
              <a
                href="/services"
                className="inline-flex items-center text-primary font-semibold hover:underline"
              >
                Browse Services <ArrowRight className="ml-2" size={18} />
              </a>
            </div>

            <div className="bg-green-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Service Providers</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="text-primary mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Manage your profile and availability</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="text-primary mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Accept or reject job requests</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="text-primary mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Grow your local reputation</span>
                </li>
              </ul>
              <a
                href="/become-provider"
                className="inline-flex items-center text-primary font-semibold hover:underline"
              >
                Join as a Karigar <ArrowRight className="ml-2" size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Service Categories */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Service Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our most requested services. Click any category to find providers near you.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                icon={category.icon}
                title={category.title}
                href={category.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Karigar - Trust & Value */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Karigar?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've built a platform that prioritizes trust, transparency, and local connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustFeatures.map((feature, index) => (
              <FeatureSection
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews & Social Proof */}
      <section id="reviews" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real reviews from real customers in your community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/reviews"
              className="inline-flex items-center text-primary font-semibold hover:underline"
            >
              Read More Reviews <ArrowRight className="ml-2" size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Next Service Provider?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of satisfied customers who trust Karigar for their local service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/services"
              className="bg-white text-primary px-8 py-4 rounded-full hover:bg-gray-100 transition-colors duration-200 font-semibold text-lg shadow-lg"
            >
              Find Services Now
            </a>
            <a
              href="/become-provider"
              className="bg-white/10 text-white border-2 border-white px-8 py-4 rounded-full hover:bg-white/20 transition-colors duration-200 font-semibold text-lg"
            >
              Become a Karigar
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage

