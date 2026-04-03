CREATE TABLE appointments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_name     VARCHAR(255)    NOT NULL,
    appointment_date DATE           NOT NULL,
    reason          VARCHAR(500),
    location        VARCHAR(255),
    notes           TEXT,
    is_completed    BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
