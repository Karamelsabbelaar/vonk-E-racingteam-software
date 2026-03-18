#!/bin/bash
# KartPit - One-Command APK Builder for Linux/macOS
# This script installs dependencies, syncs Capacitor, builds the APK, and copies it to Desktop

set +e  # Don't exit on errors (we handle them)

echo ""
echo "====================================="
echo "   KartPit - APK Build Started"
echo "====================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check for Node.js
echo "[*] Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo "[-] Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi
echo "[+] Node.js found"

# Install dependencies
echo "[*] Installing npm dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[-] Failed to install dependencies"
    exit 1
fi
echo "[+] Dependencies installed"

# Sync Capacitor (this copies web assets + generates capacitor.config.json, capacitor.plugins.json, cordova.js)
echo "[*] Syncing Capacitor..."
npx cap sync 2>/dev/null
# The sync copies to android/app/src/main/assets but we build from android/android-template
# So we copy everything over

# Copy ALL assets from cap sync output to the build directory
echo "[*] Copying assets to build directory..."
CAP_ASSETS="$SCRIPT_DIR/android/app/src/main/assets"
BUILD_ASSETS="$SCRIPT_DIR/android/android-template/app/src/main/assets"
mkdir -p "$BUILD_ASSETS"
if [ -d "$CAP_ASSETS" ]; then
    cp -r "$CAP_ASSETS/"* "$BUILD_ASSETS/"
    echo "[+] Assets copied from cap sync output"
else
    echo "[-] Warning: cap sync output not found, using manual copy"
    mkdir -p "$BUILD_ASSETS/public"
    cp -r "$SCRIPT_DIR/html/"* "$BUILD_ASSETS/public/"
fi

# Setup Android local properties (Android SDK path)
echo "[*] Configuring Android SDK..."
if [ ! -f "android/android-template/local.properties" ]; then
    echo "sdk.dir=$HOME/Library/Android/sdk" > "android/android-template/local.properties"
    echo "[+] Android SDK path configured"
fi

# Navigate to android/android-template
echo "[*] Building Android APK..."
cd "$SCRIPT_DIR/android/android-template"

if [ ! -f "gradlew" ]; then
    echo "[-] gradlew not found in android/android-template"
    exit 1
fi

# Build the APK
echo "[*] Running gradle build (this may take a few minutes)..."
chmod +x gradlew
./gradlew clean assembleDebug
if [ $? -ne 0 ]; then
    echo "[-] Gradle build failed"
    exit 1
fi

# Check if APK was created
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo "[+] APK built successfully!"
    
    # Copy to Desktop
    echo "[*] Copying APK to Desktop..."
    cp "app/build/outputs/apk/debug/app-debug.apk" "$HOME/Desktop/app-debug.apk"
    echo "[+] APK copied to: $HOME/Desktop/app-debug.apk"
    echo ""
    echo "====================================="
    echo "   Build Complete!"
    echo "====================================="
    echo ""
    echo "Next step: Install the APK on your Android device using O+ Connect or ADB"
else
    echo "[-] APK file not found after build"
    exit 1
fi
