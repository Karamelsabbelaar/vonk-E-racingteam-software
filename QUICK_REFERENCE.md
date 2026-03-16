# 🏁 KartPit Capacitor - Snelle Referentie

## ⚙️ Initiële Setup

```bash
# Windows
setup.bat

# macOS/Linux
./setup.sh

# Handmatig
npm install
```

## 📱 APK Bouwen

```bash
# Synchroniseer webbestanden met Android-project
npx cap sync

# Open in Android Studio
npx cap open android

# In Android Studio: Build > Build APK(s)
```

## 🔄 Ontwikkelings Workflow

```bash
# Maak wijzigingen aan HTML/JS/CSS bestanden
# Nu synchroniseren:
npx cap sync

# En hercompileer in Android Studio
```

## 🧪 Testen op Apparaat

```bash
# Verbind apparaat via USB (USB Debugging ingeschakeld)
# Deploy APK:
adb install android/app/release/app-release.apk

# Of sleep release APK naar apparaat en installeer
```

## 🔔 Meldingen gebruiken

```javascript
// Toestemming aanvragen (bij app start)
Notifications.requestPermission();

// Pitstop voltooid
Notifications.pitstopComplete(5230, "Race 1");

// Doeltijd bereikt
Notifications.targetTimeAchieved(7890, 8000);

// Persoonlijk record
Notifications.personalBest(5000);

// Race-evenement
Notifications.raceEvent("Race Gestart", "Kwalificatie");

// Aangepaste melding
Notifications.sendNotification({
  title: "Test",
  body: "Bericht",
  sound: true
});
```

## 🐛 Foutopsporing

```bash
# Android-logboeken weergeven
adb logcat

# Zie Capacitor-logboeken
adb logcat | grep Capacitor

# App-gegevens op apparaat wissen
adb shell pm clear com.vonkracing.kartpit

# App verwijderen
adb uninstall com.vonkracing.kartpit
```

## 📂 Bestandslocaties Na Bouw

```
android/
├── app/
│   ├── debug/
│   │   └── app-debug.apk          < Voor testen
│   └── release/
│       └── app-release.apk        < Voor distributie
```

## Environment Setup (if needed)

```bash
# Windows - Set Java path
set JAVA_HOME=C:\Program Files\Java\jdk-11

# Windows - Set Android SDK path
set ANDROID_SDK_ROOT=C:\Users\[Username]\AppData\Local\Android\Sdk

# macOS/Linux - Set Java path
export JAVA_HOME=$(/usr/libexec/java_home)

# macOS/Linux - Set Android SDK path
export ANDROID_SDK_ROOT=~/Library/Android/sdk
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "JAVA_HOME not set" | Set environment variable (see above) |
| "SDK not found" | Set ANDROID_SDK_ROOT variable |
| "APK won't install" | Enable "Unknown Sources" in phone settings |
| "Notifications not working" | Call `Notifications.requestPermission()` first |
| "App crashes on start" | Check `adb logcat` for errors |

## Resources

- **Full Setup Guide**: [APK_SETUP.md](APK_SETUP.md)
- **Setup Summary**: [CAPACITOR_SETUP_SUMMARY.md](CAPACITOR_SETUP_SUMMARY.md)
- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Docs**: https://developer.android.com/docs

## Key Files

| File | Purpose |
|------|---------|
| `package.json` | npm dependencies |
| `capacitor.config.json` | App configuration |
| `js/notifications.js` | Notification API |
| `android/` | Android project (generated) |

---

**Quick Start**: Run `setup.bat` (Windows) or `./setup.sh` (macOS/Linux)
