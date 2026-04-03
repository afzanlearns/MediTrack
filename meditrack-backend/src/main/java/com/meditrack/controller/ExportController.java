package com.meditrack.controller;

import com.meditrack.entity.*;
import com.meditrack.repository.*;
import com.meditrack.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "*")
public class ExportController {

    private final VitalsRepository vitalsRepository;
    private final SymptomRepository symptomRepository;
    private final MedicationRepository medicationRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserProfileRepository userProfileRepository;
    private final IceContactRepository iceContactRepository;

    public ExportController(VitalsRepository vitalsRepository,
                            SymptomRepository symptomRepository,
                            MedicationRepository medicationRepository,
                            AppointmentRepository appointmentRepository,
                            UserProfileRepository userProfileRepository,
                            IceContactRepository iceContactRepository) {
        this.vitalsRepository = vitalsRepository;
        this.symptomRepository = symptomRepository;
        this.medicationRepository = medicationRepository;
        this.appointmentRepository = appointmentRepository;
        this.userProfileRepository = userProfileRepository;
        this.iceContactRepository = iceContactRepository;
    }

    @GetMapping(value = "/summary", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getHealthSummary(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return getAuthRequiredResponse();
        }

        UserProfile profile = userProfileRepository.findFirstByOrderById()
                .orElse(new UserProfile());
        
        List<Vitals> vitals = vitalsRepository.findAllByOrderByRecordedDateDesc().stream()
                .limit(10).collect(Collectors.toList());
        
        List<Symptom> symptoms = symptomRepository.findAll().stream()
                .sorted((s1, s2) -> s2.getSymptomDate().compareTo(s1.getSymptomDate()))
                .limit(10).collect(Collectors.toList());
        
        List<Medication> medications = medicationRepository.findAll().stream()
                .filter(Medication::getIsActive).collect(Collectors.toList());
        
        List<Appointment> appointments = appointmentRepository.findByIsCompletedFalseAndAppointmentDateGreaterThanEqualOrderByAppointmentDateAsc(LocalDate.now());
        
        List<IceContact> iceContacts = iceContactRepository.findAllByOrderByPriorityOrderAsc();

        String html = buildSummaryHtml(profile, vitals, symptoms, medications, appointments, iceContacts);
        
        return ResponseEntity.ok()
                .header("Content-Disposition", "inline; filename=health-summary.html")
                .body(html);
    }

    @GetMapping(value = "/emergency", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getEmergencyPage(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return getAuthRequiredResponse();
        }

        UserProfile profile = userProfileRepository.findFirstByOrderById()
                .orElseThrow(() -> new ResourceNotFoundException("Profile not set up"));

        List<IceContact> iceContacts = iceContactRepository.findAllByOrderByPriorityOrderAsc();

        String html = buildEmergencyHtml(profile, iceContacts);

        return ResponseEntity.ok()
                .header("Content-Disposition", "inline")
                .body(html);
    }

    private ResponseEntity<String> getAuthRequiredResponse() {
        String html = """
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset='UTF-8'>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sign In Required</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                     display: flex; align-items: center; justify-content: center; 
                     height: 100vh; margin: 0; background: #F8FAFC; color: #1E293B; }
              .card { background: white; border-radius: 16px; padding: 48px; 
                      text-align: center; max-width: 400px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
                      border: 1px solid #E2E8F0; }
              .icon { background: #FEF2F2; color: #DC2626; width: 64px; height: 64px; 
                      border-radius: 50%; display: flex; align-items: center; 
                      justify-content: center; margin: 0 auto 24px; font-size: 32px; font-weight: bold; }
              h2 { color: #0F172A; margin: 0 0 12px; font-size: 24px; }
              p { color: #64748B; font-size: 15px; line-height: 1.6; margin: 0 0 32px; }
              .btn { display: inline-block; background: #3B82F6; color: white; 
                    padding: 12px 28px; border-radius: 8px; text-decoration: none; 
                    font-weight: 600; font-size: 15px; transition: background 0.2s; }
              .btn:hover { background: #2563EB; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="icon">!</div>
              <h2>Sign In Required</h2>
              <p>Emergency Mode requires an account so your medical 
                 information can be securely stored and retrieved.</p>
              <a href="http://localhost:5173/landing" class="btn">Sign In to MediTrack</a>
            </div>
          </body>
          </html>
        """;
                return ResponseEntity.status(HttpStatus.OK)
                    .header("Content-Type", MediaType.TEXT_HTML_VALUE)
                    .body(html);
    }

