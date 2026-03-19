package com.meditrack.repository;

import com.meditrack.entity.DoctorVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for DoctorVisit entity.
 */
@Repository
public interface DoctorVisitRepository extends JpaRepository<DoctorVisit, Long> {

    /**
     * Returns all visits ordered by visit date descending (most recent first).
     * Used by the Doctor Visits timeline view.
     */
    List<DoctorVisit> findAllByOrderByVisitDateDesc();
}
