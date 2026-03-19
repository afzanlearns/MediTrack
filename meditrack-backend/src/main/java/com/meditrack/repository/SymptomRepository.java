package com.meditrack.repository;

import com.meditrack.entity.Symptom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Spring Data JPA repository for Symptom entity.
 */
@Repository
public interface SymptomRepository extends JpaRepository<Symptom, Long> {

    /**
     * Returns symptoms filtered by name only.
     */
    List<Symptom> findBySymptomNameIgnoreCase(String symptomName);

    /**
     * Returns symptoms whose date falls within the given range.
     */
    List<Symptom> findBySymptomDateBetweenOrderBySymptomDateAsc(LocalDate from, LocalDate to);

    /**
     * Returns symptoms filtered by both name and date range.
     * Used for the severity line chart on the Symptoms page.
     */
    List<Symptom> findBySymptomNameIgnoreCaseAndSymptomDateBetweenOrderBySymptomDateAsc(
            String symptomName, LocalDate from, LocalDate to);

    /**
     * Returns the most recent N symptoms. Used by the dashboard summary.
     */
    @Query("SELECT s FROM Symptom s ORDER BY s.symptomDate DESC, s.createdAt DESC")
    List<Symptom> findRecentSymptoms();

    /**
     * Returns all distinct symptom names — used to populate the symptom name dropdown.
     */
    @Query("SELECT DISTINCT s.symptomName FROM Symptom s ORDER BY s.symptomName ASC")
    List<String> findDistinctSymptomNames();
}
