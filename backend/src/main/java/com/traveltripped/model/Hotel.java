package com.traveltripped.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "hotels")
public class Hotel {
    @Id
    private String id;
    private String name;
    private String destinationId;
    private String city;
    private String country;
    private String address;
    private String description;
    private String imageUrl;
    private List<String> galleryImages;
    private int stars;
    private double rating;
    private int reviewCount;
    private double pricePerNight;
    private String currency;
    private List<String> amenities;
    private String type;
    private boolean available;
    private int totalRooms;
    private List<RoomType> roomTypes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoomType {
        private String name;
        private double price;
        private int capacity;
        private String description;
        private List<String> amenities;
    }
}
