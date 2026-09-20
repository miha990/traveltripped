import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Hotel, Plane, Star, ArrowRight, TrendingUp, Shield, Headphones } from 'lucide-react'
import { destinationService } from '../services/api'
import DestinationCard from '../components/DestinationCard'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80',
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600&q=80',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80',
]

export default function Home() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState([])
  const [heroIdx, setHeroIdx] = useState(0)
  const [searchType, setSearchType] = useState('hotel')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    destinationService.getFeatured()
      .then(res => setFeatured(res.data))
      .catch(() => {})
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchType === 'hotel') navigate(`/hotels?search=${searchQuery}`)
    else if (searchType === 'flight') navigate(`/flights?search=${searchQuery}`)
    else navigate(`/destinations?search=${searchQuery}`)
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background images with crossfade */}
        {HERO_IMAGES.map((img, i) => (
          <div key={img} className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: heroIdx === i ? 1 : 0 }}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-navy-950/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/20">
              <TrendingUp className="w-3.5 h-3.5 text-gold-400" />
              Over 500+ destinations worldwide
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Hey,<br />
              Where you off<br />
              <span className="text-gold-400">to Next?</span>
            </h1>

            <p className="text-white/75 text-lg mb-10 max-w-lg leading-relaxed">
              Discover incredible destinations, book luxury hotels, and find the best flights for your next adventure.
            </p>

            {/* Search card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-xl">
              {/* Type tabs */}
              <div className="flex gap-2 mb-5">
                {[
                  { id: 'hotel', label: 'Hotel', icon: Hotel },
                  { id: 'flight', label: 'Flight', icon: Plane },
                  { id: 'destination', label: 'Destination', icon: MapPin },
                ].map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setSearchType(id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${
                      searchType === id
                        ? 'bg-navy-800 text-white shadow-sm'
                        : 'text-gray-500 hover:text-navy-800 hover:bg-gray-50'
                    }`}>
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={
                      searchType === 'hotel' ? 'Search hotels by city...' :
                      searchType === 'flight' ? 'Search flights by destination...' :
                      'Search destinations...'
                    }
                    className="input-field pl-9"
                  />
                </div>
                <button type="submit" className="btn-primary px-5">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-0.5 h-8 bg-white/30 rounded-full" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '500+', label: 'Destinations' },
              { num: '2,400+', label: 'Hotels' },
              { num: '180+', label: 'Airlines' },
              { num: '1.2M+', label: 'Happy Travelers' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="text-3xl font-bold text-white mb-1">{num}</div>
                <div className="text-navy-300 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured destinations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Destinations</h2>
              <p className="section-subtitle mb-0">Handpicked experiences you'll love</p>
            </div>
            <button onClick={() => navigate('/destinations')}
              className="hidden sm:flex items-center gap-1.5 text-navy-700 font-medium hover:text-navy-500 transition-colors group">
              View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {featured.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-gray-200 shimmer h-72" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.slice(0, 4).map(dest => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Why Travel with Us?</h2>
            <p className="section-subtitle">Everything you need for a perfect trip</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Secure Booking', desc: 'Your payments and personal data are always protected with bank-level security.' },
              { icon: Star, title: 'Best Price Guarantee', desc: "Find a lower price? We'll match it. No questions asked, no hassle." },
              { icon: Headphones, title: '24/7 Support', desc: 'Our travel experts are available around the clock to help with any issue.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-8 rounded-2xl border border-gray-100 hover:border-navy-200 hover:shadow-lg transition-all group">
                <div className="w-14 h-14 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-navy-100 transition-colors">
                  <Icon className="w-7 h-7 text-navy-700" />
                </div>
                <h3 className="font-bold text-navy-900 text-lg mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-navy-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-navy-300 text-lg mb-8">Join over 1 million travelers who trust TravelTripped for their journeys.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="btn-gold px-8 py-3.5">
              Start Exploring
            </button>
            <button onClick={() => navigate('/destinations')} className="btn-secondary px-8 py-3.5">
              Browse Destinations
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
