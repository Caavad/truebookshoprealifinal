# BookShop Database Initialization Script
# This script creates the database and runs migrations

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "BookShop Database Initialization" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if SQL LocalDB is available
Write-Host "Checking SQL LocalDB..." -ForegroundColor Yellow
$sqllocaldb = Get-Command sqlcmd -ErrorAction SilentlyContinue

if (-not $sqllocaldb) {
    Write-Host "❌ SQL Server command-line tools not found." -ForegroundColor Red
    Write-Host "Please install SQL Server Express or LocalDB." -ForegroundColor Yellow
    exit 1
}

# Start LocalDB if needed
Write-Host "Starting SQL LocalDB..." -ForegroundColor Yellow
& sqllocaldb start mssqllocaldb

# Build the project
Write-Host ""
Write-Host "Building project..." -ForegroundColor Yellow
dotnet build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Run the application to auto-create database
Write-Host ""
Write-Host "The database will be created automatically when you run the application." -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the API, run:" -ForegroundColor Yellow
Write-Host "  dotnet run" -ForegroundColor White
Write-Host ""
Write-Host "Or use Entity Framework Migrations:" -ForegroundColor Yellow
Write-Host "  dotnet ef migrations add InitialCreate" -ForegroundColor White
Write-Host "  dotnet ef database update" -ForegroundColor White
Write-Host ""

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Database Configuration:" -ForegroundColor Cyan
Write-Host "Server: (localdb)\mssqllocaldb" -ForegroundColor White
Write-Host "Database: BookShopDB" -ForegroundColor White
Write-Host "=====================================" -ForegroundColor Cyan

