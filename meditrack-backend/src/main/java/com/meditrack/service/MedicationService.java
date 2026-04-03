package com.meditrack.service;

import com.meditrack.dto.MedicationDTO;
import com.meditrack.dto.MedicationRequestDTO;
import com.meditrack.entity.Medication;
import com.meditrack.exception.ResourceNotFoundException;
import com.meditrack.repository.MedicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Medication management.
 * All business logic lives here — controllers only delegate, repositories only query.
 */
@Service
@Transactional
@SuppressWarnings("null")
public class MedicationService {

    private final MedicationRepository medicationRepository;

    public MedicationService(MedicationRepository medicationRepository) {
        this.medicationRepository = medicationRepository;
    }

    // ─── Read ────────────────────────────────────────────────────────────────

    public List<MedicationDTO> getAllMedications() {
        return medicationRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<MedicationDTO> getActiveMedications() {
        return medicationRepository.findByIsActiveTrue()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MedicationDTO getMedicationById(Long id) {
        Medication medication = findOrThrow(id);
        return toDTO(medication);
    }

    // ─── Create ──────────────────────────────────────────────────────────────

    public MedicationDTO createMedication(MedicationRequestDTO request) {
        Medication medication = new Medication();
        applyRequestToEntity(request, medication);
        Medication saved = medicationRepository.save(medication);
        return toDTO(saved);
    }

    // ─── Update ──────────────────────────────────────────────────────────────

    public MedicationDTO updateMedication(Long id, MedicationRequestDTO request) {
        Medication medication = findOrThrow(id);
        applyRequestToEntity(request, medication);
        Medication saved = medicationRepository.save(medication);
        return toDTO(saved);
    }

    // ─── Soft Delete ─────────────────────────────────────────────────────────

    /**
     * Soft-deletes a medication by setting isActive = false.
     * Historical dose logs are retained for adherence history.
     */
    public void softDeleteMedication(Long id) {
        Medication medication = findOrThrow(id);
        medication.setIsActive(false);
        medicationRepository.save(medication);
    }

    // ─── Internal Helpers ────────────────────────────────────────────────────

    private Medication findOrThrow(Long id) {
        return medicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medication", id));
    }

    private void applyRequestToEntity(MedicationRequestDTO request, Medication medication) {
        medication.setName(request.getName());
        medication.setDosage(request.getDosage());
        medication.setFrequency(request.getFrequency());
        medication.setStartDate(request.getStartDate());
        medication.setEndDate(request.getEndDate());
        medication.setNotes(request.getNotes());
    }

    /**
     * Maps a Medication entity to a MedicationDTO.
     * Intentionally manual — avoids exposing entity internals and circular references.
     */
    public MedicationDTO toDTO(Medication m) {
        MedicationDTO dto = new MedicationDTO();
        dto.setId(m.getId());
        dto.setName(m.getName());
        dto.setDosage(m.getDosage());
        dto.setFrequency(m.getFrequency());
        dto.setStartDate(m.getStartDate());
        dto.setEndDate(m.getEndDate());
        dto.setNotes(m.getNotes());
        dto.setIsActive(m.getIsActive());
        dto.setCreatedAt(m.getCreatedAt());
        dto.setUpdatedAt(m.getUpdatedAt());
        return dto;
    }
}
