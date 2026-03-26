/**
 * KartPit - Offline / Online Sync
 *
 * Hoe het werkt:
 *  - Bij elke GET wordt eerst Supabase geprobeerd en het resultaat lokaal opgeslagen.
 *  - Als Supabase niet bereikbaar is (geen wifi/internet), wordt de lokale cache gebruikt.
 *  - Schrijfacties die mislukken worden in een wachtrij gezet en automatisch
 *    opnieuw verstuurd zodra de verbinding terugkomt.
 *
 * Nieuw module/tabel toevoegen:
 *  1. Roep VOOR OfflineSync.init() aan:
 *       OfflineSync.registerTable('jouw_tabel', {
 *         query: () => db.from('jouw_tabel').select('*').order('id'),
 *         sort:  (a, b) => a.id - b.id,
 *       });
 *  2. Registreer UI-refresh callbacks:
 *       OfflineSync.registerRefreshHandler('jouw_tabel', renderJouwDing);
 *  3. Verhoog DB_VER met 1 in offline.js (zodat IDB de nieuwe store aanmaakt).
 *  4. Wrap je module (generieke getAll + remove):
 *       const _raw = OfflineSync.makeOfflineWrapper(JouwModule, 'jouw_tabel');
 *       Object.assign(JouwModule, { async add(...) { ... } });
 *
 * Dark / light mode:
 *  Alle componenten gebruiken CSS-variabelen (var(--bg), var(--text), var(--card) enz.).
 *  Nieuwe componenten krijgen automatisch dark+light mode door dezelfde variabelen te gebruiken.
 *  Zie :root en [data-theme="dark"] in style.css.
 */

'use strict';

