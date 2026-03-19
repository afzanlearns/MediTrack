package com.meditrack.service;

import com.meditrack.dto.SymptomDTO;
import com.meditrack.dto.SymptomRequestDTO;
import com.meditrack.entity.Symptom;
import com.meditrack.exception.ResourceNotFoundException;
import com.meditrack.repository.SymptomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Symptom Journal management.
 */
@Service
@Transactional
public class SymptomService {

    private final SymptomRepository symptomRepository;

    public SymptomService(SymptomRepository symptomRepository) {
        this.symptomRepository = symptomRepository;
    }

    // ─── Read ────────────────────────────────────────────────────────────────

    public List<SymptomDTO> getAllSymptoms() {
        return symptomRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Returns symptoms filtered by optional name and/or date range.
     * If neither is provided, returns all symptoms.
     */
    public List<SymptomDTO> getSymptomsByFilter(String name, LocalDate from, LocalDate to) {
        List<Symptom> results;

        boolean hasName = name != null && !name.isBlank();
        boolean hasRange = from != null && to != null;

        if (hasName && hasRange) {
            results = symptomRepository
                    .findBySymptomNameIgnoreCaseAndSymptomDateBetweenOrderBySymptomDateAsc(name, from, to);
        } else if (hasName) {
            results = symptomRepository.findBySymptomNameIgnoreCase(name);
        } else if (hasRange) {
            results = symptomRepository.findBySymptomDateBetweenOrderBySymptomDateAsc(from, to);
        } else {
            results = symptomRepository.findAll();
        }

        return results.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Returns the most recent 5 symptoms — used by the dashboard summary.
     */
    public List<SymptomDTO> getRecentSymptoms(int limit) {
        return symptomRepository.findRecentSymptoms()
                .stream()
                .limit(limit)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Returns all distinct symptom names — used to populate the filter dropdown.
     */
    public List<String> getDistinctSymptomNames() {
        return symptomRepository.findDistinctSymptomNames();
    }

    // ─── Create ──────────────────────────────────────────────────────────────

    public SymptomDTO logSymptom(SymptomRequestDTO request) {
        Symptom symptom = new Symptom();
        applyRequestToEntity(request, symptom);
        return toDTO(symptomRepository.save(symptom));
    }

    // ─── Update ──────────────────────────────────────────────────────────────

    public SymptomDTO updateSymptom(Long id, SymptomRequestDTO request) {
        Symptom symptom = symptomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Symptom", id));
        applyRequestToEntity(request, symptom);
        return toDTO(symptomRepository.save(symptom));
    }

    // ─── Delete ──────────────────────────────────────────────────────────────

    public void deleteSymptom(Long id) {
        if (!symptomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Symptom", id);
        }
        symptomRepository.deleteById(id);
    }

    // ─── Internal Helpers ────────────────────────────────────────────────────

    private void applyRequestToEntity(SymptomRequestDTO request, Symptom symptom) {
        symptom.setSymptomName(request.getSymptomName());
        symptom.setSeverity(request.getSeverity());
        symptom.setSymptomDate(request.getSymptomDate());
        symptom.setNotes(request.getNotes());
    }

    public SymptomDTO toDTO(Symptom s) {
        SymptomDTO dto = new SymptomDTO();
        dto.setId(s.getId());
        dto.setSymptomName(s.getSymptomName());
        dto.setSeverity(s.getSeverity());
        dto.setSymptomDate(s.getSymptomDate());
        dto.setNotes(s.getNotes());
        dto.setCreatedAt(s.getCreatedAt());
        return dto;
    }
}
