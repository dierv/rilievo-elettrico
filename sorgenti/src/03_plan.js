/* ============ LIBRERIE ESTERNE (caricate solo quando servono) ============ */
const LIBS = PLATFORM === 'pwa' ? { pdf: ['lib/pdf.min.js', 'lib/pdf.worker.min.js'], zip: ['lib/jszip.min.js'], dxf: ['lib/dxf-parser.js'] } : {
  pdf: ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'],
  zip: ['https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'],
  dxf: ['https://cdn.jsdelivr.net/npm/dxf-parser@1.1.2/dist/dxf-parser.js'],
};
const libP = {};
function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Impossibile caricare una libreria (serve connessione)')); document.head.appendChild(s); }); }
function needLib(n) { if (!libP[n]) libP[n] = (async () => { for (const s of LIBS[n]) await loadScript(s); })().catch(e => { libP[n] = null; throw e; }); return libP[n]; }

/* ============ IMPORT PLANIMETRIA ============ */
const PT_MM = 25.4 / 72;
function canvasToBlob(c, type = 'image/png', q) { return new Promise(r => c.toBlob(r, type, q)); }
function newCanvas(w, h, white = true) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); if (white) { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); } return c; }

async function importPlanFile(file, fromCamera = false) {
  if (!file) return;
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (ext === 'dwg') {
    openModal(`<h3>Il DWG va convertito</h3>
      <p>Il browser non legge i DWG. Hai due strade, entrambe da AutoCAD (o da un visualizzatore DWG gratuito):</p>
      <ol><li><b>DXF (consigliato)</b>: <i>Salva con nome → DXF</i>. Scala e coordinate restano reali, e l'export del rilievo si sovrappone al disegno originale senza spostamenti.</li>
      <li><b>PDF</b>: <i>Stampa → DWG To PDF</i>. Poi in app imposti la scala (es. 1:100) o la calibri con una quota.</li></ol>
      <div class="acts"><button class="pri" onclick="closeModal()">Ho capito</button></div>`);
    return;
  }
  try {
    if (ext === 'pdf' || file.type === 'application/pdf') return await importPdf(file);
    if (ext === 'dxf') return await importDxf(file);
    if ((file.type || '').startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'bmp', 'gif'].includes(ext)) return await importImage(file, fromCamera);
    toast('Formato non supportato: usa PDF, DXF o immagine', true);
  } catch (e) { console.error(e); toast('Errore import: ' + (e.message || e), true, 6000); }
}
function baseName(f) { return f.name.replace(/\.[^.]+$/, ''); }

async function importPdf(file) {
  const b = openModal(`<h3>Importa PDF</h3><div class="mut">Lettura del file…</div>`);
  await needLib('pdf');
  const pdfjs = window.pdfjsLib; pdfjs.GlobalWorkerOptions.workerSrc = LIBS.pdf[1];
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false }).promise;
  const n = doc.numPages;
  b.innerHTML = `<h3>Importa PDF</h3>
    <label class="f">Nome tavola</label><input id="iNm" value="${esc(baseName(file))}">
    <div class="row"><div><label class="f">Pagina</label><select id="iPg">${Array.from({ length: n }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}</select></div>
    <div><label class="f">Scala disegno 1:</label><input id="iSc" type="number" inputmode="decimal" placeholder="es. 100 (vuoto = calibro dopo)"></div></div>
    <label class="f">Qualità</label><select id="iQ"><option value="4096">Normale (consigliata)</option><option value="6144">Alta (tavole grandi, più memoria)</option></select>
    <div class="mut small" style="margin-top:8px">La scala vale solo se il PDF è stampato in scala 1:1 dal CAD (es. DWG To PDF). In dubbio lasciala vuota e calibra su una quota nota.</div>
    <div class="acts"><button onclick="closeModal()">Annulla</button><button id="iGo" class="pri">Importa</button></div>`;
  b.querySelector('#iGo').onclick = async () => {
    const pg = +b.querySelector('#iPg').value, sc = num(b.querySelector('#iSc').value), Q = +b.querySelector('#iQ').value, nm = b.querySelector('#iNm').value.trim() || baseName(file);
    b.innerHTML = `<h3>Importa PDF</h3><div class="mut">Disegno la pagina ${pg}…</div>`;
    try {
      const page = await doc.getPage(pg); const v1 = page.getViewport({ scale: 1 });
      const scale = Math.min(10, Q / Math.max(v1.width, v1.height)); const vp = page.getViewport({ scale });
      const c = newCanvas(Math.round(vp.width), Math.round(vp.height));
      await page.render({ canvasContext: c.getContext('2d'), viewport: vp, background: 'rgb(255,255,255)' }).promise;
      const ppmV = sc ? (1000 / sc) / PT_MM * scale : null;
      closeModal(); await addPlan({ name: nm, src: 'pdf', canvas: c, ppm: ppmV, srcName: file.name + ' p.' + pg });
    } catch (e) { closeModal(); toast('Errore PDF: ' + (e.message || e), true, 6000); }
  };
}
async function importImage(file, fromCamera = false) { // foto del disegno cartaceo o immagine/scansione: raddrizzo, pulisco, scala dal formato del foglio
  const res = await photoPlanFlow(file, fromCamera); if (!res) return;
  const def = fromCamera ? 'Tavola ' + (S.sv.plans.length + 1) : baseName(file);
  const nm = await askText('Nuova tavola', 'Nome tavola', def); if (nm == null) return;
  await addPlan({ name: nm || def, src: 'img', canvas: res.canvas, ppm: res.ppm, srcName: fromCamera ? 'foto' : file.name, jpeg: true });
}

