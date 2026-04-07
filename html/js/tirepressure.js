/**
 * KartPit — Bandenspanning
 * Slaat spanning op gekoppeld aan de laatste pitstop
 */

// ── Spanning opslaan ───────────────────────────────────────────
async function saveTirePressure() {
  const get = id => parseFloat(document.getElementById(id)?.value);

  const lv = get('tp-lv');
  const rv = get('tp-rv');
  const la = get('tp-la');
  const ra = get('tp-ra');

  if ([lv, rv, la, ra].some(v => isNaN(v) || v <= 0)) {
    Toast.show('Vul alle vier de bandspanningen in (in bar)', 'error');
    return;
  }

  let trackId = null;
  try {
    const track = await Tracks.getNext?.();
    if (track) trackId = track.id;
  } catch(e) {}

  let pitstopId = null;
  try {
    const stops = await Pitstops.getAll();
    if (stops.length) pitstopId = stops[0].id;
  } catch(e) {}

  try {
    await TirePressures.add(trackId, pitstopId, lv, rv, la, ra);
    Toast.show('Bandenspanning opgeslagen ✓', 'success');
    ['tp-lv', 'tp-rv', 'tp-la', 'tp-ra'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    await renderTirePressureHistory();
  } catch(e) {
    Toast.show('Opslaan mislukt: ' + e.message, 'error');
  }
}

// ── History weergeven ──────────────────────────────────────────
async function renderTirePressureHistory() {
  const container = document.getElementById('tire-pressure-history');
  if (!container) return;

  try {
    const data = await TirePressures.getAll();

    if (!data.length) {
      container.innerHTML = '<p style="color:var(--text3);text-align:center;padding:16px 0">Nog geen metingen opgeslagen</p>';
      return;
    }

    const fmtVal = v => (v != null && v !== '') ? `${v} bar` : '–';
    container.innerHTML = data.map(row => `
      <div style="border-bottom:1px solid var(--border);padding:16px 0;last-child{border:0}">
        <div style="font-size:13px;color:var(--text3);margin-bottom:12px">
          ${new Date(row.created_at).toLocaleString('nl-NL', { dateStyle:'short', timeStyle:'short' })}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;max-width:320px;margin-bottom:10px;border:2px solid var(--border);border-radius:8px;overflow:hidden">
          <div style="padding:10px 12px;background:var(--surface2)">
            <div style="font-size:11px;font-weight:600;letter-spacing:.05em;color:var(--text3);text-transform:uppercase;margin-bottom:4px">Links voor</div>
            <div style="font-family:var(--font-display);font-size:22px;color:var(--accent)">${fmtVal(row.links_voor)}</div>
          </div>
          <div style="padding:10px 12px;background:var(--surface2);border-left:2px solid var(--border)">
            <div style="font-size:11px;font-weight:600;letter-spacing:.05em;color:var(--text3);text-transform:uppercase;margin-bottom:4px">Rechts voor</div>
            <div style="font-family:var(--font-display);font-size:22px;color:var(--accent)">${fmtVal(row.rechts_voor)}</div>
          </div>
          <div style="padding:10px 12px;background:var(--surface2);border-top:2px solid var(--border)">
            <div style="font-size:11px;font-weight:600;letter-spacing:.05em;color:var(--text3);text-transform:uppercase;margin-bottom:4px">Links achter</div>
            <div style="font-family:var(--font-display);font-size:22px;color:var(--accent)">${fmtVal(row.links_achter)}</div>
          </div>
          <div style="padding:10px 12px;background:var(--surface2);border-top:2px solid var(--border);border-left:2px solid var(--border)">
            <div style="font-size:11px;font-weight:600;letter-spacing:.05em;color:var(--text3);text-transform:uppercase;margin-bottom:4px">Rechts achter</div>
            <div style="font-family:var(--font-display);font-size:22px;color:var(--accent)">${fmtVal(row.rechts_achter)}</div>
          </div>
        </div>
        <button onclick="deleteTirePressure(${row.id})" class="btn btn-ghost btn-sm" style="opacity:0.6">✕ Verwijderen</button>
      </div>`).join('');

  } catch(e) {
    container.innerHTML = `<p style="color:var(--red)">Fout: ${e.message}</p>`;
  }
}

// ── Meting verwijderen ─────────────────────────────────────────
async function deleteTirePressure(id) {
  if (!confirm('Meting verwijderen?')) return;
  try {
    await TirePressures.remove(id);
    Toast.show('Meting verwijderd', 'success');
    await renderTirePressureHistory();
  } catch(e) {
    Toast.show('Fout: ' + e.message, 'error');
  }
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('tire-pressure-history')) {
    renderTirePressureHistory();
  }
});


// Opslaan mislukt: Could not find the 'Links_achter' column of 'tire_pressures' in the schema cache
