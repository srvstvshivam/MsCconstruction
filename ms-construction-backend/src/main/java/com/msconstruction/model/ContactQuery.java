package com.msconstruction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Document(collection = "contactquerys")
@Getter
@Setter
public class ContactQuery {

    @Id
        private String id;

    private String name;
    private String email;
    private String phone;

        private String message;

    private LocalDateTime submittedAt;

    private boolean readByAdmin = false;
    private boolean replied = false;
}
