package com.meditrack.dto;

import java.time.LocalDateTime;

public class IceContactDTO {
    private Long id;
    private String fullName;
    private String relationship;
    private String phonePrimary;
    private String phoneSecondary;
    private String email;
    private Integer priorityOrder;
    private LocalDateTime createdAt;

    public IceContactDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