const OfflineSync = (() => {
  const DB_NAME = 'kartpit';
  const DB_VER  = 2;   // verhoog bij elke nieuwe tabel
  let _idb    = null;
  let _online = navigator.onLine;

  // Per-tabel registry: Map<naam, { query, sort, refreshFns[] }>
  const _reg = new Map();

  // ---- Registratie API (aanroepen voor init()) ------------------

  function registerTable(name, { query, sort } = {}) {
    const prev = _reg.get(name) || { refreshFns: [] };
    _reg.set(name, {
      query: query || (() => db.from(name).select('*').order('id')),
      sort:  sort  || ((a, b) => (a.id < b.id ? -1 : 1)),
      refreshFns: prev.refreshFns,
    });
  }

  function registerRefreshHandler(name, ...fns) {
    const entry = _reg.get(name);
    if (!entry) { console.warn('[KartPit offline] Onbekende tabel:', name); return; }
    entry.refreshFns.push(...fns);
  }

  // ---- Netwerk fout herkennen -----------------------------------

  function isNetworkError(e) {
    return e instanceof TypeError ||
           (e && typeof e.message === 'string' &&
            (e.message.includes('fetch') || e.message.includes('network') ||
             e.message.includes('Failed') || e.message.includes('NetworkError')));
  }

  // ---- IndexedDB helpers ---------------------------------------

  function openIDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = e => {
        const d = e.target.result;
        for (const name of _reg.keys()) {
          if (!d.objectStoreNames.contains(name))
            d.createObjectStore(name, { keyPath: 'id' });
        }
        if (!d.objectStoreNames.contains('pending_ops'))
          d.createObjectStore('pending_ops', { keyPath: '_qid', autoIncrement: true });
      };
      req.onsuccess = e => { _idb = e.target.result; resolve(_idb); };
      req.onerror   = e => reject(e.target.error);
    });
  }

  async function idb() {
    if (!_idb) await openIDB();
    return _idb;
  }

  async function idbGetAll(store) {
    const d = await idb();
    return new Promise((res, rej) => {
      const req = d.transaction(store, 'readonly').objectStore(store).getAll();
      req.onsuccess = () => res(req.result || []);
      req.onerror   = () => rej(req.error);
    });
  }

  async function idbPutAll(store, records) {
    if (!records || !records.length) return;
    const d = await idb();
    return new Promise((res, rej) => {
      const tx = d.transaction(store, 'readwrite');
      const os = tx.objectStore(store);
      records.forEach(r => os.put(r));
      tx.oncomplete = res;
      tx.onerror    = () => rej(tx.error);
    });
  }

  async function idbPut(store, record) {
    const d = await idb();
    return new Promise((res, rej) => {
      const req = d.transaction(store, 'readwrite').objectStore(store).put(record);
      req.onsuccess = res;
      req.onerror   = () => rej(req.error);
    });
  }

  async function idbDelete(store, key) {
    const d = await idb();
    return new Promise((res, rej) => {
      const req = d.transaction(store, 'readwrite').objectStore(store).delete(key);
      req.onsuccess = res;
      req.onerror   = () => rej(req.error);
    });
  }

  async function idbUpdate(store, key, changes) {
    const d = await idb();
    return new Promise((res, rej) => {
      const tx = d.transaction(store, 'readwrite');
      const os = tx.objectStore(store);
      const getReq = os.get(key);
      getReq.onsuccess = () => {
        if (getReq.result) os.put({ ...getReq.result, ...changes });
      };
      tx.oncomplete = res;
      tx.onerror    = () => rej(tx.error);
    });
  }

  async function idbUpdateAll(store, changes) {
    const d = await idb();
    return new Promise((res, rej) => {
      const tx = d.transaction(store, 'readwrite');
      const os = tx.objectStore(store);
      const req = os.openCursor();
      req.onsuccess = e => {
        const cursor = e.target.result;
        if (cursor) { cursor.update({ ...cursor.value, ...changes }); cursor.continue(); }
      };
      tx.oncomplete = res;
      tx.onerror    = () => rej(tx.error);
    });
  }

  async function idbClear(store) {
    const d = await idb();
    return new Promise((res, rej) => {
      const req = d.transaction(store, 'readwrite').objectStore(store).clear();
      req.onsuccess = res;
      req.onerror   = () => rej(req.error);
    });
  }

  // ---- Pending ops queue ---------------------------------------

  async function enqueue(op) {
    const d = await idb();
    return new Promise((res, rej) => {
      const req = d.transaction('pending_ops', 'readwrite')
                    .objectStore('pending_ops')
                    .add({ ...op, _ts: Date.now() });
      req.onsuccess = () => res(req.result);
      req.onerror   = () => rej(req.error);
    });
  }

  async function dequeueOp(qid) {
    const d = await idb();
    return new Promise((res, rej) => {
      const req = d.transaction('pending_ops', 'readwrite')
                    .objectStore('pending_ops').delete(qid);
      req.onsuccess = res;
      req.onerror   = () => rej(req.error);
    });
  }

  // ---- Sync: replay queue to Supabase --------------------------

  async function syncPending() {
    const ops = await idbGetAll('pending_ops');
    if (!ops.length) return;
    ops.sort((a, b) => a._ts - b._ts);
    for (const op of ops) {
      try {
        await replayOp(op);
        await dequeueOp(op._qid);
      } catch (e) {
        console.warn('[KartPit offline] Sync mislukt, wordt later opnieuw geprobeerd:', op, e);
        break;
      }
    }
    await refreshCaches();
    _notifyRefresh('all');
  }

  async function replayOp({ table, op, data, filter }) {
    switch (op) {
      case 'insert': {
        const { error } = await db.from(table).insert(data);
        if (error) throw error;
        break;
      }
      case 'update': {
        let q = db.from(table).update(data);
        if (filter && filter.neqId !== undefined) q = q.neq('id', filter.neqId);
        else if (filter && filter.id !== undefined) q = q.eq('id', filter.id);
        const { error } = await q;
        if (error) throw error;
        break;
      }
      case 'delete': {
        const { error } = await db.from(table).delete().eq('id', filter.id);
        if (error) throw error;
        break;
      }
    }
  }

  async function refreshCaches() {
    for (const [table, { query }] of _reg) {
      try {
        const { data, error } = await query();
        if (!error && data) {
          await idbClear(table);
          await idbPutAll(table, data);
        }
      } catch { /* negeer individuele fouten */ }
    }
  }

  // ---- UI refresh na sync --------------------------------------

  function _notifyRefresh(table) {
    const run = entry => entry.refreshFns.forEach(fn => typeof fn === 'function' && fn());
    if (table === 'all') {
      for (const entry of _reg.values()) run(entry);
    } else {
      const entry = _reg.get(table);
      if (entry) run(entry);
    }
  }

  function _tempId() {
    return Date.now() * 1000 + Math.floor(Math.random() * 1000);
  }

  // ---- Sync banner UI ------------------------------------------

  const _SVG = {
    up:    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;vertical-align:middle;margin-right:6px"><path d="M8 12V4M4 7l4-4 4 4"/><path d="M3 14h10" stroke-width="1.5" opacity=".5"/></svg>',
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;vertical-align:middle;margin-right:6px"><polyline points="2 8 6 12 14 4"/></svg>',
    warn:  '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;vertical-align:middle;margin-right:6px"><path d="M8 2 L14 14 H2 Z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="12.5" r=".6" fill="currentColor" stroke="none"/></svg>',
  };

  function showBanner(state, extra) {
    const banner = document.getElementById('sync-banner');
    if (!banner) return;
    if (state === 'syncing') {
      const count = extra ? ` (${extra} wijziging${extra !== 1 ? 'en' : ''})` : '';
      banner.innerHTML = _SVG.up + `Synchroniseren…${count}`;
      banner.className = 'sync-banner sync-syncing';
    } else if (state === 'done') {
      banner.innerHTML = _SVG.check + 'Gesynchroniseerd';
      banner.className = 'sync-banner sync-online';
      setTimeout(() => { banner.className = 'sync-banner sync-hidden'; }, 2500);
    } else if (state === 'offline') {
      banner.innerHTML = _SVG.warn + 'Geen verbinding – wijzigingen worden lokaal opgeslagen';
      banner.className = 'sync-banner sync-offline';
    }
  }

  // ---- Generic offline wrapper factory -------------------------
  // Voegt generieke getAll() en remove() toe aan een module-object.
  // Geeft het originele (unwrapped) object terug voor extra methoden.

  function makeOfflineWrapper(globalObj, tableName) {
    const raw   = { ...globalObj };
    const entry = _reg.get(tableName);
    const sort  = entry && entry.sort;
    let _swrT   = 0; // timestamp of last background Supabase refresh (per-page-visit)
    Object.assign(globalObj, {
      async getAll() {
        let cached;
        try { cached = await idbGetAll(tableName); } catch (_) { cached = []; }

        if (cached.length > 0) {
          // IDB-first: return stale data immediately, refresh Supabase in background.
          // Debounce with 30s to prevent re-fetch loops from _notifyRefresh callbacks.
          const now = Date.now();
          if (now - _swrT > 30_000) {
            _swrT = now;
            raw.getAll().then(async data => {
              await idbClear(tableName);
              await idbPutAll(tableName, data);
              _notifyRefresh(tableName);
            }).catch(() => {});
          }
          return sort ? [...cached].sort(sort) : cached;
        }

        // IDB empty — first-ever load, must wait for network
        _swrT = Date.now();
        try {
          const data = await raw.getAll();
          await idbClear(tableName);
          await idbPutAll(tableName, data);
          return data;
        } catch (e) {
          if (isNetworkError(e)) return [];
          throw e;
        }
      },
      async remove(id) {
        try {
          await raw.remove(id);
          await idbDelete(tableName, id);
        } catch (e) {
          if (isNetworkError(e)) {
            await idbDelete(tableName, id);
            await enqueue({ table: tableName, op: 'delete', filter: { id } });
            _notifyRefresh(tableName);
            return;
          }
          throw e;
        }
      },
    });
    return raw;
  }

  // ---- Init ----------------------------------------------------

  async function _doSync() {
    const pending = await idbGetAll('pending_ops');
    if (pending.length) showBanner('syncing', pending.length);
    await syncPending();
    await refreshCaches();
    if (pending.length) {
      showBanner('done');
      _notifyRefresh('all');
    }
  }

  async function init() {
    await openIDB();

    const banner = document.createElement('div');
    banner.id        = 'sync-banner';
    banner.className = 'sync-banner sync-hidden';
    document.body.prepend(banner);

    try {
      await _doSync();
    } catch {
      _online = false;
      showBanner('offline');
    }

    window.addEventListener('offline', () => {
      _online = false;
      showBanner('offline');
    });

    window.addEventListener('online', async () => {
      _online = true;
      try { await _doSync(); } catch { /* stil falen */ }
    });
  }

  return {
    isOnline:              () => _online,
    isNetworkError,
    registerTable,
    registerRefreshHandler,
    makeOfflineWrapper,
    idbGetAll,
    idbPutAll,
    idbPut,
    idbDelete,
    idbUpdate,
    idbUpdateAll,
    idbClear,
    enqueue,
    init,
    syncPending,
    refreshCaches,
    _tempId,
    _notifyRefresh,
  };
})();

