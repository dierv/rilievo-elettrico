/* ============ GEOMETRIA ============ */
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function pointInPoly(x, y, poly) {
  let ins = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi)) ins = !ins;
  }
  return ins;
}
function polyArea(poly) { let a = 0; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) a += (poly[j][0] + poly[i][0]) * (poly[j][1] - poly[i][1]); return Math.abs(a / 2); }
function polyCentroid(poly) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const f = poly[j][0] * poly[i][1] - poly[i][0] * poly[j][1]; a += f; cx += (poly[j][0] + poly[i][0]) * f; cy += (poly[j][1] + poly[i][1]) * f;
  }
  if (Math.abs(a) < 1e-9) { const n = poly.length; return [poly.reduce((s, p) => s + p[0], 0) / n, poly.reduce((s, p) => s + p[1], 0) / n]; }
  a *= 0.5; const c = [cx / (6 * a), cy / (6 * a)];
  if (pointInPoly(c[0], c[1], poly)) return c;
  const ys = poly.map(p => p[1]); const midY = (Math.min(...ys) + Math.max(...ys)) / 2; const xs = [];
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [x1, y1] = poly[j], [x2, y2] = poly[i];
    if ((y1 > midY) !== (y2 > midY)) xs.push(x1 + (midY - y1) * (x2 - x1) / (y2 - y1));
  }
  xs.sort((a, b) => a - b); return xs.length >= 2 ? [(xs[0] + xs[1]) / 2, midY] : c;
}
function raycast(poly, x, y, ang) { // distanza dal punto al primo lato del poligono nella direzione data
  const dx = Math.cos(ang), dy = Math.sin(ang); let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[j], [bx, by] = poly[i]; const ex = bx - ax, ey = by - ay;
    const den = dx * ey - dy * ex; if (Math.abs(den) < 1e-9) continue;
    const t = ((ax - x) * ey - (ay - y) * ex) / den; const u = ((ax - x) * dy - (ay - y) * dx) / den;
    if (t > 1e-6 && u >= -1e-6 && u <= 1 + 1e-6 && t < best) best = t;
  }
  return best === Infinity ? null : best;
}
function raycastAll(poly, x, y, ang) { // tutte le intersezioni del raggio con il contorno, in ordine
  const dx = Math.cos(ang), dy = Math.sin(ang); const out = [];
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[j], [bx, by] = poly[i]; const ex = bx - ax, ey = by - ay;
    const den = dx * ey - dy * ex; if (Math.abs(den) < 1e-9) continue;
    const t = ((ax - x) * ey - (ay - y) * ex) / den; const u = ((ax - x) * dy - (ay - y) * dx) / den;
    if (t > 1e-6 && u >= -1e-6 && u <= 1 + 1e-6) out.push(t);
  }
  return out.sort((a, b) => a - b);
}
function roomAt(planId, x, y) {
  let best = null, ba = Infinity;
  for (const r of S.rooms) {
    if (r.planId !== planId || !r.poly || r.poly.length < 3) continue;
    if (pointInPoly(x, y, r.poly)) { const a = polyArea(r.poly); if (a < ba) { ba = a; best = r; } }
  }
  return best;
}
function segDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1]; const l2 = dx * dx + dy * dy;
  let t = l2 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2 : 0; t = clamp(t, 0, 1);
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}
function segProj(p, a, b) { // punto del segmento più vicino a p
  const dx = b[0] - a[0], dy = b[1] - a[1]; const l2 = dx * dx + dy * dy;
  const t = l2 ? clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2, 0, 1) : 0;
  return [a[0] + t * dx, a[1] + t * dy];
}
/* aggancia un punto alla parete (lato di stanza) più vicina, appena dentro la stanza */
function snapToRoomWall(planId, x, y, maxM = 0.6) {
  const k = ppm(planOf(planId)); let best = null, bd = maxM * k;
  for (const r of S.rooms) {
    if (r.planId !== planId || !r.poly || r.poly.length < 3) continue;
    for (let i = 0; i < r.poly.length; i++) {
      const a = r.poly[i], b = r.poly[(i + 1) % r.poly.length]; const q = segProj([x, y], a, b); const d = Math.hypot(x - q[0], y - q[1]);
      if (d < bd) { bd = d; best = { q, a, b, r }; }
    }
  }
  if (!best) return null;
  if (bd > 0.2 * k && !roomAt(planId, x, y)) return null; // tocco chiaramente fuori dal locale (es. facciata): resta all'esterno
  const { q, a, b, r } = best; const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  let nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L; // normale al lato, verso l'interno
  if (!pointInPoly(q[0] + nx * 2, q[1] + ny * 2, r.poly)) { nx = -nx; ny = -ny; }
  const ins = 0.1 * k; return { x: q[0] + nx * ins, y: q[1] + ny * ins, roomId: r.id };
}

