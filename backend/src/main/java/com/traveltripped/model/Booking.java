package com.traveltripped.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    private String userId;
    private String bookingType; // HOTEL, FLIGHT, TRIP
    private String status; // PENDING, CONFIRMED, CANCELLED, COMPLETED
    private String referenceNumber;

    // Hotel booking fields
    private String hotelId;
    private String hotelName;
    private String roomType;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private int rooms;

    // Flight booking fields
    private String flightId;
    private String flightNumber;
    private String airline;
    private String originCode;
    private String destinationCode;
    private LocalDateTime departureTime;
    private String flightClass;

    // Common fields
    private int adults;
    private int children;
    private double totalPrice;
    private String currency;
    private String destinationId;
    private String destinationName;
    private String destinationImage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<GuestInfo> guests;
    private String specialRequests;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GuestInfo {
        private String firstName;
        private String lastName;
        private String passportNumber;
    }
}
