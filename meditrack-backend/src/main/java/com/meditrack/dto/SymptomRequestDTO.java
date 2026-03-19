package com.meditrack.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

/**
 * Request DTO for creating or updating a Symptom entry.
 */
public class SymptomRequestDTO {

    @NotBlank(message = "Symptom name is required")
    private String symptomName;

    @NotNull(message = "Severity is required")
    @Min(value = 1, message = "Severity must be at least 1")
    @Max(value = 10, message = "Severity must be at most 10")
    private Integer severity;

    @NotNull(message = "Symptom date is required")
    private LocalDate symptomDate;

    private String notes;

    // ─── Getters & Setters ──────────────────────────────────────────────────
    public String getSymptomName() { return symptomName; }
    public void setSymptomName(String symptomName) { this.symptomName = symptomName; }

    public Integer getSeverity() { return severity; }
    public void setSeverity(Integer severity) { this.severity = severity; }

    public LocalDate getSymptomDate() { return symptomDate; }
    public void setSymptomDate(LocalDate symptomDate) { this.symptomDate = symptomDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
