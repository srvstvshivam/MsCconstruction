package com.msconstruction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "statisticitems")
@Getter
@Setter
public class StatisticItem {
    @Id
        private String id;

    private String label;
    private Double numericValue;
    private String prefix;
    private String suffix;
    private Integer decimalPrecision;
    private Integer sortOrder;
    private Boolean enabled = true;
}
