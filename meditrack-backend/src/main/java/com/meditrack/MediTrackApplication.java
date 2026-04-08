package com.meditrack;

import io.github.cdimascio.dotenv.Dotenv;
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
        // Load .env file from the project root (relative to the backend folder)
        Dotenv dotenv = Dotenv.configure()
                .directory("./") // Current directory (backend root)
                .ignoreIfMissing()
                .load();

        // Export environment variables to system properties for Spring Boot
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

        SpringApplication.run(MediTrackApplication.class, args);
    }
}
