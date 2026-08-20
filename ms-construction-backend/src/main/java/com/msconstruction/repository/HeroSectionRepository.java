package com.msconstruction.repository;

import com.msconstruction.model.HeroSection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HeroSectionRepository extends MongoRepository<HeroSection, String> {}
