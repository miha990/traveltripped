package com.traveltripped.controller;

import com.traveltripped.model.Destination;
import com.traveltripped.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    @Autowired
    private DestinationRepository destinationRepository;

    @GetMapping
    public List<Destination> getAll() {
        return destinationRepository.findAll();
    }

    @GetMapping("/featured")
    public List<Destination> getFeatured() {
        return destinationRepository.findByFeaturedTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Destination> getById(@PathVariable String id) {
        return destinationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Destination> search(@RequestParam String q) {
        return destinationRepository
                .findByCountryContainingIgnoreCaseOrCityContainingIgnoreCaseOrNameContainingIgnoreCase(q, q, q);
    }

    @GetMapping("/continent/{continent}")
    public List<Destination> byContinent(@PathVariable String continent) {
        return destinationRepository.findByContinent(continent);
    }
}
