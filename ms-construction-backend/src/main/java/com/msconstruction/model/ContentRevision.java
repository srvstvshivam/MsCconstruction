package com.msconstruction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Document(collection = "contentrevisions")
@Getter
@Setter
public class ContentRevision {
    @Id
        private String id;

    private String entityType;
    private String entityId;
    
        private String snapshotJson;
    
    private String changedBy;
    private LocalDateTime changedAt;
}
