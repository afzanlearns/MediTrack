CREATE TABLE vitals (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    recorded_date   DATE        NOT NULL,
    systolic        INT,                        -- Blood pressure (e.g. 120)
    diastolic       INT,                        -- Blood pressure (e.g. 80)
    blood_sugar     DECIMAL(6,2),               -- mg/dL
    heart_rate      INT,                        -- bpm
    notes           TEXT,
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);
