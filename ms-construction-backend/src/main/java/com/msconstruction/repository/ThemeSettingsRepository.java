package com.msconstruction.repository;

import com.msconstruction.model.ThemeSettings;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ThemeSettingsRepository extends MongoRepository<ThemeSettings, String> {}
