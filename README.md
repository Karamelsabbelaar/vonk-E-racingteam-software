# 🏁 KartPit — Setup Handleiding

## Bestandsstructuur

```
kartpit/
├── index.html                  ← Homepagina
├── supabase_setup.sql          ← Database setup script
├── css/
│   └── style.css               ← Donker racing thema
├── js/
│   ├── supabase.config.js      ← 🔑 Jouw Supabase sleutels + data laag
│   ├── main.js                 ← Gedeelde utilities (toast, modal)
│   ├── timer.js                ← Pitstop stopwatch logica
│   └── checklist.js            ← Checklist logica
└── pages/
    ├── tracks.html
    ├── pitstop.html
    ├── agenda.html
    └── checklist.html
```

---

## Stap 1 — Supabase account aanmaken

1. Ga naar **https://supabase.com** en maak een gratis account
2. Klik op **"New Project"**
3. Kies een naam (bijv. `kartpit`) en een wachtwoord
4. Wacht tot het project klaar is (~1 minuut)

---

## Stap 2 — Database aanmaken

1. Ga in je Supabase project naar **SQL Editor** (linkermenu)
2. Klik op **"New query"**
3. Kopieer de inhoud van `supabase_setup.sql` en plak het erin
4. Klik op **"Run"**

Dit maakt alle tabellen aan én vult ze met standaard data.

---

## Stap 3 — API sleutels kopiëren

1. Ga naar **Project Settings** → **API**
2. Kopieer de **Project URL** (bijv. `https://abcxyz.supabase.co`)
3. Kopieer de **anon / public key** (de lange sleutel)
4. Open `js/supabase.config.js` en vul in:

```javascript
const SUPABASE_URL = 'https://jouw-project.supabase.co';
const SUPABASE_KEY = 'jouw-lange-anon-key-hier';
```

---

## Stap 4 — Openen in browser

Open gewoon `index.html` in je browser — geen server nodig!

> 💡 **Tip:** Gebruik een lokale server voor het beste resultaat:
> - VS Code: installeer de "Live Server" extensie, rechtsklik op index.html → "Open with Live Server"
> - Of: `python -m http.server 8000` in de map uitvoeren

---

## Realtime samenwerking

Alle teamleden die de app open hebben zien **direct** wijzigingen van anderen:
- Checklist item afvinken → iedereen ziet het meteen
- Pitstop opgeslagen → verschijnt bij iedereen in de history
- Event aan agenda toevoegen → timeline update voor iedereen

---

## Later omzetten naar mobiele app (Android/iOS)

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

## Functies overzicht

| Pagina        | Functie                                                    |
|---------------|------------------------------------------------------------|
| **Home**      | Live statistieken, agenda preview, snelkoppelingen         |
| **Tracks**    | Circuits toevoegen/verwijderen met rondtijden en notities  |
| **Pitstop**   | Stopwatch met doeltijd, stats, team-gedeelde history       |
| **Agenda**    | Race dag schema, live gesynchroniseerd                     |
| **Checklist** | Kart + team gereedheid, realtime voor iedereen zichtbaar   |
