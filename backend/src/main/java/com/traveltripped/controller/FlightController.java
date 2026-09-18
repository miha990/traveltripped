package com.traveltripped.controller;

import com.traveltripped.model.Flight;
import com.traveltripped.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    @Autowired
    private FlightRepository flightRepository;

    @GetMapping
    public List<Flight> getAll() {
        return flightRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flight> getById(@PathVariable String id) {
        return flightRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Flight> search(@RequestParam String origin, @RequestParam String destination) {
        return flightRepository.findByOriginCodeAndDestinationCode(
                origin.toUpperCase(), destination.toUpperCase());
    }
}
