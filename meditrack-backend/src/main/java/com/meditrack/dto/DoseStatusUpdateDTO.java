package com.meditrack.dto;

import com.meditrack.enums.DoseStatus;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for PATCH /api/doses/{id}/status.
 * Contains only the new status to apply to a dose log entry.
 */
public class DoseStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private DoseStatus status;

    public DoseStatus getStatus() { return status; }
    public void setStatus(DoseStatus status) { this.status = status; }
}
