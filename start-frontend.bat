@echo off
echo Starting Teceze Pricebook Frontend Server...
echo.

cd /d "%~dp0frontend"
echo Current directory: %CD%
echo.

echo Installing dependencies if needed...
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
)

echo.
echo Starting frontend server on port 5173...
npm run dev

echo.
echo Frontend server stopped.
pause
