-- V2__create_dose_logs.sql
-- Creates the dose_logs table (linked to medications via FK)

CREATE TABLE dose_logs (
    id              BIGINT      AUTO_INCREMENT PRIMARY KEY,
    medication_id   BIGINT      NOT NULL,
    scheduled_time  DATETIME    NOT NULL,
    taken_time      DATETIME,               -- NULL if not taken/skipped
    status          VARCHAR(20) NOT NULL    DEFAULT 'PENDING',  -- TAKEN, MISSED, SKIPPED, PENDING
    created_at      TIMESTAMP   NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dose_medication FOREIGN KEY (medication_id) REFERENCES medications(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
