CREATE TABLE user_profile (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(255),
    date_of_birth   DATE,
    blood_type      VARCHAR(10),    -- A+, A-, B+, B-, AB+, AB-, O+, O-
    allergies       TEXT,           -- comma-separated or free text
    primary_physician_name   VARCHAR(255),
    primary_physician_phone  VARCHAR(20),
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
