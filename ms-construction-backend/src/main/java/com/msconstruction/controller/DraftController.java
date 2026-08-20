package com.msconstruction.controller;

import com.msconstruction.model.SiteDraft;
import com.msconstruction.repository.SiteDraftRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

/**
 * Manages the single in-progress admin draft. There is only ever one draft
 * document (id "current") — this is a single-admin CMS, not multi-draft
 * versioning. Secured by the existing "/api/admin/**" JWT rule in SecurityConfig.
 */
@RestController
@RequestMapping("/api/admin/draft")
public class DraftController {

    private static final String DRAFT_ID = "current";

    private final SiteDraftRepository siteDraftRepository;

    public DraftController(SiteDraftRepository siteDraftRepository) {
        this.siteDraftRepository = siteDraftRepository;
    }

    /** Returns the saved draft, or 204 No Content if the admin has never saved one. */
    @GetMapping
    public ResponseEntity<SiteDraft> getDraft() {
        Optional<SiteDraft> draft = siteDraftRepository.findById(DRAFT_ID);
        return draft.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
    }

    /** Overwrites the draft. Never touches the published collections. */
    @PutMapping
    public ResponseEntity<SiteDraft> saveDraft(@RequestBody Map<String, Object> content) {
        SiteDraft draft = siteDraftRepository.findById(DRAFT_ID).orElseGet(SiteDraft::new);
        draft.setId(DRAFT_ID);
        draft.setContent(content);
        draft.setUpdatedAt(Instant.now());
        siteDraftRepository.save(draft);
        return ResponseEntity.ok(draft);
    }

    /** Clears the draft — called after a successful Publish, since draft and live now match. */
    @DeleteMapping
    public ResponseEntity<Void> clearDraft() {
        siteDraftRepository.deleteById(DRAFT_ID);
        return ResponseEntity.noContent().build();
    }
}
