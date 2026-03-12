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
