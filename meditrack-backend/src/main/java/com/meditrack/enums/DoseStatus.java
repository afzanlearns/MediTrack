package com.meditrack.enums;

/**
 * Represents the current status of a scheduled dose log entry.
 */
public enum DoseStatus {
    PENDING,   // Not yet actioned — dose is upcoming or overdue without action
    TAKEN,     // User confirmed taking the dose
    MISSED,    // User marked as missed (counts against adherence %)
    SKIPPED    // User deliberately skipped (excluded from adherence calculation)
}
