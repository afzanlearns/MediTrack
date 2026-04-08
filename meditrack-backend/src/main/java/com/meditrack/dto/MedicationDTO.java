package com.meditrack.dto;

import com.meditrack.enums.MedicationFrequency;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO for Medication. Sent to the frontend — never exposes the JPA entity directly.
 */
public class MedicationDTO {

    private Long id;
    private String name;
    private String dosage;
    private MedicationFrequency frequency;
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;
    private String customTimings;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MedicationDTO() {}

    // ─── Getters & Setters ──────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public MedicationFrequency getFrequency() { return frequency; }
    public void setFrequency(MedicationFrequency frequency) { this.frequency = frequency; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getCustomTimings() { return customTimings; }
    public void setCustomTimings(String customTimings) { this.customTimings = customTimings; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
