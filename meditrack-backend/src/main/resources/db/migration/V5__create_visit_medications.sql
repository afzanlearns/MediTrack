-- V5__create_visit_medications.sql
-- Creates the junction table linking doctor_visits to medications (many-to-many)

CREATE TABLE visit_medications (
    visit_id        BIGINT  NOT NULL,
    medication_id   BIGINT  NOT NULL,
    PRIMARY KEY (visit_id, medication_id),
    CONSTRAINT fk_vm_visit      FOREIGN KEY (visit_id)      REFERENCES doctor_visits(id) ON DELETE CASCADE,
    CONSTRAINT fk_vm_medication FOREIGN KEY (medication_id) REFERENCES medications(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
