package com.msconstruction.repository;

import com.msconstruction.model.TeamMember;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TeamMemberRepository extends MongoRepository<TeamMember, String> {
    List<TeamMember> findAllByOrderBySortOrderAsc();
}
