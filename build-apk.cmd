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

REM Sync Capacitor (copies web assets and generates config files directly into android/app/src/main/assets)
echo [*] Syncing Capacitor...
call npx cap sync android 2>nul
if %errorlevel% neq 0 (
    echo [-] cap sync android failed, using manual asset copy fallback
    set ASSETS_DIR=%~dp0android\app\src\main\assets
    if not exist "!ASSETS_DIR!\public" ( mkdir "!ASSETS_DIR!\public" )
    xcopy "%~dp0html\*" "!ASSETS_DIR!\public\" /E /I /Y >nul 2>&1
    echo [+] Assets copied manually
) else (
    echo [+] cap sync complete
)

REM Copy icons from repo into Android project
echo [*] Copying app icons...
set ICONS_SRC=%~dp0icons
set ICONS_DST=%~dp0android\app\src\main\res
if exist "!ICONS_SRC!" (
    for %%d in (mipmap-mdpi mipmap-hdpi mipmap-xhdpi mipmap-xxhdpi mipmap-xxxhdpi mipmap-anydpi-v26) do (
        if exist "!ICONS_SRC!\%%d" ( xcopy "!ICONS_SRC!\%%d\*" "!ICONS_DST!\%%d\" /I /Y >nul 2>&1 )
    )
    echo [+] Icons copied
) else (
    echo [-] Warning: icons/ folder not found, using default icons
)

REM Setup Android local properties (Android SDK path)
echo [*] Configuring Android SDK...
if not exist "android\local.properties" (
    echo sdk.dir=%LOCALAPPDATA%\Android\Sdk > "android\local.properties"
    echo [+] Android SDK path configured
)

REM Navigate to android/
echo [*] Building Android APK...
cd /d "%~dp0android"
if not exist "gradlew.bat" (
    echo [-] gradlew.bat not found in android\
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
    
    REM Copy to project build/ folder
    echo [*] Copying APK to build folder...
    if not exist "%~dp0build" ( mkdir "%~dp0build" )
    copy "app\build\outputs\apk\debug\app-debug.apk" "%~dp0build\kartpit.apk" /Y
    echo [+] APK copied to: %~dp0build\kartpit.apk
    echo.
    echo =====================================
    echo   Build Complete!
    echo =====================================
    echo.
    echo Next step: Install the APK on your Android device using ADB or installing the apk on the device
    pause
) else (
    echo [-] APK file not found after build
    pause
    exit /b 1
)
