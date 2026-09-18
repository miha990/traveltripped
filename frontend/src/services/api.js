import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Restore token on page load
const token = localStorage.getItem('tt_token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const destinationService = {
  getAll: () => api.get('/destinations'),
  getFeatured: () => api.get('/destinations/featured'),
  getById: (id) => api.get(`/destinations/${id}`),
  search: (q) => api.get(`/destinations/search?q=${q}`),
}

export const hotelService = {
  getAll: () => api.get('/hotels'),
  getById: (id) => api.get(`/hotels/${id}`),
  byDestination: (destId) => api.get(`/hotels/destination/${destId}`),
  search: (city) => api.get(`/hotels/search?city=${city}`),
}

export const flightService = {
  getAll: () => api.get('/flights'),
  getById: (id) => api.get(`/flights/${id}`),
  search: (origin, destination) => api.get(`/flights/search?origin=${origin}&destination=${destination}`),
}

export const bookingService = {
  getAll: () => api.get('/bookings'),
  getUpcoming: () => api.get('/bookings/upcoming'),
  create: (data) => api.post('/bookings', data),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
  getById: (id) => api.get(`/bookings/${id}`),
}

export default api
