'use strict';
/* ============ UTIL ============ */
const $ = s => document.querySelector(s);
const uid = (p = '') => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const r1 = v => Math.round(v * 10) / 10;
const r2 = v => Math.round(v * 100) / 100;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fmtDate = t => { try { return new Date(t).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch (e) { return ''; } };
const num = (v, d = null) => { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : d; };
const itNum = (v, dec = 2) => (v == null || !isFinite(v)) ? '' : String(Math.round(v * 10 ** dec) / 10 ** dec).replace('.', ',');

let toastT = null;
function toast(msg, err = false, ms = 3200) {
  const t = $('#toast'); t.textContent = msg; t.className = err ? 'err' : ''; clearTimeout(toastT);
  toastT = setTimeout(() => t.className = 'hide', ms);
}
function openModal(html, wide = false) {
  const m = $('#modal'); const b = m.querySelector('.box');
  b.className = 'box' + (wide ? ' wide' : ''); b.innerHTML = html; m.classList.remove('hide');
  return b;
}
function closeModal() { $('#modal').classList.add('hide'); $('#modal .box').innerHTML = ''; }
function askConfirm(msg, ok = 'Conferma', danger = false) {
  return new Promise(res => {
    const b = openModal(`<h3>${esc(msg)}</h3><div class="acts"><button data-a="0">Annulla</button><button data-a="1" class="${danger ? 'danger' : 'pri'}">${esc(ok)}</button></div>`);
    b.querySelectorAll('[data-a]').forEach(x => x.onclick = () => { closeModal(); res(x.dataset.a === '1'); });
  });
}
function askChoice(msg, opts, hint = '') { // opts: [[valore, etichetta], …]; il primo è quello consigliato
  return new Promise(res => {
    const b = openModal(`<h3>${esc(msg)}</h3>${hint ? `<div class="mut small">${esc(hint)}</div>` : ''}<div class="acts">${opts.map(([v, l], i) => `<button data-v="${esc(v)}" class="${i === 0 ? 'pri' : ''}">${esc(l)}</button>`).join('')}</div>`);
    b.querySelectorAll('[data-v]').forEach(x => x.onclick = () => { closeModal(); res(x.dataset.v); });
  });
}
function askText(title, label, value = '', type = 'text', hint = '') {
  return new Promise(res => {
    const b = openModal(`<h3>${esc(title)}</h3>${hint ? `<div class="mut small">${esc(hint)}</div>` : ''}<label class="f">${esc(label)}</label><input id="qIn" type="${type}" ${type === 'number' ? 'step="any" inputmode="decimal"' : ''} value="${esc(value)}"><div class="acts"><button data-a="0">Annulla</button><button data-a="1" class="pri">OK</button></div>`);
    const i = b.querySelector('#qIn'); setTimeout(() => { if (i.isConnected) i.focus(); }, 50);
    const done = ok => { const v = i.value; closeModal(); res(ok ? v : null); };
    i.onkeydown = e => { if (e.key === 'Enter') done(true); };
    b.querySelectorAll('[data-a]').forEach(x => x.onclick = () => done(x.dataset.a === '1'));
  });
}

/* ============ INDEXEDDB (copia locale + coda offline) ============ */
const IDB = {
  db: null,
  open() {
    return new Promise(res => {
      try {
        const r = indexedDB.open('rilievoEL', 1);
        r.onupgradeneeded = () => { const d = r.result; d.createObjectStore('docs', { keyPath: 'path' }); d.createObjectStore('blobs', { keyPath: 'id' }); };
        r.onsuccess = () => { this.db = r.result; res(true); };
        r.onerror = () => res(false);
      } catch (e) { res(false); }
    });
  },
  tx(store, mode, fn) {
    return new Promise(res => {
      if (!this.db) return res(null);
      try {
        const t = this.db.transaction(store, mode); const rq = fn(t.objectStore(store));
        t.oncomplete = () => res(rq ? rq.result : true); t.onerror = () => res(null); t.onabort = () => res(null);
      } catch (e) { res(null); }
    });
  },
  get(s, k) { return this.tx(s, 'readonly', st => st.get(k)); },
  put(s, v) { return this.tx(s, 'readwrite', st => st.put(v)); },
  del(s, k) { return this.tx(s, 'readwrite', st => st.delete(k)); },
  all(s) { return this.tx(s, 'readonly', st => st.getAll()).then(r => r || []); },
};

/* ============ CAPACITÀ CLAUDE ============ */
const CAP = { db: null, user: null, assets: null, sample: null, dl: null, uid: null, img: false, ready: false, aiOff: false };
async function initCaps() {
  if (!window.claude || typeof window.claude.use !== 'function') { CAP.ready = true; return; }
  const use = n => Promise.resolve().then(() => window.claude.use(n)).catch(() => null);
  const [db, user, assets, sample, dl] = await Promise.all(['db', 'user', 'assets', 'sample', 'downloads'].map(use));
  Object.assign(CAP, { db, user, assets, sample, dl });
  if (user) { try { CAP.uid = await user.id(); } catch (e) { CAP.uid = null; } }
  if (!CAP.uid) CAP.db = null;
  if (sample) { try { const l = await sample.limits(); CAP.img = !!(l && l.images); CAP.imgMax = (l && l.images && l.images.maxCount) || 1; } catch (e) { CAP.img = false; } }
  CAP.ready = true;
}
const base = () => 'data/users/' + (CAP.uid || 'local');
const withTimeout = (p, ms = 10000) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej({ code: 'timeout' }), ms))]);

