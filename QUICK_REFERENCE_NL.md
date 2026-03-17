# 🏁 KartPit Capacitor - Snelle Referentie (Nederlands)

[Choose English / Kies Nederlands](QUICK_REFERENCE.md) | [Kies Nederlands](QUICK_REFERENCE_NL.md)

---

## Eerste Setup

```bash
# Windows
setup.bat

# macOS/Linux
./setup.sh

# Handmatig
npm install
```

## APK Bouwen

```bash
# Synchroniseer webbestanden met Android project
npx cap sync

# Open in Android Studio
npx cap open android

# In Android Studio: Build → Build APK(s)
```

## Ontwikkelings Workflow

```bash
# Maak wijzigingen aan HTML/JS/CSS bestanden
# Synchroniseer vervolgens:
npx cap sync

# En herbouw in Android Studio
```

## Testen op Apparaat

```bash
# Verbind apparaat via USB (USB Debugging ingeschakeld)
# Deploy vervolgens APK:
adb install android/app/release/app-release.apk

# Of sleep release APK naar apparaat en installeer
```

## Notificaties Gebruiken

```javascript
// Vraag rechten aan (bij app-start)
Notifications.requestPermission();

// Pitstop voltooid
Notifications.pitstopComplete(5230, "Race 1");

// Doeltijd bereikt
Notifications.targetTimeAchieved(7890, 8000);

// Persoonlijk record
Notifications.personalBest(5000);

// Racegebeurtenis
Notifications.raceEvent("Race Gestart", "Kwalificatie");

// Aangepaste notificatie
Notifications.sendNotification({
  title: "Test",
  body: "Bericht",
  sound: true
});
```

## Debugging

```bash
# Bekijk Android-logboeken
adb logcat

# Zie Capacitor-logboeken
adb logcat | grep Capacitor

# Wis app-gegevens op apparaat
adb shell pm clear com.vonkracing.kartpit

# Verwijder app
adb uninstall com.vonkracing.kartpit
```

## Bestandslocaties na Build

```
android/
├── app/
│   ├── debug/
│   │   └── app-debug.apk          ← Voor testen
│   └── release/
│       └── app-release.apk        ← Voor distributie
```

## Omgeving Setup (indien nodig)

```bash
# Windows - Stel Java-pad in
set JAVA_HOME=C:\Program Files\Java\jdk-11

# Windows - Stel Android SDK-pad in
set ANDROID_SDK_ROOT=C:\Users\[Gebruikersnaam]\AppData\Local\Android\Sdk

# macOS/Linux - Stel Java-pad in
export JAVA_HOME=$(/usr/libexec/java_home)

# macOS/Linux - Stel Android SDK-pad in
export ANDROID_SDK_ROOT=~/Library/Android/sdk
```

## Probleemoplossing

| Probleem | Oplossing |
|----------|-----------|
| "JAVA_HOME niet ingesteld" | Stel omgevingsvariabele in (zie boven) |
| "SDK niet gevonden" | Stel ANDROID_SDK_ROOT variabele in |
| "APK wil niet installeren" | Schakel "Onbekende bronnen" in op telefoon |
| "Notificaties werken niet" | Bel eerst `Notifications.requestPermission()` |
| "App crasht bij start" | Controleer `adb logcat` op fouten |

## Bronnen

- **Volledige Setup Gids**: [APK_SETUP_NL.md](APK_SETUP_NL.md)
- **Setup Samenvatting**: [CAPACITOR_SETUP_SUMMARY.md](CAPACITOR_SETUP_SUMMARY.md)
- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Docs**: https://developer.android.com/docs

## Belangrijkste Bestanden

| Bestand | Doel |
|---------|------|
| `package.json` | npm afhankelijkheden |
| `capacitor.config.json` | App-configuratie |
| `js/notifications.js` | Notificatie-API |
| `android/` | Android-project (gegenereerd) |

---

**Snelle Start**: Voer `setup.bat` uit (Windows) of `./setup.sh` (macOS/Linux)
