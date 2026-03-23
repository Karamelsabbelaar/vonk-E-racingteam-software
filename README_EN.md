# 🏁 KartPit - Setup Guide

[🇳🇱 Nederlands](README.md)

---

## Step 1 - Create a Supabase account

1. Go to **https://supabase.com** and create a free account
2. Click **"New Project"**
3. Pick a name (e.g. `kartpit`) and a password
4. Wait for the project to be ready (~1 minute)

---

## Step 2 - Set up the database

1. In your Supabase project, go to **SQL Editor** (left menu)
2. Click **"New query"**
3. Copy the contents of `supabase_setup.sql` and paste it in
4. Click **"Run"**

---

## Step 3 - Copy API keys

1. Go to **Project Settings** > **API**
2. Copy the **Project URL** and the **anon / public key**
3. Fill these in at `js/supabase.config.js`

---

## Step 4 - Open in browser

Open `index.html` in your browser. For best results use a local server via the "Live Server" extension in VS Code.

---

## 📋 Features

| Page          | Function                                                   |
|---------------|------------------------------------------------------------|
| **Home**      | Live stats, agenda preview, quick links                    |
| **Tracks**    | Add/remove circuits with lap times and notes               |
| **Pitstop**   | Stopwatch with target time, stats, team-shared history     |
| **Agenda**    | Race day schedule, live synced                             |
| **Checklist** | Kart + team readiness, visible in realtime for everyone    |

---

## 📱 Building the Android APK

KartPit can be built as a native Android app with local notifications and offline support.

**Windows:** run `build-apk.cmd`  
**Linux / macOS:** run `bash build-apk.sh`

The script handles everything automatically and copies the APK to your desktop.

### Requirements

- Node.js 18+
- Java Development Kit (21+)
- Android Studio + Android SDK 35+

### Next steps

1. Install the requirements above
2. Run the build script
3. Or open manually in Android Studio with `npx cap open android`
