# PowerShell script to start both BookShopAPI and Next.js frontend
# Usage: .\start-dev.ps1

Write-Host "🚀 Starting BookShop Development Environment..." -ForegroundColor Green

# Check if we're in the correct directory
if (-not (Test-Path "BookShopAPI") -or -not (Test-Path "frondbookshop")) {
    Write-Host "❌ Error: Please run this script from the root directory containing both BookShopAPI and frondbookshop folders" -ForegroundColor Red
    exit 1
}

# Function to start API
function Start-API {
    Write-Host "🔧 Starting BookShop API..." -ForegroundColor Yellow
    Set-Location "BookShopAPI"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --urls=http://localhost:7000"
    Set-Location ".."
}

# Function to start Frontend
function Start-Frontend {
    Write-Host "🎨 Starting Next.js Frontend..." -ForegroundColor Yellow
    Set-Location "frondbookshop"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
    Set-Location ".."
}

# Start both services
Start-API
Start-Sleep -Seconds 3
Start-Frontend

Write-Host "✅ Both services are starting..." -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔗 API: http://localhost:7000" -ForegroundColor Cyan
Write-Host "📚 API Docs: http://localhost:7000/swagger" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
