# 🏥 MediCare — Hospital Management System

A full-stack Hospital Management System built with the **MERN stack** (MongoDB, Express, React, Node.js).

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)
![License](https://img.shields.io/badge/License-ISC-green)

---

## ✨ Features

- **Role-based access** — Admin, Doctor, and Patient dashboards
- **Appointment booking** — Patients book, Doctors confirm/complete
- **Digital prescriptions** — Doctors write, Patients view
- **Admin panel** — Full CRUD for doctors, patients, appointments
- **JWT Authentication** — Secure login with bcrypt password hashing
- **Responsive UI** — Works on desktop and mobile

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 8.3 installed locally

### Run the project

**Option 1 — One click (Windows)**
```
Double-click start.bat
```

**Option 2 — Manual**
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

### Seed demo data (first time only)
```bash
cd backend
node seed.js
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | Admin@123 |
| Doctor | doctor@hospital.com | Doctor@123 |
| Doctor | priya.mehta@hospital.com | Doctor@123 |
| Doctor | rohit.verma@hospital.com | Doctor@123 |
| Doctor | sneha.patel@hospital.com | Doctor@123 |
| Patient | patient@hospital.com | Patient@123 |

---

## 🛠️ Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs  
**Frontend:** React 19, Vite, React Router v7, Axios, CSS3

---

## 📁 Project Structure

```
hospital-management-system/
├── backend/        # Express REST API
├── frontend/       # React SPA
├── start.bat       # One-click launcher
└── PROJECT_REPORT.md
```

---

## ⚙️ Environment Variables

Create `backend/.env` (not committed to git):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/medicare
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```
