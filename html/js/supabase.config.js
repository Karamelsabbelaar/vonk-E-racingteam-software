/**
 * KartPit — Supabase Config & Data Layer
 * ────────────────────────────────────────
 * Centralized database module definitions for all app features.
 * Each module wraps Supabase queries with basic error handling.
 * 
 * Setup instructions:
 *  1. Create free account at https://supabase.com
 *  2. Create new project
 *  3. Get API URL & anon key from Project Settings → API
 *  4. Paste credentials below
 *  5. Run SQL script from supabase_setup.sql in Supabase SQL editor
 *
 * Note: These modules are wrapped by offline.js for offline functionality.
 * Never call these directly on pages — always use the offline-wrapped versions.
 */

// ── Supabase verbinding ────────────────────────────────────────
const SUPABASE_URL  = 'https://tzzuxemddkgvgipsaadr.supabase.co';   // bijv. https://xyzxyz.supabase.co
const SUPABASE_KEY  = 'sb_publishable_hV5vJlRZn0MOwQFErJPbww_9605nepF'; // de lange publieke sleutel

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Checklist - Pre-race prep items ────────────────────────────
// Drivers check off items as they complete pre-race tasks
// Each item has optional category for grouping
const Checklist = {
  async getAll() {
    const { data, error } = await db.from('checklist_items').select('*').order('id');
    if (error) {
      console.error('[KartPit] Error fetching checklist:', error.message);
      throw error;
    }
    return data;
  },
  async toggle(id, done) {
    // Mark item as done/undone
    const { error } = await db.from('checklist_items').update({ done }).eq('id', id);
    if (error) {
      console.error('[KartPit] Error toggling checklist item:', error.message);
      throw error;
    }
  },
  async add(item, category) {
    const { error } = await db.from('checklist_items').insert({ item, category, done: false });
    if (error) {
      console.error('[KartPit] Error adding checklist item:', error.message);
      throw error;
    }
  },
  async resetAll() {
    // Uncheck all items at start of new race day
    const { error } = await db.from('checklist_items').update({ done: false }).neq('id', 0);
    if (error) {
      console.error('[KartPit] Error resetting checklist:', error.message);
      throw error;
    }
  },
  async remove(id) {
    const { error } = await db.from('checklist_items').delete().eq('id', id);
    if (error) {
      console.error('[KartPit] Error deleting checklist item:', error.message);
      throw error;
    }
  }
};

// ── Agenda - Race schedule and events ──────────────────────────
// Keeps team synchronized on timing for practices, races, breaks
// Can be updated live as schedule changes during the day
const Agenda = {
  async getAll() {
    const { data, error } = await db.from('agenda').select('*').order('time');
    if (error) {
      console.error('[KartPit] Error fetching agenda:', error.message);
      throw error;
    }
    return data;
  },
  async add(time, event, type) {
    const { error } = await db.from('agenda').insert({ time, event, type });
    if (error) {
      console.error('[KartPit] Error adding agenda item:', error.message);
      throw error;
    }
  },
  async remove(id) {
    const { error } = await db.from('agenda').delete().eq('id', id);
    if (error) {
      console.error('[KartPit] Error deleting agenda item:', error.message);
      throw error;
    }
  }
};

// ── Pitstops - Pit crew activity log ───────────────────────────
// Records pit stop times, maintenance performed, notes
// Helps analyze pit efficiency and identify mechanical issues
const Pitstops = {
  async getAll() {
    const { data, error } = await db.from('pitstops').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('[KartPit] Error fetching pitstops:', error.message);
      throw error;
    }
    return data;
  },
  async save(duration_ms, label, notes) {
    const { error } = await db.from('pitstops').insert({ duration_ms, label, notes });
    if (error) {
      console.error('[KartPit] Error saving pitstop:', error.message);
      throw error;
    }
  },
  async remove(id) {
    const { error } = await db.from('pitstops').delete().eq('id', id);
    if (error) {
      console.error('[KartPit] Error deleting pitstop:', error.message);
      throw error;
    }
  }
};

// ── Tracks - Race track info ──────────────────────────────────
// Stores info about each track (length, layout, location, etc.)
// Allows drivers to compare performance across different tracks
const Tracks = {
  async getAll() {
    const { data, error } = await db.from('tracks').select('*').order('name');
    if (error) {
      console.error('[KartPit] Error fetching tracks:', error.message);
      throw error;
    }
    return data;
  },
  async add(track) {
    const { error } = await db.from('tracks').insert(track);
    if (error) {
      console.error('[KartPit] Error adding track:', error.message);
      throw error;
    }
  },
  async remove(id) {
    const { error } = await db.from('tracks').delete().eq('id', id);
    if (error) {
      console.error('[KartPit] Error deleting track:', error.message);
      throw error;
    }
  }
};

