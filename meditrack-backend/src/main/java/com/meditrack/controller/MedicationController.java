package com.meditrack.controller;

import com.meditrack.dto.MedicationDTO;
import com.meditrack.dto.MedicationRequestDTO;
import com.meditrack.service.MedicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Medication CRUD operations.
 * All business logic is delegated to MedicationService — no logic here.
 */
@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    /** GET /api/medications — returns all medications (active and inactive) */
    @GetMapping
    public ResponseEntity<List<MedicationDTO>> getAllMedications() {
        return ResponseEntity.ok(medicationService.getAllMedications());
    }

    /** GET /api/medications/active — returns only active medications */
    @GetMapping("/active")
    public ResponseEntity<List<MedicationDTO>> getActiveMedications() {
        return ResponseEntity.ok(medicationService.getActiveMedications());
    }

    /** GET /api/medications/{id} — returns a single medication by ID */
    @GetMapping("/{id}")
    public ResponseEntity<MedicationDTO> getMedicationById(@PathVariable Long id) {
        return ResponseEntity.ok(medicationService.getMedicationById(id));
    }

    /** POST /api/medications — creates a new medication */
    @PostMapping
    public ResponseEntity<MedicationDTO> createMedication(
            @Valid @RequestBody MedicationRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medicationService.createMedication(request));
    }

    /** PUT /api/medications/{id} — updates an existing medication */
    @PutMapping("/{id}")
    public ResponseEntity<MedicationDTO> updateMedication(
            @PathVariable Long id,
            @Valid @RequestBody MedicationRequestDTO request) {
        return ResponseEntity.ok(medicationService.updateMedication(id, request));
    }

    /** DELETE /api/medications/{id} — soft-deletes a medication (sets isActive = false) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedication(@PathVariable Long id) {
        medicationService.softDeleteMedication(id);
        return ResponseEntity.noContent().build();
    }
}
