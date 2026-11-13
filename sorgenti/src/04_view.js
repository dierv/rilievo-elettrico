/* ============ DISEGNO ============ */
// vista: schermo = Rot(r) · (pianta · s) + t; r in radianti, positivo = pianta ruotata in senso orario sullo schermo
const vr = () => S.view.r || 0;
const toS = (x, y) => { const v = S.view, r = v.r || 0; if (!r) return [x * v.s + v.tx, y * v.s + v.ty]; const c = Math.cos(r), sn = Math.sin(r); return [(x * c - y * sn) * v.s + v.tx, (x * sn + y * c) * v.s + v.ty]; };
const toB = (sx, sy) => { const v = S.view, r = v.r || 0; const dx = (sx - v.tx) / v.s, dy = (sy - v.ty) / v.s; if (!r) return [dx, dy]; const c = Math.cos(r), sn = Math.sin(r); return [dx * c + dy * sn, -dx * sn + dy * c]; };
function setViewRot(r, keepCenter = true) { // ruota la vista attorno al centro dello schermo
  const c = $('#cv'); const W = c ? c.clientWidth : 0, H = c ? c.clientHeight : 0; const [bx, by] = toB(W / 2, H / 2);
  while (r > Math.PI) r -= 2 * Math.PI; while (r < -Math.PI) r += 2 * Math.PI;
  S.view.r = Math.abs(r) < 1e-4 ? 0 : r; if (keepCenter && c) centerOn(bx, by); rotBtnUpdate(); rotPanelSync(); redraw();
}
function rotPanelSync() { // aggiorna gradi e cursore del pannello senza ridisegnarlo (il cursore potrebbe essere sotto il dito)
  const p = $('#rotPanel'); if (!p || p.classList.contains('hide')) return; const deg = Math.round(vr() * 180 / Math.PI);
  const sl = p.querySelector('[data-r=slider]'); if (sl && document.activeElement !== sl) sl.value = deg; const d = p.querySelector('[data-deg]'); if (d) d.textContent = deg + '°';
}
const symImgs = {};
function symImage(sym) {
  if (!sym.img) return null;
  if (!symImgs[sym.img]) { const im = new Image(); im.onload = () => redraw(); im.src = sym.img; symImgs[sym.img] = im; }
  const im = symImgs[sym.img]; return im.complete && im.naturalWidth ? im : null;
}
function drawShape(x, cx, cy, R, shape, color, draft) {
  x.save(); x.lineWidth = Math.max(1.5, R / 7); x.strokeStyle = color; x.fillStyle = '#fff';
  if (draft) x.setLineDash([3, 2]);
  const P = (pts) => { x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(cx + p[0] * R, cy + p[1] * R) : x.moveTo(cx + p[0] * R, cy + p[1] * R)); x.closePath(); x.fill(); x.stroke(); };
  const X = (k) => { x.beginPath(); x.moveTo(cx - k * R, cy - k * R); x.lineTo(cx + k * R, cy + k * R); x.moveTo(cx + k * R, cy - k * R); x.lineTo(cx - k * R, cy + k * R); x.stroke(); };
  switch (shape) {
    case 'circle': x.beginPath(); x.arc(cx, cy, R * 0.8, 0, 7); x.fill(); x.stroke(); break;
    case 'circleX': x.beginPath(); x.arc(cx, cy, R * 0.85, 0, 7); x.fill(); x.stroke(); X(0.6); break;
    case 'dot': x.beginPath(); x.arc(cx, cy, R * 0.55, 0, 7); x.fillStyle = color; x.fill(); x.stroke(); break;
    case 'square': P([[-.75, -.75], [.75, -.75], [.75, .75], [-.75, .75]]); break;
    case 'squareX': P([[-.75, -.75], [.75, -.75], [.75, .75], [-.75, .75]]); X(0.75); break;
    case 'rect': P([[-1.05, -.55], [1.05, -.55], [1.05, .55], [-1.05, .55]]); x.beginPath(); x.moveTo(cx - R * .7, cy); x.lineTo(cx + R * .7, cy); x.stroke(); break;
    case 'tri': P([[0, -.9], [.85, .65], [-.85, .65]]); break;
    case 'diamond': P([[0, -.95], [.85, 0], [0, .95], [-.85, 0]]); break;
    case 'hex': P([0, 1, 2, 3, 4, 5].map(i => [Math.cos(i * Math.PI / 3) * .9, Math.sin(i * Math.PI / 3) * .9])); break;
    case 'star': P(Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? .42 : .95; return [Math.cos(a) * r, Math.sin(a) * r]; })); break;
    case 'semi': x.beginPath(); x.arc(cx, cy + R * .35, R * .85, Math.PI, 0); x.closePath(); x.fill(); x.stroke(); break;
    case 'line': x.lineWidth = R * .35; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx - R, cy + R * .5); x.lineTo(cx + R, cy - R * .5); x.stroke(); break;
    default: x.beginPath(); x.arc(cx, cy, R * .8, 0, 7); x.fill(); x.stroke();
  }
  x.restore();
}
function drawLeg(x, code, cx, cy, k, rot, draft) { // simbolo della legenda: k = px per metro, rot = angolo CAD (antiorario)
  const L = legGeom(code); if (!L) return false;
  x.save(); x.translate(cx, cy); if (rot) x.rotate(-rot); x.scale(k, -k);
  x.lineWidth = 1.3 / k; x.lineJoin = 'round'; x.lineCap = 'round'; if (draft) x.globalAlpha = 0.75;
  for (const p of L.g) {
    const col = dispCol(p.c);
    if (p.t === 'L') { x.beginPath(); x.moveTo(p.d[0], p.d[1]); x.lineTo(p.d[2], p.d[3]); x.strokeStyle = col; x.stroke(); }
    else if (p.t === 'P') { x.beginPath(); for (let i = 0; i < p.d.length; i += 2) i ? x.lineTo(p.d[i], p.d[i + 1]) : x.moveTo(p.d[i], p.d[i + 1]); if (p.z) x.closePath(); x.strokeStyle = col; x.stroke(); }
    else if (p.t === 'F') { x.beginPath(); for (const q of p.d) { for (let i = 0; i < q.length; i += 2) i ? x.lineTo(q[i], q[i + 1]) : x.moveTo(q[i], q[i + 1]); x.closePath(); } x.fillStyle = col; x.fill('evenodd'); }
    else { // testi sempre leggibili (mai capovolti)
      const fs = p.h * 1.3 * k; if (fs < 4.5) continue;
      const a = (p.r || 0) * Math.PI / 180; const flip = Math.cos(-rot - a) < -0.01;
      x.save(); x.translate(p.x, p.y); x.scale(1 / k, -1 / k); x.rotate(-a + (flip ? Math.PI : 0));
      let ha = (p.ha === 1 || p.ha === 4) ? 'center' : p.ha === 2 ? 'right' : 'left'; let vb = (p.ha === 4 || p.va === 2) ? 'middle' : p.va === 3 ? 'top' : p.va === 1 ? 'bottom' : 'alphabetic';
      if (flip) { if (ha !== 'center') ha = ha === 'left' ? 'right' : 'left'; if (vb !== 'middle') vb = vb === 'top' ? 'alphabetic' : 'top'; }
      x.font = `${fs.toFixed(1)}px Arial, Helvetica, sans-serif`; x.textAlign = ha; x.textBaseline = vb; x.fillStyle = col; x.fillText(p.s, 0, 0); x.restore();
    }
  }
  x.restore(); return true;
}
function drawPlate(x, it, cx, cy, R, draft, rot) { // frutti affiancati lungo il muro, dentro il contorno della placca
  const codes = plCodes(it), n = codes.length, k = R * 2 / 0.38, sp = 0.36 * k, ux = Math.cos(-rot), uy = Math.sin(-rot), w = sp * n;
  x.save(); x.translate(cx, cy); x.rotate(-rot); x.beginPath(); x.rect(-w / 2, -0.42 * k, w, 0.5 * k); x.fillStyle = 'rgba(255,255,255,.75)'; x.fill(); x.setLineDash(draft ? [3, 2] : []); x.strokeStyle = 'rgba(71,85,105,.7)'; x.lineWidth = 1; x.stroke(); x.restore();
  codes.forEach((c, i) => { const off = ((n - 1) / 2 - i) * sp; /* posto 1 a sinistra di chi guarda la parete */ if (c) drawSym(x, symOf(c), cx + ux * off, cy + uy * off, R, draft, rot); else { x.save(); x.translate(cx + ux * off, cy + uy * off); x.rotate(-rot); x.strokeStyle = 'rgba(71,85,105,.6)'; x.beginPath(); x.moveTo(-0.08 * k, -0.25 * k); x.lineTo(0.08 * k, -0.09 * k); x.stroke(); x.restore(); } });
}
function plateRight(it, cx, R) { // bordo destro (sullo schermo) del riquadro della placca, per non scriverci sopra
  const k = R * 2 / 0.38, w = 0.36 * k * it.pl.length, a = -(itemRot(it) - vr()), c = Math.cos(a), s = Math.sin(a);
  return cx + Math.max(...[[-w / 2, -0.42 * k], [w / 2, -0.42 * k], [-w / 2, 0.08 * k], [w / 2, 0.08 * k]].map(([lx, ly]) => lx * c - ly * s));
}
function drawSymFit(x, sym, cx, cy, size) { // simbolo intero dentro un quadrato (legende, elenchi)
  const lg = sym.leg && legGeom(sym.code);
  if (!lg) return drawSym(x, sym, cx, cy, size / 2, false);
  const [x0, y0, x1, y1] = lg.bb; const k = size / Math.max(x1 - x0, y1 - y0, 0.05); drawLeg(x, sym.code, cx - (x0 + x1) / 2 * k, cy + (y0 + y1) / 2 * k, k, 0, false);
}
function drawSym(x, sym, cx, cy, R, draft, rot) {
  if (sym.leg && drawLeg(x, sym.code, cx, cy, R * 2 / 0.38, rot || 0, draft)) return;
  const im = symImage(sym);
  if (im) { x.save(); if (draft) x.globalAlpha = .65; x.drawImage(im, cx - R, cy - R, 2 * R, 2 * R); x.restore(); return; }
  drawShape(x, cx, cy, R, sym.shape, sym.color, draft);
}
const iconCache = {};
function symIcon(sym, px = 44) {
  const key = sym.code + sym.shape + sym.color + (sym.img ? sym.img.length : '') + (sym.leg ? 'L' : '') + px;
  if (iconCache[key]) return iconCache[key];
  const c = newCanvas(px, px, false); const x = c.getContext('2d');
  const lg = sym.leg && legGeom(sym.code);
  if (lg) { const [x0, y0, x1, y1] = lg.bb; const k = (px - 4) / Math.max(x1 - x0, y1 - y0, 0.05); drawLeg(x, sym.code, px / 2 - (x0 + x1) / 2 * k, px / 2 + (y0 + y1) / 2 * k, k, 0, false); }
  else if (sym.img) { const im = symImage(sym); if (!im) return ''; x.drawImage(im, 2, 2, px - 4, px - 4); }
  else drawShape(x, px / 2, px / 2, px * 0.38, sym.shape, sym.color, false);
  return (iconCache[key] = c.toDataURL());
}
const photoColor = ph => ph.kind === 'quadro' || ph.kind === 'dettaglio' ? '#0891b2' : ph.aiSt === 'done' ? '#1d4ed8' : (ph.aiSt === 'run' || ph.aiSt === 'queued') ? '#d97706' : ph.aiSt === 'err' ? '#b91c1c' : '#64748b';

