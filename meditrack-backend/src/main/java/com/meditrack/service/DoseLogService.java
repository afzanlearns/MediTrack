package com.meditrack.service;

import com.meditrack.dto.DoseLogDTO;
import com.meditrack.dto.DoseStatusUpdateDTO;
import com.meditrack.entity.DoseLog;
import com.meditrack.entity.Medication;
import com.meditrack.enums.DoseStatus;
import com.meditrack.enums.MedicationFrequency;
import com.meditrack.exception.ResourceNotFoundException;
import com.meditrack.repository.DoseLogRepository;
import com.meditrack.repository.MedicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for dose log management.
 * Handles dose generation logic based on medication frequency, and status updates.
 */
@Service
@Transactional
@SuppressWarnings("null")
public class DoseLogService {

    private final DoseLogRepository doseLogRepository;
    private final MedicationRepository medicationRepository;

    public DoseLogService(DoseLogRepository doseLogRepository,
                          MedicationRepository medicationRepository) {
        this.doseLogRepository = doseLogRepository;
        this.medicationRepository = medicationRepository;
    }

    // ─── Read ────────────────────────────────────────────────────────────────

    /**
     * Returns all dose logs for a specific date (midnight to 23:59:59).
     */
    public List<DoseLogDTO> getDosesForDate(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);
        return doseLogRepository.findByScheduledTimeBetween(start, end)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Returns dose logs within a date range, optionally filtered by status.
     * If status is null, all statuses are returned.
     */
    public List<DoseLogDTO> getDosesByDateRange(LocalDate from, LocalDate to, DoseStatus status) {
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.atTime(LocalTime.MAX);

        List<DoseLog> logs;
        if (status != null) {
            logs = doseLogRepository.findByScheduledTimeBetweenAndStatus(start, end, status);
        } else {
            logs = doseLogRepository.findByScheduledTimeBetween(start, end);
        }

        return logs.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Returns PENDING dose logs scheduled within the next 30 minutes.
     * Used by GET /api/reminders/pending.
     */
    public List<DoseLogDTO> getPendingReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime in30min = now.plusMinutes(30);
        return doseLogRepository.findByScheduledTimeBetweenAndStatus(now, in30min, DoseStatus.PENDING)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ─── Generate ────────────────────────────────────────────────────────────

    /**
     * Generates PENDING dose entries for all active medications relevant to the given date.
     * Idempotent — skips any dose that already exists for a medication + scheduled time combination.
     *
     * Dose times by frequency:
     *   ONCE_DAILY          → 08:00
     *   TWICE_DAILY         → 08:00, 20:00
     *   THREE_TIMES_DAILY   → 08:00, 14:00, 20:00
     *   EVERY_8_HOURS       → 08:00, 16:00, 00:00 (midnight)
     *   WEEKLY              → 08:00 only on matching weekday of medication's startDate
     */
    public List<DoseLogDTO> generateDosesForDate(LocalDate date) {
        List<Medication> activeMedications = medicationRepository.findActiveMedicationsForDate(date);

        for (Medication med : activeMedications) {
            List<LocalTime> times = getDoseTimes(med.getFrequency(), med.getStartDate(), date);

            for (LocalTime time : times) {
                LocalDateTime scheduledDateTime = date.atTime(time);

                // Idempotency check — avoid creating duplicates
                if (!doseLogRepository.existsByMedicationIdAndScheduledTime(
                        med.getId(), scheduledDateTime)) {
                    DoseLog log = new DoseLog();
                    log.setMedication(med);
                    log.setScheduledTime(scheduledDateTime);
                    log.setStatus(DoseStatus.PENDING);
                    doseLogRepository.save(log);
                }
            }
        }

        // Return the FULL list for the date (both old and new)
        return getDosesForDate(date);
    }

    // ─── Update Status ───────────────────────────────────────────────────────

    /**
     * Updates the status of a dose log.
     * When status is set to TAKEN, takenTime is recorded as the current timestamp.
     * When status is changed away from TAKEN, takenTime is cleared.
     */
    public DoseLogDTO updateDoseStatus(Long id, DoseStatusUpdateDTO request) {
        DoseLog log = doseLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DoseLog", id));

        log.setStatus(request.getStatus());

        if (request.getStatus() == DoseStatus.TAKEN) {
            log.setTakenTime(LocalDateTime.now());
        } else {
            log.setTakenTime(null);
        }

        return toDTO(doseLogRepository.save(log));
    }

    // ─── Adherence Calculation ───────────────────────────────────────────────

    /**
     * Calculates adherence % = TAKEN / (TAKEN + MISSED) for the past N days.
     * PENDING and SKIPPED doses are excluded from the calculation.
     * Returns 100.0 if there are no TAKEN or MISSED doses in the period.
     */
    public double calculateAdherencePercentage(int days) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusDays(days);

        long taken = doseLogRepository.countByStatusAndScheduledTimeBetween(
                DoseStatus.TAKEN, start, end);
        long missed = doseLogRepository.countByStatusAndScheduledTimeBetween(
                DoseStatus.MISSED, start, end);

        long total = taken + missed;
        if (total == 0) return 100.0;

        return Math.round(((double) taken / total) * 1000.0) / 10.0; // round to 1 decimal
    }

    // ─── Internal Helpers ────────────────────────────────────────────────────

    /**
     * Determines the dose times for a given frequency and date.
     * WEEKLY only produces a dose if the given date falls on the same weekday
     * as the medication's start date.
     */
    private List<LocalTime> getDoseTimes(MedicationFrequency frequency,
                                          LocalDate startDate, LocalDate date) {
        List<LocalTime> times = new ArrayList<>();

        switch (frequency) {
            case ONCE_DAILY:
                times.add(LocalTime.of(8, 0));
                break;
            case TWICE_DAILY:
                times.add(LocalTime.of(8, 0));
                times.add(LocalTime.of(20, 0));
                break;
            case THREE_TIMES_DAILY:
                times.add(LocalTime.of(8, 0));
                times.add(LocalTime.of(14, 0));
                times.add(LocalTime.of(20, 0));
                break;
            case EVERY_8_HOURS:
                times.add(LocalTime.of(8, 0));
                times.add(LocalTime.of(16, 0));
                times.add(LocalTime.of(0, 0));
                break;
            case WEEKLY:
                // Only generate a dose if the date matches the startDate's day of the week
                if (date.getDayOfWeek() == startDate.getDayOfWeek()) {
                    times.add(LocalTime.of(8, 0));
                }
                break;
        }

        return times;
    }

    /**
     * Maps a DoseLog entity to a DoseLogDTO.
     * Includes medication name and dosage inline for frontend convenience.
     */
    public DoseLogDTO toDTO(DoseLog log) {
        DoseLogDTO dto = new DoseLogDTO();
        dto.setId(log.getId());
        dto.setMedicationId(log.getMedication().getId());
        dto.setMedicationName(log.getMedication().getName());
        dto.setMedicationDosage(log.getMedication().getDosage());
        dto.setScheduledTime(log.getScheduledTime());
        dto.setTakenTime(log.getTakenTime());
        dto.setStatus(log.getStatus());
        dto.setCreatedAt(log.getCreatedAt());
        return dto;
    }
}
