/**
 * KartPit — Pitstop Timer
 * Stopwatch with save, history, and target time feature
 */

const PitTimer = (() => {
  let startTime   = null;
  let elapsed     = 0;
  let running     = false;
  let rafId       = null;
  let targetMs    = null;

  const display   = document.getElementById('timer-display');
  const startBtn  = document.getElementById('btn-start');
  const stopBtn   = document.getElementById('btn-stop');
  const resetBtn  = document.getElementById('btn-reset');
  const saveBtn   = document.getElementById('btn-save');
  const targetIn  = document.getElementById('target-time');
  const histList  = document.getElementById('stop-history');

  function tick() {
    if (!running) return;
    elapsed = Date.now() - startTime;
    render(elapsed);

    // colour feedback vs target
    if (targetMs) {
      if (elapsed < targetMs * 0.9) display.className = 'timer-display';
      else if (elapsed < targetMs)  display.className = 'timer-display running';
      else                          display.className = 'timer-display stopped';
    } else {
      display.className = 'timer-display running';
    }
    rafId = requestAnimationFrame(tick);
  }

  function render(ms) {
    const minutes = String(Math.floor(ms / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    const millis  = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
    display.textContent = `${minutes}:${seconds}.${millis}`;
  }

  function start() {
    if (running) return;
    running   = true;
    startTime = Date.now() - elapsed;
    targetMs  = targetIn ? (parseFloat(targetIn.value) * 1000 || null) : null;
    startBtn.disabled = true;
    stopBtn.disabled  = false;
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(rafId);
    display.className = 'timer-display stopped';
    startBtn.disabled = false;
    stopBtn.disabled  = true;
    saveBtn.disabled  = false;
  }

  function reset() {
    stop();
    elapsed = 0;
    render(0);
    display.className = 'timer-display';
    saveBtn.disabled  = true;
  }

  async function saveStop() {
    const labelIn = document.getElementById('stop-label');
    const notesIn = document.getElementById('stop-notes');
    const label   = labelIn ? labelIn.value.trim() || 'Pitstop' : 'Pitstop';
    const notes   = notesIn ? notesIn.value.trim() : '';

    const payload = {
      duration: elapsed,
      label,
      notes
    };

    const res = await API.post('/api/pitstops/save', payload);
    if (res.ok) {
      Toast.show(`✓ Saved: ${(elapsed/1000).toFixed(2)}s`, 'success');
      Modal.close('save-modal');
      await loadHistory();
      if (labelIn) labelIn.value = '';
      if (notesIn) notesIn.value = '';
      reset();
    } else {
      Toast.show('Save failed', 'error');
    }
  }

  async function deleteStop(id) {
    const res = await API.delete(`/api/pitstops/${id}`);
    if (res.ok) {
      Toast.show('Stop removed', 'success');
      await loadHistory();
    }
  }

  function stopRow(stop) {
    const ms   = stop.duration;
    const sec  = (ms / 1000).toFixed(2);
    const mins = Math.floor(ms / 60000);
    const secs = ((ms % 60000) / 1000).toFixed(2);
    const disp = mins > 0 ? `${mins}:${secs.padStart(5,'0')}` : `${sec}s`;

    let colorClass = '';
    if (targetMs && ms <= targetMs) colorClass = 'style="color:var(--green)"';
    else if (targetMs)              colorClass = 'style="color:var(--red)"';

    return `
      <div class="stop-row" id="stop-${stop.id}">
        <div class="stop-time" ${colorClass}>${disp}</div>
        <div class="stop-label">
          <strong>${stop.label}</strong>
          ${stop.notes ? `<br><span style="font-size:13px;color:var(--text3)">${stop.notes}</span>` : ''}
        </div>
        <div class="stop-date">${stop.date}</div>
        <button class="btn btn-ghost btn-sm" onclick="PitTimer.del(${stop.id})">✕</button>
      </div>`;
  }

  async function loadHistory() {
    if (!histList) return;
    const data = await API.get('/api/pitstops');
    if (!data.length) {
      histList.innerHTML = '<p style="color:var(--text3);text-align:center;padding:32px 0">No stops recorded yet</p>';
      return;
    }
    // Sort newest first
    const sorted = [...data].sort((a,b) => b.id - a.id);
    histList.innerHTML = sorted.map(stopRow).join('');

    // Stats
    const times = data.map(d => d.duration);
    const best  = Math.min(...times);
    const avg   = times.reduce((a,b) => a+b, 0) / times.length;
    const worst = Math.max(...times);

    const el = id => document.getElementById(id);
    if (el('stat-best'))  el('stat-best').textContent  = (best/1000).toFixed(2) + 's';
    if (el('stat-avg'))   el('stat-avg').textContent   = (avg/1000).toFixed(2)  + 's';
    if (el('stat-worst')) el('stat-worst').textContent = (worst/1000).toFixed(2)+ 's';
    if (el('stat-count')) el('stat-count').textContent = data.length;
  }

  // Public API
  return { start, stop, reset, save: saveStop, del: deleteStop, load: loadHistory };
})();

document.addEventListener('DOMContentLoaded', () => {
  // Wire buttons
  document.getElementById('btn-start')?.addEventListener('click', PitTimer.start);
  document.getElementById('btn-stop')?.addEventListener('click',  PitTimer.stop);
  document.getElementById('btn-reset')?.addEventListener('click', PitTimer.reset);
  document.getElementById('btn-save')?.addEventListener('click',  () => Modal.open('save-modal'));
  document.getElementById('btn-confirm-save')?.addEventListener('click', PitTimer.save);

  // Keyboard shortcut: Space = start/stop, R = reset
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Space')  { e.preventDefault(); document.getElementById('btn-start').disabled ? PitTimer.stop() : PitTimer.start(); }
    if (e.code === 'KeyR')   { PitTimer.reset(); }
  });

  PitTimer.load();
});
