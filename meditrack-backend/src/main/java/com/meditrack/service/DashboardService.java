package com.meditrack.service;

import com.meditrack.dto.DashboardSummaryDTO;
import com.meditrack.repository.MedicationRepository;
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

    public DashboardService(MedicationRepository medicationRepository,
                             DoseLogService doseLogService,
                             SymptomService symptomService) {
        this.medicationRepository = medicationRepository;
        this.doseLogService = doseLogService;
        this.symptomService = symptomService;
    }

    /**
     * Builds the full dashboard summary:
     * - Adherence % over the last 30 days
     * - Today's dose schedule
     * - Last 5 symptom entries
     * - Count of active medications
     */
    public DashboardSummaryDTO getSummary() {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();

        summary.setAdherencePercentage(doseLogService.calculateAdherencePercentage(30));
        summary.setActiveMedicationCount((int) medicationRepository.countByIsActiveTrue());
        summary.setTodaysDoses(doseLogService.getDosesForDate(LocalDate.now()));
        summary.setRecentSymptoms(symptomService.getRecentSymptoms(5));

        return summary;
    }
}
