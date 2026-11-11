/* ============ ELENCO SOPRALLUOGHI ============ */
async function loadLib() {
  const path = base() + '/lib'; let d = null;
  if (CAP.db) { try { const s = await withTimeout(CAP.db.doc(path).get()); if (s.exists) d = s.data(); } catch (e) { } }
  const loc = await IDB.get('docs', path); if (loc && (!d || loc.dirty)) d = loc.data;
  if (d) {
    if (Array.isArray(d.symbols) && d.symbols.length) S.lib.symbols = JSON.parse(JSON.stringify(d.symbols));
    S.lib.settings = { ...DEFAULT_SETTINGS, ...(d.settings || {}) }; S.lib.legV = d.legV || 0;
    Sync.last.set(path, JSON.stringify(buildDoc('lib')));
    if (loc && loc.dirty) Sync.mark('lib');
  }
  if ((S.lib.legV || 0) < LEGENDA.v) upgradeLib();
  symsChanged();
}
function upgradeLib() { // la libreria diventa la legenda dell'utente; restano i simboli che si era creato
  const old = new Set(OLD_SYMBOLS.map(s => s.code)); const leg = new Set(DEFAULT_SYMBOLS.map(s => s.code));
  const mine = (S.lib.symbols || []).filter(s => !old.has(s.code) && !leg.has(s.code) && !s.leg);
  S.lib.symbols = DEFAULT_SYMBOLS.map(s => ({ ...s })).concat(mine); S.lib.legV = LEGENDA.v; Sync.mark('lib');
}
async function loadSurveyList() {
  let list = []; let remoteOk = !CAP.db;
  if (CAP.db) { try { const snap = await withTimeout(CAP.db.collection(base()).get(), 12000); list = snap.docs.map(d => d.data()).filter(d => d && d.type === 'survey'); remoteOk = true; } catch (e) { } }
  const pre = base() + '/';
  for (const d of await IDB.all('docs')) {
    if (!d.data || d.data.type !== 'survey' || !d.path.startsWith(pre) || d.path.split('/').length !== 4) continue;
    const ex = list.find(s => s.id === d.data.id);
    if (!ex) { if (d.dirty || !CAP.db || !remoteOk) list.push(d.data); }
    else if (d.dirty && (d.data.updated || 0) > (ex.updated || 0)) Object.assign(ex, d.data);
  }
  S.surveys = list.sort((a, b) => (b.updated || 0) - (a.updated || 0));
  S.remoteOk = remoteOk;
}
function renderHome() {
  $('#home').classList.remove('hide'); $('#sv').classList.add('hide');
  const ban = [];
  if (PLATFORM === 'pwa') ban.push(...pwaHomeBanners());
  else if (!CAP.db) ban.push(`<div class="banner warn">Archivio online non disponibile in questa vista: i sopralluoghi restano solo in questo browser. Apri l'app da Claude per salvarli sul tuo account.</div>`);
  else if (!S.remoteOk) ban.push(`<div class="banner warn">Sei offline: vedi la copia salvata su questo tablet. Le modifiche verranno sincronizzate al ritorno della rete.</div>`);
  if (CAP.db && !canAI()) ban.push(aiAvailHtml());
  $('#hBanner').innerHTML = ban.join(''); if (PLATFORM === 'pwa') pwaHomeWire();
  const L = $('#hList');
  if (!S.surveys.length) { L.innerHTML = `<div class="card" style="grid-column:1/-1"><b>Nessun sopralluogo.</b><div class="mut small" style="margin-top:4px">Crea il primo con "+ Nuovo sopralluogo", carica la planimetria (PDF, DXF o foto) e inizia dal primo locale.</div><button style="margin-top:10px" id="hImp">Importa un backup (ZIP o JSON)</button></div>`; $('#hImp').onclick = () => $('#fJson').click(); return; }
  L.innerHTML = S.surveys.map(s => { const st = s.stats || {}; return `<div class="card scard" data-id="${esc(s.id)}"><div class="row"><h3 style="flex:1">${esc(s.name)}</h3><button class="sm ghost" data-del="${esc(s.id)}" style="flex:none" title="Elimina">Elimina</button></div>
    <div class="mut small">${esc([s.client, s.address].filter(Boolean).join(' • ') || '—')}</div>
    <div class="row wrap" style="gap:5px">${s.kind ? `<span class="chip grey">${esc(s.kind)}</span>` : ''}<span class="chip grey">${st.plans || (s.plans || []).length} tavole</span>${s.closed ? `<span class="chip ok">Chiuso il ${fmtDate(s.closed)}</span>` : ''}<span class="chip grey">${st.done || 0}/${st.rooms || 0} locali</span><span class="chip grey">${st.items || 0} elementi</span><span class="chip grey">${st.photos || 0} foto</span>${s.cost && s.cost.calls ? `<span class="chip ai">✦ AI ${fmtUsd(s.cost.usd)}</span>` : ''}${PLATFORM === 'pwa' && !Archive.ready() ? (s.lastBackup ? `<span class="chip grey">Backup ${fmtDate(s.lastBackup)}</span>` : '<span class="chip warn">Backup: mai</span>') : ''}</div>
    <div class="mut small">Aggiornato ${fmtDate(s.updated || s.created)}</div></div>`; }).join('') + `<div class="card" style="display:flex;align-items:center;justify-content:center"><button id="hImp">Importa backup (ZIP o JSON)</button></div>`;
  L.querySelectorAll('.scard').forEach(c => c.onclick = e => { if (e.target.closest('[data-del]')) return; if (PLATFORM === 'pwa' && Archive.root && !Archive.ready()) Archive.regrant(true); openSurvey(c.dataset.id); });
  L.querySelectorAll('[data-del]').forEach(b => b.onclick = () => deleteSurvey(b.dataset.del));
  $('#hImp').onclick = () => $('#fJson').click();
}
const SV_KINDS = ['Appartamento', 'Villa / casa', 'Capannone', 'Negozio / attività commerciale', 'Ufficio', 'Condominio – parti comuni', 'Altro'];
function surveyForm(sv, onOk) {
  const b = openModal(`<h3>${sv ? 'Dati sopralluogo' : 'Nuovo sopralluogo'}</h3>
    <label class="f">Nome</label><input id="nN" value="${esc(sv?.name || '')}" placeholder="es. Capannone Rossi – via Milano">
    <div class="row"><div><label class="f">Cliente</label><input id="nC" value="${esc(sv?.client || '')}"></div><div><label class="f">Tipo</label><select id="nK">${SV_KINDS.map(k => `<option${sv?.kind === k ? ' selected' : ''}>${k}</option>`).join('')}</select></div></div>
    <label class="f">Indirizzo</label><input id="nA" value="${esc(sv?.address || '')}">
    <div class="acts"><button onclick="closeModal()">Annulla</button><button class="pri" id="nOk">${sv ? 'Salva' : 'Crea'}</button></div>`);
  setTimeout(() => b.querySelector('#nN')?.focus(), 50);
  b.querySelector('#nOk').onclick = () => { const name = b.querySelector('#nN').value.trim(); if (!name) { toast('Dai un nome al sopralluogo', true); return; } const f = { name, client: b.querySelector('#nC').value.trim(), address: b.querySelector('#nA').value.trim(), kind: b.querySelector('#nK').value }; closeModal(); onOk(f); };
}
function newSurvey() {
  surveyForm(null, f => {
    S.sv = { id: uid('s'), ...f, created: Date.now(), updated: Date.now(), plans: [], legV: LEGENDA.v };
    S.rooms = []; S.items = []; S.photos = []; S.draws = []; S.vnotes = []; S.closure = {}; S.showClosure = false; S.planId = null; S.sel = null; S.undo = [];
    Sync.mark('meta'); showSurvey();
    setTimeout(() => addPlanMenu(), 150);
  });
}
async function deleteSurvey(id) {
  const s = S.surveys.find(x => x.id === id); if (!s) return;
  if (!await askConfirm(`Eliminare definitivamente "${s.name}" con tavole e foto?`, 'Elimina', true)) return;
  const p = base() + '/' + id; toast('Elimino…');
  const assets = (s.plans || []).map(pl => pl.asset).filter(Boolean);
  if (CAP.db) {
    try {
      for (const col of ['plans', 'photos', 'closure']) { const snap = await CAP.db.doc(p).collection(col).get(); for (const d of snap.docs) { const dd = d.data(); if (dd && dd.asset) assets.push(dd.asset); if (dd && dd.vnotes) dd.vnotes.forEach(n => n.asset && assets.push(n.asset)); await CAP.db.doc(p + '/' + col + '/' + d.id).delete(); } }
      await CAP.db.doc(p).delete();
    } catch (e) { toast('Eliminazione non completata (sei offline?)', true); return; }
  }
  if (CAP.assets) for (const a of assets) { try { await CAP.assets.delete(a); } catch (e) { } }
  for (const d of await IDB.all('docs')) if (d.path === p || d.path.startsWith(p + '/')) await IDB.del('docs', d.path);
  for (const b of await IDB.all('blobs')) if (b.sid === id) await IDB.del('blobs', b.id);
  [...Sync.last.keys()].forEach(k => { if (k === p || k.startsWith(p + '/')) Sync.last.delete(k); });
  S.surveys = S.surveys.filter(x => x.id !== id); renderHome();
}
function keyFromPath(path, root) {
  const rest = path.slice(root.length); if (!rest) return 'meta';
  const m = rest.match(/^\/(plans|photos|closure)\/(.+)$/); return m ? ({ plans: 'plan:', photos: 'photo:', closure: 'closure:' })[m[1]] + m[2] : null;
}
async function openSurvey(id) {
  $('#hList').innerHTML = '<div class="mut">Apro il sopralluogo…</div>';
  const root = base() + '/' + id; const docs = new Map(); let remote = false;
  if (CAP.db) {
    try {
      const m = await withTimeout(CAP.db.doc(root).get(), 12000);
      if (m.exists) docs.set(root, m.data());
      for (const col of ['plans', 'photos', 'closure']) { const snap = await withTimeout(CAP.db.doc(root).collection(col).get(), 15000); snap.docs.forEach(d => docs.set(root + '/' + col + '/' + d.id, d.data())); }
      remote = true;
    } catch (e) { toast('Offline: apro la copia salvata su questo tablet', true, 5000); }
  }
  const dirtyKeys = [];
  for (const d of await IDB.all('docs')) {
    if (d.path !== root && !d.path.startsWith(root + '/')) continue;
    if ((!remote && !docs.has(d.path)) || d.dirty) { docs.set(d.path, d.data); if (d.dirty) dirtyKeys.push(keyFromPath(d.path, root)); }
  }
  const meta = docs.get(root); if (!meta) { toast('Sopralluogo non trovato', true); renderHome(); return; }
  const { type, stats, ...sv } = meta; S.sv = JSON.parse(JSON.stringify(sv)); S.sv.plans = S.sv.plans || [];
  S.rooms = []; S.items = []; S.photos = []; S.draws = []; S.vnotes = []; S.sel = null; S.undo = []; S.planImg = {}; S.closure = {}; S.showClosure = false;
  for (const [path, d] of docs) {
    if (path === root || !d) continue;
    if (d.type === 'closure') { S.closure[d.id] = d; continue; }
    if (d.type === 'plan') { S.rooms.push(...(d.rooms || [])); S.items.push(...(d.items || [])); S.draws.push(...(d.draws || [])); S.vnotes.push(...(d.vnotes || [])); }
    if (d.type === 'photo') { const { items, type: t, ...ph } = d; if (ph.aiSt === 'queued' || ph.aiSt === 'run') ph.aiSt = 'none'; S.photos.push(ph); S.items.push(...(items || [])); }
  }
  S.rooms = JSON.parse(JSON.stringify(S.rooms)); S.items = JSON.parse(JSON.stringify(S.items)); S.photos = JSON.parse(JSON.stringify(S.photos)); S.draws = JSON.parse(JSON.stringify(S.draws)); S.vnotes = JSON.parse(JSON.stringify(S.vnotes));
  Sync.last.clear();
  if (remote) { for (const [path] of docs) { const k = keyFromPath(path, root); if (k && k !== 'meta') { const bd = buildDoc(k); if (bd) Sync.last.set(path, JSON.stringify(bd)); } } }
  S.planId = S.sv.plans.length ? S.sv.plans[0].id : null; S.view.r = 0; if (typeof Compass !== 'undefined' && Compass.on) Compass.stop();
  migrateLegend(); migrateSurvey();
  showSurvey();
  if (dirtyKeys.length || !remote) Sync.mark(...dirtyKeys.filter(Boolean));
}
function migrateLegend() { // sopralluoghi fatti con i vecchi simboli generici: passano ai simboli della legenda
  if ((S.sv.legV || 0) >= LEGENDA.v) return;
  const has = c => S.lib.symbols.some(s => s.code === c); const map = c => (OLD2LEG[c] && has(OLD2LEG[c])) ? OLD2LEG[c] : c;
  S.items.forEach(it => { const n = map(it.s); if (n !== it.s) { if (OLD_TAG[it.s] && !it.tag) it.tag = OLD_TAG[it.s]; it.s = n; Sync.markItem(it); } });
  S.photos.forEach(ph => { let ch = false; (ph.ai && ph.ai.dets || []).forEach(d => { const n = map(d.code); if (n !== d.code) { if (OLD_TAG[d.code] && !d.tag) d.tag = OLD_TAG[d.code]; d.code = n; ch = true; } }); if (ch) Sync.mark('photo:' + ph.id); });
  S.sv.legV = LEGENDA.v; Sync.mark('meta');
}
function migrateSurvey() { // sopralluoghi fatti con la versione precedente: via le rilevazioni spurie, oggetti ricalcolati sulle pareti
  for (const P of S.sv.plans) {
    if (P.projV === 2) continue;
    for (const ph of S.photos.filter(p => p.planId === P.id)) {
      if (ph.x != null) { const r = roomAt(P.id, ph.x, ph.y); ph.roomId = r ? r.id : null; }
      if (ph.ai && ph.ai.dets) {
        S.items = S.items.filter(i => !(i.photoId === ph.id && !i.ok && !i.lk && junkDet(ph.ai.dets[i.d])));
        reprojectPhoto(ph);
      }
      Sync.mark('photo:' + ph.id);
    }
    P.projV = 2; Sync.mark('meta');
  }
}
function showSurvey() {
  $('#home').classList.add('hide'); $('#sv').classList.remove('hide');
  $('#svTitle').textContent = S.sv.name; $('#bUndo').disabled = !S.undo.length;
  S.tool = 'sel'; S.tmp = {}; renderTools(); renderPlanSel(); renderPalette(); renderPanel(); syncBadge(); aiBadge();
  if (S.planId) switchPlan(S.planId); else redraw();
}
function renderPlanSel() {
  const s = $('#planSel'); s.innerHTML = S.sv.plans.map(p => `<option value="${p.id}"${p.id === S.planId ? ' selected' : ''}>${esc(p.name)}</option>`).join('') || '<option>— nessuna tavola —</option>';
  s.disabled = !S.sv.plans.length;
}
async function switchPlan(id) {
  S.planId = id; S.sel = null; S.tmp = {}; Object.keys(S.planImg).forEach(k => { if (k !== id) delete S.planImg[k]; }); renderPlanSel(); renderPanel(); redraw();
  try { await loadPlanImage(id); fitView(); updateHint(); }
  catch (e) { toast('Planimetria non disponibile: ' + (e.message || e), true, 6000); }
}
function openMenu() {
  const P = curPlan(); const pend = S.photos.filter(p => (p.aiSt === 'none' || p.aiSt === 'err') && p.kind !== 'dettaglio').length;
  const b = openModal(`<h3>Menu</h3><div class="dlist">
    <div class="drow" data-m="info"><div class="g">Dati sopralluogo (nome, cliente, indirizzo)</div></div>
    ${P ? `<div class="drow" data-m="ren"><div class="g">Rinomina tavola "${esc(P.name)}"</div></div>` : ''}
    ${P ? `<div class="drow" data-m="cal"><div class="g">Ricalibra la scala della tavola</div></div>` : ''}
    ${pend && canAI() ? `<div class="drow" data-m="aiAll" style="color:var(--ai)"><div class="g">Analizza con AI le ${pend} foto in attesa</div></div>` : ''}
    <div class="drow" data-m="lib"><div class="g">Libreria simboli</div></div>
    <div class="drow" data-m="set"><div class="g">Impostazioni</div></div>
    ${P ? `<div class="drow" data-m="delP" style="color:var(--bad)"><div class="g">Elimina tavola "${esc(P.name)}"</div></div>` : ''}
    <div class="drow" data-m="home"><div class="g">Torna all'elenco sopralluoghi</div></div></div>
    <div class="acts"><button onclick="closeModal()">Chiudi</button></div>`);
  b.querySelectorAll('[data-m]').forEach(r => r.onclick = async () => {
    const m = r.dataset.m; closeModal();
    if (m === 'info') surveyForm(S.sv, f => { Object.assign(S.sv, f); $('#svTitle').textContent = S.sv.name; Sync.mark('meta'); });
    if (m === 'ren') { const n = await askText('Rinomina tavola', 'Nome', P.name); if (n) { P.name = n; Sync.mark('meta'); renderPlanSel(); renderPanel(); } }
    if (m === 'cal') setTool('cal');
    if (m === 'aiAll') S.photos.filter(p => (p.aiSt === 'none' || p.aiSt === 'err') && p.kind !== 'dettaglio').forEach(p => AIQ.add(p.id));
    if (m === 'lib') openLibrary();
    if (m === 'set') openSettings();
    if (m === 'delP') {
      if (!await askConfirm(`Eliminare la tavola "${P.name}" con locali, elementi e foto collegate?`, 'Elimina', true)) return;
      S.photos.filter(p => p.planId === P.id).forEach(p => { Sync.del(pathFor('photo:' + p.id)); IDB.del('blobs', 'photo_' + p.id); });
      S.photos = S.photos.filter(p => p.planId !== P.id); S.items = S.items.filter(i => i.planId !== P.id); S.rooms = S.rooms.filter(r => r.planId !== P.id);
      Sync.del(pathFor('plan:' + P.id)); IDB.del('blobs', 'plan_' + P.id); S.sv.plans = S.sv.plans.filter(p => p.id !== P.id); S.draws = S.draws.filter(d => d.planId !== P.id); S.vnotes.filter(n => n.planId === P.id).forEach(n => { IDB.del('blobs', 'audio_' + n.id); Uploads.q.delete('audio_' + n.id); }); S.vnotes = S.vnotes.filter(n => n.planId !== P.id); S.undo = [];
      Sync.mark('meta'); S.planId = S.sv.plans[0]?.id || null; showSurvey();
    }
    if (m === 'home') goHome();
  });
}
async function goHome() {
  await Sync.flush(); S.sv = null; S.planImg = {}; AIQ.stop();
  await loadSurveyList(); renderHome();
}
async function importBackup(file) {
  try {
    let d, zip = null;
    if (/\.zip$/i.test(file.name || '') || /zip/.test(file.type || '')) {
      await needLib('zip'); zip = await JSZip.loadAsync(file); const j = zip.file('rilievo.json'); if (!j) throw new Error('nello ZIP manca rilievo.json');
      d = JSON.parse(await j.async('string'));
    } else d = JSON.parse(await file.text());
    const files = d.files || {};
    await importSnapshot(d, async key => { const zf = zip && files[key] && zip.file(files[key]); return zf ? await zf.async('blob') : null; });
  } catch (e) { console.error(e); toast('Backup non valido: ' + (e.message || e), true, 6000); }
}
async function importSnapshot(d, getFile, opt = {}) { // backup (JSON/ZIP) o cartella dell'archivio -> sopralluogo su questo dispositivo
  if (!d || d.app !== 'rilievo-elettrico' || !d.survey) throw new Error('file non riconosciuto');
  const ex = S.surveys.find(s => s.id === d.survey.id); let mode = 'new';
  if (ex) {
    mode = opt.mode || await askChoice(`Il sopralluogo "${ex.name}" c'è già su questo dispositivo.`, [['replace', 'Aggiorna con questa versione'], ['copy', 'Importa come copia'], ['', 'Annulla']], 'Aggiorna: prende il posto di quello che c\'è. Copia: lo affianca con un altro nome.');
    if (!mode) return false;
  }
  toast('Importo il sopralluogo…', false, 15000);
  const oldIds = {}; if (mode === 'copy') d = reidSnapshot(d, oldIds);
  const prev = mode === 'replace' ? await surveyAssets(d.survey.id) : new Map();
  if (mode === 'replace') await dropStaleDocs(d);
  S.sv = { ...d.survey, name: d.survey.name + (mode === 'copy' ? ' (copia)' : ''), updated: Date.now() }; delete S.sv.type; delete S.sv.stats;
  if (mode === 'copy') { delete S.sv.dir; delete S.sv.arch; delete S.sv.cost; }
  S.rooms = d.rooms || []; S.items = d.items || []; S.draws = d.draws || []; S.vnotes = d.vnotes || []; S.closure = d.closure || {}; S.showClosure = false;
  if (!S.sv.closed) S.closure = {};
  S.photos = (d.photos || []).map(p => ({ ...p, aiSt: p.aiSt === 'run' || p.aiSt === 'queued' ? 'none' : p.aiSt }));
  S.planId = S.sv.plans[0]?.id || null; S.undo = []; S.sel = null; S.planImg = {};
  let n = 0, miss = 0;
  const put = async (key, obj, kind, mime) => {
    const pa = prev.get(key); if (PLATFORM !== 'pwa' && pa) { obj.asset = pa; obj.local = false; return; } // già online: non lo ricarico
    const have = await IDB.get('blobs', key);
    let blob = await getFile(oldIds[key] || key);
    if (!blob) { if (have && have.blob) { obj.asset = PLATFORM === 'pwa' ? null : obj.asset; return; } if (PLATFORM === 'pwa' || !obj.asset) miss++; if (PLATFORM === 'pwa') obj.asset = null; return; }
    blob = new Blob([blob], { type: mime(blob) }); obj.asset = null; obj.local = true; n++;
    await Uploads.add(key, blob, kind, obj.id);
  };
  const imgMime = b => b.type && /^image\//.test(b.type) ? b.type : 'image/jpeg';
  for (const P of S.sv.plans) await put('plan_' + P.id, P, 'plan', b => b.type && /^image\//.test(b.type) ? b.type : 'image/png');
  for (const p of S.photos) await put('photo_' + p.id, p, 'photo', imgMime);
  for (const v of S.vnotes) if (v.mime) await put('audio_' + v.id, v, 'audio', () => v.mime);
  const root = base() + '/' + S.sv.id; [...Sync.last.keys()].forEach(k => { if (k === root || k.startsWith(root + '/')) Sync.last.delete(k); }); // va riscritto tutto
  Sync.mark('meta', ...S.sv.plans.map(p => 'plan:' + p.id), ...S.photos.map(p => 'photo:' + p.id), ...Object.keys(S.closure).map(id => 'closure:' + id));
  S.surveys = [S.sv].concat(S.surveys.filter(x => x.id !== S.sv.id));
  await Sync.flush();
  showSurvey(); toast(`Sopralluogo importato${miss ? ` (${miss} file mancanti)` : ''}`, !!miss, 5000);
  return true;
}
function reidSnapshot(d, oldIds) { // copia: nuovi codici per sopralluogo, tavole, foto e note (i file locali sono legati ai codici)
  const map = new Map([[d.survey.id, uid('s')]]);
  (d.survey.plans || []).forEach(p => map.set(p.id, uid('pl'))); (d.photos || []).forEach(p => map.set(p.id, uid('ph'))); (d.vnotes || []).forEach(n => map.set(n.id, uid('n')));
  let js = JSON.stringify(d); for (const [a, b] of map) js = js.split('"' + a + '"').join('"' + b + '"');
  for (const [a, b] of map) for (const k of ['plan_', 'photo_', 'audio_']) oldIds[k + b] = k + a;
  return JSON.parse(js);
}
async function surveyAssets(sid) { // file già caricati online della versione che sto aggiornando
  const m = new Map(); const root = base() + '/' + sid; const docs = [];
  for (const d of await IDB.all('docs')) if (d.data && (d.path === root || d.path.startsWith(root + '/'))) docs.push(d.data);
  if (CAP.db) { try { const md = await withTimeout(CAP.db.doc(root).get(), 12000); if (md.exists) docs.push(md.data()); for (const col of ['plans', 'photos']) { const sn = await withTimeout(CAP.db.doc(root).collection(col).get(), 15000); sn.docs.forEach(x => docs.push(x.data())); } } catch (e) { } }
  for (const x of docs) {
    if (x.type === 'survey') (x.plans || []).forEach(p => p.asset && m.set('plan_' + p.id, p.asset));
    if (x.type === 'photo' && x.asset) m.set('photo_' + x.id, x.asset);
    if (x.type === 'plan') (x.vnotes || []).forEach(n => n.asset && m.set('audio_' + n.id, n.asset));
  }
  return m;
}
async function dropStaleDocs(d) { // aggiornamento: via i documenti di tavole e foto che nella nuova versione non ci sono più
  const root = base() + '/' + d.survey.id; const keep = new Set([root, ...(d.survey.plans || []).map(p => root + '/plans/' + p.id), ...(d.photos || []).map(p => root + '/photos/' + p.id), ...Object.keys(d.closure || {}).map(id => root + '/closure/' + id)]);
  for (const x of await IDB.all('docs')) if ((x.path === root || x.path.startsWith(root + '/')) && !keep.has(x.path)) { await IDB.del('docs', x.path); if (CAP.db) Sync.del(x.path); }
  if (CAP.db) { try { for (const col of ['plans', 'photos', 'closure']) { const sn = await withTimeout(CAP.db.doc(root).collection(col).get(), 15000); sn.docs.forEach(x => { const p = root + '/' + col + '/' + x.id; if (!keep.has(p)) Sync.del(p); }); } } catch (e) { } }
  const ids = new Set([...(d.survey.plans || []).map(p => p.id), ...(d.photos || []).map(p => p.id), ...(d.vnotes || []).map(n => n.id)]);
  for (const b of await IDB.all('blobs')) if (b.sid === d.survey.id && !ids.has(b.ref)) { await IDB.del('blobs', b.id); Uploads.q.delete(b.id); }
  [...Sync.last.keys()].forEach(k => { if (k === root || k.startsWith(root + '/')) Sync.last.delete(k); });
}

/* ============ AVVIO ============ */
async function boot() {
  initCanvas(); initPanel(); initViewer(); initPhotoInputs(); initVnInputs();
  $('#hNew').onclick = newSurvey; $('#hLib').onclick = openLibrary; $('#hSet').onclick = openSettings;
  $('#bBack').onclick = goHome; $('#bMenu').onclick = openMenu; $('#bComputo').onclick = openComputo; $('#bUndo').onclick = doUndo;
  $('#bAddPlan').onclick = () => addPlanMenu();
  $('#fPlanCam').onchange = e => { const f = e.target.files[0]; e.target.value = ''; if (f) importPlanFile(f, true); };
  $('#planSel').onchange = e => switchPlan(e.target.value);
  $('#fPlan').onchange = e => { const f = e.target.files[0]; e.target.value = ''; if (f) importPlanFile(f); };
  $('#fJson').onchange = e => { const f = e.target.files[0]; e.target.value = ''; if (f) importBackup(f); };
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') { if (Rec.active) return; closeModal(); if (pendingPose) { pendingPose = null; S.tmp = {}; redraw(); } if (pendingVn) { const rep = pendingVn.replace; pendingVn = null; if (!rep) setTool('sel'); } } });
  document.addEventListener('visibilitychange', () => { if (document.hidden && Sync.pending()) Sync.flush(); });
  window.addEventListener('keydown', e => {
    const onPlan = !$('#sv').classList.contains('hide') && !(e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) && $('#modal').classList.contains('hide');
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !$('#sv').classList.contains('hide')) { e.preventDefault(); doUndo(); }
    if (onPlan && (e.ctrlKey || e.metaKey) && e.key === 'c' && selRoomIds().length) { e.preventDefault(); copyRooms(); } // come in CAD: Ctrl+C / Ctrl+V sulle stanze
    if (onPlan && (e.ctrlKey || e.metaKey) && e.key === 'v' && S.clip && curPlan()) { e.preventDefault(); startPaste(); }
    if (onPlan && e.key === 'Enter' && S.tmp && S.tmp.paste) { e.preventDefault(); confirmPaste(); }
    if (e.key === 'Escape') { if (onPlan && S.tmp && S.tmp.paste) { S.tmp = {}; updateHint(); renderPanel(); redraw(); } closeModal(); closeViewer(); }
  });
  $('#hList').innerHTML = '<div class="mut">Avvio…</div>';
  await IDB.open();
  if (PLATFORM === 'pwa') await pwaBoot();
  await initCaps();
  await restoreLocalUrls();
  await loadLib(); await loadSurveyList(); renderHome();
  Uploads.resume();
}
boot();
