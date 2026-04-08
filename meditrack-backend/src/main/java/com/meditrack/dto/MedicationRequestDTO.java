package com.meditrack.dto;

import com.meditrack.enums.MedicationFrequency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * Request DTO for creating or updating a Medication.
 * Bean Validation annotations reject invalid input before it reaches the service layer.
 */
public class MedicationRequestDTO {

    @NotBlank(message = "Medication name is required")
    private String name;

    @NotBlank(message = "Dosage is required")
    private String dosage;

    @NotNull(message = "Frequency is required")
    private MedicationFrequency frequency;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;  // Optional — null means ongoing

    private String notes;       // Optional
    private String customTimings; // Optional (only for CUSTOM frequency)

    // ─── Getters & Setters ──────────────────────────────────────────────────
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

    public String getCustomTimings() { return customTimings; }
    public void setCustomTimings(String customTimings) { this.customTimings = customTimings; }
}
