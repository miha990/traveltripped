package com.traveltripped.repository;

import com.traveltripped.model.Flight;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FlightRepository extends MongoRepository<Flight, String> {
    List<Flight> findByOriginCodeAndDestinationCode(String origin, String destination);
    List<Flight> findByDestinationCodeContainingIgnoreCase(String destination);
    List<Flight> findByAvailableSeatsGreaterThan(int seats);
}
