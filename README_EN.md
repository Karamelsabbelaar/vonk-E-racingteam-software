# 🏁 KartPit — Setup Guide (English)

[Choose English](README_EN.md)

---

## File Structure

```
kartpit/
├── index.html                  ← Homepage
├── supabase_setup.sql          ← Database setup script
├── css/
│   └── style.css               ← Dark racing theme
├── js/
│   ├── supabase.config.js      ← 🔑 Your Supabase keys + data layer
│   ├── main.js                 ← Shared utilities (toast, modal)
│   ├── timer.js                ← Pitstop stopwatch logic
│   ├── notifications.js        ← Native notifications
│   └── checklist.js            ← Checklist logic
├── html/
│   ├── index.html
│   ├── pitstop.html
│   ├── agenda.html
│   ├── checklist.html
│   └── tracks.html
└── android/                    ← Auto-generated after setup
```

---

## Step 1 — Create Supabase Account

1. Go to **https://supabase.com** and create a free account
2. Click on **"New Project"**
3. Choose a name (e.g., `kartpit`) and password
4. Wait for the project to be ready (~1 minute)

---

## Step 2 — Create Database

1. In your Supabase project, go to **SQL Editor** (left menu)
2. Click on **"New query"**
3. Copy the contents of `supabase_setup.sql` and paste it
4. Click on **"Run"**

This creates all tables and fills them with default data.

---

## Step 3 — Copy API Keys

1. Go to **Project Settings** → **API**
2. Copy the **Project URL** (e.g., `https://abcxyz.supabase.co`)
3. Copy the **anon / public key** (the long key)
4. Open `js/supabase.config.js` and fill in:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-long-anon-key-here';
```

---

## Step 4 — Open in Browser

Simply open `index.html` in your browser — no server needed!

> 💡 **Tip:** Use a local server for best results:
> - VS Code: Install the "Live Server" extension, right-click index.html → "Open with Live Server"
> - Or: Run `python -m http.server 8000` in the folder

---

## Real-Time Collaboration

All team members who have the app open see **immediate** changes from others:
- ✅ Check off checklist item → everyone sees it instantly
- ✅ Save pitstop → appears in everyone's history
- ✅ Add event to agenda → timeline updates for team
- ✅ Update lap time → displayed live for the team

---

## Features Overview

| Page        | Function                                               |
|-------------|--------------------------------------------------------|
| **Home**    | Live statistics, agenda preview, quick links          |
| **Tracks**  | Add/remove circuits with lap times and notes          |
| **Pitstop** | Stopwatch with target time, stats, team-shared history|
| **Agenda**  | Race day schedule, live synchronized                  |
| **Checklist**| Kart + team readiness, real-time for everyone visible |

---

## 📱 Build Android APK with Capacitor (New!)

You can now build KartPit as a native Android app with **push notifications** and offline support!

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Sync with Android
npx cap sync

# 3. Open Android Studio
npx cap open android

# 4. Build → Build APK(s)
```

### Requirements

- Node.js 16+
- Java Development Kit (11+)
- Android Studio + SDK 33+

### Documentation

📖 **Detailed setup guide**: [APK_SETUP.md](APK_SETUP.md)

Includes:
- Step-by-step instructions
- Environment setup
- Troubleshooting tips
- Notification API examples

⚡ **Quick reference**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

### Features in APK

✅ Fully offline-capable app  
✅ Push notifications for pitstop events  
✅ Capacitor plugins for camera, geolocation, etc.  
✅ Supabase sync when internet available  
✅ Native Android look & feel  

---

## Using Notifications

### Request Permission on App Start

```javascript
// Request notification permission on app load
if (Notifications.isNativeApp()) {
  Notifications.requestPermission();
}
```

### Pitstop Notification

When a pitstop is completed:

```javascript
// In timer.js or your pitstop handler
await Notifications.pitstopComplete(elapsedTime, "Race 1 - Stop");
```

### Custom Notifications

```javascript
// Notify when target time achieved
await Notifications.targetTimeAchieved(elapsedTime, targetTime);

// Notify for personal best
await Notifications.personalBest(elapsedTime, "Personal Best!");

// General race events
await Notifications.raceEvent("Race Started", "Qualifying round");
```

---

## Converting to Mobile App Later

Since everything is pure HTML/CSS/JS without a server, you can easily package this with **Capacitor**:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap add ios
npx cap sync
npx cap open android   # opens Android Studio
npx cap open ios       # opens Xcode
```

The Supabase connection works identically in the mobile app.

---

## Technology Stack

| Component  | Technology                      |
|------------|---------------------------------|
| **Frontend**| HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Supabase (PostgreSQL) + Realtime|
| **Native** | Capacitor + Android SDK         |
| **Database**| PostgreSQL via Supabase         |
| **Hosting** | Firebase, Netlify, or self-hosted|

---

## Next Steps

1. **Read the full setup guide**: [APK_SETUP.md](APK_SETUP.md)
2. **Run the setup script**: `setup.bat` (Windows) or `./setup.sh` (macOS/Linux)
3. **Follow the quick reference**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

Note: This project works both as a web app and as a native Android app!

**Last Updated**: March 2026  
**Status**: ✅ Ready for development
