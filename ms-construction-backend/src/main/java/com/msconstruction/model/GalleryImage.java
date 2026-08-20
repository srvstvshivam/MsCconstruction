package com.msconstruction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "galleryimages")
@Getter
@Setter
public class GalleryImage {

    @Id
        private String id;

    /** URL of the image (uploaded to disk/S3/Cloudinary — see note in README about file storage) */
    private String url;

    private String caption;

    private Integer sortOrder;
}
