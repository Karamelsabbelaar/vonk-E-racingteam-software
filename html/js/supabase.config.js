/**
 * KartPit — Supabase Config & Data Layer
 * ─────────────────────────────────────────
 * 1. Maak een gratis account op https://supabase.com
 * 2. Maak een nieuw project aan
 * 3. Ga naar Project Settings → API
 * 4. Kopieer je URL en anon/public key hieronder
 * 5. Voer het SQL script uit in de Supabase SQL Editor (zie README)
 */

// ── Supabase verbinding ────────────────────────────────────────
const SUPABASE_URL  = 'https://tzzuxemddkgvgipsaadr.supabase.co';   // bijv. https://xyzxyz.supabase.co
const SUPABASE_KEY  = 'sb_publishable_hV5vJlRZn0MOwQFErJPbww_9605nepF'; // de lange publieke sleutel

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Checklist ─────────────────────────────────────────────────
const Checklist = {
  async getAll() {
    const { data, error } = await db.from('checklist_items').select('*').order('id');
    if (error) throw error;
    return data;
  },
  async toggle(id, done) {
    const { error } = await db.from('checklist_items').update({ done }).eq('id', id);
    if (error) throw error;
  },
  async add(item, category) {
    const { error } = await db.from('checklist_items').insert({ item, category, done: false });
    if (error) throw error;
  },
  async resetAll() {
    const { error } = await db.from('checklist_items').update({ done: false }).neq('id', 0);
    if (error) throw error;
  },
  async remove(id) {
    const { error } = await db.from('checklist_items').delete().eq('id', id);
    if (error) throw error;
  }
};

// ── Agenda ────────────────────────────────────────────────────
const Agenda = {
  async getAll() {
    const { data, error } = await db.from('agenda').select('*').order('time');
    if (error) throw error;
    return data;
  },
  async add(time, event, type) {
    const { error } = await db.from('agenda').insert({ time, event, type });
    if (error) throw error;
  },
  async remove(id) {
    const { error } = await db.from('agenda').delete().eq('id', id);
    if (error) throw error;
  }
};

// ── Pitstops ──────────────────────────────────────────────────
const Pitstops = {
  async getAll() {
    const { data, error } = await db.from('pitstops').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async save(duration_ms, label, notes) {
    const { error } = await db.from('pitstops').insert({ duration_ms, label, notes });
    if (error) throw error;
  },
  async remove(id) {
    const { error } = await db.from('pitstops').delete().eq('id', id);
    if (error) throw error;
  }
};

// ── Bandenspanning ─────────────────────────────────────────────
const TirePressures = {
  async getAll() {
    const { data, error } = await db.from('tire_pressures')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async getByPitstop(pitstopId) {
    const { data, error } = await db.from('tire_pressures')
      .select('*')
      .eq('pitstop_id', pitstopId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async add(trackId, pitstopId, lv, rv, la, ra) {
    const { error } = await db.from('tire_pressures').insert({
      track_id:      trackId,
      pitstop_id:    pitstopId,
      Links_voor:    lv,
      Rechts_voor:   rv,
      Links_achter:  la,
      Rechts_achter: ra
    });
    if (error) throw error;
  },
  async remove(id) {
    const { error } = await db.from('tire_pressures').delete().eq('id', id);
    if (error) throw error;
  }
};


// ── Tracks ────────────────────────────────────────────────────
const Tracks = {
  async getAll() {
    const { data, error } = await db.from('tracks').select('*').order('name');
    if (error) throw error;
    return data;
  },
  async add(track) {
    const { error } = await db.from('tracks').insert(track);
    if (error) throw error;
  },
  async remove(id) {
    const { error } = await db.from('tracks').delete().eq('id', id);
    if (error) throw error;
  }
};

// ── Realtime helper (live updates voor teamleden) ──────────────
const Realtime = {
  onChecklistChange(callback) {
    db.channel('checklist')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checklist_items' }, callback)
      .subscribe();
  },
  onAgendaChange(callback) {
    db.channel('agenda')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agenda' }, callback)
      .subscribe();
  },
  onPitstopChange(callback) {
    db.channel('pitstops')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pitstops' }, callback)
      .subscribe();
  },

  onTasksChange(callback) {
  db.channel('tasks')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, callback)
    .subscribe();
}
};

// ── Lap Times ─────────────────────────────────────────────
const knopje1 = document.getElementById("toevoegknop");
async function addItem() {
  
}
knopje1.addEventListener('click', () => {
  driver = Name1;
  lap_ms = Time;
  lap_number = Rondes;
  console.log("Driver:", driver);
  console.log("Lap number:", lap_number);
  console.log("Lap time (ms):", lap_ms);
  addLapTime();

});
async function addLapTime() {
   try {
    await LapTimes.add(driver, lap_number, lap_ms);
  } catch(e) {
  }
}

const LapTimes = {
  async getAll() {
    const { data, error } = await db.from('tracks').select('*').order('name');
    if (error) throw error;
    return data;
  },
  async add(driver, lap_number, lap_ms) {
    const { error } = await db.from('lap_times').insert({ driver, lap_number, lap_ms });
    if (error) throw error;
  },
  async remove(id) {
    const { error } = await db.from('tracks').delete().eq('id', id);
    if (error) throw error;
  }
};

const knopje2 = document.getElementById("toevoegknop2");
knopje2.addEventListener('click', () => {
  driver = Name2;
  lap_ms = Time;
  lap_number = RondesB;
const LapTimes = {
  async getAll() {
    const { data, error } = await db.from('tracks').select('*').order('name');
    if (error) throw error;
    return data;
  },
  async add(driver, lap_number, lap_ms) {
    const { error } = await db.from('lap_times').insert({ driver, lap_number, lap_ms });
    if (error) throw error;
  },
  async remove(id) {
    const { error } = await db.from('tracks').delete().eq('id', id);
    if (error) throw error;
  }
};
});

const knopje3 = document.getElementById("toevoegknop3");
knopje3.addEventListener('click', () => {
  driver = Name3;
  lap_ms = Time;
  lap_number = RondesC;
const LapTimes = {
  async getAll() {
    const { data, error } = await db.from('tracks').select('*').order('name');
    if (error) throw error;
    return data;
  },
  async add(driver, lap_number, lap_ms) {
    const { error } = await db.from('lap_times').insert({ driver, lap_number, lap_ms });
    if (error) throw error;
  },
  async remove(id) {
    const { error } = await db.from('tracks').delete().eq('id', id);
    if (error) throw error;
  }
};
});

const knopje4 = document.getElementById("toevoegknop4");
knopje4.addEventListener('click', () => {
  driver = Name4;
  lap_ms = Time;
  lap_number = RondesD;
const LapTimes = {
  async getAll() {
    const { data, error } = await db.from('tracks').select('*').order('name');
    if (error) throw error;
    return data;
  },
  async add(driver, lap_number, lap_ms) {
    const { error } = await db.from('lap_times').insert({ driver, lap_number, lap_ms });
    if (error) throw error;
  },
  async remove(id) {
    const { error } = await db.from('tracks').delete().eq('id', id);
    if (error) throw error;
  }
};
});
// ── Sign out helper ─────────────────────────────────────────────
async function signOut() {
  await db.auth.signOut();
  window.location.href = "login.html";
}
