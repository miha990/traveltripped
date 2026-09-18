package com.traveltripped.controller;

import com.traveltripped.model.Hotel;
import com.traveltripped.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired
    private HotelRepository hotelRepository;

    @GetMapping
    public List<Hotel> getAll() {
        return hotelRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getById(@PathVariable String id) {
        return hotelRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/destination/{destinationId}")
    public List<Hotel> byDestination(@PathVariable String destinationId) {
        return hotelRepository.findByDestinationId(destinationId);
    }

    @GetMapping("/search")
    public List<Hotel> search(@RequestParam String city) {
        return hotelRepository.findByCityContainingIgnoreCase(city);
    }
}
