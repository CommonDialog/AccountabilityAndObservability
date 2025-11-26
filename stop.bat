@echo off
REM Stop script for Food Evaluator - Windows
REM This stops both backend and frontend servers

echo Stopping Food Evaluator...
echo.

REM Kill Node.js processes running on ports 3001 and 3000
echo Stopping backend server (port 3001)...
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :3001') DO TaskKill /PID %%P /F 2>nul

echo Stopping frontend server (port 3000)...
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :3000') DO TaskKill /PID %%P /F 2>nul

echo.
echo ========================================
echo Food Evaluator stopped!
echo ========================================
