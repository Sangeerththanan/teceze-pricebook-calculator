@echo off
echo Starting Teceze Pricebook Backend Server...
echo.

cd /d "%~dp0backend"
echo Current directory: %CD%
echo.

echo Starting backend server on port 3001...
node index.js

echo.
echo Backend server stopped.
pause
