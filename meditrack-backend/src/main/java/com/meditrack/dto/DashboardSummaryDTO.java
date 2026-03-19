package com.meditrack.dto;

import java.util.List;

/**
 * Response DTO for the GET /api/dashboard/summary endpoint.
 * Aggregates all data needed for the dashboard landing page in a single request.
 */
public class DashboardSummaryDTO {

    private double adherencePercentage;     // TAKEN / (TAKEN + MISSED) over last 30 days
    private int activeMedicationCount;
    private List<DoseLogDTO> todaysDoses;   // All dose entries for today
    private List<SymptomDTO> recentSymptoms; // Last 5 symptom entries

    public DashboardSummaryDTO() {}

    // ─── Getters & Setters ──────────────────────────────────────────────────
    public double getAdherencePercentage() { return adherencePercentage; }
    public void setAdherencePercentage(double adherencePercentage) { this.adherencePercentage = adherencePercentage; }

    public int getActiveMedicationCount() { return activeMedicationCount; }
    public void setActiveMedicationCount(int activeMedicationCount) { this.activeMedicationCount = activeMedicationCount; }

    public List<DoseLogDTO> getTodaysDoses() { return todaysDoses; }
    public void setTodaysDoses(List<DoseLogDTO> todaysDoses) { this.todaysDoses = todaysDoses; }

    public List<SymptomDTO> getRecentSymptoms() { return recentSymptoms; }
    public void setRecentSymptoms(List<SymptomDTO> recentSymptoms) { this.recentSymptoms = recentSymptoms; }
}