// =================================================================
// Registratie van bestaande tabellen
//
// Voeg hier nieuwe tabellen toe VOOR OfflineSync.init().
// Verhoog DB_VER met 1 bij elke nieuwe tabel!
// =================================================================

OfflineSync.registerTable('checklist_items', {
  query: () => db.from('checklist_items').select('*').order('id'),
  sort:  (a, b) => a.id - b.id,
});
OfflineSync.registerRefreshHandler('checklist_items',
  () => typeof loadChecklist === 'function' && loadChecklist(),
);

OfflineSync.registerTable('agenda', {
  query: () => db.from('agenda').select('*').order('time'),
  sort:  (a, b) => String(a.time).localeCompare(String(b.time)),
});
OfflineSync.registerRefreshHandler('agenda',
  () => typeof loadAgendaPreview === 'function' && loadAgendaPreview(),
  () => typeof renderAgenda      === 'function' && renderAgenda(),
);

OfflineSync.registerTable('pitstops', {
  query: () => db.from('pitstops').select('*').order('created_at', { ascending: false }),
  sort:  (a, b) => new Date(b.created_at) - new Date(a.created_at),
});
OfflineSync.registerRefreshHandler('pitstops',
  () => typeof PitTimer !== 'undefined' && typeof PitTimer.load === 'function' && PitTimer.load(),
);

