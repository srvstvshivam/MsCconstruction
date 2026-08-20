package com.msconstruction.repository;

import com.msconstruction.model.CompanyInfo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CompanyInfoRepository extends MongoRepository<CompanyInfo, String> {
}
