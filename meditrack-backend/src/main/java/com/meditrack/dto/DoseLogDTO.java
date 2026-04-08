package com.meditrack.dto;

import com.meditrack.enums.DoseStatus;
import java.time.LocalDateTime;

/**
 * Response DTO for a single dose log entry.
 * Includes the medication name inline to avoid a separate API call on the frontend.
 */
public class DoseLogDTO {

    private Long id;
    private Long medicationId;
    private String medicationName;   // Denormalized for convenience on the frontend
    private String medicationDosage;
    private LocalDateTime scheduledTime;
    private LocalDateTime takenTime;
    private DoseStatus status;
    private String notes;            // Dose-specific note
    private String medicationNotes;  // From the parent medication
    private LocalDateTime createdAt;

    public DoseLogDTO() {}

    // ─── Getters & Setters ──────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMedicationId() { return medicationId; }
    public void setMedicationId(Long medicationId) { this.medicationId = medicationId; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public String getMedicationDosage() { return medicationDosage; }
    public void setMedicationDosage(String medicationDosage) { this.medicationDosage = medicationDosage; }

    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }

    public LocalDateTime getTakenTime() { return takenTime; }
    public void setTakenTime(LocalDateTime takenTime) { this.takenTime = takenTime; }

    public DoseStatus getStatus() { return status; }
    public void setStatus(DoseStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getMedicationNotes() { return medicationNotes; }
    public void setMedicationNotes(String medicationNotes) { this.medicationNotes = medicationNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
