package com.msconstruction.repository;

import com.msconstruction.model.NavigationItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NavigationItemRepository extends MongoRepository<NavigationItem, String> {
    List<NavigationItem> findAllByOrderBySortOrderAsc();
}