/* ============ LIBRERIA SIMBOLI DI DEFAULT ============ */
const CATS = {
  L: { n: 'Illuminazione', layer: 'RIL_LUCI', aci: 30 },
  C: { n: 'Comandi', layer: 'RIL_COMANDI', aci: 6 },
  P: { n: 'Prese', layer: 'RIL_PRESE', aci: 5 },
  Q: { n: 'Distribuzione', layer: 'RIL_DISTRIBUZIONE', aci: 1 },
  S: { n: 'Speciali / sicurezza', layer: 'RIL_SPECIALI', aci: 3 },
  U: { n: 'Utenze', layer: 'RIL_UTENZE', aci: 4 },
  T: { n: 'Terra / LPS', layer: 'RIL_TERRA', aci: 3 },
  X: { n: 'Altro', layer: 'RIL_ALTRO', aci: 8 },
};
const SHAPES = { circle: 'Cerchio', circleX: 'Cerchio con X', dot: 'Punto pieno', square: 'Quadrato', squareX: 'Quadrato con X', rect: 'Rettangolo', tri: 'Triangolo', diamond: 'Rombo', hex: 'Esagono', star: 'Stella', semi: 'Semicerchio', line: 'Linea (tratto)' };
const MOUNTS = { soffitto: 'Soffitto', parete: 'Parete', pavimento: 'Pavimento', lineare: 'Lineare' };
const OLD_SYMBOLS = [
  ['L1', 'Punto luce a soffitto (plafoniera, lampadario, pendente)', 'L', 'soffitto', 'circleX', '#d97706'],
  ['L2', 'Applique a parete', 'L', 'parete', 'semi', '#d97706'],
  ['L3', 'Faretto / downlight a incasso', 'L', 'soffitto', 'dot', '#d97706'],
  ['L4', 'Plafoniera lineare / neon / LED stagna', 'L', 'soffitto', 'rect', '#d97706'],
  ['L5', 'Armatura industriale / campana / proiettore', 'L', 'soffitto', 'hex', '#d97706'],
  ['L6', 'Lampada di emergenza', 'L', 'parete', 'squareX', '#16a34a'],
  ['L7', 'Striscia LED / binario luci', 'L', 'lineare', 'line', '#d97706'],
  ['C1', 'Interruttore / comando luce', 'C', 'parete', 'tri', '#9333ea'],
  ['C2', 'Deviatore / invertitore', 'C', 'parete', 'diamond', '#9333ea'],
  ['C3', 'Pulsante (luce, campanello, tapparella)', 'C', 'parete', 'circle', '#9333ea'],
  ['C4', 'Sensore di presenza / crepuscolare', 'C', 'soffitto', 'star', '#9333ea'],
  ['P1', 'Presa 10/16A (bipasso)', 'P', 'parete', 'semi', '#2563eb'],
  ['P2', 'Presa Schuko / universale', 'P', 'parete', 'circleX', '#2563eb'],
  ['P3', 'Presa industriale CEE / interbloccata', 'P', 'parete', 'square', '#2563eb'],
  ['P4', 'Presa dati RJ45 / telefono', 'P', 'parete', 'diamond', '#0d9488'],
  ['P5', 'Presa TV / SAT', 'P', 'parete', 'tri', '#0d9488'],
  ['P6', 'Punto alimentazione dedicato (forno, boiler, lavatrice…)', 'P', 'parete', 'squareX', '#2563eb'],
  ['Q1', 'Quadro elettrico / centralino', 'Q', 'parete', 'rect', '#dc2626'],
  ['Q2', 'Scatola di derivazione', 'Q', 'parete', 'square', '#6b7280'],
  ['Q3', 'Canalina / passerella / tubo a vista', 'Q', 'lineare', 'line', '#78716c'],
  ['Q4', 'Contatore / punto di consegna', 'Q', 'parete', 'hex', '#dc2626'],
  ['Q5', 'Pulsante di sgancio / sezionatore', 'Q', 'parete', 'diamond', '#dc2626'],
  ['S1', 'Rilevatore fumo / sensore incendio', 'S', 'soffitto', 'circle', '#e11d48'],
  ['S2', 'Allarme / sirena / pulsante manuale', 'S', 'parete', 'star', '#e11d48'],
  ['S3', 'Citofono / videocitofono', 'S', 'parete', 'square', '#0891b2'],
  ['S4', 'Termostato / cronotermostato', 'S', 'parete', 'circle', '#0891b2'],
  ['S5', 'Telecamera / sensore antifurto', 'S', 'parete', 'tri', '#0891b2'],
  ['U1', 'Climatizzatore / split / fan coil', 'U', 'parete', 'rect', '#0f766e'],
  ['U2', 'Macchina / motore / utenza fissa', 'U', 'pavimento', 'hex', '#0f766e'],
  ['U3', 'Aspiratore / ventilatore', 'U', 'parete', 'circleX', '#0f766e'],
  ['X', 'Altro (da classificare)', 'X', 'parete', 'star', '#64748b'],
].map(([code, name, cat, mount, shape, color]) => ({ code, name, cat, mount, shape, color }));
/* ---- legenda dell'utente (00_legenda.js): i simboli dell'app sono i suoi blocchi CAD ---- */
const LEG = new Map(LEGENDA.sym.map(s => [s.c, s])); const legCache = new Map(); const dcolCache = new Map();
const dispCol = c => { // colori CAD pensati per il fondo nero: scuriti se troppo chiari sul bianco
  if (dcolCache.has(c)) return dcolCache.get(c);
  let out = '#334155';
  if (c && c.length >= 7) { const r = parseInt(c.slice(1, 3), 16), g = parseInt(c.slice(3, 5), 16), b = parseInt(c.slice(5, 7), 16); const L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    if (L > 0.92) out = '#1f2937'; else if (L <= 0.5) out = c; else { const k = 0.5 / L; const h = v => Math.round(v * k).toString(16).padStart(2, '0'); out = '#' + h(r) + h(g) + h(b); } }
  dcolCache.set(c, out); return out;
};
function legGeom(code) { // primitive del simbolo, in metri (y in su come nel CAD)
  if (legCache.has(code)) return legCache.get(code);
  const s = LEG.get(code); if (!s) return null; const pal = LEGENDA.pal;
  const g = s.g.map(p => p[0] === 'L' ? { t: 'L', c: pal[p[1]], d: p.slice(2) } : p[0] === 'P' ? { t: 'P', c: pal[p[1]], z: p[2], d: p.slice(3) } : p[0] === 'F' ? { t: 'F', c: pal[p[1]], d: p.slice(2) }
    : { t: 'T', c: pal[p[1]], x: p[2], y: p[3], h: p[4], r: p[5], ha: p[6], va: p[7], w: p[8], s: p[9] });
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; const ext = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
  for (const p of g) {
    if (p.t === 'L' || p.t === 'P') for (let i = 0; i < p.d.length; i += 2) ext(p.d[i], p.d[i + 1]);
    else if (p.t === 'F') p.d.forEach(q => { for (let i = 0; i < q.length; i += 2) ext(q[i], q[i + 1]); });
    else { const w = p.s.length * p.h * 0.6, ax = (p.ha === 1 || p.ha === 4) ? -w / 2 : p.ha === 2 ? -w : 0, ay = p.va === 3 ? -p.h : (p.va === 2 || p.ha === 4) ? -p.h / 2 : 0; ext(p.x + ax, p.y + ay); ext(p.x + ax + w, p.y + ay + p.h); }
  }
  if (!isFinite(x0)) { x0 = y0 = -0.2; x1 = y1 = 0.2; }
  const cnt = {}; g.forEach(p => { if (p.t !== 'T') cnt[p.c] = (cnt[p.c] || 0) + (p.t === 'F' ? 3 : 1); }); const main = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0] || '#64748b';
  const r = { g, bb: [x0, y0, x1, y1], main }; legCache.set(code, r); return r;
}
const DEFAULT_SYMBOLS = LEGENDA.sym.map(s => ({ code: s.c, name: s.n, cat: s.k, mount: s.m, short: s.s, block: s.b, ai: s.ai, leg: 1, color: dispCol(legGeom(s.c).main) }));
// vecchi simboli generici -> simboli della legenda (sopralluoghi fatti prima)
const OLD2LEG = { L1: '0047_LUCE_SOFFITTO', L2: '0048_LUCE_PARETE', L3: '0050_FARETTO_LED', L4: 'RIL_PLAFONIERA', L5: '0069_RIFLETTORE', L6: '0051_EM', L7: 'LEG_STRIP_LED',
  C1: '0035_INTERRUTTORE', C2: '0039_DEVIATORE', C3: '0043a_PULSANTE', C4: '0045_PIR', P1: '0075a_BIPRESA', P2: '0077a_UNIVERSALE', P3: '0115a_CEE_A', P4: '0080_DATI', P5: '0081_TV', P6: '0101_P.TO_ALIMENTAZIONE',
  Q1: 'QE_VUOTO', Q2: '0019_SCATOLA_DERIVAZIONE', Q3: '0024_CANALINA_POSACAVI', Q4: '0001_KWh', Q5: '0017a_P_EM_1', S1: '0156a_FIRE_AMBIENTE', S2: '0149_SIRENA', S3: '0137a_CITOFONO_P.I.', S4: '0092a_TERMOSTATO', S5: '0126_TVCC',
  U1: '0101_P.TO_ALIMENTAZIONE', U2: '0101_P.TO_ALIMENTAZIONE', U3: '0093_ESTRATTORE' };
