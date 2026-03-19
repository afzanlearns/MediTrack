# MediTrack — Personal Medicine & Health Tracker

A full-stack web application for managing medication schedules, logging dose adherence, journalling symptoms, and tracking doctor visits.

**Backend:** Java 17 + Spring Boot 3 · **Frontend:** React 18 (Vite) · **Database:** MySQL 8

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Prerequisites](#2-prerequisites)
3. [Project Structure](#3-project-structure)
4. [Database Setup](#4-database-setup)
5. [Backend Setup](#5-backend-setup)
6. [Frontend Setup](#6-frontend-setup)
7. [Running the Application](#7-running-the-application)
8. [Using MediTrack](#8-using-meditrack)
9. [API Documentation (Swagger)](#9-api-documentation-swagger)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Project Overview

MediTrack solves medication non-adherence by giving patients a simple web UI to:

- **Manage medications** — add, edit, and soft-delete prescriptions
- **Log daily doses** — mark each scheduled dose as Taken / Missed / Skipped
- **Track symptoms** — log severity scores and visualise trends on a line chart
- **Record doctor visits** — keep a reverse-chronological visit timeline with linked medications
- **View a health dashboard** — adherence ring chart, today's schedule, and recent symptoms
- **Receive reminders** — a notification bell polls for doses due within 30 minutes

---

## 2. Prerequisites

Install the following tools before you begin:

| Tool | Version | Download |
|------|---------|----------|
| Java JDK | 17 or higher | https://adoptium.net |
| Apache Maven | 3.8+ | https://maven.apache.org/download.cgi |
| MySQL Server | 8.x | https://dev.mysql.com/downloads/mysql/ |
| MySQL Workbench (optional) | Any | https://dev.mysql.com/downloads/workbench/ |
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ (bundled with Node) | — |

Verify your installations:

```bash
java -version        # Should print: openjdk 17.x.x ...
mvn -version         # Should print: Apache Maven 3.x.x ...
mysql --version      # Should print: mysql  Ver 8.x ...
node -v              # Should print: v18.x.x or higher
npm -v               # Should print: 9.x.x or higher
```

---

## 3. Project Structure

```
MediTrack/
├── meditrack-backend/          # Spring Boot Maven project
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/meditrack/
│       │   │   ├── MediTrackApplication.java
│       │   │   ├── config/           # CORS, OpenAPI
│       │   │   ├── controller/       # REST controllers
│       │   │   ├── dto/              # Request & response DTOs
│       │   │   ├── entity/           # JPA entities
│       │   │   ├── enums/            # DoseStatus, MedicationFrequency
│       │   │   ├── exception/        # GlobalExceptionHandler
│       │   │   ├── repository/       # Spring Data JPA repos
│       │   │   ├── scheduler/        # ReminderScheduler
│       │   │   └── service/          # Business logic
│       │   └── resources/
│       │       ├── application.properties
│       │       └── db/migration/     # Flyway SQL scripts (V1–V5)
│       └── test/                     # JUnit 5 + Mockito unit tests
│
└── meditrack-frontend/         # React Vite project
    ├── package.json
    ├── index.html
    └── src/
        ├── api/                  # Axios API service layer
        ├── components/           # Reusable UI components
        └── pages/                # Full page components
```

---

## 4. Database Setup

MediTrack uses **Flyway** for automatic database migrations — you only need to create the empty database once. Flyway will create all tables on first startup.

### Step 1 — Start MySQL

Make sure your MySQL server is running. On most systems:

```bash
# macOS (Homebrew)
brew services start mysql

# Linux (systemd)
sudo systemctl start mysql

# Windows — start MySQL via Services or MySQL Workbench
```

### Step 2 — Create the database

Connect to MySQL and run:

```sql
CREATE DATABASE meditrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Using MySQL CLI:

```bash
mysql -u root -p
# Enter your MySQL root password when prompted
# Then run:
CREATE DATABASE meditrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

Using MySQL Workbench:
1. Open MySQL Workbench and connect to your local server
2. Click the **SQL** (query) icon to open a new query tab
3. Paste the `CREATE DATABASE` command above and click ⚡ Execute

> **That's it.** Flyway will create all 5 tables (`medications`, `dose_logs`, `symptoms`, `doctor_visits`, `visit_medications`) automatically when the backend starts.

---

## 5. Backend Setup

### Step 1 — Configure your database credentials

Open the file:

```
meditrack-backend/src/main/resources/application.properties
```

Update the following two lines to match your MySQL installation:

```properties
spring.datasource.username=root
spring.datasource.password=your_password   # ← replace with your actual MySQL password
```

If your MySQL runs on a different port or host, also update:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/meditrack_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

### Step 2 — Build the project

From inside the `meditrack-backend/` directory:

```bash
cd meditrack-backend
mvn clean install -DskipTests
```

This downloads all Maven dependencies and compiles the project. First run may take a minute.

---

## 6. Frontend Setup

From inside the `meditrack-frontend/` directory:

```bash
cd meditrack-frontend
npm install
```

This installs React, Axios, Recharts, Tailwind CSS, and all other frontend dependencies.

> **No environment variables required.** The API base URL (`http://localhost:8080/api`) is already configured in `src/api/axiosInstance.js`.

---

## 7. Running the Application

You need **two terminal windows** — one for the backend and one for the frontend.

### Terminal 1 — Start the Backend

```bash
cd meditrack-backend
mvn spring-boot:run
```

Wait for the log line:

```
Started MediTrackApplication in X.XXX seconds
```

The API is now running at: **http://localhost:8080**

> On first run, Flyway will log something like:
> `Successfully applied 5 migrations to schema 'meditrack_db'`
> This means all tables have been created automatically.

### Terminal 2 — Start the Frontend

```bash
cd meditrack-frontend
npm run dev
```

You will see:

```
  VITE v5.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser — MediTrack is ready to use!

---

## 8. Using MediTrack

### Getting started (recommended order)

1. **Add a medication** — go to the Medications page and click "Add Medication". Fill in the name, dosage, frequency, and start date.

2. **Generate today's doses** — go to the Dose Log page. Click **"⚡ Generate Doses"** to auto-create PENDING dose entries based on your medications' frequencies.

3. **Mark doses** — click Taken / Missed / Skip on each dose card.

4. **Log symptoms** — go to the Symptoms page and use the form to log a symptom with a severity score. The line chart updates automatically.

5. **Record a visit** — go to Doctor Visits and click "Add Visit". You can link medications discussed at the appointment.

6. **View the dashboard** — the home screen shows your 30-day adherence %, today's schedule, and recent symptoms at a glance.

### Reminder bell

The 🔔 bell in the top-right corner polls the backend every 60 seconds and shows a badge count and dropdown list of any doses due within the next 30 minutes.

### Dose frequency times

| Frequency | Scheduled times |
|-----------|----------------|
| Once daily | 08:00 |
| Twice daily | 08:00, 20:00 |
| Three times daily | 08:00, 14:00, 20:00 |
| Every 8 hours | 08:00, 16:00, 00:00 |
| Weekly | 08:00 on the same weekday as the start date |

---

## 9. API Documentation (Swagger)

Once the backend is running, open:

**http://localhost:8080/swagger-ui.html**

This gives you an interactive Swagger UI where you can browse and test all REST endpoints directly from the browser — no Postman needed.

### Quick API reference

| Feature | Endpoint |
|---------|----------|
| All medications | `GET /api/medications` |
| Add medication | `POST /api/medications` |
| Doses for today | `GET /api/doses?date=YYYY-MM-DD` |
| Generate doses | `POST /api/doses/generate?date=YYYY-MM-DD` |
| Mark dose status | `PATCH /api/doses/{id}/status` |
| Log symptom | `POST /api/symptoms` |
| Dashboard summary | `GET /api/dashboard/summary` |
| Pending reminders | `GET /api/reminders/pending` |
| Doctor visits | `GET /api/visits` |

---

## 10. Troubleshooting

### Backend won't start — "Access denied for user 'root'"
Your MySQL password in `application.properties` is incorrect. Double-check `spring.datasource.password`.

### Backend won't start — "Unknown database 'meditrack_db'"
You haven't created the database yet. Run `CREATE DATABASE meditrack_db ...` as described in Step 4.

### Backend won't start — "Validate failed: missing physical table"
Flyway didn't run. Check that `spring.flyway.enabled=true` is set in `application.properties`.

### Frontend shows "Network Error" or blank data
The backend isn't running. Start it with `mvn spring-boot:run` and confirm it's on port 8080.

### "No doses found" for today
Click the **⚡ Generate Doses** button. This creates dose entries from your active medications. You must generate doses for each new date.

### Port 8080 is already in use
Change the backend port in `application.properties`:
```properties
server.port=8081
```
Then update the frontend `src/api/axiosInstance.js` baseURL to `http://localhost:8081/api`.

### Running unit tests

```bash
cd meditrack-backend
mvn test
```

---

## Assumptions Made During Implementation

1. **No authentication** — this is a single-user application. Multi-user JWT auth is listed as a future enhancement in the spec and was intentionally excluded.
2. **Dose times are fixed per frequency** — see the table in Section 8. These can be changed in `DoseLogService.getDoseTimes()`.
3. **Adherence formula** — calculated as `TAKEN ÷ (TAKEN + MISSED)` over the last 30 days. PENDING and SKIPPED doses are excluded.
4. **Dose generation is manual** — the user clicks "Generate Doses" per day. Auto-generation on app load was considered but skipped to keep the UX predictable.
5. **Soft delete only for medications** — deleting a medication sets `isActive = false`. All historical dose logs are preserved. Symptoms and visits are hard-deleted.
