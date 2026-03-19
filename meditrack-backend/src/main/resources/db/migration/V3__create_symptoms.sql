-- V3__create_symptoms.sql
-- Creates the symptoms table for the Symptom Journal feature

CREATE TABLE symptoms (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    symptom_name    VARCHAR(255)    NOT NULL,
    severity        INT             NOT NULL,   -- 1 to 10
    symptom_date    DATE            NOT NULL,
    notes           TEXT,
    created_at      TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_severity CHECK (severity BETWEEN 1 AND 10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
