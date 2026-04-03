package com.meditrack.controller;

import com.meditrack.dto.PrescriptionDTO;
import com.meditrack.service.PrescriptionService;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @GetMapping
    public List<PrescriptionDTO> getAllPrescriptions() {
        return prescriptionService.getAllPrescriptions();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PrescriptionDTO> uploadPrescription(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "doctorName", required = false) String doctorName,
            @RequestParam(value = "prescribedDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate prescribedDate,
            @RequestParam(value = "notes", required = false) String notes) throws IOException {
        PrescriptionDTO dto = prescriptionService.uploadPrescription(file, doctorName, prescribedDate, notes);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> downloadPrescription(@PathVariable Long id) throws IOException {
        Resource resource = prescriptionService.downloadPrescription(id);
        String filename = resource.getFilename();
        
        // This is a simple way to determine content type. In production, consider using Tika or similar.
        String contentType = "application/octet-stream";
        if (filename != null) {
            String normalized = filename.toLowerCase();
            if (normalized.endsWith(".pdf")) contentType = "application/pdf";
            else if (normalized.endsWith(".png")) contentType = "image/png";
            else if (normalized.endsWith(".jpg") || normalized.endsWith(".jpeg")) contentType = "image/jpeg";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + (filename != null ? filename : "file") + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) throws IOException {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }
}
