-- V1__create_medications.sql
-- Creates the medications table

CREATE TABLE medications (
    id          BIGINT          AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255)    NOT NULL,
    dosage      VARCHAR(100)    NOT NULL,
    frequency   VARCHAR(50)     NOT NULL,   -- ONCE_DAILY, TWICE_DAILY, THREE_TIMES_DAILY, EVERY_8_HOURS, WEEKLY
    start_date  DATE            NOT NULL,
    end_date    DATE,                       -- NULL means ongoing
    notes       TEXT,
    is_active   BOOLEAN         NOT NULL    DEFAULT TRUE,
    created_at  TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
