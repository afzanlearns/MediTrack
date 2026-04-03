package com.meditrack.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class UserProfileDTO {
    private Long id;
    private String fullName;
    private LocalDate dateOfBirth;
    private String bloodType;
    private String allergies;
    private String primaryPhysicianName;
    private String primaryPhysicianPhone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UserProfileDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public String getPrimaryPhysicianName() { return primaryPhysicianName; }
    public void setPrimaryPhysicianName(String primaryPhysicianName) { this.primaryPhysicianName = primaryPhysicianName; }
    public String getPrimaryPhysicianPhone() { return primaryPhysicianPhone; }
    public void setPrimaryPhysicianPhone(String primaryPhysicianPhone) { this.primaryPhysicianPhone = primaryPhysicianPhone; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
