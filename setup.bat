@echo off
REM Setup script for La Internacional CRM development environment (Windows)

echo ==========================================
echo La Internacional CRM - Setup Script
echo ==========================================
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.X Docker is not installed. Please install Docker Desktop.
    pause
    exit /b 1
)

echo X Docker found
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo Creating .env.local from template...
    copy .env.local.example .env.local >nul
    echo X .env.local created
    echo.
    echo WARNING: Edit .env.local and add your Meta credentials:
    echo   - META_APP_ID
    echo   - META_ACCESS_TOKEN
    echo   - META_PHONE_NUMBER_ID
    echo   - META_BUSINESS_ACCOUNT_ID
    echo   - META_VERIFY_TOKEN
    echo.
    echo Get these from: https://developers.facebook.com
    echo.
    pause
) else (
    echo X .env.local already exists
    echo.
)

echo Building Docker images...
docker-compose build

echo.
echo ==========================================
echo X Setup complete!
echo ==========================================
echo.
echo Next steps:
echo   1. Edit .env.local with your Meta credentials
echo   2. Run: docker-compose up
echo   3. Access frontend: http://localhost:5173
echo   4. Access API: http://localhost:8080
echo.
pause
