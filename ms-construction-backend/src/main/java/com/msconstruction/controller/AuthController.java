package com.msconstruction.controller;

import com.msconstruction.dto.LoginRequest;
import com.msconstruction.dto.LoginResponse;
import com.msconstruction.model.AdminUser;
import com.msconstruction.repository.AdminUserRepository;
import com.msconstruction.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
public class AuthController {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(AdminUserRepository adminUserRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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
}
