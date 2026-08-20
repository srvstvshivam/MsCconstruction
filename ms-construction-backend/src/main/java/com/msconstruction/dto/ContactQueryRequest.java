package com.msconstruction.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContactQueryRequest(
        @NotBlank String name,
        @Email String email,
        String phone,
        @NotBlank String message
) {
}
