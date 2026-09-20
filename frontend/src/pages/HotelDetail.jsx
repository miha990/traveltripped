import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, MapPin, ArrowLeft, Check, X, Calendar, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { hotelService, bookingService } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function HotelDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [booking, setBooking] = useState({
    checkIn: '', checkOut: '', rooms: 1, adults: 2, children: 0, roomType: '', specialRequests: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    hotelService.getById(id)
      .then(res => {
        setHotel(res.data)
        if (res.data.roomTypes?.length > 0) {
          setBooking(b => ({ ...b, roomType: res.data.roomTypes[0].name }))
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const nights = () => {
    if (!booking.checkIn || !booking.checkOut) return 0
    const diff = new Date(booking.checkOut) - new Date(booking.checkIn)
    return Math.max(0, Math.floor(diff / 86400000))
  }

  const total = () => {
    const n = nights()
    const selectedRoom = hotel?.roomTypes?.find(r => r.name === booking.roomType)
    const price = selectedRoom?.price || hotel?.pricePerNight || 0
    return (price * n * booking.rooms).toFixed(2)
  }

  const handleBook = async () => {
    if (!user) { navigate('/login'); return }
    if (!booking.checkIn || !booking.checkOut) { toast.error('Please select check-in and check-out dates'); return }
    if (nights() < 1) { toast.error('Check-out must be after check-in'); return }
    setSubmitting(true)
    try {
      await bookingService.create({
        bookingType: 'HOTEL',
        hotelId: hotel.id,
        hotelName: hotel.name,
        roomType: booking.roomType || 'Standard',
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        rooms: booking.rooms,
        adults: booking.adults,
        children: booking.children,
        totalPrice: parseFloat(total()),
        currency: 'USD',
        destinationName: hotel.city,
        destinationImage: hotel.imageUrl,
        specialRequests: booking.specialRequests,
      })
      toast.success('Booking confirmed! 🎉')
      setShowModal(false)
      navigate('/bookings')
    } catch (e) {
      toast.error(e.response?.data?.error || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-navy-200 border-t-navy-700 rounded-full spinner" />
    </div>
  )
  if (!hotel) return <div className="min-h-screen pt-16 flex items-center justify-center text-gray-500">Hotel not found.</div>

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="relative h-[50vh] overflow-hidden">
        <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex gap-0.5 mb-2">
            {[...Array(hotel.stars || 0)].map((_, i) => <Star key={i} className="w-5 h-5 text-gold-400 fill-gold-400" />)}
          </div>
          <h1 className="text-4xl font-bold text-white mb-1">{hotel.name}</h1>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <MapPin className="w-4 h-4" /> {hotel.address || `${hotel.city}, ${hotel.country}`}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-navy-900">About This Hotel</h2>
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
                  <span className="font-bold text-navy-900 text-lg">{hotel.rating}</span>
                  <span className="text-gray-400 text-sm">({hotel.reviewCount} reviews)</span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            {hotel.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-navy-900 mb-5">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Room types */}
            {hotel.roomTypes?.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-navy-900 mb-5">Room Types</h2>
                <div className="space-y-4">
                  {hotel.roomTypes.map(rt => (
                    <div key={rt.name} className="border border-gray-100 rounded-xl p-5 hover:border-navy-200 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-navy-900">{rt.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">{rt.description}</p>
                          <p className="text-sm text-gray-400 mt-1">Capacity: {rt.capacity} guests</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-navy-900">${rt.price}</div>
                          <div className="text-xs text-gray-400">per night</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 sticky top-24">
              <div className="mb-5">
                <span className="text-3xl font-bold text-navy-900">${hotel.pricePerNight}</span>
                <span className="text-gray-400 text-sm"> / night</span>
              </div>
              <button onClick={() => setShowModal(true)} className="w-full btn-primary py-3.5 text-base mb-4">
                Book Now
              </button>
              <p className="text-center text-xs text-gray-400">No booking fees · Free cancellation available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-navy-900">Book {hotel.name}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Check-In</label>
                  <input type="date" value={booking.checkIn} min={new Date().toISOString().split('T')[0]}
                    onChange={e => setBooking(b => ({ ...b, checkIn: e.target.value }))}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Check-Out</label>
                  <input type="date" value={booking.checkOut} min={booking.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={e => setBooking(b => ({ ...b, checkOut: e.target.value }))}
                    className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Rooms', key: 'rooms', min: 1, max: 10 },
                  { label: 'Adults', key: 'adults', min: 1, max: 20 },
                  { label: 'Children', key: 'children', min: 0, max: 10 },
                ].map(({ label, key, min, max }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input type="number" min={min} max={max} value={booking[key]}
                      onChange={e => setBooking(b => ({ ...b, [key]: +e.target.value }))}
                      className="input-field" />
                  </div>
                ))}
              </div>

              {hotel.roomTypes?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Room Type</label>
                  <select value={booking.roomType} onChange={e => setBooking(b => ({ ...b, roomType: e.target.value }))}
                    className="input-field">
                    {hotel.roomTypes.map(rt => (
                      <option key={rt.name} value={rt.name}>{rt.name} — ${rt.price}/night</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Requests</label>
                <textarea value={booking.specialRequests}
                  onChange={e => setBooking(b => ({ ...b, specialRequests: e.target.value }))}
                  rows={2} placeholder="Any special requests?" className="input-field resize-none" />
              </div>

              {nights() > 0 && (
                <div className="bg-navy-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>${hotel.pricePerNight}/night × {nights()} nights × {booking.rooms} room(s)</span>
                  </div>
                  <div className="flex justify-between font-bold text-navy-900 text-base pt-2 border-t border-navy-100">
                    <span>Total</span>
                    <span>${total()}</span>
                  </div>
                </div>
              )}

              <button onClick={handleBook} disabled={submitting}
                className="w-full btn-primary py-3.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {submitting ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full spinner" /> : null}
                {submitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
