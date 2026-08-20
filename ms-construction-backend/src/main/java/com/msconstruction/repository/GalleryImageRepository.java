package com.msconstruction.repository;

import com.msconstruction.model.GalleryImage;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GalleryImageRepository extends MongoRepository<GalleryImage, String> {
    List<GalleryImage> findAllByOrderBySortOrderAsc();
}
