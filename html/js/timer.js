/**
 * KartPit — Pitstop Timer
 * Slaat op in Supabase, live zichtbaar voor het hele team
 */

const PitTimer = (() => {
  let startTime = null, elapsed = 0, running = false, rafId = null, targetMs = null;

  const display = () => document.getElementById('timer-display');
  const ppBtn   = () => document.getElementById('btn-play-pause');
  const saveBtn = () => document.getElementById('btn-save');

  function tick(ts) {
    if (!running) return;
    elapsed = ts - startTime;
    render(elapsed);
    const t = targetMs;
    if (t) {
      display().className = elapsed < t * 0.9 ? 'timer-display'
                          : elapsed < t       ? 'timer-display running'
                          :                     'timer-display stopped';
    } else {
      display().className = 'timer-display running';
    }
    rafId = requestAnimationFrame(tick);
  }

  function render(ms) {
    const m = String(Math.floor(ms / 60000)).padStart(2,'0');
    const s = String(Math.floor((ms % 60000) / 1000)).padStart(2,'0');
    const c = String(Math.floor((ms % 1000) / 10)).padStart(2,'0');
    display().textContent = `${m}:${s}.${c}`;
  }

  function start() {
    if (running) return;
    running  = true;
    targetMs = (parseFloat(document.getElementById('target-time')?.value) * 1000) || null;
    const btn = ppBtn();
    btn.classList.add('running');
    btn.querySelector('.pp-label').textContent = 'STOP';
    // Use RAF timestamp as time source — same epoch as tick(ts), sub-ms precision
    const offset = elapsed;
    rafId = requestAnimationFrame(ts => { startTime = ts - offset; rafId = requestAnimationFrame(tick); });
  }

  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(rafId);
    display().className = 'timer-display stopped';
    const btn = ppBtn();
    btn.classList.remove('running');
    btn.querySelector('.pp-label').textContent = 'START';
    saveBtn().disabled = false;
  }

  function toggle() {
    const btn = ppBtn();
    btn.classList.add('pressing');
    setTimeout(() => btn.classList.remove('pressing'), 320);
    if (!running) { start(); } else { stop(); }
  }

  function reset() {
    running = false;
    cancelAnimationFrame(rafId);
    elapsed = 0;
    render(0);
    display().className = 'timer-display';
    const btn = ppBtn();
    btn.classList.remove('running');
    btn.querySelector('.pp-label').textContent = 'START';
    saveBtn().disabled = true;
  }

  async function saveStop() {
    const label = document.getElementById('stop-label')?.value.trim() || 'Pitstop';
    const notes = document.getElementById('stop-notes')?.value.trim() || '';
    try {
      await Pitstops.save(elapsed, label, notes);
      Toast.show(`✓ Opgeslagen: ${(elapsed/1000).toFixed(2)}s`, 'success');
      Modal.close('save-modal');
      document.getElementById('stop-label').value = '';
      document.getElementById('stop-notes').value = '';
      reset();
      await loadHistory();
    } catch(e) {
      Toast.show('Opslaan mislukt: ' + e.message, 'error');
    }
  }

  async function deleteStop(id) {
    try {
      await Pitstops.remove(id);
      Toast.show('Stop verwijderd', 'success');
      await loadHistory();
    } catch(e) {
      Toast.show('Verwijderen mislukt', 'error');
    }
  }

  function stopRow(stop, targetMs) {
    const ms  = stop.duration_ms;
    const sec = (ms / 1000).toFixed(2);
    const mins = Math.floor(ms / 60000);
    const disp = mins > 0
      ? `${mins}:${((ms % 60000)/1000).toFixed(2).padStart(5,'0')}`
      : `${sec}s`;
    let color = '';
    if (targetMs && ms <= targetMs) color = 'style="color:var(--green)"';
    else if (targetMs)              color = 'style="color:var(--red)"';
    const date = new Date(stop.created_at).toLocaleString('nl-NL', { dateStyle:'short', timeStyle:'short' });
    return `
      <div class="stop-row" id="stop-${stop.id}">
        <div class="stop-time" ${color}>${disp}</div>
        <div class="stop-label">
          <strong>${stop.label}</strong>
          ${stop.notes ? `<br><span style="font-size:13px;color:var(--text3)">${stop.notes}</span>` : ''}
        </div>
        <div class="stop-date">${date}</div>
        <button class="btn btn-ghost btn-sm" onclick="PitTimer.del(${stop.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>`;
  }

  async function loadHistory() {
    const list = document.getElementById('stop-history');
    if (!list) return;
    try {
      const data = await Pitstops.getAll();
      if (!data.length) {
        list.innerHTML = '<p style="color:var(--text3);text-align:center;padding:32px 0">Nog geen stops opgeslagen</p>';
        ['stat-best','stat-avg','stat-worst','stat-count'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.textContent = id === 'stat-count' ? '0' : '–';
        });
        return;
      }
      list.innerHTML = data.map(s => stopRow(s, targetMs)).join('');
      const times = data.map(d => d.duration_ms);
      const set   = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set('stat-best',  (Math.min(...times)/1000).toFixed(2) + 's');
      set('stat-avg',   (times.reduce((a,b)=>a+b,0)/times.length/1000).toFixed(2) + 's');
      set('stat-worst', (Math.max(...times)/1000).toFixed(2) + 's');
      set('stat-count', data.length);
    } catch(e) {
      list.innerHTML = `<p style="color:var(--red)">Fout bij laden: ${e.message}</p>`;
    }
  }

  return { toggle, start, stop, reset, save: saveStop, del: deleteStop, load: loadHistory };
})();

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-play-pause')?.addEventListener('click', PitTimer.toggle);
  document.getElementById('btn-reset')?.addEventListener('click', PitTimer.reset);
  document.getElementById('btn-save')?.addEventListener('click',  () => Modal.open('save-modal'));
  document.getElementById('btn-confirm-save')?.addEventListener('click', PitTimer.save);

  Realtime.onPitstopChange(() => PitTimer.load());

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Space') { e.preventDefault(); PitTimer.toggle(); }
    if (e.code === 'KeyR')  PitTimer.reset();
  });

  PitTimer.load();
});
