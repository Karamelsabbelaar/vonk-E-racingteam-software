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
const SUPABASE_URL  = 'JOUW_SUPABASE_URL_HIER';   // bijv. https://xyzxyz.supabase.co
const SUPABASE_KEY  = 'JOUW_SUPABASE_ANON_KEY_HIER'; // de lange publieke sleutel

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
  }
};
