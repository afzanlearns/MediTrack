package com.meditrack.controller;

import com.meditrack.dto.DoseLogDTO;
import com.meditrack.dto.DoseStatusUpdateDTO;
import com.meditrack.enums.DoseStatus;
import com.meditrack.service.DoseLogService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST controller for Dose Log operations.
 * Handles date-filtered queries, dose generation, and status updates.
 */
@RestController
@RequestMapping("/api/doses")
public class DoseLogController {

    private final DoseLogService doseLogService;

    public DoseLogController(DoseLogService doseLogService) {
        this.doseLogService = doseLogService;
    }

    /**
     * GET /api/doses
     *
     * Flexible endpoint supporting two query modes:
     *   1. ?date=YYYY-MM-DD          → returns all doses for a single day
     *   2. ?from=YYYY-MM-DD&to=YYYY-MM-DD&status=TAKEN  → range + optional status filter
     *
     * If no parameters are provided, defaults to today's doses.
     */
    @GetMapping
    public ResponseEntity<List<DoseLogDTO>> getDoses(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) DoseStatus status) {

        if (date != null) {
            return ResponseEntity.ok(doseLogService.getDosesForDate(date));
        }

        LocalDate rangeFrom = (from != null) ? from : LocalDate.now().minusDays(30);
        LocalDate rangeTo = (to != null) ? to : LocalDate.now();
        return ResponseEntity.ok(doseLogService.getDosesByDateRange(rangeFrom, rangeTo, status));
    }

    /**
     * POST /api/doses/generate?date=YYYY-MM-DD
     * Generates PENDING dose entries for all active medications on the given date.
     * Idempotent — safe to call multiple times; duplicates are skipped.
     */
    @PostMapping("/generate")
    public ResponseEntity<List<DoseLogDTO>> generateDoses(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(doseLogService.generateDosesForDate(date));
    }

    /**
     * PATCH /api/doses/{id}/status
     * Updates the status of a dose log to TAKEN, MISSED, or SKIPPED.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<DoseLogDTO> updateDoseStatus(
            @PathVariable Long id,
            @Valid @RequestBody DoseStatusUpdateDTO request) {
        return ResponseEntity.ok(doseLogService.updateDoseStatus(id, request));
    }
}
