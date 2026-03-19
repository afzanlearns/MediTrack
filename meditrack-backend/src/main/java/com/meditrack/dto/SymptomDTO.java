package com.meditrack.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO for a Symptom journal entry.
 */
public class SymptomDTO {

    private Long id;
    private String symptomName;
    private Integer severity;
    private LocalDate symptomDate;
    private String notes;
    private LocalDateTime createdAt;

    public SymptomDTO() {}

    // ─── Getters & Setters ──────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSymptomName() { return symptomName; }
    public void setSymptomName(String symptomName) { this.symptomName = symptomName; }

    public Integer getSeverity() { return severity; }
    public void setSeverity(Integer severity) { this.severity = severity; }

    public LocalDate getSymptomDate() { return symptomDate; }
    public void setSymptomDate(LocalDate symptomDate) { this.symptomDate = symptomDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
