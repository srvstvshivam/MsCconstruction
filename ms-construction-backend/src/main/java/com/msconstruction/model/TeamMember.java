package com.msconstruction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "teammembers")
@Getter
@Setter
public class TeamMember {

    @Id
    private String id;

    private String name;
    private String role;
    private String bio;
    private String photoUrl;

    private Integer sortOrder;
    private Boolean enabled = true;
}
