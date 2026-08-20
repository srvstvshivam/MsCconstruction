package com.msconstruction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "herosections")
@Getter
@Setter
public class HeroSection {
    @Id
        private String id;

    private String tagline;
    private String headline;
    private String subheadline;
    private String bgImageUrl;
    private String cta1Text;
    private String cta1Link;
    private String cta2Text;
    private String cta2Link;
}
