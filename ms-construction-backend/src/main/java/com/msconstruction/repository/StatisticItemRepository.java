package com.msconstruction.repository;

import com.msconstruction.model.StatisticItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StatisticItemRepository extends MongoRepository<StatisticItem, String> {
    List<StatisticItem> findAllByOrderBySortOrderAsc();
}
