package com.msconstruction.repository;

import com.msconstruction.model.ServiceItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ServiceItemRepository extends MongoRepository<ServiceItem, String> {
    List<ServiceItem> findAllByOrderBySortOrderAsc();
}
