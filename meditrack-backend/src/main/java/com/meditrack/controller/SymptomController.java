package com.meditrack.controller;

import com.meditrack.dto.SymptomDTO;
import com.meditrack.dto.SymptomRequestDTO;
import com.meditrack.service.SymptomService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST controller for Symptom Journal operations.
 */
@RestController
@RequestMapping("/api/symptoms")
public class SymptomController {

    private final SymptomService symptomService;

    public SymptomController(SymptomService symptomService) {
        this.symptomService = symptomService;
    }

    /**
     * GET /api/symptoms
     * Optional query params: ?name=Headache&from=YYYY-MM-DD&to=YYYY-MM-DD
     * Returns all symptoms if no filters are provided.
     */
    @GetMapping
    public ResponseEntity<List<SymptomDTO>> getSymptoms(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(symptomService.getSymptomsByFilter(name, from, to));
    }

    /** GET /api/symptoms/names — returns distinct symptom names for the dropdown */
    @GetMapping("/names")
    public ResponseEntity<List<String>> getDistinctSymptomNames() {
        return ResponseEntity.ok(symptomService.getDistinctSymptomNames());
    }

    /** POST /api/symptoms — logs a new symptom entry */
    @PostMapping
    public ResponseEntity<SymptomDTO> logSymptom(@Valid @RequestBody SymptomRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(symptomService.logSymptom(request));
    }

    /** PUT /api/symptoms/{id} — updates an existing symptom entry */
    @PutMapping("/{id}")
    public ResponseEntity<SymptomDTO> updateSymptom(
            @PathVariable Long id,
            @Valid @RequestBody SymptomRequestDTO request) {
        return ResponseEntity.ok(symptomService.updateSymptom(id, request));
    }

    /** DELETE /api/symptoms/{id} — hard-deletes a symptom entry */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSymptom(@PathVariable Long id) {
        symptomService.deleteSymptom(id);
        return ResponseEntity.noContent().build();
    }
}
