-- V4__create_doctor_visits.sql
-- Creates the doctor_visits table for the Doctor Visit Log feature

CREATE TABLE doctor_visits (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    doctor_name     VARCHAR(255)    NOT NULL,
    visit_date      DATE            NOT NULL,
    diagnosis       VARCHAR(500),
    notes           TEXT,
    created_at      TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
