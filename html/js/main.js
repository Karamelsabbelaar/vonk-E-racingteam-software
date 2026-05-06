/**
 * KartPit — Shared utilities
 */

// ── Service Worker ─────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../js/sw.js', { scope: './' })
    .catch(() => {}); // silently fail in non-HTTPS dev environments
}

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

// ── Custom Number Steppers ─────────────────────────────────────
function initNumberSteppers() {
  document.querySelectorAll('input[type="number"]').forEach(input => {
    if (input.closest('.num-stepper')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'num-stepper';

    const minus = document.createElement('button');
    minus.type = 'button';
    minus.className = 'num-stepper-btn';
    minus.setAttribute('aria-label', 'Minder');
    minus.textContent = '−';
    minus.addEventListener('click', () => {
      const step = parseFloat(input.step) || 1;
      const min  = input.min !== '' ? parseFloat(input.min) : -Infinity;
      const cur  = parseFloat(input.value) || 0;
      input.value = Math.max(min, parseFloat((cur - step).toFixed(10)));
      input.dispatchEvent(new Event('input',  { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const plus = document.createElement('button');
    plus.type = 'button';
    plus.className = 'num-stepper-btn';
    plus.setAttribute('aria-label', 'Meer');
    plus.textContent = '+';
    plus.addEventListener('click', () => {
      const step = parseFloat(input.step) || 1;
      const max  = input.max !== '' ? parseFloat(input.max) : Infinity;
      const cur  = parseFloat(input.value) || 0;
      input.value = Math.min(max, parseFloat((cur + step).toFixed(10)));
      input.dispatchEvent(new Event('input',  { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(minus);
    wrapper.appendChild(input);
    wrapper.appendChild(plus);
  });
}

// ── Hamburger Menu ─────────────────────────────────────────────
// Toggles side navigation on mobile—handles open/close states and accessibility
function initHamburgerMenu() {
  const btn      = document.getElementById('hamburgerBtn');
  const menu     = document.getElementById('sideMenu');
  const backdrop = document.getElementById('menuBackdrop');
  if (!btn || !menu || !backdrop) {
    console.warn('[KartPit] Hamburger menu: missing DOM elements');
    return;
  }
  
  const open = () => {
    console.debug('[KartPit] Opening side menu');
    btn.classList.add('open');
    menu.classList.add('open');
    backdrop.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  
  const close = () => {
    console.debug('[KartPit] Closing side menu');
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
// Logs user out and redirects to login page
async function signOutGlobal() {
  try {
    if (typeof db !== 'undefined') {
      console.log('[KartPit] Signing out user...');
      await db.auth.signOut();
    }
  } catch(e) {
    console.error('[KartPit] Error during sign out:', e.message);
  }
  // Redirect to login regardless of Supabase outcome
  window.location.href = 'login.html';
}

// ── Admin nav link (only shown to admins) ──────────────────────
// Dynamically injects admin panel link if user has admin privileges
async function initAdminLink() {
  try {
    if (typeof db === 'undefined') {
      console.debug('[KartPit] Auth not available, skipping admin link');
      return;
    }
    const { data: { session } } = await db.auth.getSession();
    if (!session?.user?.app_metadata?.role || session.user.app_metadata.role !== 'admin') {
      return; // niet admin, geen link nodig
    }
    const nav = document.querySelector('.side-menu-nav');
    if (!nav) {
      console.warn('[KartPit] Could not find side menu nav for admin link');
      return;
    }
    if (nav.querySelector('a[href="admin.html"]')) {
      return; // al aanwezig
    }
    console.log('[KartPit] Adding admin link for user:', session.user.email);
    const li = document.createElement('li');
    li.innerHTML = `<a href="admin.html" class="side-menu-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Accountbeheer</a>`;
    nav.appendChild(li);
  } catch(e) {
    console.error('[KartPit] Error initializing admin link:', e);
  }
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.remove('preload');
  initTheme();
  initHamburgerMenu();
  Modal.init();
  setActiveNav();
  initBackTransition();
  initAdminLink();

  // Hide status bar on Android — only on Capacitor, not in browser
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
              <button onclick="deleteTrack(${t.id})" class="btn btn-ghost btn-sm" style="opacity:0.6">✕</button>
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

// Add new track to database and refresh list
async function addTrack() {
  const getVal = id => {
    const el = document.getElementById(id);
    return el ? el.value : '';
  };
  
  const name = getVal('tr-name').trim();
  if (!name) {
    Toast.show('Tracknaam is verplicht', 'error');
    document.getElementById('tr-name')?.focus();
    return;
  }
  
  try {
    const trackData = {
      name,
      location: getVal('tr-loc'),
      length_m: parseInt(getVal('tr-len')) || 0,
      turns: parseInt(getVal('tr-turns')) || 0,
      track_date: getVal('tr-date') || '–',
      type: getVal('tr-type'),
      notes: getVal('tr-notes'),
      layout: getVal('tr-layout') || '–'
    };
    
    console.log('[KartPit] Adding track:', trackData.name);
    await Tracks.add(trackData);
    
    // Clear form
    ['tr-name', 'tr-loc', 'tr-len', 'tr-turns', 'tr-date', 'tr-notes', 'tr-type', 'tr-layout']
      .forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    
    Toast.show('Track toegevoegd: ' + name, 'success');
    renderTracks();
  } catch(e) {
    console.error('[KartPit] Error adding track:', e);
    Toast.show('Fout bij toevoegen: ' + e.message, 'error');
  }
}

// Remove track from database
async function deleteTrack(id) {
  if (!confirm('Weet je zeker dat je deze track wilt verwijderen?')) {
    return;
  }
  
  try {
    console.log('[KartPit] Deleting track ID:', id);
    await Tracks.remove(id);
    Toast.show('Track verwijderd', 'success');
    renderTracks();
  } catch(e) {
    console.error('[KartPit] Error deleting track:', e);
    Toast.show('Kon track niet verwijderen: ' + e.message, 'error');
  }
}

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tracks-grid')) renderTracks();
  });

// ── Agenda preview (homepage) ──────────────────────────────────
// Load upcoming events and display in compact table (max 5 items)
async function loadAgendaPreview() {
  const tbody = document.getElementById('agenda-preview');
  if (!tbody) {
    console.debug('[KartPit] Agenda preview container not found—probably not on homepage');
    return;
  }
  
  const TYPE_BADGE = {
    race: 'badge-red', qualifying: 'badge-yellow',
    session: 'badge-blue', pitstop: 'badge-green'
  };
  
  try {
    const agenda = await Agenda.getAll();
    console.log(`[KartPit] Loaded ${agenda.length} agenda items`);
    
    if (!agenda.length) {
      tbody.innerHTML = '<tr><td colspan="3" style="color:var(--text3);text-align:center;padding:24px">Geen events gepland</td></tr>';
      return;
    }
    
    // Show only first 5 items
    tbody.innerHTML = agenda.slice(0, 5).map(item => `
      <tr>
        <td style="font-family:var(--font-display);font-size:18px;color:var(--text2)">${item.time}</td>
        <td>${item.event}</td>
        <td><span class="badge ${TYPE_BADGE[item.type] || 'badge-gray'}">${item.type}</span></td>
      </tr>`).join('');
  } catch(e) {
    console.error('[KartPit] Error loading agenda preview:', e);
    tbody.innerHTML = `<tr><td colspan="3" style="color:var(--red)">Fout bij laden: ${e.message}</td></tr>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('agenda-preview')) loadAgendaPreview();
});
