package com.meditrack.scheduler;

import com.meditrack.entity.DoseLog;
import com.meditrack.enums.DoseStatus;
import com.meditrack.repository.DoseLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduled task that runs every 5 minutes to check for upcoming doses.
 *
 * The frontend polls GET /api/reminders/pending every 60 seconds to retrieve
 * dues within the next 30 minutes. This scheduler logs them server-side
 * and could be extended to send push/email notifications in the future.
 *
 * @EnableScheduling must be present on MediTrackApplication for this to run.
 */
@Component
public class ReminderScheduler {

    private static final Logger log = LoggerFactory.getLogger(ReminderScheduler.class);

    private final DoseLogRepository doseLogRepository;

    public ReminderScheduler(DoseLogRepository doseLogRepository) {
        this.doseLogRepository = doseLogRepository;
    }

    /**
     * Runs every 5 minutes (300,000 ms).
     * Finds PENDING doses scheduled within the next 30 minutes and logs them.
     * The React frontend retrieves these via GET /api/reminders/pending polling.
     */
    @Scheduled(fixedDelay = 300_000)
    public void checkUpcomingDoses() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime in30min = now.plusMinutes(30);

        List<DoseLog> upcoming = doseLogRepository
                .findByScheduledTimeBetweenAndStatus(now, in30min, DoseStatus.PENDING);

        if (!upcoming.isEmpty()) {
            log.info("[ReminderScheduler] {} dose(s) due within 30 minutes:", upcoming.size());
            upcoming.forEach(d -> log.info("  → {} | {} | scheduled: {}",
                    d.getMedication().getName(),
                    d.getMedication().getDosage(),
                    d.getScheduledTime()));
        }
    }
}
