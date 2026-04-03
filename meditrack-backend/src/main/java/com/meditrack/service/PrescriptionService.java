package com.meditrack.service;

import com.meditrack.dto.PrescriptionDTO;
import com.meditrack.entity.Prescription;
import com.meditrack.exception.ResourceNotFoundException;
import com.meditrack.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final Path uploadDir;

    public PrescriptionService(PrescriptionRepository prescriptionRepository, 
                               @Value("${app.upload.dir:uploads/prescriptions}") String uploadDir) throws IOException {
        this.prescriptionRepository = prescriptionRepository;
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(this.uploadDir);
    }

    public List<PrescriptionDTO> getAllPrescriptions() {
        return prescriptionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PrescriptionDTO uploadPrescription(MultipartFile file, String doctorName, LocalDate prescribedDate, String notes) throws IOException {
        String contentType = file.getContentType();
        if (contentType == null || !Arrays.asList("application/pdf", "image/jpeg", "image/png").contains(contentType)) {
            throw new IllegalArgumentException("Invalid file type. Only PDF, JPG, and PNG are allowed.");
        }

        String originalFileName = file.getOriginalFilename();
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID().toString() + extension;
        Path targetLocation = uploadDir.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation);

        Prescription prescription = new Prescription();
        prescription.setFileName(fileName);
        prescription.setOriginalName(originalFileName);
        prescription.setFileType(contentType);
        prescription.setFileSize(file.getSize());
        prescription.setDoctorName(doctorName);
        prescription.setPrescribedDate(prescribedDate);
        prescription.setNotes(notes);

        return convertToDTO(prescriptionRepository.save(prescription));
    }

    public Resource downloadPrescription(Long id) throws MalformedURLException {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));
        Path filePath = uploadDir.resolve(prescription.getFileName()).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        if (resource.exists()) {
            return resource;
        } else {
            throw new ResourceNotFoundException("File not found on disk: " + prescription.getFileName());
        }
    }

    public void deletePrescription(Long id) throws IOException {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));
        Path filePath = uploadDir.resolve(prescription.getFileName()).normalize();
        Files.deleteIfExists(filePath);
        prescriptionRepository.deleteById(id);
    }

    private PrescriptionDTO convertToDTO(Prescription prescription) {
        PrescriptionDTO dto = new PrescriptionDTO();
        dto.setId(prescription.getId());
        dto.setFileName(prescription.getFileName());
        dto.setOriginalName(prescription.getOriginalName());
        dto.setFileType(prescription.getFileType());
        dto.setFileSize(prescription.getFileSize());
        dto.setDoctorName(prescription.getDoctorName());
        dto.setPrescribedDate(prescription.getPrescribedDate());
        dto.setNotes(prescription.getNotes());
        dto.setCreatedAt(prescription.getCreatedAt());
        return dto;
    }
}
