# MediTrack — Personal Health Record System

> A full-stack, installable Progressive Web App for managing medications, tracking vitals, logging symptoms, and accessing emergency medical information — from any device, any browser, online or offline.

<div align="center">

![Java](https://img.shields.io/badge/Java-17+-orange?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=flat-square&logo=pwa&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.8+-C71A36?style=flat-square&logo=apachemaven&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [PWA Capabilities](#pwa-capabilities)
- [Tech Stack](#tech-stack)
- [Java Concepts Applied](#java-concepts-applied)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [REST API Reference](#rest-api-reference)
- [Authentication & User Modes](#authentication--user-modes)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Mobile Installation](#mobile-installation)
- [Production Deployment](#production-deployment)
- [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
- [Future Enhancements](#future-enhancements)

---

## Overview

MediTrack is a **Personal Health Record (PHR) System** built as a university Java mini-project. It implements a real-world health management platform with a production-grade architecture — strict MVC layering, DAO pattern, REST API, automatic database migrations, explicit Java concurrency, file I/O, raw JDBC, generics, custom annotations, and lambda expressions — every concept from the course curriculum is explicitly demonstrated.

The application is mobile-first and installable as a native-like PWA on any device. It supports **guest mode** (no account required, localStorage data) and **Google OAuth authenticated mode** (cloud-synced MySQL). Guest data automatically syncs to the server on first sign-in.

---

## Features

### Core Health Tracking

**Medication Manager**
Add, edit, and soft-delete medications with name, dosage, frequency, start date, optional end date, and notes. Active/inactive status detected automatically from dates. Searchable list with real-time filtering. CSV export via explicit Java I/O.

**Daily Dose Logger**
Auto-generates a daily dose schedule from active medications and their frequencies. Mark each dose as Taken, Missed, or Skipped with timestamps. Date navigation for any day's history. Filter by status.

**Vitals Tracking**
Log daily Blood Pressure (systolic/diastolic mmHg), Blood Sugar (mg/dL), and Heart Rate (bpm). Three Recharts line charts showing trends per vital sign. Latest readings snapshot on dashboard. CSV export.

**Symptom Journal**
Log symptoms with name, severity (1-10), date, and notes. Severity trend chart filterable by symptom name and date range. Color-coded badges: green (1-3), amber (4-6), red (7-10).

**Doctor Visit Log**
Record visits with title, doctor, date, location, summary, and recommendations. Reverse-chronological timeline with edit and delete.

### Advanced PHR Features (Teacher-Assigned)

**One-Click Emergency Mode — Unique Feature**
A single button on every page opens a fullscreen, self-contained HTML page designed for paramedics. Shows blood type in enormous text, active allergies, primary physician with tap-to-call, and up to 5 ICE contacts with tap-to-call links. Uses only inline CSS — no internet required, renders instantly, cached by service worker. Screen Wake Lock prevents display dimming.

**Emergency Numbers Management**
Add and manage up to 5 personal emergency contacts on the Emergency page. Each shown as a tap-to-call button. 5-contact limit enforced. Delete per contact. Persisted in MySQL for authenticated users.

**Health Summary Export**
One-click print-ready HTML page with full patient record: active medications, recent vitals, symptoms, appointments, allergies, emergency contacts, patient demographics. Press Ctrl+P to save as PDF.

**Appointment Reminders**
Schedule upcoming medical appointments. Visual urgency for visits within 7 days. Next appointment widget on dashboard. Tabbed Upcoming/Completed view. Background thread checks for due doses every 5 minutes.

**Prescription Repository**
Upload prescriptions as PDF/JPG/JPEG/PNG up to 10MB. Doctor name, date, and notes stored per file. Server filesystem storage. View, download, and delete from card grid.

**ICE Contacts & Health Profile**
Full health profile: name, DOB, blood type, allergies, primary physician. ICE contacts with priority ordering. All data feeds Emergency Mode and Health Export.

**Data Export**
Export medications to CSV (BufferedWriter), export vitals to CSV (chained FileOutputStream/OutputStreamWriter/BufferedWriter), HTML health summary, emergency page as standalone URL.

---

## PWA Capabilities

| Capability | Implementation |
|---|---|
| Installable | Web App Manifest with icons at all required sizes |
| Offline Support | Workbox service worker caches assets and API responses |
| Background Sync | Offline dose logs queued in IndexedDB, sync on reconnect |
| Push Notifications | Web Push API with VAPID keys — reminders when browser is closed |
| App Shortcuts | Long-press icon: Today's Doses, Log Vitals, Emergency |
| Share Target | Receive prescription images shared from camera roll |
| Screen Wake Lock | Emergency Mode page prevents display dimming |
| App Badging | Home screen icon shows pending dose count |
| Vibration | Device vibrates on reminders and emergency activation |
| Offline Detection | Offline banner with graceful degraded mode |
| Install Prompt | Custom button using `beforeinstallprompt` API |
| Update Prompt | Notifies users when a new version is available |

### Caching Strategy

| Resource | Strategy | TTL |
|---|---|---|
| Static assets (JS, CSS, HTML) | Cache First | Indefinite (versioned) |
| Google Fonts | Stale While Revalidate | 1 year for font files |
| Dashboard API | Network First | 5 minutes |
| Medications API | Network First | 10 minutes |
| Vitals and Symptoms API | Network First | 15 minutes |

---

## Tech Stack

### Backend

| Component | Technology |
|---|---|
| Language | Java 17 LTS |
| Framework | Spring Boot 3.2.0 |
| ORM | Spring Data JPA + Hibernate 6.3 |
| Raw Database Access | JDBC (java.sql) for analytics and audit |
| Database | MySQL 8.x |
| Migrations | Flyway — automatic versioned schema management |
| Concurrency | java.util.concurrent (ExecutorService, Future, AtomicInteger) |
| File I/O | Java NIO (Files, Path) + java.io (BufferedWriter, FileWriter) |
| Scheduling | @Scheduled + ScheduledExecutorService |
| AOP | Spring AOP — @AuditLog annotation processing |
| Validation | Jakarta Bean Validation |
| Auth | JWT (com.auth0:java-jwt) + Google Identity verification |
| Push | Web Push Protocol (VAPID) |
| API Docs | SpringDoc OpenAPI 3 / Swagger UI |
| Build | Maven 3.8+ |

### Frontend

| Component | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| PWA | vite-plugin-pwa + Workbox |
| Routing | React Router v6 |
| HTTP Client | Axios with interceptors |
| Charts | Recharts |
| Animation | Framer Motion |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React (SVG only, no emojis) |
| Dates | date-fns |
| Auth | @react-oauth/google |
| Font | Plus Jakarta Sans |
| Offline Queue | IndexedDB via idb library |

---

## Java Concepts Applied

### 1. Concurrent Programming — Multi-Threading

**File:** `src/main/java/com/meditrack/concurrent/ReminderService.java`

Explicit Java concurrency — not hidden behind Spring abstractions:

```java
// Named ThreadFactory — every thread has a descriptive name
ThreadFactory namedThreadFactory = new ThreadFactory() {
    private final AtomicInteger threadNumber = new AtomicInteger(1);
    @Override
    public Thread newThread(Runnable r) {
        Thread t = new Thread(r);
        t.setName("meditrack-reminder-" + threadNumber.getAndIncrement());
        t.setDaemon(true); // does not block JVM shutdown
        return t;
    }
};

// ScheduledExecutorService — explicit thread pool
this.scheduler = Executors.newScheduledThreadPool(2, namedThreadFactory);

// AtomicInteger — thread-safe counter without synchronized
private final AtomicInteger remindersSentCount = new AtomicInteger(0);

// CopyOnWriteArrayList — thread-safe shared state
private final CopyOnWriteArrayList<Long> notifiedDoseIds = new CopyOnWriteArrayList<>();

// synchronized — explicit mutual exclusion
public synchronized List<Long> getAndResetPendingReminders() { ... }
```

**Also:** `HealthReportGenerator.java` uses `ExecutorService` with `Callable<T>` and `Future<T>` for parallel data fetching — dashboard data retrieved from 4 repositories simultaneously, results joined via `future.get()`.

---

### 2. Java I/O Operations — File System Access

**Files:** `io/HealthDataExporter.java`, `service/PrescriptionService.java`

```java
// Chained I/O streams — prescription upload
try (InputStream in = new BufferedInputStream(file.getInputStream());
     OutputStream out = new BufferedOutputStream(
         new FileOutputStream(destinationPath.toFile()))) {
    byte[] buffer = new byte[8192];
    int bytesRead;
    while ((bytesRead = in.read(buffer)) != -1) {
        out.write(buffer, 0, bytesRead);
    }
}

// BufferedWriter — CSV export
try (BufferedWriter writer = new BufferedWriter(
        new FileWriter(csvPath.toFile(), StandardCharsets.UTF_8))) {
    writer.write("ID,Name,Dosage,Frequency");
    writer.newLine();
    medications.forEach(med -> { writer.write(...); writer.newLine(); });
}

// BufferedReader — CSV read-back
try (BufferedReader reader = new BufferedReader(
        new FileReader(csvPath.toFile(), StandardCharsets.UTF_8))) {
    String line;
    while ((line = reader.readLine()) != null) lines.add(line);
}

// Java NIO
Path uploadDir = Paths.get(uploadDirectory);
if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);
BasicFileAttributes attrs = Files.readAttributes(path, BasicFileAttributes.class);
```

Audit logging appends timestamped entries using `FileWriter` in append mode (`true`).

---

### 3. Java Collections Framework + JDBC

**Collections file:** `collections/MediTrackCollections.java`

| Collection | Used For | Rationale |
|---|---|---|
| `ArrayList<T>` | Medication and DTO lists | Ordered, O(1) random access |
| `LinkedList<T>` | Dose navigation history | O(1) addFirst/addLast |
| `HashMap<K,V>` | Medication lookup by ID | O(1) average lookup |
| `TreeMap<K,V>` | Vitals sorted by date | Automatic key sorting |
| `HashSet<T>` | Unique symptom names | O(1) contains, deduplication |
| `PriorityQueue<T>` | Reminder ordering by time | Always yields most-urgent |
| `ArrayDeque<T>` | Date navigation stack | Faster than Stack |
| `CopyOnWriteArrayList` | Thread-safe reminder IDs | Safe concurrent reads |

**JDBC file:** `jdbc/DashboardStatsDAO.java` — raw `java.sql` APIs alongside JPA:

```java
try (Connection conn = DriverManager.getConnection(url, user, pass);
     PreparedStatement stmt = conn.prepareStatement(sql)) {
    stmt.setObject(1, LocalDate.now().minusDays(30).atStartOfDay());
    try (ResultSet rs = stmt.executeQuery()) {
        if (rs.next()) {
            int taken = rs.getInt("taken_count");
            int total = rs.getInt("total_count");
            return total == 0 ? 100.0 : (double) taken / total * 100.0;
        }
    }
    // getGeneratedKeys() demonstrated in insertAuditRecord()
}
```

---

### 4. Generics

**Files:** `generic/ApiResponse.java`, `generic/HealthMetricAggregator.java`

```java
// Generic class — works with any entity type
public class ApiResponse<T> {
    private T data;
    public static <T> ApiResponse<T> success(T data) { ... }
    public static <T> ApiResponse<T> error(String message, int code) { ... }
}

// Usage
ApiResponse<List<Medication>>     // medications endpoint
ApiResponse<DashboardSummaryDTO>  // dashboard endpoint

// Bounded type parameter + wildcard
public class HealthMetricAggregator<T> {
    public OptionalDouble calculateAverage(ToDoubleFunction<T> extractor) { ... }
    public static double sumNumbers(List<? extends Number> numbers) { ... }
    public <K> Map<K, List<T>> groupBy(Function<T, K> classifier) { ... }
}

// JPA repositories use generics
public interface MedicationRepository extends JpaRepository<Medication, Long> { ... }
```

---

### 5. Custom Annotations

**Files:** `annotation/AuditLog.java`, `annotation/RequiresAuth.java`, `annotation/ValidMedication.java`

```java
// Custom annotation definition
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)  // available via reflection at runtime
@Documented
public @interface AuditLog {
    String action() default "UNKNOWN";
    String entityType() default "";
    boolean logSuccess() default true;
    boolean logFailure() default true;
}

// Applied to service methods
@AuditLog(action = "CREATE_MEDICATION", entityType = "Medication")
public MedicationDTO createMedication(MedicationRequestDTO dto) { ... }
```

**Annotation processor:** `aspect/AuditLogAspect.java` reads annotation values via reflection at runtime using Spring AOP:

```java
@Around("@annotation(com.meditrack.annotation.AuditLog)")
public Object logAudit(ProceedingJoinPoint joinPoint) throws Throwable {
    Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
    AuditLog auditLog = method.getAnnotation(AuditLog.class); // reflection
    String action = auditLog.action();      // read annotation element
    String entity = auditLog.entityType(); // read annotation element
    ...
}
```

Framework annotations used throughout: `@RestController`, `@Service`, `@Repository`, `@Entity`, `@OneToMany`, `@Scheduled`, `@Valid`, `@NotNull`, `@PostConstruct`, `@PreDestroy`.

---

### 6. Lambda Expressions

**File:** `lambda/HealthDataProcessor.java` — used throughout all service classes

```java
// Predicate<T> — boolean test
Predicate<Medication> isActive = med -> med.getIsActive() != null && med.getIsActive();
Predicate<Medication> isActiveWithEndDate = isActive.and(hasUpcomingEndDate); // composed

// Function<T, R> — transformation
Function<String, String> frequencyLabel = freq -> switch (freq) {
    case "ONCE_DAILY" -> "Once daily";
    case "TWICE_DAILY" -> "Twice daily";
    default           -> freq;
};

// Consumer<T> — side effect
Consumer<Medication> printSummary =
    med -> System.out.printf("[%s] %s%n", med.getIsActive() ? "ACTIVE" : "INACTIVE", med.getName());

// Supplier<T> — lazy value
Supplier<String> todayString = () -> LocalDate.now().toString();

// BiFunction<T, U, R> — two-argument transform
BiFunction<DoseLog, String, String> formatEntry =
    (dose, name) -> String.format("%s — %s at %s", name, dose.getStatus(), dose.getScheduledTime());

// Stream pipeline — chained lambdas
Map<String, Long> statusCounts = doses.stream()
    .collect(Collectors.groupingBy(DoseLog::getStatus, Collectors.counting()));

// reduce() with method reference
int totalMissed = doses.stream()
    .filter(d -> "MISSED".equals(d.getStatus()))
    .map(d -> 1)
    .reduce(0, Integer::sum);

// Comparator lambda for PriorityQueue
PriorityQueue<DoseLog> queue = new PriorityQueue<>(
    Comparator.comparing(DoseLog::getScheduledTime)
);
```

---

### 7. Web Application Development

Fully implemented as a production-grade full-stack web app:
- **Spring Boot REST API** — 13 resource controllers, consistent `ApiResponse<T>` JSON wrapper
- **React 18 SPA** — client-side routing, context-based state management
- **Mobile-first PWA** — installable on Android and iOS, offline capable
- **Google OAuth** — industry-standard authentication
- **JWT sessions** — stateless token-based auth
- **Swagger UI** — auto-generated interactive API documentation
- **CORS** — configured for specific allowed origins only

---

## Architecture

```
Browser / Installed PWA
        │
        │  HTTPS + Bearer JWT
        ▼
Spring Boot (port 8080)
  Controllers → Services → Repositories (JPA)
                        → JDBC DAO (raw SQL)
                        → Java I/O (files, CSV)
  Concurrent Layer (ExecutorService, Future)
  AOP Layer (@AuditLog aspect)
  Generic Layer (ApiResponse<T>)
  Lambda Layer (HealthDataProcessor)
        │
        │  JDBC / JPA
        ▼
    MySQL 8.x
  (11 tables, Flyway managed)
```

### Request Flow

1. React calls Axios API function → adds `Authorization: Bearer <token>`
2. Guest mode: routes to `guestStorage.js` (localStorage) — no backend call
3. Auth mode: HTTP to Spring Boot → `JwtFilter` validates token
4. Controller delegates to Service → `@AuditLog` aspect fires
5. Service uses Collections, Lambdas, Generics for business logic
6. Repository queries MySQL via JPA or raw JDBC
7. Result wrapped in `ApiResponse<T>` → JSON response
8. React updates state → Framer Motion animates transition

---

## Project Structure

### Backend

```
meditrack-backend/src/main/java/com/meditrack/
├── MediTrackApplication.java
├── annotation/          @AuditLog, @RequiresAuth, @ValidMedication
├── aspect/              AuditLogAspect — AOP annotation processing
├── collections/         MediTrackCollections — ArrayList, TreeMap, PriorityQueue...
├── concurrent/          ReminderService, HealthReportGenerator — ExecutorService, Future
├── config/              CorsConfig, OpenApiConfig
├── controller/          13 REST controllers
├── dto/                 Request and Response DTOs
├── entity/              JPA entities
├── exception/           ResourceNotFoundException, GlobalExceptionHandler
├── generic/             ApiResponse<T>, HealthMetricAggregator<T>
├── io/                  HealthDataExporter — BufferedWriter, FileWriter, CSV
├── jdbc/                DashboardStatsDAO — Connection, PreparedStatement, ResultSet
├── lambda/              HealthDataProcessor — Predicate, Function, Consumer, Supplier
├── repository/          Spring Data JPA interfaces
├── scheduler/           ReminderScheduler
└── service/             Business logic layer

src/main/resources/db/migration/
├── V1__create_medications.sql
├── V2__create_dose_logs.sql
├── V3__create_symptoms.sql
├── V4__create_doctor_visits.sql
├── V5__create_visit_medications.sql
├── V6__create_vitals.sql
├── V7__create_prescriptions.sql
├── V8__create_appointments.sql
├── V9__create_ice_contacts.sql
├── V10__create_user_profile.sql
└── V11__create_audit_log.sql
```

### Frontend

```
meditrack-frontend/src/
├── api/           Axios functions — auto-routes guest→localStorage, auth→API
├── contexts/      AuthContext, AuthModalContext
├── hooks/         useInstallPrompt, useOnlineStatus
├── services/      guestStorage, syncService, backgroundSync (IndexedDB)
├── components/
│   ├── shell/     AppShell, BottomNav, PageHeader
│   ├── auth/      AuthModal (bottom sheet), LockedPage
│   └── ui/        Badge, Button, Input, Toast
└── pages/
    ├── LandingPage, DashboardPage, MedicationsPage
    ├── DoseLogPage, VitalsPage, SymptomsPage
    ├── DoctorVisitsPage, MorePage
    └── AppointmentsPage*, PrescriptionsPage*, ProfilePage*
    (* = auth required)
```

---

## Database Schema

All 11 tables auto-created by Flyway on first startup.

| Table | Migration | Description |
|---|---|---|
| `medications` | V1 | Medications with is_active soft delete |
| `dose_logs` | V2 | PENDING/TAKEN/MISSED/SKIPPED status tracking |
| `symptoms` | V3 | Severity 1-10 symptom journal |
| `doctor_visits` | V4 | Visit history with summary and recommendations |
| `visit_medications` | V5 | Many-to-many junction table |
| `vitals` | V6 | BP, sugar, heart rate — all nullable |
| `prescriptions` | V7 | File metadata (files stored on filesystem) |
| `appointments` | V8 | is_completed flag separates upcoming/past |
| `ice_contacts` | V9 | Priority-ordered emergency contacts |
| `user_profile` | V10 | Blood type, allergies, physician info |
| `audit_log` | V11 | Action trail written by @AuditLog aspect |

---

## REST API Reference

Base URL: `/api` — Full interactive docs at `/swagger-ui.html`

All responses: `{ "success": true, "data": {...}, "message": "...", "timestamp": "..." }`

| Resource | Endpoints |
|---|---|
| Auth | `POST /auth/google`, `GET /auth/me` |
| Medications | `GET/POST /medications`, `GET/PUT/DELETE /medications/{id}`, `GET /medications/active` |
| Dose Logs | `GET /doses?date=`, `POST /doses/generate?date=`, `PATCH /doses/{id}/status` |
| Vitals | `GET/POST /vitals`, `PUT/DELETE /vitals/{id}` |
| Symptoms | `GET/POST /symptoms`, `PUT/DELETE /symptoms/{id}` |
| Prescriptions | `GET/POST /prescriptions`, `GET /prescriptions/{id}/file`, `DELETE /prescriptions/{id}` |
| Appointments | `GET/POST /appointments`, `PUT/DELETE /appointments/{id}`, `PATCH /appointments/{id}/complete` |
| Doctor Visits | `GET/POST /visits`, `PUT/DELETE /visits/{id}`, `POST/DELETE /visits/{id}/medications/{medId}` |
| ICE Contacts | `GET/POST /ice-contacts`, `PUT/DELETE /ice-contacts/{id}` |
| Profile | `GET/PUT /profile` |
| Dashboard | `GET /dashboard/summary` |
| Reminders | `GET /reminders/pending` |
| Exports | `GET /export/summary`, `GET /export/emergency`, `GET /export/medications/csv`, `GET /export/vitals/csv` |

---

## Authentication & User Modes

**Guest Mode** — No account needed. Click "Get Started Free". Data in localStorage. Available: Dashboard, Medications, Dose Log, Vitals, Symptoms, Doctor Visits. Data syncs to MySQL automatically on first sign-in.

**Authenticated Mode** — Google OAuth. MySQL-persisted data. Additional features: Appointments, Prescriptions, Profile, ICE Contacts, Emergency Mode, Exports, Push Notifications.

**JWT Flow:** Google credential → `POST /api/auth/google` → backend verifies with Google tokeninfo → creates/finds User in MySQL → signs JWT (7-day expiry) → frontend stores in localStorage → every request includes `Authorization: Bearer <token>`.

---

## Prerequisites

```bash
sudo apt install openjdk-17-jdk maven nodejs mysql-server
java -version && mvn -version && node -v && npm -v
```

---

## Local Development Setup

```bash
# 1. Clone
git clone https://github.com/yourusername/meditrack.git && cd meditrack

# 2. MySQL setup
sudo systemctl start mysql && sudo systemctl enable mysql
sudo mysql -e "
  CREATE DATABASE meditrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER 'meditrack'@'localhost' IDENTIFIED BY 'your_password';
  GRANT ALL PRIVILEGES ON meditrack_db.* TO 'meditrack'@'localhost';
  FLUSH PRIVILEGES;"

# 3. Configure application.properties (see Environment Variables section)

# 4. Run backend (Terminal 1)
cd meditrack-backend && mvn spring-boot:run

# 5. Run frontend (Terminal 2)
cd meditrack-frontend && npm install && npm run dev
# OR for PWA testing:
npm run build && npm run preview
```

App: `http://localhost:5173` (dev) or `http://localhost:4173` (PWA)
API Docs: `http://localhost:8080/swagger-ui.html`

---

## Mobile Installation

```bash
# Find your local IP
ip addr show | grep "inet " | grep -v 127.0.0.1
# Example: 192.168.1.42

# Expose frontend on network
npm run build && npm run preview -- --host
```

On phone (same WiFi): open `http://192.168.1.42:4173`

**Android Chrome:** Three-dot menu → "Install app"
**iOS Safari:** Share → "Add to Home Screen"

Add `http://192.168.1.42:4173` to Google Cloud Console Authorized JavaScript origins for Google Sign-In to work from phone.

---

## Production Deployment

### Backend → Railway

1. [railway.app](https://railway.app) → New Project → GitHub repo
2. Add MySQL plugin → copy connection details
3. Set environment variables (see below)
4. Railway auto-detects pom.xml and builds the JAR

### Frontend → Vercel

1. [vercel.com](https://vercel.com) → New Project → GitHub repo
2. Root Directory: `meditrack-frontend`, Framework: Vite
3. Set environment variables (see below)
4. Add Vercel URL to Google Cloud Console Authorized JavaScript origins
5. Add Vercel URL to `CorsConfig.java` → rebuild backend → redeploy

---

## Environment Variables

### Backend

```properties
# application-prod.properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
app.jwt.secret=${JWT_SECRET}                     # openssl rand -base64 32
app.google.client-id=${GOOGLE_CLIENT_ID}
SPRING_PROFILES_ACTIVE=prod
PORT=8080
```

### Frontend

```bash
# .env.production
VITE_API_URL=https://meditrack-backend.up.railway.app
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## Usage Guide

**First-time setup:**
1. Open app → "Get Started Free" for immediate guest access
2. More → Profile (sign-in required): enter blood type, allergies, physician, ICE contacts
3. Medications → add current prescriptions
4. Dashboard → today's dose schedule appears

**Daily workflow:**
1. Dashboard → mark each dose Taken/Missed/Skipped
2. Log symptoms in Symptoms with severity rating
3. Record vitals in Vitals

**Emergency Mode:** Tap "Emergency" in top bar. Fullscreen paramedic page opens. Screen stays on (Wake Lock). Tap phone numbers to call directly.

**Health Export:** More → Profile → Export Health Summary → Ctrl+P to save as PDF.

---

## Development Notes

- No Lombok — all getters/setters written manually
- No MapStruct — entity-to-DTO mapping explicit in services
- Strict MVC — no SQL in controllers, no business logic in repositories
- ddl-auto=none — Flyway is sole schema authority
- Soft delete on medications — is_active=false preserves dose history
- All SQL via JPA parameterized queries or JDBC PreparedStatement

---

## Future Enhancements

| Enhancement | Description |
|---|---|
| Drug Interaction Checker | Warn on active medication conflicts via OpenFDA API |
| Refill Tracking | Calculate run-out date, alert at 7 days remaining |
| Symptom Correlation | Overlay symptom severity with adherence on combined chart |
| Multi-User / Family Mode | Data isolation per user account for managing family |
| Wearable Integration | Import vitals from Google Fit or Apple Health |
| Email / SMS Reminders | Missed dose alerts via Spring Mail or Twilio |
| Barcode Scan | Camera + ZXing to scan medication packaging |
| PDF Reports | Proper PDF generation with Apache PDFBox |
| AI Symptom Analysis | Pattern recognition on symptom history |
| Periodic Background Sync | Silently refresh data while app is closed |

---

## License

Developed as a university Java mini-project submission.

---

<div align="center">

**MediTrack PHR** — Spring Boot · React · MySQL · PWA

*Your health records, always within reach.*

</div>