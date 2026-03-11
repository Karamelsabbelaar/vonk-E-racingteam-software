/**
 * KartPit — Main JavaScript
 * Shared utilities, API helpers, toast notifications
 */

// ── API Helper ────────────────────────────────────────────────
const API = {
  async get(path) {
    const r = await fetch(path);
    return r.json();
  },
  async post(path, data) {
    const r = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return r.json();
  },
  async patch(path) {
    const r = await fetch(path, { method: 'PATCH' });
    return r.json();
  },
  async delete(path) {
    const r = await fetch(path, { method: 'DELETE' });
    return r.json();
  }
};

// ── Toast Notifications ───────────────────────────────────────
const Toast = {
  container: null,
  init() {
    if (!document.getElementById('toast-container')) {
      const el = document.createElement('div');
      el.id = 'toast-container';
      document.body.appendChild(el);
    }
    this.container = document.getElementById('toast-container');
  },
  show(msg, type = 'success', duration = 3000) {
    if (!this.container) this.init();
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    this.container.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(20px)';
      t.style.transition = 'all .25s';
      setTimeout(() => t.remove(), 260);
    }, duration);
  }
};

// ── Modal Helper ──────────────────────────────────────────────
const Modal = {
  open(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('open');
  },
  close(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('open');
  },
  init() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('open');
      });
    });
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.modal-overlay').classList.remove('open');
      });
    });
  }
};

// ── Active Nav Highlight ──────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active',
      href === path || (path === '/' && href === '/') ||
      (href !== '/' && path.startsWith(href))
    );
  });
}

// ── Format seconds to MM:SS.ms ───────────────────────────────
function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const millis  = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${String(millis).padStart(2,'0')}`;
}

function formatTimeShort(ms) {
  const seconds = (ms / 1000).toFixed(2);
  return `${seconds}s`;
}

// ── Progress ──────────────────────────────────────────────────
function updateProgress(done, total, fillEl, labelEl) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  if (fillEl) fillEl.style.width = pct + '%';
  if (labelEl) labelEl.textContent = `${done} / ${total}`;
  return pct;
}

// ── Init on DOM Ready ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  Modal.init();
  setActiveNav();
});
