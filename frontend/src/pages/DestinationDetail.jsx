import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Star, ThumbsUp, Hotel, Plane, ArrowLeft, Sun } from 'lucide-react'
import { destinationService, hotelService } from '../services/api'
import HotelCard from '../components/HotelCard'

export default function DestinationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [destination, setDestination] = useState(null)
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    Promise.all([
      destinationService.getById(id),
      hotelService.byDestination(id),
    ]).then(([destRes, hotelRes]) => {
      setDestination(destRes.data)
      setHotels(hotelRes.data)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-navy-200 border-t-navy-700 rounded-full spinner" />
    </div>
  )
  if (!destination) return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <p className="text-gray-500">Destination not found.</p>
    </div>
  )

  const allImages = [destination.imageUrl, ...(destination.galleryImages || [])]

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        <img src={allImages[activeImg]} alt={destination.name}
          className="w-full h-full object-cover transition-all duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {allImages.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-white scale-110' : 'border-transparent opacity-70'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="absolute bottom-16 left-6 right-6">
          <h1 className="text-4xl font-bold text-white mb-2">{destination.name}, {destination.country}</h1>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-gold-400 fill-gold-400" />{destination.rating} ({destination.reviewCount?.toLocaleString()} reviews)</span>
            <span className="flex items-center gap-1"><Sun className="w-4 h-4" />{destination.climate}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{destination.continent}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-navy-900 mb-4">About {destination.name}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{destination.description}</p>
            </div>

            {destination.highlights?.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-navy-900 mb-5">Highlights</h2>
                <div className="grid grid-cols-2 gap-3">
                  {destination.highlights.map(h => (
                    <div key={h} className="flex items-center gap-2 text-gray-700 bg-navy-50 rounded-xl px-4 py-3">
                      <ThumbsUp className="w-4 h-4 text-navy-600 flex-shrink-0" />
                      <span className="text-sm font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotels in this destination */}
            {hotels.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-5">Hotels in {destination.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {hotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-navy-900 mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Category', value: destination.category },
                  { label: 'Climate', value: destination.climate },
                  { label: 'Continent', value: destination.continent },
                  { label: 'Rating', value: `${destination.rating} / 5.0` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-navy-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => navigate(`/hotels?search=${destination.city}`)}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5">
              <Hotel className="w-4 h-4" /> Find Hotels Here
            </button>
            <button onClick={() => navigate(`/flights?destination=${destination.city}`)}
              className="w-full btn-secondary flex items-center justify-center gap-2 py-3.5">
              <Plane className="w-4 h-4" /> Search Flights
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
