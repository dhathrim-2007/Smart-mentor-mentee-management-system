@echo off
title Smart AI Mentor-Mentee Management System Launcher
echo ======================================================================
echo    Smart AI Mentor-Mentee Management System - Startup Launcher
echo    Higher Education Mentorship & Career Guidance Platform
echo ======================================================================
echo.

:: 1. Start Backend in a separate window
echo [1/3] Starting Backend API Server (Port 5000)...
start "Smart AI Mentor - Backend Server" cmd /k "cd /d "%~dp0backend" && node server.js"

:: Brief pause to let backend initialize database
timeout /t 2 /nobreak > nul

:: 2. Start Frontend in a separate window
echo [2/3] Starting Frontend Dev Server (Port 5173)...
start "Smart AI Mentor - Frontend Server" cmd /k "cd /d "%~dp0frontend" && npm run dev"

:: Brief pause to let Vite spin up
timeout /t 3 /nobreak > nul

:: 3. Automatically launch browser
echo [3/3] Opening Web Application in Browser...
start http://localhost:5173/

echo.
echo ======================================================================
echo    The Smart AI Mentor Application is now running!
echo.
echo    - Frontend Portal: http://localhost:5173/
echo    - Backend REST API: http://localhost:5000/api/health
echo.
echo    PRE-CONFIGURED DEMO ACCOUNTS (Or use '1-Click Demo' in Navbar):
echo    1. Student:       student@smartmentor.ai / Student@123
echo    2. Mentor:        mentor@smartmentor.ai  / Mentor@123
echo    3. Administrator: admin@smartmentor.ai   / Admin@123
echo.
echo    Keep the two opened command windows running while using the app.
echo    To stop the application, simply close those two command windows.
echo ======================================================================
echo.
pause
