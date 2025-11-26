# Stop script for Food Evaluator - PowerShell
# This stops both backend and frontend servers

Write-Host "Stopping Food Evaluator..." -ForegroundColor Cyan
Write-Host ""

# Kill Node.js processes running on ports 3001 and 3000
Write-Host "Stopping backend server (port 3001)..." -ForegroundColor Yellow
$backendProcess = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($backendProcess) {
    Stop-Process -Id $backendProcess -Force
    Write-Host "Backend stopped" -ForegroundColor Green
} else {
    Write-Host "Backend not running" -ForegroundColor Gray
}

Write-Host "Stopping frontend server (port 3000)..." -ForegroundColor Yellow
$frontendProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($frontendProcess) {
    Stop-Process -Id $frontendProcess -Force
    Write-Host "Frontend stopped" -ForegroundColor Green
} else {
    Write-Host "Frontend not running" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Food Evaluator stopped!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
