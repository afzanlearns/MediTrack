package com.meditrack.controller;

import com.meditrack.dto.DoseLogDTO;
import com.meditrack.service.DoseLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for the reminder polling endpoint.
 * The React frontend calls GET /api/reminders/pending every 60 seconds
 * to surface upcoming doses in the TopBar notification bell.
 */
@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    private final DoseLogService doseLogService;

    public ReminderController(DoseLogService doseLogService) {
        this.doseLogService = doseLogService;
    }

    /**
     * GET /api/reminders/pending
     * Returns PENDING doses scheduled within the next 30 minutes.
     */
    @GetMapping("/pending")
    public ResponseEntity<List<DoseLogDTO>> getPendingReminders() {
        return ResponseEntity.ok(doseLogService.getPendingReminders());
    }
}
