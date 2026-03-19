package com.meditrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * MediTrack Application Entry Point.
 *
 * @EnableScheduling activates the Spring task scheduler so that
 * ReminderScheduler's @Scheduled methods run automatically.
 */
@SpringBootApplication
@EnableScheduling
public class MediTrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(MediTrackApplication.class, args);
    }
}
