package com.msconstruction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Document(collection = "mediaassets")
@Getter
@Setter
public class MediaAsset {
    @Id
        private String id;

    private String url;
    private String publicId;
    private String folder;
    private String fileName;
    private String resourceType;
    private String caption;
    private String altText;
    private LocalDateTime createdAt;
}
