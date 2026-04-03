package com.meditrack.service;

import com.meditrack.dto.DoseLogDTO;
import com.meditrack.dto.DoseStatusUpdateDTO;
import com.meditrack.entity.DoseLog;
import com.meditrack.entity.Medication;
import com.meditrack.enums.DoseStatus;
import com.meditrack.enums.MedicationFrequency;
import com.meditrack.exception.ResourceNotFoundException;
import com.meditrack.repository.DoseLogRepository;
import com.meditrack.repository.MedicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class DoseLogServiceTest {

    @Mock
    private DoseLogRepository doseLogRepository;

    @Mock
    private MedicationRepository medicationRepository;

    @InjectMocks
    private DoseLogService doseLogService;

    private Medication onceDailyMed;

    @BeforeEach
    void setUp() {
        onceDailyMed = new Medication();
        onceDailyMed.setId(1L);
        onceDailyMed.setName("Metformin");
        onceDailyMed.setDosage("500mg");
        onceDailyMed.setFrequency(MedicationFrequency.ONCE_DAILY);
        onceDailyMed.setStartDate(LocalDate.of(2024, 1, 1));
        onceDailyMed.setIsActive(true);
    }

    @Test
    void generateDosesForDate_onceDailyMed_generatesOneDose() {
        LocalDate date = LocalDate.of(2024, 6, 15);
        when(medicationRepository.findActiveMedicationsForDate(date))
                .thenReturn(List.of(onceDailyMed));
        when(doseLogRepository.existsByMedicationIdAndScheduledTime(any(), any()))
                .thenReturn(false);

        DoseLog savedLog = new DoseLog();
        savedLog.setId(1L);
        savedLog.setMedication(onceDailyMed);
        savedLog.setScheduledTime(date.atTime(8, 0));
        savedLog.setStatus(DoseStatus.PENDING);

        when(doseLogRepository.save(any(DoseLog.class))).thenReturn(savedLog);

        List<DoseLogDTO> result = doseLogService.generateDosesForDate(date);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(DoseStatus.PENDING);
        verify(doseLogRepository, times(1)).save(any(DoseLog.class));
    }

    @Test
    void generateDosesForDate_twiceDailyMed_generatesTwoDoses() {
        onceDailyMed.setFrequency(MedicationFrequency.TWICE_DAILY);
        LocalDate date = LocalDate.of(2024, 6, 15);

        when(medicationRepository.findActiveMedicationsForDate(date))
                .thenReturn(List.of(onceDailyMed));
        when(doseLogRepository.existsByMedicationIdAndScheduledTime(any(), any()))
                .thenReturn(false);

        DoseLog log1 = new DoseLog();
        log1.setId(1L);
        log1.setMedication(onceDailyMed);
        log1.setScheduledTime(date.atTime(8, 0));
        log1.setStatus(DoseStatus.PENDING);

        DoseLog log2 = new DoseLog();
        log2.setId(2L);
        log2.setMedication(onceDailyMed);
        log2.setScheduledTime(date.atTime(20, 0));
        log2.setStatus(DoseStatus.PENDING);

        when(doseLogRepository.save(any(DoseLog.class))).thenReturn(log1, log2);

        List<DoseLogDTO> result = doseLogService.generateDosesForDate(date);

        assertThat(result).hasSize(2);
        verify(doseLogRepository, times(2)).save(any(DoseLog.class));
    }

    @Test
    void generateDosesForDate_alreadyExists_skipsDuplicates() {
        LocalDate date = LocalDate.of(2024, 6, 15);
        when(medicationRepository.findActiveMedicationsForDate(date))
                .thenReturn(List.of(onceDailyMed));
        // Simulate dose already generated
        when(doseLogRepository.existsByMedicationIdAndScheduledTime(any(), any()))
                .thenReturn(true);

        List<DoseLogDTO> result = doseLogService.generateDosesForDate(date);

        assertThat(result).isEmpty();
        verify(doseLogRepository, never()).save(any());
    }

    @Test
    void updateDoseStatus_toTaken_setsTakenTime() {
        DoseLog log = new DoseLog();
        log.setId(1L);
        log.setMedication(onceDailyMed);
        log.setScheduledTime(LocalDateTime.now());
        log.setStatus(DoseStatus.PENDING);

        when(doseLogRepository.findById(1L)).thenReturn(Optional.of(log));
        when(doseLogRepository.save(any())).thenReturn(log);

        DoseStatusUpdateDTO update = new DoseStatusUpdateDTO();
        update.setStatus(DoseStatus.TAKEN);

        doseLogService.updateDoseStatus(1L, update);

        assertThat(log.getStatus()).isEqualTo(DoseStatus.TAKEN);
        assertThat(log.getTakenTime()).isNotNull();
    }

    @Test
    void updateDoseStatus_toMissed_clearsTakenTime() {
        DoseLog log = new DoseLog();
        log.setId(1L);
        log.setMedication(onceDailyMed);
        log.setScheduledTime(LocalDateTime.now());
        log.setStatus(DoseStatus.TAKEN);
        log.setTakenTime(LocalDateTime.now());

        when(doseLogRepository.findById(1L)).thenReturn(Optional.of(log));
        when(doseLogRepository.save(any())).thenReturn(log);

        DoseStatusUpdateDTO update = new DoseStatusUpdateDTO();
        update.setStatus(DoseStatus.MISSED);

        doseLogService.updateDoseStatus(1L, update);

        assertThat(log.getStatus()).isEqualTo(DoseStatus.MISSED);
        assertThat(log.getTakenTime()).isNull();
    }

    @Test
    void updateDoseStatus_nonExistentId_throwsResourceNotFoundException() {
        when(doseLogRepository.findById(99L)).thenReturn(Optional.empty());

        DoseStatusUpdateDTO update = new DoseStatusUpdateDTO();
        update.setStatus(DoseStatus.TAKEN);

        assertThatThrownBy(() -> doseLogService.updateDoseStatus(99L, update))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void calculateAdherence_noLogs_returns100() {
        when(doseLogRepository.countByStatusAndScheduledTimeBetween(
                eq(DoseStatus.TAKEN), any(), any())).thenReturn(0L);
        when(doseLogRepository.countByStatusAndScheduledTimeBetween(
                eq(DoseStatus.MISSED), any(), any())).thenReturn(0L);

        double result = doseLogService.calculateAdherencePercentage(30);
        assertThat(result).isEqualTo(100.0);
    }

    @Test
    void calculateAdherence_allTaken_returns100() {
        when(doseLogRepository.countByStatusAndScheduledTimeBetween(
                eq(DoseStatus.TAKEN), any(), any())).thenReturn(10L);
        when(doseLogRepository.countByStatusAndScheduledTimeBetween(
                eq(DoseStatus.MISSED), any(), any())).thenReturn(0L);

        double result = doseLogService.calculateAdherencePercentage(30);
        assertThat(result).isEqualTo(100.0);
    }

    @Test
    void calculateAdherence_halfTaken_returns50() {
        when(doseLogRepository.countByStatusAndScheduledTimeBetween(
                eq(DoseStatus.TAKEN), any(), any())).thenReturn(5L);
        when(doseLogRepository.countByStatusAndScheduledTimeBetween(
                eq(DoseStatus.MISSED), any(), any())).thenReturn(5L);

        double result = doseLogService.calculateAdherencePercentage(30);
        assertThat(result).isEqualTo(50.0);
    }
}
