// ─── STATE ───────────────────────────────────────────────────
let sessionRunning = false;
let lapStartTime   = 0;
let sessionStart   = 0;
let animFrame      = null;
let laps           = [];   // { lap, lapMs, totalMs, diffMs, isBest }
let bestLapMs      = Infinity;

// ─── FORMAT HELPERS ──────────────────────────────────────────
function formatTime(ms) {
  if (ms < 0) ms = 0;
  const totalSec = Math.floor(ms / 1000);
  const min      = Math.floor(totalSec / 60);
  const sec      = totalSec % 60;
  const millis   = Math.floor(ms % 1000);
  return `${pad2(min)}:${pad2(sec)}.${pad3(millis)}`;
}
function pad2(n) { return String(n).padStart(2, '0'); }
function pad3(n) { return String(n).padStart(3, '0'); }
function formatDiff(ms) {
  if (ms === null) return '—';
  const sign = ms <= 0 ? '−' : '+';
  return sign + formatTime(Math.abs(ms));
}

// ─── TICK LOOP ────────────────────────────────────────────────
function tick() {
  const now   = performance.now();
  const lapMs = now - lapStartTime;
  const totMs = now - sessionStart;
  document.getElementById('lapDisplay').textContent   = formatTime(lapMs);
  document.getElementById('totalDisplay').textContent = formatTime(totMs);
  animFrame = requestAnimationFrame(tick);
}

// ─── SESSION CONTROL ──────────────────────────────────────────
function startSession() {
  sessionRunning = true;
  const now      = performance.now();
  lapStartTime   = now;
  sessionStart   = now;
  laps           = [];
  bestLapMs      = Infinity;

  document.getElementById('lapDisplay').textContent    = '00:00.000';
  document.getElementById('totalDisplay').textContent  = '00:00.000';
  document.getElementById('lapNumber').textContent     = '1';
  document.getElementById('bestLap').textContent       = '—';
  document.getElementById('diffDisplay').textContent   = '—';
  document.getElementById('lapTableBody').innerHTML    =
    '<tr class="empty-row"><td colspan="5">Nog geen rondes opgeslagen</td></tr>';

  document.getElementById('lapDisplay').classList.add('running');
  document.getElementById('btnExport').disabled = true;
  setSessionLabel(true);
  setBtns({ start: false, lap: true, stop: true });

  animFrame = requestAnimationFrame(tick);
}

function stopSession() {
  if (!sessionRunning) return;
  sessionRunning = false;
  cancelAnimationFrame(animFrame);

  document.getElementById('lapDisplay').classList.remove('running');
  setSessionLabel(false);
  setBtns({ start: true, lap: false, stop: false });

  if (laps.length > 0) {
    document.getElementById('btnExport').disabled = false;
  }
}

// ─── SAVE LAP ─────────────────────────────────────────────────
function saveLap() {
  if (!sessionRunning) return;

  const now     = performance.now();
  const lapMs   = now - lapStartTime;
  const totalMs = now - sessionStart;
  const lapNum  = laps.length + 1;

  let diffMs = null;
  if (laps.length > 0) {
    diffMs = lapMs - laps[laps.length - 1].lapMs;
  }

  const isBest = lapMs < bestLapMs;
  if (isBest) bestLapMs = lapMs;

  laps.push({ lap: lapNum, lapMs, totalMs, diffMs, isBest });
  renderTable();

  document.getElementById('lapNumber').textContent = lapNum + 1;
  document.getElementById('bestLap').textContent   = formatTime(bestLapMs);

  const diffEl = document.getElementById('diffDisplay');
  diffEl.textContent = formatDiff(diffMs);
  diffEl.className   = 'info-value';
  if (diffMs !== null) diffEl.classList.add(diffMs <= 0 ? 'faster' : 'slower');

  lapStartTime = now;

  // Flash — KartPit oranje ipv wit
  const disp = document.getElementById('lapDisplay');
  disp.style.color = '#F8AB21';
  setTimeout(() => { disp.style.color = ''; }, 180);
}

