package com.msconstruction.config;

import com.msconstruction.model.*;
import com.msconstruction.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CompanyInfoRepository companyInfoRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final ProjectRepository projectRepository;
    private final GalleryImageRepository galleryImageRepository;
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final HeroSectionRepository heroSectionRepository;
    private final StatisticItemRepository statisticItemRepository;
    private final WhyChooseItemRepository whyChooseItemRepository;
    private final CommitmentItemRepository commitmentItemRepository;
    private final NavigationItemRepository navigationItemRepository;
    private final ThemeSettingsRepository themeSettingsRepository;

    @Value("${app.admin.seed-username}")
    private String seedUsername;

    @Value("${app.admin.seed-password}")
    private String seedPassword;

    @Value("${spring.mail.username:shivammzp2807@gmail.com}")
    private String seedEmail;

    public DataSeeder(CompanyInfoRepository companyInfoRepository,
                       ServiceItemRepository serviceItemRepository,
                       ProjectRepository projectRepository,
                       GalleryImageRepository galleryImageRepository,
                       AdminUserRepository adminUserRepository,
                       PasswordEncoder passwordEncoder,
                       HeroSectionRepository heroSectionRepository,
                       StatisticItemRepository statisticItemRepository,
                       WhyChooseItemRepository whyChooseItemRepository,
                       CommitmentItemRepository commitmentItemRepository,
                       NavigationItemRepository navigationItemRepository,
                       ThemeSettingsRepository themeSettingsRepository) {
        this.companyInfoRepository = companyInfoRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.projectRepository = projectRepository;
        this.galleryImageRepository = galleryImageRepository;
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.heroSectionRepository = heroSectionRepository;
        this.statisticItemRepository = statisticItemRepository;
        this.whyChooseItemRepository = whyChooseItemRepository;
        this.commitmentItemRepository = commitmentItemRepository;
        this.navigationItemRepository = navigationItemRepository;
        this.themeSettingsRepository = themeSettingsRepository;
    }

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedCompanyInfo();
        seedServices();
        seedProjects();
        seedGallery();
        seedHeroSection();
        seedStatistics();
        seedWhyChooseUs();
        seedCommitments();
        seedNavigation();
        seedThemeSettings();
    }

    private void seedAdminUser() {
        if (adminUserRepository.findByUsername(seedUsername).isEmpty()) {
            AdminUser admin = new AdminUser();
            admin.setUsername(seedUsername);
            admin.setPasswordHash(passwordEncoder.encode(seedPassword));
            admin.setEmail(seedEmail);
            adminUserRepository.save(admin);
            System.out.println("Seeded admin user '" + seedUsername + "' with email '" + seedEmail + "'.");
        } else {
            // Update email if it's missing
            adminUserRepository.findByUsername(seedUsername).ifPresent(admin -> {
                if (admin.getEmail() == null || admin.getEmail().isEmpty()) {
                    admin.setEmail(seedEmail);
                    adminUserRepository.save(admin);
                    System.out.println("Updated admin user '" + seedUsername + "' with email '" + seedEmail + "'.");
                }
            });
        }
    }

    private void seedCompanyInfo() {
        if (companyInfoRepository.findById("1").isEmpty()) {
            CompanyInfo info = new CompanyInfo();
            info.setId("1");
            info.setAboutText("MANGAL & SONS BUILDING CONTRACTOR (MS Construction) is a premier construction firm " +
                    "headquartered in Delhi/NCR, known for delivering high-quality, cost-effective, and timely " +
                    "construction solutions. Our core specializations include Residential, Commercial & Industrial " +
                    "Construction, Turnkey Project Execution, and Infrastructure Development. Our strengths lie in " +
                    "our experienced team of engineers, architects, and certified professionals, backed by advanced " +
                    "construction technologies and project management tools, with a proven track record of on-time " +
                    "and within-budget project delivery.");
            info.setMotto("We will continually strive to improve our services and processes to ensure customer satisfaction and success.");
            info.setHeroHeadline("Building Delhi/NCR's Future — On Time, On Budget, Built to Last");
            info.setHeroSubheadline("MS Construction delivers turnkey residential, commercial, and industrial construction with proven quality and 100% safety compliance.");
            info.setAddress("H.No. 840, Gali No. 16, New Baselwa Colony, Old Faridabad, Haryana");
            info.setOwnerName("Pritam Singh (Mangal Singh)");
            info.setEmail("pritamsingh584@gmail.com");
            info.setPhonePrimary("+91 98102 69073");
            info.setPhoneSecondary("+91 97184 44404");
            info.setWhatsappNumber("+91 98102 69073");
            info.setGoogleMapsQuery("New Baselwa Colony, Old Faridabad, Haryana");
            info.setDeliveredProjectValueCr(41.5);
            info.setWorkersManagedAtPeak(100);
            info.setSafetyCompliancePercent(100);
            info.setFlagshipProjectCount(5);
            info.setCompanyName("Mangal & Sons Construction");
            // Served by the frontend's public/ folder (not this backend) — same
            // pattern as the hero/gallery default images.
            info.setLogoUrl("/logo.png");
            info.setFooterDescription("Mangal & Sons Building Contractor — turnkey residential, commercial, and industrial construction across Delhi/NCR.");
            companyInfoRepository.save(info);
        }
    }

    private void seedServices() {
        if (serviceItemRepository.count() == 0) {
            addService("Site Grading & Earthworks", "Precision earthmoving and land grading to prepare sites for construction.", "grading", 1);
            addService("Road Construction & Paving", "Durable road building and paving for infrastructure and site access.", "road", 2);
            addService("Foundation & Structural Works", "Robust foundations and structural frameworks engineered to last.", "foundation", 3);
            addService("Electrical & Plumbing Installations", "Complete MEP installations handled by certified professionals.", "electrical", 4);
            addService("Façade & Interior Finishes", "Refined façade work and interior finishing for a polished result.", "facade", 5);
            addService("Painting & Post-Construction Detailing", "Final painting and detailing to complete every project.", "painting", 6);
        }
    }

    private void addService(String title, String desc, String icon, int order) {
        ServiceItem s = new ServiceItem();
        s.setTitle(title);
        s.setDescription(desc);
        s.setIcon(icon);
        s.setSortOrder(order);
        serviceItemRepository.save(s);
    }

    private void seedProjects() {
        if (projectRepository.count() == 0) {
            addProject("Praxair India Pvt. Ltd.", "Faridabad, Haryana", 5.5,
                    "Civil works, structural fabrication, piping, industrial sheds, foundation works",
                    Project.ProjectStatus.COMPLETED, "Industrial");
            addProject("Grand Columbus International School", "Faridabad, Haryana", 5.5,
                    "Complete campus construction: academic blocks, admin offices, sports facilities",
                    Project.ProjectStatus.COMPLETED, "Commercial");
            addProject("Escorts Group", "Faridabad, Haryana", 2.5,
                    "Industrial flooring and finishing works",
                    Project.ProjectStatus.COMPLETED, "Industrial");
            addProject("DAV Public School", "Sector 14, Faridabad", 10.0,
                    "Civil construction and infrastructure development",
                    Project.ProjectStatus.COMPLETED, "Commercial");
            addProject("Railway Project", "Bihar", 18.0,
                    "Civil construction and infrastructure development",
                    Project.ProjectStatus.COMPLETED, "Industrial");
        }
    }

    private void addProject(String client, String location, double value, String scope,
                             Project.ProjectStatus status, String sector) {
        Project p = new Project();
        p.setClientName(client);
        p.setLocation(location);
        p.setValueCr(value);
        p.setScopeOfWork(scope);
        p.setStatus(status);
        p.setSector(sector);
        projectRepository.save(p);
    }

    private void seedGallery() {
        if (galleryImageRepository.count() == 0) {
            addImage("/gallery/escorts-site.jpg", "Escorts Railway Equipment Division — site work", 1);
            addImage("/gallery/dav-school.jpg", "DAV Public School — completed building", 2);
            addImage("/gallery/earthmoving.jpg", "Site grading and earthmoving equipment in action", 3);
            addImage("/gallery/structural-framing.jpg", "Structural framing under construction", 4);
            addImage("/gallery/surveying.jpg", "Site surveying and layout marking", 5);
        }
    }

    private void addImage(String url, String caption, int order) {
        GalleryImage img = new GalleryImage();
        img.setUrl(url);
        img.setCaption(caption);
        img.setSortOrder(order);
        galleryImageRepository.save(img);
    }

    private void seedHeroSection() {
        if (heroSectionRepository.findById("1").isEmpty()) {
            HeroSection hero = new HeroSection();
            hero.setId("1");
            hero.setTagline("Building The Future");
            hero.setHeadline("Building Delhi/NCR's Future — On Time, On Budget, Built to Last");
            hero.setSubheadline("MS Construction delivers turnkey residential, commercial, and industrial construction with proven quality and 100% safety compliance.");
            hero.setBgImageUrl("/hero-bg.jpg"); // Fallback or default
            hero.setCta1Text("View Our Work");
            hero.setCta1Link("#portfolio");
            hero.setCta2Text("Contact Us");
            hero.setCta2Link("#contact");
            heroSectionRepository.save(hero);
        }
    }

    private void seedStatistics() {
        if (statisticItemRepository.count() == 0) {
            addStatistic("Delivered Project Value", 41.5, "₹", " Cr+", 1, 1);
            addStatistic("Workers Managed at Peak", 100.0, "", "+", 0, 2);
            addStatistic("Safety Compliance", 100.0, "", "%", 0, 3);
            addStatistic("Flagship Projects", 5.0, "", "+", 0, 4);
        }
    }

    private void addStatistic(String label, Double value, String prefix, String suffix, Integer precision, Integer order) {
        StatisticItem stat = new StatisticItem();
        stat.setLabel(label);
        stat.setNumericValue(value);
        stat.setPrefix(prefix);
        stat.setSuffix(suffix);
        stat.setDecimalPrecision(precision);
        stat.setSortOrder(order);
        statisticItemRepository.save(stat);
    }

    private void seedWhyChooseUs() {
        if (whyChooseItemRepository.count() == 0) {
            addWhyChoose("Competence", "Experienced and qualified team with specialized skills.", "competence", 1);
            addWhyChoose("Punctuality", "Timely completion of all works assigned to us.", "punctuality", 2);
            addWhyChoose("Cost", "Cost-effective services without compromising quality.", "cost", 3);
            addWhyChoose("Quality", "High-quality construction with premium materials.", "quality", 4);
        }
    }

    private void addWhyChoose(String title, String desc, String icon, int order) {
        WhyChooseItem item = new WhyChooseItem();
        item.setTitle(title);
        item.setDescription(desc);
        item.setIcon(icon);
        item.setSortOrder(order);
        whyChooseItemRepository.save(item);
    }

    private void seedCommitments() {
        if (commitmentItemRepository.count() == 0) {
            addCommitment("Reliable Timelines & Budgets", "We provide accurate estimates and deliver as promised.", 1);
            addCommitment("Safety First", "We maintain a safe and compliant work environment.", 2);
            addCommitment("Quality Craftsmanship", "We use premium materials and skilled labor for superior results.", 3);
            addCommitment("Transparent Communication", "We keep clients informed at every stage of the project.", 4);
            addCommitment("Continuous Improvement", "We invest in innovation and process optimization to exceed expectations.", 5);
        }
    }

    private void addCommitment(String title, String desc, int order) {
        CommitmentItem item = new CommitmentItem();
        item.setTitle(title);
        item.setDescription(desc);
        item.setSortOrder(order);
        commitmentItemRepository.save(item);
    }

    private void seedNavigation() {
        if (navigationItemRepository.count() == 0) {
            addNav("Home", "/#home", 1);
            addNav("About", "/#about", 2);
            addNav("Services", "/#services", 3);
            addNav("Gallery", "/#gallery", 4);
            addNav("Contact", "/#contact", 5);
            addNav("Our Team", "/team", 6);
        } else {
            List<NavigationItem> items = navigationItemRepository.findAll();
            boolean updated = false;
            for (NavigationItem item : items) {
                if (item.getTarget() != null && item.getTarget().startsWith("#")) {
                    item.setTarget("/" + item.getTarget());
                    updated = true;
                }
                if ("Portfolio".equals(item.getLabel()) || "Gallery".equals(item.getLabel())) {
                    if (!"Gallery".equals(item.getLabel())) {
                        item.setLabel("Gallery");
                        updated = true;
                    }
                    if (!"/#gallery".equals(item.getTarget())) {
                        item.setTarget("/#gallery");
                        updated = true;
                    }
                }
            }
            if (updated) {
                navigationItemRepository.saveAll(items);
            }

            boolean hasTeam = items.stream()
                    .anyMatch(n -> "/team".equals(n.getTarget()));
            if (!hasTeam) {
                int maxOrder = items.stream()
                        .mapToInt(NavigationItem::getSortOrder)
                        .max()
                        .orElse(5);
                addNav("Our Team", "/team", maxOrder + 1);
            }
        }
    }

    private void addNav(String label, String target, int order) {
        NavigationItem item = new NavigationItem();
        item.setLabel(label);
        item.setTarget(target);
        item.setSortOrder(order);
        navigationItemRepository.save(item);
    }

    private void seedThemeSettings() {
        if (themeSettingsRepository.findById("1").isEmpty()) {
            ThemeSettings theme = new ThemeSettings();
            theme.setId("1");
            theme.setPrimaryColor("#0f172a"); // navy-950
            theme.setSecondaryColor("#f59e0b"); // amber-500
            theme.setAccentColor("#fbbf24"); // amber-400
            theme.setBackgroundColor("#ffffff");
            theme.setTextColor("#334155"); // slate-700
            theme.setHeadingColor("#0f172a"); // navy-950
            theme.setButtonColor("#f59e0b"); // amber-500
            themeSettingsRepository.save(theme);
        }
    }
}
