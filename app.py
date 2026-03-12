"""
KartPit - Amateur Kart Race Management App
Flask backend with JSON file-based data storage
"""

from flask import Flask, render_template, jsonify, request, redirect, url_for
import json
import os
from datetime import datetime

app = Flask(__name__)

# ─── Data Paths ───────────────────────────────────────────────────────────────
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
CHECKLIST_FILE = os.path.join(DATA_DIR, "checklist.json")
AGENDA_FILE    = os.path.join(DATA_DIR, "agenda.json")
PITSTOPS_FILE  = os.path.join(DATA_DIR, "pitstops.json")
TRACKS_FILE    = os.path.join(DATA_DIR, "tracks.json")

# ─── Helpers ──────────────────────────────────────────────────────────────────
def load_json(path, default):
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(path):
        save_json(path, default)
        return default
    with open(path, "r") as f:
        return json.load(f)

def save_json(path, data):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

# ─── Default Seed Data ────────────────────────────────────────────────────────
DEFAULT_CHECKLIST = {
    "components": [
        {"id": 1, "item": "Kart chassis inspect",      "done": False, "category": "kart"},
        {"id": 2, "item": "Tyre pressures checked",    "done": False, "category": "kart"},
        {"id": 3, "item": "Engine oil level",          "done": False, "category": "kart"},
        {"id": 4, "item": "Chain tension & lube",      "done": False, "category": "kart"},
        {"id": 5, "item": "Brake pads & fluid",        "done": False, "category": "kart"},
        {"id": 6, "item": "Steering play check",       "done": False, "category": "kart"},
        {"id": 7, "item": "Bodywork secured",          "done": False, "category": "kart"},
        {"id": 8, "item": "Transponder fitted",        "done": False, "category": "kart"},
    ],
    "people": [
        {"id": 9,  "item": "Driver race licence",      "done": False, "category": "people"},
        {"id": 10, "item": "Helmet & HANS approved",   "done": False, "category": "people"},
        {"id": 11, "item": "Race suit & gloves",       "done": False, "category": "people"},
        {"id": 12, "item": "Driver rib protector",     "done": False, "category": "people"},
        {"id": 13, "item": "Mechanic tools bag",       "done": False, "category": "people"},
        {"id": 14, "item": "Fuel & spare fuel can",    "done": False, "category": "people"},
        {"id": 15, "item": "Paddock pass / wristband", "done": False, "category": "people"},
        {"id": 16, "item": "First aid kit on-site",    "done": False, "category": "people"},
    ]
}

DEFAULT_AGENDA = [
    {"id": 1, "time": "07:00", "event": "Paddock opens – setup & scrutineering",      "type": "admin"},
    {"id": 2, "time": "08:30", "event": "Drivers briefing",                           "type": "briefing"},
    {"id": 3, "time": "09:00", "event": "Free practice session 1 (15 min)",           "type": "session"},
    {"id": 4, "time": "09:30", "event": "Free practice session 2 (15 min)",           "type": "session"},
    {"id": 5, "time": "10:30", "event": "Qualifying (10 min – timed laps)",           "type": "qualifying"},
    {"id": 6, "time": "11:15", "event": "Pre-race pitstop rehearsal",                 "type": "pitstop"},
    {"id": 7, "time": "12:00", "event": "Race 1 – 20 laps",                           "type": "race"},
    {"id": 8, "time": "13:30", "event": "Lunch break & kart service window",          "type": "break"},
    {"id": 9, "time": "14:30", "event": "Race 2 – 25 laps",                           "type": "race"},
    {"id": 10,"time": "16:00", "event": "Trophy presentation & debrief",              "type": "admin"},
]

DEFAULT_PITSTOPS = []

DEFAULT_TRACKS = [
    {
        "id": 1,
        "name": "Raamsdonksveer Karting Circuit",
        "location": "Netherlands",
        "length_m": 950,
        "turns": 10,
        "best_lap": "47.2s",
        "notes": "Technical layout with two hairpins. Watch the kerbs at T4.",
        "type": "indoor/outdoor"
    },
    {
        "id": 2,
        "name": "Circuit Genk",
        "location": "Belgium",
        "length_m": 1335,
        "turns": 19,
        "best_lap": "52.8s",
        "notes": "Fast flowing circuit. Good braking point at T12 chicane.",
        "type": "outdoor"
    },
    {
        "id": 3,
        "name": "Sodi World Series - Bercy",
        "location": "France",
        "length_m": 750,
        "turns": 8,
        "best_lap": "38.1s",
        "notes": "Short indoor venue. Tire warmup is critical on this slick surface.",
        "type": "indoor"
    },
]

# ─── Routes – Pages ───────────────────────────────────────────────────────────
@app.route("/")
def home():
    tracks   = load_json(TRACKS_FILE, DEFAULT_TRACKS)
    agenda   = load_json(AGENDA_FILE, DEFAULT_AGENDA)
    pitstops = load_json(PITSTOPS_FILE, DEFAULT_PITSTOPS)
    return render_template("index.html", tracks=tracks, agenda=agenda, pitstops=pitstops)

@app.route("/tracks")
def tracks():
    data = load_json(TRACKS_FILE, DEFAULT_TRACKS)
    return render_template("tracks.html", tracks=data)

@app.route("/pitstop")
def pitstop():
    data = load_json(PITSTOPS_FILE, DEFAULT_PITSTOPS)
    return render_template("pitstop.html", pitstops=data)