/* ---- DXF ---- */
const M_ID = [1, 0, 0, 1, 0, 0];
const mMul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
const mPt = (M, x, y) => [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]];
const mScale = M => Math.sqrt(Math.abs(M[0] * M[3] - M[1] * M[2]));
const mRot = M => Math.atan2(M[1], M[0]);
function arcPts(cx, cy, r, a0, a1, n) { if (a1 < a0) a1 += Math.PI * 2; const k = Math.max(4, Math.ceil(n * (a1 - a0) / (2 * Math.PI))); const o = []; for (let i = 0; i <= k; i++) { const a = a0 + (a1 - a0) * i / k; o.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return o; }
function bulgePts(p0, p1, b) {
  if (!b) return [p1];
  const th = 4 * Math.atan(b), dx = p1[0] - p0[0], dy = p1[1] - p0[1], c = Math.hypot(dx, dy); if (c < 1e-12) return [p1];
  const r = c / (2 * Math.sin(th / 2)), mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2, h = r * Math.cos(th / 2);
  const cx = mx - h * dy / c, cy = my + h * dx / c; const a0 = Math.atan2(p0[1] - cy, p0[0] - cx); const out = []; const k = Math.max(3, Math.ceil(Math.abs(th) / 0.2));
  for (let i = 1; i <= k; i++) { const a = a0 + th * i / k; out.push([cx + Math.abs(r) * Math.cos(a), cy + Math.abs(r) * Math.sin(a)]); }
  return out;
}
function dxfCollect(dx) {
  const layers = (dx.tables && dx.tables.layer && dx.tables.layer.layers) || {};
  const hid = n => { const L = layers[n]; return L && (L.visible === false || L.frozen); };
  const blocks = dx.blocks || {}; const out = [];
  const ocs = (e, M) => (e.extrusionDirectionZ < 0 || (e.extrusionDirection && e.extrusionDirection.z < 0)) ? mMul(M, [-1, 0, 0, 1, 0, 0]) : M;
  const poly = (M, pts, closed) => { if (pts.length > 1) out.push({ t: 'l', p: pts.map(q => mPt(M, q[0], q[1])), c: !!closed }); };
  function walk(ents, M, depth) {
    for (const e of ents || []) {
      if (e.inPaperSpace || hid(e.layer)) continue;
      try {
        switch (e.type) {
          case 'LINE': poly(M, e.vertices.map(v => [v.x, v.y])); break;
          case 'LWPOLYLINE': case 'POLYLINE': {
            const Mo = ocs(e, M); const vs = (e.vertices || []).filter(v => v && isFinite(v.x)); if (vs.length < 2) break;
            const pts = [[vs[0].x, vs[0].y]];
            for (let i = 1; i < vs.length; i++) pts.push(...bulgePts([vs[i - 1].x, vs[i - 1].y], [vs[i].x, vs[i].y], vs[i - 1].bulge));
            if (e.shape) pts.push(...bulgePts([vs[vs.length - 1].x, vs[vs.length - 1].y], [vs[0].x, vs[0].y], vs[vs.length - 1].bulge));
            poly(Mo, pts, false); break;
          }
          case 'CIRCLE': { const Mo = ocs(e, M); poly(Mo, arcPts(e.center.x, e.center.y, e.radius, 0, Math.PI * 2, 36)); break; }
          case 'ARC': { const Mo = ocs(e, M); poly(Mo, arcPts(e.center.x, e.center.y, e.radius, e.startAngle, e.endAngle, 36)); break; }
          case 'ELLIPSE': {
            const c = e.center, mj = e.majorAxisEndPoint, ra = e.axisRatio || 1; const R = Math.hypot(mj.x, mj.y), rot = Math.atan2(mj.y, mj.x);
            let a0 = e.startAngle || 0, a1 = e.endAngle == null ? Math.PI * 2 : e.endAngle; if (a1 <= a0) a1 += Math.PI * 2;
            const pts = []; for (let i = 0; i <= 40; i++) { const a = a0 + (a1 - a0) * i / 40; const x = R * Math.cos(a), y = R * ra * Math.sin(a); pts.push([c.x + x * Math.cos(rot) - y * Math.sin(rot), c.y + x * Math.sin(rot) + y * Math.cos(rot)]); }
            poly(M, pts); break;
          }
          case 'SPLINE': { const p = (e.fitPoints && e.fitPoints.length > 1 ? e.fitPoints : e.controlPoints) || []; poly(M, p.map(v => [v.x, v.y])); break; }
          case 'SOLID': case '3DFACE': { const p = (e.points || e.vertices || []).map(v => [v.x, v.y]); if (p.length > 2) poly(M, p.concat([p[0]])); break; }
          case 'TEXT': case 'MTEXT': {
            const P = e.startPoint || e.position; if (!P) break; let s = String(e.text || '');
            if (e.type === 'MTEXT') s = s.replace(/\\P/g, ' ').replace(/\\[A-Za-z][^;]*;/g, '').replace(/[{}]/g, '').replace(/\\~/g, ' ');
            const h = (e.textHeight || e.height || 1); const p = mPt(M, P.x, P.y);
            out.push({ t: 't', p, h: h * mScale(M), r: (e.rotation || 0) * Math.PI / 180 + mRot(M), s: s.slice(0, 60) }); break;
          }
          case 'INSERT': {
            const b = blocks[e.name]; if (!b || depth > 6) break;
            const bp = b.position || { x: 0, y: 0 }; const sx = e.xScale || 1, sy = e.yScale || 1, a = (e.rotation || 0) * Math.PI / 180; const P = e.position || { x: 0, y: 0 };
            let T = [Math.cos(a) * sx, Math.sin(a) * sx, -Math.sin(a) * sy, Math.cos(a) * sy, P.x, P.y];
            T = mMul(T, [1, 0, 0, 1, -bp.x, -bp.y]);
            walk(b.entities, mMul(ocs(e, M), T), depth + 1); break;
          }
        }
      } catch (err) { /* entità malformata: ignora */ }
    }
  }
  walk(dx.entities, M_ID, 0);
  return out;
}
function pct(arr, q) { const a = arr.slice().sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.max(0, Math.floor(q * (a.length - 1))))]; }
async function importDxf(file) {
  const b = openModal(`<h3>Importa DXF</h3><div class="mut">Lettura del disegno… (file grandi: qualche secondo)</div>`);
  await needLib('dxf');
  const text = await file.text(); await sleep(30);
  let dx; try { dx = new window.DxfParser().parseSync(text); } catch (e) { closeModal(); toast('DXF non leggibile: ' + (e.message || e), true, 6000); return; }
  const prims = dxfCollect(dx);
  if (!prims.length) { closeModal(); toast('Il DXF non contiene geometrie nello spazio modello', true); return; }
  const xs = [], ys = []; const step = Math.max(1, Math.floor(prims.length / 4000));
  for (let i = 0; i < prims.length; i += step) { const q = prims[i]; const pts = q.t === 'l' ? q.p : [q.p]; for (const p of pts) { if (isFinite(p[0]) && isFinite(p[1])) { xs.push(p[0]); ys.push(p[1]); } } }
  let minX = pct(xs, 0.003), maxX = pct(xs, 0.997), minY = pct(ys, 0.003), maxY = pct(ys, 0.997);
  const pw = (maxX - minX) * 0.03 || 1, ph = (maxY - minY) * 0.03 || 1; minX -= pw; maxX += pw; minY -= ph; maxY += ph;
  const W = maxX - minX, H = maxY - minY;
  const iu = dx.header && dx.header.$INSUNITS; const um = { 1: 0.0254, 2: 0.3048, 4: 0.001, 5: 0.01, 6: 1 }[iu];
  const guess = um || (Math.max(W, H) > 3000 ? 0.001 : Math.max(W, H) > 300 ? 0.01 : 1);
  b.innerHTML = `<h3>Importa DXF</h3>
    <div class="mut small">${prims.length.toLocaleString('it-IT')} elementi • estensione ${itNum(W, 0)} × ${itNum(H, 0)} unità</div>
    <label class="f">Nome tavola</label><input id="iNm" value="${esc(baseName(file))}">
    <div class="row"><div><label class="f">Unità del disegno</label><select id="iU"><option value="0.001">millimetri</option><option value="0.01">centimetri</option><option value="1">metri</option></select></div>
    <div><label class="f">Qualità</label><select id="iQ"><option value="4096">Normale</option><option value="6144">Alta</option></select></div></div>
    <div class="mut small" style="margin-top:8px">Controlla l'unità: con l'unità giusta scala e coordinate sono già reali e l'export DXF del rilievo si sovrappone al disegno originale.</div>
    <div class="acts"><button onclick="closeModal()">Annulla</button><button id="iGo" class="pri">Importa</button></div>`;
  b.querySelector('#iU').value = String(guess);
  b.querySelector('#iGo').onclick = async () => {
    const u = +b.querySelector('#iU').value, Q = +b.querySelector('#iQ').value, nm = b.querySelector('#iNm').value.trim() || baseName(file);
    const s = Q / Math.max(W, H); const c = newCanvas(Math.ceil(W * s), Math.ceil(H * s)); const x = c.getContext('2d');
    x.strokeStyle = '#000'; x.lineWidth = 1.5; x.lineJoin = 'round'; x.fillStyle = '#333';
    const X = p => (p[0] - minX) * s, Y = p => (maxY - p[1]) * s;
    x.beginPath();
    for (const q of prims) if (q.t === 'l') { x.moveTo(X(q.p[0]), Y(q.p[0])); for (let i = 1; i < q.p.length; i++) x.lineTo(X(q.p[i]), Y(q.p[i])); }
    x.stroke();
    for (const q of prims) if (q.t === 't') { const fs = q.h * s; if (fs < 5 || fs > 400) continue; x.save(); x.translate(X(q.p), Y(q.p)); x.rotate(-q.r); x.font = fs + 'px sans-serif'; x.fillText(q.s, 0, 0); x.restore(); }
    closeModal();
    await addPlan({ name: nm, src: 'dxf', canvas: c, ppm: s / u, dxf: { minX, maxY, s, u }, srcName: file.name });
  };
}

