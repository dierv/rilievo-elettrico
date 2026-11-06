/* ---- tavola da foto del disegno cartaceo: raddrizzamento prospettico, pulizia, scala dal formato del foglio ---- */
const SHEETS = { A4: [210, 297], A3: [297, 420], A2: [420, 594], A1: [594, 841], A0: [841, 1189] };
// omografia che porta i 4 punti src nei 4 punti dst (ordine: alto-sx, alto-dx, basso-dx, basso-sx); ritorna la matrice 3x3 per righe
function homography(src, dst) {
  const A = [], b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [X, Y] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -X * x, -X * y]); b.push(X);
    A.push([0, 0, 0, x, y, 1, -Y * x, -Y * y]); b.push(Y);
  }
  const h = solve8(A, b); return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1];
}
function solve8(A, b) { // eliminazione di Gauss con pivot
  const n = 8, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]]; const d = M[c][c] || 1e-12;
    for (let r = 0; r < n; r++) { if (r === c) continue; const f = M[r][c] / d; if (!f) continue; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r, i) => r[n] / (r[i] || 1e-12));
}
// ricampiona src nel rettangolo W×H: per ogni pixel di uscita Hinv dà il punto di partenza (bilineare); fuori dall'immagine: bianco
function warpImage(src, Hinv, W, H) {
  const sw = src.width, sh = src.height, sd = src.getContext('2d').getImageData(0, 0, sw, sh).data;
  const out = newCanvas(W, H), od = out.getContext('2d').createImageData(W, H), o = od.data;
  const [a, b, c, d, e, f, g, h, i] = Hinv;
  for (let y = 0; y < H; y++) {
    let u = b * y + c, v = e * y + f, w = h * y + i; // a x + (b y + c): avanzo per colonne sommando a, d, g
    for (let x = 0; x < W; x++, u += a, v += d, w += g) {
      const sx = u / w, sy = v / w; const p = (y * W + x) * 4;
      if (sx < 0 || sy < 0 || sx >= sw - 1 || sy >= sh - 1) { o[p] = o[p + 1] = o[p + 2] = 255; o[p + 3] = 255; continue; }
      const x0 = sx | 0, y0 = sy | 0, fx = sx - x0, fy = sy - y0; const q = (y0 * sw + x0) * 4, q2 = q + sw * 4;
      const w00 = (1 - fx) * (1 - fy), w10 = fx * (1 - fy), w01 = (1 - fx) * fy, w11 = fx * fy;
      o[p] = sd[q] * w00 + sd[q + 4] * w10 + sd[q2] * w01 + sd[q2 + 4] * w11;
      o[p + 1] = sd[q + 1] * w00 + sd[q + 5] * w10 + sd[q2 + 1] * w01 + sd[q2 + 5] * w11;
      o[p + 2] = sd[q + 2] * w00 + sd[q + 6] * w10 + sd[q2 + 2] * w01 + sd[q2 + 6] * w11;
      o[p + 3] = 255;
    }
  }
  out.getContext('2d').putImageData(od, 0, 0); return out;
}
// "come una scansione": tolgo ombre e grigio della carta dividendo per lo sfondo sfocato, poi allargo il contrasto (canale per canale, così il rosso resta rosso)
function cleanPaper(c) {
  const W = c.width, H = c.height, k = 8, bw = Math.max(1, Math.round(W / k)), bh = Math.max(1, Math.round(H / k));
  const small = newCanvas(bw, bh); const sx = small.getContext('2d'); sx.drawImage(c, 0, 0, bw, bh);
  const bg = newCanvas(bw, bh); const gx = bg.getContext('2d'); gx.filter = 'blur(5px)'; gx.drawImage(small, 0, 0); gx.filter = 'none';
  const big = newCanvas(W, H); big.getContext('2d').drawImage(bg, 0, 0, W, H);
  const x = c.getContext('2d'), img = x.getImageData(0, 0, W, H), d = img.data, bd = big.getContext('2d').getImageData(0, 0, W, H).data;
  const lo = 0.45, kk = 255 / (1 - lo);
  for (let p = 0; p < d.length; p += 4) {
    for (let ch = 0; ch < 3; ch++) { const r = d[p + ch] / Math.max(8, bd[p + ch]); d[p + ch] = r >= 1 ? 255 : r <= lo ? 0 : (r - lo) * kk; }
  }
  x.putImageData(img, 0, 0); return c;
}
function rotateCanvas(c, quarter) { // ruota di 90° in senso orario `quarter` volte
  quarter = ((quarter % 4) + 4) % 4; if (!quarter) return c;
  const sw = quarter % 2 ? c.height : c.width, sh = quarter % 2 ? c.width : c.height; const o = newCanvas(sw, sh); const x = o.getContext('2d');
  x.translate(sw / 2, sh / 2); x.rotate(quarter * Math.PI / 2); x.drawImage(c, -c.width / 2, -c.height / 2); return o;
}
// raddrizza la foto del foglio e calcola la scala: `quad` 4 angoli (px immagine, alto-sx→orario); sheet = [w_mm, h_mm] o null; scala = denominatore (1:100 → 100) o null
function rectifyPhoto(src, quad, sheet, scale, clean) {
  const L = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  const wq = Math.max(L(quad[0], quad[1]), L(quad[3], quad[2])), hq = Math.max(L(quad[0], quad[3]), L(quad[1], quad[2]));
  let mm = null;
  if (sheet) { const land = wq >= hq; mm = land ? [Math.max(...sheet), Math.min(...sheet)] : [Math.min(...sheet), Math.max(...sheet)]; }
  const aspect = mm ? mm[0] / mm[1] : wq / hq;
  const MAX = 3500; let W = Math.round(Math.min(MAX, Math.max(wq, hq * aspect))); let H = Math.round(W / aspect); if (H > MAX) { H = MAX; W = Math.round(H * aspect); }
  const Hinv = homography([[0, 0], [W, 0], [W, H], [0, H]], quad); // da pixel di uscita a pixel della foto
  let out = warpImage(src, Hinv, W, H); if (clean) out = cleanPaper(out);
  const ppm = mm && scale ? W / (mm[0] * scale / 1000) : null; // pixel per metro reale
  return { canvas: out, ppm, mm };
}
/* ---- interfaccia: tocca i 4 angoli del foglio ---- */
async function photoPlanFlow(file, fromCamera) {
  let bmp; try { bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) { bmp = await createImageBitmap(file); } // rispetto l'orientamento EXIF della foto
  const L = Math.max(bmp.width, bmp.height), k = Math.min(1, 4096 / L);
  let src = newCanvas(Math.round(bmp.width * k), Math.round(bmp.height * k)); src.getContext('2d').drawImage(bmp, 0, 0, src.width, src.height); bmp.close && bmp.close();
  return new Promise(resolve => {
    const b = openModal('', true); let quad, drag = null, view = { s: 1, ox: 0, oy: 0 }, rot = 0;
    const render = () => {
      b.innerHTML = `<h3>Raddrizza la foto del disegno</h3>
        <div class="mut small">Trascina i 4 cerchi sugli <b>angoli del foglio</b> (o di un rettangolo di cui conosci le misure). Se la foto è già dritta e intera, «Usa così com'è».</div>
        <div id="rcWrap" style="position:relative;margin:8px 0;background:#2b2f36;border-radius:10px;overflow:hidden;touch-action:none"><canvas id="rcCv" style="display:block;width:100%"></canvas></div>
        <div class="row wrap" style="gap:8px;align-items:flex-end">
          <div><label class="f">I 4 angoli sono di un</label><select id="rcSheet"><option value="A4">foglio A4</option><option value="A3" selected>foglio A3</option><option value="A2">foglio A2</option><option value="A1">foglio A1</option><option value="A0">foglio A0</option><option value="custom">rettangolo di cui so le misure</option><option value="none">non so le misure</option></select></div>
          <div id="rcCustom" class="row hide" style="gap:6px"><div><label class="f">Larghezza mm</label><input id="rcW" type="number" inputmode="decimal" style="width:110px"></div><div><label class="f">Altezza mm</label><input id="rcH" type="number" inputmode="decimal" style="width:110px"></div></div>
          <div><label class="f">Scala del disegno 1:</label><input id="rcScale" type="number" inputmode="decimal" placeholder="es. 100 (vuoto = calibro dopo)" style="width:190px" value="${S.lastScale || ''}"></div>
          <label class="row" style="gap:6px;align-items:center;margin-bottom:8px"><input type="checkbox" id="rcClean" ${fromCamera ? 'checked' : ''}> Pulisci come una scansione</label>
          <button class="sm" id="rcRot">⟳ Ruota foto</button>
        </div>
        <div class="acts"><button id="rcCanc">Annulla</button><button id="rcSkip">Usa così com'è</button><button id="rcGo" class="pri">Raddrizza →</button></div>`;
      const cv = b.querySelector('#rcCv'), wrap = b.querySelector('#rcWrap');
      const cw = Math.min(960, wrap.clientWidth || 900), ch = Math.min(Math.round(window.innerHeight * 0.55), 640);
      cv.width = cw; cv.height = ch; cv.style.height = ch + 'px';
      view.s = Math.min(cw / src.width, ch / src.height); view.ox = (cw - src.width * view.s) / 2; view.oy = (ch - src.height * view.s) / 2;
      if (!quad) { const m = 0.08; quad = [[src.width * m, src.height * m], [src.width * (1 - m), src.height * m], [src.width * (1 - m), src.height * (1 - m)], [src.width * m, src.height * (1 - m)]]; }
      const toV = p => [view.ox + p[0] * view.s, view.oy + p[1] * view.s], toI = (x, y) => [(x - view.ox) / view.s, (y - view.oy) / view.s];
      const draw = () => {
        const x = cv.getContext('2d'); x.clearRect(0, 0, cw, ch); x.drawImage(src, view.ox, view.oy, src.width * view.s, src.height * view.s);
        x.beginPath(); quad.forEach((p, i) => { const v = toV(p); i ? x.lineTo(v[0], v[1]) : x.moveTo(v[0], v[1]); }); x.closePath();
        x.fillStyle = 'rgba(37,99,235,.12)'; x.fill(); x.lineWidth = 2; x.strokeStyle = '#2563eb'; x.stroke();
        quad.forEach((p, i) => { const v = toV(p); x.beginPath(); x.arc(v[0], v[1], 16, 0, Math.PI * 2); x.fillStyle = drag && drag.i === i ? 'rgba(37,99,235,.9)' : 'rgba(255,255,255,.85)'; x.fill(); x.strokeStyle = '#2563eb'; x.lineWidth = 2; x.stroke(); x.fillStyle = drag && drag.i === i ? '#fff' : '#1e3a8a'; x.font = 'bold 13px system-ui'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(i + 1), v[0], v[1]); });
        if (drag) { // lente sopra il dito
          const p = quad[drag.i], v = toV(p), R = 64, Z = 3; let lx = v[0], ly = v[1] - R - 40; if (ly < R + 4) ly = v[1] + R + 40; if (lx < R + 4) lx = R + 4; if (lx > cw - R - 4) lx = cw - R - 4;
          x.save(); x.beginPath(); x.arc(lx, ly, R, 0, Math.PI * 2); x.clip(); x.fillStyle = '#fff'; x.fillRect(lx - R, ly - R, 2 * R, 2 * R);
          x.drawImage(src, p[0] - R / Z, p[1] - R / Z, 2 * R / Z, 2 * R / Z, lx - R, ly - R, 2 * R, 2 * R);
          x.strokeStyle = '#2563eb'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(lx - R, ly); x.lineTo(lx + R, ly); x.moveTo(lx, ly - R); x.lineTo(lx, ly + R); x.stroke(); x.restore();
          x.beginPath(); x.arc(lx, ly, R, 0, Math.PI * 2); x.strokeStyle = '#2563eb'; x.lineWidth = 3; x.stroke();
        }
      };
      draw();
      const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cw / r.width, (e.clientY - r.top) * ch / r.height]; };
      cv.onpointerdown = e => { const [mx, my] = pos(e); let bi = -1, bd = 40; quad.forEach((p, i) => { const v = toV(p); const d = Math.hypot(v[0] - mx, v[1] - my); if (d < bd) { bd = d; bi = i; } }); if (bi < 0) return; cv.setPointerCapture(e.pointerId); drag = { i: bi }; draw(); };
      cv.onpointermove = e => { if (!drag) return; const [mx, my] = pos(e); const p = toI(mx, my); quad[drag.i] = [clamp(p[0], 0, src.width - 1), clamp(p[1], 0, src.height - 1)]; draw(); };
      cv.onpointerup = cv.onpointercancel = () => { drag = null; draw(); };
      b.querySelector('#rcSheet').onchange = e => b.querySelector('#rcCustom').classList.toggle('hide', e.target.value !== 'custom');
      b.querySelector('#rcRot').onclick = () => { src = rotateCanvas(src, 1); rot++; quad = null; render(); };
      b.querySelector('#rcCanc').onclick = () => { closeModal(); resolve(null); };
      const finish = async skip => {
        const sv = b.querySelector('#rcSheet').value, scale = num(b.querySelector('#rcScale').value) || null, clean = b.querySelector('#rcClean').checked;
        let sheet = SHEETS[sv] || null; if (sv === 'custom') { const w = num(b.querySelector('#rcW').value), h = num(b.querySelector('#rcH').value); sheet = w && h ? [w, h] : null; }
        if (scale) S.lastScale = scale;
        b.innerHTML = `<h3>Raddrizza la foto del disegno</h3><div class="mut">${skip ? 'Preparo la tavola…' : 'Raddrizzo la foto…'}</div>`; await new Promise(r => setTimeout(r, 30));
        try {
          let res;
          if (skip) { let c = src; if (clean) { c = newCanvas(src.width, src.height); c.getContext('2d').drawImage(src, 0, 0); cleanPaper(c); } const mm = sheet ? (src.width >= src.height ? [Math.max(...sheet), Math.min(...sheet)] : [Math.min(...sheet), Math.max(...sheet)]) : null; res = { canvas: c, ppm: mm && scale ? c.width / (mm[0] * scale / 1000) : null, mm }; }
          else res = rectifyPhoto(src, quad, sheet, scale, clean);
          closeModal(); resolve(res);
        } catch (e) { console.error(e); closeModal(); toast('Errore nel raddrizzare: ' + (e.message || e), true, 6000); resolve(null); }
      };
      b.querySelector('#rcSkip').onclick = () => finish(true);
      b.querySelector('#rcGo').onclick = () => finish(false);
    };
    render();
  });
}
function addPlanMenu() { // nuova tavola: da file o fotografando il disegno
  const b = openModal(`<h3>Nuova tavola</h3>
    <div class="row" style="gap:10px;margin-top:10px"><button class="pri" style="flex:1;min-height:70px;font-size:16px" id="npFile">📁 Da file<br><span class="small" style="font-weight:400">PDF, DXF o immagine</span></button>
    <button style="flex:1;min-height:70px;font-size:16px" id="npCam">📷 Fotografa il disegno<br><span class="small" style="font-weight:400">poi lo raddrizzi e metti la scala</span></button></div>
    <div class="acts"><button onclick="closeModal()">Annulla</button></div>`);
  b.querySelector('#npFile').onclick = () => { closeModal(); $('#fPlan').click(); };
  b.querySelector('#npCam').onclick = () => { closeModal(); $('#fPlanCam').click(); };
}
