package com.meditrack.controller;

import com.meditrack.dto.DoctorVisitDTO;
import com.meditrack.dto.DoctorVisitRequestDTO;
import com.meditrack.service.DoctorVisitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Doctor Visit Log operations.
 * Includes endpoints for visit CRUD and medication link/unlink.
 */
@RestController
@RequestMapping("/api/visits")
public class DoctorVisitController {

    private final DoctorVisitService visitService;

    public DoctorVisitController(DoctorVisitService visitService) {
        this.visitService = visitService;
    }

    /** GET /api/visits — returns all visits in reverse-chronological order */
    @GetMapping
    public ResponseEntity<List<DoctorVisitDTO>> getAllVisits() {
        return ResponseEntity.ok(visitService.getAllVisits());
    }

    /** GET /api/visits/{id} — returns a single visit with linked medications */
    @GetMapping("/{id}")
    public ResponseEntity<DoctorVisitDTO> getVisitById(@PathVariable Long id) {
        return ResponseEntity.ok(visitService.getVisitById(id));
    }

    /** POST /api/visits — creates a new doctor visit */
    @PostMapping
    public ResponseEntity<DoctorVisitDTO> createVisit(
            @Valid @RequestBody DoctorVisitRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(visitService.createVisit(request));
    }

    /** PUT /api/visits/{id} — updates an existing doctor visit */
    @PutMapping("/{id}")
    public ResponseEntity<DoctorVisitDTO> updateVisit(
            @PathVariable Long id,
            @Valid @RequestBody DoctorVisitRequestDTO request) {
        return ResponseEntity.ok(visitService.updateVisit(id, request));
    }

    /** DELETE /api/visits/{id} — deletes a doctor visit */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisit(@PathVariable Long id) {
        visitService.deleteVisit(id);
        return ResponseEntity.noContent().build();
    }

    /** POST /api/visits/{id}/medications/{medId} — links a medication to a visit */
    @PostMapping("/{id}/medications/{medId}")
    public ResponseEntity<DoctorVisitDTO> linkMedication(
            @PathVariable Long id,
            @PathVariable Long medId) {
        return ResponseEntity.ok(visitService.linkMedication(id, medId));
    }

    /** DELETE /api/visits/{id}/medications/{medId} — unlinks a medication from a visit */
    @DeleteMapping("/{id}/medications/{medId}")
    public ResponseEntity<Void> unlinkMedication(
            @PathVariable Long id,
            @PathVariable Long medId) {
        visitService.unlinkMedication(id, medId);
        return ResponseEntity.noContent().build();
    }
}
