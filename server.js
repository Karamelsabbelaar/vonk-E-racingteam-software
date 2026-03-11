/**
 * KartPit - Express Server
 * Amateur Kart Race Management App
 * Supports: Windows, macOS, Linux, Android, iOS
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { readFile, writeFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Configure EJS as template engine
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Static files
app.use(express.static(join(__dirname, 'Css')));
app.use(express.static(join(__dirname, 'JavaScript')));

// ─── Data Paths ───────────────────────────────────────────────────────────────
const DATA_DIR = join(__dirname, 'data');
const CHECKLIST_FILE = join(DATA_DIR, 'checklist.json');
const AGENDA_FILE = join(DATA_DIR, 'agenda.json');
const PITSTOPS_FILE = join(DATA_DIR, 'pitstops.json');
const TRACKS_FILE = join(DATA_DIR, 'tracks.json');

// ─── Default Seed Data ────────────────────────────────────────────────────────
const DEFAULT_CHECKLIST = {
  components: [
    { id: 1, item: "Kart chassis inspect", done: false, category: "kart" },
    { id: 2, item: "Tyre pressures checked", done: false, category: "kart" },
    { id: 3, item: "Engine oil level", done: false, category: "kart" },
    { id: 4, item: "Chain tension & lube", done: false, category: "kart" },
    { id: 5, item: "Brake pads & fluid", done: false, category: "kart" },
    { id: 6, item: "Steering play check", done: false, category: "kart" },
    { id: 7, item: "Bodywork secured", done: false, category: "kart" },
    { id: 8, item: "Transponder fitted", done: false, category: "kart" },
  ],
  people: [
    { id: 9, item: "Driver race licence", done: false, category: "people" },
    { id: 10, item: "Helmet & HANS approved", done: false, category: "people" },
    { id: 11, item: "Race suit & gloves", done: false, category: "people" },
    { id: 12, item: "Driver rib protector", done: false, category: "people" },
    { id: 13, item: "Mechanic tools bag", done: false, category: "people" },
    { id: 14, item: "Fuel & spare fuel can", done: false, category: "people" },
    { id: 15, item: "Paddock pass / wristband", done: false, category: "people" },
    { id: 16, item: "First aid kit on-site", done: false, category: "people" },
  ]
};

const DEFAULT_AGENDA = [
  { id: 1, time: "07:00", event: "Paddock opens – setup & scrutineering", type: "admin" },
  { id: 2, time: "08:30", event: "Drivers briefing", type: "briefing" },
  { id: 3, time: "09:00", event: "Free practice session 1 (15 min)", type: "session" },
  { id: 4, time: "09:30", event: "Free practice session 2 (15 min)", type: "session" },
  { id: 5, time: "10:30", event: "Qualifying (10 min – timed laps)", type: "qualifying" },
  { id: 6, time: "11:15", event: "Pre-race pitstop rehearsal", type: "pitstop" },
  { id: 7, time: "12:00", event: "Race 1 – 20 laps", type: "race" },
  { id: 8, time: "13:30", event: "Lunch break & kart service window", type: "break" },
  { id: 9, time: "14:30", event: "Race 2 – 25 laps", type: "race" },
  { id: 10, time: "16:00", event: "Trophy presentation & debrief", type: "admin" },
];

const DEFAULT_PITSTOPS = [];

const DEFAULT_TRACKS = [
  {
    id: 1,
    name: "Raamsdonksveer Karting Circuit",
    location: "Netherlands",
    length_m: 950,
    turns: 10,
    best_lap: "47.2s",
    notes: "Technical layout with two hairpins. Watch the kerbs at T4.",
    type: "indoor/outdoor"
  },
  {
    id: 2,
    name: "Circuit Genk",
    location: "Belgium",
    length_m: 1335,
    turns: 19,
    best_lap: "52.8s",
    notes: "Fast flowing circuit. Good braking point at T12 chicane.",
    type: "outdoor"
  },
  {
    id: 3,
    name: "Sodi World Series - Bercy",
    location: "France",
    length_m: 750,
    turns: 8,
    best_lap: "38.1s",
    notes: "Short indoor venue. Tire warmup is critical on this slick surface.",
    type: "indoor"
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function loadJson(path, defaultData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(path)) {
      await saveJson(path, defaultData);
      return defaultData;
    }
    const content = await readFile(path, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error loading ${path}:`, err);
    return defaultData;
  }
}

async function saveJson(path, data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    await writeFile(path, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error saving ${path}:`, err);
  }
}

// ─── Routes – Pages ───────────────────────────────────────────────────────────
app.get('/', async (req, res) => {
  const tracks = await loadJson(TRACKS_FILE, DEFAULT_TRACKS);
  const agenda = await loadJson(AGENDA_FILE, DEFAULT_AGENDA);
  const pitstops = await loadJson(PITSTOPS_FILE, DEFAULT_PITSTOPS);
  res.render('index', { title: 'KartPit — Home', tracks, agenda, pitstops });
});

app.get('/tracks', async (req, res) => {
  const tracks = await loadJson(TRACKS_FILE, DEFAULT_TRACKS);
  res.render('tracks', { title: 'KartPit — Tracks', tracks });
});

app.get('/pitstop', async (req, res) => {
  const pitstops = await loadJson(PITSTOPS_FILE, DEFAULT_PITSTOPS);
  res.render('pitstop', { title: 'KartPit — Pitstop Timer', pitstops });
});

app.get('/agenda', async (req, res) => {
  const agenda = await loadJson(AGENDA_FILE, DEFAULT_AGENDA);
  res.render('agenda', { title: 'KartPit — Agenda', agenda });
});

app.get('/checklist', async (req, res) => {
  const checklist = await loadJson(CHECKLIST_FILE, DEFAULT_CHECKLIST);
  res.render('checklist', { title: 'KartPit — Checklist', checklist });
});

// ─── API – Checklist ──────────────────────────────────────────────────────────
app.get('/api/checklist', async (req, res) => {
  const data = await loadJson(CHECKLIST_FILE, DEFAULT_CHECKLIST);
  res.json(data);
});

app.patch('/api/checklist/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const data = await loadJson(CHECKLIST_FILE, DEFAULT_CHECKLIST);
  
  for (const category of ['components', 'people']) {
    for (const item of data[category]) {
      if (item.id === itemId) {
        item.done = !item.done;
        await saveJson(CHECKLIST_FILE, data);
        return res.json({ ok: true, done: item.done });
      }
    }
  }
  res.status(404).json({ ok: false });
});

app.post('/api/checklist/reset', async (req, res) => {
  const data = await loadJson(CHECKLIST_FILE, DEFAULT_CHECKLIST);
  for (const category of ['components', 'people']) {
    for (const item of data[category]) {
      item.done = false;
    }
  }
  await saveJson(CHECKLIST_FILE, data);
  res.json({ ok: true });
});

app.post('/api/checklist/add', async (req, res) => {
  const { item, category = 'components' } = req.body;
  
  // Validate inputs
  if (!item || !item.trim()) {
    return res.status(400).json({ ok: false, error: 'Item text required' });
  }
  if (!['components', 'people'].includes(category)) {
    return res.status(400).json({ ok: false, error: 'Invalid category' });
  }
  
  const data = await loadJson(CHECKLIST_FILE, DEFAULT_CHECKLIST);
  
  const allItems = [...data.components, ...data.people];
  const newId = Math.max(...allItems.map(i => i.id), 0) + 1;
  
  data[category].push({ id: newId, item: item.trim(), done: false, category });
  await saveJson(CHECKLIST_FILE, data);
  res.json({ ok: true, id: newId });
});

// ─── API – Agenda ─────────────────────────────────────────────────────────────
app.get('/api/agenda', async (req, res) => {
  const data = await loadJson(AGENDA_FILE, DEFAULT_AGENDA);
  res.json(data);
});

app.post('/api/agenda/add', async (req, res) => {
  const { time, event, type = 'admin' } = req.body;
  
  // Validate inputs
  if (!time || !event || !event.trim()) {
    return res.status(400).json({ ok: false, error: 'Time and event required' });
  }
  // Basic time format validation (HH:MM)
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return res.status(400).json({ ok: false, error: 'Invalid time format (use HH:MM)' });
  }
  
  const data = await loadJson(AGENDA_FILE, DEFAULT_AGENDA);
  
  const newId = Math.max(...data.map(i => i.id), 0) + 1;
  data.push({ id: newId, time, event: event.trim(), type });
  data.sort((a, b) => a.time.localeCompare(b.time));
  
  await saveJson(AGENDA_FILE, data);
  res.json({ ok: true });
});

app.delete('/api/agenda/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  let data = await loadJson(AGENDA_FILE, DEFAULT_AGENDA);
  
  data = data.filter(i => i.id !== itemId);
  await saveJson(AGENDA_FILE, data);
  res.json({ ok: true });
});

// ─── API – Pitstops ───────────────────────────────────────────────────────────
app.get('/api/pitstops', async (req, res) => {
  const data = await loadJson(PITSTOPS_FILE, DEFAULT_PITSTOPS);
  res.json(data);
});

app.post('/api/pitstops/save', async (req, res) => {
  const { duration, label, notes = '' } = req.body;
  const data = await loadJson(PITSTOPS_FILE, DEFAULT_PITSTOPS);
  
  const newId = Math.max(...data.map(i => i.id), 0) + 1;
  const date = new Date().toISOString().slice(0, 16).replace('T', ' ');
  
  data.push({
    id: newId,
    duration,
    label: label || `Stop #${newId}`,
    date,
    notes
  });
  
  await saveJson(PITSTOPS_FILE, data);
  res.json({ ok: true, id: newId });
});

app.delete('/api/pitstops/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  let data = await loadJson(PITSTOPS_FILE, DEFAULT_PITSTOPS);
  
  data = data.filter(i => i.id !== itemId);
  await saveJson(PITSTOPS_FILE, data);
  res.json({ ok: true });
});

// ─── API – Tracks ─────────────────────────────────────────────────────────────
app.get('/api/tracks', async (req, res) => {
  const data = await loadJson(TRACKS_FILE, DEFAULT_TRACKS);
  res.json(data);
});

app.post('/api/tracks/add', async (req, res) => {
  const { name, location = '', length_m = 0, turns = 0, best_lap = '–', notes = '', type = 'outdoor' } = req.body;
  
  // Validate required fields
  if (!name || !name.trim()) {
    return res.status(400).json({ ok: false, error: 'Track name required' });
  }
  if (length_m < 0 || turns < 0) {
    return res.status(400).json({ ok: false, error: 'Length and turns must be non-negative' });
  }
  if (!['outdoor', 'indoor', 'indoor/outdoor'].includes(type)) {
    return res.status(400).json({ ok: false, error: 'Invalid track type' });
  }
  
  const data = await loadJson(TRACKS_FILE, DEFAULT_TRACKS);
  
  const newId = Math.max(...data.map(i => i.id), 0) + 1;
  
  data.push({
    id: newId,
    name: name.trim(),
    location: location.trim(),
    length_m: parseInt(length_m) || 0,
    turns: parseInt(turns) || 0,
    best_lap: best_lap.trim() || '–',
    notes: notes.trim(),
    type
  });
  
  await saveJson(TRACKS_FILE, data);
  res.json({ ok: true });
});

// ─── Initialization ───────────────────────────────────────────────────────────
async function initializeApp() {
  // Pre-seed all data files on first run
  await loadJson(CHECKLIST_FILE, DEFAULT_CHECKLIST);
  await loadJson(AGENDA_FILE, DEFAULT_AGENDA);
  await loadJson(PITSTOPS_FILE, DEFAULT_PITSTOPS);
  await loadJson(TRACKS_FILE, DEFAULT_TRACKS);
}

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  await initializeApp();
  console.log(`🏁 KartPit running at http://localhost:${PORT}`);
});