// ── Bandenspanning - Tire pressure monitoring ──────────────────
// Track tire pressures for each pit stop to spot patterns
// Helps with setup optimization and detecting tire wear
const TirePressures = {
  async getAll() {
    const { data, error } = await db.from('tire_pressures')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('[KartPit] Error fetching tire pressures:', error.message);
      throw error;
    }
    return data;
  },
  async getByPitstop(pitstopId) {
    const { data, error } = await db.from('tire_pressures')
      .select('*')
      .eq('pitstop_id', pitstopId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('[KartPit] Error fetching tire pressures for pitstop:', error.message);
      throw error;
    }
    return data || [];
  },
  async add(trackId, pitstopId, lv, rv, la, ra) {
    const { error } = await db.from('tire_pressures').insert({
      track_id:      trackId,
      pitstop_id:    pitstopId,
      links_voor:    lv,
      rechts_voor:   rv,
      links_achter:  la,
      rechts_achter: ra
    });
    if (error) {
      console.error('[KartPit] Error recording tire pressures:', error.message);
      throw error;
    }
  },
  async remove(id) {
    const { error } = await db.from('tire_pressures').delete().eq('id', id);
    if (error) {
      console.error('[KartPit] Error deleting tire pressure record:', error.message);
      throw error;
    }
  }
};

// ── Tasks (Takenlijst) - Daily work assignments ────────────────
// Crew assigns tasks to team members (tire checks, fuel, etc.)
// Can be marked done and categorized for organization
const Tasks = {
  async getAll() {
    const { data, error } = await db.from('tasks').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('[KartPit] Error fetching tasks:', error.message);
      throw error;
    }
    return data;
  },
  async add(description, person, category) {
    const { error } = await db.from('tasks').insert({ description, person, category, done: false });
    if (error) {
      console.error('[KartPit] Error adding task:', error.message);
      throw error;
    }
    console.log('[KartPit] Task added for', person);
  },
  async remove(id) {
    const { error } = await db.from('tasks').delete().eq('id', id);
    if (error) {
      console.error('[KartPit] Error deleting task:', error.message);
      throw error;
    }
  },
  async setDone(id, done) {
    const { error } = await db.from('tasks').update({ done }).eq('id', id);
    if (error) {
      console.error('[KartPit] Error updating task status:', error.message);
      throw error;
    }
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

// ── Lap Times - Driver performance tracking ────────────────────
// Records lap times for drivers during qualifying and races
// Helps identify fastest laps, setup issues, and driver progress
const LapTimes = {
  async getAll() {
    const { data, error } = await db.from('lap_times').select('*').order('lap_number');
    if (error) {
      console.error('[KartPit] Error fetching lap times:', error.message);
      throw error;
    }
    return data;
  },
  async add(driver, lap_number, lap_ms) {
    const { error } = await db.from('lap_times').insert({ driver, lap_number, lap_ms });
    if (error) {
      console.error('[KartPit] Error recording lap time:', error.message);
      throw error;
    }
    console.log(`[KartPit] Lap recorded: ${driver} - Lap ${lap_number} (${lap_ms}ms)`);
  },
  async remove(id) {
    const { error } = await db.from('lap_times').delete().eq('id', id);
    if (error) {
      console.error('[KartPit] Error deleting lap time:', error.message);
      throw error;
    }
  }
};

const knopje1 = document.getElementById("toevoegknop");
if (knopje1) knopje1.addEventListener('click', () => {
  const driver = Name1, lap_ms = Time, lap_number = Rondes;
  LapTimes.add(driver, lap_number, lap_ms);
});

const knopje2 = document.getElementById("toevoegknop2");
if (knopje2) knopje2.addEventListener('click', () => {
  const driver = Name2, lap_ms = Time, lap_number = RondesB;
  LapTimes.add(driver, lap_number, lap_ms);
});

const knopje3 = document.getElementById("toevoegknop3");
if (knopje3) knopje3.addEventListener('click', () => {
  const driver = Name3, lap_ms = Time, lap_number = RondesC;
  LapTimes.add(driver, lap_number, lap_ms);
});

const knopje4 = document.getElementById("toevoegknop4");
if (knopje4) knopje4.addEventListener('click', () => {
  const driver = Name4, lap_ms = Time, lap_number = RondesD;
  LapTimes.add(driver, lap_number, lap_ms);
});
// ── Sign out helper ─────────────────────────────────────────────
async function signOut() {
  await db.auth.signOut();
  window.location.href = "login.html";
}