const OLD_TAG = { U1: 'U.I.' };
const DEFAULT_SETTINGS = { tier: 'default', auto: true, fov: 66, camH: 1.4, roomH: 2.7, ortho: true, symPx: 22, labels: true, cones: true, drafts: true, hints: true, penOnly: true, plZoom: false };
const LEG_PPM = () => ST().symPx / 0.38; // px sullo schermo per metro di simbolo

/* ============ STATO ============ */
const S = {
  lib: { symbols: DEFAULT_SYMBOLS.map(s => ({ ...s })), settings: { ...DEFAULT_SETTINGS }, legV: LEGENDA.v },
  surveys: [], sv: null, rooms: [], items: [], photos: [], draws: [], vnotes: [], planId: null, pen: { col: '#dc2626', w: 3 },
  sel: null, tool: 'sel', symSel: null, view: { s: 1, tx: 0, ty: 0 }, planImg: {}, undo: [],
};
const ST = () => S.lib.settings;
let _symArr = null, _symLen = 0, _symMap = null;
function symsChanged() { _symArr = null; }
const symOf = code => {
  if (_symArr !== S.lib.symbols || _symLen !== S.lib.symbols.length) { _symArr = S.lib.symbols; _symLen = _symArr.length; _symMap = new Map(_symArr.map(s => [s.code, s])); }
  return _symMap.get(code) || _symMap.get('X') || { code, name: code, cat: 'X', mount: 'parete', shape: 'star', color: '#64748b' };
};
function resolveCode(raw) { // codice scritto dall'AI -> simbolo della libreria (tollera solo il numero, es. "0035")
  const t = String(raw || '').trim(); if (!t) return null; const up = t.toUpperCase(); const syms = S.lib.symbols;
  let s = syms.find(x => x.code.toUpperCase() === up); if (s) return s.code;
  if (OLD2LEG[up] && syms.some(x => x.code === OLD2LEG[up])) return OLD2LEG[up];
  const m = up.match(/^(\d{3,4}[A-Z]?)(?=_|$)/); if (m) { s = syms.find(x => x.code.toUpperCase() === m[1]) || syms.find(x => x.code.toUpperCase().startsWith(m[1] + '_')); if (s) return s.code; }
  s = syms.find(x => x.code.toUpperCase().startsWith(up)); return s ? s.code : null;
}
const symShort = s => (s && (s.short || s.code)) || '';
const symColor = s => (s && (s.dcol || s.color)) || '#334155';
const drawById = id => S.draws.find(d => d.id === id);
const itemVisible = it => it.hint ? ST().hints !== false : (it.ok || ST().drafts);
const curPlan = () => S.sv && S.sv.plans.find(p => p.id === S.planId);
const planOf = id => S.sv && S.sv.plans.find(p => p.id === id);
const ppm = (p = curPlan()) => (p && p.ppm) || (p ? Math.max(p.w, p.h) / 30 : 40); // px/m (stima se non calibrato)
const roomById = id => S.rooms.find(r => r.id === id);
const photoById = id => S.photos.find(p => p.id === id);
const itemById = id => S.items.find(i => i.id === id);

