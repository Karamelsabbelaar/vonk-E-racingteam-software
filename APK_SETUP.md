# KartPit - APK Setupgids (Nederlands)

[Choose English] (APK_SETUP_EN.md)

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

3. **Android SDK & Android Studio**
   - Download Android Studio: https://developer.android.com/studio
   - Installeer SDK API Level 33+ (Android Studio doet dit automatisch)
   - Na installatie: Stel ANDROID_HOME omgevingsvariabele in:
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

4. **Git** (voor versiebeheer)
   - Download van: https://git-scm.com/

## Stap 1: Installeer Dependencies

```bash
npm install --legacy-peer-deps
```

Dit installeert:
- Capacitor CLI, Core en Android (v8.2.0 of nieuwer)
- Local Notifications plugin met volledige compatibiliteit
- Alle andere afhankelijkheden

**Opmerking:** `--legacy-peer-deps` is nodig om versieconflicten tussen Capacitor-pakketten op te lossen.

## Stap 2: Initialiseer Capacitor

Indien nog niet gedaan:

```bash
npx cap init
```

Dit creëert het `capacitor.config.json` bestand met je app-configuratie.

## Stap 3: Voeg Android Platform Toe

**BELANGRIJK: Doe dit VOOR je npx cap sync draait!**

```bash
npx cap add android
```

Dit genereert het Android-project in de `android/` map met alle benodigde bestanden.

## Stap 4: Bereid Webbestanden voor

Je webbestanden staan al in de `html/` map en worden in de APK verpakt.

## Stap 5: Synchroniseer Capacitor

```bash
npx cap sync
```

Dit synchroniseert je webbestanden met het Android-project.

## Stap 6: Bouw APK

### Optie A: Debug APK (Voor testen) - AANBEVOLEN VOOR EERSTE BUILD

De debug APK is automatisch ondertekend en direct installeerbaar:

```bash
cd android
./gradlew assembleDebug
cd ..
```

De ondertekende APK staat op: `android/app/build/outputs/apk/debug/app-debug.apk`

### Optie B: Release APK (Voor productie)

```bash
cd android
./gradlew assembleRelease
cd ..
```

De unsigned APK staat op: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

**Opmerking:** De release APK moet ondertekend worden voordat deze op Google Play kan worden gepubliceerd.

### Optie C: Android Studio gebruiken

```bash
npx cap open android
```

Dit opent Android Studio met je project. Vervolgens:
1. Ga naar **Build** → **Generate App Bundles or APKs**
2. Selecteer **Build APK(s)**
3. Kies **debug** of **release** variant
4. Wacht tot de build compleet is

## Stap 7: Installeer APK op Apparaat

Zet de APK over op je Android-apparaat (gebruik de debug APK voor testen):

```bash
# Debug APK (goed ondertekend voor testen)
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Of release APK (moet eerst ondertekend zijn)
adb install android/app/release/app-release.apk
```

Or zet het handmatig over en installeer op het apparaat.

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
└── android/                     # Android build output
```

## Probleemoplossing

### "SDK location not found" of "ANDROID_HOME is niet ingesteld"

Dit treedt op wanneer Gradle het Android SDK niet kan vinden. Zorg dat ANDROID_HOME is ingesteld:

```bash
# Windows (PowerShell)
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
[Environment]::SetEnvironmentVariable('ANDROID_HOME', $env:ANDROID_HOME, [EnvironmentVariableTarget]::User)

# Mac/Linux
export ANDROID_HOME=~/Library/Android/sdk
echo 'export ANDROID_HOME=~/Library/Android/sdk' >> ~/.bashrc
source ~/.bashrc
```

Verifieer met:
```bash
echo $env:ANDROID_HOME
```

### "Cannot read properties of undefined (reading 'extract')" - OPGELOST

Dit werd veroorzaakt door versieconflicten in Capacitor-pakketten. **Oplossing:**

De huidige setup gebruikt Capacitor 8.2.0+ met `npm install --legacy-peer-deps`, wat dit probleem volledig oplost. Dit is standard in de huidige repository.

### "JAVA_HOME is niet ingesteld"

```bash
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-11

# Mac/Linux
export JAVA_HOME=/usr/libexec/java_home
```

### Gradle-fout: "Task not found"

Dit duidt op een onvolledig Android-project. Zorg dat `npx cap add android` succesvol is voltooid en geen fouten getoond heeft.

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
