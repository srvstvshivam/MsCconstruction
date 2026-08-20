package com.msconstruction.repository;

import com.msconstruction.model.WhyChooseItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WhyChooseItemRepository extends MongoRepository<WhyChooseItem, String> {
    List<WhyChooseItem> findAllByOrderBySortOrderAsc();
}
