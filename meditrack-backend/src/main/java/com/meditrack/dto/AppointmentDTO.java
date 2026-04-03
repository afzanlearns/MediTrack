package com.meditrack.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AppointmentDTO {
    private Long id;
    private String doctorName;
    private LocalDate appointmentDate;
    private String reason;
    private String location;
    private String notes;
    private boolean isCompleted;
    private LocalDateTime createdAt;

    public AppointmentDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public boolean isCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
