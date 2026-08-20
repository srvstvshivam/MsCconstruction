package com.msconstruction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "navigationitems")
@Getter
@Setter
public class NavigationItem {
    @Id
        private String id;

    private String label;
    private String target;
    private Integer sortOrder;
    private Boolean enabled = true;
}
