package com.meditrack.enums;

/**
 * Represents how often a medication should be taken.
 * Used by the dose generation logic to create scheduled dose entries.
 */
public enum MedicationFrequency {
    ONCE_DAILY,          // 1 dose per day  (08:00)
    TWICE_DAILY,         // 2 doses per day (08:00, 20:00)
    THREE_TIMES_DAILY,   // 3 doses per day (08:00, 14:00, 20:00)
    EVERY_8_HOURS,       // 3 doses per day (08:00, 16:00, 00:00)
    WEEKLY,              // 1 dose per week (08:00 on the weekday matching startDate)
    CUSTOM               // User-defined specific times
}
