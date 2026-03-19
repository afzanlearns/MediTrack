package com.meditrack.dto;

import java.time.LocalDateTime;

/**
 * Standardized error response DTO returned by GlobalExceptionHandler.
 * Every API error returns this shape — no raw stack traces ever reach the client.
 */
public class ErrorResponseDTO {

    private int status;
    private String message;
    private LocalDateTime timestamp;

    public ErrorResponseDTO(int status, String message, LocalDateTime timestamp) {
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
    }

    // ─── Getters ─────────────────────────────────────────────────────────
    public int getStatus() { return status; }
    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
