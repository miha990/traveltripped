import { useNavigate } from 'react-router-dom'
import { Star, MapPin, ArrowRight } from 'lucide-react'

export default function DestinationCard({ destination }) {
  const navigate = useNavigate()
  return (
    <div
      className="card cursor-pointer group"
      onClick={() => navigate(`/destinations/${destination.id}`)}
    >
      <div className="relative overflow-hidden h-52">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <span className="badge bg-white/90 text-navy-800 backdrop-blur-sm">
            {destination.category}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">{destination.name}</h3>
            <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
              <MapPin className="w-3 h-3" />
              {destination.country}
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
            <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
            <span className="text-white text-xs font-semibold">{destination.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="text-xs text-gray-400">{destination.reviewCount?.toLocaleString()} reviews</div>
        <div className="flex items-center gap-1 text-navy-700 text-xs font-semibold group-hover:gap-2 transition-all">
          Explore <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  )
}
