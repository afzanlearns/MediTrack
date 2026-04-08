-- V15__add_notes_to_dose_logs.sql
-- Adds notes support for individual doses

ALTER TABLE dose_logs
ADD COLUMN notes TEXT DEFAULT NULL;
