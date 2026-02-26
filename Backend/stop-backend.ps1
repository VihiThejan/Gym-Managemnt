# Stop Backend Server Script
# This script stops any process using port 5000

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Stop Backend Server" -ForegroundColor Cyan
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
        Write-Host "Backend server stopped successfully" -ForegroundColor Green
    } catch {
        Write-Host "Failed to stop process: $_" -ForegroundColor Red
        Write-Host "Try running this script as Administrator" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "No process found using port $port" -ForegroundColor Blue
    Write-Host "Backend server is not running" -ForegroundColor Blue
}

Write-Host ""
