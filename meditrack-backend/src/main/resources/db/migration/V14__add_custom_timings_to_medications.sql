-- V14__add_custom_timings_to_medications.sql
-- Adds support for custom medication timings

ALTER TABLE medications
ADD COLUMN custom_timings TEXT DEFAULT NULL COMMENT 'Comma-separated times e.g. "08:00 AM, 02:00 PM"';
