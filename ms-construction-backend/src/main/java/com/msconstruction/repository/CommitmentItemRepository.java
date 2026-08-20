package com.msconstruction.repository;

import com.msconstruction.model.CommitmentItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommitmentItemRepository extends MongoRepository<CommitmentItem, String> {
    List<CommitmentItem> findAllByOrderBySortOrderAsc();
}
