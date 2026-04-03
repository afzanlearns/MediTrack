package com.meditrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String googleId;

    @Column(nullable = false, unique = true)
    private String email;

    private String fullName;
    private String avatarUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public User() {}

    public User(Long id, String googleId, String email, String fullName, String avatarUrl, LocalDateTime createdAt) {
        this.id = id;
        this.googleId = googleId;
        this.email = email;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.createdAt = createdAt;
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public static class UserBuilder {
        private Long id;
        private String googleId;
        private String email;
        private String fullName;
        private String avatarUrl;
        private LocalDateTime createdAt;

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder googleId(String googleId) { this.googleId = googleId; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public UserBuilder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public User build() {
            return new User(id, googleId, email, fullName, avatarUrl, createdAt);
        }
    }
}
