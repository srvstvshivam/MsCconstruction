package com.msconstruction.controller;

import com.msconstruction.dto.ContactQueryRequest;
import com.msconstruction.model.*;
import com.msconstruction.repository.*;
import com.msconstruction.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

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
    private final EmailService emailService;

    public PublicController(CompanyInfoRepository companyInfoRepository,
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
        this.emailService = emailService;
    }

    @GetMapping("/site")
    public ResponseEntity<Map<String, Object>> getSiteData() {
        Map<String, Object> data = new HashMap<>();
        data.put("company", companyInfoRepository.findById("1").orElse(null));
        data.put("hero", heroSectionRepository.findById("1").orElse(null));
        data.put("theme", themeSettingsRepository.findById("1").orElse(null));
        data.put("navigation", navigationItemRepository.findAllByOrderBySortOrderAsc().stream().filter(i -> i.getEnabled() != Boolean.FALSE).toList());
        data.put("statistics", statisticItemRepository.findAllByOrderBySortOrderAsc().stream().filter(i -> i.getEnabled() != Boolean.FALSE).toList());
        data.put("services", serviceItemRepository.findAllByOrderBySortOrderAsc().stream().filter(i -> i.getEnabled() != Boolean.FALSE).toList());
        data.put("projects", projectRepository.findAll().stream().filter(i -> i.getEnabled() != Boolean.FALSE).toList());
        data.put("gallery", galleryImageRepository.findAllByOrderBySortOrderAsc());
        data.put("whyChooseUs", whyChooseItemRepository.findAllByOrderBySortOrderAsc().stream().filter(i -> i.getEnabled() != Boolean.FALSE).toList());
        data.put("commitments", commitmentItemRepository.findAllByOrderBySortOrderAsc().stream().filter(i -> i.getEnabled() != Boolean.FALSE).toList());
        data.put("team", teamMemberRepository.findAllByOrderBySortOrderAsc().stream().filter(i -> i.getEnabled() != Boolean.FALSE).toList());
        
        return ResponseEntity.ok(data);
    }

    @GetMapping("/team")
    public ResponseEntity<List<TeamMember>> getTeam() {
        return ResponseEntity.ok(teamMemberRepository.findAllByOrderBySortOrderAsc().stream()
                .filter(m -> m.getEnabled() != Boolean.FALSE)
                .toList());
    }

    @GetMapping("/company-info")
    public ResponseEntity<CompanyInfo> getCompanyInfo() {
        return ResponseEntity.ok(companyInfoRepository.findById("1").orElseThrow());
    }

    @GetMapping("/services")
    public ResponseEntity<List<ServiceItem>> getServices() {
        return ResponseEntity.ok(serviceItemRepository.findAllByOrderBySortOrderAsc());
    }

    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getProjects(
            @RequestParam(required = false) Project.ProjectStatus status) {
        if (status != null) {
            return ResponseEntity.ok(projectRepository.findByStatus(status));
        }
        return ResponseEntity.ok(projectRepository.findAll());
    }

    @GetMapping("/gallery")
    public ResponseEntity<List<GalleryImage>> getGallery() {
        return ResponseEntity.ok(galleryImageRepository.findAllByOrderBySortOrderAsc());
    }

    @PostMapping("/contact-query")
    public ResponseEntity<?> submitQuery(@Valid @RequestBody ContactQueryRequest request) {
        ContactQuery query = new ContactQuery();
        query.setName(request.name());
        query.setEmail(request.email());
        query.setPhone(request.phone());
        query.setMessage(request.message());
        query.setSubmittedAt(LocalDateTime.now());
        contactQueryRepository.save(query);

        emailService.sendNewQueryNotification(
                request.name(), request.email(), request.phone(), request.message());

        return ResponseEntity.ok().body(Map.of("message", "Query submitted successfully"));
    }
}
