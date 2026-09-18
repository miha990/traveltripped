import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plane, Eye, EyeOff, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password })
      toast.success('Account created! Welcome aboard 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient relative overflow-hidden items-center justify-center">
        <img src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=900&q=80"
          alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 text-center px-12">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Plane className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Start Exploring</h2>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Create your free account and unlock<br />a world of travel possibilities.
          </p>
          <div className="space-y-3 text-left">
            {['Book hotels at the best prices', 'Find amazing flight deals', 'Manage all your bookings in one place', 'Get 24/7 travel support'].map(item => (
              <div key={item} className="flex items-center gap-3 text-white/90">
                <CheckCircle className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-navy-800 flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-navy-900">Travel<span className="text-navy-500">Tripped</span></span>
          </div>

          <h1 className="text-3xl font-bold text-navy-900 mb-2">Create Account</h1>
          <p className="text-gray-500 mb-8">Join TravelTripped for free today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                <input value={form.firstName} onChange={set('firstName')} placeholder="Alex"
                  required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                <input value={form.lastName} onChange={set('lastName')} placeholder="Smith"
                  required className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com"
                required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  placeholder="Min 6 characters" required className="input-field pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={set('confirm')}
                placeholder="Repeat password" required className="input-field" />
              {form.confirm && form.password !== form.confirm && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
              {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full spinner" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-navy-700 font-semibold hover:text-navy-500">Sign in</Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-4">
            By registering you agree to our{' '}
            <a href="#" className="underline">Terms of Service</a> and{' '}
            <a href="#" className="underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