async function addPlan({ name, src, canvas, ppm: ppmV, dxf, srcName, jpeg = false }) {
  const id = uid('pl');
  let blob = jpeg ? null : await canvasToBlob(canvas, 'image/png'); // le foto in JPEG: in PNG peserebbero decine di MB
  if (!blob || blob.size > 19 * 1024 * 1024) blob = await canvasToBlob(canvas, 'image/jpeg', 0.88);
  const plan = { id, name, src, w: canvas.width, h: canvas.height, ppm: ppmV || null, dxf: dxf || null, srcName, local: true, asset: null, created: Date.now(), projV: 2 };
  S.sv.plans.push(plan);
  await Uploads.add('plan_' + id, blob, 'plan', id);
  setPlanImage(id, canvas);
  Sync.mark('meta', 'plan:' + id);
  switchPlan(id);
  if (!plan.ppm) { setTool('cal'); toast('Calibra la scala: tocca due punti di cui conosci la distanza (es. una quota).', false, 6000); }
  else { setTool('sel'); toast('Tavola importata. Ora disegna la prima stanza con "Stanza".', false, 5000); }
}

/* ---- immagine della tavola ---- */
function setPlanImage(pid, canvas) {
  const w = canvas.width, h = canvas.height;
  // riquadro della parte disegnata (per inquadrare solo il disegno, non i bordi bianchi del foglio)
  const k = Math.max(1, Math.ceil(Math.max(w, h) / 900)); const sw = Math.floor(w / k), sh = Math.floor(h / k);
  const t = newCanvas(sw, sh); t.getContext('2d').drawImage(canvas, 0, 0, sw, sh);
  const d = t.getContext('2d').getImageData(0, 0, sw, sh).data; let x0 = sw, y0 = sh, x1 = 0, y1 = 0;
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) { const i = (y * sw + x) * 4; if (d[i + 3] > 128 && d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11 < 225) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
  const m = 8; const cb = x1 > x0 ? [Math.max(0, (x0 - m) * k), Math.max(0, (y0 - m) * k), Math.min(w, (x1 + m) * k), Math.min(h, (y1 + m) * k)] : null;
  S.planImg[pid] = { canvas, w, h, cb };
}
async function loadPlanImage(pid) {
  if (S.planImg[pid]) return S.planImg[pid];
  const p = planOf(pid); const url = blobUrl('plan_' + pid, p.asset);
  if (!url) throw new Error('Planimetria non disponibile su questo dispositivo');
  const img = new Image(); img.src = url; await img.decode();
  const c = newCanvas(img.naturalWidth, img.naturalHeight); c.getContext('2d').drawImage(img, 0, 0);
  setPlanImage(pid, c); return S.planImg[pid];
}
