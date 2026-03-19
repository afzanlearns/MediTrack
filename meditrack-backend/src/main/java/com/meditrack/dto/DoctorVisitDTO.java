package com.meditrack.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for a Doctor Visit entry.
 * Includes a list of linked medications (as MedicationDTOs) for display in the timeline.
 */
public class DoctorVisitDTO {

    private Long id;
    private String doctorName;
    private LocalDate visitDate;
    private String diagnosis;
    private String notes;
    private List<MedicationDTO> medications;  // Linked medications
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public DoctorVisitDTO() {}

    // ─── Getters & Setters ──────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public LocalDate getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<MedicationDTO> getMedications() { return medications; }
    public void setMedications(List<MedicationDTO> medications) { this.medications = medications; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