/* ============ SINCRONIZZAZIONE (db Claude + copia locale) ============ */
function pathFor(key) {
  const sid = S.sv && S.sv.id;
  if (key === 'lib') return base() + '/lib';
  if (key === 'meta') return `${base()}/${sid}`;
  const [k, id] = key.split(':');
  if (k === 'plan') return `${base()}/${sid}/plans/${id}`;
  if (k === 'photo') return `${base()}/${sid}/photos/${id}`;
  return null;
}
function cleanPhoto(p) {
  const o = { ...p }; delete o._url; if (o.aiSt === 'queued' || o.aiSt === 'run') o.aiSt = 'none'; return o;
}
function buildDoc(key) {
  if (key === 'lib') return { type: 'lib', symbols: S.lib.symbols, settings: S.lib.settings, legV: S.lib.legV || 0 };
  if (!S.sv) return null;
  if (key === 'meta') return { type: 'survey', ...S.sv, updated: Date.now(), stats: { plans: S.sv.plans.length, rooms: S.rooms.length, done: S.rooms.filter(r => r.done).length, items: S.items.filter(i => !i.hint).length, photos: S.photos.length } };
  const [k, id] = key.split(':');
  if (k === 'plan') {
    if (!planOf(id)) return null;
    return { type: 'plan', id, rooms: S.rooms.filter(r => r.planId === id), items: S.items.filter(i => i.planId === id && !i.photoId), draws: S.draws.filter(d => d.planId === id), vnotes: S.vnotes.filter(n => n.planId === id) };
  }
  if (k === 'photo') {
    const p = photoById(id); if (!p) return null;
    return { type: 'photo', ...cleanPhoto(p), items: S.items.filter(i => i.photoId === id) };
  }
  return null;
}
const Sync = {
  dirty: new Set(), dels: new Set(), last: new Map(), timer: null, busy: false, again: false, err: null, retryAt: 0,
  mark(...keys) { keys.forEach(k => k && this.dirty.add(k)); if (S.sv) this.dirty.add('meta'); this.schedule(); },
  markItem(it) { this.mark(it.photoId ? 'photo:' + it.photoId : 'plan:' + it.planId); },
  del(path) { this.dels.add(path); this.schedule(); },
  schedule(ms = 900) { clearTimeout(this.timer); this.timer = setTimeout(() => this.flush(), ms); syncBadge(); },
  async flush() {
    if (this.busy) { this.again = true; return; }
    this.busy = true; this.again = false;
    const keys = [...this.dirty]; this.dirty.clear();
    let failed = false;
    for (const key of keys) {
      const path = pathFor(key); const data = buildDoc(key);
      if (!path || !data) continue;
      const js = JSON.stringify(data);
      if (this.last.get(path) === js) continue;
      if (CAP.db && js.length > 250000) { toast('Documento troppo grande (' + Math.round(js.length / 1024) + ' KB): dividi la tavola o elimina elementi.', true, 6000); }
      await IDB.put('docs', { path, sid: S.sv ? S.sv.id : null, data, dirty: true, ts: Date.now() });
      if (CAP.db) {
        try {
          await withTimeout(CAP.db.doc(path).set(JSON.parse(js)), 20000);
          this.last.set(path, js);
          await IDB.put('docs', { path, sid: S.sv ? S.sv.id : null, data, dirty: false, ts: Date.now() });
          this.err = null;
        } catch (e) {
          const c = e && e.code;
          if (c === 'quota_exceeded') { this.err = 'Spazio esaurito'; toast('Spazio dati esaurito: elimina sopralluoghi vecchi o esporta.', true, 7000); }
          else if (c === 'invalid_argument') { this.err = 'Errore salvataggio'; toast('Salvataggio rifiutato (dati non validi o troppo grandi).', true, 6000); }
          else { this.err = 'offline'; this.dirty.add(key); failed = true; }
        }
      } else this.last.set(path, js);
    }
    for (const path of [...this.dels]) {
      this.dels.delete(path);
      await IDB.del('docs', path);
      if (CAP.db) { try { await withTimeout(CAP.db.doc(path).delete(), 15000); } catch (e) { this.dels.add(path); failed = true; } }
    }
    this.busy = false;
    if (failed) { this.schedule(15000); }
    else if (this.again || this.dirty.size) this.schedule(300);
    syncBadge();
  },
  pending() { return this.dirty.size + this.dels.size; }
};
function syncBadge() {
  const b = $('#syncB'); if (!b) return;
  const up = Uploads.count();
  if (!CAP.db) { if (PLATFORM === 'pwa') return pwaBadge(b); b.className = 'chip warn'; b.textContent = 'Solo su questo tablet' + (Sync.pending() ? ' •' : ''); return; }
  if (Sync.err === 'offline' || (up && !navigator.onLine)) { b.className = 'chip warn'; b.textContent = 'Offline: in coda (' + (Sync.pending() + up) + ')'; return; }
  if (Sync.err) { b.className = 'chip bad'; b.textContent = Sync.err; return; }
  if (Sync.pending() || up || Sync.busy) { b.className = 'chip grey'; b.textContent = 'Salvataggio…' + (up ? ' (' + up + ' file)' : ''); return; }
  b.className = 'chip ok'; b.textContent = 'Salvato ✓';
}
window.addEventListener('online', () => { Sync.schedule(200); Uploads.pump(); });

