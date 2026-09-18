package com.traveltripped.repository;

import com.traveltripped.model.Destination;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DestinationRepository extends MongoRepository<Destination, String> {
    List<Destination> findByFeaturedTrue();
    List<Destination> findByContinent(String continent);
    List<Destination> findByCountryContainingIgnoreCaseOrCityContainingIgnoreCaseOrNameContainingIgnoreCase(
            String country, String city, String name);
}
