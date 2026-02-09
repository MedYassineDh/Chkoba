@echo off
echo.
echo ╔════════════════════════════════════════╗
echo ║   Chkobba Game - Quick Start Setup     ║
echo ╚════════════════════════════════════════╝
echo.

:: Check Node.js
echo Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION%

:: Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✓ npm %NPM_VERSION%

:: Install Backend
echo.
echo Installing Backend...
cd backend
if not exist ".env" (
    copy .env.example .env
)
call npm install
cd ..

:: Install Frontend
echo.
echo Installing Frontend...
cd frontend
if not exist ".env.local" (
    copy .env.local.example .env.local
)
call npm install
cd ..

echo.
echo ╔════════════════════════════════════════╗
echo ║    Setup Complete! Ready to Start      ║
echo ╚════════════════════════════════════════╝
echo.
echo To start development servers:
echo.
echo Command Prompt/PowerShell 1 (Backend):
echo   cd backend
echo   npm run dev
echo.
echo Command Prompt/PowerShell 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo Ready to play! 🎮
echo.
pause
