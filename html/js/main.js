/**
 * KartPit — Gedeelde utilities
 */

// ── Toast ──────────────────────────────────────────────────────
const Toast = {
  show(msg, type = 'success', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(20px)';
      t.style.transition = 'all .25s';
      setTimeout(() => t.remove(), 260);
    }, duration);
  }
};

// ── Modal ──────────────────────────────────────────────────────
const Modal = {
  open(id)  { document.getElementById(id)?.classList.add('open'); },
  close(id) { document.getElementById(id)?.classList.remove('open'); },
  init() {
    document.querySelectorAll('.modal-overlay').forEach(o => {
      o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
    });
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => btn.closest('.modal-overlay').classList.remove('open'));
    });
  }
};

// ── Progress bar ───────────────────────────────────────────────
function updateProgress(done, total, fillEl, labelEl) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  if (fillEl)  fillEl.style.width = pct + '%';
  if (labelEl) labelEl.textContent = `${done} / ${total}`;
  return pct;
}

// ── Actieve nav link ───────────────────────────────────────────
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === page);
  });
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Modal.init();
  setActiveNav();
});

// Tracks toevoegen //
  const TYPE_BADGE = { indoor: 'badge-blue', outdoor: 'badge-green' };

  async function renderTracks() {
    const grid = document.getElementById('tracks-grid');
    try {
      const data = await Tracks.getAll();
      if (!data.length) {
        grid.innerHTML = '<p style="color:var(--text3)">Nog geen tracks — voeg er een toe.</p>';
        return;
      }
      grid.innerHTML = data.map(t => `
        <div class="track-card">
          <div class="track-header">
            <div>
              <div class="track-name">${t.name}</div>
              <div style="font-size:13px;color:var(--text3);margin-top:2px">📍 ${t.location}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
              <span class="badge ${TYPE_BADGE[t.type] || 'badge-yellow'}">${t.type}</span>
              <button onclick="deleteTrack(${t.id})" class="btn btn-ghost btn-sm" style="opacity:0.4">✕</button>
            </div>
          </div>
          <div class="track-body">
            <div class="track-stat"><span class="track-stat-label">Lengte</span><span class="track-stat-value">${t.length_m}m</span></div>
            <div class="track-stat"><span class="track-stat-label">Bochten</span><span class="track-stat-value">${t.turns}</span></div>
            <div class="track-stat"><span class="track-stat-label">Beste Ronde</span><span class="track-stat-value" style="color:var(--yellow)">${t.best_lap}</span></div>
            ${t.notes ? `<div class="track-notes">💡 ${t.notes}</div>` : ''}
          </div>
        </div>`).join('');
    } catch(e) {
      grid.innerHTML = `<p style="color:var(--red)">Fout: ${e.message}</p>`;
    }
  }

  async function addTrack() {
    const get = id => document.getElementById(id).value;
    const name = get('tr-name').trim();
    if (!name) { Toast.show('Tracknaam is verplicht', 'error'); return; }
    try {
      await Tracks.add({
        name,
        location: get('tr-loc'),
        length_m: parseInt(get('tr-len')) || 0,
        turns:    parseInt(get('tr-turns')) || 0,
        best_lap: get('tr-lap') || '–',
        type:     get('tr-type'),
        notes:    get('tr-notes')
      });
      ['tr-name','tr-loc','tr-len','tr-turns','tr-lap','tr-notes'].forEach(id => document.getElementById(id).value = '');
      Toast.show('Track toegevoegd', 'success');
      renderTracks();
    } catch(e) {
      Toast.show('Fout: ' + e.message, 'error');
    }
  }

  async function deleteTrack(id) {
    if (!confirm('Track verwijderen?')) return;
    try {
      await Tracks.remove(id);
      Toast.show('Track verwijderd', 'success');
      renderTracks();
    } catch(e) {
      Toast.show('Fout: ' + e.message, 'error');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tracks-grid')) renderTracks();
  });

// ── Agenda preview (homepage) ──────────────────────────────────
async function loadAgendaPreview() {
  const tbody = document.getElementById('agenda-preview');
  if (!tbody) return;
  const TYPE_BADGE = {
    race: 'badge-red', qualifying: 'badge-yellow',
    session: 'badge-blue', pitstop: 'badge-green'
  };
  try {
    const agenda = await Agenda.getAll();
    if (!agenda.length) {
      tbody.innerHTML = '<tr><td colspan="3" style="color:var(--text3);text-align:center;padding:24px">Geen events gepland</td></tr>';
      return;
    }
    tbody.innerHTML = agenda.slice(0, 5).map(item => `
      <tr>
        <td style="font-family:var(--font-display);font-size:18px;color:var(--text2)">${item.time}</td>
        <td>${item.event}</td>
        <td><span class="badge ${TYPE_BADGE[item.type] || 'badge-gray'}">${item.type}</span></td>
      </tr>`).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="3" style="color:var(--red)">Fout: ${e.message}</td></tr>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('agenda-preview')) loadAgendaPreview();
});
