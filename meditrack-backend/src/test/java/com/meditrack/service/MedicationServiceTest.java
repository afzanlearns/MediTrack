package com.meditrack.service;

import com.meditrack.dto.MedicationDTO;
import com.meditrack.dto.MedicationRequestDTO;
import com.meditrack.entity.Medication;
import com.meditrack.enums.MedicationFrequency;
import com.meditrack.exception.ResourceNotFoundException;
import com.meditrack.repository.MedicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class MedicationServiceTest {

    @Mock
    private MedicationRepository medicationRepository;

    @InjectMocks
    private MedicationService medicationService;

    private Medication sampleMedication;

    @BeforeEach
    void setUp() {
        sampleMedication = new Medication();
        sampleMedication.setId(1L);
        sampleMedication.setName("Metformin");
        sampleMedication.setDosage("500mg");
        sampleMedication.setFrequency(MedicationFrequency.TWICE_DAILY);
        sampleMedication.setStartDate(LocalDate.of(2024, 1, 1));
        sampleMedication.setIsActive(true);
    }

    @Test
    void getAllMedications_returnsAllMappedDTOs() {
        when(medicationRepository.findAll()).thenReturn(List.of(sampleMedication));

        List<MedicationDTO> result = medicationService.getAllMedications();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Metformin");
        assertThat(result.get(0).getDosage()).isEqualTo("500mg");
    }

    @Test
    void getActiveMedications_returnsOnlyActiveMedications() {
        when(medicationRepository.findByIsActiveTrue()).thenReturn(List.of(sampleMedication));

        List<MedicationDTO> result = medicationService.getActiveMedications();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getIsActive()).isTrue();
    }

    @Test
    void getMedicationById_existingId_returnsDTO() {
        when(medicationRepository.findById(1L)).thenReturn(Optional.of(sampleMedication));

        MedicationDTO result = medicationService.getMedicationById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Metformin");
    }

    @Test
    void getMedicationById_nonExistentId_throwsResourceNotFoundException() {
        when(medicationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> medicationService.getMedicationById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void createMedication_validRequest_savesAndReturnsDTO() {
        MedicationRequestDTO request = new MedicationRequestDTO();
        request.setName("Aspirin");
        request.setDosage("100mg");
        request.setFrequency(MedicationFrequency.ONCE_DAILY);
        request.setStartDate(LocalDate.now());

        Medication savedMed = new Medication();
        savedMed.setId(2L);
        savedMed.setName("Aspirin");
        savedMed.setDosage("100mg");
        savedMed.setFrequency(MedicationFrequency.ONCE_DAILY);
        savedMed.setStartDate(LocalDate.now());
        savedMed.setIsActive(true);

        when(medicationRepository.save(any(Medication.class))).thenReturn(savedMed);

        MedicationDTO result = medicationService.createMedication(request);

        assertThat(result.getName()).isEqualTo("Aspirin");
        verify(medicationRepository, times(1)).save(any(Medication.class));
    }

    @Test
    void softDeleteMedication_existingId_setsIsActiveFalse() {
        when(medicationRepository.findById(1L)).thenReturn(Optional.of(sampleMedication));
        when(medicationRepository.save(any(Medication.class))).thenReturn(sampleMedication);

        medicationService.softDeleteMedication(1L);

        assertThat(sampleMedication.getIsActive()).isFalse();
        verify(medicationRepository).save(sampleMedication);
    }

    @Test
    void softDeleteMedication_nonExistentId_throwsResourceNotFoundException() {
        when(medicationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> medicationService.softDeleteMedication(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
