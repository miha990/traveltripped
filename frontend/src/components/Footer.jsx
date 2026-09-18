import { Link } from 'react-router-dom'
import { Plane, MapPin, Mail, Phone, Instagram, Twitter, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-navy-700 flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">Travel<span className="text-gold-400">Tripped</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your gateway to extraordinary travel experiences. Book hotels, flights, and dream destinations worldwide.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-gray-300" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {[['Destinations', '/destinations'], ['Hotels', '/hotels'], ['Flights', '/flights'], ['My Bookings', '/bookings']].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2.5">
              {['Help Center', 'Cancellation Policy', 'Privacy Policy', 'Terms of Service'].map(label => (
                <li key={label}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
                123 Travel Lane, Skopje MK
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                hello@traveltripped.com
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                +389 2 123 4567
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm">© 2024 TravelTripped. All rights reserved.</p>
          <p className="text-gray-500 text-sm">Made with ❤️ for travelers worldwide</p>
        </div>
      </div>
    </footer>
  )
}
