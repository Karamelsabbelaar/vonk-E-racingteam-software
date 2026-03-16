# ✅ KartPit Capacitor Setup - Bestanden Gemaakt/Gewijzigd

## 📝 Nieuwe Bestanden Gemaakt

### 1. **package.json**
- npm configuratiebestand
- Bevat alle Capacitor-afhankelijkheden
- Inclusief npm scripts voor bouwen

### 2. **capacitor.config.json**
- Capacitor platformconfiguratie
- App ID: `com.vonkracing.kartpit`
- Geconfigureerd voor Android met meldingsondersteuning

### 3. **js/notifications.js**
- Native meldingshandler voor Android
- Functies voor:
  - Pitstop-vervolledigingsmeldingen
  - Doeltijd bereikt meldingen
  - Persoonlijk record waarschuwingen
  - Algemene race-evenementen
- Werkt naadloos op web (stil) en native (met geluiden)

### 4. **APK_SETUP.md**
- Volledige stap-voor-stap gids voor APK-bouw
- Lijst met vereisten en downloadlinks
- Probleemoplossingssectie
- Environment variabele setup
- Release bouw instructies

### 5. **setup.sh** (macOS/Linux)
- Geautomatiseerd setupscript voor Unix-systemen
- Controleert Node.js en npm
- Installeert afhankelijkheden
- Initialiseert Capacitor

### 6. **setup.bat (Windows)**
- Geautomatiseerd setupscript voor Windows
- Controleert Node.js en npm
- Installeert afhankelijkheden
- Initialiseert Capacitor

### 7. **.gitignore** (Bijgewerkt)
- Sluit node_modules, buildbestanden en Android-projecten uit
- Voorkomt committen van grote binaire bestanden

## ✏️ Gewijzigde Bestanden

### **html/pitstop.html**
- Toegevoegde Capacitor Core script tag
- Toegevoegde notifications.js import
- Ondersteunt nu native meldingen bij uitvoering op Android

### **README.md**
- Toegevoegde nieuwe sectie voor Capacitor/APK setup
- Bijgewerkte technology stack tabel
- Toegevoegde links naar gedetailleerde documentatie

## 🚀 Snelle Start Commando's

```bash
# Windows
setup.bat

# macOS/Linux
chmod +x setup.sh
./setup.sh

# Handmatige setup
npm install
npx cap sync
npx cap open android
```

## 📂 Bestandsstructuur

```
KartPit-Vonk-Racing-Software/
├── 📄 package.json                    [NIEUW] npm configuratie
├── 📄 capacitor.config.json           [NIEUW] Capacitor configuratie
├── 📄 APK_SETUP.md                    [NIEUW] Gedetailleerde gids
├── 🔧 setup.sh                        [NIEUW] Setup script (Unix)
├── 🔧 setup.bat                       [NIEUW] Setup script (Windows)
├── 📋 README.md                       [BIJGEWERKT] APK sectie toegevoegd
├── 🚫 .gitignore                      [BIJGEWERKT] Bouwbestanden toegevoegd
├── js/
│   └── 📄 notifications.js            [NIEUW] Native meldingen
├── html/
│   └── 📄 pitstop.html                [BIJGEWERKT] Scripts toegevoegd
└── ...
```

## 📋 Volgende Stappen

1. **Run setup script:**
   - Windows: Dubbelklik op `setup.bat`
   - macOS/Linux: Voer `./setup.sh` uit

2. **Sync met Android:**
   ```bash
   npx cap sync
   ```

3. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

4. **Build APK:**
   - In Android Studio: Build → Build APK(s)

5. **For detailed help:**
   - Read [APK_SETUP.md](APK_SETUP.md)

## Using Notifications in Your Code

```javascript
// When pitstop is saved
await Notifications.pitstopComplete(elapsedTime, "Race 1");

// When target time is achieved
await Notifications.targetTimeAchieved(elapsedTime, targetTime);

// For personal bests
await Notifications.personalBest(bestTime);

// Custom race events
await Notifications.raceEvent("Qualifying Finished", "Next: Race 1");
```

## Testing on Device

1. Connect Android phone via USB
2. Enable Developer Mode (Settings → About → tap Build Number 7x)
3. Enable USB Debugging
4. Run: `adb install android/app/release/app-release.apk`

## Support

- Capacitor Docs: https://capacitorjs.com/docs
- Android Setup: https://developer.android.com/docs
- Issues? Check [APK_SETUP.md](APK_SETUP.md) Troubleshooting section

---
**Setup Date**: March 16, 2026  
**Capacitor Version**: 6.1.0+  
**Status**: ✅ Ready to build APK
