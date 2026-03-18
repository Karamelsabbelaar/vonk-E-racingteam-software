@echo off
REM KartPit - Setup Script with Language Selection (Windows)

setlocal enabledelayedexpansion

:LANGUAGE_SELECT
cls
echo.
echo =====================================
echo   KartPit - Language Selection
echo =====================================
echo.
echo 1. Nederlands
echo 2. English
echo.
set /p LANG="[*] Selecteer taal / Select language (1 or 2): "

if "%LANG%"=="1" goto DUTCH
if "%LANG%"=="2" goto ENGLISH
goto LANGUAGE_SELECT

:DUTCH
setlocal enabledelayedexpansion
set LANG_TITLE=[*] KartPit - Capacitor Setup
set LANG_SUBTITLE=[*] ==============================
set LANG_NODE_CHECK=[-] Node.js niet gevonden. Installeer van https://nodejs.org/
set LANG_NODE_FOUND=[+] Node.js gevonden
set LANG_NPM_CHECK=[-] npm niet gevonden. Installeer Node.js.
set LANG_NPM_FOUND=[+] npm gevonden
set LANG_INSTALL=[*] Afhankelijkheden installeren...
set LANG_INSTALL_SUCCESS=[+] Afhankelijkheden succesvol geinstalleerd
set LANG_INSTALL_FAIL=[-] Fout bij installatie van afhankelijkheden
set LANG_ANDROID_HOME=[*] ANDROID_HOME omgevingsvariabele instellen...
set LANG_CAPACITOR=[*] Capacitor instellen...
set LANG_CONFIG=[!] capacitor.config.json niet gevonden. Aanmaken...
set LANG_COMPLETE=[+] Setup voltooid!
set LANG_NEXT=[*] Volgende stappen voor Android APK:
set LANG_STEP1=[1.] Zorg dat je Android Studio hebt geinstalleerd
set LANG_STEP2=[2.] Stel ANDROID_HOME in: setx ANDROID_HOME %%LOCALAPPDATA%%\Android\Sdk
set LANG_STEP3=[3.] Voer uit: npx cap add android
set LANG_STEP4=[4.] Voer uit: npx cap sync
set LANG_STEP5=[5.] Bouw APK: cd android ^&^& gradlew assembleDebug
set LANG_STEP6=[6.] APK staat in: android\app\build\outputs\apk\debug\app-debug.apk
set LANG_DETAILS=[*] Voor gedetailleerde instructies, zie: APK_SETUP.md

goto SETUP

:ENGLISH
setlocal enabledelayedexpansion
set LANG_TITLE=[*] KartPit - Capacitor Setup
set LANG_SUBTITLE=[*] ==============================
set LANG_NODE_CHECK=[-] Node.js not found. Please install from https://nodejs.org/
set LANG_NODE_FOUND=[+] Node.js found
set LANG_NPM_CHECK=[-] npm not found. Please install Node.js.
set LANG_NPM_FOUND=[+] npm found
set LANG_INSTALL=[*] Installing dependencies...
set LANG_INSTALL_SUCCESS=[+] Dependencies installed successfully
set LANG_INSTALL_FAIL=[-] Failed to install dependencies
set LANG_ANDROID_HOME=[*] Setting up ANDROID_HOME environment variable...
set LANG_CAPACITOR=[*] Setting up Capacitor...
set LANG_CONFIG=[!] capacitor.config.json not found. Creating...
set LANG_COMPLETE=[+] Setup complete!
set LANG_NEXT=[*] Next steps for Android APK:
set LANG_STEP1=[1.] Make sure you have Android Studio installed
set LANG_STEP2=[2.] Set ANDROID_HOME: setx ANDROID_HOME %%LOCALAPPDATA%%\Android\Sdk
set LANG_STEP3=[3.] Run: npx cap add android
set LANG_STEP4=[4.] Run: npx cap sync
set LANG_STEP5=[5.] Build APK: cd android ^&^& gradlew assembleDebug
set LANG_STEP1=[1.] Make sure you have Android Studio installed
set LANG_STEP2=[2.] Run: npx cap sync
set LANG_STEP3=[3.] Run: npx cap open android
set LANG_STEP4=[4.] Build APK in Android Studio
set LANG_DETAILS=[*] For detailed instructions, see: APK_SETUP.md

goto SETUP

:SETUP
cls
echo.
echo !LANG_TITLE!
echo !LANG_SUBTITLE!
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo !LANG_NODE_CHECK!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo !LANG_NODE_FOUND!: %NODE_VERSION%

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo !LANG_NPM_CHECK!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo !LANG_NPM_FOUND!: %NPM_VERSION%
echo.

REM Install dependencies
echo !LANG_INSTALL!
call npm install --legacy-peer-deps

if %ERRORLEVEL% EQU 0 (
    echo !LANG_INSTALL_SUCCESS!
) else (
    echo !LANG_INSTALL_FAIL!
    pause
    exit /b 1
)

echo.
echo !LANG_CAPACITOR!

REM Check if capacitor.config.json exists
if not exist "capacitor.config.json" (
    echo !LANG_CONFIG!
    call npx cap init
)

echo.
echo !LANG_COMPLETE!
echo.
echo !LANG_NEXT!
echo   !LANG_STEP1!
echo   !LANG_STEP2!
echo   !LANG_STEP3!
echo   !LANG_STEP4!
echo   !LANG_STEP5!
echo   !LANG_STEP6!
echo.
echo !LANG_DETAILS!
echo.

pause
