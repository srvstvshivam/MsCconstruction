package com.msconstruction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MsConstructionBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsConstructionBackendApplication.class, args);
    }
}
