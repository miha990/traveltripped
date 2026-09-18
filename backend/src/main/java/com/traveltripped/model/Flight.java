package com.traveltripped.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "flights")
public class Flight {
    @Id
    private String id;
    private String flightNumber;
    private String airline;
    private String airlineLogo;
    private String originCode;
    private String originCity;
    private String originCountry;
    private String destinationCode;
    private String destinationCity;
    private String destinationCountry;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private int durationMinutes;
    private String flightClass;
    private double price;
    private String currency;
    private int availableSeats;
    private int totalSeats;
    private boolean directFlight;
    private String aircraft;
}