/* ============ CARICAMENTO FILE (foto e tavole) ============ */
const Uploads = {
  q: new Set(), running: false, localUrls: new Map(),
  count() { return this.q.size; },
  async add(id, blob, kind, ref) { // kind: 'photo'|'plan'; ref: id dell'oggetto
    await IDB.put('blobs', { id, blob, kind, ref, sid: S.sv && S.sv.id, ts: Date.now() });
    this.localUrls.set(id, URL.createObjectURL(blob));
    if (CAP.assets) { this.q.add(id); this.pump(); }
  },
  async resume() { // al riavvio: ricarica la coda dalle copie locali
    if (!CAP.assets) return;
    const all = await IDB.all('blobs');
    all.forEach(b => this.q.add(b.id)); this.pump();
  },
  async pump() {
    if (this.running || !CAP.assets) return; this.running = true;
    for (const id of [...this.q]) {
      const rec = await IDB.get('blobs', id);
      if (!rec) { this.q.delete(id); continue; }
      try {
        const audio = rec.kind === 'audio'; // gli asset non accettano audio: viaggia come testo base64
        const type = audio ? 'text/plain' : rec.blob.type && /^(image\/(png|jpeg|webp))$/.test(rec.blob.type) ? undefined : (rec.kind === 'plan' ? 'image/png' : 'image/jpeg');
        const r = await withTimeout(CAP.assets.upload(audio ? await audioUploadBody(rec.blob) : rec.blob, type ? { type } : undefined), audio ? 240000 : 120000);
        this.q.delete(id);
        attachAsset(rec, r.id);
        await IDB.del('blobs', id);
      } catch (e) {
        const c = e && e.code;
        if (c === 'quota_or_state') { toast('Spazio foto esaurito sull\'app: esporta e libera spazio.', true, 7000); break; }
        if (c === 'too_large' || c === 'unsupported_type' || c === 'invalid_request') { this.q.delete(id); toast((rec.kind === 'audio' ? 'Audio' : 'Foto') + ' non caricabile: resta solo su questo tablet.', true); continue; }
        await sleep(8000); break;
      }
      syncBadge();
    }
    this.running = false; syncBadge();
    if (this.q.size) setTimeout(() => this.pump(), 20000);
  },
};
function attachAsset(rec, assetId) {
  // trova l'oggetto (anche se il sopralluogo non è aperto: aggiorna la copia locale del documento)
  if (S.sv && rec.sid === S.sv.id) {
    if (rec.kind === 'photo') { const p = photoById(rec.ref); if (p) { p.asset = assetId; p.local = false; Sync.mark('photo:' + p.id); } }
    if (rec.kind === 'plan') { const p = planOf(rec.ref); if (p) { p.asset = assetId; p.local = false; Sync.mark('meta'); } }
    if (rec.kind === 'audio') { const n = vnoteById(rec.ref); if (n) { n.asset = assetId; n.local = false; Sync.mark('plan:' + n.planId); if (S.sel && S.sel.id === n.id) { const m = $('#vnMeta'); if (m) m.textContent = vnMeta(n); } } }
  } else patchClosedDoc(rec, assetId);
}
async function patchClosedDoc(rec, assetId) {
  const all = await IDB.all('docs');
  for (const d of all) {
    if (d.sid !== rec.sid) continue;
    let ch = false;
    if (rec.kind === 'photo' && d.data.type === 'photo' && d.data.id === rec.ref) { d.data.asset = assetId; d.data.local = false; ch = true; }
    if (rec.kind === 'plan' && d.data.type === 'survey') { const p = (d.data.plans || []).find(x => x.id === rec.ref); if (p) { p.asset = assetId; p.local = false; ch = true; } }
    if (rec.kind === 'audio' && d.data.type === 'plan') { const n = (d.data.vnotes || []).find(x => x.id === rec.ref); if (n) { n.asset = assetId; n.local = false; ch = true; } }
    if (ch) {
      d.dirty = true; await IDB.put('docs', d);
      if (CAP.db) { try { await CAP.db.doc(d.path).set(d.data); d.dirty = false; await IDB.put('docs', d); } catch (e) { } }
    }
  }
}
function blobUrl(localId, asset) {
  if (asset) return '/_blob/' + asset;
  return Uploads.localUrls.get(localId) || null;
}
async function getBlob(localId, asset) {
  const rec = await IDB.get('blobs', localId);
  if (rec) return rec.blob;
  if (asset) { const r = await fetch('/_blob/' + asset); if (!r.ok) throw new Error('foto non trovata'); return await r.blob(); }
  throw new Error('file non disponibile');
}
async function restoreLocalUrls() {
  const all = await IDB.all('blobs');
  all.forEach(b => { if (!Uploads.localUrls.has(b.id)) Uploads.localUrls.set(b.id, URL.createObjectURL(b.blob)); });
}

