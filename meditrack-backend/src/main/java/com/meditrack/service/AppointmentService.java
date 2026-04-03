package com.meditrack.service;

import com.meditrack.dto.AppointmentDTO;
import com.meditrack.dto.AppointmentRequestDTO;
import com.meditrack.entity.Appointment;
import com.meditrack.exception.ResourceNotFoundException;
import com.meditrack.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAllByOrderByAppointmentDateDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getUpcomingAppointments() {
        return appointmentRepository.findByIsCompletedFalseAndAppointmentDateGreaterThanEqualOrderByAppointmentDateAsc(LocalDate.now()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AppointmentDTO createAppointment(AppointmentRequestDTO dto) {
        Appointment appointment = new Appointment();
        updateEntityFromDTO(appointment, dto);
        return convertToDTO(appointmentRepository.save(appointment));
    }

    public AppointmentDTO updateAppointment(Long id, AppointmentRequestDTO dto) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        updateEntityFromDTO(appointment, dto);
        return convertToDTO(appointmentRepository.save(appointment));
    }

    public AppointmentDTO markCompleted(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        appointment.setCompleted(true);
        return convertToDTO(appointmentRepository.save(appointment));
    }

    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found with id: " + id);
        }
        appointmentRepository.deleteById(id);
    }

    private void updateEntityFromDTO(Appointment appointment, AppointmentRequestDTO dto) {
        appointment.setDoctorName(dto.getDoctorName());
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setReason(dto.getReason());
        appointment.setLocation(dto.getLocation());
        appointment.setNotes(dto.getNotes());
    }

    private AppointmentDTO convertToDTO(Appointment appointment) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(appointment.getId());
        dto.setDoctorName(appointment.getDoctorName());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setReason(appointment.getReason());
        dto.setLocation(appointment.getLocation());
        dto.setNotes(appointment.getNotes());
        dto.setCompleted(appointment.isCompleted());
        dto.setCreatedAt(appointment.getCreatedAt());
        return dto;
    }
}
