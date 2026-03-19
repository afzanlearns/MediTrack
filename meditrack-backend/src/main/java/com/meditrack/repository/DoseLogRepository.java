package com.meditrack.repository;

import com.meditrack.entity.DoseLog;
import com.meditrack.enums.DoseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Spring Data JPA repository for DoseLog entity.
 */
@Repository
public interface DoseLogRepository extends JpaRepository<DoseLog, Long> {

    /**
     * Returns all dose logs whose scheduled time falls within the given range.
     * Used to retrieve doses for a specific date (start of day → end of day).
     */
    List<DoseLog> findByScheduledTimeBetween(LocalDateTime start, LocalDateTime end);

    /**
     * Returns all dose logs whose scheduled time falls within the range AND match the given status.
     * Used by the reminder scheduler and the pending reminders endpoint.
     */
    List<DoseLog> findByScheduledTimeBetweenAndStatus(
            LocalDateTime start, LocalDateTime end, DoseStatus status);

    /**
     * Returns all dose logs for a specific medication.
     */
    List<DoseLog> findByMedicationId(Long medicationId);

    /**
     * Count how many dose logs match a given status within a time range.
     * Used to calculate adherence percentage on the dashboard.
     */
    long countByStatusAndScheduledTimeBetween(
            DoseStatus status, LocalDateTime start, LocalDateTime end);

    /**
     * Returns dose logs within range filtered by status.
     * Used by DoseLogController for filtered history queries.
     */
    List<DoseLog> findByScheduledTimeBetweenAndStatusIn(
            LocalDateTime start, LocalDateTime end, List<DoseStatus> statuses);

    /**
     * Check if any dose log already exists for a medication on a given scheduled time.
     * Prevents duplicate generation when called multiple times for the same date.
     */
    boolean existsByMedicationIdAndScheduledTime(Long medicationId, LocalDateTime scheduledTime);
}
