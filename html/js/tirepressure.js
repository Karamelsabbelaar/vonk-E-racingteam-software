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

  // Validatie — alle vier moeten ingevuld zijn
  if ([lv, rv, la, ra].some(v => isNaN(v) || v <= 0)) {
    Toast.show('Vul alle vier de bandspanningen in (in bar)', 'error');
    return;
  }

  // Haal de track_id op van de volgende/huidige race
  let trackId = null;
  try {
    const track = await Tracks.getNext();
    if (track) trackId = track.id;
  } catch(e) {
    // geen track gevonden, slaan we op zonder track_id
  }

  // pitstop_id = meest recent opgeslagen pitstop
  let pitstopId = null;
  try {
    const stops = await Pitstops.getAll();
    if (stops.length) pitstopId = stops[0].id;
  } catch(e) {}

  try {
    await TirePressures.add(trackId, pitstopId, lv, rv, la, ra);
    Toast.show('Bandenspanning opgeslagen ✓', 'success');

    // Velden leegmaken
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

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>LV</th>
            <th>RV</th>
            <th>LA</th>
            <th>RA</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              <td style="font-size:13px;color:var(--text3)">
                ${new Date(row.created_at).toLocaleString('nl-NL', { dateStyle:'short', timeStyle:'short' })}
              </td>
              <td style="font-family:var(--font-display);font-size:20px">${row.Links_voor ?? '–'}</td>
              <td style="font-family:var(--font-display);font-size:20px">${row.Rechts_voor ?? '–'}</td>
              <td style="font-family:var(--font-display);font-size:20px">${row.Links_achter ?? '–'}</td>
              <td style="font-family:var(--font-display);font-size:20px">${row.Rechts_achter ?? '–'}</td>
              <td>
                <button onclick="deleteTirePressure(${row.id})"
                        class="btn btn-ghost btn-sm" style="opacity:0.4">✕</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;

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
