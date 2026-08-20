package com.msconstruction.repository;

import com.msconstruction.model.ContactQuery;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ContactQueryRepository extends MongoRepository<ContactQuery, String> {
    List<ContactQuery> findAllByOrderBySubmittedAtDesc();
}
