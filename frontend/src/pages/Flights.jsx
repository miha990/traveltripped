import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plane, Clock, ArrowRight, Search, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import { flightService, bookingService } from '../services/api'
import { useAuth } from '../context/AuthContext'

function duration(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
}

export default function Flights() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [flights, setFlights] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('All')
  const [bookingFlight, setBookingFlight] = useState(null)
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    flightService.getAll()
      .then(res => { setFlights(res.data); setFiltered(res.data) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = flights
    if (classFilter !== 'All') result = result.filter(f => f.flightClass === classFilter)
    if (search) result = result.filter(f =>
      f.originCity?.toLowerCase().includes(search.toLowerCase()) ||
      f.destinationCity?.toLowerCase().includes(search.toLowerCase()) ||
      f.airline?.toLowerCase().includes(search.toLowerCase()) ||
      f.originCode?.toLowerCase().includes(search.toLowerCase()) ||
      f.destinationCode?.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [search, classFilter, flights])

  const handleBook = async () => {
    if (!user) { navigate('/login'); return }
    if (!bookingFlight) return
    setSubmitting(true)
    try {
      const total = bookingFlight.price * (passengers.adults + passengers.children * 0.75)
      await bookingService.create({
        bookingType: 'FLIGHT',
        flightId: bookingFlight.id,
        flightNumber: bookingFlight.flightNumber,
        airline: bookingFlight.airline,
        originCode: bookingFlight.originCode,
        destinationCode: bookingFlight.destinationCode,
        departureTime: bookingFlight.departureTime,
        flightClass: bookingFlight.flightClass,
        adults: passengers.adults,
        children: passengers.children,
        totalPrice: parseFloat(total.toFixed(2)),
        currency: 'USD',
        destinationName: `${bookingFlight.destinationCity}, ${bookingFlight.destinationCountry}`,
        destinationImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
      })
      toast.success('Flight booked! ✈️')
      setBookingFlight(null)
      navigate('/bookings')
    } catch (e) {
      toast.error(e.response?.data?.error || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-navy-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Plane className="w-10 h-10 text-gold-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-3">Search Flights</h1>
          <p className="text-navy-300 text-lg mb-8">Find the best deals on flights worldwide</p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by city, airport code, or airline..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-gray-800 outline-none shadow-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter bar */}
        <div className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
            <Filter className="w-4 h-4" /> Class:
          </div>
          {['All', 'Economy', 'Business', 'First'].map(c => (
            <button key={c} onClick={() => setClassFilter(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                classFilter === c ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>{c}</button>
          ))}
          <div className="ml-auto text-sm text-gray-400">{filtered.length} flights found</div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-gray-200 shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Plane className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No flights found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(flight => (
              <div key={flight.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Airline */}
                  <div className="w-36 flex-shrink-0">
                    <div className="font-bold text-navy-900 text-sm">{flight.airline}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{flight.flightNumber}</div>
                    <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                      flight.flightClass === 'Business' ? 'bg-gold-100 text-gold-700' :
                      flight.flightClass === 'First' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{flight.flightClass}</span>
                  </div>

                  {/* Route */}
                  <div className="flex-1 flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-navy-900">{flight.originCode}</div>
                      <div className="text-xs text-gray-500">{flight.originCity}</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {duration(flight.durationMinutes)}
                      </div>
                      <div className="w-full flex items-center gap-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <Plane className="w-4 h-4 text-navy-400" />
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                      <div className="text-xs text-emerald-600 font-medium">
                        {flight.directFlight ? 'Direct' : 'With stops'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-navy-900">{flight.destinationCode}</div>
                      <div className="text-xs text-gray-500">{flight.destinationCity}</div>
                    </div>
                  </div>

                  {/* Price & book */}
                  <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                    <div>
                      <span className="text-2xl font-bold text-navy-900">${flight.price}</span>
                      <span className="text-xs text-gray-400"> /person</span>
                    </div>
                    <div className="text-xs text-gray-400">{flight.availableSeats} seats left</div>
                    <button onClick={() => setBookingFlight(flight)} className="btn-primary text-sm py-2 px-5">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking modal */}
      {bookingFlight && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-navy-900">Book Flight</h3>
              <button onClick={() => setBookingFlight(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Flight summary */}
              <div className="bg-navy-50 rounded-xl p-4 flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-navy-900">{bookingFlight.originCode}</div>
                  <div className="text-xs text-gray-500">{bookingFlight.originCity}</div>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-px bg-navy-200" />
                  <Plane className="w-4 h-4 text-navy-500" />
                  <div className="flex-1 h-px bg-navy-200" />
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-navy-900">{bookingFlight.destinationCode}</div>
                  <div className="text-xs text-gray-500">{bookingFlight.destinationCity}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Adults</label>
                  <input type="number" min={1} max={9} value={passengers.adults}
                    onChange={e => setPassengers(p => ({ ...p, adults: +e.target.value }))}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Children</label>
                  <input type="number" min={0} max={9} value={passengers.children}
                    onChange={e => setPassengers(p => ({ ...p, children: +e.target.value }))}
                    className="input-field" />
                </div>
              </div>

              <div className="bg-navy-50 rounded-xl p-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Adults ({passengers.adults} × ${bookingFlight.price})</span>
                  <span>${(passengers.adults * bookingFlight.price).toFixed(2)}</span>
                </div>
                {passengers.children > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Children ({passengers.children} × ${(bookingFlight.price * 0.75).toFixed(2)})</span>
                    <span>${(passengers.children * bookingFlight.price * 0.75).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-navy-900 text-base pt-2 border-t border-navy-100">
                  <span>Total</span>
                  <span>${(passengers.adults * bookingFlight.price + passengers.children * bookingFlight.price * 0.75).toFixed(2)}</span>
                </div>
              </div>

              <button onClick={handleBook} disabled={submitting}
                className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
                {submitting && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full spinner" />}
                {submitting ? 'Booking...' : 'Confirm Flight Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
