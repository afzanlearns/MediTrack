package com.meditrack.repository;

import com.meditrack.entity.Vitals;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface VitalsRepository extends JpaRepository<Vitals, Long> {
    List<Vitals> findAllByOrderByRecordedDateDesc();
    List<Vitals> findByRecordedDateBetween(LocalDate from, LocalDate to);
    Optional<Vitals> findFirstByOrderByRecordedDateDesc();
}
