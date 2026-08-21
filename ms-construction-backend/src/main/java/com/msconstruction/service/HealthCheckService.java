package com.msconstruction.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class HealthCheckService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${RENDER_EXTERNAL_URL:http://localhost:${server.port:8080}}")
    private String backendUrl;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    // Run every 10 minutes (600000 ms)
    @Scheduled(fixedRate = 600000)
    public void pingServices() {
        System.out.println("[HealthCheckService] Pinging services to prevent sleep...");

        // Ping backend (Self)
        try {
            String backendPingUrl = backendUrl + "/api/public/site"; // A lightweight public endpoint
            restTemplate.getForObject(backendPingUrl, String.class);
            System.out.println("[HealthCheckService] Successfully pinged backend: " + backendPingUrl);
        } catch (Exception e) {
            System.err.println("[HealthCheckService] Failed to ping backend: " + e.getMessage());
        }

        // Ping frontend (Vercel)
        try {
            restTemplate.getForObject(frontendUrl, String.class);
            System.out.println("[HealthCheckService] Successfully pinged frontend: " + frontendUrl);
        } catch (Exception e) {
            System.err.println("[HealthCheckService] Failed to ping frontend: " + e.getMessage());
        }
    }
}
