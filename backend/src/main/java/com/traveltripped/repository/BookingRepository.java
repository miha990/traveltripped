package com.traveltripped.repository;

import com.traveltripped.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByUserIdAndStatus(String userId, String status);
    Optional<Booking> findByReferenceNumber(String referenceNumber);
    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);
}
