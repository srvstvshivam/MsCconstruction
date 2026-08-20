package com.msconstruction.repository;

import com.msconstruction.model.SiteDraft;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SiteDraftRepository extends MongoRepository<SiteDraft, String> {
}
