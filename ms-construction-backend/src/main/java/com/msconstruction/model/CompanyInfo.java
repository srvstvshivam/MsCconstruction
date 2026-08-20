package com.msconstruction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

/**
 * Singleton-style table: there is only ever one row (id = 1).
 * Holds every piece of "global" editable content: about text, motto,
 * contact details, and the homepage stats (delivered value, workers, etc).
 */
@Document(collection = "companyinfos")
@Getter
@Setter
public class CompanyInfo {

    @Id
    private String id = "1";

        private String aboutText;

        private String motto;

    private String heroHeadline;
    private String heroSubheadline;

    private String address;
    private String ownerName;
    private String email;
    private String phonePrimary;
    private String phoneSecondary;
    private String whatsappNumber;
    private String googleMapsQuery;

    // Homepage stats — admin-editable, no longer hardcoded on the frontend
    private Double deliveredProjectValueCr;
    private Integer workersManagedAtPeak;
    private Integer safetyCompliancePercent;
    private Integer flagshipProjectCount;
    
    private String companyName;
    private String logoUrl;
    private String aboutImageUrl;
    private String aboutImageCaption;
    private String footerDescription;
    private String copyrightText;
    private String facebookUrl;
    private String twitterUrl;
    private String instagramUrl;
    private String linkedinUrl;

    /** Text for the optional "Meet Our Team" button in About Us. Blank/null hides the button. */
    private String teamButtonText;
}
