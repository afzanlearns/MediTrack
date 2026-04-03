package com.meditrack.repository;

import com.meditrack.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByAppointmentDateGreaterThanEqualOrderByAppointmentDateAsc(LocalDate today);
    List<Appointment> findByIsCompletedFalseAndAppointmentDateGreaterThanEqualOrderByAppointmentDateAsc(LocalDate today);
    List<Appointment> findAllByOrderByAppointmentDateDesc();
    
    // For dashboard
    Optional<Appointment> findFirstByIsCompletedFalseAndAppointmentDateGreaterThanEqualOrderByAppointmentDateAsc(LocalDate today);
}
