import { useNavigate } from 'react-router-dom'
import { Star, MapPin, Wifi, Coffee } from 'lucide-react'

export default function HotelCard({ hotel }) {
  const navigate = useNavigate()
  return (
    <div className="card cursor-pointer group" onClick={() => navigate(`/hotels/${hotel.id}`)}>
      <div className="relative overflow-hidden h-44">
        <img src={hotel.imageUrl} alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <div className="flex gap-0.5">
            {[...Array(hotel.stars || 0)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-gold-400 fill-gold-400" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-3 right-3 bg-navy-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl">
          <span className="text-xs text-navy-300">from</span>
          <div className="font-bold text-sm">${hotel.pricePerNight}<span className="text-xs font-normal text-navy-300">/night</span></div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-navy-900 mb-1 group-hover:text-navy-600 transition-colors">{hotel.name}</h3>
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin className="w-3 h-3" /> {hotel.city}, {hotel.country}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
            <span className="text-sm font-semibold text-gray-700">{hotel.rating}</span>
            <span className="text-xs text-gray-400">({hotel.reviewCount})</span>
          </div>
          <div className="flex gap-1">
            {hotel.amenities?.slice(0, 2).map(a => (
              <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{a}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
