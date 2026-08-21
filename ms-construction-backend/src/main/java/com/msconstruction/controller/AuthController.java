package com.msconstruction.controller;

import com.msconstruction.dto.LoginRequest;
import com.msconstruction.dto.LoginResponse;
import com.msconstruction.model.AdminUser;
import com.msconstruction.repository.AdminUserRepository;
import com.msconstruction.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import com.msconstruction.service.EmailService;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
public class AuthController {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Value("${app.admin.notification-email}")
    private String adminEmail;
    
    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public AuthController(AdminUserRepository adminUserRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService,
                           EmailService emailService) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        AdminUser user = adminUserRepository.findByUsername(request.username()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        String token = jwtService.generateToken(user.getUsername());
        return ResponseEntity.ok(new LoginResponse(token, user.getUsername()));
    }

    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(org.springframework.security.core.Authentication auth) {
        AdminUser user = adminUserRepository.findByUsername(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        // Generate a 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        adminUserRepository.save(user);

        // Send OTP to registered email
        if (user.getEmail() != null) {
            emailService.sendOtpEmail(user.getEmail(), otp);
        }

        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request, org.springframework.security.core.Authentication auth) {
        AdminUser user = adminUserRepository.findByUsername(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        String otp = request.get("otpCode");
        if (otp == null || !otp.equals(user.getOtpCode()) || user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired OTP"));
        }

        if (!passwordEncoder.matches(request.get("currentPassword"), user.getPasswordHash())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Incorrect current password"));
        }

        user.setPasswordHash(passwordEncoder.encode(request.get("newPassword")));
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        adminUserRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @PostMapping("/change-email")
    public ResponseEntity<?> changeEmail(@RequestBody Map<String, String> request, org.springframework.security.core.Authentication auth) {
        AdminUser user = adminUserRepository.findByUsername(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        String otp = request.get("otpCode");
        if (otp == null || !otp.equals(user.getOtpCode()) || user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired OTP"));
        }

        String newEmail = request.get("email");
        if (newEmail == null || newEmail.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        user.setEmail(newEmail);
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        adminUserRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Email updated successfully"));
    }

    // Notice we bypass the /api/admin JWT filter here in SecurityConfig, or we map it to /api/public
    // Wait, since this is in /api/admin/auth, we need to ensure SecurityConfig permits /api/admin/auth/**
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        AdminUser user = adminUserRepository.findAll().stream()
                            .filter(u -> email != null && email.equalsIgnoreCase(u.getEmail()))
                            .findFirst().orElse(null);
                            
        if (user == null) {
            // Return ok anyway to prevent email enumeration, but we won't send an email
            return ResponseEntity.ok(Map.of("message", "If the email is registered, a reset link has been sent."));
        }

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        adminUserRepository.save(user);

        String resetLink = frontendUrl + "/admin/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(email, resetLink);

        return ResponseEntity.ok(Map.of("message", "If the email is registered, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        AdminUser user = adminUserRepository.findAll().stream().filter(u -> token.equals(u.getResetToken())).findFirst().orElse(null);
        
        if (user == null || user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired reset token."));
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        adminUserRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }
}
