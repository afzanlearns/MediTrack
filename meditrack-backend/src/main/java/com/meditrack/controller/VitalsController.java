package com.meditrack.controller;

import com.meditrack.dto.VitalsDTO;
import com.meditrack.dto.VitalsRequestDTO;
import com.meditrack.service.VitalsService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/vitals")
@CrossOrigin(origins = "*")
public class VitalsController {

    private final VitalsService vitalsService;

    public VitalsController(VitalsService vitalsService) {
        this.vitalsService = vitalsService;
    }

    @GetMapping
    public List<VitalsDTO> getVitals(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        if (from != null && to != null) {
            return vitalsService.getVitalsByDateRange(from, to);
        }
        return vitalsService.getAllVitals();
    }

    @PostMapping
    public ResponseEntity<VitalsDTO> logVitals(@Valid @RequestBody VitalsRequestDTO dto) {
        return new ResponseEntity<>(vitalsService.logVitals(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public VitalsDTO updateVitals(@PathVariable Long id, @Valid @RequestBody VitalsRequestDTO dto) {
        return vitalsService.updateVitals(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVitals(@PathVariable Long id) {
        vitalsService.deleteVitals(id);
        return ResponseEntity.noContent().build();
    }
}
