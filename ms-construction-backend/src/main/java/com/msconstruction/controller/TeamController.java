package com.msconstruction.controller;

import com.msconstruction.model.TeamMember;
import com.msconstruction.repository.TeamMemberRepository;
import com.msconstruction.service.RevisionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TeamController {

    private final TeamMemberRepository teamMemberRepository;
    private final RevisionService revisionService;

    public TeamController(TeamMemberRepository teamMemberRepository, RevisionService revisionService) {
        this.teamMemberRepository = teamMemberRepository;
        this.revisionService = revisionService;
    }

    private String getUsername(Authentication auth) {
        return auth != null ? auth.getName() : "system";
    }

    // ── Admin: full CRUD, secured by the existing /api/admin/** JWT rule ────────
    @GetMapping("/api/admin/team")
    public List<TeamMember> getAllTeam() {
        return teamMemberRepository.findAllByOrderBySortOrderAsc();
    }

    @PostMapping("/api/admin/team")
    public ResponseEntity<TeamMember> createTeamMember(@RequestBody TeamMember member) {
        member.setId(null);
        return ResponseEntity.ok(teamMemberRepository.save(member));
    }

    @PutMapping("/api/admin/team/{id}")
    public ResponseEntity<TeamMember> updateTeamMember(@PathVariable String id, @RequestBody TeamMember updated, Authentication auth) {
        TeamMember existing = teamMemberRepository.findById(id).orElseThrow();
        revisionService.createRevision("TeamMember", id, existing, getUsername(auth));
        updated.setId(id);
        return ResponseEntity.ok(teamMemberRepository.save(updated));
    }

    @DeleteMapping("/api/admin/team/{id}")
    public ResponseEntity<Void> deleteTeamMember(@PathVariable String id) {
        teamMemberRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
