package com.msconstruction.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.msconstruction.model.ContentRevision;
import com.msconstruction.repository.ContentRevisionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RevisionService {

    private final ContentRevisionRepository revisionRepository;
    private final ObjectMapper objectMapper;

    public RevisionService(ContentRevisionRepository revisionRepository, ObjectMapper objectMapper) {
        this.revisionRepository = revisionRepository;
        this.objectMapper = objectMapper;
    }

    public void createRevision(String entityType, String entityId, Object snapshot, String changedBy) {
        try {
            ContentRevision revision = new ContentRevision();
            revision.setEntityType(entityType);
            revision.setEntityId(entityId);
            revision.setSnapshotJson(objectMapper.writeValueAsString(snapshot));
            revision.setChangedBy(changedBy);
            revision.setChangedAt(LocalDateTime.now());
            revisionRepository.save(revision);
        } catch (JsonProcessingException e) {
            System.err.println("Failed to serialize snapshot for revision: " + e.getMessage());
        }
    }

    public List<ContentRevision> getRevisions(String entityType, String entityId) {
        if (entityType == null && entityId == null) {
            return revisionRepository.findAllByOrderByChangedAtDesc();
        }
        return revisionRepository.findByEntityTypeAndEntityIdOrderByChangedAtDesc(entityType, entityId);
    }
    
    public ContentRevision getRevision(String id) {
        return revisionRepository.findById(id).orElseThrow();
    }
}
