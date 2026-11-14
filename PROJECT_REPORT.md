# MediCare — Hospital Management System
## Project Report

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Objectives](#2-objectives)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Database Design](#5-database-design)
6. [Backend API Design](#6-backend-api-design)
7. [Frontend Module Design](#7-frontend-module-design)
8. [Features & Functionality](#8-features--functionality)
9. [Security Implementation](#9-security-implementation)
10. [Project Structure](#10-project-structure)
11. [How to Run](#11-how-to-run)
12. [Demo Credentials](#12-demo-credentials)
13. [Conclusion](#13-conclusion)

---

## 1. Project Overview

**MediCare** is a full-stack web-based Hospital Management System designed to digitize and streamline core hospital operations. It provides a unified platform for three types of users — **Administrators**, **Doctors**, and **Patients** — each with their own dedicated dashboard and role-specific features.

The system covers the complete patient journey: from registration and doctor discovery, to appointment booking, consultation, and digital prescription management. Administrative staff can manage the entire hospital ecosystem from a centralized dashboard.

| Property | Details |
|----------|---------|
| Project Name | MediCare — Hospital Management System |
| Type | Full-Stack Web Application |
| Architecture | REST API + Single Page Application (SPA) |
| Database | MongoDB (NoSQL) |
| Authentication | JSON Web Token (JWT) |

---

## 2. Objectives

- Provide a centralized digital platform for hospital operations
- Enable patients to register, find doctors, and book appointments online
- Allow doctors to manage appointments and issue digital prescriptions
- Give administrators full control over doctors, patients, and appointments
- Implement secure role-based access control (RBAC)
- Deliver a clean, responsive UI accessible across all devices

---

## 3. Technology Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | JavaScript runtime environment |
| Express.js | 4.19 | Web framework for REST API |
| MongoDB | 8.3 | NoSQL database |
| Mongoose | 8.5 | MongoDB ODM (Object Document Mapper) |
| JSON Web Token (JWT) | 9.0 | Authentication & authorization |
| bcryptjs | 2.4 | Password hashing |
| express-validator | 7.2 | Input validation middleware |
| dotenv | 16.4 | Environment variable management |
| cors | 2.8 | Cross-Origin Resource Sharing |
| nodemon | 3.1 | Auto-restart during development |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2 | UI component library |
| Vite | 8.2 | Build tool & dev server |
| React Router DOM | 7.18 | Client-side routing |
| Axios | 1.20 | HTTP client for API calls |
| CSS3 (Custom) | — | Styling with CSS variables design system |
| Inter (Google Fonts) | — | Typography |

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                        │
│              React SPA (Vite) — Port 5173               │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│   │  Admin   │ │  Doctor  │ │ Patient  │ │  Public  │  │
│   │  Pages   │ │  Pages   │ │  Pages   │ │  Pages   │  │
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│               Axios HTTP Client                         │
└────────────────────────┬────────────────────────────────┘
                         │ REST API (JSON)
                         │ HTTP + JWT Bearer Token
┌────────────────────────▼────────────────────────────────┐
│                     SERVER LAYER                        │
│              Express.js API — Port 5000                 │
│   ┌──────────────────────────────────────────────────┐  │
│   │  Routes → Controllers → Middleware → Models      │  │
│   │  /api/auth  /api/doctors  /api/patients          │  │
│   │  /api/appointments  /api/prescriptions           │  │
│   └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ Mongoose ODM
┌────────────────────────▼────────────────────────────────┐
│                    DATABASE LAYER                       │
│              MongoDB — Port 27017                       │
│   Collections: users, doctors, patients,               │
│                appointments, prescriptions             │
└─────────────────────────────────────────────────────────┘
```

### Request Flow

```
User Action → React Component → Axios (api.js)
    → JWT Interceptor → Express Route
    → Auth Middleware → Role Middleware
    → Controller → Mongoose Model
    → MongoDB → Response JSON
    → React State Update → UI Re-render
```

---

## 5. Database Design

### 5.1 Users Collection

Stores login credentials for all user types.

| Field | Type | Constraints |
|-------|------|------------|
| _id | ObjectId | Auto-generated primary key |
| name | String | Required, min 2 chars |
| email | String | Required, unique, lowercase |
| password | String | Required, hashed (bcrypt), select:false |
| role | String | Enum: admin / doctor / patient |
| createdAt | Date | Auto-generated (timestamps) |
| updatedAt | Date | Auto-generated (timestamps) |

### 5.2 Doctors Collection

Extended profile for doctor users, linked to Users via `userId`.

| Field | Type | Constraints |
|-------|------|------------|
| _id | ObjectId | Primary key |
| userId | ObjectId | Ref → User (foreign key) |
| name | String | Required |
| email | String | Required, unique |
| phone | String | Required, 10-digit |
| specialization | String | Required |
| qualification | String | Required |
| experience | Number | Required, min 0 |
| department | String | Enum (12 departments) |
| availability | Boolean | Default: true |
| fee | Number | Default: 500, min 0 |

### 5.3 Patients Collection

Extended health profile for patient users.

| Field | Type | Constraints |
|-------|------|------------|
| _id | ObjectId | Primary key |
| userId | ObjectId | Ref → User |
| name | String | Required |
| email | String | Required, unique |
| phone | String | Required, 10-digit |
| age | Number | Required, 0–150 |
| gender | String | Enum: Male / Female / Other |
| address | String | Required |
| bloodGroup | String | Enum: A+/A-/B+/B-/AB+/AB-/O+/O- |

### 5.4 Appointments Collection

Core transactional entity linking patients and doctors.

| Field | Type | Constraints |
|-------|------|------------|
| _id | ObjectId | Primary key |
| patientId | ObjectId | Ref → Patient |
| doctorId | ObjectId | Ref → Doctor |
| appointmentDate | Date | Required |
| appointmentTime | String | Required |
| reason | String | Required, min 5 chars |
| status | String | Enum: Pending/Confirmed/Completed/Cancelled |
| notes | String | Optional |

### 5.5 Prescriptions Collection

Digital prescriptions issued by doctors after consultations.

| Field | Type | Constraints |
|-------|------|------------|
| _id | ObjectId | Primary key |
| patientId | ObjectId | Ref → Patient |
| doctorId | ObjectId | Ref → Doctor |
| appointmentId | ObjectId | Ref → Appointment |
| diagnosis | String | Required |
| medicines | Array | [{name, dosage, duration}] |
| instructions | String | Optional |

### Entity Relationship Diagram

```
User ──────────── Doctor
 │                  │
 │                  │
 └─── Patient       │
        │           │
        └─── Appointment ───┘
                │
                └─── Prescription
```

---

## 6. Backend API Design

### Base URL: `http://localhost:5000/api`

### 6.1 Authentication Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new patient account |
| POST | `/login` | Public | Login, returns JWT token |
| GET | `/profile` | Private | Get logged-in user's profile |
| PUT | `/profile` | Private | Update name/email |

### 6.2 Doctor Routes — `/api/doctors`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all doctors (with filters) |
| GET | `/:id` | Public | Get single doctor by ID |
| POST | `/` | Admin | Create new doctor account |
| PUT | `/:id` | Admin | Update doctor details |
| DELETE | `/:id` | Admin | Delete doctor |

### 6.3 Patient Routes — `/api/patients`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Admin | Get all patients |
| GET | `/:id` | Admin/Patient | Get single patient |
| GET | `/user/:userId` | Private | Get patient by user ID |
| POST | `/` | Private | Create patient profile |
| PUT | `/:id` | Private | Update patient profile |
| DELETE | `/:id` | Admin | Delete patient |

### 6.4 Appointment Routes — `/api/appointments`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Private | Get appointments (role-filtered) |
| GET | `/stats` | Admin | Get appointment statistics |
| GET | `/:id` | Private | Get single appointment |
| POST | `/` | Patient | Book new appointment |
| PUT | `/:id` | Doctor/Admin | Update status |
| DELETE | `/:id` | Patient/Admin | Cancel/delete appointment |

### 6.5 Prescription Routes — `/api/prescriptions`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Private | Get prescriptions (role-filtered) |
| GET | `/:id` | Private | Get single prescription |
| POST | `/` | Doctor | Create prescription |
| PUT | `/:id` | Doctor | Update prescription |
| DELETE | `/:id` | Doctor/Admin | Delete prescription |

### API Response Format

All responses follow a consistent structure:

```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "count": 10
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 7. Frontend Module Design

### 7.1 Routing Structure

```
/ ──────────────────── Home (public)
/login ──────────────── Login (public)
/register ───────────── Register (public)
/doctors ─────────────── Doctor listing (public)
/doctors/:id ─────────── Doctor details + booking (public)
/unauthorized ───────── 403 page

/profile ─────────────── My profile (any logged-in user)

/admin/dashboard ────────  Admin stats + recent appointments
/admin/doctors ──────────  Manage doctors (CRUD)
/admin/patients ─────────  Manage patients
/admin/appointments ─────  Manage all appointments

/doctor/dashboard ───────  Doctor's appointments + actions
/doctor/prescriptions ───  Write & view prescriptions

/patient/dashboard ──────  Patient appointments overview
/patient/doctors ────────  Find doctors (with sidebar)
/patient/appointments ───  Appointment history
/patient/prescriptions ──  View received prescriptions
```

### 7.2 Component Architecture

```
App.jsx
├── Navbar.jsx          ← Sticky top nav, role-aware links
├── ProtectedRoute.jsx  ← Auth + role guard for routes
│
├── Sidebar.jsx         ← Role-based navigation sidebar
├── StatCard.jsx        ← Reusable stat display card
├── DoctorCard.jsx      ← Doctor listing card with link
├── AppointmentCard.jsx ← Appointment display with actions
└── Loading.jsx         ← Spinner component
```

### 7.3 State Management

The app uses **React Context API** for global state:

- `AuthContext` — stores current user, token, login/logout/register functions
- Local `useState` — page-level data (appointments, doctors, form state)
- `localStorage` — persists JWT token and user object across sessions

### 7.4 API Layer

A centralized `services/api.js` file using Axios:

- **Request interceptor** — automatically attaches `Bearer <token>` header to every request
- **Response interceptor** — handles 401 globally, redirects to `/login` on token expiry
- Named exports for every endpoint (`getDoctors`, `createAppointment`, etc.)

---

## 8. Features & Functionality

### 8.1 Admin Features

| Feature | Description |
|---------|-------------|
| Dashboard | Real-time stats: total doctors, patients, appointments by status |
| Manage Doctors | Add, edit, delete doctors with full profile management |
| Manage Patients | View all patients, search by name/email/phone, delete records |
| Manage Appointments | View all appointments with status filters, update/delete |
| Quick Actions | One-click navigation to management sections |

### 8.2 Doctor Features

| Feature | Description |
|---------|-------------|
| Dashboard | Personal appointment stats (today, pending, completed) |
| Appointment Management | Confirm, complete, or cancel patient appointments |
| Write Prescriptions | Select confirmed appointment, add diagnosis + medicines |
| View Prescriptions | View all prescriptions written |
| Profile | View account and role information |

### 8.3 Patient Features

| Feature | Description |
|---------|-------------|
| Dashboard | Upcoming and past appointment overview |
| Find Doctors | Search/filter doctors by name, department, availability |
| Doctor Profile | View full doctor details, consultation fee |
| Book Appointment | Select date, time slot, and reason |
| Cancel Appointment | Cancel pending appointments |
| My Prescriptions | View all prescriptions with medicine table |
| Profile | View health info — blood group, address, age, gender |

### 8.4 Public Features

| Feature | Description |
|---------|-------------|
| Home Page | Hero section, feature highlights, CTA |
| Browse Doctors | Full doctor listing with search/filter |
| Doctor Details | View doctor profile without login |
| Login / Register | JWT authentication with role assignment |

---

## 9. Security Implementation

### 9.1 Authentication

- Passwords are hashed using **bcryptjs** (salt rounds: 10) before storing in MongoDB
- Login returns a **JWT token** valid for 7 days
- Token stored in `localStorage`, sent in `Authorization: Bearer <token>` header

### 9.2 Authorization Middleware

```
Request → protect middleware (verifies JWT)
        → roleMiddleware (checks user.role)
        → Controller
```

- `protect` — validates JWT, attaches `req.user` to request
- `roleMiddleware` — compares `req.user.role` against allowed roles per route

### 9.3 Frontend Route Guards

`ProtectedRoute` component:
- Redirects unauthenticated users to `/login`
- Redirects users with wrong role to `/unauthorized`

### 9.4 Additional Security Measures

- Passwords excluded from all API responses (`select: false` in Mongoose schema)
- Input validation using `express-validator` on all POST/PUT routes
- CORS restricted to known frontend origins only
- Environment variables stored in `.env` (never committed to version control)

---

## 10. Project Structure

```
hospital-management-system/
│
├── start.bat                    ← One-click project launcher
├── PROJECT_REPORT.md            ← This report
│
├── backend/
│   ├── server.js                ← Express app entry point
│   ├── seed.js                  ← Database seeder
│   ├── .env                     ← Environment variables
│   ├── config/
│   │   └── db.js                ← MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Patient.js
│   │   ├── Appointment.js
│   │   └── Prescription.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── patientController.js
│   │   ├── appointmentController.js
│   │   └── prescriptionController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── prescriptionRoutes.js
│   └── middleware/
│       ├── authMiddleware.js
│       ├── roleMiddleware.js
│       └── errorMiddleware.js
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx              ← Root component + routing
        ├── index.css            ← Global design system
        ├── App.css
        ├── context/
        │   └── AuthContext.jsx  ← Global auth state
        ├── services/
        │   └── api.js           ← Axios API layer
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── StatCard.jsx
        │   ├── DoctorCard.jsx
        │   ├── AppointmentCard.jsx
        │   └── Loading.jsx
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Doctors.jsx
            ├── DoctorDetails.jsx
            ├── Profile.jsx
            ├── NotFound.jsx
            ├── Unauthorized.jsx
            ├── AdminDashboard.jsx
            ├── AdminDoctors.jsx
            ├── AdminPatients.jsx
            ├── AdminAppointments.jsx
            ├── DoctorDashboard.jsx
            ├── DoctorPrescriptions.jsx
            ├── PatientDashboard.jsx
            ├── PatientDoctors.jsx
            └── PatientPrescriptions.jsx
```

---

## 11. How to Run

### Prerequisites

- Node.js 18+
- MongoDB 8.3 (installed at `C:\Program Files\MongoDB\Server\8.3\`)

### Option A — One Click (Recommended)

Double-click `start.bat` in the project root. It will:
1. Start MongoDB on port 27017
2. Start the backend on port 5000
3. Start the frontend on port 5173
4. Open the app in your default browser

### Option B — Manual

```bash
# Terminal 1 — MongoDB
"C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath "C:\data\db"

# Terminal 2 — Backend
cd backend
npm install
npm run dev

# Terminal 3 — Frontend
cd frontend
npm install
npm run dev
```

### Seed Demo Data (first time only)

```bash
cd backend
node seed.js
```

---

## 12. Demo Credentials

| Role | Name | Email | Password |
|------|------|-------|----------|
| Admin | Admin User | admin@hospital.com | Admin@123 |
| Doctor | Dr. Arjun Sharma | doctor@hospital.com | Doctor@123 |
| Doctor | Dr. Priya Mehta | priya.mehta@hospital.com | Doctor@123 |
| Doctor | Dr. Rohit Verma | rohit.verma@hospital.com | Doctor@123 |
| Doctor | Dr. Sneha Patel | sneha.patel@hospital.com | Doctor@123 |
| Patient | Rahul Kumar | patient@hospital.com | Patient@123 |

---

## 13. Conclusion

MediCare is a production-ready Hospital Management System that demonstrates a complete MERN stack application with:

- **Clean architecture** separating concerns across models, controllers, routes, and middleware
- **Role-based access control** ensuring users only access their permitted features
- **Real-time data** from MongoDB with no hardcoded mock data
- **Responsive UI** using a custom CSS design system
- **Scalable structure** that can be extended with features like billing, lab reports, video consultations, and SMS/email notifications

The project covers all core hospital workflows from patient registration through to digital prescription delivery, making it a comprehensive foundation for a real-world healthcare application.

---

*Report generated for MediCare Hospital Management System*
*Stack: MongoDB · Express.js · React · Node.js (MERN)*