// ─── TABLE RENDERING ──────────────────────────────────────────
function renderTable() {
  const tbody = document.getElementById('lapTableBody');
  tbody.innerHTML = '';

  [...laps].reverse().forEach((l, reverseIdx) => {
    const tr = document.createElement('tr');
    if (reverseIdx === 0) tr.classList.add('new-row');
    if (l.isBest)         tr.classList.add('best-row');

    let badge = '';
    if (l.isBest) {
      badge = '<span class="badge badge-best">BESTE</span>';
    } else if (l.diffMs !== null && l.diffMs < 0) {
      badge = '<span class="badge badge-fast">SNELLER</span>';
    } else if (l.diffMs !== null && l.diffMs > 0) {
      badge = '<span class="badge badge-slow">TRAGER</span>';
    } else {
      badge = '<span class="badge badge-normal">RONDE 1</span>';
    }

    let diffHtml = '<span>—</span>';
    if (l.diffMs !== null) {
      const cls  = l.diffMs <= 0 ? 'diff-fast' : 'diff-slow';
      const sign = l.diffMs <= 0 ? '−' : '+';
      diffHtml   = `<span class="${cls}">${sign}${formatTime(Math.abs(l.diffMs))}</span>`;
    }

    tr.innerHTML = `
      <td>#${pad2(l.lap)}</td>
      <td>${formatTime(l.lapMs)}</td>
      <td>${formatTime(l.totalMs)}</td>
      <td>${diffHtml}</td>
      <td>${badge}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ─── PDF EXPORT ───────────────────────────────────────────────
function exportPDF() {
  if (laps.length === 0) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const dateStr = new Date().toLocaleString('nl-NL');

  // Achtergrond — KartPit donker
  doc.setFillColor(15, 15, 26);
  doc.rect(0, 0, 210, 297, 'F');

  // Oranje accentlijn bovenaan
  doc.setFillColor(248, 171, 33);
  doc.rect(0, 0, 210, 3, 'F');

  // Titel
  doc.setTextColor(248, 171, 33);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('E-KART LAPTIMER PRO', 105, 18, { align: 'center' });

  // Datum
  doc.setTextColor(106, 106, 138);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Sessie geëxporteerd op: ${dateStr}`, 105, 27, { align: 'center' });

  // Samenvatting
  doc.setTextColor(160, 160, 192);
  doc.setFontSize(9);
  doc.text(
    `Totaal rondes: ${laps.length}   |   Beste ronde: ${formatTime(bestLapMs)}   |   Totale sessietijd: ${formatTime(laps[laps.length - 1].totalMs)}`,
    105, 36, { align: 'center' }
  );

  // Tabel
  const tableData = laps.map(l => {
    const diffText = l.diffMs === null
      ? '—'
      : (l.diffMs <= 0 ? '−' : '+') + formatTime(Math.abs(l.diffMs));
    const status = l.isBest ? 'BESTE'
      : l.diffMs !== null && l.diffMs < 0 ? 'SNELLER'
      : l.diffMs !== null && l.diffMs > 0 ? 'TRAGER'
      : 'RONDE 1';
    return [`#${pad2(l.lap)}`, formatTime(l.lapMs), formatTime(l.totalMs), diffText, status];
  });

  doc.autoTable({
    startY: 44,
    head: [['RONDE', 'RONDETIJD', 'TOTAALTIJD', 'VERSCHIL', 'STATUS']],
    body: tableData,
    theme: 'grid',
    styles: {
      font: 'courier',
      fontSize: 9,
      textColor: [160, 160, 192],
      fillColor: [28, 28, 46],
      lineColor: [46, 46, 72],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [25, 25, 40],
      textColor: [248, 171, 33],
      fontSize: 7,
      fontStyle: 'bold',
      halign: 'left',
    },
    alternateRowStyles: { fillColor: [34, 34, 58] },
    didParseCell(data) {
      if (data.section === 'body' && laps[data.row.index]?.isBest) {
        data.cell.styles.textColor = [255, 215, 0];
      }
    },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(106, 106, 138);
    doc.setFontSize(7);
    doc.text('E-KART LAPTIMER PRO', 14, 290);
    doc.text(`Pagina ${i} van ${pageCount}`, 196, 290, { align: 'right' });
  }

  doc.save(`ekart-sessie-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ─── UI HELPERS ───────────────────────────────────────────────
function setBtns({ start, lap, stop }) {
  document.getElementById('btnStart').disabled = !start;
  document.getElementById('btnLap').disabled   = !lap;
  document.getElementById('btnStop').disabled  = !stop;
}

function setSessionLabel(active) {
  const el = document.getElementById('sessionInfo');
  el.textContent = active ? 'SESSIE ACTIEF' : 'SESSIE INACTIEF';
  el.classList.toggle('active', active);
}

// ─── KEYBOARD SHORTCUTS ───────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!document.getElementById('btnLap').disabled) saveLap();
  }
  if (e.code === 'Enter') {
    if (!document.getElementById('btnStart').disabled) startSession();
    else if (!document.getElementById('btnStop').disabled) stopSession();
  }
});
