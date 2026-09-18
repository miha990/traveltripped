package com.traveltripped.config;

import com.traveltripped.model.*;
import com.traveltripped.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private DestinationRepository destinationRepository;
    @Autowired private HotelRepository hotelRepository;
    @Autowired private FlightRepository flightRepository;

    @Override
    public void run(String... args) {
        if (destinationRepository.count() == 0) {
            seedDestinations();
        }
        if (hotelRepository.count() == 0) {
            seedHotels();
        }
        if (flightRepository.count() == 0) {
            seedFlights();
        }
    }

    private void seedDestinations() {
        List<Destination> destinations = Arrays.asList(
            createDestination("Dubai", "UAE", "Dubai", "The jewel of the Middle East",
                "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
                List.of("https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600",
                        "https://images.unsplash.com/photo-1579041733131-a2d08ceac3e5?w=600"),
                "City", 4.8, 12540, "Hot & Sunny", List.of("Burj Khalifa", "Dubai Mall", "Desert Safari"), true, "Asia"),
            createDestination("Paris", "France", "Paris", "The City of Light",
                "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800",
                List.of("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600"),
                "City", 4.9, 18900, "Mild", List.of("Eiffel Tower", "Louvre", "Versailles"), true, "Europe"),
            createDestination("Bali", "Indonesia", "Bali", "Island of the Gods",
                "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
                List.of("https://images.unsplash.com/photo-1555400082-28b54c499d46?w=600"),
                "Beach", 4.7, 9800, "Tropical", List.of("Ubud", "Seminyak", "Uluwatu"), true, "Asia"),
            createDestination("New York", "USA", "New York", "The City That Never Sleeps",
                "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
                List.of("https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600"),
                "City", 4.7, 22000, "Varied", List.of("Times Square", "Central Park", "Statue of Liberty"), true, "Americas"),
            createDestination("Tokyo", "Japan", "Tokyo", "Where tradition meets future",
                "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
                List.of("https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=600"),
                "City", 4.9, 15600, "Temperate", List.of("Shibuya", "Shinjuku", "Mt Fuji"), true, "Asia"),
            createDestination("Santorini", "Greece", "Santorini", "Whitewashed wonder of the Aegean",
                "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
                List.of("https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600"),
                "Beach", 4.8, 8700, "Mediterranean", List.of("Oia", "Fira", "Red Beach"), true, "Europe"),
            createDestination("Maldives", "Maldives", "Malé", "Tropical paradise on earth",
                "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
                List.of("https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600"),
                "Beach", 5.0, 6200, "Tropical", List.of("Overwater Bungalows", "Snorkeling", "Sunsets"), true, "Asia"),
            createDestination("Barcelona", "Spain", "Barcelona", "Architecture and beaches combined",
                "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800",
                List.of("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600"),
                "City", 4.6, 11200, "Mediterranean", List.of("Sagrada Familia", "Park Güell", "La Rambla"), false, "Europe")
        );
        destinationRepository.saveAll(destinations);
    }

    private Destination createDestination(String name, String country, String city, String desc,
            String img, List<String> gallery, String category, double rating, int reviews,
            String climate, List<String> highlights, boolean featured, String continent) {
        Destination d = new Destination();
        d.setName(name); d.setCountry(country); d.setCity(city); d.setDescription(desc);
        d.setImageUrl(img); d.setGalleryImages(gallery); d.setCategory(category);
        d.setRating(rating); d.setReviewCount(reviews); d.setClimate(climate);
        d.setHighlights(highlights); d.setFeatured(featured); d.setContinent(continent);
        return d;
    }

    private void seedHotels() {
        List<Hotel> hotels = Arrays.asList(
            createHotel("Burj Al Arab", "Dubai", "UAE", 5, 4.9, 689.0,
                "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
                List.of("Pool", "Spa", "Fine Dining", "Butler Service", "Helipad")),
            createHotel("Atlantis The Palm", "Dubai", "UAE", 5, 4.7, 450.0,
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                List.of("Waterpark", "Casino", "Beach", "Aquarium")),
            createHotel("Hotel Le Marais", "Paris", "France", 4, 4.5, 220.0,
                "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800",
                List.of("Restaurant", "Bar", "Concierge", "Room Service")),
            createHotel("The Peninsula Paris", "Paris", "France", 5, 4.9, 780.0,
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
                List.of("Spa", "Pool", "Fine Dining", "Rooftop Bar")),
            createHotel("COMO Uma Canggu", "Bali", "Indonesia", 5, 4.8, 380.0,
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
                List.of("Surf", "Yoga", "Spa", "Pool", "Ocean View")),
            createHotel("The Plaza Hotel", "New York", "USA", 5, 4.8, 650.0,
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
                List.of("Central Park View", "Spa", "Fine Dining", "Concierge")),
            createHotel("Park Hyatt Tokyo", "Tokyo", "Japan", 5, 4.9, 520.0,
                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
                List.of("Sky View", "Pool", "Spa", "Japanese Restaurant")),
            createHotel("Canaves Oia", "Santorini", "Greece", 5, 5.0, 890.0,
                "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800",
                List.of("Caldera View", "Infinity Pool", "Sunset View", "Breakfast"))
        );
        hotelRepository.saveAll(hotels);
    }

    private Hotel createHotel(String name, String city, String country, int stars, double rating,
            double price, String img, List<String> amenities) {
        Hotel h = new Hotel();
        h.setName(name); h.setCity(city); h.setCountry(country); h.setStars(stars);
        h.setRating(rating); h.setPricePerNight(price); h.setCurrency("USD");
        h.setImageUrl(img); h.setAmenities(amenities); h.setAvailable(true);
        h.setDescription("Experience luxury and comfort at " + name);
        return h;
    }

    private void seedFlights() {
        List<Flight> flights = Arrays.asList(
            createFlight("EK501", "Emirates", "LHR", "London", "UK", "DXB", "Dubai", "UAE", 420, "Economy", 299.0, 180),
            createFlight("EK001", "Emirates", "LHR", "London", "UK", "DXB", "Dubai", "UAE", 420, "Business", 1899.0, 42),
            createFlight("AF001", "Air France", "JFK", "New York", "USA", "CDG", "Paris", "France", 435, "Economy", 649.0, 250),
            createFlight("AF002", "Air France", "JFK", "New York", "USA", "CDG", "Paris", "France", 435, "Business", 3200.0, 40),
            createFlight("GA400", "Garuda", "SIN", "Singapore", "SG", "DPS", "Bali", "Indonesia", 120, "Economy", 189.0, 180),
            createFlight("NH001", "ANA", "LAX", "Los Angeles", "USA", "NRT", "Tokyo", "Japan", 600, "Economy", 890.0, 220),
            createFlight("A3001", "Aegean", "ATH", "Athens", "Greece", "JTR", "Santorini", "Greece", 55, "Economy", 89.0, 120),
            createFlight("TK001", "Turkish Airlines", "IST", "Istanbul", "Turkey", "MLE", "Maldives", "Maldives", 300, "Economy", 750.0, 200)
        );
        flightRepository.saveAll(flights);
    }

    private Flight createFlight(String number, String airline, String origCode, String origCity,
            String origCountry, String destCode, String destCity, String destCountry,
            int duration, String flightClass, double price, int seats) {
        Flight f = new Flight();
        f.setFlightNumber(number); f.setAirline(airline);
        f.setOriginCode(origCode); f.setOriginCity(origCity); f.setOriginCountry(origCountry);
        f.setDestinationCode(destCode); f.setDestinationCity(destCity); f.setDestinationCountry(destCountry);
        f.setDurationMinutes(duration); f.setFlightClass(flightClass);
        f.setPrice(price); f.setCurrency("USD");
        f.setAvailableSeats(seats); f.setTotalSeats(seats);
        f.setDepartureTime(LocalDateTime.now().plusDays(7));
        f.setArrivalTime(LocalDateTime.now().plusDays(7).plusMinutes(duration));
        f.setDirectFlight(true);
        return f;
    }
}
