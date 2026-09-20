import { useState, useEffect } from 'react'
import { Search, Filter, Globe } from 'lucide-react'
import { destinationService } from '../services/api'
import DestinationCard from '../components/DestinationCard'

const CONTINENTS = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania']

export default function Destinations() {
  const [destinations, setDestinations] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [continent, setContinent] = useState('All')

  useEffect(() => {
    destinationService.getAll()
      .then(res => { setDestinations(res.data); setFiltered(res.data) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = destinations
    if (continent !== 'All') result = result.filter(d => d.continent === continent)
    if (search) result = result.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [search, continent, destinations])

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-navy-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <Globe className="w-10 h-10 text-gold-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Explore Destinations</h1>
          <p className="text-navy-300 text-lg mb-8">Discover your next dream getaway</p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-gray-800 placeholder-gray-400 outline-none shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Continent filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CONTINENTS.map(c => (
            <button key={c} onClick={() => setContinent(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                continent === c
                  ? 'bg-navy-800 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:text-navy-800 border border-gray-200 hover:border-navy-200'
              }`}>
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-gray-200 shimmer h-72" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Globe className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No destinations found</p>
            <button onClick={() => { setSearch(''); setContinent('All') }}
              className="mt-4 btn-primary text-sm py-2">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(dest => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
