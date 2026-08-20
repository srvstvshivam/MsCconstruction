package com.msconstruction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "projects")
@Getter
@Setter
public class Project {

    @Id
        private String id;

    private String clientName;
    private String location;
    private Double valueCr;

        private String scopeOfWork;

    /** COMPLETED or RUNNING — lets the admin track ongoing work, not just finished projects */
    private ProjectStatus status;

    private String sector; // Residential / Commercial / Industrial

    private Boolean enabled = true;

    public enum ProjectStatus {
        COMPLETED, RUNNING
    }
}
