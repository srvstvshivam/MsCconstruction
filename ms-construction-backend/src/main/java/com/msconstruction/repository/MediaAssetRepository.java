package com.msconstruction.repository;

import com.msconstruction.model.MediaAsset;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MediaAssetRepository extends MongoRepository<MediaAsset, String> {
    List<MediaAsset> findAllByOrderByCreatedAtDesc();
}
