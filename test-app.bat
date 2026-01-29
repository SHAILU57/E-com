@echo off
echo === E-Commerce Application Test ===
echo.

echo 1. Checking Backend Server...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Backend is running on http://localhost:5000
) else (
    echo ❌ Backend is NOT running
    echo    Start with: cd "C:\Users\Sailaja Narada\e-commese" && npm run dev
)

echo.
echo 2. Checking Frontend Server...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Frontend is running on http://localhost:3000
) else (
    echo ❌ Frontend is NOT running
    echo    Start with: cd "C:\Users\Sailaja Narada\e-commese\client" && npm start
)

echo.
echo 3. Testing API Connection...
curl -s -X GET http://localhost:5000/api/products > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ API endpoints are accessible
) else (
    echo ⚠️  API endpoints may have issues (MongoDB connection)
)

echo.
echo === Test Complete ===
echo.
echo 🌐 Access your application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000/api
echo    Health Check: http://localhost:5000/api/health
echo.
pause