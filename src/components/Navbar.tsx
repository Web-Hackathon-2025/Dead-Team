import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, User } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Find Services', href: '/services' },
    { label: 'Become a Karigar', href: '/signup?type=worker' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Reviews', href: '#reviews' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Karigar
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => {
              // Use Link for routes, anchor for hash links
              if (link.href.startsWith('#')) {
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </a>
                )
              }
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-primary text-white px-6 py-2 rounded-full hover:bg-[#059669] transition-colors duration-200 font-medium"
            >
              Sign Up
            </Link>
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
              {navLinks.map((link) => {
                // Use Link for routes, anchor for hash links
                if (link.href.startsWith('#')) {
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium px-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  )
                }
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium px-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium px-2 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary text-white px-6 py-2 rounded-full hover:bg-[#059669] transition-colors duration-200 font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

