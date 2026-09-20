import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Plane, Hotel, MapPin, Calendar, Menu, X, ChevronDown, LogOut, User } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled

  const navLinks = [
    { to: '/destinations', label: 'Destinations', icon: MapPin },
    { to: '/hotels', label: 'Hotels', icon: Hotel },
    { to: '/flights', label: 'Flights', icon: Plane },
    { to: '/bookings', label: 'My Bookings', icon: Calendar },
  ]

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              transparent ? 'bg-white/20' : 'bg-navy-800'
            }`}>
              <Plane className={`w-5 h-5 transition-all group-hover:rotate-12 ${transparent ? 'text-white' : 'text-white'}`} />
            </div>
            <span className={`font-bold text-lg tracking-tight transition-colors ${transparent ? 'text-white' : 'text-navy-900'}`}>
              Travel<span className={transparent ? 'text-gold-400' : 'text-navy-500'}>Tripped</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === to
                    ? transparent ? 'bg-white/20 text-white' : 'bg-navy-50 text-navy-800'
                    : transparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-navy-800 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    transparent ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-navy-50 text-navy-800 hover:bg-navy-100'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-white text-xs font-bold">
                    {user.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span>{user.firstName}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <Link to="/bookings" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Calendar className="w-4 h-4" /> My Bookings
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className={`text-sm font-medium transition-colors ${
                  transparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-navy-800'
                }`}>
                  Sign In
                </Link>
                <Link to="/register" className={`btn-primary text-sm py-2 px-5 ${
                  transparent ? '!bg-white !text-navy-800 hover:!bg-gray-50' : ''
                }`}>
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg ${transparent ? 'text-white' : 'text-gray-700'}`}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 btn-secondary text-center text-sm py-2.5">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary text-center text-sm py-2.5">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
