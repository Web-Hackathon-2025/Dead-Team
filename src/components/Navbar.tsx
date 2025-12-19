import { useState } from 'react'
import { Menu, X, User } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Find Services', href: '/services' },
    { label: 'Become a Karigar', href: '/become-provider' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Reviews', href: '#reviews' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-gray-900">
              Karigar
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <a
              href="/login"
              className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
            >
              Login
            </a>
            <a
              href="/signup"
              className="bg-primary text-white px-6 py-2 rounded-full hover:bg-[#059669] transition-colors duration-200 font-medium"
            >
              Sign Up
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium px-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                <a
                  href="/login"
                  className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium px-2 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Login</span>
                </a>
                <a
                  href="/signup"
                  className="bg-primary text-white px-6 py-2 rounded-full hover:bg-[#059669] transition-colors duration-200 font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

