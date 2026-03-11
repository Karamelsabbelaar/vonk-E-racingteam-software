/**
 * KartPit — Pre-Race Checklist JS
 * Handles toggle, add item, reset, progress bar
 */

async function toggleItem(id) {
  try {
    const res = await API.patch(`/api/checklist/${id}`);
    if (res.ok) {
      const el = document.querySelector(`[data-id="${id}"]`);
      if (el) {
        el.classList.toggle('done', res.done);
      }
      updateAllProgress();
    } else {
      Toast.show('Failed to update item', 'error');
    }
  } catch (err) {
    console.error('Toggle failed:', err);
    Toast.show('Network error', 'error');
  }
}

function updateAllProgress() {
  ['components', 'people'].forEach(cat => {
    const items = document.querySelectorAll(`[data-category="${cat}"]`);
    const done  = document.querySelectorAll(`[data-category="${cat}"].done`).length;
    const total = items.length;
    const fill  = document.getElementById(`progress-${cat}`);
    const label = document.getElementById(`label-${cat}`);
    updateProgress(done, total, fill, label);
  });

  // Overall
  const allItems = document.querySelectorAll('.checklist-item');
  const allDone  = document.querySelectorAll('.checklist-item.done').length;
  const fillAll  = document.getElementById('progress-all');
  const labelAll = document.getElementById('label-all');
  const pct = updateProgress(allDone, allItems.length, fillAll, labelAll);
  const pctEl = document.getElementById('pct-all');
  if (pctEl) pctEl.textContent = pct + '%';
}

async function addItem() {
  try {
    const input = document.getElementById('new-item-text');
    const cat   = document.getElementById('new-item-cat');
    if (!input.value.trim()) { Toast.show('Enter an item first', 'error'); return; }
    if (!cat.value) { Toast.show('Select a category', 'error'); return; }

    const res = await API.post('/api/checklist/add', {
      item: input.value.trim(),
      category: cat.value
    });

    if (res.ok) {
      Toast.show('Item added — refresh to see it', 'success');
      input.value = '';
      location.reload();
    } else {
      Toast.show('Failed to add item', 'error');
    }
  } catch (err) {
    console.error('Add item failed:', err);
    Toast.show('Network error', 'error');
  }
}

async function resetChecklist() {
  if (!confirm('Reset all items to unchecked?')) return;
  try {
    const res = await API.post('/api/checklist/reset', {});
    if (res.ok) {
      document.querySelectorAll('.checklist-item').forEach(el => el.classList.remove('done'));
      updateAllProgress();
      Toast.show('Checklist reset', 'success');
    } else {
      Toast.show('Failed to reset checklist', 'error');
    }
  } catch (err) {
    console.error('Reset failed:', err);
    Toast.show('Network error', 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.checklist-item').forEach(el => {
    el.addEventListener('click', () => toggleItem(Number(el.dataset.id)));
  });
  updateAllProgress();
});
