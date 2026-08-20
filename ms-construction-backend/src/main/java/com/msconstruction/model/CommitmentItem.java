package com.msconstruction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "commitmentitems")
@Getter
@Setter
public class CommitmentItem {
    @Id
        private String id;

    private String title;
    
        private String description;
    
    private Integer sortOrder;
    private Boolean enabled = true;
}
