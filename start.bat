@echo off
echo Starting AgroMind Grow...
echo.

REM Set the local Node.js path
set PATH=%~dp0local-node\node-v22.18.0-win-x64;%PATH%

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Start the development server
echo Starting development server on http://localhost:8080
echo Press Ctrl+C to stop the server
echo.
npm run dev