/* ============ UNDO ============ */
function pushUndo() {
  S.undo.push(JSON.stringify({ rooms: S.rooms, items: S.items, draws: S.draws, vnotes: S.vnotes }));
  if (S.undo.length > 40) S.undo.shift();
  $('#bUndo').disabled = false;
}
function doUndo() {
  const s = S.undo.pop(); if (!s) return;
  const o = JSON.parse(s);
  const keys = new Set();
  [...S.items, ...o.items].forEach(i => keys.add(i.photoId ? 'photo:' + i.photoId : 'plan:' + i.planId));
  [...S.rooms, ...o.rooms].forEach(r => keys.add('plan:' + r.planId));
  [...S.draws, ...(o.draws || []), ...S.vnotes, ...(o.vnotes || [])].forEach(d => keys.add('plan:' + d.planId));
  S.rooms = o.rooms; S.items = o.items; S.draws = o.draws || []; S.vnotes = o.vnotes || [];
  for (const ph of S.photos) if (ph.x != null) { const r = roomAt(ph.planId, ph.x, ph.y); const nid = r ? r.id : null; if (nid !== ph.roomId) { ph.roomId = nid; keys.add('photo:' + ph.id); } }
  if (S.sel && S.sel.t !== 'photo' && !(S.sel.t === 'item' ? itemById(S.sel.id) : S.sel.t === 'draw' ? drawById(S.sel.id) : S.sel.t === 'vnote' ? vnoteById(S.sel.id) : roomById(S.sel.id))) S.sel = null;
  Sync.mark(...keys); $('#bUndo').disabled = !S.undo.length; redraw(); renderPanel();
}
