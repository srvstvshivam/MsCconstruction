package com.msconstruction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "whychooseitems")
@Getter
@Setter
public class WhyChooseItem {
    @Id
        private String id;

    private String title;
    
        private String description;
    
    private String icon;
    private Integer sortOrder;
    private Boolean enabled = true;
}
