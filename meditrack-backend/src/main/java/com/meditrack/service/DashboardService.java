package com.meditrack.service;

import com.meditrack.dto.DashboardSummaryDTO;
import com.meditrack.dto.VitalsDTO;
import com.meditrack.dto.AppointmentDTO;
import com.meditrack.entity.Vitals;
import com.meditrack.entity.Appointment;
import com.meditrack.repository.MedicationRepository;
import com.meditrack.repository.VitalsRepository;
import com.meditrack.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Service layer for the Dashboard summary endpoint.
 * Aggregates data from multiple repositories into a single response object.
 */
@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final MedicationRepository medicationRepository;
    private final DoseLogService doseLogService;
    private final SymptomService symptomService;
    private final VitalsRepository vitalsRepository;
    private final AppointmentRepository appointmentRepository;

    public DashboardService(MedicationRepository medicationRepository,
                             DoseLogService doseLogService,
                             SymptomService symptomService,
                             VitalsRepository vitalsRepository,
                             AppointmentRepository appointmentRepository) {
        this.medicationRepository = medicationRepository;
        this.doseLogService = doseLogService;
        this.symptomService = symptomService;
        this.vitalsRepository = vitalsRepository;
        this.appointmentRepository = appointmentRepository;
    }

    /**
     * Builds the full dashboard summary:
     * - Adherence % over the last 30 days
     * - Today's dose schedule
     * - Last 5 symptom entries
     * - Count of active medications
     * - Next upcoming appointment
     * - Most recent vitals
     */
    public DashboardSummaryDTO getSummary() {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();

        summary.setAdherencePercentage(doseLogService.calculateAdherencePercentage(30));
        summary.setActiveMedicationCount((int) medicationRepository.countByIsActiveTrue());
        summary.setTodaysDoses(doseLogService.getDosesForDate(LocalDate.now()));
        summary.setRecentSymptoms(symptomService.getRecentSymptoms(5));

        // Next Appointment
        appointmentRepository.findFirstByIsCompletedFalseAndAppointmentDateGreaterThanEqualOrderByAppointmentDateAsc(LocalDate.now())
                .ifPresent(app -> summary.setNextAppointment(convertToAppointmentDTO(app)));

        // Latest Vitals
        vitalsRepository.findFirstByOrderByRecordedDateDesc()
                .ifPresent(v -> summary.setLatestVitals(convertToVitalsDTO(v)));

        return summary;
    }

    private AppointmentDTO convertToAppointmentDTO(Appointment app) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(app.getId());
        dto.setDoctorName(app.getDoctorName());
        dto.setAppointmentDate(app.getAppointmentDate());
        dto.setReason(app.getReason());
        dto.setLocation(app.getLocation());
        dto.setNotes(app.getNotes());
        dto.setCompleted(app.isCompleted());
        dto.setCreatedAt(app.getCreatedAt());
        return dto;
    }

    private VitalsDTO convertToVitalsDTO(Vitals v) {
        VitalsDTO dto = new VitalsDTO();
        dto.setId(v.getId());
        dto.setRecordedDate(v.getRecordedDate());
        dto.setSystolic(v.getSystolic());
        dto.setDiastolic(v.getDiastolic());
        dto.setBloodSugar(v.getBloodSugar());
        dto.setHeartRate(v.getHeartRate());
        dto.setNotes(v.getNotes());
        dto.setCreatedAt(v.getCreatedAt());
        return dto;
    }
}
