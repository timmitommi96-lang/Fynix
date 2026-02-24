@echo off
echo.
echo 🔨 Building frontend...
call npm run build

echo.
echo 📦 Copying built files to backend...
if not exist "backend\public" mkdir backend\public
xcopy dist\* backend\public\ /E /I /Y

echo.
echo ✅ Build complete! Run 'npm run backend:start' to deploy
echo 🚀 Then access at: http://localhost:3000
