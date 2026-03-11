# 🏁 KartPit — Amateur Kart Race Manager

**Your complete kart race day tool.** Manage your team, schedule, prep checklist, and pitstop timings — all in one app.

Works on **Windows, macOS, Linux, Android, and iOS** ✅

![KartPit](https://img.shields.io/badge/Status-Ready%20to%20Race-red?style=flat-square)
![Node.js](https://img.shields.io/badge/Stack-Node.js%20%2B%20Express-green?style=flat-square)

---

## 🚀 Quick Start (5 Minutes)

### **Step 1: Install Node.js**
Download and install from [nodejs.org](https://nodejs.org) (get the LTS version)

### **Step 2: Download Dependencies**
Open terminal/PowerShell in the project folder and run:
```bash
npm install
```

### **Step 3: Start the App**
```bash
npm start
```

You'll see:
```
🏁 KartPit running at http://localhost:5000
```

### **Step 4: Open in Your Browser**
Visit: **http://localhost:5000**

That's it! You're ready to go. 🎉

---

## 📱 Access From Your Phone/Tablet

While the server is running, teammates can join from the same WiFi network:

1. **Find your computer's IP address:**
   - **Windows:** Open PowerShell and type `ipconfig`
   - **Mac/Linux:** Open Terminal and type `ifconfig`
   - Look for something like `192.168.1.100`

2. **Share the link with your team:**
   ```
   http://<YOUR_IP>:5000
   ```
   Example: `http://192.168.1.100:5000`

Everyone on the same WiFi can now access the app! 📡

---

## 📖 What Each Page Does

| Page | What It Does |
|------|-------------|
| **🏠 Home** | Dashboard showing all your data at a glance. See tracks saved, events today, and pitstops logged. |
| **🗺️ Tracks** | Save circuit information. Add track names, locations, lap lengths, corner counts, best lap times, and notes. |
| **⏱️ Pitstop Timer** | Stopwatch for measuring pit crew performance. Track best/worst/average stop times. Save with notes. |
| **📋 Agenda** | Build your race day schedule. Add practice sessions, qualifying, races, briefings, breaks. Visualize as timeline. |
| **☑️ Checklist** | Pre-race prep checklist. Kart components + team readiness. Track progress with percentage. |

---

## 🎮 How to Use Each Page

### **Checklist Page** ✅
```
1. Click items to check them off as you prepare
2. Progress bars fill as you complete items
3. Add custom items for your specific team
4. Reset all items when ready for next race
```

### **Pitstop Timer Page** ⏱️
```
1. Type a target time (e.g., 8 seconds)
2. Click START (or press SPACE)
3. Click STOP when done (or press SPACE)
4. Click SAVE STOP to log it
5. View best/worst/average times below
```

### **Agenda Page** 📋
```
1. Click ADD EVENT
2. Enter time (use 24-hour format, e.g., 09:30)
3. Enter event name (e.g., "Free Practice 1")
4. Select event type (Race, Qualifying, Session, etc.)
5. Click ADD
6. Timeline appears as you add events
```

### **Tracks Page** 🗺️
```
1. Enter circuit details
2. Length in meters
3. Number of turns
4. Best lap time
5. Any notes (corner tips, surface type, etc.)
6. Cards display all saved circuits
```

---

## ⌨️ Keyboard Shortcuts

**Pitstop Timer Page Only:**
- **SPACE** — Start/Stop timer
- **R** — Reset timer

---

## 💾 Your Data

All your data is saved automatically in the `data/` folder:
- `checklist.json` — Your checklists
- `agenda.json` — Your race schedules
- `pitstops.json` — Your pit stop records
- `tracks.json` — Your saved circuits

**No database or login required.** Everything is stored locally.

---

## 🎨 Features

✅ **Dark Racing Theme** — F1-inspired design  
✅ **Smooth Animations** — Professional feel  
✅ **Fully Responsive** — Works on phone, tablet, laptop  
✅ **Offline Ready** — Works without internet  
✅ **Real-time Sync** — All devices see updates instantly (on same WiFi)  
✅ **Mobile Friendly** — Touch-optimized buttons and forms  

---

## 🆘 Troubleshooting

### **"npm: command not found"**
→ Node.js isn't installed. Download from [nodejs.org](https://nodejs.org)

### **"Port 5000 already in use"**
→ Another app is using that port. Either:
- Close the other app
- Or change port in `server.js` (line 12)

### **"Cannot find module 'express'"**
→ Run `npm install` again

### **Phone can't connect**
→ Make sure both computer and phone are on the same WiFi network, and there's no firewall blocking port 5000

### **Changes don't appear**
→ Try refreshing your browser (F5 or Cmd+R)

---

## 🔧 For Developers / Advanced Users

### **Project Structure**
```
vonk-E-racingteam-software/
├── server.js              ← Main server file
├── package.json          ← Dependencies
├── views/                ← HTML pages
├── Css/                  ← Styling
├── JavaScript/           ← Frontend logic
├── data/                 ← Your saved data (auto-created)
└── node_modules/         ← Installed packages
```

### **Development Mode (Auto-reload)**
```bash
npm run dev
```
Changes to files will auto-refresh the app.

### **API Endpoints** (For developers)
```
GET    /api/checklist
PATCH  /api/checklist/:id
POST   /api/checklist/add
POST   /api/checklist/reset

GET    /api/agenda
POST   /api/agenda/add
DELETE /api/agenda/:id

GET    /api/pitstops
POST   /api/pitstops/save
DELETE /api/pitstops/:id

GET    /api/tracks
POST   /api/tracks/add
```

---

## 🚀 What's Next?

- 🌐 **Deploy Online** — Run on cloud (Heroku, Vercel, Railway)
- 📱 **Mobile Apps** — Native iOS/Android apps (React Native)
- 💾 **Real Database** — Switch from JSON to SQLite/PostgreSQL
- 🔐 **User Accounts** — Save per-team data

---

## 📝 Tips for Your Team

1. **One person runs the server** on their laptop at the paddock
2. **Everyone else joins** via WiFi (use the IP address)
3. **Real-time updates** — All teammates see changes instantly
4. **Keep a laptop at paddock** — Data persists between races
5. **Export your data** — Copy the `data/` folder to backup

---

## ❓ Questions?

The app is straightforward! Just try:
- Adding a track
- Starting the pitstop timer
- Building your race day agenda
- Checking off your pre-race checklist

Everything saves automatically. You can't break anything! 🏎️

---

**Ready to race? Start with:** `npm start` 🏁