OfflineSync.registerTable('tracks', {
  query: () => db.from('tracks').select('*').order('name'),
  sort:  (a, b) => String(a.name).localeCompare(String(b.name)),
});
OfflineSync.registerRefreshHandler('tracks',
  () => typeof renderTracks === 'function' && renderTracks(),
);

// =================================================================
// Offline-aware wrappers
//
// makeOfflineWrapper() voegt generieke getAll() + remove() toe.
// Tabel-specifieke methoden worden er daarna aan toegevoegd.
//
// Nieuw module toevoegen:
//   const _raw = OfflineSync.makeOfflineWrapper(MijnModule, 'mijn_tabel');
//   Object.assign(MijnModule, { async add(data) { ... } });
// =================================================================

// --- Checklist ---------------------------------------------------
const _rawChecklist = OfflineSync.makeOfflineWrapper(Checklist, 'checklist_items');
Object.assign(Checklist, {
  async toggle(id, done) {
    try {
      await _rawChecklist.toggle(id, done);
      await OfflineSync.idbUpdate('checklist_items', id, { done });
    } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        await OfflineSync.idbUpdate('checklist_items', id, { done });
        await OfflineSync.enqueue({ table: 'checklist_items', op: 'update', data: { done }, filter: { id } });
        return;
      }
      throw e;
    }
  },

  async add(item, category) {
    try { await _rawChecklist.add(item, category); } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        await OfflineSync.idbPut('checklist_items', { id: OfflineSync._tempId(), item, category, done: false });
        await OfflineSync.enqueue({ table: 'checklist_items', op: 'insert', data: { item, category, done: false } });
        OfflineSync._notifyRefresh('checklist_items');
        return;
      }
      throw e;
    }
  },

  async resetAll() {
    try { await _rawChecklist.resetAll(); } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        await OfflineSync.idbUpdateAll('checklist_items', { done: false });
        await OfflineSync.enqueue({ table: 'checklist_items', op: 'update', data: { done: false }, filter: { neqId: 0 } });
        OfflineSync._notifyRefresh('checklist_items');
        return;
      }
      throw e;
    }
  },
});

// --- Agenda ------------------------------------------------------
const _rawAgenda = OfflineSync.makeOfflineWrapper(Agenda, 'agenda');
Object.assign(Agenda, {
  async add(time, event, type) {
    try { await _rawAgenda.add(time, event, type); } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        await OfflineSync.idbPut('agenda', { id: OfflineSync._tempId(), time, event, type });
        await OfflineSync.enqueue({ table: 'agenda', op: 'insert', data: { time, event, type } });
        OfflineSync._notifyRefresh('agenda');
        return;
      }
      throw e;
    }
  },
});

// --- Pitstops ----------------------------------------------------
const _rawPitstops = OfflineSync.makeOfflineWrapper(Pitstops, 'pitstops');
Object.assign(Pitstops, {
  async save(duration_ms, label, notes) {
    try { await _rawPitstops.save(duration_ms, label, notes); } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        await OfflineSync.idbPut('pitstops', {
          id: OfflineSync._tempId(), duration_ms, label, notes,
          created_at: new Date().toISOString(),
        });
        await OfflineSync.enqueue({ table: 'pitstops', op: 'insert', data: { duration_ms, label, notes } });
        OfflineSync._notifyRefresh('pitstops');
        return;
      }
      throw e;
    }
  },
});

// --- Tracks ------------------------------------------------------
const _rawTracks = OfflineSync.makeOfflineWrapper(Tracks, 'tracks');
Object.assign(Tracks, {
  async add(track) {
    try { await _rawTracks.add(track); } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        await OfflineSync.idbPut('tracks', { id: OfflineSync._tempId(), ...track });
        await OfflineSync.enqueue({ table: 'tracks', op: 'insert', data: track });
        OfflineSync._notifyRefresh('tracks');
        return;
      }
      throw e;
    }
  },
});
