import { Link } from 'react-router-dom'
import { Header } from '../components/ui/header-3'
import Footer from '../components/Footer'
import ServiceCard from '../components/ServiceCard'
import Testimonials from '../components/Testimonials'
import { Hero } from '../components/ui/animated-hero'
import { FeaturesSectionWithHoverEffects } from '../components/ui/feature-section-with-hover-effects'
import {
  Search,
  MessageSquare,
  CheckCircle,
  Shield,
  DollarSign,
  Clock,
  Star,
  ArrowRight,
  PhoneCall,
  MoveRight,
  Users,
} from 'lucide-react'
import { Button } from '../components/ui/button'

const LandingPage = () => {
  // Helper function to encode image paths for URLs
  const getImagePath = (filename: string) => {
    return `/Pics/${encodeURIComponent(filename)}`
  }

  const services = [
    { 
      title: 'Plumber', 
      subtitle: 'Expert Plumbing Services',
      href: '/services?category=Plumber',
      image: getImagePath('Plumber with his arms crossed _ Free Photo.jfif')
    },
    { 
      title: 'Electrician', 
      subtitle: 'Professional Electrical Work',
      href: '/services?category=Electrician',
      image: getImagePath('Electrician.jfif')
    },
    { 
      title: 'Tutor', 
      subtitle: 'Personalized Learning',
      href: '/services?category=Tutor',
      image: getImagePath('tutor 2.jpg')
    },
    { 
      title: 'Cleaner', 
      subtitle: 'Spotless Cleaning Services',
      href: '/services?category=Cleaner',
      image: getImagePath('Cleaner.jfif')
    },
    { 
      title: 'AC Technician', 
      subtitle: 'Cooling Solutions',
      href: '/services?category=AC Technician',
      image: getImagePath('Ac Repair Mississauga.jfif')
    },
    { 
      title: 'Mechanic', 
      subtitle: 'Auto Repair & Maintenance',
      href: '/services?category=Mechanic',
      image: getImagePath('mechanic 2.jpg')
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
    {
      icon: Users,
      title: 'Build Your Network',
      description: 'Connect with trusted professionals and build lasting relationships in your community.',
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
    {
      icon: CheckCircle,
      title: 'Quality Guaranteed',
      description: 'Every service is backed by our quality guarantee. We ensure satisfaction.',
    },
    {
      icon: MessageSquare,
      title: 'Easy Communication',
      description: 'Chat directly with service providers. Clear communication, better results.',
    },
    {
      icon: Search,
      title: 'Quick Discovery',
      description: 'Find the right service provider in minutes, not hours. Fast and efficient.',
    },
    {
      icon: Users,
      title: 'Local Community',
      description: 'Support your local economy by connecting with neighborhood professionals.',
    },
  ]


  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Hero />
      </section>

      {/* How Karigar Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturesSectionWithHoverEffects
            features={howItWorks}
            title="How Karigar Works"
            subtitle="Four simple steps to get the service you need, when you need it."
          />
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
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
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturesSectionWithHoverEffects
            features={trustFeatures}
            title="Why Choose Karigar?"
            subtitle="We've built a platform that prioritizes trust, transparency, and local connections."
          />
        </div>
      </section>

      {/* Reviews & Social Proof */}
      <Testimonials />

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Find Your Next Service Provider?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of satisfied customers who trust Karigar for their local service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/contact">
              <Button size="lg" className="gap-2 bg-white text-primary hover:bg-gray-100">
                Contact Us <PhoneCall className="w-4 h-4" />
              </Button>
            </a>
            <Link to="/signup?type=worker">
              <Button size="lg" className="gap-2 bg-white/10 text-white border-2 border-white hover:bg-white/20">
                Become a Karigar <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage

