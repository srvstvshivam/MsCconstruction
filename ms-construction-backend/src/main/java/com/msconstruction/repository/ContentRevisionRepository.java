package com.msconstruction.repository;

import com.msconstruction.model.ContentRevision;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContentRevisionRepository extends MongoRepository<ContentRevision, String> {
    List<ContentRevision> findByEntityTypeAndEntityIdOrderByChangedAtDesc(String entityType, String entityId);
    List<ContentRevision> findAllByOrderByChangedAtDesc();
}