@app.route("/agenda")
def agenda():
    data = load_json(AGENDA_FILE, DEFAULT_AGENDA)
    return render_template("agenda.html", agenda=data)

@app.route("/checklist")
def checklist():
    data = load_json(CHECKLIST_FILE, DEFAULT_CHECKLIST)
    return render_template("checklist.html", checklist=data)

# ─── API – Checklist ──────────────────────────────────────────────────────────
@app.route("/api/checklist", methods=["GET"])
def api_get_checklist():
    return jsonify(load_json(CHECKLIST_FILE, DEFAULT_CHECKLIST))

@app.route("/api/checklist/<int:item_id>", methods=["PATCH"])
def api_toggle_checklist(item_id):
    data = load_json(CHECKLIST_FILE, DEFAULT_CHECKLIST)
    for cat in ("components", "people"):
        for item in data[cat]:
            if item["id"] == item_id:
                item["done"] = not item["done"]
                save_json(CHECKLIST_FILE, data)
                return jsonify({"ok": True, "done": item["done"]})
    return jsonify({"ok": False}), 404

@app.route("/api/checklist/reset", methods=["POST"])
def api_reset_checklist():
    data = load_json(CHECKLIST_FILE, DEFAULT_CHECKLIST)
    for cat in ("components", "people"):
        for item in data[cat]:
            item["done"] = False
    save_json(CHECKLIST_FILE, data)
    return jsonify({"ok": True})

@app.route("/api/checklist/add", methods=["POST"])
def api_add_checklist():
    body = request.get_json()
    data = load_json(CHECKLIST_FILE, DEFAULT_CHECKLIST)
    cat  = body.get("category", "components")
    all_items = data["components"] + data["people"]
    new_id = max((i["id"] for i in all_items), default=0) + 1
    data[cat].append({"id": new_id, "item": body["item"], "done": False, "category": cat})
    save_json(CHECKLIST_FILE, data)
    return jsonify({"ok": True, "id": new_id})

# ─── API – Agenda ─────────────────────────────────────────────────────────────
@app.route("/api/agenda", methods=["GET"])
def api_get_agenda():
    return jsonify(load_json(AGENDA_FILE, DEFAULT_AGENDA))

@app.route("/api/agenda/add", methods=["POST"])
def api_add_agenda():
    body = request.get_json()
    data = load_json(AGENDA_FILE, DEFAULT_AGENDA)
    new_id = max((i["id"] for i in data), default=0) + 1
    data.append({"id": new_id, "time": body["time"], "event": body["event"], "type": body.get("type","admin")})
    data.sort(key=lambda x: x["time"])
    save_json(AGENDA_FILE, data)
    return jsonify({"ok": True})

@app.route("/api/agenda/<int:item_id>", methods=["DELETE"])
def api_delete_agenda(item_id):
    data = load_json(AGENDA_FILE, DEFAULT_AGENDA)
    data = [i for i in data if i["id"] != item_id]
    save_json(AGENDA_FILE, data)
    return jsonify({"ok": True})

# ─── API – Pitstops ───────────────────────────────────────────────────────────
@app.route("/api/pitstops", methods=["GET"])
def api_get_pitstops():
    return jsonify(load_json(PITSTOPS_FILE, DEFAULT_PITSTOPS))

@app.route("/api/pitstops/save", methods=["POST"])
def api_save_pitstop():
    body = request.get_json()
    data = load_json(PITSTOPS_FILE, DEFAULT_PITSTOPS)
    new_id = max((i["id"] for i in data), default=0) + 1
    data.append({
        "id":       new_id,
        "duration": body["duration"],
        "label":    body.get("label", f"Stop #{new_id}"),
        "date":     datetime.now().strftime("%Y-%m-%d %H:%M"),
        "notes":    body.get("notes", "")
    })
    save_json(PITSTOPS_FILE, data)
    return jsonify({"ok": True, "id": new_id})

@app.route("/api/pitstops/<int:item_id>", methods=["DELETE"])
def api_delete_pitstop(item_id):
    data = load_json(PITSTOPS_FILE, DEFAULT_PITSTOPS)
    data = [i for i in data if i["id"] != item_id]
    save_json(PITSTOPS_FILE, data)
    return jsonify({"ok": True})

# ─── API – Tracks ─────────────────────────────────────────────────────────────
@app.route("/api/tracks", methods=["GET"])
def api_get_tracks():
    return jsonify(load_json(TRACKS_FILE, DEFAULT_TRACKS))

@app.route("/api/tracks/add", methods=["POST"])
def api_add_track():
    body = request.get_json()
    data = load_json(TRACKS_FILE, DEFAULT_TRACKS)
    new_id = max((i["id"] for i in data), default=0) + 1
    data.append({
        "id":       new_id,
        "name":     body["name"],
        "location": body.get("location",""),
        "length_m": body.get("length_m", 0),
        "turns":    body.get("turns", 0),
        "best_lap": body.get("best_lap","–"),
        "notes":    body.get("notes",""),
        "type":     body.get("type","outdoor"),
    })
    save_json(TRACKS_FILE, data)
    return jsonify({"ok": True})

# ─── Run ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Pre-seed all data files on first run
    load_json(CHECKLIST_FILE, DEFAULT_CHECKLIST)
    load_json(AGENDA_FILE,    DEFAULT_AGENDA)
    load_json(PITSTOPS_FILE,  DEFAULT_PITSTOPS)
    load_json(TRACKS_FILE,    DEFAULT_TRACKS)
    print("🏁 KartPit running at http://localhost:5000")
    app.run(debug=True, port=5000)
