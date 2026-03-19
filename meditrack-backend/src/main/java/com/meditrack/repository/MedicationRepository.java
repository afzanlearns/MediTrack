package com.meditrack.repository;

import com.meditrack.entity.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Spring Data JPA repository for Medication entity.
 * All queries are derived from method names or JPQL — no raw SQL in repositories.
 */
@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {

    /**
     * Returns all medications that are currently active (not soft-deleted).
     */
    List<Medication> findByIsActiveTrue();

    /**
     * Returns active medications whose start date is on or before the given date
     * AND either have no end date (ongoing) or their end date is on or after the given date.
     * Used by dose generation to find medications relevant to a specific date.
     */
    @Query("SELECT m FROM Medication m WHERE m.isActive = true " +
           "AND m.startDate <= :date " +
           "AND (m.endDate IS NULL OR m.endDate >= :date)")
    List<Medication> findActiveMedicationsForDate(@Param("date") LocalDate date);

    /**
     * Count of currently active medications — used by the dashboard summary.
     */
    long countByIsActiveTrue();
}