/* ---- proiezione oggetti foto → planimetria ---- */
function camTan(ph) {
  const t = Math.tan((ph.fov || ST().fov) * Math.PI / 360); const w = ph.w || 4, h = ph.h || 3, L = Math.max(w, h);
  return { tH: t * w / L, tV: t * h / L };
}
function wallHit(ph, room, ang, dEst) { // parete del locale nella direzione dell'oggetto; con la distanza stimata corregge di qualche grado
  if (!room || !room.poly || room.poly.length < 3) return null;
  const k = ppm(planOf(ph.planId)); let best = null, bc = Infinity; const span = dEst ? 8 : 0;
  for (let d = -span; d <= span; d++) {
    const a = ang + d * Math.PI / 180; const t = raycast(room.poly, ph.x, ph.y, a); if (t == null) continue;
    const c = (dEst ? Math.abs(t - dEst) : 0) + Math.abs(d) * 0.06 * k;
    if (c < bc) { bc = c; best = { t, a }; }
  }
  return best;
}
function beyondDoor(ph, room, ang, dEst) { // oggetto visto attraverso una porta: va sulla parete del locale accanto
  const k = ppm(planOf(ph.planId)); const t1 = raycast(room.poly, ph.x, ph.y, ang); if (t1 == null) return null;
  const qx = ph.x + Math.cos(ang) * (t1 + 0.3 * k), qy = ph.y + Math.sin(ang) * (t1 + 0.3 * k);
  let r2 = null, ba = Infinity; for (const r of S.rooms) { if (r === room || r.planId !== ph.planId || !r.poly) continue; if (pointInPoly(qx, qy, r.poly)) { const a = polyArea(r.poly); if (a < ba) { ba = a; r2 = r; } } }
  if (r2) {
    const ts = raycastAll(r2.poly, ph.x, ph.y, ang);
    const tExit = ts.find(t => t > t1 + 0.2 * k && !pointInPoly(ph.x + Math.cos(ang) * (t + 0.05 * k), ph.y + Math.sin(ang) * (t + 0.05 * k), r2.poly));
    if (tExit) return { t1, t2: tExit, room: r2 };
  }
  return { t1, t2: null, room: null, guess: Math.max(dEst || 0, t1 + 0.6 * k) };
}
function projectUV(ph, u, v, posa, distM, hM, oltre) {
  const P = planOf(ph.planId), k = ppm(P); const { tH, tV } = camTan(ph);
  const room = roomById(ph.roomId) || roomAt(ph.planId, ph.x, ph.y);
  const H = (room && room.h) || ST().roomH, hc = ST().camH; const inset = 0.1 * k;
  if (oltre && room && ph.kind !== 'soffitto') {
    const ang = ph.a + Math.atan((u - 0.5) * 2 * tH); const b = beyondDoor(ph, room, ang, distM ? distM * k : null);
    if (b) {
      let mount = posa || 'parete'; if (mount === 'soffitto' && hM != null && hM < H - 0.4) mount = 'parete';
      let t;
      if (b.t2) t = mount === 'parete' ? b.t2 - inset : clamp(distM ? distM * k : (b.t1 + b.t2) / 2, b.t1 + 0.3 * k, b.t2 - inset);
      else t = b.guess;
      return { x: ph.x + Math.cos(ang) * t, y: ph.y + Math.sin(ang) * t, est: !b.t2 };
    }
  }
  const inside = (x, y) => { // mai fuori dal locale
    if (!room) return { x, y };
    const ang = Math.atan2(y - ph.y, x - ph.x), L = Math.hypot(x - ph.x, y - ph.y); const t = raycast(room.poly, ph.x, ph.y, ang);
    if (t != null && L > t - inset) { const tt = Math.max(0, t - inset); return { x: ph.x + Math.cos(ang) * tt, y: ph.y + Math.sin(ang) * tt }; }
    return { x, y };
  };
  if (ph.kind === 'soffitto') { // foto puntuale: verso il soffitto (immagine specchiata) o verso il pavimento
    const floor = posa === 'pavimento'; const d = Math.max(0.3, floor ? hc : H - hc) * k; const right = (u - 0.5) * 2 * tH * d, fwd = (0.5 - v) * 2 * tV * d;
    const fx = Math.cos(ph.a), fy = Math.sin(ph.a); let rx = Math.sin(ph.a), ry = -Math.cos(ph.a);
    if (floor) { rx = -rx; ry = -ry; }
    if (ph.mir) { rx = -rx; ry = -ry; }
    return { ...inside(ph.x + fx * fwd + rx * right, ph.y + fy * fwd + ry * right), est: false };
  }
  const ang = ph.a + Math.atan((u - 0.5) * 2 * tH);
  let mount = posa || 'parete';
  if (mount === 'soffitto' && hM != null && hM < H - 0.4) mount = 'parete'; // es. faretti nel mobile a specchio: sono a parete
  if (mount === 'parete') {
    const w = wallHit(ph, room, ang, distM ? distM * k : null);
    if (w) { const t = Math.max(0.15 * k, w.t - inset); return { x: ph.x + Math.cos(w.a) * t, y: ph.y + Math.sin(w.a) * t, est: false }; }
    let t = distM ? distM * k : (!room && ph.len ? ph.len : 2.5 * k);
    if (!room) { // foto all'esterno: mai dentro un locale, l'oggetto resta sulla facciata
      let tr = null; for (const r of S.rooms) { if (r.planId !== ph.planId || !r.poly || r.poly.length < 3) continue; const h = raycast(r.poly, ph.x, ph.y, ang); if (h != null && (tr == null || h < tr)) tr = h; }
      if (tr != null && t > tr - 0.4 * k) t = Math.max(0.15 * k, tr - 0.4 * k);
    }
    return { x: ph.x + Math.cos(ang) * t, y: ph.y + Math.sin(ang) * t, est: !(distM || (!room && ph.len)) };
  }
  // soffitto / pavimento: dentro il locale lungo la direzione, mai oltre la parete
  const w0 = wallHit(ph, room, ang, null);
  let dE = distM ? distM * k : null;
  if (dE == null) { const beta = Math.atan((0.5 - v) * 2 * tV); const bb = mount === 'soffitto' ? beta : -beta; const dh = mount === 'soffitto' ? H - hc : hc; if (bb > 0.08) dE = dh / Math.tan(bb) * k; }
  if (dE == null) dE = w0 ? w0.t * 0.5 : 2.5 * k;
  let t = w0 ? Math.min(dE, w0.t - inset) : dE; t = Math.max(t, 0.25 * k);
  return { x: ph.x + Math.cos(ang) * t, y: ph.y + Math.sin(ang) * t, est: true };
}
function detPoint(det) {
  if (Array.isArray(det.pt) && det.pt.length === 2) return det.pt;
  if (Array.isArray(det.bbox) && det.bbox.length === 4) return [(det.bbox[0] + det.bbox[2]) / 2, (det.bbox[1] + det.bbox[3]) / 2];
  return [0.5, 0.5];
}
const junkDet = d => !d || (d.conf != null && d.conf < 0.15) || /placeholder|segnaposto/i.test(d.note || '') || (Array.isArray(d.bbox) && d.bbox.every(v => v === 0) && (!d.pt || (d.pt[0] === 0 && d.pt[1] === 0)));
function placeItem(it, ph) {
  const det = ph.ai && ph.ai.dets && ph.ai.dets[it.d]; if (!det) return;
  const sym = symOf(it.s); const posa = det.posa || (sym.mount === 'lineare' ? 'parete' : sym.mount);
  if (sym.mount === 'lineare' && Array.isArray(det.linea) && det.linea.length >= 2) { // la polilinea segue tutto il percorso visto
    const q = det.linea.map(p => projectUV(ph, p[0], p[1], posa, det.dist_m, det.h_m, det.oltre));
    const pts = []; for (const p of q) { const v = [r1(p.x), r1(p.y)]; if (!pts.length || Math.hypot(v[0] - pts[pts.length - 1][0], v[1] - pts[pts.length - 1][1]) > 1) pts.push(v); }
    if (pts.length < 2) pts.push([pts[0][0] + 1, pts[0][1]]);
    it.pts = pts; const m = pts[Math.floor((pts.length - 1) / 2)], m2 = pts[Math.ceil((pts.length - 1) / 2)]; it.x = r1((m[0] + m2[0]) / 2); it.y = r1((m[1] + m2[1]) / 2); it.est = q.some(p => p.est);
  } else {
    const [u, v] = detPoint(det); const p = projectUV(ph, u, v, posa, det.dist_m, det.h_m, det.oltre);
    it.x = r1(p.x); it.y = r1(p.y); it.est = p.est; it.pts = null;
  }
}
function spreadOverlaps(items, ph) { // frutti della stessa placca: affiancati di qualche cm lungo il muro
  const k = ppm(planOf(ph.planId)); const done = [];
  for (const it of items) {
    if (it.pts) continue;
    let n = 0; for (const o of done) if (Math.hypot(o.x - it.x, o.y - it.y) < 0.05 * k) n++;
    if (n) { const ang = Math.atan2(it.y - ph.y, it.x - ph.x) + Math.PI / 2; it.x = r1(it.x + Math.cos(ang) * 0.12 * k * n); it.y = r1(it.y + Math.sin(ang) * 0.12 * k * n); }
    done.push(it);
  }
}
function reprojectPhoto(ph) {
  if (!ph.ai || !ph.ai.dets || ph.x == null) return;
  const its = S.items.filter(i => !i.lk && i.d != null && (i.photoId === ph.id || (i.tri || []).some(s => s.p === ph.id)));
  its.forEach(relocateItem);
  spreadOverlaps(its.filter(i => i.photoId === ph.id && !i.hint && !(i.tri && i.tri.length)), ph);
  its.forEach(i => Sync.markItem(i));
}

