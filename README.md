# 🏁 KartPit — Amateur Kart Race Manager

A dark-themed, F1-inspired web app for managing your race day.
Built with HTML + CSS + Vanilla JS frontend and a Python Flask backend.

---

## Features

| Page        | Description                                              |
|-------------|----------------------------------------------------------|
| **Home**    | Dashboard with stats, quick nav, today's agenda preview  |
| **Tracks**  | Circuit database with lap times and corner notes         |
| **Pitstop** | Live stopwatch timer with history, stats & save to file  |
| **Agenda**  | Race day timeline — add/remove sessions                  |
| **Checklist** | Pre-race kart + team readiness with progress bars      |

---

## File Structure

```
kartapp/
├── app.py                  ← Flask backend + all API routes
├── requirements.txt
├── data/                   ← JSON data files (auto-created)
│   ├── checklist.json
│   ├── agenda.json
│   ├── pitstops.json
│   └── tracks.json
├── static/
│   ├── css/
│   │   └── style.css       ← Full dark racing theme
│   └── js/
│       ├── main.js         ← Shared utils, API helper, toast
│       ├── timer.js        ← Pitstop stopwatch logic
│       └── checklist.js    ← Checklist toggle + progress
└── templates/
    ├── base.html           ← Navbar + layout wrapper
    ├── index.html          ← Home page
    ├── tracks.html         ← Circuits page
    ├── pitstop.html        ← Pitstop timer page
    ├── agenda.html         ← Race agenda page
    └── checklist.html      ← Pre-race checklist page
```

---

## Setup & Run

### 1. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the app
```bash
python app.py
```

### 3. Open in browser
```
http://localhost:5000
```

Data is automatically saved to JSON files in the `data/` folder.
No database setup required.

---

## Keyboard Shortcuts (Pitstop Timer)
- `Space` — Start / Stop timer
- `R` — Reset timer

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/checklist` | Get all checklist items |
| PATCH | `/api/checklist/<id>` | Toggle item done/undone |
| POST | `/api/checklist/add` | Add new item |
| POST | `/api/checklist/reset` | Reset all to unchecked |
| GET | `/api/agenda` | Get agenda |
| POST | `/api/agenda/add` | Add event |
| DELETE | `/api/agenda/<id>` | Delete event |
| GET | `/api/pitstops` | Get pitstop history |
| POST | `/api/pitstops/save` | Save a pitstop |
| DELETE | `/api/pitstops/<id>` | Delete a pitstop |
| GET | `/api/tracks` | Get tracks |
| POST | `/api/tracks/add` | Add a track |
