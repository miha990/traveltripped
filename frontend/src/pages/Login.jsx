import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Plane, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back! 👋')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient relative overflow-hidden items-center justify-center">
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80"
          alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 text-center px-12">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Plane className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Welcome Back</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Sign in to access your bookings,<br />saved destinations, and travel history.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[['500+', 'Destinations'], ['2,400+', 'Hotels'], ['180+', 'Airlines']].map(([num, label]) => (
              <div key={label} className="bg-white/10 rounded-2xl p-4">
                <div className="text-2xl font-bold text-white">{num}</div>
                <div className="text-white/60 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-navy-800 flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-navy-900">Travel<span className="text-navy-500">Tripped</span></span>
          </div>

          <h1 className="text-3xl font-bold text-navy-900 mb-2">Sign In</h1>
          <p className="text-gray-500 mb-8">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com" required className="input-field" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-navy-600 hover:text-navy-800">Forgot password?</a>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••" required className="input-field pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full spinner" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-navy-700 font-semibold hover:text-navy-500">Create one</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
            <p className="text-blue-700 font-medium mb-1">Demo Account</p>
            <p className="text-blue-600">Email: demo@traveltripped.com</p>
            <p className="text-blue-600">Password: demo1234</p>
          </div>
        </div>
      </div>
    </div>
  )
}
