package com.meditrack.service;

import com.meditrack.dto.VitalsDTO;
import com.meditrack.dto.VitalsRequestDTO;
import com.meditrack.entity.Vitals;
import com.meditrack.exception.ResourceNotFoundException;
import com.meditrack.repository.VitalsRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class VitalsService {

    private final VitalsRepository vitalsRepository;

    public VitalsService(VitalsRepository vitalsRepository) {
        this.vitalsRepository = vitalsRepository;
    }

    public List<VitalsDTO> getAllVitals() {
        return vitalsRepository.findAllByOrderByRecordedDateDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<VitalsDTO> getVitalsByDateRange(LocalDate from, LocalDate to) {
        return vitalsRepository.findByRecordedDateBetween(from, to).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public VitalsDTO logVitals(VitalsRequestDTO dto) {
        Vitals vitals = new Vitals();
        updateEntityFromDTO(vitals, dto);
        return convertToDTO(vitalsRepository.save(vitals));
    }

    public VitalsDTO updateVitals(Long id, VitalsRequestDTO dto) {
        Vitals vitals = vitalsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vitals record not found with id: " + id));
        updateEntityFromDTO(vitals, dto);
        return convertToDTO(vitalsRepository.save(vitals));
    }

    public void deleteVitals(Long id) {
        if (!vitalsRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vitals record not found with id: " + id);
        }
        vitalsRepository.deleteById(id);
    }

    private void updateEntityFromDTO(Vitals vitals, VitalsRequestDTO dto) {
        vitals.setRecordedDate(dto.getRecordedDate());
        vitals.setSystolic(dto.getSystolic());
        vitals.setDiastolic(dto.getDiastolic());
        vitals.setBloodSugar(dto.getBloodSugar());
        vitals.setHeartRate(dto.getHeartRate());
        vitals.setNotes(dto.getNotes());
    }

    private VitalsDTO convertToDTO(Vitals vitals) {
        VitalsDTO dto = new VitalsDTO();
        dto.setId(vitals.getId());
        dto.setRecordedDate(vitals.getRecordedDate());
        dto.setSystolic(vitals.getSystolic());
        dto.setDiastolic(vitals.getDiastolic());
        dto.setBloodSugar(vitals.getBloodSugar());
        dto.setHeartRate(vitals.getHeartRate());
        dto.setNotes(vitals.getNotes());
        dto.setCreatedAt(vitals.getCreatedAt());
        return dto;
    }
}
