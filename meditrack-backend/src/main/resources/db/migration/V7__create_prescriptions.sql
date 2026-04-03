CREATE TABLE prescriptions (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name       VARCHAR(255)    NOT NULL,
    original_name   VARCHAR(255)    NOT NULL,
    file_type       VARCHAR(100)    NOT NULL,
    file_size       BIGINT          NOT NULL,
    doctor_name     VARCHAR(255),
    prescribed_date DATE,
    notes           TEXT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);
