/**
 * KartPit — Offline / Online Sync
 *
 * Hoe het werkt:
 *  - Bij elke GET wordt eerst Supabase geprobeerd en het resultaat lokaal opgeslagen.
 *  - Als Supabase niet bereikbaar is (geen wifi/internet), wordt de lokale cache gebruikt.
 *  - Schrijfacties die mislukken worden in een wachtrij gezet en automatisch
 *    opnieuw verstuurd zodra de verbinding terugkomt.
 */

'use strict';

const OfflineSync = (() => {
  const DB_NAME = 'kartpit';
  const DB_VER  = 1;
  const TABLES  = ['checklist_items', 'agenda', 'pitstops', 'tracks'];
  let _idb    = null;
  let _online = navigator.onLine;

  // ── Netwerk fout herkennen ─────────────────────────────────────
  // "Failed to fetch" is een TypeError die optreedt bij geen verbinding.
  function isNetworkError(e) {
    return e instanceof TypeError ||
           (e && typeof e.message === 'string' &&
            (e.message.includes('fetch') || e.message.includes('network') ||
             e.message.includes('Failed') || e.message.includes('NetworkError')));
  }

  // ── IndexedDB helpers ──────────────────────────────────────────

  function openIDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = e => {
        const d = e.target.result;
        TABLES.forEach(t => {
          if (!d.objectStoreNames.contains(t))
            d.createObjectStore(t, { keyPath: 'id' });
        });
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
        if (cursor) {
          cursor.update({ ...cursor.value, ...changes });
          cursor.continue();
        }
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

  // ── Pending ops queue ──────────────────────────────────────────

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

  // ── Sync: replay queue to Supabase ────────────────────────────

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
    const queries = [
      { table: 'checklist_items', fn: () => db.from('checklist_items').select('*').order('id') },
      { table: 'agenda',          fn: () => db.from('agenda').select('*').order('time') },
      { table: 'pitstops',        fn: () => db.from('pitstops').select('*').order('created_at', { ascending: false }) },
      { table: 'tracks',          fn: () => db.from('tracks').select('*').order('name') },
    ];
    for (const { table, fn } of queries) {
      try {
        const { data, error } = await fn();
        if (!error && data) {
          await idbClear(table);
          await idbPutAll(table, data);
        }
      } catch { /* negeer individuele fouten */ }
    }
  }

  // ── Trigger UI refresh after offline writes ────────────────────

  function _notifyRefresh(table) {
    if (table === 'checklist_items' || table === 'all') {
      if (typeof loadChecklist === 'function') loadChecklist();
    }
    if (table === 'pitstops' || table === 'all') {
      if (typeof PitTimer !== 'undefined' && PitTimer.load) PitTimer.load();
    }
    if (table === 'agenda' || table === 'all') {
      if (typeof loadAgendaPreview === 'function') loadAgendaPreview();
      if (typeof renderAgenda === 'function') renderAgenda();
    }
    if (table === 'tracks' || table === 'all') {
      if (typeof renderTracks === 'function') renderTracks();
    }
  }

  function _tempId() {
    return Date.now() * 1000 + Math.floor(Math.random() * 1000);
  }

  // ── Sync banner UI ─────────────────────────────────────────────

  function showBanner(online) {
    const banner = document.getElementById('sync-banner');
    if (!banner) return;
    if (online) {
      banner.textContent = '✓ Verbinding hersteld – synchroniseren…';
      banner.className   = 'sync-banner sync-online';
      setTimeout(() => { banner.className = 'sync-banner sync-hidden'; }, 3500);
    } else {
      banner.textContent = '⚠ Geen verbinding – wijzigingen worden lokaal opgeslagen';
      banner.className   = 'sync-banner sync-offline';
    }
  }

  // ── Init ───────────────────────────────────────────────────────

  async function init() {
    await openIDB();

    const banner = document.createElement('div');
    banner.id        = 'sync-banner';
    banner.className = 'sync-banner sync-hidden';
    document.body.prepend(banner);

    // Probeer bij het opstarten data te downloaden; als dat mislukt tonen we de offline banner.
    try {
      await syncPending();
      await refreshCaches();
    } catch {
      _online = false;
      showBanner(false);
    }

    window.addEventListener('offline', () => {
      _online = false;
      showBanner(false);
    });

    window.addEventListener('online', async () => {
      _online = true;
      showBanner(true);
      try { await syncPending(); } catch { /* stil falen */ }
    });
  }

  return {
    isOnline:      () => _online,
    isNetworkError,
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

// ──────────────────────────────────────────────────────────────────
// Offline-aware wrappers.
//
// Lezen:  probeer Supabase → sla op in cache → gooi bij netwerk-
//         fout de cache terug (in plaats van de fout te gooien).
// Schrijven: probeer Supabase → bij netwerk-fout: sla lokaal op
//            en zet in wachtrij voor later.
// ──────────────────────────────────────────────────────────────────

// ─── Checklist ────────────────────────────────────────────────────
const _rawChecklist = { ...Checklist };

Object.assign(Checklist, {
  async getAll() {
    try {
      const data = await _rawChecklist.getAll();
      await OfflineSync.idbClear('checklist_items');
      await OfflineSync.idbPutAll('checklist_items', data);
      return data;
    } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        const cached = await OfflineSync.idbGetAll('checklist_items');
        return cached.sort((a, b) => a.id - b.id);
      }
      throw e;
    }
  },

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
    try {
      await _rawChecklist.add(item, category);
    } catch (e) {
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
    try {
      await _rawChecklist.resetAll();
    } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        await OfflineSync.idbUpdateAll('checklist_items', { done: false });
        await OfflineSync.enqueue({ table: 'checklist_items', op: 'update', data: { done: false }, filter: { neqId: 0 } });
        OfflineSync._notifyRefresh('checklist_items');
        return;
      }
      throw e;
    }
  },

  async remove(id) {
    try {
      await _rawChecklist.remove(id);
      await OfflineSync.idbDelete('checklist_items', id);
    } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        await OfflineSync.idbDelete('checklist_items', id);
        await OfflineSync.enqueue({ table: 'checklist_items', op: 'delete', filter: { id } });
        OfflineSync._notifyRefresh('checklist_items');
        return;
      }
      throw e;
    }
  }
});

