@echo off
title 🚀 BookShop Development Environment
echo Starting BookShop Development Environment...
echo.

:: Проверяем наличие папок
if not exist "BookShopAPI" (
    echo ❌ Error: Folder "BookShopAPI" not found!
    exit /b 1
)
if not exist "frondbookshop" (
    echo ❌ Error: Folder "frondbookshop" not found!
    exit /b 1
)

:: Запуск API
echo 🔧 Starting BookShop API...
cd BookShopAPI
start "BookShopAPI" dotnet run --urls=http://localhost:7000
cd ..

:: Небольшая задержка
timeout /t 3 /nobreak >nul

:: Запуск фронтенда
echo 🎨 Starting Next.js Frontend...
cd frondbookshop
start "Next.js Frontend" npm run dev
cd ..

:: Информация
echo.
echo ✅ Both services are starting...
echo 📱 Frontend: http://localhost:3000
echo 🔗 API: https://localhost:7000
echo 📚 API Docs: https://localhost:7000/swagger
echo.
echo Press Ctrl+C in each window to stop services.
pause