/* ---- stesso oggetto visto in più foto: triangolazione ---- */
function detRay(ph, det) {
  if (!ph || ph.x == null || ph.kind !== 'parete' || !det) return null;
  const { tH } = camTan(ph); const [u] = detPoint(det); const ang = ph.a + Math.atan((u - 0.5) * 2 * tH);
  return { c: [ph.x, ph.y], d: [Math.cos(ang), Math.sin(ang)], dEst: det.dist_m ? det.dist_m * ppm(planOf(ph.planId)) : null, h: det.h_m };
}
function itemRays(it) {
  const out = []; const add = (pid, d) => { const ph = photoById(pid); const det = ph && ph.ai && ph.ai.dets && ph.ai.dets[d]; const r = detRay(ph, det); if (r) out.push(r); };
  if (it.photoId && it.d != null) add(it.photoId, it.d);
  (it.tri || []).forEach(s => add(s.p, s.d));
  return out;
}
function raysSpread(rays) { let m = 0; for (let i = 0; i < rays.length; i++) for (let j = i + 1; j < rays.length; j++) m = Math.max(m, Math.abs(rays[i].d[0] * rays[j].d[1] - rays[i].d[1] * rays[j].d[0])); return m; }
function triangulateRays(rays) { // punto più vicino a tutte le direzioni (minimi quadrati)
  let a11 = 0, a12 = 0, a22 = 0, b1 = 0, b2 = 0;
  for (const r of rays) { const [dx, dy] = r.d; const m11 = 1 - dx * dx, m12 = -dx * dy, m22 = 1 - dy * dy; a11 += m11; a12 += m12; a22 += m22; b1 += m11 * r.c[0] + m12 * r.c[1]; b2 += m12 * r.c[0] + m22 * r.c[1]; }
  const det = a11 * a22 - a12 * a12; if (Math.abs(det) < 1e-6) return null;
  const x = (a22 * b1 - a12 * b2) / det, y = (a11 * b2 - a12 * b1) / det;
  return { x, y, res: rays.map(r => { const vx = x - r.c[0], vy = y - r.c[1]; return { t: vx * r.d[0] + vy * r.d[1], perp: Math.abs(vx * r.d[1] - vy * r.d[0]) }; }) };
}
function relocateItem(it) {
  if (it.lk) return;
  const ph = photoById(it.photoId); if (!ph) return;
  if (it.tri && it.tri.length) {
    const rays = itemRays(it); const T = rays.length >= 2 && raysSpread(rays) >= 0.2 ? triangulateRays(rays) : null;
    if (T && T.res.every(r => r.t > 0)) {
      let x = T.x, y = T.y;
      if (symOf(it.s).mount === 'parete') { const w = snapToRoomWall(it.planId, x, y, 0.5); if (w) { x = w.x; y = w.y; } }
      it.x = r1(x); it.y = r1(y); it.est = false; it.pts = null; const r = roomAt(it.planId, it.x, it.y); it.roomId = r ? r.id : it.roomId; return;
    }
  }
  placeItem(it, ph); const r = roomAt(it.planId, it.x, it.y); it.roomId = r ? r.id : ph.roomId;
}
function autoTriangulate(pid) { // cerca lo stesso oggetto in foto diverse e lo unisce
  const k = ppm(planOf(pid)); let merged = 0;
  for (let pass = 0; pass < 3; pass++) {
    const cand = S.items.filter(i => i.planId === pid && i.src === 'ai' && !i.hint && !i.lk && !i.pts && i.photoId && i.d != null);
    const pairs = [];
    for (let a = 0; a < cand.length; a++) for (let b = a + 1; b < cand.length; b++) {
      const A = cand[a], B = cand[b]; if (!triMatch(A, B)) continue;
      const pa = new Set([A.photoId, ...(A.tri || []).map(q => q.p)]); if ([B.photoId, ...(B.tri || []).map(q => q.p)].some(p => pa.has(p))) continue;
      if ((A.nm || []).includes(B.id) || (B.nm || []).includes(A.id)) continue;
      const rays = itemRays(A).concat(itemRays(B)); if (rays.length < 2) continue;
      if (raysSpread(rays) < 0.2) continue; // direzioni quasi parallele: non affidabile
      const T = triangulateRays(rays); if (!T) continue;
      if (T.res.some(r => r.t < 0.3 * k || r.t > 15 * k || r.perp > 0.25 * k)) continue;
      if (rays.some((r, i) => r.dEst && Math.abs(T.res[i].t - r.dEst) > Math.max(1.2 * k, 0.6 * r.dEst))) continue;
      const hs = rays.map(r => r.h).filter(h => h != null); if (hs.length >= 2 && Math.max(...hs) - Math.min(...hs) > 0.6) continue;
      const w = snapToRoomWall(pid, T.x, T.y, 0.5); if (!roomAt(pid, T.x, T.y) && !w) continue;
      if (symOf(A.s).mount === 'parete' && !w) continue;
      pairs.push({ A, B, score: T.res.reduce((s, r) => s + r.perp, 0) / rays.length });
    }
    if (!pairs.length) break;
    pairs.sort((p, q) => p.score - q.score); const used = new Set(); let n = 0;
    for (const { A, B } of pairs) { if (used.has(A.id) || used.has(B.id)) continue; used.add(A.id); used.add(B.id); mergeItems(A, B); n++; }
    merged += n; if (!n) break;
  }
  return merged;
}
function mergeItems(A, B) { // resta la descrizione della foto più affidabile
  let keep = A, drop = B; if ((B.conf || 0) > (A.conf || 0)) { keep = B; drop = A; }
  keep.tri = (keep.tri || []).concat([{ p: drop.photoId, d: drop.d }], drop.tri || []);
  keep.n = Math.max(keep.n || 1, drop.n || 1); keep.ok = keep.ok || drop.ok; keep.nm = [...new Set([...(keep.nm || []), ...(drop.nm || [])])];
  if (!keep.note && drop.note) keep.note = drop.note; if (keep.h == null) keep.h = drop.h;
  S.items = S.items.filter(i => i !== drop); Sync.markItem(drop);
  relocateItem(keep); Sync.markItem(keep);
}
function splitItem(it) { // "non è lo stesso oggetto": torna a un oggetto per foto
  const made = [];
  for (const s of it.tri || []) {
    const ph = photoById(s.p); const det = ph && ph.ai && ph.ai.dets && ph.ai.dets[s.d]; if (!det) continue;
    const n = { id: uid('i'), planId: it.planId, photoId: s.p, roomId: ph.roomId, s: det.code, x: it.x, y: it.y, pts: null, d: s.d, src: 'ai', ok: false, lk: false, n: det.n, h: det.h_m, note: det.note, conf: det.conf, est: false, nm: [it.id] }; detPlate(n, det);
    made.push(n);
  }
  const ids = [it.id, ...made.map(m => m.id)]; made.forEach(m => { m.nm = ids.filter(x => x !== m.id); });
  it.nm = [...new Set([...(it.nm || []), ...made.map(m => m.id)])]; it.tri = [];
  S.items.push(...made); [it, ...made].forEach(i => { relocateItem(i); Sync.markItem(i); });
  return made.length;
}

