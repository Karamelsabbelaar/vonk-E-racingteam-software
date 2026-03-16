# 🏁 KartPit - Setup Handleiding

[🇳🇱 Nederlands](README.md) | [🇬🇧 English](README_EN.md)

---

## Bestandsstructuur

```
kartpit/
├── index.html                  < Homepagina
├── supabase_setup.sql          < Database setup script
├── css/
│   └── style.css               < Donker racing thema
├── js/
│   ├── supabase.config.js      < Supabase sleutels + data laag
│   ├── main.js                 < Gedeelde utilities (toast, modal)
│   ├── timer.js                < Pitstop stopwatch logica
│   ├── notifications.js        < Native notifications
│   └── checklist.js            < Checklist logica
├── html/
│   ├── index.html
│   ├── pitstop.html
│   ├── agenda.html
│   ├── checklist.html
│   └── tracks.html
└── android/                    < Auto gegenereerd na setup
```

---

## Stap 1 - Supabase account aanmaken

1. Ga naar **https://supabase.com** en maak een gratis account
2. Klik op **"New Project"**
3. Kies een naam (bijv. `kartpit`) en een wachtwoord
4. Wacht tot het project klaar is (~1 minuut)

---

## Stap 2 - Database aanmaken

1. Ga in je Supabase project naar **SQL Editor** (linkermenu)
2. Klik op **"New query"**
3. Kopieer de inhoud van `supabase_setup.sql` en plak het erin
4. Klik op **"Run"**

Dit maakt alle tabellen aan én vult ze met standaard data.

---

## Stap 3 - API sleutels kopiëren

1. Ga naar **Project Settings** > **API**
2. Kopieer de **Project URL** (bijv. `https://abcxyz.supabase.co`)
3. Kopieer de **anon / public key** (de lange sleutel)
4. Open `js/supabase.config.js` en vul in:

```javascript
const SUPABASE_URL = 'https://jouw-project.supabase.co';
const SUPABASE_KEY = 'jouw-lange-anon-key-hier';
```

---

## Stap 4 - Openen in browser

Open gewoon `index.html` in je browser — geen server nodig!

**Tip:** Voor het beste resultaat gebruik je een lokale server:
- VS Code: installeer de "Live Server" extensie, rechtsklik op index.html > "Open with Live Server"
- Of: `python -m http.server 8000` in de map uitvoeren

---

## ⚡ Realtime samenwerking

Alle teamleden die de app open hebben zien **direct** wijzigingen van anderen:
- ✅ Checklist item afvinken > iedereen ziet het meteen
- ✅ Pitstop opgeslagen > verschijnt bij iedereen in de history
- ✅ Event aan agenda toevoegen > timeline update voor iedereen
- ✅ Rondtijd aangepast > live weergegeven voor het team

---

## 📋 Functies overzicht

| Pagina        | Functie                                                    |
|---------------|------------------------------------------------------------|
| **Home**      | Live statistieken, agenda preview, snelkoppelingen         |
| **Tracks**    | Circuits toevoegen/verwijderen met rondtijden en notities  |
| **Pitstop**   | Stopwatch met doeltijd, stats, team-gedeelde history       |
| **Agenda**    | Race dag schema, live gesynchroniseerd                     |
| **Checklist** | Kart + team gereedheid, realtime voor iedereen zichtbaar   |

---

## 📱 Android APK Bouw met Capacitor (Nieuw!)

Je kunt KartPit nu ook als native Android app bouwen met **push notifications** en offline ondersteuning!

### 🚀 Snelle Start

```bash
# 1. Dependencies installeren
npm install

# 2. Sync met Android
npx cap sync

# 3. Open Android Studio
npx cap open android

# 4. Build > Build APK(s)
```

### 📋 Vereisten

- Node.js 16+
- Java Development Kit (11+)
- Android Studio + SDK 33+

### 📖 Documentatie

📚 **Gedetailleerde setup handleiding**: [APK_SETUP.md](APK_SETUP.md)

Bevat:
- Stap-voor-stap instructies
- Environment setup
- Troubleshooting tips
- Notification API voorbeelden

⚡ **Snelle referentie**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

### ✨ APK Functies

✅ Volledig offline werkende app
✅ Push notifications voor pitstop events
✅ Capacitor plugins voor camera, geolocation, etc.
✅ Supabase sync wanneer internet beschikbaar is
✅ Native Android look & feel

---

## 🔔 Notificaties gebruiken

### Notificatie aanvragen bij app start

```javascript
// Toestemming aanvragen bij app load
if (Notifications.isNativeApp()) {
  Notifications.requestPermission();
}
```

### Pitstop notificatie

Wanneer een pitstop is voltooid:

```javascript
// In timer.js of je pitstop handler
await Notifications.pitstopComplete(elapsedTime, "Race 1 - Stop");
```

### Aangepaste notificaties

```javascript
// Notificatie wanneer doeltijd bereikt
await Notifications.targetTimeAchieved(elapsedTime, targetTime);

// Notificatie voor persoonlijk record
await Notifications.personalBest(elapsedTime, "Persoonlijk Record!");

// Algemene racegebeurtenissen
await Notifications.raceEvent("Race Gestart", "Kwalificatieronde");
```

---

## 🔄 Later omzetten naar mobiele app

Omdat alles puur HTML/CSS/JS is zonder server, kun je dit later eenvoudig inpakken met **Capacitor**:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap add ios
npx cap sync
npx cap open android   # opent Android Studio
npx cap open ios       # opent Xcode
```

De Supabase verbinding werkt identiek in de mobiele app.

---

## 💻 Technologie Stack

| Component      | Technologie                       |
|----------------|-----------------------------------|
| **Frontend**   | HTML5, CSS3, Vanilla JavaScript   |
| **Backend**    | Supabase (PostgreSQL) + Realtime  |
| **Native**     | Capacitor + Android SDK           |
| **Database**   | PostgreSQL via Supabase           |
| **Hosting**    | Firebase, Netlify, of eigen server|

---

## 🎯 Volgende Stappen

1. **Lees de volledige setup handleiding**: [APK_SETUP.md](APK_SETUP.md)
2. **Voer het setup script uit**: `setup.bat` (Windows) of `./setup.sh` (macOS/Linux)
3. **Volg de snelle referentie**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

**Opmerking:** Dit project kan zowel als web app als native Android app werken!

**Laatst bijgewerkt**: maart 2026  
**Status**: ✅ Gereed voor ontwikkeling
