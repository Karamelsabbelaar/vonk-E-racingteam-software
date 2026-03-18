@echo off
REM KartPit - One-Command APK Builder for Windows
REM This script installs dependencies, syncs Capacitor, builds the APK, and copies it to Desktop

setlocal enabledelayedexpansion

echo.
echo =====================================
echo   KartPit - APK Build Started
echo =====================================
echo.

REM Get the directory where this script is located
cd /d "%~dp0"

REM Check for Node.js
echo [*] Checking for Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [-] Node.js not found. Please install from https://nodejs.org/
    pause
    exit /b 1
)
echo [+] Node.js found

REM Install dependencies
echo [*] Installing npm dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [-] Failed to install dependencies
    pause
    exit /b 1
)
echo [+] Dependencies installed

REM Sync Capacitor (this copies web assets + generates capacitor.config.json, capacitor.plugins.json, cordova.js)
echo [*] Syncing Capacitor...
call npx cap sync 2>nul
REM The sync copies to android\app\src\main\assets but we build from android\android-template
REM So we copy everything over

REM Copy ALL assets from cap sync output to the build directory
echo [*] Copying assets to build directory...
set CAP_ASSETS=%~dp0android\app\src\main\assets
set BUILD_ASSETS=%~dp0android\android-template\app\src\main\assets
if not exist "!BUILD_ASSETS!" ( mkdir "!BUILD_ASSETS!" )
if exist "!CAP_ASSETS!" (
    xcopy "!CAP_ASSETS!\*" "!BUILD_ASSETS!\" /E /I /Y >nul 2>&1
    echo [+] Assets copied from cap sync output
) else (
    REM Fallback: manually copy html and generate minimal config
    echo [-] Warning: cap sync output not found, using manual copy
    if not exist "!BUILD_ASSETS!\public" ( mkdir "!BUILD_ASSETS!\public" )
    xcopy "%~dp0html\*" "!BUILD_ASSETS!\public\" /E /I /Y >nul 2>&1
)

REM Setup Android local properties (Android SDK path)
echo [*] Configuring Android SDK...
if not exist "android\android-template\local.properties" (
    echo sdk.dir=%LOCALAPPDATA%\Android\Sdk > "android\android-template\local.properties"
    echo [+] Android SDK path configured
)

REM Navigate to android/android-template
echo [*] Building Android APK...
cd /d "%~dp0android\android-template"
if not exist "gradlew.bat" (
    echo [-] gradlew.bat not found in android\android-template
    pause
    exit /b 1
)

REM Build the APK
echo [*] Running gradle build (this may take a few minutes)...
call cmd /c gradlew.bat clean assembleDebug
if %errorlevel% neq 0 (
    echo [-] Gradle build failed
    pause
    exit /b 1
)

REM Check if APK was created
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo [+] APK built successfully!
    
    REM Copy to Desktop
    echo [*] Copying APK to Desktop...
    copy "app\build\outputs\apk\debug\app-debug.apk" "%USERPROFILE%\Desktop\app-debug.apk" /Y
    echo [+] APK copied to: %USERPROFILE%\Desktop\app-debug.apk
    echo.
    echo =====================================
    echo   Build Complete!
    echo =====================================
    echo.
    echo Next step: Install the APK on your Android device using O+ Connect or ADB
    pause
) else (
    echo [-] APK file not found after build
    pause
    exit /b 1
)
