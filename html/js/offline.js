/**
 * KartPit Offline Mode
 * 
 * Handles local caching and syncing with Supabase.
 * When offline, all data is stored locally and synced when connection returns.
 */

'use strict';

const OfflineSync = (() => {
  const DB_NAME = 'kartpit';
  const DB_VERSION = 2;
  
  let indexedDB = null;
  let isOnline = navigator.onLine;
  
  // Keep track of registered tables and their refresh handlers
  const tables = new Map();

  
  // Register a table for offline syncing
  function registerTable(name, { query, sort } = {}) {
    const existing = tables.get(name) || { refreshFns: [] };
    tables.set(name, {
      query: query || (() => db.from(name).select('*').order('id')),
      sort: sort || ((a, b) => (a.id < b.id ? -1 : 1)),
      refreshFns: existing.refreshFns,
    });
  }

  // Add a handler to refresh the UI when this table is synced
  function registerRefreshHandler(name, ...handlers) {
    const entry = tables.get(name);
    if (!entry) { 
      console.warn('Table not registered:', name); 
      return; 
    }
    entry.refreshFns.push(...handlers);
  }

  // Check if an error is network-related
  function isNetworkError(err) {
    return err instanceof TypeError ||
           (err && typeof err.message === 'string' &&
            (err.message.includes('fetch') || 
             err.message.includes('network') ||
             err.message.includes('Failed') || 
             err.message.includes('NetworkError')));
  }

  
  // Open or get the IndexedDB database
  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onupgradeneeded = (event) => {
        const database = event.target.result;
        
        // Create stores for registered tables
        for (const tableName of tables.keys()) {
          if (!database.objectStoreNames.contains(tableName)) {
            database.createObjectStore(tableName, { keyPath: 'id' });
          }
        }
        
        // Create queue for pending operations
        if (!database.objectStoreNames.contains('pending_ops')) {
          database.createObjectStore('pending_ops', { keyPath: '_qid', autoIncrement: true });
        }
      };
      
      request.onsuccess = (event) => {
        indexedDB = event.target.result;
        resolve(indexedDB);
      };
      
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async function getDB() {
    if (!indexedDB) await openDatabase();
    return indexedDB;
  }

  async function getAll(storeName) {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveAll(storeName, records) {
    if (!records || !records.length) return;
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      records.forEach(record => store.put(record));
      
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function saveOne(storeName, record) {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const request = database.transaction(storeName, 'readwrite')
        .objectStore(storeName)
        .put(record);
      
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
    });
  }

  async function deleteOne(storeName, key) {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const request = database.transaction(storeName, 'readwrite')
        .objectStore(storeName)
        .delete(key);
      
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
    });
  }

  async function updateOne(storeName, key, changes) {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const getRequest = store.get(key);
      
      getRequest.onsuccess = () => {
        if (getRequest.result) {
          store.put({ ...getRequest.result, ...changes });
        }
      };
      
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function clearStore(storeName) {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const request = database.transaction(storeName, 'readwrite')
        .objectStore(storeName)
        .clear();
      
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
    });
  }

  
  async function queueOperation(operation) {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const request = database.transaction('pending_ops', 'readwrite')
        .objectStore('pending_ops')
        .add({ ...operation, _timestamp: Date.now() });
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function removeFromQueue(queueId) {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const request = database.transaction('pending_ops', 'readwrite')
        .objectStore('pending_ops')
        .delete(queueId);
      
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
    });
  }

  async function syncQueue() {
    const operations = await getAll('pending_ops');
    if (!operations.length) return;
    
    // Sort by timestamp so we apply changes in order
    operations.sort((a, b) => a._timestamp - b._timestamp);
    
    for (const op of operations) {
      try {
        await applyOperation(op);
        await removeFromQueue(op._qid);
      } catch (error) {
        console.warn('Sync failed, will retry:', op, error);
        break;
      }
    }
    
    await refreshAllCaches();
    notifyRefresh('all');
  }

  async function applyOperation({ table, op, data, filter }) {
    switch (op) {
      case 'insert': {
        const { error } = await db.from(table).insert(data);
        if (error) throw error;
        break;
      }
      case 'update': {
        let query = db.from(table).update(data);
        if (filter?.id) query = query.eq('id', filter.id);
        else if (filter?.neqId) query = query.neq('id', filter.neqId);
        const { error } = await query;
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

  async function refreshAllCaches() {
    for (const [tableName, { query }] of tables) {
      try {
        const { data, error } = await query();
        if (!error && data) {
          await clearStore(tableName);
          await saveAll(tableName, data);
        }
      } catch {
        // Skip individual errors, continue with other tables
      }
    }
  }

  function notifyRefresh(tableName) {
    const runHandlers = (entry) => {
      entry.refreshFns.forEach(fn => {
        if (typeof fn === 'function') fn();
      });
    };
    
    if (tableName === 'all') {
      for (const entry of tables.values()) runHandlers(entry);
    } else {
      const entry = tables.get(tableName);
      if (entry) runHandlers(entry);
    }
  }

  function generateTempId() {
    return Date.now() * 1000 + Math.floor(Math.random() * 1000);
  }

  
  const syncIcons = {
    syncing: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;vertical-align:middle;margin-right:6px"><path d="M8 12V4M4 7l4-4 4 4"/><path d="M3 14h10" stroke-width="1.5" opacity=".5"/></svg>',
    done: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;vertical-align:middle;margin-right:6px"><polyline points="2 8 6 12 14 4"/></svg>',
    offline: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;vertical-align:middle;margin-right:6px"><path d="M8 2 L14 14 H2 Z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="12.5" r=".6" fill="currentColor" stroke="none"/></svg>',
  };

  function showSyncBanner(status, extra) {
    const banner = document.getElementById('sync-banner');
    if (!banner) return;
    
    if (status === 'syncing') {
      const plural = extra !== 1 ? 'en' : '';
      const details = extra ? ` (${extra} aanpassing${plural})` : '';
      banner.innerHTML = syncIcons.syncing + `Synchroniseren…${details}`;
      banner.className = 'sync-banner sync-syncing';
    } 
    else if (status === 'done') {
      banner.innerHTML = syncIcons.done + 'Gesynchroniseerd';
      banner.className = 'sync-banner sync-online';
      setTimeout(() => { banner.className = 'sync-banner sync-hidden'; }, 2500);
    } 
    else if (status === 'offline') {
      banner.innerHTML = syncIcons.offline + 'Geen verbinding - wijzigingen opgeslagen';
      banner.className = 'sync-banner sync-offline';
    }
  }

  function makeOfflineWrapper(module, tableName) {
    const original = { ...module };
    const entry = tables.get(tableName);
    const sortFn = entry?.sort;
    
    // Override getAll to cache locally
    Object.assign(module, {
      async getAll() {
        try {
          const data = await original.getAll();
          await clearStore(tableName);
          await saveAll(tableName, data);
          return data;
        } catch (err) {
          if (isNetworkError(err)) {
            const cached = await getAll(tableName);
            return sortFn ? cached.sort(sortFn) : cached;
          }
          throw err;
        }
      },
      
      // Override remove to cache deletion
      async remove(id) {
        try {
          await original.remove(id);
          await deleteOne(tableName, id);
        } catch (err) {
          if (isNetworkError(err)) {
            await deleteOne(tableName, id);
            await queueOperation({ table: tableName, op: 'delete', filter: { id } });
            notifyRefresh(tableName);
            return;
          }
          throw err;
        }
      },
    });
    
    return original;
  }

  
  async function performSync() {
    const pending = await getAll('pending_ops');
    if (pending.length) showSyncBanner('syncing', pending.length);
    
    await syncQueue();
    await refreshAllCaches();
    
    if (pending.length) {
      showSyncBanner('done');
      notifyRefresh('all');
    }
  }

  async function initialize() {
    // Open the database
    await openDatabase();

    // Add sync banner to page
    const banner = document.createElement('div');
    banner.id = 'sync-banner';
    banner.className = 'sync-banner sync-hidden';
    document.body.prepend(banner);

    // Try initial sync
    try {
      await performSync();
    } catch (err) {
      isOnline = false;
      showSyncBanner('offline');
    }

    // Listen for connection changes
    window.addEventListener('offline', () => {
      isOnline = false;
      showSyncBanner('offline');
    });

    window.addEventListener('online', async () => {
      isOnline = true;
      try { 
        await performSync(); 
      } catch (err) {
        // Stay silent if sync fails
      }
    });
  }

  return {
    isOnline: () => isOnline,
    isNetworkError,
    registerTable,
    registerRefreshHandler,
    makeOfflineWrapper,
    getAll,
    saveAll,
    saveOne,
    deleteOne,
    updateOne,
    clearStore,
    queueOperation,
    initialize,
    syncQueue,
    refreshAllCaches,
    generateTempId,
    notifyRefresh,
  };
})();

// Set up agenda syncing
OfflineSync.registerTable('agenda', {
  query: () => db.from('agenda').select('*').order('time'),
  sort:  (a, b) => String(a.time).localeCompare(String(b.time)),
});
OfflineSync.registerRefreshHandler('agenda',
  () => typeof loadAgendaPreview === 'function' && loadAgendaPreview(),
  () => typeof renderAgenda === 'function' && renderAgenda(),
);

// Set up pitstops syncing
OfflineSync.registerTable('pitstops', {
  query: () => db.from('pitstops').select('*').order('created_at', { ascending: false }),
  sort:  (a, b) => new Date(b.created_at) - new Date(a.created_at),
});
OfflineSync.registerRefreshHandler('pitstops',
  () => typeof PitTimer !== 'undefined' && typeof PitTimer.load === 'function' && PitTimer.load(),
);

// Set up tracks syncing
OfflineSync.registerTable('tracks', {
  query: () => db.from('tracks').select('*').order('name'),
  sort:  (a, b) => String(a.name).localeCompare(String(b.name)),
});
OfflineSync.registerRefreshHandler('tracks',
  () => typeof renderTracks === 'function' && renderTracks(),
);

// Real-time data only — must be connected to Supabase
// No offline queue, no background sync
// All data operations require an active network connection
