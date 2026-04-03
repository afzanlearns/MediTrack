package com.meditrack.dto;

import java.time.LocalDate;

public class UserProfileRequestDTO {
    private String fullName;
    private LocalDate dateOfBirth;
    private String bloodType;
    private String allergies;
    private String primaryPhysicianName;
    private String primaryPhysicianPhone;

    public UserProfileRequestDTO() {}

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
}