const ZMIN = 0.02, ZMAX = 150; // zoom: fino a vedere separati oggetti a pochi millimetri
let drawQ = false;
function redraw() { if (!drawQ) { drawQ = true; requestAnimationFrame(draw); } }
const roomsOfPlan = pid => S.rooms.filter(r => r.planId === pid && r.poly && r.poly.length >= 3);
function editingRoom() { return S.tool === 'sel' && S.sel && S.sel.t === 'room' ? roomById(S.sel.id) : null; }
function draw() {
  drawQ = false;
  const c = $('#cv'); if (!c || $('#sv').classList.contains('hide')) return;
  const dpr = window.devicePixelRatio || 1; const W = c.clientWidth, H = c.clientHeight;
  if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
  const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.fillStyle = '#e3e6ea'; x.fillRect(0, 0, W, H);
  const P = curPlan(); S.disp = new Map(); colBtnUpdate();
  if (!P) { x.fillStyle = '#5d6672'; x.font = '16px sans-serif'; x.textAlign = 'center'; x.fillText('Aggiungi una tavola con "+ Tavola" (PDF, DXF o foto della pianta)', W / 2, H / 2); return; }
  const im = S.planImg[P.id]; const v = S.view;
  if (im) { x.save(); x.translate(v.tx, v.ty); if (v.r) x.rotate(v.r); x.scale(v.s, v.s); x.imageSmoothingEnabled = v.s < 1.5; x.drawImage(im.canvas, 0, 0); x.restore(); }
  else { x.fillStyle = '#5d6672'; x.font = '15px sans-serif'; x.textAlign = 'center'; x.fillText('Carico la planimetria…', W / 2, H / 2); }
  const k = ppm(P); const mpx = k * v.s; // px schermo per metro
  // stanze
  const ed = editingRoom();
  for (const r of roomsOfPlan(P.id)) {
    const sel = (S.sel && S.sel.t === 'room' && S.sel.id === r.id) || (S.sel && S.sel.t === 'rooms' && S.sel.ids.includes(r.id)); const st = roomState(r); const [fillC, strokeC, textC] = ROOM_COL[st];
    x.beginPath(); r.poly.forEach((p, i) => { const [sx, sy] = toS(p[0], p[1]); i ? x.lineTo(sx, sy) : x.moveTo(sx, sy); }); x.closePath();
    x.fillStyle = sel && st === 'ok' ? 'rgba(29,78,216,.10)' : fillC; x.fill();
    x.lineWidth = sel ? 3 : 2; x.strokeStyle = sel ? '#1d4ed8' : strokeC; x.stroke();
    const [cx, cy] = toS(...polyCentroid(r.poly));
    x.font = '600 13px sans-serif'; x.textAlign = 'center'; x.lineWidth = 3.5; x.strokeStyle = 'rgba(255,255,255,.9)';
    const lbl = (st === 'done' ? '✓ ' : st === 'warn' ? '! ' : '') + r.name; x.strokeText(lbl, cx, cy); x.fillStyle = textC; x.fillText(lbl, cx, cy);
  }
  if (S.tmp && S.tmp.box) { // riquadro di selezione: verso destra «finestra» (blu, tutto dentro), verso sinistra «interseca» (verde tratteggiato)
    const b = S.tmp.box, cross = b.x1 < b.x0; x.beginPath(); x.rect(Math.min(b.x0, b.x1), Math.min(b.y0, b.y1), Math.abs(b.x1 - b.x0), Math.abs(b.y1 - b.y0));
    x.fillStyle = cross ? 'rgba(22,163,74,.10)' : 'rgba(37,99,235,.10)'; x.fill(); x.setLineDash(cross ? [6, 4] : []); x.lineWidth = 1.5; x.strokeStyle = cross ? '#16a34a' : '#2563eb'; x.stroke(); x.setLineDash([]);
  }
  if (S.tmp && S.tmp.paste) { // stanze copiate in attesa di conferma
    const pa = S.tmp.paste;
    for (const r of pastePolys(pa)) {
      x.beginPath(); r.poly.forEach((p, i) => { const [sx, sy] = toS(p[0], p[1]); i ? x.lineTo(sx, sy) : x.moveTo(sx, sy); }); x.closePath();
      x.fillStyle = 'rgba(234,88,12,.12)'; x.fill(); x.setLineDash([7, 4]); x.lineWidth = 2.5; x.strokeStyle = '#ea580c'; x.stroke(); x.setLineDash([]);
      const [cx, cy] = toS(...polyCentroid(r.poly)); x.font = '600 13px sans-serif'; x.textAlign = 'center'; x.lineWidth = 3.5; x.strokeStyle = 'rgba(255,255,255,.9)'; x.strokeText(r.name, cx, cy); x.fillStyle = '#c2410c'; x.fillText(r.name, cx, cy);
    }
  }
  if (ed) { // maniglie per modificare il contorno
    ed.poly.forEach((p, i) => {
      const q = ed.poly[(i + 1) % ed.poly.length]; const [mx, my] = toS((p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
      x.beginPath(); x.arc(mx, my, 6, 0, 7); x.fillStyle = 'rgba(255,255,255,.9)'; x.fill(); x.strokeStyle = '#1d4ed8'; x.lineWidth = 1.5; x.stroke();
      x.beginPath(); x.moveTo(mx - 3, my); x.lineTo(mx + 3, my); x.moveTo(mx, my - 3); x.lineTo(mx, my + 3); x.stroke();
    });
    ed.poly.forEach(p => { const [sx, sy] = toS(p[0], p[1]); x.beginPath(); x.arc(sx, sy, 9, 0, 7); x.fillStyle = '#1d4ed8'; x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 2.5; x.stroke(); });
  }
  // foto
  const showCones = ST().cones || S.tool === 'photo';
  for (const ph of S.photos) {
    if (ph.planId !== P.id || ph.x == null) continue;
    const sel = S.sel && S.sel.t === 'photo' && S.sel.id === ph.id;
    if (!showCones && !sel) continue;
    const [sx, sy] = toS(ph.x, ph.y); const col = photoColor(ph);
    if (ph.kind === 'parete') {
      const { tH } = camTan(ph); const half = Math.atan(tH); const Rs = sel ? 120 : 62; const room = roomById(ph.roomId);
      x.beginPath(); x.moveTo(sx, sy);
      if (ph.len) x.arc(sx, sy, Math.max(4, ph.len * v.s), ph.a + vr() - half, ph.a + vr() + half);
      else if (room && room.poly) { for (let j = 0; j <= 24; j++) { const an = ph.a - half + 2 * half * j / 24; const t = raycast(room.poly, ph.x, ph.y, an) || Rs / v.s; const [qx, qy] = toS(ph.x + Math.cos(an) * t, ph.y + Math.sin(an) * t); x.lineTo(qx, qy); } }
      else x.arc(sx, sy, Rs, ph.a + vr() - half, ph.a + vr() + half);
      x.closePath();
      x.fillStyle = col + (sel ? '33' : '1f'); x.fill(); x.strokeStyle = col + (sel ? 'dd' : '88'); x.lineWidth = sel ? 2 : 1.2; x.stroke();
      if (sel) { const [hx, hy] = photoHandle(ph); rotHandle(x, hx, hy, col, '↔'); }
    } else if (ph.kind === 'soffitto') {
      const room = roomById(ph.roomId); const d = Math.max(0.3, ((room && room.h) || ST().roomH) - ST().camH) * k; const { tH, tV } = camTan(ph);
      const fx = Math.cos(ph.a), fy = Math.sin(ph.a); const rx = -fy, ry = fx;
      const cs = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => toS(ph.x + rx * a * tH * d + fx * b * tV * d, ph.y + ry * a * tH * d + fy * b * tV * d));
      x.beginPath(); cs.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath();
      x.fillStyle = col + (sel ? '26' : '14'); x.fill(); x.setLineDash([5, 4]); x.strokeStyle = col + (sel ? 'dd' : '88'); x.lineWidth = sel ? 2 : 1.2; x.stroke(); x.setLineDash([]);
      const Rs = sel ? 60 : 34; const gx = Math.cos(ph.a + vr()), gy = Math.sin(ph.a + vr()), qx = -gy, qy = gx; // freccia sullo schermo
      x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + gx * Rs, sy + gy * Rs); x.strokeStyle = col; x.lineWidth = 2.5; x.stroke();
      x.beginPath(); x.moveTo(sx + gx * Rs, sy + gy * Rs); x.lineTo(sx + gx * (Rs - 9) + qx * 6, sy + gy * (Rs - 9) + qy * 6); x.lineTo(sx + gx * (Rs - 9) - qx * 6, sy + gy * (Rs - 9) - qy * 6); x.closePath(); x.fillStyle = col; x.fill();
      if (sel) rotHandle(x, sx + gx * 138, sy + gy * 138, col);
    }
    x.beginPath(); x.arc(sx, sy, sel ? 11 : 8, 0, 7); x.fillStyle = '#fff'; x.fill(); x.lineWidth = sel ? 3 : 2; x.strokeStyle = col; x.stroke();
    x.beginPath(); x.arc(sx, sy, 3.2, 0, 7); x.fillStyle = col; x.fill();
    if (ph.aiSt === 'run') { x.beginPath(); x.arc(sx, sy, 15, (Date.now() / 300) % 6.28, (Date.now() / 300) % 6.28 + 2); x.strokeStyle = '#d97706'; x.lineWidth = 3; x.stroke(); }
  }
  // disegni a mano libera
  for (const d of S.draws) { if (d.planId !== P.id) continue; const sel = S.sel && S.sel.t === 'draw' && S.sel.id === d.id; for (const st of d.strokes) drawStroke(x, st, sel); }
  if (S.tmp && S.tmp.stroke) drawStroke(x, S.tmp.stroke, false);
  // elementi
  const R = ST().symPx / 2;
  if (S.showClosure && closedAt()) drawClosureGhosts(x, P, R);
  const its = S.items.filter(i => i.planId === P.id && itemVisible(i));
  for (const it of its) {
    if (!it.pts) continue; const sym = symOf(it.s); const sel = S.sel && S.sel.t === 'item' && S.sel.id === it.id;
    x.beginPath(); it.pts.forEach((p, i) => { const [a, b] = toS(p[0], p[1]); i ? x.lineTo(a, b) : x.moveTo(a, b); });
    if (sel) { x.strokeStyle = 'rgba(29,78,216,.35)'; x.lineWidth = 12; x.stroke(); }
    x.strokeStyle = symColor(sym); x.lineWidth = 4; x.setLineDash(it.ok ? [] : [8, 5]); x.lineCap = 'round'; x.lineJoin = 'round'; x.stroke(); x.setLineDash([]);
    it.pts.forEach(p => { const [a, b] = toS(p[0], p[1]); x.beginPath(); x.arc(a, b, 3.5, 0, 7); x.fillStyle = symColor(sym); x.fill(); });
    if (it.fate) { const [a, b] = toS(it.x, it.y); drawFate(x, a, b, 9, it.fate, 2); }
    if (ST().labels && mpx > 28) { const [a, b] = toS(it.x, it.y); const lb = symShort(sym) + (famExtra(it) ? ' ' + famExtra(it) : ''); x.font = '600 11px sans-serif'; x.textAlign = 'center'; x.lineWidth = 3; x.strokeStyle = '#fff'; x.strokeText(lb, a, b - 8); x.fillStyle = symColor(sym); x.fillText(lb, a, b - 8); }
  }
  const pts = its.filter(i => !i.pts).map(it => { const [sx, sy] = toS(it.x, it.y); return { id: it.id, x: sx, y: sy, it }; }).filter(p => p.x > -80 && p.y > -80 && p.x < W + 80 && p.y < H + 80);
  const disp = declutter(pts, R);
  for (const p of pts) { // linee di richiamo verso la posizione vera
    const [dx, dy] = disp.get(p.id); if (Math.hypot(dx - p.x, dy - p.y) < 1) continue;
    x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(dx, dy); x.strokeStyle = 'rgba(30,41,59,.55)'; x.lineWidth = 1; x.stroke();
    x.beginPath(); x.arc(p.x, p.y, 2.5, 0, 7); x.fillStyle = '#1e293b'; x.fill();
  }
  for (const p of pts) {
    const it = p.it; const sym = symOf(it.s); const [sx, sy] = disp.get(p.id); S.disp.set(it.id, [sx, sy]);
    const sel = S.sel && S.sel.t === 'item' && S.sel.id === it.id;
    if (sel) { x.beginPath(); x.arc(sx, sy, R + 9, 0, 7); x.fillStyle = 'rgba(29,78,216,.22)'; x.fill(); }
    if (it.hint) { drawHint(x, sx, sy, R); continue; }
    if (!it.ok) { x.beginPath(); x.arc(sx, sy, R + 4, 0, 7); x.fillStyle = 'rgba(124,58,237,.16)'; x.fill(); }
    if (isPlate(it)) drawPlate(x, it, sx, sy, R, !it.ok, itemRot(it) - vr()); else drawSym(x, sym, sx, sy, R, !it.ok, itemRot(it) - vr());
    if (it.fate) drawFate(x, sx, sy, isPlate(it) ? R * 1.15 : R, it.fate);
    if (closedAt() && ST().tech !== false) { const t = techState(it); if (t) drawTechBadge(x, sx, sy, R, t); }
    if (it.tag && !isQuadroCode(it.s)) { x.font = '700 12px sans-serif'; x.textAlign = 'left'; x.lineWidth = 3; x.strokeStyle = '#fff'; x.strokeText(it.tag, sx + R + 3, sy + R + 2); x.fillStyle = symColor(sym); x.fillText(it.tag, sx + R + 3, sy + R + 2); }
    if (it.n > 1) { x.font = 'bold 11px sans-serif'; x.textAlign = 'left'; x.fillStyle = '#111'; x.lineWidth = 3; x.strokeStyle = '#fff'; x.strokeText('×' + it.n, sx + R * .7, sy + R + 2); x.fillText('×' + it.n, sx + R * .7, sy + R + 2); }
    const isQ = isQuadroCode(it.s);
    if ((ST().labels && mpx > 28) || isQ) { const lb = isQ ? quadroLabel(it) : isPlate(it) ? 'placca ' + it.pl.length + 'P' : symShort(sym); const lx = isPlate(it) ? plateRight(it, sx, R) + 3 : sx + R + 3; x.font = (isQ ? '700 12px' : '600 11px') + ' sans-serif'; x.textAlign = 'left'; x.lineWidth = 3; x.strokeStyle = '#fff'; x.strokeText(lb, lx, sy - R + 6); x.fillStyle = symColor(sym); x.fillText(lb, lx, sy - R + 6); }
  }
  for (const n of S.vnotes) { if (n.planId !== P.id) continue; const [sx, sy] = toS(n.x, n.y); drawVnMark(x, sx, sy, 11, n, S.sel && S.sel.t === 'vnote' && S.sel.id === n.id); }
  // disegni temporanei degli strumenti
  const T = S.tmp || {}; const hv = S.hover;
  if (T.vn) { const [sx, sy] = toS(T.vn.x, T.vn.y); drawVnMark(x, sx, sy, 11, null, true); }
  const dot = (p, col, r = 6) => { const [a, b] = toS(p[0], p[1]); x.beginPath(); x.arc(a, b, r, 0, 7); x.fillStyle = col; x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 2; x.stroke(); };
  const pl = (pts, col, close, dash = [6, 4]) => { x.beginPath(); pts.forEach((p, i) => { const [a, b] = toS(p[0], p[1]); i ? x.lineTo(a, b) : x.moveTo(a, b); }); if (close) x.closePath(); x.strokeStyle = col; x.lineWidth = 2.5; x.setLineDash(dash); x.stroke(); x.setLineDash([]); };
  if (T.poly && T.poly.length) {
    const live = hv && S.tool === 'room' ? T.poly.concat([[hv.x, hv.y]]) : T.poly;
    if (live.length >= 3) { x.beginPath(); live.forEach((p, i) => { const [a, b] = toS(p[0], p[1]); i ? x.lineTo(a, b) : x.moveTo(a, b); }); x.closePath(); x.fillStyle = 'rgba(29,78,216,.08)'; x.fill(); }
    pl(live, '#1d4ed8', false, []); T.poly.forEach((p, i) => dot(p, i ? '#1d4ed8' : '#16a34a', i ? 6 : 9));
  }
  if (T.line && T.line.length) { const live = hv && S.tool === 'sym' ? T.line.concat([[hv.x, hv.y]]) : T.line; pl(live, symOf(S.symSel).color, false); T.line.forEach(p => dot(p, symOf(S.symSel).color)); }
  if (T.cal && T.cal.length) { const live = hv && S.tool === 'cal' ? T.cal.concat([[hv.x, hv.y]]) : T.cal; pl(live, '#dc2626', false); T.cal.forEach(p => dot(p, '#dc2626')); }
  if (T.meas && T.meas.length) drawMeasure(x, T, hv, k);
  if (T.cam) { const [sx, sy] = toS(T.cam.x, T.cam.y); if (T.cam.pt) { x.beginPath(); x.arc(sx, sy, 22, 0, 7); x.fillStyle = 'rgba(29,78,216,.15)'; x.fill(); x.setLineDash([4, 3]); x.strokeStyle = '#1d4ed8'; x.lineWidth = 2; x.stroke(); x.setLineDash([]); } else { const half = Math.atan(Math.tan(ST().fov * Math.PI / 360) * 0.75); x.beginPath(); x.moveTo(sx, sy); x.arc(sx, sy, Math.max(10, T.cam.len * v.s), T.cam.a + vr() - half, T.cam.a + vr() + half); x.closePath(); x.fillStyle = 'rgba(29,78,216,.18)'; x.fill(); x.strokeStyle = '#1d4ed8'; x.lineWidth = 2; x.stroke(); } dot([T.cam.x, T.cam.y], '#1d4ed8'); }
  if (hv && hv.guides) hv.guides.forEach(([a, b]) => { const [ax, ay] = toS(a[0], a[1]), [bx, by] = toS(b[0], b[1]); x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.strokeStyle = 'rgba(220,38,38,.7)'; x.lineWidth = 1.2; x.setLineDash([4, 4]); x.stroke(); x.setLineDash([]); });
  if (hv && hv.pen) { const [a, b] = toS(hv.x, hv.y); x.beginPath(); [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([u, w]) => { x.moveTo(a + u * 5, b + w * 5); x.lineTo(a + u * 16, b + w * 16); }); x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 4; x.stroke(); x.strokeStyle = hv.mag ? '#dc2626' : '#0f172a'; x.lineWidth = 1.6; x.stroke(); } // mirino della penna sospesa (con bordo bianco per vederlo sopra la pianta)
  if (hv) { dot([hv.x, hv.y], hv.mag ? '#dc2626' : '#0f172a', hv.pen ? (hv.mag ? 5 : 3) : hv.mag ? 7 : 5); }
  // barra di scala
  if (P.ppm) {
    let m = 1; const opts = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100]; for (const o of opts) { if (o * mpx > 70) { m = o; break; } m = o; }
    const L = m * mpx; const lab = m < 1 ? Math.round(m * 100) + ' cm' : String(m).replace('.', ',') + ' m';
    const pal = $('#palette'); const pb = pal && !pal.classList.contains('hide') ? pal.offsetHeight : 0;
    x.fillStyle = 'rgba(255,255,255,.85)'; x.fillRect(8, H - 34 - pb, L + 58, 26); x.fillStyle = '#111'; x.fillRect(14, H - 18 - pb, L, 4); x.font = '12px sans-serif'; x.textAlign = 'left'; x.fillText(lab, L + 20, H - 13 - pb);
  }
  if (S.loupe && hv) drawLoupe(x, W, H, P, im, hv);
  if (S.photos.some(p => p.aiSt === 'run')) setTimeout(redraw, 60);
}
function drawFate(x, cx, cy, R, fate, lw = 2.5) { // anello colorato attorno al simbolo; da rimuovere = anche la croce
  const col = FATE_COL[fate]; if (!col) return;
  x.beginPath(); x.arc(cx, cy, R + 3, 0, 7); x.strokeStyle = col; x.lineWidth = lw; x.setLineDash(fate === 'sostituire' ? [5, 3] : []); x.stroke(); x.setLineDash([]);
  if (fate === 'rimuovere') { const d = R * 0.9; x.beginPath(); x.moveTo(cx - d, cy - d); x.lineTo(cx + d, cy + d); x.moveTo(cx + d, cy - d); x.lineTo(cx - d, cy + d); x.strokeStyle = col; x.lineWidth = lw; x.stroke(); }
  if (fate === 'nuovo') { x.beginPath(); x.arc(cx + R + 1, cy - R - 1, 6, 0, 7); x.fillStyle = col; x.fill(); x.fillStyle = '#fff'; x.font = '700 10px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('+', cx + R + 1, cy - R - 0.5); x.textBaseline = 'alphabetic'; }
}
function drawHint(x, cx, cy, R) { // indizio: triangolo ambra con "!"
  x.save(); x.beginPath(); x.moveTo(cx, cy - R); x.lineTo(cx + R * .98, cy + R * .72); x.lineTo(cx - R * .98, cy + R * .72); x.closePath();
  x.fillStyle = '#fbbf24'; x.fill(); x.lineWidth = 1.5; x.strokeStyle = '#92400e'; x.stroke();
  x.fillStyle = '#78350f'; x.font = `bold ${Math.round(R * 1.15)}px sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('!', cx, cy + R * .18); x.restore();
}
function photoHandle(ph) { // maniglia della foto: per le pareti è la punta del cono (direzione e lunghezza)
  const [cx, cy] = toS(ph.x, ph.y); const L = ph.kind === 'parete' && ph.len ? Math.max(70, ph.len * S.view.s) : 138;
  return [cx + Math.cos(ph.a + vr()) * L, cy + Math.sin(ph.a + vr()) * L];
}
function rotHandle(x, hx, hy, col, glyph = '⟳') {
  x.beginPath(); x.arc(hx, hy, 14, 0, 7); x.fillStyle = '#fff'; x.fill(); x.strokeStyle = col; x.lineWidth = 2.5; x.stroke();
  x.fillStyle = col; x.font = 'bold 15px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(glyph, hx, hy + 1); x.textBaseline = 'alphabetic';
}
function simplifyPts(P, tol) { // Douglas-Peucker
  if (P.length < 3) return P.slice(); const keep = new Uint8Array(P.length); keep[0] = keep[P.length - 1] = 1; const st = [[0, P.length - 1]];
  while (st.length) { const [a, b] = st.pop(); let best = -1, bi = -1; for (let i = a + 1; i < b; i++) { const d = segDist(P[i], P[a], P[b]); if (d > best) { best = d; bi = i; } } if (best > tol) { keep[bi] = 1; st.push([a, bi], [bi, b]); } }
  return P.filter((_, i) => keep[i]);
}
function simplifyStroke(P, tol, ptol = 0.08) { // come simplifyPts, ma con la pressione tiene anche i punti dove lo spessore cambia
  if (P.length < 3 || P[0].length < 3) return simplifyPts(P, tol);
  const keep = new Uint8Array(P.length); keep[0] = keep[P.length - 1] = 1; const st = [[0, P.length - 1]];
  while (st.length) {
    const [a, b] = st.pop(); const A = P[a], B = P[b]; const dx = B[0] - A[0], dy = B[1] - A[1], l2 = dx * dx + dy * dy; let best = -1, bi = -1;
    for (let i = a + 1; i < b; i++) {
      const t = l2 ? clamp(((P[i][0] - A[0]) * dx + (P[i][1] - A[1]) * dy) / l2, 0, 1) : (i - a) / (b - a);
      const d = Math.max(segDist(P[i], A, B) / tol, Math.abs(P[i][2] - (A[2] + t * (B[2] - A[2]))) / ptol);
      if (d > best) { best = d; bi = i; }
    }
    if (best > 1) { keep[bi] = 1; st.push([a, bi], [bi, b]); }
  }
  return P.filter((_, i) => keep[i]);
}
const prW = p => p == null ? 1 : 0.35 + 1.3 * p; // spessore relativo secondo la pressione (0,5 = normale)
function strokePath(x, pts, tr, w, col) { // tratto: unico se a spessore costante, a pezzi se c'è la pressione
  x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = col;
  if (!pts.some(p => p.length > 2)) { x.beginPath(); pts.forEach((p, i) => { const [a, b] = tr(p); i ? x.lineTo(a, b) : x.moveTo(a, b); }); x.lineWidth = w; x.stroke(); return; }
  if (pts.length === 1) { const [a, b] = tr(pts[0]); x.beginPath(); x.arc(a, b, w * prW(pts[0][2]) / 2, 0, 7); x.fillStyle = col; x.fill(); return; }
  for (let i = 1; i < pts.length; i++) { const [a, b] = tr(pts[i - 1]), [c, d] = tr(pts[i]); x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.lineWidth = Math.max(0.6, w * prW(((pts[i - 1][2] ?? 0.5) + (pts[i][2] ?? 0.5)) / 2)); x.stroke(); }
}
function drawStroke(x, st, sel) {
  const w = Math.max(0.8, st.w * S.view.s); const tr = p => toS(p[0], p[1]);
  if (sel) strokePath(x, st.pts.map(p => [p[0], p[1]]), tr, w + 10, 'rgba(29,78,216,.3)');
  strokePath(x, st.pts, tr, w, st.col);
}
/* ---- strumento misura: distanze per tratto, area se il poligono si chiude ---- */
const MEAS_COL = '#0e7490';
function measSnap(bx, by) { // misura a mano libera (richiesta dell'utente): il punto va dove tocchi; solo il primo punto chiude il poligono
  const tol = 14 / S.view.s; const pts = S.tmp.meas || [];
  if (pts.length >= 3 && dist(pts[0], [bx, by]) < tol * 1.4) return { x: pts[0][0], y: pts[0][1], mag: 'close' };
  return { x: bx, y: by };
}
function measTap(bx, by) {
  const T = S.tmp; T.meas = T.meas || []; if (T.closed) { T.meas = []; T.closed = false; }
  if (T.meas.length >= 3 && dist(T.meas[0], [bx, by]) < 1e-6) { T.closed = true; renderPanel(); redraw(); return; }
  T.meas.push([bx, by]); renderPanel(); redraw();
}
const fmtM = m => (m >= 100 ? m.toFixed(1) : m.toFixed(2)).replace('.', ',') + ' m';
const fmtM2 = a => (a >= 100 ? a.toFixed(1) : a.toFixed(2)).replace('.', ',') + ' m²';
function measInfo(T, k) { // tratti, totale, area
  const pts = T.meas || []; const segs = []; for (let i = 1; i < pts.length; i++) segs.push(dist(pts[i - 1], pts[i]) / k);
  if (T.closed && pts.length >= 3) segs.push(dist(pts[pts.length - 1], pts[0]) / k);
  return { segs, tot: segs.reduce((a, b) => a + b, 0), area: T.closed && pts.length >= 3 ? Math.abs(polyArea(pts)) / (k * k) : null };
}
function drawMeasure(x, T, hv, k) {
  const pts = T.meas; const live = !T.closed && hv && S.tool === 'meas' ? pts.concat([[hv.x, hv.y]]) : pts;
  const lbl = (a, b, txt, dy = 0) => { const [ax, ay] = toS(a[0], a[1]), [bx, by] = toS(b[0], b[1]); const mx = (ax + bx) / 2, my = (ay + by) / 2; let an = Math.atan2(by - ay, bx - ax); if (an > Math.PI / 2 || an < -Math.PI / 2) an += Math.PI; x.save(); x.translate(mx, my); x.rotate(an); x.font = '700 12px sans-serif'; x.textAlign = 'center'; x.lineWidth = 4; x.strokeStyle = 'rgba(255,255,255,.92)'; x.strokeText(txt, 0, -6 + dy); x.fillStyle = MEAS_COL; x.fillText(txt, 0, -6 + dy); x.restore(); };
  if (T.closed && pts.length >= 3) { x.beginPath(); pts.forEach((p, i) => { const [a, b] = toS(p[0], p[1]); i ? x.lineTo(a, b) : x.moveTo(a, b); }); x.closePath(); x.fillStyle = 'rgba(14,116,144,.12)'; x.fill(); }
  x.beginPath(); live.forEach((p, i) => { const [a, b] = toS(p[0], p[1]); i ? x.lineTo(a, b) : x.moveTo(a, b); }); if (T.closed) x.closePath(); x.strokeStyle = MEAS_COL; x.lineWidth = 2.5; x.setLineDash(T.closed ? [] : [7, 4]); x.stroke(); x.setLineDash([]);
  for (let i = 1; i < live.length; i++) lbl(live[i - 1], live[i], fmtM(dist(live[i - 1], live[i]) / k));
  if (T.closed) lbl(live[live.length - 1], live[0], fmtM(dist(live[live.length - 1], live[0]) / k));
  pts.forEach((p, i) => { const [a, b] = toS(p[0], p[1]); x.beginPath(); x.arc(a, b, i ? 5 : 7, 0, 7); x.fillStyle = i ? MEAS_COL : '#16a34a'; x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 2; x.stroke(); });
  const inf = measInfo(T, k);
  if (inf.area != null) { const [cx, cy] = toS(...polyCentroid(pts)); x.font = '700 14px sans-serif'; x.textAlign = 'center'; x.lineWidth = 4; x.strokeStyle = 'rgba(255,255,255,.92)'; const t1 = fmtM2(inf.area), t2 = 'perimetro ' + fmtM(inf.tot); x.strokeText(t1, cx, cy - 2); x.fillStyle = MEAS_COL; x.fillText(t1, cx, cy - 2); x.font = '600 11px sans-serif'; x.strokeText(t2, cx, cy + 14); x.fillText(t2, cx, cy + 14); }
  else if (live.length > 2) { const last = live[live.length - 1]; const [a, b] = toS(last[0], last[1]); const t = 'totale ' + fmtM(inf.tot + (live.length > pts.length ? dist(pts[pts.length - 1], last) / k : 0)); x.font = '700 12px sans-serif'; x.textAlign = 'left'; x.lineWidth = 4; x.strokeStyle = 'rgba(255,255,255,.92)'; x.strokeText(t, a + 10, b + 18); x.fillStyle = MEAS_COL; x.fillText(t, a + 10, b + 18); }
}
function penHover(sx, sy) { // penna sospesa sopra lo schermo: mirino dove cadrà il punto
  const P = curPlan(); if (!P || !['room', 'sym', 'cal', 'vnote', 'meas'].includes(S.tool)) return;
  if (PEN.hoverRq) return; PEN.hoverRq = requestAnimationFrame(() => {
    PEN.hoverRq = 0; if (ptrs.size) return; const [bx, by] = toB(sx, sy); const f = toolSnap(); S.hover = f ? f(bx, by) : { x: bx, y: by }; S.hover.pen = true; S.loupe = null; redraw();
  });
}
function penHoverEnd() { if (PEN.hoverRq) { cancelAnimationFrame(PEN.hoverRq); PEN.hoverRq = 0; } if (S.hover && S.hover.pen) { S.hover = null; redraw(); } }
function fingerGesture(x0, y0) { // penna in uso: il dito sposta la pianta; nella selezione un tocco seleziona ma non trascina oggetti
  if (S.tool === 'box' && !S.tmp.paste) return panGesture(x0, y0, () => boxTap(x0, y0));
  if (S.tool !== 'sel') return panGesture(x0, y0);
  const h = hitTest(x0, y0);
  return panGesture(x0, y0, () => { if (h && ['item', 'photo', 'vnote', 'draw', 'room'].includes(h.t)) select(h.t, h.o.id); else if (!h) select(null); });
}
function toolSnap() { // come si aggancia il punto per lo strumento attivo (uguale col dito, con la penna e col mirino sospeso)
  const P = curPlan();
  if (S.tool === 'room') { const poly = S.tmp.poly || []; return (bx, by) => snapRoomPoint(bx, by, { prev: poly[poly.length - 1], first: poly.length >= 3 ? poly[0] : null }); }
  if (S.tool === 'sym') return null; // simboli: sempre nel punto esatto del dito o della penna, mai agganciati
  if (S.tool === 'meas') return measSnap;
  return null;
}
function finishStroke(st) {
  const P = curPlan(); if (!P) return; pushUndo();
  let pts = st.pts.length === 1 ? [st.pts[0], [st.pts[0][0] + 0.05, ...st.pts[0].slice(1)]] : simplifyStroke(st.pts, 0.6 / S.view.s);
  pts = pts.map(p => p.length > 2 ? [r1(p[0]), r1(p[1]), p[2]] : [r1(p[0]), r1(p[1])]);
  let d = S.penDraw && drawById(S.penDraw);
  if (!d || d.planId !== P.id) { d = { id: uid('d'), planId: P.id, strokes: [] }; S.draws.push(d); S.penDraw = d.id; } // cambiata tavola: nuovo disegno in quella corrente
  d.strokes.push({ pts, col: st.col, w: +st.w.toFixed(3) }); Sync.mark('plan:' + P.id); renderPalette(); redraw();
}
function drawLoupe(x, W, H, P, im, hv) { // lente d'ingrandimento sopra il dito, con mirino sul punto
  const LR = 74, Z = 4; let lx = S.loupe.sx, ly = S.loupe.sy - 120; if (ly - LR < 4) ly = S.loupe.sy + 120; lx = clamp(lx, LR + 4, W - LR - 4);
  const s = S.view.s * Z;
  x.save(); x.beginPath(); x.arc(lx, ly, LR, 0, 7); x.clip(); x.fillStyle = '#fff'; x.fillRect(lx - LR, ly - LR, 2 * LR, 2 * LR);
  x.translate(lx, ly); if (vr()) x.rotate(vr()); x.scale(s, s); x.translate(-hv.x, -hv.y);
  if (im) { x.imageSmoothingEnabled = s < 1.5; x.drawImage(im.canvas, 0, 0); }
  x.lineWidth = 2 / s;
  for (const r of roomsOfPlan(P.id)) { x.beginPath(); r.poly.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); x.strokeStyle = 'rgba(37,99,235,.8)'; x.stroke(); }
  const T = S.tmp || {}; const tp = T.poly || T.line || T.cal;
  if (tp && tp.length) { x.beginPath(); tp.concat([[hv.x, hv.y]]).forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.strokeStyle = '#1d4ed8'; x.stroke(); }
  x.restore();
  x.beginPath(); x.arc(lx, ly, LR, 0, 7); x.strokeStyle = '#0f172a'; x.lineWidth = 2.5; x.stroke();
  x.strokeStyle = hv.mag ? '#dc2626' : '#0f172a'; x.lineWidth = 1.2;
  x.beginPath(); x.moveTo(lx - LR, ly); x.lineTo(lx - 6, ly); x.moveTo(lx + 6, ly); x.lineTo(lx + LR, ly); x.moveTo(lx, ly - LR); x.lineTo(lx, ly - 6); x.moveTo(lx, ly + 6); x.lineTo(lx, ly + LR); x.stroke();
  x.beginPath(); x.arc(lx, ly, 3, 0, 7); x.fillStyle = hv.mag ? '#dc2626' : '#0f172a'; x.fill();
}

/* ============ VISTA ============ */
function fitView() {
  const P = curPlan(); const c = $('#cv'); if (!P || !c) return;
  const W = c.clientWidth, H = c.clientHeight; const im = S.planImg[P.id]; const b = (im && im.cb) || [0, 0, P.w, P.h];
  const bw = b[2] - b[0], bh = b[3] - b[1]; const r = S.view.r || 0; const ca = Math.abs(Math.cos(r)), sa = Math.abs(Math.sin(r));
  const ew = bw * ca + bh * sa, eh = bw * sa + bh * ca; const s = Math.min((W - 40) / ew, (H - 40) / eh); // ingombro della pianta ruotata
  S.view = { s, tx: 0, ty: 0, r }; centerOn((b[0] + b[2]) / 2, (b[1] + b[3]) / 2);
}
function zoomAt(sx, sy, f) {
  const v = S.view; const ns = clamp(v.s * f, ZMIN, ZMAX); const k = ns / v.s;
  v.tx = sx - (sx - v.tx) * k; v.ty = sy - (sy - v.ty) * k; v.s = ns; redraw();
}
function centerOn(bx, by) { const c = $('#cv'); const v = S.view, r = v.r || 0; const cs = Math.cos(r), sn = Math.sin(r); v.tx = c.clientWidth / 2 - (bx * cs - by * sn) * v.s; v.ty = c.clientHeight / 2 - (bx * sn + by * cs) * v.s; redraw(); }

/* ============ STRUMENTI ============ */
const ICONS = {
  box: '<rect x="3.5" y="5.5" width="17" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2.2"/><path d="M9 9.5h6M9 12h6M9 14.5h4" stroke="currentColor" stroke-width="1.6"/>',
  sel: '<path d="M5 3l14 8-6 2-2 6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  room: '<path d="M4 5h16v14H4z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="4" cy="5" r="2.2" fill="currentColor"/><circle cx="20" cy="5" r="2.2" fill="currentColor"/><circle cx="20" cy="19" r="2.2" fill="currentColor"/><circle cx="4" cy="19" r="2.2" fill="currentColor"/>',
  photo: '<path d="M4 8h3l2-3h6l2 3h3v11H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/>',
  sym: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" stroke-width="2"/>',
  cal: '<path d="M3 16L16 3l5 5L8 21z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 12l2 2M10 9l2 2M13 6l2 2" stroke="currentColor" stroke-width="2"/>',
  meas: '<path d="M4 19L19 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="4" cy="19" r="2.2" fill="currentColor"/><circle cx="19" cy="4" r="2.2" fill="currentColor"/><path d="M9 14l1.5 1.5M12 11l1.5 1.5M15 8l1.5 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  pen: '<path d="M4 20l1-4L16 5l3 3L8 19z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 7l3 3" stroke="currentColor" stroke-width="2"/>',
  vnote: '<rect x="9" y="3" width="6" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
};
const TOOLS = [['sel', 'Seleziona'], ['box', 'Riquadro'], ['room', 'Stanza'], ['photo', 'Foto'], ['sym', 'Simbolo'], ['pen', 'Penna'], ['vnote', 'Nota audio'], ['meas', 'Misura'], ['cal', 'Scala']];
const HINTS = {
  sel: 'Tocca un simbolo, una foto o una stanza • trascina per spostare (la stanza: prima selezionala) • due dita per spostare la pianta e zoomare',
  room: 'Tocca gli angoli della stanza uno alla volta (tieni il dito per la lente) • tocca il primo punto per chiudere',
  photo: 'Tocca dove ti trovi: trascina verso dove guardi per una parete (più trascini, più il cono è lungo) • tocca senza trascinare per una foto puntuale (soffitto o pavimento)',
  pen: 'Disegna col dito • colore e spessore in basso • "Fine" per tornare alla freccia',
  sym: 'Scegli il simbolo in basso e tocca la pianta (tieni il dito per la lente)',
  symLine: 'Tocca i punti del percorso • "Fine" per chiudere la linea',
  cal: 'Tocca due punti di cui conosci la distanza (es. le estremità di una quota)',
  meas: 'Misura: tocca due o più punti, la distanza compare su ogni tratto • chiudi sul primo punto per l\'area',
  vnote: 'Tocca il punto della nota (tieni il dito per la lente), poi registra',
  box: 'Trascina un riquadro: verso destra prende le stanze tutte dentro, verso sinistra anche quelle toccate • tocca una stanza per aggiungerla o toglierla • trascina dentro una stanza scelta per spostarle tutte',
  paste: 'Trascina le stanze copiate dove vanno • due dita per spostare la pianta e zoomare • poi «Conferma»',
};
const PEN_HINTS = { // quando si usa la penna
  box: 'Penna: trascina un riquadro (verso destra: stanze tutte dentro; verso sinistra: anche quelle toccate) • il dito sposta la pianta',
  paste: 'Penna: trascina le stanze copiate dove vanno • il dito sposta la pianta • poi «Conferma»',
  sel: 'Penna: tocca e trascina simboli, foto e stanze • dito: sposta la pianta (un tocco seleziona) • due dita per lo zoom',
  pen: 'Disegna con la penna: più premi, più il tratto è spesso • il dito sposta la pianta • "Fine" per tornare alla freccia',
};
function renderTools() {
  $('#tools').innerHTML = TOOLS.map(([t, n]) => `<button class="tbtn${S.tool === t ? ' on' : ''}" data-t="${t}"><svg viewBox="0 0 24 24">${ICONS[t]}</svg>${n}</button>`).join('');
  $('#tools').querySelectorAll('[data-t]').forEach(b => b.onclick = () => setTool(b.dataset.t));
}
function setTool(t) {
  if (t !== 'room') S.redrawRoom = null;
  if (t !== 'box' && S.sel && S.sel.t === 'rooms') S.sel = null; // la scelta multipla vive solo nel Riquadro
  S.tool = t; S.tmp = {}; S.hover = null; S.loupe = null;
  if (t === 'room') S.tmp.poly = [];
  if (t === 'sym' && !S.symSel) S.symSel = S.lib.symbols[0].code;
  if (t === 'pen') S.penDraw = null;
  renderTools(); renderPalette(); updateHint(); renderPanel(); redraw();
}
function updateHint() {
  let k = S.tool; if (k === 'sym' && symOf(S.symSel).mount === 'lineare') k = 'symLine'; if (k === 'box' && S.tmp.paste) k = 'paste';
  const h = $('#hint'); h.textContent = penMode() ? PEN_HINTS[k] || (HINTS[k] || '').replace(' (tieni il dito per la lente)', ' con la penna') : HINTS[k] || '';
  if (S.tool === 'photo' && Compass.on) h.textContent = 'Bussola attiva: tocca dove ti trovi e il cono parte verso dove guardi (davanti a te = su sullo schermo) • trascina se vuoi dare tu la direzione';
  if (S.tool === 'sym' && ST().stamp && k === 'sym') h.textContent = 'Timbro attivo: ogni tocco mette un ' + symOf(S.symSel).name.split(/[(\/–]/)[0].trim().toLowerCase() + ' • ritocca "Timbro" per finire';
  h.classList.toggle('hide', !curPlan());
  clearTimeout(updateHint.t); updateHint.t = setTimeout(() => { if (S.tool === 'sel') h.classList.add('hide'); }, 5000);
}

/* ============ AGGANCI PER IL DISEGNO DELLE STANZE ============ */
function snapRoomPoint(bx, by, o = {}) { // stanze a mano libera (richiesta dell'utente): nessun aggancio né raddrizzamento, il punto va dove tocchi. Solo il primo punto chiude la stanza
  if (o.first && Math.hypot(bx - o.first[0], by - o.first[1]) * S.view.s < 24) return { x: o.first[0], y: o.first[1], mag: 'close', closing: true, guides: [] };
  return { x: bx, y: by, mag: null, closing: false, guides: [] };
}

/* ============ RIQUADRO: SCELTA DI PIÙ STANZE, COPIA E INCOLLA ============ */
const selRoomIds = () => (S.sel && S.sel.t === 'rooms' ? S.sel.ids : []);
function setRoomSel(ids) { S.sel = ids.length ? { t: 'rooms', id: null, ids } : null; renderPanel(); redraw(); }
function segX(a, b, c, d) { // i segmenti ab e cd si toccano
  const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  return o(a, b, c) !== o(a, b, d) && o(c, d, a) !== o(c, d, b);
}
function roomsInBox(b) { // b in coordinate dello schermo (la pianta può essere ruotata)
  const P = curPlan(); const x0 = Math.min(b.x0, b.x1), x1 = Math.max(b.x0, b.x1), y0 = Math.min(b.y0, b.y1), y1 = Math.max(b.y0, b.y1); const cross = b.x1 < b.x0;
  const inR = p => p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1; const R = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  return roomsOfPlan(P.id).filter(r => {
    const sp = r.poly.map(p => toS(p[0], p[1]));
    if (!cross) return sp.every(inR); // finestra: stanza tutta dentro
    if (sp.some(inR) || R.some(c => pointInPoly(c[0], c[1], sp))) return true; // interseca: basta toccarla
    for (let i = 0; i < sp.length; i++) for (let j = 0; j < 4; j++) if (segX(sp[i], sp[(i + 1) % sp.length], R[j], R[(j + 1) % 4])) return true;
    return false;
  }).map(r => r.id);
}
function boxTap(sx, sy) { // tocco senza trascinare: aggiunge o toglie la stanza toccata
  const P = curPlan(); const [bx, by] = toB(sx, sy); const r = roomsOfPlan(P.id).filter(q => pointInPoly(bx, by, q.poly)).sort((a, b) => polyArea(a.poly) - polyArea(b.poly))[0];
  if (!r) return; const ids = selRoomIds(); setRoomSel(ids.includes(r.id) ? ids.filter(i => i !== r.id) : ids.concat(r.id));
}
function roomMoveGesture(rs, x0, y0, onTap) { // sposta le stanze (solo il contorno: simboli e foto restano dove sono sulla pianta)
  const [bx0, by0] = toB(x0, y0); const orig = rs.map(r => r.poly.map(p => [p[0], p[1]])); let moved = false;
  return {
    move(x, y) {
      if (!moved && Math.hypot(x - x0, y - y0) < 8) return; if (!moved) pushUndo(); moved = true;
      const [bx, by] = toB(x, y); const dx = bx - bx0, dy = by - by0; rs.forEach((r, k) => { r.poly = orig[k].map(p => [r2(p[0] + dx), r2(p[1] + dy)]); }); redraw();
    },
    up(x, y, cancel) {
      if (!moved) { if (!cancel && onTap) onTap(); return; }
      const pid = rs[0].planId; roomGeometryChanged(pid); Sync.mark('plan:' + pid); renderPanel(); redraw();
    },
    cancel() { if (moved) { rs.forEach((r, k) => { r.poly = orig[k]; }); redraw(); } },
  };
}
function boxGesture(x0, y0) {
  const [sbx, sby] = toB(x0, y0); const rs = selRoomIds().map(roomById).filter(r => r && r.planId === curPlan().id);
  if (rs.some(r => pointInPoly(sbx, sby, r.poly))) return roomMoveGesture(rs, x0, y0, () => boxTap(x0, y0)); // dentro una stanza scelta: si spostano tutte quelle scelte
  let moved = false;
  return {
    move(x, y) { if (!moved && Math.hypot(x - x0, y - y0) < 8) return; moved = true; S.tmp.box = { x0, y0, x1: x, y1: y }; redraw(); },
    up(x, y, cancel) {
      const b = S.tmp.box; S.tmp.box = null;
      if (cancel) { redraw(); return; }
      if (!moved) { boxTap(x0, y0); return; }
      const add = roomsInBox(b); const ids = selRoomIds(); setRoomSel(ids.concat(add.filter(i => !ids.includes(i)))); // ogni riquadro aggiunge
    },
    cancel() { S.tmp.box = null; redraw(); },
  };
}
async function deleteSelRooms() { // elimina le stanze scelte col Riquadro (foto ed elementi restano sulla pianta)
  const rs = selRoomIds().map(roomById).filter(Boolean); if (!rs.length) return;
  const msg = rs.length === 1 ? `Eliminare il locale "${rs[0].name}"? Foto ed elementi restano sulla pianta.` : `Eliminare ${rs.length} locali (${rs.map(r => r.name).join(', ')})? Foto ed elementi restano sulla pianta.`;
  if (!await askConfirm(msg, 'Elimina', true)) return;
  pushUndo(); const ids = new Set(rs.map(r => r.id)); const pids = [...new Set(rs.map(r => r.planId))];
  S.rooms = S.rooms.filter(r => !ids.has(r.id)); pids.forEach(pid => { roomGeometryChanged(pid); Sync.mark('plan:' + pid); });
  setRoomSel([]); toast(rs.length === 1 ? 'Locale eliminato' : `${rs.length} locali eliminati`);
}
function copyRooms() {
  const P = curPlan(); const rs = selRoomIds().map(roomById).filter(Boolean); if (!rs.length) return;
  S.clip = { planId: P.id, ppm: ppm(P), dxf: P.dxf ? { ...P.dxf } : null, rooms: rs.map(r => ({ name: r.name, kind: r.kind || '', h: r.h, poly: r.poly.map(p => [p[0], p[1]]) })) };
  toast(`${rs.length} ${rs.length === 1 ? 'stanza copiata' : 'stanze copiate'}: apri l'altra tavola e premi «Incolla»`, false, 5000); renderPanel();
}
function pasteMap(c, B) { // dalla tavola di origine a quella di arrivo, a misure vere; tra due DXF nella stessa posizione del disegno
  const A = c.dxf, D = B.dxf;
  if (A && D) return p => { const X = ((p[0] / A.s + A.minX) * A.u) / D.u, Y = ((A.maxY - p[1] / A.s) * A.u) / D.u; return [(X - D.minX) * D.s, (D.maxY - Y) * D.s]; };
  const k = ppm(B) / c.ppm; return p => [p[0] * k, p[1] * k];
}
function pastePolys(pa) { return pa.rooms.map(r => ({ ...r, poly: r.poly.map(p => [p[0] + pa.dx, p[1] + pa.dy]) })); }
function startPaste() {
  const B = curPlan(); const c = S.clip; if (!B || !c) return;
  if (S.tool !== 'box') setTool('box');
  const f = pasteMap(c, B); const rooms = c.rooms.map(r => ({ ...r, poly: r.poly.map(f) }));
  const all = rooms.flatMap(r => r.poly); const bx0 = Math.min(...all.map(p => p[0])), bx1 = Math.max(...all.map(p => p[0])), by0 = Math.min(...all.map(p => p[1])), by1 = Math.max(...all.map(p => p[1]));
  const same = !!(c.dxf && B.dxf), inside = bx1 > 0 && by1 > 0 && bx0 < B.w && by0 < B.h;
  let dx = 0, dy = 0;
  if (!(same && inside) && (!inside || c.planId === B.id)) { // fuori dalla tavola (o sulla stessa tavola): al centro della vista
    const cv = $('#cv'); const [mx, my] = toB(cv.clientWidth / 2, cv.clientHeight / 2); dx = mx - (bx0 + bx1) / 2; dy = my - (by0 + by1) / 2;
  }
  S.tmp = { paste: { rooms, dx, dy, dxf: same } }; S.sel = null;
  if (!dx && !dy) centerOn((bx0 + bx1) / 2, (by0 + by1) / 2); // stessa posizione: la vista va sulle stanze
  updateHint(); renderPanel(); redraw();
}
function pasteGesture(x0, y0) { // si trascinano le stanze copiate partendo da una di loro (o dal loro ingombro); altrove si sposta la pianta
  const pa = S.tmp.paste; const [bx0, by0] = toB(x0, y0); const polys = pastePolys(pa);
  const all = polys.flatMap(r => r.poly); const pad = 20 / S.view.s;
  const hit = polys.some(r => pointInPoly(bx0, by0, r.poly)) || (bx0 >= Math.min(...all.map(p => p[0])) - pad && bx0 <= Math.max(...all.map(p => p[0])) + pad && by0 >= Math.min(...all.map(p => p[1])) - pad && by0 <= Math.max(...all.map(p => p[1])) + pad);
  if (!hit) return panGesture(x0, y0);
  const dx0 = pa.dx, dy0 = pa.dy;
  return { move(x, y) { const [bx, by] = toB(x, y); pa.dx = dx0 + bx - bx0; pa.dy = dy0 + by - by0; redraw(); }, up() { redraw(); } };
}
function confirmPaste() {
  const B = curPlan(); const pa = S.tmp.paste; if (!B || !pa) return; pushUndo();
  const made = pastePolys(pa).map(r => ({ id: uid('r'), planId: B.id, name: r.name, kind: r.kind, h: r.h, done: false, note: '', poly: r.poly.map(p => [r2(p[0]), r2(p[1])]) }));
  S.rooms.push(...made); S.tmp = {}; roomGeometryChanged(B.id); Sync.mark('plan:' + B.id);
  setRoomSel(made.map(r => r.id)); updateHint();
  toast(`${made.length} ${made.length === 1 ? 'stanza incollata' : 'stanze incollate'}`);
}

/* ============ INTERAZIONE ============ */
const ptrs = new Map(); let gest = null;
// penna: appena l'app la vede, la penna disegna e posiziona, il dito sposta soltanto la pianta (e il palmo non lascia segni)
const PEN = { seen: false, hoverRq: 0 }; let curPtr = { pen: false, p: 0.5 };
const penMode = () => PEN.seen && ST().penOnly !== false;
function hitTest(sx, sy) {
  const P = curPlan(); if (!P) return null; const R = ST().symPx / 2 + 8;
  const ed = editingRoom();
  if (ed) {
    for (let i = 0; i < ed.poly.length; i++) { const [a, b] = toS(...ed.poly[i]); if (Math.hypot(sx - a, sy - b) < 18) return { t: 'vtx', o: ed, i }; }
    for (let i = 0; i < ed.poly.length; i++) { const p = ed.poly[i], q = ed.poly[(i + 1) % ed.poly.length]; const [a, b] = toS((p[0] + q[0]) / 2, (p[1] + q[1]) / 2); if (Math.hypot(sx - a, sy - b) < 14) return { t: 'mid', o: ed, i }; }
  }
  let best = null, bd = Infinity;
  for (const n of S.vnotes) { if (n.planId !== P.id) continue; const [a, b] = toS(n.x, n.y); const d = Math.hypot(sx - a, sy - b); if (d < 18 && d < bd) { bd = d; best = { t: 'vnote', o: n }; } }
  if (best) return best;
  for (const it of S.items) { // gli oggetti vengono prima di coni e stanze
    if (it.planId !== P.id || !itemVisible(it)) continue;
    let d;
    if (it.pts) { d = Infinity; for (let i = 1; i < it.pts.length; i++) d = Math.min(d, segDist([sx, sy], toS(...it.pts[i - 1]), toS(...it.pts[i]))); d += 4; }
    else { const [a, b] = (S.disp && S.disp.get(it.id)) || toS(it.x, it.y); d = Math.hypot(sx - a, sy - b); }
    if (d < R && d < bd) { bd = d; best = { t: 'item', o: it }; }
  }
  if (best) return best;
  if (S.sel && S.sel.t === 'photo') { // punta del cono della foto selezionata
    const ph = photoById(S.sel.id);
    if (ph && ph.x != null && (ph.kind === 'parete' || ph.kind === 'soffitto')) { const [hx, hy] = photoHandle(ph); if (Math.hypot(sx - hx, sy - hy) < 26) return { t: 'rot', o: ph }; }
  }
  for (const ph of S.photos) { // la foto si prende solo dal pallino, non dal cono
    if (ph.planId !== P.id || ph.x == null) continue;
    if (!ST().cones && S.tool !== 'photo' && !(S.sel && S.sel.id === ph.id)) continue;
    const [a, b] = toS(ph.x, ph.y); const d = Math.hypot(sx - a, sy - b); if (d < 20 && d < bd) { bd = d; best = { t: 'photo', o: ph }; }
  }
  if (best) return best;
  for (const d of S.draws) { if (d.planId !== P.id) continue; for (const st of d.strokes) { const tol = Math.max(10, st.w * S.view.s / 2 + 6); for (let i = 1; i < st.pts.length; i++) { const dd = segDist([sx, sy], toS(...st.pts[i - 1]), toS(...st.pts[i])); if (dd < tol && dd < bd) { bd = dd; best = { t: 'draw', o: d }; } } } }
  if (best) return best;
  return roomHit(P, sx, sy);
}
function roomHit(P, sx, sy) { // la stanza si prende dal bordo o dal nome, non dall'area (così gli oggetti dentro restano facili da toccare)
  let best = null, bd = 14;
  for (const r of roomsOfPlan(P.id)) {
    for (let i = 0; i < r.poly.length; i++) { const d = segDist([sx, sy], toS(...r.poly[i]), toS(...r.poly[(i + 1) % r.poly.length])); if (d < bd) { bd = d; best = { t: 'room', o: r }; } }
    const [cx, cy] = toS(...polyCentroid(r.poly)); const w = ((r.done ? 2 : 0) + r.name.length) * 3.9 + 8;
    if (!best && Math.abs(sx - cx) < w && sy > cy - 15 && sy < cy + 7) best = { t: 'room', o: r };
  }
  return best;
}
function select(t, id) { S.sel = t ? { t, id } : null; renderPanel(); redraw(); }

function initCanvas() {
  const c = $('#cv');
  new ResizeObserver(() => redraw()).observe(c);
  const pos = e => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  c.addEventListener('pointerdown', e => {
    const isPen = e.pointerType === 'pen';
    if (isPen && !PEN.seen) { PEN.seen = true; if (ST().penOnly !== false) { toast('Penna rilevata: la penna disegna e posiziona, le dita spostano la pianta (si cambia in Impostazioni)', false, 6000); updateHint(); renderPanel(); } }
    const pm = penMode();
    if (pm && !isPen && [...ptrs.values()].some(p => p.pen)) return; // palmo appoggiato mentre si scrive: ignorato
    if (pm && isPen && ptrs.size) { if (gest && gest.cancel) gest.cancel(); gest = null; ptrs.clear(); } // la penna ha la precedenza sulle dita
    if (isPen) penHoverEnd();
    c.setPointerCapture(e.pointerId); const [x, y] = pos(e); ptrs.set(e.pointerId, { x, y, pen: isPen });
    if (ptrs.size === 1) curPtr = { pen: isPen, p: isPen && e.pressure ? e.pressure : 0.5 };
    if (ptrs.size === 2) {
      if (gest && gest.cancel) gest.cancel();
      const [p1, p2] = [...ptrs.values()];
      gest = { t: 'pinch', d0: Math.hypot(p1.x - p2.x, p1.y - p2.y), a0: Math.atan2(p2.y - p1.y, p2.x - p1.x), m0: [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2], v0: { ...S.view }, rot: false }; Compass.hold = true; // le dita comandano: la bussola aspetta
    } else if (ptrs.size === 1) gest = pm && !isPen ? fingerGesture(x, y) : startGesture(x, y);
  });
  c.addEventListener('pointermove', e => {
    if (!ptrs.has(e.pointerId)) { if (e.pointerType === 'pen' && !e.buttons && !ptrs.size) { const [hx, hy] = pos(e); penHover(hx, hy); } return; }
    const [x, y] = pos(e); const pp = ptrs.get(e.pointerId); ptrs.set(e.pointerId, { x, y, pen: pp.pen }); if (pp.pen && e.pressure) curPtr.p = e.pressure;
    if (gest && gest.t === 'pinch' && ptrs.size >= 2) {
      const [p1, p2] = [...ptrs.values()]; const d = Math.hypot(p1.x - p2.x, p1.y - p2.y); const m = [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2];
      const v0 = gest.v0; const ns = clamp(v0.s * d / Math.max(1, gest.d0), ZMIN, ZMAX); const k = ns / v0.s;
      let da = Math.atan2(p2.y - p1.y, p2.x - p1.x) - gest.a0; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
      if (!gest.rot && Math.abs(da) > 0.2) gest.rot = true; // torsione decisa: da qui la pianta ruota con le dita
      if (!gest.rot) da = 0;
      const cs = Math.cos(da), sn = Math.sin(da); const ox = gest.m0[0] - v0.tx, oy = gest.m0[1] - v0.ty;
      S.view.s = ns; S.view.r = (v0.r || 0) + da; S.view.tx = m[0] - (ox * cs - oy * sn) * k; S.view.ty = m[1] - (ox * sn + oy * cs) * k; if (gest.rot) rotBtnUpdate(); redraw();
    } else if (gest && gest.move) {
      const ev = gest.fine && e.getCoalescedEvents ? e.getCoalescedEvents() : null; // la penna manda più punti per evento: si prendono tutti
      if (ev && ev.length > 1) for (const ce of ev) { const [cx, cy] = pos(ce); gest.move(cx, cy); } else gest.move(x, y);
    }
  });
  const up = e => {
    if (!ptrs.has(e.pointerId)) return; const [x, y] = pos(e); ptrs.delete(e.pointerId);
    if (gest && gest.t === 'pinch') { if (ptrs.size === 0) { gest = null; Compass.hold = false; Compass.anchor(); rotPanelSync(); } return; }
    if (gest && gest.up && ptrs.size === 0) { const g = gest; gest = null; g.up(x, y, e.type === 'pointercancel'); }
  };
  c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
  // iPad/Safari: senza questo il sistema prova a interpretare i tocchi brevi della penna (zoom, selezione, scrittura a mano) e a volte li perde
  c.addEventListener('touchstart', e => { if (e.cancelable) e.preventDefault(); }, { passive: false });
  c.addEventListener('touchmove', e => { if (e.cancelable) e.preventDefault(); }, { passive: false });
  c.addEventListener('pointerleave', e => { if (e.pointerType === 'pen' && !ptrs.size) penHoverEnd(); });
  c.addEventListener('wheel', e => { e.preventDefault(); const [x, y] = pos(e); zoomAt(x, y, Math.exp(-e.deltaY * 0.0015)); }, { passive: false });
  $('#zRot').onclick = () => toggleRotPanel();
  $('#zCol').onclick = () => toggleDxfCol();
  $('#zIn').onclick = () => zoomAt(c.clientWidth / 2, c.clientHeight / 2, 1.5);
  $('#zOut').onclick = () => zoomAt(c.clientWidth / 2, c.clientHeight / 2, 1 / 1.5);
  $('#zFit').onclick = fitView;
}
function panGesture(x0, y0, onTap) {
  const v0 = { ...S.view }; let moved = false;
  return {
    move(x, y) { if (Math.hypot(x - x0, y - y0) > 7) moved = true; if (moved) { S.view.tx = v0.tx + x - x0; S.view.ty = v0.ty + y - y0; redraw(); } },
    up(x, y, cancel) { if (!moved && !cancel && onTap) onTap(x, y); },
  };
}
function pointGesture(x0, y0, snap, onDone) { // punto preciso: lente sopra il dito, il punto si fissa quando sollevi il dito
  const upd = (x, y) => { const [bx, by] = toB(x, y); S.hover = snap ? snap(bx, by) : { x: bx, y: by }; S.loupe = curPtr.pen ? null : { sx: x, sy: y }; redraw(); }; // con la penna la punta non copre il punto: niente lente
  upd(x0, y0);
  return {
    move(x, y) { upd(x, y); },
    up(x, y, cancel) { const p = S.hover; S.hover = null; S.loupe = null; redraw(); if (!cancel && p) onDone(p); },
    cancel() { S.hover = null; S.loupe = null; redraw(); },
  };
}
function startGesture(x0, y0) {
  const P = curPlan(); if (!P) return null;
  const tool = S.tool;
  if (tool === 'sel') {
    const h = hitTest(x0, y0);
    if (h && (h.t === 'vtx' || h.t === 'mid')) return vertexGesture(h, x0, y0);
    if (h && h.t === 'rot') {
      const ph = h.o; let rq = 0;
      return {
        move(x, y) { const [bx, by] = toB(x, y); ph.a = Math.atan2(by - ph.y, bx - ph.x); if (ph.kind === 'parete') ph.len = r1(Math.max(0.3 * ppm(P), Math.hypot(bx - ph.x, by - ph.y))); if (!rq) rq = requestAnimationFrame(() => { rq = 0; reprojectPhoto(ph); redraw(); }); },
        up() { reprojectPhoto(ph); S.lastA = ph.a; Sync.mark('photo:' + ph.id); renderPanel(); redraw(); },
      };
    }
    if (h && h.t === 'draw') {
      const o = h.o; select('draw', o.id); let moved = false; const [bx0, by0] = toB(x0, y0); const orig = JSON.parse(JSON.stringify(o.strokes));
      return {
        move(x, y) { if (!moved && Math.hypot(x - x0, y - y0) < 8) return; if (!moved) pushUndo(); moved = true; const [bx, by] = toB(x, y); const dx = bx - bx0, dy = by - by0; o.strokes = orig.map(st => ({ ...st, pts: st.pts.map(p => [r1(p[0] + dx), r1(p[1] + dy), ...p.slice(2)]) })); redraw(); },
        up() { if (moved) Sync.mark('plan:' + o.planId); renderPanel(); redraw(); },
      };
    }
    if (h && h.t === 'vnote') {
      const o = h.o; select('vnote', o.id); let moved = false; const ox = o.x, oy = o.y; const [bx0, by0] = toB(x0, y0);
      return {
        move(x, y) { if (!moved && Math.hypot(x - x0, y - y0) < 8) return; if (!moved) pushUndo(); moved = true; const [bx, by] = toB(x, y); o.x = r1(ox + bx - bx0); o.y = r1(oy + by - by0); redraw(); },
        up() { if (!moved) return; const r = roomAt(P.id, o.x, o.y); o.roomId = r ? r.id : null; Sync.mark('plan:' + o.planId); renderPanel(); redraw(); },
      };
    }
    if (h && (h.t === 'item' || h.t === 'photo')) {
      const o = h.o; select(h.t, o.id); let moved = false; const [bx0, by0] = toB(x0, y0); const orig = o.pts ? o.pts.map(p => p.slice()) : null; const ox = o.x, oy = o.y; let rq = 0;
      return {
        move(x, y) {
          if (!moved && Math.hypot(x - x0, y - y0) < 8) return;
          if (!moved && h.t === 'item') pushUndo();
          moved = true; const [bx, by] = toB(x, y); const dx = bx - bx0, dy = by - by0;
          o.x = r1(ox + dx); o.y = r1(oy + dy); if (orig) o.pts = orig.map(p => [r1(p[0] + dx), r1(p[1] + dy)]);
          if (h.t === 'photo' && !rq) rq = requestAnimationFrame(() => { rq = 0; const r = roomAt(P.id, o.x, o.y); o.roomId = r ? r.id : null; reprojectPhoto(o); redraw(); });
          redraw();
        },
        up() {
          if (!moved) return;
          if (h.t === 'item') {
            o.lk = true;
            const r = roomFor(P.id, o.x, o.y, o); o.roomId = r ? r.id : null; Sync.markItem(o); // resta dove l'hai lasciato; più di metà disegnata fuori dai muri → Esterni
          } else { const r = roomAt(P.id, o.x, o.y); o.roomId = r ? r.id : null; reprojectPhoto(o); Sync.mark('photo:' + o.id); }
          renderPanel(); redraw();
        },
      };
    }
    const sr = S.sel && S.sel.t === 'room' ? roomById(S.sel.id) : null; // stanza selezionata: trascinandola da dentro si sposta
    if (sr && sr.planId === P.id && (!h || h.t === 'room') && pointInPoly(...toB(x0, y0), sr.poly)) return roomMoveGesture([sr], x0, y0, () => { if (h && h.t === 'room') select('room', h.o.id); });
    return panGesture(x0, y0, () => { if (h && h.t === 'room') select('room', h.o.id); else select(null); });
  }
  if (tool === 'box') return S.tmp.paste ? pasteGesture(x0, y0) : boxGesture(x0, y0);
  if (tool === 'room') {
    const poly = S.tmp.poly || (S.tmp.poly = []);
    return pointGesture(x0, y0, toolSnap(), p => {
      if (p.closing) { finishRoom(); return; }
      const last = poly[poly.length - 1]; if (last && Math.hypot(p.x - last[0], p.y - last[1]) * S.view.s < 4) return;
      poly.push([r2(p.x), r2(p.y)]); renderPanel(); redraw();
    });
  }
  if (tool === 'sym') {
    return pointGesture(x0, y0, toolSnap(), p => symPlace(p.x, p.y));
  }
  if (tool === 'cal') return pointGesture(x0, y0, null, p => calTap(p.x, p.y));
  if (tool === 'meas') return pointGesture(x0, y0, toolSnap(), p => measTap(p.x, p.y));
  if (tool === 'vnote') return pointGesture(x0, y0, null, p => vnPlace(p.x, p.y));
  if (tool === 'photo') {
    const h = hitTest(x0, y0);
    if (h && (h.t === 'rot' || h.t === 'photo')) { S.tool = 'sel'; const g = startGesture(x0, y0); S.tool = 'photo'; return g; }
    const [bx, by] = toB(x0, y0);
    let moved = false; // anche fuori dai locali: foto esterna, gli elementi vanno negli Esterni
    S.tmp = { cam: { x: bx, y: by, a: -Math.PI / 2, len: 0, pt: true } }; redraw();
    return {
      move(x, y) { if (Math.hypot(x - x0, y - y0) > 14) moved = true; if (moved) { const [b2x, b2y] = toB(x, y); Object.assign(S.tmp.cam, { a: Math.atan2(b2y - by, b2x - bx), len: Math.hypot(b2x - bx, b2y - by), pt: false }); redraw(); } },
      up(x, y, cancel) {
        if (cancel) { S.tmp = {}; redraw(); return; } const c = S.tmp.cam;
        if (!moved && Compass.on) openPhotoSheet({ x: c.x, y: c.y, a: screenUpAngle(), len: 0, kind: 'parete', compass: true }); // bussola: guardi avanti a te
        else openPhotoSheet(moved ? { x: c.x, y: c.y, a: c.a, len: r1(c.len), kind: 'parete' } : { x: c.x, y: c.y, a: -Math.PI / 2, kind: 'soffitto' });
      },
      cancel() { S.tmp = {}; redraw(); },
    };
  }
  if (tool === 'pen') {
    const [bx, by] = toB(x0, y0); const prs = () => +clamp(curPtr.p, 0.05, 1).toFixed(2); // con la penna il tratto segue la pressione
    const st = { pts: [curPtr.pen ? [bx, by, prs()] : [bx, by]], col: S.pen.col, w: S.pen.w / S.view.s };
    S.tmp.stroke = st; redraw();
    const add = (x, y, min) => { const [b2x, b2y] = toB(x, y); const l = st.pts[st.pts.length - 1]; if (Math.hypot(b2x - l[0], b2y - l[1]) * S.view.s > min) { st.pts.push(curPtr.pen ? [b2x, b2y, prs()] : [b2x, b2y]); redraw(); } };
    return {
      fine: true, // riceve tutti i punti intermedi (scrittura piccola e veloce)
      move(x, y) { add(x, y, 0.75); },
      up(x, y, cancel) {
        S.tmp.stroke = null;
        if (cancel && st.pts.length < 2) { redraw(); return; } // annullato dal browser prima di scrivere: niente
        add(x, y, 0.2); finishStroke(st); // l'ultimo punto conta anche se il tratto è cortissimo
      },
      cancel() { S.tmp.stroke = null; redraw(); },
    };
  }
  return panGesture(x0, y0);
}

/* ---- modifica del contorno: trascina i vertici, tocca i "+" per aggiungerne ---- */
function vertexGesture(h, x0, y0) {
  const r = h.o; const P = curPlan(); pushUndo();
  let i = h.i;
  if (h.t === 'mid') { const p = r.poly[i], q = r.poly[(i + 1) % r.poly.length]; r.poly.splice(i + 1, 0, [r1((p[0] + q[0]) / 2), r1((p[1] + q[1]) / 2)]); i = i + 1; }
  const n = () => r.poly.length;
  const snap = (bx, by) => snapRoomPoint(bx, by, { prev: r.poly[(i - 1 + n()) % n()], next: r.poly[(i + 1) % n()], skip: { room: r, i } });
  const upd = (x, y) => { const [bx, by] = toB(x, y); const p = snap(bx, by); r.poly[i] = [r2(p.x), r2(p.y)]; S.hover = p; S.loupe = curPtr.pen ? null : { sx: x, sy: y }; redraw(); };
  upd(x0, y0);
  return {
    move(x, y) { upd(x, y); },
    up() {
      S.hover = null; S.loupe = null;
      if (n() > 3) { const a = r.poly[(i - 1 + n()) % n()], b = r.poly[(i + 1) % n()]; const pi = r.poly[i];
        if (Math.hypot(pi[0] - a[0], pi[1] - a[1]) * S.view.s < 14 || Math.hypot(pi[0] - b[0], pi[1] - b[1]) * S.view.s < 14) { r.poly.splice(i, 1); toast('Vertice tolto'); } }
      roomGeometryChanged(r.planId); Sync.mark('plan:' + r.planId); renderPanel(); redraw();
    },
    cancel() { S.hover = null; S.loupe = null; redraw(); },
  };
}
function finishRoom() {
  const pts = (S.tmp.poly || []).slice(); if (pts.length < 3) { toast('Servono almeno 3 angoli', true); return; }
  if (polyArea(pts) < 4) { toast('Stanza troppo piccola', true); return; }
  const P = curPlan(); pushUndo();
  let r = S.redrawRoom ? roomById(S.redrawRoom) : null;
  if (r) r.poly = pts;
  else {
    const n = S.rooms.filter(q => q.planId === P.id).length + 1;
    r = { id: uid('r'), planId: P.id, name: 'Locale ' + n, kind: '', h: ST().roomH, done: false, note: '', poly: pts }; S.rooms.push(r);
  }
  S.redrawRoom = null; S.tmp = { poly: [] };
  roomGeometryChanged(P.id); Sync.mark('plan:' + P.id);
  setTool('sel'); select('room', r.id);
  toast('Stanza creata. Ora usa "Foto" toccando dentro la stanza.');
}
/* dopo ogni modifica delle stanze: riassegna foto ed elementi e rimette gli oggetti sulle pareti */
function roomGeometryChanged(pid) {
  for (const ph of S.photos) if (ph.planId === pid && ph.x != null) { const r = roomAt(pid, ph.x, ph.y); ph.roomId = r ? r.id : null; }
  for (const ph of S.photos) if (ph.planId === pid && ph.x != null && ph.ai && ph.ai.dets) { reprojectPhoto(ph); Sync.mark('photo:' + ph.id); }
  for (const it of S.items) if (it.planId === pid) { const r = roomFor(pid, it.x, it.y, it); const nid = r ? r.id : null; if (nid !== it.roomId) { it.roomId = nid; Sync.markItem(it); } }
}
function symPlace(bx, by) {
  const sym = symOf(S.symSel); const P = curPlan();
  if (sym.mount === 'lineare') { S.tmp.line = S.tmp.line || []; S.tmp.line.push([r1(bx), r1(by)]); renderPalette(); redraw(); return; }
  pushUndo();
  const r = roomFor(P.id, bx, by, { s: sym.code }); // il punto resta esatto: si decide solo a quale locale appartiene (più di metà disegnata fuori → Esterni)
  const it = { id: uid('i'), planId: P.id, photoId: null, roomId: r ? r.id : null, s: sym.code, x: r1(bx), y: r1(by), pts: null, d: null, src: 'man', ok: true, lk: true, n: 1, h: null, note: '', conf: 1 };
  if (closedAt()) it.fate = 'nuovo'; // dopo la chiusura quello che aggiungi a mano è una nuova installazione
  S.items.push(it); Sync.markItem(it); S.sel = { t: 'item', id: it.id }; noteSymUse(sym.code); afterPlace();
}
function finishLine() {
  const pts = (S.tmp.line || []); if (pts.length < 2) { toast('Servono almeno 2 punti', true); return; }
  const P = curPlan(); pushUndo(); const mid = pts[Math.floor(pts.length / 2)]; const r = roomFor(P.id, mid[0], mid[1], { s: S.symSel, pts });
  const it = { id: uid('i'), planId: P.id, photoId: null, roomId: r ? r.id : null, s: S.symSel, x: mid[0], y: mid[1], pts, d: null, src: 'man', ok: true, lk: true, n: 1, h: null, note: '', conf: 1 };
  if (closedAt()) it.fate = 'nuovo';
  S.items.push(it); S.tmp = {}; Sync.markItem(it); S.sel = { t: 'item', id: it.id }; noteSymUse(S.symSel); afterPlace();
}
function afterPlace() { // timbro: resta sullo strumento simbolo per metterne un altro uguale; altrimenti torna alla freccia
  if (ST().stamp) { S.tmp = {}; S.hover = null; S.loupe = null; renderPalette(); updateHint(); renderPanel(); redraw(); } else setTool('sel');
}
async function calTap(bx, by) {
  S.tmp.cal = S.tmp.cal || []; S.tmp.cal.push([bx, by]); redraw();
  if (S.tmp.cal.length < 2) return;
  const [a, b] = S.tmp.cal; const px = dist(a, b);
  const v = await askText('Calibrazione scala', 'Distanza reale tra i due punti (metri)', '', 'number', 'Usa una quota lunga (più è lunga, più è precisa).');
  S.tmp = {}; redraw();
  const m = num(v); if (!m || m <= 0) { toast('Calibrazione annullata'); return; }
  const P = curPlan(); P.ppm = px / m; Sync.mark('meta');
  roomGeometryChanged(P.id);
  toast('Scala impostata. Ora disegna le stanze con "Stanza".', false, 5000); setTool('sel');
}
