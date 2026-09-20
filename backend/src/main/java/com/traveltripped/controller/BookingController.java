package com.traveltripped.controller;

import com.traveltripped.model.Booking;
import com.traveltripped.model.User;
import com.traveltripped.repository.BookingRepository;
import com.traveltripped.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping
    public List<Booking> myBookings(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @GetMapping("/upcoming")
    public List<Booking> upcomingBookings(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return bookingRepository.findByUserIdAndStatus(user.getId(), "CONFIRMED");
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        booking.setUserId(user.getId());
        booking.setStatus("CONFIRMED");
        booking.setReferenceNumber("TT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        Booking saved = bookingRepository.save(booking);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable String id, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return bookingRepository.findById(id)
                .filter(b -> b.getUserId().equals(user.getId()))
                .map(b -> {
                    b.setStatus("CANCELLED");
                    b.setUpdatedAt(LocalDateTime.now());
                    bookingRepository.save(b);
                    return ResponseEntity.ok(Map.of("message", "Booking cancelled", "id", id));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable String id, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return bookingRepository.findById(id)
                .filter(b -> b.getUserId().equals(user.getId()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
