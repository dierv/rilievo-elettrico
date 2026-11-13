/* ============ APP INSTALLATA SUL TABLET (PWA): archivio locale e accesso Google ============ */
// Copia persistente nel browser, archivio facoltativo su cartella e sincronizzazione
// privata per account gestita da pwa_cloud.js.
// L'AI usa la chiave API Anthropic dell'utente, salvata solo su questo tablet; la spesa si somma per sopralluogo.
// Configurazione pubblica dell'app Firebase; i dati sono protetti dalle regole per UID.
const FIREBASE_CONFIG = Object.freeze({
  apiKey: 'AIzaSyBzw4JrWepad4z7tewA1scNNEZ4gr7sxAs',
  authDomain: 'sopralux-64b29.firebaseapp.com',
  projectId: 'sopralux-64b29',
  storageBucket: 'sopralux-64b29.firebasestorage.app',
  messagingSenderId: '1009612427289',
  appId: '1:1009612427289:web:db0b2576422d42e28e5a88',
});
const KV = {
  get(k, d = null) { try { const v = localStorage.getItem('ril_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { if (v == null) localStorage.removeItem('ril_' + k); else localStorage.setItem('ril_' + k, JSON.stringify(v)); } catch (e) { } },
};

/* ---- AI con la chiave API ---- */
const API_MODELS = { quick: 'claude-haiku-5-5', default: 'claude-sonnet-5-5', complex: 'claude-opus-5-5' };
const API_PRICE = { // $ per milione di token: input, scrittura cache (5 min), lettura cache, output — listino ufficiale nov 2026
  'claude-opus-5-5': [4, 5, 0.2, 20], 'claude-sonnet-5-5': [2, 2.5, 0.1, 10], 'claude-haiku-5-5': [0.1, 0.125, 0.01, 0.5],
};
function usageCost(model, u) {
  const p = API_PRICE[model]; if (!p || !u) return 0;
  return ((u.input_tokens || 0) * p[0] + (u.cache_creation_input_tokens || 0) * p[1] + (u.cache_read_input_tokens || 0) * p[2] + (u.output_tokens || 0) * p[3]) / 1e6;
}
async function addSurveyCost(sid, usd) {
  const m = new Date().toISOString().slice(0, 7); const tot = KV.get('spesa', {}); tot.all = (tot.all || 0) + usd; tot[m] = (tot[m] || 0) + usd; KV.set('spesa', tot);
  if (!sid) return;
  const bump = c => { c = c || { usd: 0, calls: 0 }; c.usd = Math.round((c.usd + usd) * 1e5) / 1e5; c.calls = (c.calls || 0) + 1; return c; };
  if (S.sv && S.sv.id === sid) { S.sv.cost = bump(S.sv.cost); Sync.mark('meta'); return; }
  const d = await IDB.get('docs', base() + '/' + sid); if (!d || !d.data) return; // sopralluogo chiuso nel frattempo
  d.data.cost = bump(d.data.cost); d.dirty = true; await IDB.put('docs', d);
}
function parseLooseJson(t) {
  const s = String(t || '').trim(); const tries = [s, s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')];
  const a = s.indexOf('{'), b = s.lastIndexOf('}'); if (a >= 0 && b > a) tries.push(s.slice(a, b + 1));
  const a2 = s.indexOf('['), b2 = s.lastIndexOf(']'); if (a2 >= 0 && b2 > a2) tries.push(s.slice(a2, b2 + 1));
  for (const x of tries) { try { return JSON.parse(x); } catch (e) { } }
  throw { code: 'invalid_json' };
}
async function apiImage(blob) { // al massimo 2576 px e meno di 3,7 MB
  const ok = /^image\/(jpeg|png|webp|gif)$/.test(blob.type || '');
  let bm = null; try { bm = await createImageBitmap(blob); } catch (e) { }
  if (!bm || (ok && blob.size < 3.7e6 && Math.max(bm.width, bm.height) <= 2576)) return { media_type: ok ? blob.type : 'image/jpeg', data: await blobToB64(blob) };
  const k = Math.min(1, 2576 / Math.max(bm.width, bm.height)); const c = newCanvas(Math.round(bm.width * k), Math.round(bm.height * k), false); c.getContext('2d').drawImage(bm, 0, 0, c.width, c.height);
  let q = 0.88, out = await canvasToBlob(c, 'image/jpeg', q); while (out.size > 3.7e6 && q > 0.45) { q -= 0.1; out = await canvasToBlob(c, 'image/jpeg', q); }
  return { media_type: 'image/jpeg', data: await blobToB64(out) };
}
async function apiCall(prompt, opts, json) {
  const key = KV.get('apiKey'); if (!key) throw { code: 'no_key' };
  if (!navigator.onLine) throw { code: 'offline' };
  const model = API_MODELS[opts.modelTier] || API_MODELS.default; const sid = S.sv && S.sv.id;
  // regole e legenda sono uguali per ogni foto: vanno in cache e dalla seconda foto costano un decimo
  let system, text = prompt; const iC = prompt.indexOf('\nCONTESTO\n'), iT = prompt.indexOf('\nCOMPITO\n');
  if (iC > 0 && iT > iC && prompt.length - iT > 3000) { system = [{ type: 'text', text: prompt.slice(0, iC).trim() + '\n' + prompt.slice(iT), cache_control: { type: 'ephemeral' } }]; text = prompt.slice(iC + 1, iT).trim(); }
  const content = [];
  for (const im of opts.images || []) { const p = await apiImage(im); content.push({ type: 'image', source: { type: 'base64', media_type: p.media_type, data: p.data } }); }
  content.push({ type: 'text', text });
  const body = { model, max_tokens: json ? 16000 : 8000, messages: [{ role: 'user', content }] }; if (system) body.system = system;
  let r;
  try { r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', signal: opts.signal, headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' }, body: JSON.stringify(body) }); }
  catch (e) { if (e && e.name === 'AbortError') throw e; throw { code: navigator.onLine ? 'network' : 'offline' }; }
  if (!r.ok) {
    let msg = ''; try { const j = await r.json(); msg = (j.error && j.error.message) || ''; } catch (e) { }
    console.warn('API', r.status, msg);
    const code = apiErrCode(r.status, msg);
    if (['bad_key', 'credit', 'key_scope', 'cors_org'].includes(code)) { CAP.aiOff = true; AIQ.stop(); toast(AI_ERR[code], true, 9000); }
    throw { code, message: msg };
  }
  const j = await r.json(); const out = (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  await addSurveyCost(sid, usageCost(model, j.usage));
  if (opts.onText) { try { opts.onText({ text: out }); } catch (e) { } }
  return json ? parseLooseJson(out) : { text: out };
}
function apiErrCode(status, msg) {
  if (/not scoped to a workspace/i.test(msg)) return 'key_scope'; // chiave di tutta l'organizzazione: serve una chiave legata a un workspace
  if (/CORS requests are not allowed/i.test(msg)) return 'cors_org';
  if (status === 401 || status === 403) return 'bad_key';
  if (/credit balance|billing/i.test(msg) || status === 402) return 'credit';
  return status === 429 ? 'rate_limited' : status === 529 || status >= 500 ? 'overloaded' : status === 413 ? 'prompt_too_large' : 'api_' + status;
}
const ApiSample = Object.assign((prompt, opts) => apiCall(prompt, opts || {}, false), {
  json: (prompt, opts) => apiCall(prompt, opts || {}, true),
  limits: async () => ({ maxPromptBytes: 2e6, images: { maxCount: 5, maxInputBytes: 20e6, mediaTypes: ['image/jpeg', 'image/png', 'image/webp'] } }),
});
Object.assign(AI_ERR, {
  no_key: 'Manca la chiave API: inseriscila in Impostazioni.', bad_key: 'Chiave API non valida: controllala in Impostazioni.',
  credit: 'Credito API esaurito: ricaricalo su console.anthropic.com.', overloaded: 'Servizio AI sovraccarico: riprova tra poco.',
  network: 'Connessione all\'AI non riuscita: riprova.', offline: 'Sei offline: la foto verrà analizzata al ritorno della rete.',
  key_scope: 'Questa chiave vale per tutta l\'organizzazione: creane una legata al workspace "Default" (platform.claude.com → API keys) e incollala in Impostazioni.',
  cors_org: 'La tua organizzazione Anthropic non permette chiamate dal browser: usa una chiave di un account senza questa restrizione.',
});

/* ---- download: nella cartella dell'archivio se c'è, altrimenti nei Download ---- */
const LocalDL = {
  async save({ filename, data }) {
    const blob = data instanceof Blob ? data : new Blob([data]);
    if (Archive.ready()) { try { const p = await Archive.writeExport(filename, blob); toast('Salvato in ' + p, false, 5000); return { status: 'archived' }; } catch (e) { console.warn(e); } }
    if (!Archive.ok() && navigator.canShare) { // iPhone/iPad: niente cartelle, si salva con Condividi → «Salva su File»
      const file = new File([blob], filename, { type: blob.type || mimeOfName(filename) });
      let can = false; try { can = navigator.canShare({ files: [file] }); } catch (e) { }
      if (can) return shareSheet(file);
    }
    dlLink(blob, filename); return { status: 'saved' };
  },
};
function dlLink(blob, filename) { const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 60000); }
const mimeOfName = n => ({ zip: 'application/zip', json: 'application/json', csv: 'text/csv', png: 'image/png', jpg: 'image/jpeg', m4a: 'audio/mp4', mp4: 'audio/mp4', wav: 'audio/wav', ogg: 'audio/ogg', webm: 'audio/webm', mp3: 'audio/mpeg', txt: 'text/plain' })[(n.split('.').pop() || '').toLowerCase()] || 'application/octet-stream';
function shareSheet(file) { // il foglio di condivisione si apre solo da un tocco: prima mostro il file pronto
  return new Promise((res, rej) => {
    const kb = file.size > 1048576 ? (file.size / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(file.size / 1024)) + ' KB';
    const b = openModal(`<h3>File pronto</h3><div><b>${esc(file.name)}</b> <span class="mut small">${kb}</span></div>
      <div class="mut small" style="margin-top:6px">Tocca <b>Condividi</b> e scegli <b>«Salva su File»</b> (iCloud Drive o «Sul mio iPhone/iPad»), oppure mandalo per mail o a un'altra app.</div>
      <div class="acts"><button id="shNo">Chiudi</button><button id="shDl">Scarica</button><button class="pri" id="shGo">Condividi</button></div>`);
    b.querySelector('#shGo').onclick = async () => { try { await navigator.share({ files: [file], title: file.name }); closeModal(); res({ status: 'shared' }); } catch (e) { if (e && e.name === 'AbortError') return; closeModal(); dlLink(file, file.name); res({ status: 'saved' }); } };
    b.querySelector('#shDl').onclick = () => { closeModal(); dlLink(file, file.name); res({ status: 'saved' }); };
    b.querySelector('#shNo').onclick = () => { closeModal(); rej({ code: 'declined' }); };
  });
}
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
window.claude = { use: async n => n === 'sample' ? (KV.get('apiKey') ? ApiSample : null) : n === 'downloads' ? LocalDL : null };

/* ---- archivio su una cartella del tablet ---- */
async function fsDir(root, parts, create = true) { let d = root; for (const p of parts) d = await d.getDirectoryHandle(p, { create }); return d; }
async function fsWrite(root, path, data) {
  const parts = path.split('/'); const d = await fsDir(root, parts.slice(0, -1));
  const fh = await d.getFileHandle(parts[parts.length - 1], { create: true }); const w = await fh.createWritable(); await w.write(data); await w.close();
}
async function fsRead(root, path) { try { const parts = path.split('/'); const d = await fsDir(root, parts.slice(0, -1), false); return await (await d.getFileHandle(parts[parts.length - 1])).getFile(); } catch (e) { return null; } }
async function fsRemove(root, path) { try { const parts = path.split('/'); const d = await fsDir(root, parts.slice(0, -1), false); await d.removeEntry(parts[parts.length - 1]); } catch (e) { } }
const stamp = t => { const d = new Date(t || Date.now()); const p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`; };
async function snapshotFromIDB(sid) { // sopralluogo chiuso, letto dalla copia sul tablet
  const root = base() + '/' + sid; const docs = (await IDB.all('docs')).filter(d => d.data && (d.path === root || d.path.startsWith(root + '/')));
  const meta = docs.find(d => d.path === root); if (!meta) return null;
  const { type, stats, ...sv } = meta.data; const o = { app: 'rilievo-elettrico', v: 2, survey: sv, rooms: [], items: [], draws: [], vnotes: [], photos: [], closure: {} };
  for (const d of docs) {
    const x = d.data; if (d.path === root) continue;
    if (x.type === 'closure') { o.closure[x.id] = x; continue; }
    if (x.type === 'plan') { o.rooms.push(...(x.rooms || [])); o.items.push(...(x.items || [])); o.draws.push(...(x.draws || [])); o.vnotes.push(...(x.vnotes || [])); }
    if (x.type === 'photo') { const { items, type: t, ...ph } = x; o.photos.push(ph); o.items.push(...(items || [])); }
  }
  return o;
}
const ARCH_HELP = 'La cartella scelta non accetta i file. Se è su Google Drive o su un altro cloud, scegline una sul tablet (es. Documenti/Rilievi): Impostazioni → Cambia cartella. I dati restano comunque salvati nell\'app.';
const Archive = {
  root: null, perm: 'none', busy: false, again: false, timer: null, err: null, last: new Map(),
  ok: () => typeof window.showDirectoryPicker === 'function',
  ready() { return !!(this.root && this.perm === 'granted'); },
  async init() {
    const r = await IDB.get('docs', '__archivio'); if (!r || !r.handle) return;
    this.root = r.handle; try { this.perm = await this.root.queryPermission({ mode: 'readwrite' }); } catch (e) { this.perm = 'prompt'; }
  },
  async pick() {
    let h; try { h = await window.showDirectoryPicker({ id: 'rilievi', mode: 'readwrite', startIn: 'documents' }); }
    catch (e) { if (e && e.name !== 'AbortError') toast('Cartella non disponibile: ' + (e.message || e.name), true, 6000); return false; }
    this.root = h; this.perm = 'granted'; this.last.clear(); this.err = null; KV.set('archGen', uid('g')); await this.saveHandle(h); // cartella nuova: si riscrive tutto
    toast('Archivio nella cartella "' + h.name + '": salvo i sopralluoghi…', false, 5000); await this.syncAll(); return true;
  },
  async saveHandle(h) { try { await IDB.put('docs', { path: '__archivio', handle: h }); } catch (e) { console.warn('cartella non memorizzata', e); } },
  async regrant(quiet) { // Chrome su Android toglie il permesso quando l'app si chiude: va richiesto con un tocco
    if (!this.root) return quiet ? false : this.pick();
    try { this.perm = await this.root.requestPermission({ mode: 'readwrite' }); } catch (e) { this.perm = 'prompt'; }
    if (this.perm === 'granted') { this.err = null; setTimeout(() => this.syncAll(), 1200); } // copia tutto quello fatto nel frattempo
    else if (!quiet) toast('Accesso alla cartella non concesso: i dati restano nell\'app', true, 5000);
    syncBadge(); if (!$('#home').classList.contains('hide')) renderHome(); return this.perm === 'granted';
  },
  async recheck() { // tornando all'app: il permesso potrebbe essere scaduto
    if (!this.root) return; let p = this.perm; try { p = await this.root.queryPermission({ mode: 'readwrite' }); } catch (e) { }
    if (p !== this.perm) { this.perm = p; syncBadge(); if (!$('#home').classList.contains('hide')) renderHome(); }
  },
  kick(now) { if (!this.ready()) return; clearTimeout(this.timer); this.timer = setTimeout(() => this.sync(), now ? 50 : 4000); },
  async sync() {
    if (!this.ready() || !S.sv) return; if (this.busy) { this.again = true; return; }
    this.busy = true; syncBadge();
    try { const ch = await this.writeSurvey(surveySnapshot(), S.sv); if (ch) Sync.mark('meta'); this.err = null; }
    catch (e) { await this.fail(e); }
    this.busy = false; syncBadge(); if (this.again) { this.again = false; this.kick(); }
  },
  async syncAll() { // tutti i sopralluoghi del tablet, anche quelli chiusi
    if (!this.ready()) return 0; let n = 0;
    if (S.sv) { await this.sync(); n++; } // quello aperto (anche se non è ancora nell'elenco)
    for (const s of S.surveys) {
      try {
        if (S.sv && S.sv.id === s.id) continue;
        const snap = await snapshotFromIDB(s.id); if (!snap) continue;
        const ch = await this.writeSurvey(snap, snap.survey); n++;
        if (ch) { const d = await IDB.get('docs', base() + '/' + s.id); if (d) { d.data.dir = snap.survey.dir; d.data.arch = snap.survey.arch; d.data.archGen = snap.survey.archGen; await IDB.put('docs', d); } }
      } catch (e) { await this.fail(e); }
    }
    syncBadge(); return n;
  },
  async fail(e) {
    console.warn('archivio', e);
    if (e && (e.name === 'NotAllowedError' || e.name === 'SecurityError')) { // permesso scaduto, o cartella che non accetta scritture?
      let p = 'prompt'; try { p = await this.root.queryPermission({ mode: 'readwrite' }); } catch (x) { }
      if (p !== 'granted') { this.perm = p; return; }
    }
    const first = !this.err; this.err = `${(e && e.name) || 'Errore'}${e && e.message ? ': ' + e.message : ''}`;
    if (first) toast(ARCH_HELP, true, 9000);
  },
  async writeSurvey(snap, sv) { // scrive cartella, file nuovi e rilievo.json; restituisce true se ha cambiato la mappa dei file
    let changed = false; const gen = KV.get('archGen', 'g0');
    if (sv.archGen !== gen) { sv.arch = {}; sv.archGen = gen; changed = true; } // la mappa dei file vale solo per la cartella in cui sono stati scritti
    if (!sv.dir) { sv.dir = `${safeName(sv.name)}_${sv.id.slice(-5)}`; changed = true; }
    const arch = sv.arch || (sv.arch = {}); const dir = await fsDir(this.root, [sv.dir]);
    const rn = id => (snap.rooms.find(r => r.id === id) || {}).name || 'Esterni';
    const want = new Map(); // chiave -> { nome file, versione, kind, ref }
    for (const P of sv.plans || []) want.set('plan_' + P.id, { f: `piante/${safeName(P.name)}_${P.id.slice(-4)}`, v: 1, def: 'png' });
    for (const p of snap.photos) want.set('photo_' + p.id, { f: `foto/${stamp(p.t)}_${safeName(rn(p.roomId))}_${p.kind}_${p.id.slice(-3)}`, v: 1, def: 'jpg' });
    for (const n of snap.vnotes) if (n.mime) want.set('audio_' + n.id, { f: `audio/N${String(n.num).padStart(2, '0')}_${safeName(rn(n.roomId))}`, v: n.tu || n.t, def: n.ext || 'm4a' });
    for (const [key, w] of want) {
      const a = arch[key]; if (a && a.v === w.v) continue;
      const rec = await IDB.get('blobs', key); if (!rec || !rec.blob) continue; // file non (ancora) su questo tablet
      const name = a && a.f ? a.f : `${w.f}.${key.startsWith('audio_') ? w.def : extOfBlob(rec.blob, w.def)}`;
      await fsWrite(dir, name, rec.blob); arch[key] = { f: name, v: w.v }; changed = true;
    }
    for (const key of Object.keys(arch)) if (!want.has(key)) { await fsRemove(dir, arch[key].f); delete arch[key]; changed = true; } // eliminati nell'app
    snap.files = Object.fromEntries(Object.entries(arch).map(([k, a]) => [k, a.f]));
    const { saved, ...stable } = snap; const js = JSON.stringify(stable, null, 1);
    if (this.last.get(sv.id) !== js) { await fsWrite(dir, 'rilievo.json', js); this.last.set(sv.id, js); }
    return changed;
  },
  async writeExport(filename, blob) {
    const sub = S.sv ? [S.sv.dir || `${safeName(S.sv.name)}_${S.sv.id.slice(-5)}`, 'esportazioni'] : ['esportazioni'];
    await fsWrite(this.root, sub.concat([filename]).join('/'), blob); return this.root.name + '/' + sub.join('/');
  },
  async listFolder() { // sopralluoghi presenti nella cartella
    const out = [];
    for await (const [name, h] of this.root.entries()) {
      if (h.kind !== 'directory') continue;
      const f = await fsRead(h, 'rilievo.json'); if (!f) continue;
      try { const d = JSON.parse(await f.text()); if (d.app === 'rilievo-elettrico' && d.survey) out.push({ name, h, d }); } catch (e) { }
    }
    return out;
  },
};
async function recoverFromFolder() {
  if (!Archive.ready() && !await Archive.regrant()) return;
  toast('Leggo la cartella…'); let list;
  try { list = await Archive.listFolder(); } catch (e) { toast('Cartella non leggibile: ' + (e.message || e), true); return; }
  if (!list.length) { toast('Nella cartella non ci sono sopralluoghi salvati dall\'app', true, 5000); return; }
  const b = openModal(`<h3>Sopralluoghi nella cartella "${esc(Archive.root.name)}"</h3><div class="dlist">${list.map((x, i) => { const here = S.surveys.find(s => s.id === x.d.survey.id); return `<div class="drow" data-i="${i}"><div class="g"><div><b>${esc(x.d.survey.name)}</b></div><div class="mut small">${esc(x.name)} • ${(x.d.photos || []).length} foto • ${here ? 'già su questo tablet' : 'non presente su questo tablet'}</div></div><button class="sm${here ? '' : ' pri'}" style="flex:none">${here ? 'Aggiorna' : 'Importa'}</button></div>`; }).join('')}</div><div class="acts"><button onclick="closeModal()">Chiudi</button></div>`);
  b.querySelectorAll('[data-i]').forEach(r => r.onclick = async () => {
    const x = list[+r.dataset.i]; closeModal();
    const files = x.d.files || {};
    try { await importSnapshot(x.d, async key => files[key] ? await fsRead(x.h, files[key]) : null, { mode: S.surveys.some(s => s.id === x.d.survey.id) ? 'replace' : undefined }); }
    catch (e) { console.error(e); toast('Import non riuscito: ' + (e.message || e), true, 6000); }
  });
}

/* ---- interfaccia ---- */
const appVersionText = () => { const m = /^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})/.exec(typeof APP_VERSION === 'string' ? APP_VERSION : ''); return m ? `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}` : ''; };
function updateBar() { // nuova versione già scaricata: un tocco e si ricarica (prima si salva tutto)
  if ($('#updBar')) return;
  const d = document.createElement('div'); d.id = 'updBar';
  d.innerHTML = '<span>È pronta una nuova versione dell\'app.</span><button class="sm pri" id="updGo">Aggiorna ora</button><button class="sm" id="updLater">Dopo</button>';
  document.body.appendChild(d);
  $('#updGo').onclick = async () => { $('#updGo').disabled = true; try { await Sync.flush(); } catch (e) { /* si ricarica comunque: i dati sono già sul dispositivo */ } location.reload(); };
  $('#updLater').onclick = () => d.remove();
}
let installEvt = null; const hadCtl = !!(navigator.serviceWorker && navigator.serviceWorker.controller);
const isInstalled = () => matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true;
function pwaHomeBanners() {
  const b = [FirebaseAccount.html()];
  if (!isInstalled()) b.push(`<div class="banner">📲 Per usarla anche offline installala: ${installEvt ? '<button class="sm pri" id="pwInst">Installa app</button>' : isIOS() ? 'in Safari tocca <b>Condividi</b> → <b>«Aggiungi alla schermata Home»</b>' : 'menu ⋮ di Chrome → <b>Installa app</b> (o "Aggiungi a schermata Home")'}.</div>`);
  if (!Archive.ok()) b.push(`<div class="banner warn">📁 ${isIOS() ? 'Su iPhone e iPad il browser non permette di salvare in una cartella' : 'Questo browser non permette di salvare in una cartella'}: i dati restano nell'app, anche offline. Per avere i file: <b>Computo → Backup completo</b> → <b>Condividi</b> → «Salva su File». Per riprenderli: «Importa backup».${isIOS() ? ' <b>Attenzione:</b> se togli l\'icona dalla Home, iOS cancella anche i dati dell\'app: fai prima il backup.' : ''}</div>`);
  else if (!Archive.root) b.push(`<div class="banner warn">📁 Scegli la cartella dove salvare dati, piante, foto e audio: una cartella <b>sul tablet</b> (es. Documenti/Rilievi), non su Drive. <button class="sm pri" id="pwPick">Scegli cartella</button></div>`);
  else if (!Archive.ready()) b.push(`<div class="banner warn">📁 Cartella "${esc(Archive.root.name)}" da riattivare: si riattiva aprendo un sopralluogo (tocca "Consenti"), oppure <button class="sm pri" id="pwRegrant">Riattiva ora</button>. Nel frattempo i dati restano nell'app.</div>`);
  else b.push(`<div class="banner">📁 Archivio: cartella "<b>${esc(Archive.root.name)}</b>" ✓ <button class="sm" id="pwRecover">Recupera dalla cartella</button></div>`);
  if (!CAP.sample) b.push(aiAvailHtml());
  const sp = KV.get('spesa', {}); const m = new Date().toISOString().slice(0, 7); if (sp[m]) b.push(`<div class="mut small">✦ Spesa AI di questo mese su questo tablet: ${fmtUsd(sp[m])}</div>`);
  if (appVersionText()) b.push(`<div class="mut small" id="appVer">Versione dell'app: ${appVersionText()}</div>`);
  return b;
}
function pwaHomeWire() {
  FirebaseAccount.wire();
  const on = (id, f) => { const e = $('#' + id); if (e) e.onclick = f; };
  on('pwInst', async () => { if (!installEvt) return; installEvt.prompt(); try { await installEvt.userChoice; } catch (e) { } installEvt = null; renderHome(); });
  on('pwPick', async () => { if (await Archive.pick()) renderHome(); });
  on('pwRegrant', async () => { await Archive.regrant(); renderHome(); });
  on('pwRecover', recoverFromFolder);
}
function pwaBadge(b) {
  if (Archive.root && !Archive.ready()) { b.className = 'chip warn'; b.textContent = 'Cartella: tocca per riattivare'; b.onclick = () => Archive.regrant(); return; }
  b.onclick = null;
  if (Archive.err) { b.className = 'chip bad'; b.textContent = 'Errore cartella'; b.title = Archive.err; b.onclick = () => toast(ARCH_HELP + ' (' + Archive.err + ')', true, 12000); return; }
  if (Sync.pending() || Sync.busy || Archive.busy) { b.className = 'chip grey'; b.textContent = 'Salvataggio…'; return; }
  b.className = 'chip ok'; b.textContent = Archive.ready() ? 'Salvato ✓ tablet + cartella' : 'Salvato sul tablet ✓';
}
function pwaSettingsHtml() {
  const k = KV.get('apiKey'); const sp = KV.get('spesa', {}); const m = new Date().toISOString().slice(0, 7);
  return `<label class="f">Chiave API Anthropic (per il riconoscimento AI)</label>
    <div class="row"><input id="tKey" type="password" autocomplete="off" placeholder="sk-ant-…" value="${k ? '••••••••' + esc(k.slice(-4)) : ''}"><button id="tKeyTest" style="flex:none">Prova</button></div>
    <div class="mut small">Resta solo su questo tablet. Si crea su platform.claude.com → API keys, scegliendo il workspace "Default" (serve credito prepagato). Spesa AI su questo tablet: ${fmtUsd(sp[m] || 0)} questo mese, ${fmtUsd(sp.all || 0)} in tutto.</div>
    <label class="f">Archivio su cartella</label>
    <div class="row wrap">${Archive.ok() ? `<span class="small" style="flex:1">${Archive.root ? `Cartella "<b>${esc(Archive.root.name)}</b>"${Archive.err ? ' <span style="color:var(--bad)">– errore: ' + esc(Archive.err) + '</span>' : Archive.ready() ? ' ✓' : ' (in pausa)'}` : 'Nessuna cartella scelta'}</span><button class="sm" id="tArch" style="flex:none">${Archive.root ? 'Cambia cartella' : 'Scegli cartella'}</button>${Archive.root ? '<button class="sm" id="tArchAll" style="flex:none">Salva tutto ora</button><button class="sm" id="tArchRec" style="flex:none">Recupera dalla cartella</button>' : ''}` : '<span class="mut small">Non disponibile in questo browser: usa "Backup completo".</span>'}</div>`;
}
function pwaSettingsWire(b) {
  const q = s => b.querySelector(s);
  q('#tKey').onfocus = e => { if (e.target.value.startsWith('••')) e.target.value = ''; };
  q('#tKeyTest').onclick = async e => {
    const v = q('#tKey').value.trim(); const key = v && !v.startsWith('••') ? v : KV.get('apiKey'); if (!key) { toast('Scrivi prima la chiave', true); return; }
    e.target.disabled = true; e.target.textContent = 'Provo…';
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' }, body: JSON.stringify({ model: API_MODELS.quick, max_tokens: 5, messages: [{ role: 'user', content: 'Rispondi solo: OK' }] }) });
      if (r.ok) { const j = await r.json(); await addSurveyCost(null, usageCost(API_MODELS.quick, j.usage)); toast('Chiave valida ✓'); }
      else { let m = ''; try { m = (await r.json()).error.message; } catch (x) { } const c = apiErrCode(r.status, m); toast(c === 'bad_key' ? 'Chiave non valida' : c === 'credit' ? 'Chiave valida ma senza credito' : AI_ERR[c] || 'Errore ' + r.status + ': ' + m, true, 9000); }
    } catch (x) { toast('Nessuna connessione', true); }
    e.target.disabled = false; e.target.textContent = 'Prova';
  };
  const on = (id, f) => { const e = q(id); if (e) e.onclick = f; };
  on('#tArch', async () => { closeModal(); if (await Archive.pick()) { syncBadge(); if (!$('#home').classList.contains('hide')) renderHome(); } });
  on('#tArchAll', async () => { closeModal(); if (!Archive.ready() && !await Archive.regrant()) return; const n = await Archive.syncAll(); toast(`Salvati ${n} sopralluoghi nella cartella`); });
  on('#tArchRec', () => { closeModal(); recoverFromFolder(); });
}
async function pwaSettingsSave(b) {
  const v = b.querySelector('#tKey').value.trim();
  if (v.startsWith('••')) return; // invariata
  KV.set('apiKey', v || null); CAP.aiOff = false; await initCaps();
  if (S.sv) { renderPanel(); aiBadge(); } else renderHome();
  toast(v ? 'Chiave API salvata su questo tablet' : 'Chiave API rimossa: AI spenta');
}
async function pwaBoot() {
  FirebaseAccount.init();
  try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) { }
  await Archive.init();
  const mark = Sync.mark; Sync.mark = function (...k) { mark.apply(this, k); Archive.kick(); }; // dopo ogni modifica, anche nella cartella
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (!$('#home').classList.contains('hide')) renderHome(); });
  window.addEventListener('appinstalled', () => { installEvt = null; toast('App installata: la trovi tra le app del tablet'); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) Archive.recheck(); });
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || /^(localhost|127\.0\.0\.1)$/.test(location.hostname))) {
    let reg = null; try { reg = await navigator.serviceWorker.register('sw.js'); } catch (e) { console.warn('sw', e); }
    // l'app installata spesso non si riapre da capo (resta in memoria): la nuova versione si cerca anche quando torna in primo piano e ogni 15 minuti
    const check = () => { if (reg && navigator.onLine !== false) reg.update().catch(() => {}); };
    document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
    setInterval(check, 15 * 60 * 1000);
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadCtl) updateBar(); });
  }
}
