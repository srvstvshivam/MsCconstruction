package com.msconstruction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "adminusers")
@Getter
@Setter
public class AdminUser {

    @Id
        private String id;

        private String username;
        private String email;

    /** BCrypt-hashed password — never store plain text */
    private String passwordHash;

    private String resetToken;
    private java.time.LocalDateTime resetTokenExpiry;
    
    private String otpCode;
    private java.time.LocalDateTime otpExpiry;
}
