package com.msconstruction.repository;

import com.msconstruction.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByStatus(Project.ProjectStatus status);
}
