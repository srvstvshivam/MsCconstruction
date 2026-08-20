package com.msconstruction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "serviceitems")
@Getter
@Setter
public class ServiceItem {

    @Id
        private String id;

    private String title;

        private String description;

    /** Icon name/key the frontend maps to an actual icon component (e.g. "grading", "road", "foundation") */
    private String icon;

    private Integer sortOrder;
    private Boolean enabled = true;
}
