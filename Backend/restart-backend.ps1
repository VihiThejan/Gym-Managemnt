# Restart Backend Server Script
# This script stops any process using port 5000 and starts the backend server

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Backend Server Restart Script" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Check if port 5000 is in use
$port = 5000
$connection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue

if ($connection) {
    $processId = $connection.OwningProcess
    Write-Host "Found process using port ${port}: PID $processId" -ForegroundColor Yellow
    Write-Host "Stopping process..." -ForegroundColor Yellow
    
    try {
        Stop-Process -Id $processId -Force -ErrorAction Stop
        Write-Host "Process stopped successfully" -ForegroundColor Green
        Start-Sleep -Seconds 1
    } catch {
        Write-Host "Failed to stop process: $_" -ForegroundColor Red
        Write-Host "Try running this script as Administrator" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "Port $port is available" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Cyan
Write-Host ""

# Start the backend server
npm start
