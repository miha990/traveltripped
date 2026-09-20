import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Hotel } from 'lucide-react'
import { hotelService } from '../services/api'
import HotelCard from '../components/HotelCard'

export default function Hotels() {
  const [searchParams] = useSearchParams()
  const [hotels, setHotels] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [minStars, setMinStars] = useState(0)
  const [maxPrice, setMaxPrice] = useState(2000)

  useEffect(() => {
    hotelService.getAll()
      .then(res => { setHotels(res.data); setFiltered(res.data) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = hotels
    if (search) result = result.filter(h =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase()) ||
      h.country.toLowerCase().includes(search.toLowerCase())
    )
    if (minStars > 0) result = result.filter(h => h.stars >= minStars)
    result = result.filter(h => h.pricePerNight <= maxPrice)
    setFiltered(result)
  }, [search, minStars, maxPrice, hotels])

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-navy-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Hotel className="w-10 h-10 text-gold-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-3">Find Your Perfect Hotel</h1>
          <p className="text-navy-300 text-lg mb-8">Luxury, boutique, or budget — we have it all</p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by city or hotel name..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-gray-800 outline-none shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-gray-100 flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
            <SlidersHorizontal className="w-4 h-4" /> Filters:
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Min Stars:</span>
            <div className="flex gap-1">
              {[0, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setMinStars(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    minStars === s ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {s === 0 ? 'All' : `${s}★`}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Max Price: <strong>${maxPrice}</strong>/night</span>
            <input type="range" min="50" max="2000" step="50" value={maxPrice}
              onChange={e => setMaxPrice(+e.target.value)}
              className="w-32 accent-navy-700" />
          </div>
          <div className="ml-auto text-sm text-gray-400">
            {filtered.length} hotels found
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-gray-200 shimmer h-64" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Hotel className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hotels found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}
          </div>
        )}
      </div>
    </div>
  )
}
