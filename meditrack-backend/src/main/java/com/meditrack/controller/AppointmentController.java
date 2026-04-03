package com.meditrack.controller;

import com.meditrack.dto.AppointmentDTO;
import com.meditrack.dto.AppointmentRequestDTO;
import com.meditrack.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/upcoming")
    public List<AppointmentDTO> getUpcomingAppointments() {
        return appointmentService.getUpcomingAppointments();
    }

    @PostMapping
    public ResponseEntity<AppointmentDTO> createAppointment(@Valid @RequestBody AppointmentRequestDTO dto) {
        return new ResponseEntity<>(appointmentService.createAppointment(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public AppointmentDTO updateAppointment(@PathVariable Long id, @Valid @RequestBody AppointmentRequestDTO dto) {
        return appointmentService.updateAppointment(id, dto);
    }

    @PatchMapping("/{id}/complete")
    public AppointmentDTO markCompleted(@PathVariable Long id) {
        return appointmentService.markCompleted(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
