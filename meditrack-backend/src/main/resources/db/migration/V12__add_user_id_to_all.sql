ALTER TABLE medications ADD COLUMN user_id BIGINT;
ALTER TABLE dose_logs ADD COLUMN user_id BIGINT;
ALTER TABLE symptoms ADD COLUMN user_id BIGINT;
ALTER TABLE vitals ADD COLUMN user_id BIGINT;
ALTER TABLE prescriptions ADD COLUMN user_id BIGINT;
ALTER TABLE appointments ADD COLUMN user_id BIGINT;
ALTER TABLE doctor_visits ADD COLUMN user_id BIGINT;
ALTER TABLE user_profile ADD COLUMN user_id BIGINT;

ALTER TABLE medications ADD CONSTRAINT fk_meds_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE dose_logs ADD CONSTRAINT fk_doses_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE symptoms ADD CONSTRAINT fk_symptoms_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE vitals ADD CONSTRAINT fk_vitals_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE prescriptions ADD CONSTRAINT fk_prescriptions_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE appointments ADD CONSTRAINT fk_appointments_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE doctor_visits ADD CONSTRAINT fk_visits_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE user_profile ADD CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id);
