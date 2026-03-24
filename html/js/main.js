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

// ── Taken ─────────────────────────────────────────────────────
const Tasks = {
  async getAll() {
    const { data, error } = await db.from('tasks').select('*').order('created_at');
    if (error) throw error;
    return data;
  },
  async add(description, assigned_to, category) {
    const { error } = await db.from('tasks').insert({ description, assigned_to, category, done: false });
    if (error) throw error;
  },
  async remove(id) {
    const { error } = await db.from('tasks').delete().eq('id', id);
    if (error) throw error;
  },
  async setDone(id, done) {
    const { error } = await db.from('tasks').update({ done }).eq('id', id);
    if (error) throw error;
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

// ── Back navigation with exit animation ──────────────────────
function navigateBack(url) {
  const wrapper = document.querySelector('.wrapper');
  if (!wrapper) { location.href = url; return; }
  wrapper.classList.add('exiting');
  wrapper.addEventListener('animationend', () => { location.href = url; }, { once: true });
}

function initBackTransition() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  if (currentPage !== 'index.html') {
    // Logo / any link pointing back to index.html
    document.querySelectorAll('a[href="index.html"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        navigateBack('index.html');
      });
    });

    // Android hardware back button (Capacitor)
    if (window.Capacitor?.Plugins?.App) {
      window.Capacitor.Plugins.App.addListener('backButton', () => {
        navigateBack('index.html');
      });
    }
  }

  // r,o,w — the rest is up to you
  const _seq = ['r','o','w','r','o','w'];
  let _i = 0;
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    _i = (e.key === _seq[_i]) ? _i + 1 : (e.key === _seq[0] ? 1 : 0);
    if (_i < _seq.length) return;
    _i = 0;
    _gurrenTrigger();
  });

  // mobile: tap the page footer/logo 6 times quickly
  let _taps = 0, _tapTimer;
  document.addEventListener('touchend', e => {
    if (e.target.closest('input,textarea,button,a')) return;
    _taps++;
    clearTimeout(_tapTimer);
    _tapTimer = setTimeout(() => { _taps = 0; }, 800);
    if (_taps >= 6) { _taps = 0; _gurrenTrigger(); }
  }, { passive: true });
}

function _gurrenTrigger() {
  // ???%
  console.groupCollapsed('%c⚡ ROW ROW FIGHT THE POWER ⚡', 'color:#ffd700;font-weight:bold;font-size:15px');
  console.log('%c"Who the hell do you think I am?!"\n — Kamina, Gurren Lagann', 'color:#f0a500;font-family:monospace');
  console.log('%c"Don\'t believe in yourself.\n Believe in me — who believes in you."\n — Kamina', 'color:#ccc;font-family:monospace');
  console.log('%c"At ???%... I surpass my limits."\n — Shigeo Kageyama, Mob Psycho 100', 'color:#9b59b6;font-family:monospace');
  console.log('%c🌀', 'font-size:48px');
  console.groupEnd();
  Toast.show('Row row, fight the power! ⚡', 'success', 4000);
}

// ── Dark Mode ──────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  _updateThemeBtn(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.classList.add('spinning');
    setTimeout(() => btn.classList.remove('spinning'), 500);
  });
  _updateThemeBtn(next);
}

function _updateThemeBtn(theme) {
  const sun = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const moon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const icon  = theme === 'dark' ? sun : moon;
  const title = theme === 'dark' ? 'Licht thema' : 'Donker thema';
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.title = title;
    const labelEl = btn.querySelector('.theme-label');
    if (labelEl) {
      // Sidebar button has SVG + label span — replace only the SVG, keep the label
      const oldSvg = btn.querySelector('svg');
      if (oldSvg) { oldSvg.insertAdjacentHTML('afterend', icon); oldSvg.remove(); }
      labelEl.textContent = title;
    } else {
      btn.innerHTML = icon;
    }
  });
}

// ── Hamburger Menu ─────────────────────────────────────────────
function initHamburgerMenu() {
  const btn      = document.getElementById('hamburgerBtn');
  const menu     = document.getElementById('sideMenu');
  const backdrop = document.getElementById('menuBackdrop');
  if (!btn || !menu || !backdrop) return;
  const open = () => {
    btn.classList.add('open');
    menu.classList.add('open');
    backdrop.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    btn.classList.remove('open');
    menu.classList.remove('open');
    backdrop.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  btn.addEventListener('click', () => btn.classList.contains('open') ? close() : open());
  backdrop.addEventListener('click', close);
  document.getElementById('menuClose')?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

// ── Global Sign Out ─────────────────────────────────────────────
async function signOutGlobal() {
  try { if (typeof db !== 'undefined') await db.auth.signOut(); } catch(_) {}
  window.location.href = 'login.html';
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHamburgerMenu();
  Modal.init();
  setActiveNav();
  initBackTransition();

  // Fullscreen: hide status bar — only on Capacitor (Android), not in browser
  if (window.Capacitor && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
});

// Tracks toevoegen //
  async function renderTracks() {
    const TYPE_BADGE = { indoor: 'badge-blue', outdoor: 'badge-green' };
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
            <div class="track-stat"><span class="track-stat-label">Datum</span><span class="track-stat-value" style="color:var(--yellow)">${t.track_date}</span></div>
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
        track_date:get('tr-date') || '–',
        type:     get('tr-type'),
        notes:    get('tr-notes'),
        layout:    get('tr-layout') || '–' 

      });
      ['tr-name','tr-loc','tr-len','tr-turns','tr-date','tr-notes'].forEach(id => document.getElementById(id).value = '');
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

// ── Banden Spanning ─────────────────────────────────────────────
async function renderTirePressures() {
  const pressure = document.getElementById('tire-pressures');
  if (!pressure) return;
}