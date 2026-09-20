import { useState, useEffect } from 'react'
import { Calendar, Plane, Hotel, MapPin, Clock, XCircle, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { bookingService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { format, parseISO, isFuture } from 'date-fns'

function BookingCard({ booking, onCancel }) {
  const isUpcoming = booking.status === 'CONFIRMED' &&
    (booking.checkIn ? isFuture(parseISO(booking.checkIn)) :
     booking.departureTime ? isFuture(parseISO(booking.departureTime)) : false)
  const [cancelling, setCancelling] = useState(false)

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setCancelling(true)
    try {
      await onCancel(booking.id)
      toast.success('Booking cancelled')
    } catch {
      toast.error('Could not cancel booking')
    } finally {
      setCancelling(false)
    }
  }

  const statusBadge = {
    CONFIRMED: <span className="badge-confirmed flex items-center gap-1"><CheckCircle className="w-3 h-3" />Confirmed</span>,
    CANCELLED: <span className="badge-cancelled flex items-center gap-1"><XCircle className="w-3 h-3" />Cancelled</span>,
    PENDING: <span className="badge-pending flex items-center gap-1"><AlertCircle className="w-3 h-3" />Pending</span>,
    COMPLETED: <span className="badge bg-blue-100 text-blue-700 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Completed</span>,
  }

  const TypeIcon = booking.bookingType === 'FLIGHT' ? Plane : Hotel

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${
      booking.status === 'CANCELLED' ? 'border-gray-100 opacity-70' :
      isUpcoming ? 'border-navy-200 ring-1 ring-navy-100' : 'border-gray-100'
    }`}>
      {/* Top bar */}
      <div className={`px-5 py-2.5 flex items-center justify-between text-xs font-medium ${
        booking.bookingType === 'FLIGHT' ? 'bg-blue-50' : 'bg-emerald-50'
      }`}>
        <div className={`flex items-center gap-1.5 ${booking.bookingType === 'FLIGHT' ? 'text-blue-700' : 'text-emerald-700'}`}>
          <TypeIcon className="w-3.5 h-3.5" />
          {booking.bookingType === 'FLIGHT' ? 'Flight Booking' : 'Hotel Booking'}
          {isUpcoming && <span className="ml-2 bg-gold-400 text-white px-2 py-0.5 rounded-full text-xs">Upcoming</span>}
        </div>
        <span className="text-gray-400 font-mono">{booking.referenceNumber}</span>
      </div>

      <div className="p-5">
        <div className="flex gap-4">
          {/* Destination image */}
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            {booking.destinationImage ? (
              <img src={booking.destinationImage} alt="" className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <TypeIcon className="w-8 h-8 text-gray-300" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-navy-900 text-lg leading-tight">
                {booking.bookingType === 'FLIGHT'
                  ? `${booking.originCode} → ${booking.destinationCode}`
                  : booking.hotelName}
              </h3>
              {statusBadge[booking.status]}
            </div>

            {booking.bookingType === 'HOTEL' ? (
              <div className="space-y-1 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {booking.destinationName}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {booking.checkIn && format(parseISO(booking.checkIn), 'MMM dd, yyyy')} →{' '}
                  {booking.checkOut && format(parseISO(booking.checkOut), 'MMM dd, yyyy')}
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-lg">{booking.rooms} room(s)</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-lg">{booking.adults} adult(s)</span>
                  {booking.children > 0 && <span className="bg-gray-100 px-2 py-0.5 rounded-lg">{booking.children} child(ren)</span>}
                  {booking.roomType && <span className="bg-navy-50 text-navy-700 px-2 py-0.5 rounded-lg">{booking.roomType}</span>}
                </div>
              </div>
            ) : (
              <div className="space-y-1 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-gray-400" />
                  {booking.airline} · {booking.flightNumber}
                </div>
                {booking.departureTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {format(parseISO(booking.departureTime), 'MMM dd, yyyy HH:mm')}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-lg">{booking.adults} adult(s)</span>
                  {booking.flightClass && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg">{booking.flightClass}</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div>
            <span className="text-xs text-gray-400">Total paid</span>
            <div className="text-xl font-bold text-navy-900">${booking.totalPrice?.toFixed(2)}</div>
          </div>
          {booking.status === 'CONFIRMED' && (
            <button onClick={handleCancel} disabled={cancelling}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl transition-all disabled:opacity-50 font-medium">
              {cancelling
                ? <><RefreshCw className="w-3.5 h-3.5 spinner" /> Cancelling...</>
                : <><XCircle className="w-3.5 h-3.5" /> Cancel</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Bookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')

  const loadBookings = () => {
    setLoading(true)
    bookingService.getAll()
      .then(res => setBookings(res.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadBookings() }, [])

  const handleCancel = async (id) => {
    await bookingService.cancel(id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b))
  }

  const now = new Date()
  const tabFiltered = {
    all: bookings,
    upcoming: bookings.filter(b => b.status === 'CONFIRMED' &&
      (b.checkIn ? isFuture(parseISO(b.checkIn)) :
       b.departureTime ? isFuture(parseISO(b.departureTime)) : false)),
    hotels: bookings.filter(b => b.bookingType === 'HOTEL'),
    flights: bookings.filter(b => b.bookingType === 'FLIGHT'),
    cancelled: bookings.filter(b => b.status === 'CANCELLED'),
  }

  const displayed = tabFiltered[tab] || []

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-navy-900 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">My Bookings</h1>
              <p className="text-navy-300">Welcome back, {user?.firstName}! Manage all your travel plans.</p>
            </div>
            <button onClick={loadBookings}
              className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white px-4 py-2 rounded-xl text-sm transition-colors">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total', count: bookings.length, color: 'bg-white/10' },
              { label: 'Upcoming', count: tabFiltered.upcoming.length, color: 'bg-gold-500/20' },
              { label: 'Hotels', count: tabFiltered.hotels.length, color: 'bg-emerald-500/20' },
              { label: 'Flights', count: tabFiltered.flights.length, color: 'bg-blue-500/20' },
            ].map(({ label, count, color }) => (
              <div key={label} className={`${color} backdrop-blur-sm rounded-xl p-4 text-center border border-white/10`}>
                <div className="text-2xl font-bold text-white">{count}</div>
                <div className="text-navy-300 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Bookings' },
            { id: 'upcoming', label: '🕐 Upcoming' },
            { id: 'hotels', label: '🏨 Hotels' },
            { id: 'flights', label: '✈️ Flights' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === id ? 'bg-navy-800 text-white shadow-md' : 'bg-white text-gray-600 hover:text-navy-800 border border-gray-200'
              }`}>
              {label}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${tab === id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {tabFiltered[id]?.length || 0}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-gray-200 shimmer" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Calendar className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No bookings found</p>
            <p className="text-gray-400 text-sm mt-1">Your travel plans will appear here once booked.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map(booking => (
              <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