// ─── Agenda ───────────────────────────────────────────────────────
const _rawAgenda = { ...Agenda };

Object.assign(Agenda, {
  async getAll() {
    try {
      const data = await _rawAgenda.getAll();
      await OfflineSync.idbClear('agenda');
      await OfflineSync.idbPutAll('agenda', data);
      return data;
    } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        const cached = await OfflineSync.idbGetAll('agenda');
        return cached.sort((a, b) => String(a.time).localeCompare(String(b.time)));
      }
      throw e;
    }
  },

  async add(time, event, type) {
    try {
      await _rawAgenda.add(time, event, type);
    } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        await OfflineSync.idbPut('agenda', { id: OfflineSync._tempId(), time, event, type });
        await OfflineSync.enqueue({ table: 'agenda', op: 'insert', data: { time, event, type } });
        OfflineSync._notifyRefresh('agenda');
        return;
      }
      throw e;
    }
  },

  async remove(id) {
    try {
      await _rawAgenda.remove(id);
      await OfflineSync.idbDelete('agenda', id);
    } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        await OfflineSync.idbDelete('agenda', id);
        await OfflineSync.enqueue({ table: 'agenda', op: 'delete', filter: { id } });
        OfflineSync._notifyRefresh('agenda');
        return;
      }
      throw e;
    }
  }
});

// ─── Pitstops ─────────────────────────────────────────────────────
const _rawPitstops = { ...Pitstops };

Object.assign(Pitstops, {
  async getAll() {
    try {
      const data = await _rawPitstops.getAll();
      await OfflineSync.idbClear('pitstops');
      await OfflineSync.idbPutAll('pitstops', data);
      return data;
    } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        const cached = await OfflineSync.idbGetAll('pitstops');
        return cached.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
      throw e;
    }
  },

  async save(duration_ms, label, notes) {
    try {
      await _rawPitstops.save(duration_ms, label, notes);
    } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        await OfflineSync.idbPut('pitstops', {
          id: OfflineSync._tempId(),
          duration_ms, label, notes,
          created_at: new Date().toISOString()
        });
        await OfflineSync.enqueue({ table: 'pitstops', op: 'insert', data: { duration_ms, label, notes } });
        OfflineSync._notifyRefresh('pitstops');
        return;
      }
      throw e;
    }
  },

  async remove(id) {
    try {
      await _rawPitstops.remove(id);
      await OfflineSync.idbDelete('pitstops', id);
    } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        await OfflineSync.idbDelete('pitstops', id);
        await OfflineSync.enqueue({ table: 'pitstops', op: 'delete', filter: { id } });
        OfflineSync._notifyRefresh('pitstops');
        return;
      }
      throw e;
    }
  }
});

// ─── Tracks ───────────────────────────────────────────────────────
const _rawTracks = { ...Tracks };

Object.assign(Tracks, {
  async getAll() {
    try {
      const data = await _rawTracks.getAll();
      await OfflineSync.idbClear('tracks');
      await OfflineSync.idbPutAll('tracks', data);
      return data;
    } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        const cached = await OfflineSync.idbGetAll('tracks');
        return cached.sort((a, b) => String(a.name).localeCompare(String(b.name)));
      }
      throw e;
    }
  },

  async add(track) {
    try {
      await _rawTracks.add(track);
    } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        await OfflineSync.idbPut('tracks', { id: OfflineSync._tempId(), ...track });
        await OfflineSync.enqueue({ table: 'tracks', op: 'insert', data: track });
        OfflineSync._notifyRefresh('tracks');
        return;
      }
      throw e;
    }
  },

  async remove(id) {
    try {
      await _rawTracks.remove(id);
      await OfflineSync.idbDelete('tracks', id);
    } catch (e) {
      if (OfflineSync.isNetworkError(e)) {
        await OfflineSync.idbDelete('tracks', id);
        await OfflineSync.enqueue({ table: 'tracks', op: 'delete', filter: { id } });
        OfflineSync._notifyRefresh('tracks');
        return;
      }
      throw e;
    }
  }
});

// ── Bootstrap ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => OfflineSync.init());
