# KartPit - APK Setup Guide

---

## Overview
This guide will help you transform KartPit into a native Android APK using Capacitor, with support for push notifications and native features.

## Prerequisites

Before you start, make sure you have installed:

1. **Node.js** (v16+)
   - Download from: https://nodejs.org/
   - Verify: `node -v` and `npm -v`

2. **Java Development Kit (JDK)** (11+)
   - Download from: https://www.oracle.com/java/technologies/downloads/
   - Set JAVA_HOME environment variable

3. **Android SDK & Android Studio**
   - Download Android Studio: https://developer.android.com/studio
   - Install SDK API Level 33+ (Android Studio does this automatically)
   - After installation: Set ANDROID_HOME environment variable:
     ```bash
     # Windows (PowerShell)
     $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
     [Environment]::SetEnvironmentVariable('ANDROID_HOME', $env:ANDROID_HOME, [EnvironmentVariableTarget]::User)
     ```
     ```bash
     # Mac/Linux
     export ANDROID_HOME=~/Library/Android/sdk
     echo 'export ANDROID_HOME=~/Library/Android/sdk' >> ~/.bashrc
     ```

4. **Git** (for version control)
   - Download from: https://git-scm.com/

## Step 1: Install Dependencies

```bash
npm install --legacy-peer-deps
```

This installs:
- Capacitor CLI, Core and Android (v8.2.0 or newer)
- Local Notifications plugin with full compatibility
- All other dependencies

**Note:** `--legacy-peer-deps` is needed to resolve version conflicts between Capacitor packages.

## Step 2: Initialize Capacitor

If not already done:

```bash
npx cap init
```

This creates the `capacitor.config.json` file with your app configuration.

## Step 3: Add Android Platform

**IMPORTANT: Do this BEFORE running npx cap sync!**

```bash
npx cap add android
```

This generates the Android project in the `android/` folder with all necessary files.

## Step 4: Prepare Web Files

Your web files are already in the `html/` folder and will be packaged into the APK.

## Step 5: Sync Capacitor

```bash
npx cap sync
```

This syncs your web files to the Android project.

## Step 6: Build APK

### Option A: Debug APK (For testing) - RECOMMENDED FOR FIRST BUILD

The debug APK is automatically signed and ready to install:

```bash
cd android
./gradlew assembleDebug
cd ..
```

The signed APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Option B: Release APK (For production)

```bash
cd android
./gradlew assembleRelease
cd ..
```

The unsigned APK will be at: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

**Note:** The release APK must be signed before it can be published on Google Play.

### Option C: Using Android Studio

```bash
npx cap open android
```

This opens Android Studio with your project. Then:
1. Go to **Build** → **Generate App Bundles or APKs**
2. Select **Build APK(s)**
3. Choose **debug** or **release** variant
4. Wait for build to complete

## Step 7: Install APK on Device

Transfer the APK to your Android device (use the debug APK for testing):

```bash
# Debug APK (properly signed for testing)
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or release APK (must be signed first)
adb install android/app/release/app-release.apk
```

Or transfer it manually and install on the device.

Or manually transfer and install on the device.

## Using Notifications

### Request Permission (on app start)

Add this to your HTML or JavaScript:

```javascript
// Request notification permission on app load
if (Notifications.isNativeApp()) {
  Notifications.requestPermission();
}
```

### Send Pitstop Notification

When a pitstop is completed:

```javascript
// In timer.js or your pitstop handler
await Notifications.pitstopComplete(elapsedTime, "Race 1 - Stop");
```

### Send Custom Notifications

```javascript
// Notify when target time is achieved
await Notifications.targetTimeAchieved(elapsedTime, targetTime);

// Notify for personal best
await Notifications.personalBest(elapsedTime, "Personal Best!");

// General race events
await Notifications.raceEvent("Race Started", "Qualifying round");
```

## File Structure

```
KartPit-Vonk-Racing-Software/
├── package.json                 # npm configuration
├── capacitor.config.json        # Capacitor configuration
├── android/                     # Android project (auto-generated)
│   └── app/
│       └── release/
│           └── app-release.apk # Your final APK
├── html/                        # Web files
│   └── pitstop.html
├── js/
│   ├── timer.js
│   ├── notifications.js         # Notification handler
│   └── main.js
├── css/
│   └── style.css
└── android/                     # Android build output
```

## Troubleshooting

### "Cannot read properties of undefined (reading 'extract')"

This usually happens when running `npx cap add android`. Solution:

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install

# Try again
npx cap add android
```

### "JAVA_HOME is not set"
```bash
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-11

# Mac/Linux
export JAVA_HOME=/usr/libexec/java_home
```

### "Android SDK not found"
```bash
# Windows
set ANDROID_SDK_ROOT=C:\Users\[Username]\AppData\Local\Android\Sdk

# Mac/Linux
export ANDROID_SDK_ROOT=~/Library/Android/sdk
```

### APK Installation Fails
- Check if your device has "Unknown Sources" enabled (Settings → Security)
- Uninstall previous version first
- Make sure APK is signed properly

### Notifications Not Working
- Request permission first: `Notifications.requestPermission()`
- Check Android notification settings for your app
- Ensure you're on API 31+ for recent Android versions

## Development Workflow

For development and testing:

```bash
# Make changes to HTML/JS/CSS
# Then sync to Android:
npx cap sync

# Open in Android Studio:
npx cap open android

# Build and run on device
# Or use Android Studio's Run button
```

## Release Build

For production release:

1. Sign your APK with a keystore
2. Obfuscate code with R8/ProGuard
3. Test thoroughly on multiple devices
4. Consider publishing to Google Play Store

```bash
# Generate keystore (one time)
keytool -genkey -v -keystore kartpit-release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias kartpit

# Configure signing in android/app/build.gradle
# Then build:
cd android
./gradlew bundleRelease
```

## Additional Resources

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Development**: https://developer.android.com/docs
- **Local Notifications**: https://capacitorjs.com/docs/apis/local-notifications
- **Google Play Store**: https://play.google.com/console

## Support

For issues or questions:
- Check Capacitor documentation
- Review Android logs: `adb logcat`
- Test on actual device (not just emulator)

---

**Last Updated**: March 2026
**Capacitor Version**: 6.1.0+
