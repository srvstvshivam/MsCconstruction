package com.msconstruction.controller;

import com.msconstruction.model.*;
import com.msconstruction.repository.*;
import com.msconstruction.service.RevisionService;
import com.msconstruction.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final CompanyInfoRepository companyInfoRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final ProjectRepository projectRepository;
    private final GalleryImageRepository galleryImageRepository;
    private final ContactQueryRepository contactQueryRepository;
    private final HeroSectionRepository heroSectionRepository;
    private final StatisticItemRepository statisticItemRepository;
    private final WhyChooseItemRepository whyChooseItemRepository;
    private final CommitmentItemRepository commitmentItemRepository;
    private final NavigationItemRepository navigationItemRepository;
    private final ThemeSettingsRepository themeSettingsRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final RevisionService revisionService;
    private final EmailService emailService;

    public AdminController(CompanyInfoRepository companyInfoRepository,
                            ServiceItemRepository serviceItemRepository,
                            ProjectRepository projectRepository,
                            GalleryImageRepository galleryImageRepository,
                            ContactQueryRepository contactQueryRepository,
                            HeroSectionRepository heroSectionRepository,
                            StatisticItemRepository statisticItemRepository,
                            WhyChooseItemRepository whyChooseItemRepository,
                            CommitmentItemRepository commitmentItemRepository,
                            NavigationItemRepository navigationItemRepository,
                            ThemeSettingsRepository themeSettingsRepository,
                            TeamMemberRepository teamMemberRepository,
                            RevisionService revisionService,
                            EmailService emailService) {
        this.companyInfoRepository = companyInfoRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.projectRepository = projectRepository;
        this.galleryImageRepository = galleryImageRepository;
        this.contactQueryRepository = contactQueryRepository;
        this.heroSectionRepository = heroSectionRepository;
        this.statisticItemRepository = statisticItemRepository;
        this.whyChooseItemRepository = whyChooseItemRepository;
        this.commitmentItemRepository = commitmentItemRepository;
        this.navigationItemRepository = navigationItemRepository;
        this.themeSettingsRepository = themeSettingsRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.revisionService = revisionService;
        this.emailService = emailService;
    }

    private String getUsername(Authentication auth) {
        return auth != null ? auth.getName() : "system";
    }

    // ---------- Admin Site Data ----------
    @GetMapping("/site")
    public ResponseEntity<java.util.Map<String, Object>> getAdminSiteData() {
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("company", companyInfoRepository.findById("1").orElse(null));
        data.put("hero", heroSectionRepository.findById("1").orElse(null));
        data.put("theme", themeSettingsRepository.findById("1").orElse(null));
        data.put("navigation", navigationItemRepository.findAllByOrderBySortOrderAsc());
        data.put("statistics", statisticItemRepository.findAllByOrderBySortOrderAsc());
        data.put("services", serviceItemRepository.findAllByOrderBySortOrderAsc());
        data.put("projects", projectRepository.findAll());
        data.put("gallery", galleryImageRepository.findAllByOrderBySortOrderAsc());
        data.put("whyChooseUs", whyChooseItemRepository.findAllByOrderBySortOrderAsc());
        data.put("commitments", commitmentItemRepository.findAllByOrderBySortOrderAsc());
        data.put("team", teamMemberRepository.findAllByOrderBySortOrderAsc());
        
        return ResponseEntity.ok(data);
    }

    // ---------- Company Info ----------
    @PutMapping("/company-info")
    public ResponseEntity<CompanyInfo> updateCompanyInfo(@RequestBody CompanyInfo updated, Authentication auth) {
        updated.setId("1");
        CompanyInfo old = companyInfoRepository.findById("1").orElse(null);
        if (old != null) revisionService.createRevision("CompanyInfo", "1", old, getUsername(auth));
        return ResponseEntity.ok(companyInfoRepository.save(updated));
    }

    // ---------- Hero Section ----------
    @PutMapping("/hero")
    public ResponseEntity<HeroSection> updateHeroSection(@RequestBody HeroSection updated, Authentication auth) {
        updated.setId("1");
        HeroSection old = heroSectionRepository.findById("1").orElse(null);
        if (old != null) revisionService.createRevision("HeroSection", "1", old, getUsername(auth));
        return ResponseEntity.ok(heroSectionRepository.save(updated));
    }

    // ---------- Theme Settings ----------
    @PutMapping("/theme")
    public ResponseEntity<ThemeSettings> updateThemeSettings(@RequestBody ThemeSettings updated, Authentication auth) {
        updated.setId("1");
        ThemeSettings old = themeSettingsRepository.findById("1").orElse(null);
        if (old != null) revisionService.createRevision("ThemeSettings", "1", old, getUsername(auth));
        return ResponseEntity.ok(themeSettingsRepository.save(updated));
    }

    // ---------- Statistics ----------
    @PostMapping("/statistics")
    public ResponseEntity<StatisticItem> createStatistic(@RequestBody StatisticItem item) {
        item.setId(null);
        return ResponseEntity.ok(statisticItemRepository.save(item));
    }

    @PutMapping("/statistics/{id}")
    public ResponseEntity<StatisticItem> updateStatistic(@PathVariable String id, @RequestBody StatisticItem updated, Authentication auth) {
        StatisticItem existing = statisticItemRepository.findById(id).orElseThrow();
        revisionService.createRevision("StatisticItem", id, existing, getUsername(auth));
        updated.setId(id);
        return ResponseEntity.ok(statisticItemRepository.save(updated));
    }

    @DeleteMapping("/statistics/{id}")
    public ResponseEntity<?> deleteStatistic(@PathVariable String id) {
        statisticItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---------- Why Choose Us ----------
    @PostMapping("/why-choose")
    public ResponseEntity<WhyChooseItem> createWhyChoose(@RequestBody WhyChooseItem item) {
        item.setId(null);
        return ResponseEntity.ok(whyChooseItemRepository.save(item));
    }

    @PutMapping("/why-choose/{id}")
    public ResponseEntity<WhyChooseItem> updateWhyChoose(@PathVariable String id, @RequestBody WhyChooseItem updated, Authentication auth) {
        WhyChooseItem existing = whyChooseItemRepository.findById(id).orElseThrow();
        revisionService.createRevision("WhyChooseItem", id, existing, getUsername(auth));
        updated.setId(id);
        return ResponseEntity.ok(whyChooseItemRepository.save(updated));
    }

    @DeleteMapping("/why-choose/{id}")
    public ResponseEntity<?> deleteWhyChoose(@PathVariable String id) {
        whyChooseItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---------- Commitments ----------
    @PostMapping("/commitments")
    public ResponseEntity<CommitmentItem> createCommitment(@RequestBody CommitmentItem item) {
        item.setId(null);
        return ResponseEntity.ok(commitmentItemRepository.save(item));
    }

    @PutMapping("/commitments/{id}")
    public ResponseEntity<CommitmentItem> updateCommitment(@PathVariable String id, @RequestBody CommitmentItem updated, Authentication auth) {
        CommitmentItem existing = commitmentItemRepository.findById(id).orElseThrow();
        revisionService.createRevision("CommitmentItem", id, existing, getUsername(auth));
        updated.setId(id);
        return ResponseEntity.ok(commitmentItemRepository.save(updated));
    }

    @DeleteMapping("/commitments/{id}")
    public ResponseEntity<?> deleteCommitment(@PathVariable String id) {
        commitmentItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---------- Navigation ----------
    @PostMapping("/navigation")
    public ResponseEntity<NavigationItem> createNavigation(@RequestBody NavigationItem item) {
        item.setId(null);
        return ResponseEntity.ok(navigationItemRepository.save(item));
    }

    @PutMapping("/navigation/{id}")
    public ResponseEntity<NavigationItem> updateNavigation(@PathVariable String id, @RequestBody NavigationItem updated, Authentication auth) {
        NavigationItem existing = navigationItemRepository.findById(id).orElseThrow();
        revisionService.createRevision("NavigationItem", id, existing, getUsername(auth));
        updated.setId(id);
        return ResponseEntity.ok(navigationItemRepository.save(updated));
    }

    @DeleteMapping("/navigation/{id}")
    public ResponseEntity<?> deleteNavigation(@PathVariable String id) {
        navigationItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---------- Services ----------
    @PostMapping("/services")
    public ResponseEntity<ServiceItem> createService(@RequestBody ServiceItem service) {
        service.setId(null);
        return ResponseEntity.ok(serviceItemRepository.save(service));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<ServiceItem> updateService(@PathVariable String id, @RequestBody ServiceItem updated, Authentication auth) {
        ServiceItem existing = serviceItemRepository.findById(id).orElseThrow();
        revisionService.createRevision("ServiceItem", id, existing, getUsername(auth));
        updated.setId(id);
        return ResponseEntity.ok(serviceItemRepository.save(updated));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(@PathVariable String id) {
        serviceItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---------- Projects ----------
    @PostMapping("/projects")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        project.setId(null);
        return ResponseEntity.ok(projectRepository.save(project));
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable String id, @RequestBody Project updated, Authentication auth) {
        Project existing = projectRepository.findById(id).orElseThrow();
        revisionService.createRevision("Project", id, existing, getUsername(auth));
        updated.setId(id);
        return ResponseEntity.ok(projectRepository.save(updated));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable String id) {
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---------- Gallery ----------
    @PostMapping("/gallery")
    public ResponseEntity<GalleryImage> addGalleryImage(@RequestBody GalleryImage image) {
        image.setId(null);
        return ResponseEntity.ok(galleryImageRepository.save(image));
    }

    @PutMapping("/gallery/{id}")
    public ResponseEntity<GalleryImage> updateGalleryImage(@PathVariable String id, @RequestBody GalleryImage updated, Authentication auth) {
        GalleryImage existing = galleryImageRepository.findById(id).orElseThrow();
        revisionService.createRevision("GalleryImage", id, existing, getUsername(auth));
        updated.setId(id);
        return ResponseEntity.ok(galleryImageRepository.save(updated));
    }

    @DeleteMapping("/gallery/{id}")
    public ResponseEntity<?> deleteGalleryImage(@PathVariable String id) {
        galleryImageRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---------- Revisions ----------
    @GetMapping("/revisions")
    public ResponseEntity<List<ContentRevision>> getRevisions(@RequestParam(required = false) String entityType, @RequestParam(required = false) String entityId) {
        if (entityType != null && entityId != null) {
            return ResponseEntity.ok(revisionService.getRevisions(entityType, entityId));
        }
        return ResponseEntity.ok(revisionService.getRevisions(null, null));
    }

    // ---------- Queries ----------
    @GetMapping("/queries")
    public ResponseEntity<List<ContactQuery>> getQueries() {
        return ResponseEntity.ok(contactQueryRepository.findAllByOrderBySubmittedAtDesc());
    }

    @PutMapping("/queries/{id}/mark-read")
    public ResponseEntity<ContactQuery> markRead(@PathVariable String id) {
        ContactQuery query = contactQueryRepository.findById(id).orElseThrow();
        query.setReadByAdmin(true);
        return ResponseEntity.ok(contactQueryRepository.save(query));
    }
    
    public static class ReplyRequest {
        public String subject;
        public String message;
    }

    @PostMapping("/queries/{id}/reply")
    public ResponseEntity<ContactQuery> replyQuery(@PathVariable String id, @RequestBody ReplyRequest req) {
        ContactQuery query = contactQueryRepository.findById(id).orElseThrow();
        if (query.getEmail() == null || query.getEmail().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        emailService.sendReplyEmail(query.getEmail(), req.subject, req.message);
        query.setReplied(true);
        query.setReadByAdmin(true);
        return ResponseEntity.ok(contactQueryRepository.save(query));
    }

    @DeleteMapping("/queries/{id}")
    public ResponseEntity<?> deleteQuery(@PathVariable String id) {
        contactQueryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
