# 🏁 KartPit - Setup Handleiding

[🇬🇧 English](README_EN.md)

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

---

## Stap 3 - API sleutels kopiëren

1. Ga naar **Project Settings** > **API**
2. Kopieer de **Project URL** en de **anon / public key**
3. Vul deze in `js/supabase.config.js`

---

## Stap 4 - Openen in browser

Open `index.html` in je browser. Voor het beste resultaat gebruik je een lokale server via de "Live Server" extensie in VS Code.

---

## 📋 Functies

| Pagina        | Functie                                                    |
|---------------|------------------------------------------------------------|
| **Home**      | Live statistieken, agenda preview, snelkoppelingen         |
| **Tracks**    | Circuits toevoegen/verwijderen met rondtijden en notities  |
| **Pitstop**   | Stopwatch met doeltijd, stats, team-gedeelde history       |
| **Agenda**    | Race dag schema, live gesynchroniseerd                     |
| **Checklist** | Kart + team gereedheid, realtime voor iedereen zichtbaar   |

---

## 📱 Android APK bouwen

KartPit kan als native Android app gebouwd worden met lokale notificaties en offline ondersteuning.

**Windows:** voer `build-apk.cmd` uit  
**Linux / macOS:** voer `bash build-apk.sh` uit

Het script regelt alles automatisch en kopieert de APK naar je bureaublad.

### Vereisten

- Node.js 18+
- Java Development Kit (21+)
- Android Studio + Android SDK 35+

### Volgende stappen

1. Installeer de vereisten hierboven
2. Voer het build script uit | Of open handmatig in Android Studio met `npx cap open android`
