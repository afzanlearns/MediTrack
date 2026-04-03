package com.meditrack.service;

import com.meditrack.dto.DoctorVisitDTO;
import com.meditrack.dto.DoctorVisitRequestDTO;
import com.meditrack.entity.DoctorVisit;
import com.meditrack.entity.Medication;
import com.meditrack.exception.ResourceNotFoundException;
import com.meditrack.repository.DoctorVisitRepository;
import com.meditrack.repository.MedicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service layer for Doctor Visit Log management.
 * Handles visit CRUD and medication link/unlink operations.
 */
@Service
@Transactional
@SuppressWarnings("null")
public class DoctorVisitService {

    private final DoctorVisitRepository visitRepository;
    private final MedicationRepository medicationRepository;
    private final MedicationService medicationService;

    public DoctorVisitService(DoctorVisitRepository visitRepository,
                               MedicationRepository medicationRepository,
                               MedicationService medicationService) {
        this.visitRepository = visitRepository;
        this.medicationRepository = medicationRepository;
        this.medicationService = medicationService;
    }

    // ─── Read ────────────────────────────────────────────────────────────────

    public List<DoctorVisitDTO> getAllVisits() {
        return visitRepository.findAllByOrderByVisitDateDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DoctorVisitDTO getVisitById(Long id) {
        return toDTO(findOrThrow(id));
    }

    // ─── Create ──────────────────────────────────────────────────────────────

    public DoctorVisitDTO createVisit(DoctorVisitRequestDTO request) {
        DoctorVisit visit = new DoctorVisit();
        applyRequestToEntity(request, visit);
        return toDTO(visitRepository.save(visit));
    }

    // ─── Update ──────────────────────────────────────────────────────────────

    public DoctorVisitDTO updateVisit(Long id, DoctorVisitRequestDTO request) {
        DoctorVisit visit = findOrThrow(id);
        applyRequestToEntity(request, visit);
        return toDTO(visitRepository.save(visit));
    }

    // ─── Delete ──────────────────────────────────────────────────────────────

    public void deleteVisit(Long id) {
        if (!visitRepository.existsById(id)) {
            throw new ResourceNotFoundException("DoctorVisit", id);
        }
        visitRepository.deleteById(id);
    }

    // ─── Medication Linking ──────────────────────────────────────────────────

    public DoctorVisitDTO linkMedication(Long visitId, Long medicationId) {
        DoctorVisit visit = findOrThrow(visitId);
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Medication", medicationId));
        visit.getMedications().add(medication);
        return toDTO(visitRepository.save(visit));
    }

    public void unlinkMedication(Long visitId, Long medicationId) {
        DoctorVisit visit = findOrThrow(visitId);
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Medication", medicationId));
        visit.getMedications().remove(medication);
        visitRepository.save(visit);
    }

    // ─── Internal Helpers ────────────────────────────────────────────────────

    private DoctorVisit findOrThrow(Long id) {
        return visitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DoctorVisit", id));
    }

    private void applyRequestToEntity(DoctorVisitRequestDTO request, DoctorVisit visit) {
        visit.setDoctorName(request.getDoctorName());
        visit.setVisitDate(request.getVisitDate());
        visit.setDiagnosis(request.getDiagnosis());
        visit.setNotes(request.getNotes());

        // Link medications if IDs are provided in the request
        if (request.getMedicationIds() != null && !request.getMedicationIds().isEmpty()) {
            Set<Medication> medications = new HashSet<>(
                    medicationRepository.findAllById(request.getMedicationIds()));
            visit.setMedications(medications);
        } else {
            visit.setMedications(new HashSet<>());
        }
    }

    public DoctorVisitDTO toDTO(DoctorVisit v) {
        DoctorVisitDTO dto = new DoctorVisitDTO();
        dto.setId(v.getId());
        dto.setDoctorName(v.getDoctorName());
        dto.setVisitDate(v.getVisitDate());
        dto.setDiagnosis(v.getDiagnosis());
        dto.setNotes(v.getNotes());
        dto.setCreatedAt(v.getCreatedAt());
        dto.setUpdatedAt(v.getUpdatedAt());
        dto.setMedications(
                v.getMedications().stream()
                        .map(medicationService::toDTO)
                        .collect(Collectors.toList())
        );
        return dto;
    }
}
