package com.meditrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class IceContactRequestDTO {
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @NotBlank(message = "Relationship is required")
    private String relationship;
    
    @NotBlank(message = "Primary phone is required")
    private String phonePrimary;
    
    private String phoneSecondary;
    private String email;
    
    @NotNull(message = "Priority order is required")
    private Integer priorityOrder;

    public IceContactRequestDTO() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }
    public String getPhonePrimary() { return phonePrimary; }
    public void setPhonePrimary(String phonePrimary) { this.phonePrimary = phonePrimary; }
    public String getPhoneSecondary() { return phoneSecondary; }
    public void setPhoneSecondary(String phoneSecondary) { this.phoneSecondary = phoneSecondary; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getPriorityOrder() { return priorityOrder; }
    public void setPriorityOrder(Integer priorityOrder) { this.priorityOrder = priorityOrder; }
}
