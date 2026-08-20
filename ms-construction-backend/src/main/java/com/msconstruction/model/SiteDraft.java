package com.msconstruction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Map;

/**
 * Holds exactly one in-progress admin draft of the whole site (everything the
 * Visual Editor lets an admin change), separate from the live/published
 * collections (CompanyInfo, HeroSection, ServiceItem, etc).
 *
 * "Save Draft" writes here only — it never touches the published collections,
 * so it can never affect the public website. "Publish" applies the draft's
 * content to the real collections (via the existing admin CRUD endpoints)
 * and then this draft is cleared.
 */
@Document(collection = "site_draft")
@Getter
@Setter
public class SiteDraft {

    @Id
    private String id;

    /** The entire draft site payload, shaped exactly like GET /api/public/site. */
    private Map<String, Object> content;

    private Instant updatedAt;
}
