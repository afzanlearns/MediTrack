package com.meditrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

/**
 * Request DTO for creating or updating a Doctor Visit.
 * medicationIds is optional — used to link existing medications to this visit.
 */
public class DoctorVisitRequestDTO {

    @NotBlank(message = "Doctor name is required")
    private String doctorName;

    @NotNull(message = "Visit date is required")
    private LocalDate visitDate;

    private String diagnosis;

    private String notes;

    private List<Long> medicationIds;  // Optional list of medication IDs to link

    // ─── Getters & Setters ──────────────────────────────────────────────────
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public LocalDate getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<Long> getMedicationIds() { return medicationIds; }
    public void setMedicationIds(List<Long> medicationIds) { this.medicationIds = medicationIds; }
}
