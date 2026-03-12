/**
 * KartPit — Checklist
 * Live gesynchroniseerd via Supabase Realtime
 */

async function loadChecklist() {
  try {
    const items = await Checklist.getAll();
    const components = items.filter(i => i.category === 'components');
    const people     = items.filter(i => i.category === 'people');
    renderList('list-components', components);
    renderList('list-people', people);
    updateAllProgress(items);
  } catch(e) {
    Toast.show('Fout bij laden: ' + e.message, 'error');
  }
}

function renderList(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items.map(item => `
    <div class="checklist-item ${item.done ? 'done' : ''}"
         data-id="${item.id}" data-category="${item.category}"
         onclick="toggleItem(${item.id}, ${item.done})">
      <div class="check-box"><span class="tick">✓</span></div>
      <div class="check-text">${item.item}</div>
      <button onclick="event.stopPropagation(); removeItem(${item.id})"
              class="btn btn-ghost btn-sm" style="margin-left:auto;opacity:0.3">✕</button>
    </div>`).join('');
}

async function toggleItem(id, currentDone) {
  try {
    await Checklist.toggle(id, !currentDone);
    // Realtime update doet de re-render
  } catch(e) {
    Toast.show('Fout: ' + e.message, 'error');
  }
}

async function removeItem(id) {
  try {
    await Checklist.remove(id);
    Toast.show('Item verwijderd', 'success');
  } catch(e) {
    Toast.show('Fout: ' + e.message, 'error');
  }
}

async function addItem() {
  const text = document.getElementById('new-item-text')?.value.trim();
  const cat  = document.getElementById('new-item-cat')?.value;
  if (!text) { Toast.show('Voer een item in', 'error'); return; }
  try {
    await Checklist.add(text, cat);
    document.getElementById('new-item-text').value = '';
    Toast.show('Item toegevoegd', 'success');
  } catch(e) {
    Toast.show('Fout: ' + e.message, 'error');
  }
}

async function resetChecklist() {
  if (!confirm('Alle items terugzetten naar niet-afgevinkt?')) return;
  try {
    await Checklist.resetAll();
    Toast.show('Checklist gereset', 'success');
  } catch(e) {
    Toast.show('Fout: ' + e.message, 'error');
  }
}

function updateAllProgress(items) {
  ['components', 'people'].forEach(cat => {
    const catItems = items.filter(i => i.category === cat);
    const done     = catItems.filter(i => i.done).length;
    updateProgress(done, catItems.length,
      document.getElementById(`progress-${cat}`),
      document.getElementById(`label-${cat}`)
    );
  });
  const done  = items.filter(i => i.done).length;
  const total = items.length;
  const pct   = updateProgress(done, total,
    document.getElementById('progress-all'),
    document.getElementById('label-all')
  );
  const pctEl = document.getElementById('pct-all');
  if (pctEl) pctEl.textContent = pct + '%';
}

document.addEventListener('DOMContentLoaded', () => {
  loadChecklist();
  // Realtime: elke teamlid ziet direct wijzigingen van anderen
  Realtime.onChecklistChange(() => loadChecklist());
});
