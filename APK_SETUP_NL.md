# KartPit - APK Setupgids (Nederlands)

[Choose English / Kies Nederlands](APK_SETUP.md) | [Kies Nederlands](APK_SETUP_NL.md)

---

## Overzicht

Deze gids helpt je om KartPit om te zetten in een native Android APK met behulp van Capacitor, met ondersteuning voor push-notificaties en native functies.

## Vereisten

Zorg ervoor dat je het volgende hebt geïnstalleerd:

1. **Node.js** (v16+)
   - Download van: https://nodejs.org/
   - Verifieer met: `node -v` en `npm -v`

2. **Java Development Kit (JDK)** (11+)
   - Download van: https://www.oracle.com/java/technologies/downloads/
   - Stel JAVA_HOME omgevingsvariabele in

3. **Android SDK**
   - Download Android Studio: https://developer.android.com/studio
   - Installeer SDK API Level 33+
   - Stel ANDROID_SDK_ROOT omgevingsvariabele in

4. **Git** (voor versiebeheer)
   - Download van: https://git-scm.com/

## Stap 1: Installeer Dependencies

```bash
npm install
```

Dit installeert:
- Capacitor CLI en Core
- Capacitor Android platform
- Local Notifications plugin

## Stap 2: Initialiseer Capacitor

Indien nog niet gedaan:

```bash
npx cap init
```

Dit creëert het `capacitor.config.json` bestand met je app-configuratie.

## Stap 3: Bouw voor Web

Zorg ervoor dat je Flask backend draait of bereidt static files voor:

```bash
python app.py
```

Of als je de HTML direct wilt serveren, kopieer je `html/` map naar een webserver.

## Stap 4: Synchroniseer Capacitor

```bash
npx cap sync
```

Dit synchroniseert je webbestanden met het Android-project.

## Stap 5: Bouw APK

### Optie A: Android Studio gebruiken (Aanbevolen voor beginners)

```bash
npx cap open android
```

Dit opent Android Studio met je project. Vervolgens:
1. Klik op **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wacht tot de build compleet is
3. De APK staat in: `android/app/release/app-release.apk`

### Optie B: Opdrachtlijn gebruiken

```bash
cd android
./gradlew assembleRelease
cd ..
```

De APK staat op: `android/app/release/app-release.apk`

## Stap 6: Installeer APK op Apparaat

Zet de APK over op je Android-apparaat:

```bash
adb install android/app/release/app-release.apk
```

Of zet het handmatig over en installeer op het apparaat.

## Notificaties gebruiken

### Rechten aanvragen (bij app-start)

Voeg dit toe aan je HTML of JavaScript:

```javascript
// Vraag notificatierechten aan bij app-laden
if (Notifications.isNativeApp()) {
  Notifications.requestPermission();
}
```

### Pitstop Notificatie sturen

Wanneer een pitstop voltooid is:

```javascript
// In timer.js of je pitstop-handler
await Notifications.pitstopComplete(elapsedTime, "Race 1 - Stop");
```

### Aangepaste Notificaties sturen

```javascript
// Meldingen wanneer doeltijd bereikt
await Notifications.targetTimeAchieved(elapsedTime, targetTime);

// Melding voor persoonlijk record
await Notifications.personalBest(elapsedTime, "Persoonlijk Record!");

// Algemene racegebeurtenissen
await Notifications.raceEvent("Race Gestart", "Kwalificatieronde");
```

## Bestandsstructuur

```
KartPit-Vonk-Racing-Software/
├── package.json                 # npm configuratie
├── capacitor.config.json        # Capacitor configuratie
├── android/                     # Android project (auto-gegenereerd)
│   └── app/
│       └── release/
│           └── app-release.apk # Je uiteindelijke APK
├── html/                        # Web-bestanden
│   └── pitstop.html
├── js/
│   ├── timer.js
│   ├── notifications.js         # Notificatie-afhandeling
│   └── main.js
├── css/
│   └── style.css
└── app.py                       # Flask backend
```

## Probleemoplossing

### "JAVA_HOME is niet ingesteld"

```bash
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-11

# Mac/Linux
export JAVA_HOME=/usr/libexec/java_home
```

### "Android SDK niet gevonden"

```bash
# Windows
set ANDROID_SDK_ROOT=C:\Users\[Gebruikersnaam]\AppData\Local\Android\Sdk

# Mac/Linux
export ANDROID_SDK_ROOT=~/Library/Android/sdk
```

### APK-installatie mislukt

- Controleer of je apparaat "Onbekende bronnen" heeft ingeschakeld (Instellingen → Beveiliging)
- Verwijder eerst de vorige versie
- Zorg ervoor dat je APK correct is ondertekend

### Notificaties Werken Niet

- Vraag eerst rechten aan: `Notifications.requestPermission()`
- Controleer Android-notificatie-instellingen voor je app
- Zorg ervoor dat je op API 31+ zit voor recente Android-versies

## Workflow voor Ontwikkeling

Voor ontwikkeling en testen:

```bash
# Maak wijzigingen aan HTML/JS/CSS
# Synchroniseer dan met Android:
npx cap sync

# Open in Android Studio:
npx cap open android

# Bouw en voer uit op apparaat
# Of gebruik de Run-knop van Android Studio
```

## Release Build

Voor productierelease:

1. Onderteken je APK met een keystore
2. Obfusceer code met R8/ProGuard
3. Test grondig op meerdere apparaten
4. Overweeg publiceren op Google Play Store

```bash
# Genereer keystore (eenmalig)
keytool -genkey -v -keystore kartpit-release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias kartpit

# Configureer ondertekening in android/app/build.gradle
# Bouw vervolgens:
cd android
./gradlew bundleRelease
```

## Aanvullende Bronnen

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Development**: https://developer.android.com/docs
- **Local Notifications**: https://capacitorjs.com/docs/apis/local-notifications
- **Google Play Store**: https://play.google.com/console

## Ondersteuning

Voor problemen of vragen:
- Controleer Capacitor-documentatie
- Bekijk Android-logboeken: `adb logcat`
- Test op werkelijk apparaat (niet alleen emulator)

---

**Laatst Bijgewerkt**: maart 2026  
**Capacitor Versie**: 6.1.0+
