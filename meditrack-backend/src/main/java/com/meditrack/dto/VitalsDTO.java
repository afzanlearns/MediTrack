package com.meditrack.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class VitalsDTO {
    private Long id;
    private LocalDate recordedDate;
    private Integer systolic;
    private Integer diastolic;
    private BigDecimal bloodSugar;
    private Integer heartRate;
    private String notes;
    private LocalDateTime createdAt;

    public VitalsDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getRecordedDate() { return recordedDate; }
    public void setRecordedDate(LocalDate recordedDate) { this.recordedDate = recordedDate; }
    public Integer getSystolic() { return systolic; }
    public void setSystolic(Integer systolic) { this.systolic = systolic; }
    public Integer getDiastolic() { return diastolic; }
    public void setDiastolic(Integer diastolic) { this.diastolic = diastolic; }
    public BigDecimal getBloodSugar() { return bloodSugar; }
    public void setBloodSugar(BigDecimal bloodSugar) { this.bloodSugar = bloodSugar; }
    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
