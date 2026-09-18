package com.traveltripped.repository;

import com.traveltripped.model.Hotel;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface HotelRepository extends MongoRepository<Hotel, String> {
    List<Hotel> findByDestinationId(String destinationId);
    List<Hotel> findByCityContainingIgnoreCase(String city);
    List<Hotel> findByAvailableTrue();
    List<Hotel> findByStarsGreaterThanEqual(int stars);
}
