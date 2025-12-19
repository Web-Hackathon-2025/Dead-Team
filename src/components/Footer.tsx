import { Phone, Mail, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Karigar</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Your trusted partner for finding verified local service providers. 
              Connect with skilled professionals in your neighborhood.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  About Karigar
                </a>
              </li>
              <li>
                <a href="/careers" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Pricing & Packages
                </a>
              </li>
              <li>
                <a href="/service-areas" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Service Areas
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="/services/plumber" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Plumber
                </a>
              </li>
              <li>
                <a href="/services/electrician" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Electrician
                </a>
              </li>
              <li>
                <a href="/services/tutor" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Tutor
                </a>
              </li>
              <li>
                <a href="/services/cleaner" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Cleaner
                </a>
              </li>
              <li>
                <a href="/services/technician" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  AC Technician
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Get In Touch</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  +1 234 567 8901
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <a href="mailto:support@karigar.com" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  support@karigar.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 text-sm">
                  123 Service St, Local City, USA
                </span>
              </li>
            </ul>
            <div className="space-y-2">
              <a href="/privacy" className="text-gray-600 hover:text-primary transition-colors text-sm block">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-600 hover:text-primary transition-colors text-sm block">
                Terms of Service
              </a>
              <a href="/admin" className="text-gray-600 hover:text-primary transition-colors text-sm block">
                Admin Access
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Copyright © {currentYear} Karigar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

