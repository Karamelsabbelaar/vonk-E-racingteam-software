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

# Sync Capacitor (copies web assets and generates config files directly into android/app/src/main/assets)
echo "[*] Syncing Capacitor..."
npx cap sync android 2>/dev/null
if [ $? -ne 0 ]; then
    echo "[-] cap sync android failed, using manual asset copy fallback"
    mkdir -p "$SCRIPT_DIR/android/app/src/main/assets/public"
    cp -r "$SCRIPT_DIR/html/"* "$SCRIPT_DIR/android/app/src/main/assets/public/"
    echo "[+] Assets copied manually"
else
    echo "[+] cap sync complete"
fi

# Copy icons from repo into Android project
echo "[*] Copying app icons..."
ICONS_SRC="$SCRIPT_DIR/icons"
ICONS_DST="$SCRIPT_DIR/android/app/src/main/res"
if [ -d "$ICONS_SRC" ]; then
    for density in mipmap-mdpi mipmap-hdpi mipmap-xhdpi mipmap-xxhdpi mipmap-xxxhdpi mipmap-anydpi-v26; do
        if [ -d "$ICONS_SRC/$density" ]; then
            mkdir -p "$ICONS_DST/$density"
            cp -f "$ICONS_SRC/$density/"* "$ICONS_DST/$density/"
        fi
    done
    echo "[+] Icons copied"
else
    echo "[-] Warning: icons/ folder not found, using default icons"
fi

# Setup Android local properties (Android SDK path)
echo "[*] Configuring Android SDK..."
if [ ! -f "android/local.properties" ]; then
    echo "sdk.dir=$HOME/Library/Android/sdk" > "android/local.properties"
    echo "[+] Android SDK path configured"
fi

# Navigate to android/
echo "[*] Building Android APK..."
cd "$SCRIPT_DIR/android"

if [ ! -f "gradlew" ]; then
    echo "[-] gradlew not found in android/"
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
    
    # Copy to project build/ folder
    echo "[*] Copying APK to build folder..."
    mkdir -p "$SCRIPT_DIR/build"
    cp "app/build/outputs/apk/debug/app-debug.apk" "$SCRIPT_DIR/build/kartpit.apk"
    echo "[+] APK copied to: $SCRIPT_DIR/build/kartpit.apk"
    echo ""
    echo "====================================="
    echo "   Build Complete!"
    echo "====================================="
    echo ""
    echo "Next step: Install the APK on your Android device using ADB or by manually installing the APK on the device"
else
    echo "[-] APK file not found after build"
    exit 1
fi