/* ---- orientamento dei simboli a parete: la base del blocco appoggia sul muro ---- */
const planRooms = pid => S.rooms.filter(r => r.planId === pid && r.poly && r.poly.length >= 3);
function wallRotIn(x, y, rooms, k) { // muro più vicino (entro 60 cm): angolo CAD con il simbolo rivolto verso l'interno del suo locale
  let best = null, bd = 0.6 * k;
  for (const r of rooms) for (let i = 0; i < r.poly.length; i++) { const a = r.poly[i], b = r.poly[(i + 1) % r.poly.length]; const d = segDist([x, y], a, b); if (d < bd) { bd = d; best = { a, b, r }; } }
  if (!best) return null;
  const dx = best.b[0] - best.a[0], dy = best.b[1] - best.a[1], L = Math.hypot(dx, dy) || 1; let nx = -dy / L, ny = dx / L;
  const pr = segProj([x, y], best.a, best.b); if (!pointInPoly(pr[0] + nx * 0.2 * k, pr[1] + ny * 0.2 * k, best.r.poly)) { nx = -nx; ny = -ny; }
  return Math.atan2(-nx, -ny);
}
function footBB(o) { // ingombro del simbolo in metri di simbolo (y verso l'interno del locale)
  if (isPlate(o)) { const w = 0.36 * o.pl.length; return [-w / 2, -0.08, w / 2, 0.42]; }
  const s = symOf(o.s); const lg = s.leg && legGeom(s.code); return lg ? lg.bb : [-0.19, -0.19, 0.19, 0.19];
}
function footPts(bb, x, y, rot, f) { // punti dell'ingombro disegnato (f = px di pianta per metro di simbolo, come lo vedi a schermo)
  const c = Math.cos(rot), sn = Math.sin(rot), out = [], N = 10;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { const u = bb[0] + (bb[2] - bb[0]) * (i + 0.5) / N, v = bb[1] + (bb[3] - bb[1]) * (j + 0.5) / N; out.push([x + (u * c - v * sn) * f, y - (u * sn + v * c) * f]); }
  return out;
}
function linePts(pts, n = 40) { // punti a passo costante lungo una linea
  const seg = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
  if (!tot) return [pts[0]]; const out = [];
  for (let q = 0; q < n; q++) { let t = tot * (q + 0.5) / n, i = 0; while (i < seg.length - 1 && t > seg[i]) { t -= seg[i]; i++; } const a = pts[i], b = pts[i + 1], w = seg[i] ? t / seg[i] : 0; out.push([a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w]); }
  return out;
}
function roomFor(planId, x, y, o) { // a quale locale appartiene un elemento messo a mano, SENZA spostarlo: conta il disegno; se più di metà è fuori dai muri → Esterni
  const rooms = planRooms(planId); if (!rooms.length) return null;
  if (!o) return roomAt(planId, x, y);
  const k = ppm(planOf(planId)), f = LEG_PPM() / (S.view.s || 1), s = symOf(o.s);
  const line = o.pts && o.pts.length > 1 ? linePts(o.pts) : null, wall = !line && s.mount === 'parete' && s.leg;
  const bb = line ? null : footBB(o), reach = bb ? Math.max(...[[bb[0], bb[1]], [bb[0], bb[3]], [bb[2], bb[1]], [bb[2], bb[3]]].map(([u, v]) => Math.hypot(u, v))) * f + 0.6 * k : 0;
  let best = null, bf = -1;
  for (const r of rooms) {
    let pts = line;
    if (!pts) {
      if (!pointInPoly(x, y, r.poly) && !r.poly.some((p, i) => segDist([x, y], p, r.poly[(i + 1) % r.poly.length]) < reach)) continue;
      let rot = 0; if (wall) { rot = o.rot != null ? o.rot : wallRotIn(x, y, [r], k); if (rot == null) rot = 0; }
      pts = footPts(bb, x, y, rot, f);
    }
    let n = 0; for (const p of pts) if (pointInPoly(p[0], p[1], r.poly)) n++;
    const fr = n / pts.length; if (fr > bf) { bf = fr; best = r; }
  }
  return bf >= 0.5 ? best : null;
}
function itemRot(it) { // angolo CAD (antiorario, radianti)
  if (it.pts || it.hint) return 0; const s = symOf(it.s); if (s.mount !== 'parete' || !s.leg) return 0;
  if (it.rot != null) return it.rot;
  const k = ppm(planOf(it.planId)); const room = roomById(it.roomId);
  const rot = wallRotIn(it.x, it.y, room && room.poly ? [room] : planRooms(it.planId), k); if (rot == null) return 0;
  if (room) return rot;
  const r2 = rot + Math.PI; return r2 > Math.PI ? r2 - 2 * Math.PI : r2; // Esterni: girato verso il muro, cioè 180° rispetto a dentro
}

