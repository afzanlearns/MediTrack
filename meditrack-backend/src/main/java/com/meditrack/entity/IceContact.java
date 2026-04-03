package com.meditrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ice_contacts")
public class IceContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String relationship;

    @Column(name = "phone_primary", nullable = false)
    private String phonePrimary;

    @Column(name = "phone_secondary")
    private String phoneSecondary;

    private String email;

    @Column(name = "priority_order", nullable = false)
    private Integer priorityOrder = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public IceContact() {}

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
