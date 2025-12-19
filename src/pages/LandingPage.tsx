import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSearch from '../components/HeroSearch'
import ServiceCard from '../components/ServiceCard'
import FeatureSection from '../components/FeatureSection'
import Testimonials from '../components/Testimonials'
import {
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
  const services = [
    { 
      title: 'Plumber', 
      subtitle: 'Expert Plumbing Services',
      href: '/services/plumber',
      image: undefined // Placeholder for now
    },
    { 
      title: 'Electrician', 
      subtitle: 'Professional Electrical Work',
      href: '/services/electrician',
      image: undefined
    },
    { 
      title: 'Tutor', 
      subtitle: 'Personalized Learning',
      href: '/services/tutor',
      image: undefined
    },
    { 
      title: 'Cleaner', 
      subtitle: 'Spotless Cleaning Services',
      href: '/services/cleaner',
      image: undefined
    },
    { 
      title: 'AC Technician', 
      subtitle: 'Cooling Solutions',
      href: '/services/ac-technician',
      image: undefined
    },
    { 
      title: 'Mechanic', 
      subtitle: 'Auto Repair & Maintenance',
      href: '/services/mechanic',
      image: undefined
    },
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                subtitle={service.subtitle}
                image={service.image}
                href={service.href}
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
      <Testimonials />

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