/* ---- simboli sovrapposti: a ventaglio con linea di richiamo (solo visualizzazione) ---- */
function declutter(pts, R) { // pts: [{id, x, y}] in coordinate di disegno → Map id → [x, y] visualizzato
  const out = new Map(); const D = R * 2.1; const n = pts.length; if (!n) return out;
  const par = pts.map((_, i) => i); const find = i => { while (par[i] !== i) { par[i] = par[par[i]]; i = par[i]; } return i; };
  const grid = new Map(); const key = (gx, gy) => gx + ',' + gy;
  pts.forEach((p, i) => { const gx = Math.floor(p.x / D), gy = Math.floor(p.y / D); const kk = key(gx, gy); if (!grid.has(kk)) grid.set(kk, []); grid.get(kk).push(i); });
  pts.forEach((p, i) => {
    const gx = Math.floor(p.x / D), gy = Math.floor(p.y / D);
    for (let ax = -1; ax <= 1; ax++) for (let ay = -1; ay <= 1; ay++) for (const j of grid.get(key(gx + ax, gy + ay)) || []) {
      if (j <= i) continue; const q = pts[j]; if (Math.hypot(p.x - q.x, p.y - q.y) < D) { const a = find(i), b = find(j); if (a !== b) par[a] = b; }
    }
  });
  const groups = new Map(); pts.forEach((p, i) => { const r = find(i); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(p); });
  for (const g of groups.values()) {
    if (g.length === 1 || g.length > 14) { g.forEach(p => out.set(p.id, [p.x, p.y])); continue; } // gruppi enormi: meglio zoomare
    const cx = g.reduce((s, p) => s + p.x, 0) / g.length, cy = g.reduce((s, p) => s + p.y, 0) / g.length;
    const rr = Math.max(R * 1.7, g.length * R * 2.3 / (2 * Math.PI));
    g.map(p => ({ p, a: Math.hypot(p.x - cx, p.y - cy) > 0.5 ? Math.atan2(p.y - cy, p.x - cx) : null }))
      .sort((A, B) => (A.a ?? 9) - (B.a ?? 9) || String(A.p.id).localeCompare(String(B.p.id)))
      .forEach((o, i, arr) => { const a = -Math.PI / 2 + i * 2 * Math.PI / arr.length; out.set(o.p.id, [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); });
  }
  return out;
}
