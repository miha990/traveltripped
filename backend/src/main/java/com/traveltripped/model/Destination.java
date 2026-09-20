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
@Document(collection = "destinations")
public class Destination {
    @Id
    private String id;
    private String name;
    private String country;
    private String city;
    private String description;
    private String imageUrl;
    private List<String> galleryImages;
    private String category;
    private double rating;
    private int reviewCount;
    private String climate;
    private List<String> highlights;
    private boolean featured;
    private String continent;
}