    private String buildSummaryHtml(UserProfile profile, List<Vitals> vitals, List<Symptom> symptoms,
                                    List<Medication> medications, List<Appointment> appointments, 
                                    List<IceContact> iceContacts) {
        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Health Summary</title>");
        sb.append("<style>");
        sb.append("body { font-family: sans-serif; color: #333; line-height: 1.5; padding: 40px; }");
        sb.append("h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; }");
        sb.append("h2 { color: #34495e; margin-top: 30px; border-left: 5px solid #3498db; padding-left: 10px; }");
        sb.append("table { width: 100%; border-collapse: collapse; margin-top: 10px; }");
        sb.append("th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }");
        sb.append("th { background-color: #f8f9fa; }");
        sb.append(".header-info { display: flex; justify-content: space-between; margin-bottom: 20px; }");
        sb.append("@media print { .no-print { display: none; } body { padding: 0; } }");
        sb.append("</style></head><body>");

        sb.append("<h1>MediTrack Health Summary</h1>");
        sb.append("<div class='header-info'>");
        sb.append("<div><strong>Patient:</strong> ").append(profile.getFullName() != null ? profile.getFullName() : "N/A").append("</div>");
        sb.append("<div><strong>DOB:</strong> ").append(profile.getDateOfBirth() != null ? profile.getDateOfBirth() : "N/A").append("</div>");
        sb.append("<div><strong>Blood Type:</strong> ").append(profile.getBloodType() != null ? profile.getBloodType() : "N/A").append("</div>");
        sb.append("<div><strong>Generated:</strong> ").append(LocalDate.now()).append("</div>");
        sb.append("</div>");

        // Section 1: Medications
        sb.append("<h2>Active Medications</h2>");
        if (medications.isEmpty()) sb.append("<p>No active medications.</p>");
        else {
            sb.append("<table><tr><th>Medication</th><th>Dosage</th><th>Frequency</th></tr>");
            for (Medication m : medications) {
                sb.append("<tr><td>").append(m.getName()).append("</td><td>").append(m.getDosage()).append("</td><td>").append(m.getFrequency()).append("</td></tr>");
            }
            sb.append("</table>");
        }

        // Section 2: Vitals
        sb.append("<h2>Recent Vitals (Last 10)</h2>");
        if (vitals.isEmpty()) sb.append("<p>No vitals recorded.</p>");
        else {
            sb.append("<table><tr><th>Date</th><th>BP (sys/dia)</th><th>Blood Sugar</th><th>Heart Rate</th></tr>");
            for (Vitals v : vitals) {
                sb.append("<tr><td>").append(v.getRecordedDate()).append("</td><td>")
                  .append(v.getSystolic() != null ? v.getSystolic() : "-").append("/")
                  .append(v.getDiastolic() != null ? v.getDiastolic() : "-").append("</td><td>")
                  .append(v.getBloodSugar() != null ? v.getBloodSugar() : "-").append(" mg/dL</td><td>")
                  .append(v.getHeartRate() != null ? v.getHeartRate() : "-").append(" bpm</td></tr>");
            }
            sb.append("</table>");
        }

        // Section 3: Symptoms
        sb.append("<h2>Recent Symptoms (Last 10)</h2>");
        if (symptoms.isEmpty()) sb.append("<p>No symptoms recorded.</p>");
        else {
            sb.append("<table><tr><th>Date</th><th>Symptom</th><th>Severity</th></tr>");
            for (Symptom s : symptoms) {
                sb.append("<tr><td>").append(s.getSymptomDate()).append("</td><td>").append(s.getSymptomName()).append("</td><td>").append(s.getSeverity()).append("/10</td></tr>");
            }
            sb.append("</table>");
        }

        // Section 4: Upcoming Appointments
        sb.append("<h2>Upcoming Appointments</h2>");
        if (appointments.isEmpty()) sb.append("<p>No upcoming appointments.</p>");
        else {
            sb.append("<table><tr><th>Date</th><th>Doctor</th><th>Reason</th><th>Location</th></tr>");
            for (Appointment a : appointments) {
                sb.append("<tr><td>").append(a.getAppointmentDate()).append("</td><td>").append(a.getDoctorName()).append("</td><td>")
                  .append(a.getReason() != null ? a.getReason() : "-").append("</td><td>")
                  .append(a.getLocation() != null ? a.getLocation() : "-").append("</td></tr>");
            }
            sb.append("</table>");
        }

        // Section 5: Allergies & Notes
        sb.append("<h2>Allergies & Medical Notes</h2>");
        sb.append("<p><strong>Allergies:</strong> ").append(profile.getAllergies() != null && !profile.getAllergies().isEmpty() ? profile.getAllergies() : "None known").append("</p>");
        sb.append("<p><strong>Primary Physician:</strong> ").append(profile.getPrimaryPhysicianName() != null ? profile.getPrimaryPhysicianName() : "Not set")
          .append(" (").append(profile.getPrimaryPhysicianPhone() != null ? profile.getPrimaryPhysicianPhone() : "N/A").append(")</p>");

        // Section 6: Emergency Contacts
        sb.append("<h2>Emergency Contacts (ICE)</h2>");
        if (iceContacts.isEmpty()) sb.append("<p>No emergency contacts added.</p>");
        else {
            sb.append("<table><tr><th>Name</th><th>Relationship</th><th>Phone</th></tr>");
            for (IceContact c : iceContacts) {
                sb.append("<tr><td>").append(c.getFullName()).append("</td><td>").append(c.getRelationship()).append("</td><td>").append(c.getPhonePrimary()).append("</td></tr>");
            }
            sb.append("</table>");
        }

        sb.append("<div style='margin-top: 50px; font-size: 12px; color: #7f8c8d; text-align: center;'>");
        sb.append("Generated by MediTrack PHR System on ").append(LocalDate.now());
        sb.append("</div></body></html>");

        return sb.toString();
    }

