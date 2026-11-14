@echo off
title MediCare - Hospital Management System

echo.
echo  ============================================
echo   MediCare - Hospital Management System
echo  ============================================
echo.

:: ── Step 1: Start MongoDB ───────────────────────────────────
echo [1/3] Starting MongoDB...
if not exist "C:\data\db" mkdir "C:\data\db"
start "MongoDB" "C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath "C:\data\db" --quiet
timeout /t 3 /nobreak > nul
echo       MongoDB started on port 27017
echo.

:: ── Step 2: Start Backend ───────────────────────────────────
echo [2/3] Starting Backend (Node.js + Express)...
start "MediCare Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"
timeout /t 4 /nobreak > nul
echo       Backend started on http://localhost:5000
echo.

:: ── Step 3: Start Frontend ──────────────────────────────────
echo [3/3] Starting Frontend (React + Vite)...
start "MediCare Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"
timeout /t 4 /nobreak > nul
echo       Frontend started on http://localhost:5173
echo.

:: ── Open browser ────────────────────────────────────────────
echo  Opening app in browser...
timeout /t 3 /nobreak > nul
start http://localhost:5173

echo.
echo  ============================================
echo   All services are running!
echo.
echo   Frontend  ->  http://localhost:5173
echo   Backend   ->  http://localhost:5000
echo   MongoDB   ->  localhost:27017
echo.
echo   Demo Credentials:
echo   Admin    admin@hospital.com   / Admin@123
echo   Doctor   doctor@hospital.com  / Doctor@123
echo   Patient  patient@hospital.com / Patient@123
echo  ============================================
echo.
echo  Press any key to exit this window...
echo  (Backend and Frontend windows will keep running)
pause > nul
