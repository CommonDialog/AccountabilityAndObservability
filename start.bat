@echo off
REM Start script for Food Evaluator - Windows
REM This starts both backend and frontend in development mode with hot-reloading

echo Starting Food Evaluator...
echo.

REM Start backend in a new window
echo Starting backend server...
start "Food Evaluator - Backend" cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to initialize
timeout /t 3 /nobreak > nul

REM Start frontend in a new window
echo Starting frontend application...
start "Food Evaluator - Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Food Evaluator is starting!
echo ========================================
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop the servers
echo Or run stop.bat to close both windows
echo ========================================