    private String buildEmergencyHtml(UserProfile profile, List<IceContact> contacts) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>EMERGENCY MEDICAL INFO</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; background: #fff; padding-bottom: 40px; }
                    .header { background: #CC0000; color: white; padding: 20px; 
                              text-align: center; }
                    .header h1 { font-size: 28px; font-weight: bold; 
                                 letter-spacing: 2px; }
                    .header p { font-size: 14px; margin-top: 4px; opacity: 0.9; }
                    .card { border: 3px solid #CC0000; border-radius: 8px; 
                            margin: 16px; padding: 20px; }
                    .card-label { font-size: 13px; font-weight: bold; 
                                  color: #CC0000; text-transform: uppercase; 
                                  letter-spacing: 1px; margin-bottom: 8px; }
                    .card-value { font-size: 48px; font-weight: bold; 
                                  color: #1a1a1a; line-height: 1.1; }
                    .card-value.large { font-size: 72px; }
                    .card-value.normal { font-size: 22px; }
                    .ice-section { margin: 16px; }
                    .ice-title { font-size: 14px; font-weight: bold; 
                                 color: #CC0000; text-transform: uppercase;
                                 border-bottom: 2px solid #CC0000; 
                                 padding-bottom: 8px; margin-bottom: 12px; }
                    .ice-contact { padding: 12px 0; 
                                   border-bottom: 1px solid #eee; }
                    .ice-name { font-size: 18px; font-weight: bold; }
                    .ice-rel { font-size: 14px; color: #666; }
                    .ice-phone { font-size: 22px; font-weight: bold; 
                                 color: #CC0000; text-decoration: none; }
                    .footer { background: #f5f5f5; padding: 16px; 
                              text-align: center; margin-top: 20px; }
                    .footer p { font-size: 14px; color: #333; }
                    .close-btn { display: block; margin: 12px auto; 
                                 padding: 10px 24px; background: #666; 
                                 color: white; border: none; border-radius: 6px;
                                 font-size: 16px; cursor: pointer; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>⚠ EMERGENCY MEDICAL INFO</h1>
                    <p>Show this screen to emergency responders</p>
                </div>
                
                <div class="card">
                    <div class="card-label">🩸 Blood Type</div>
                    <div class="card-value large">%s</div>
                </div>
                
                <div class="card">
                    <div class="card-label">⚠ Active Allergies</div>
                    <div class="card-value normal">%s</div>
                </div>
                
                <div class="card">
                    <div class="card-label">🏥 Primary Physician</div>
                    <div class="card-value normal">%s</div>
                    <a class="ice-phone" href="tel:%s">📞 %s</a>
                </div>
                
                <div class="ice-section">
                    <div class="ice-title">📞 Emergency Contacts (ICE)</div>
                    %s
                </div>
                
                <div class="footer">
                    <p><strong>Patient:</strong> %s | <strong>DOB:</strong> %s</p>
                    <button class="close-btn" onclick="window.close()">Close</button>
                </div>
            </body>
            </html>
            """.formatted(
                profile.getBloodType() != null ? profile.getBloodType() : "Unknown",
                profile.getAllergies() != null && !profile.getAllergies().isEmpty() ? profile.getAllergies() : "None known",
                profile.getPrimaryPhysicianName() != null ? profile.getPrimaryPhysicianName() : "Not set",
                profile.getPrimaryPhysicianPhone() != null ? profile.getPrimaryPhysicianPhone() : "",
                profile.getPrimaryPhysicianPhone() != null ? profile.getPrimaryPhysicianPhone() : "Not set",
                buildIceContactsHtml(contacts),
                profile.getFullName() != null ? profile.getFullName() : "Not set",
                profile.getDateOfBirth() != null ? profile.getDateOfBirth().toString() : "Not set"
            );
    }

    private String buildIceContactsHtml(List<IceContact> contacts) {
        if (contacts.isEmpty()) return "<p>No emergency contacts added.</p>";
        StringBuilder sb = new StringBuilder();
        for (IceContact c : contacts) {
            sb.append("""
                <div class="ice-contact">
                    <div class="ice-name">%s</div>
                    <div class="ice-rel">%s</div>
                    <a class="ice-phone" href="tel:%s">📞 %s</a>
                </div>
                """.formatted(c.getFullName(), c.getRelationship(), 
                              c.getPhonePrimary(), c.getPhonePrimary()));
        }
        return sb.toString();
    }
}
