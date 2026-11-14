/* ---- controllo generale e chiusura del sopralluogo: fotografia dello stato di fatto, scelte tecniche dopo la chiusura ---- */
const closedAt = () => (S.sv && S.sv.closed) || 0;
const CL_MAPS = new WeakMap(); // indice per id degli elementi di ogni fotografia (non viene salvato)
function closureOf(pid) { return (S.closure && S.closure[pid]) || null; }
function closureMap(c) { let m = CL_MAPS.get(c); if (!m) { m = new Map(c.items.map(x => [x.id, x])); CL_MAPS.set(c, m); } return m; }
function generalCheck() { // tutto quello che manca, tavola per tavola
  const plans = S.sv.plans.map(P => {
    const rooms = S.rooms.filter(r => r.planId === P.id); const phs = S.photos.filter(p => p.planId === P.id && p.kind !== 'dettaglio');
    const o = { plan: P, scale: !!P.ppm, rooms: rooms.map(r => ({ r, st: roomState(r), iss: roomIssues(r) })), noRoom: phs.filter(p => !p.roomId).length, pend: phs.filter(p => p.aiSt === 'none' || p.aiSt === 'error').map(p => p.id), items: S.items.filter(i => i.planId === P.id && !i.hint).length, hints: S.items.filter(i => i.planId === P.id && i.hint).length };
    o.warn = o.rooms.filter(x => x.st === 'warn').length + (o.scale ? 0 : 1) + (!rooms.length ? 1 : 0); // le foto esterne non sono un problema: vanno negli Esterni
    return o;
  });
  return { plans, warn: plans.reduce((a, o) => a + o.warn, 0), pend: plans.flatMap(o => o.pend) };
}
function openGeneralCheck() {
  const g = generalCheck(); const closed = closedAt(); const ts = techSummary();
  const html = `<h3>Controllo generale – ${esc(S.sv.name)}</h3>
    ${g.warn ? `<div class="banner warn">${g.warn} segnalazion${g.warn === 1 ? 'e' : 'i'}: guardale prima di lasciare il cantiere.</div>` : '<div class="banner ok">Tutto coerente: ogni locale ha foto, punto luce e comandi.</div>'}
    ${g.pend.length ? `<div class="row" style="margin:8px 0"><span class="small">${g.pend.length} foto ancora da analizzare.</span>${canAI() ? `<button class="ai sm" id="gcAI" style="flex:none">✦ Analizzale ora</button>` : '<span class="mut small">(AI non disponibile adesso)</span>'}</div>` : ''}
    ${g.plans.map(o => `<div class="sec"><b>${esc(o.plan.name)}</b> <span class="mut small">${o.rooms.length} locali • ${o.items} elementi</span>
      ${o.scale ? '' : '<div class="small" style="color:var(--tor)">🟠 scala non calibrata: le misure e il DXF non sono in scala</div>'}
      ${o.rooms.length ? '' : '<div class="small" style="color:var(--tor)">🟠 nessun locale disegnato</div>'}
      ${o.noRoom ? `<div class="mut small">🌳 ${o.noRoom} foto esterne (fuori dai locali): i loro elementi sono negli ${EXT_NAME}</div>` : ''}
      <div class="dlist" style="margin-top:6px">${o.rooms.map(x => `<div class="drow" data-go="${x.r.id}"><span style="font-size:16px">${ROOM_DOT[x.st]}</span><div class="g"><b>${esc(x.r.name)}</b>${x.st === 'done' ? '' : `<div class="small">${x.iss.length ? x.iss.map(i => `<span style="color:${i.lvl === 'warn' ? '#c2410c' : '#1e3a8a'}">${esc(i.t)}</span>`).join(' • ') : '<span style="color:#166534">coerente</span>'}</div>`}</div></div>`).join('')}</div>
      ${o.hints ? `<div class="mut small" style="margin-top:4px">⚠ ${o.hints} indizi AI (non conteggiati)</div>` : ''}</div>`).join('')}
    ${closed ? `<div class="sec"><b>Sopralluogo chiuso il ${fmtDT(closed)}</b><div class="small mut">Da allora: ${ts.nuovi} elementi nuovi, ${ts.modificati} modificati, ${ts.rimossi} rimossi (scelte tecniche). Lo stato di fatto resta salvato.</div></div>` : ''}
    <div class="acts"><button onclick="closeModal()">Chiudi</button>${closed ? `<button id="gcReclose">Aggiorna lo stato di fatto</button>` : `<button class="pri" id="gcClose">Chiudi sopralluogo</button>`}</div>`;
  const b = openModal(html, true);
  b.querySelectorAll('[data-go]').forEach(x => x.onclick = async () => { closeModal(); const r = roomById(x.dataset.go); if (!r) return; if (r.planId !== S.planId) await switchPlan(r.planId); select('room', r.id); centerOn(...polyCentroid(r.poly)); });
  const ai = b.querySelector('#gcAI'); if (ai) ai.onclick = () => { g.pend.forEach(id => AIQ.add(id, true)); closeModal(); toast(`${g.pend.length} foto in coda per l'analisi`); };
  const cl = b.querySelector('#gcClose') || b.querySelector('#gcReclose'); if (cl) cl.onclick = () => closeSurveyFlow(!!closed, g.warn);
}
async function closeSurveyFlow(again, nwarn) { // doppia conferma, poi la fotografia
  closeModal();
  const a1 = await askChoice(again ? 'Aggiornare lo stato di fatto?' : 'Chiudere il sopralluogo?', [['no', 'Non ancora'], ['si', again ? 'Sì, aggiorna' : 'Sì, chiudi']], again ? 'La fotografia attuale dello stato di fatto viene sostituita da com\'è adesso.' : 'Viene salvata la fotografia dello stato di fatto. Da questo momento ogni modifica è una scelta tecnica e viene segnata come tale.');
  if (a1 !== 'si') return;
  const a2 = await askChoice('Confermi?', [['no', 'Annulla'], ['si', 'Confermo']], nwarn ? `Ci sono ancora ${nwarn} segnalazioni nel controllo generale.` : 'Nessuna segnalazione aperta.');
  if (a2 !== 'si') return;
  closeSurvey();
}
function closureDoc(pid, at) { // la fotografia di una tavola: tutto tranne le miniature delle foto
  const J = x => JSON.parse(JSON.stringify(x));
  return { type: 'closure', id: pid, at, rooms: J(S.rooms.filter(r => r.planId === pid)), items: J(S.items.filter(i => i.planId === pid)), draws: J(S.draws.filter(d => d.planId === pid)), vnotes: J(S.vnotes.filter(n => n.planId === pid)),
    photos: S.photos.filter(p => p.planId === pid).map(p => { const { thumb, _url, _force, items, ...q } = cleanPhoto(p); return J(q); }) };
}
function closeSurvey() {
  const at = Date.now(); S.closure = {}; for (const P of S.sv.plans) S.closure[P.id] = closureDoc(P.id, at);
  S.sv.closed = at; Sync.mark('meta', ...S.sv.plans.map(p => 'closure:' + p.id)); renderPanel(); redraw(); toast('Sopralluogo chiuso: stato di fatto salvato', false, 5000);
}
async function reopenSurvey() {
  if (await askChoice('Annullare la chiusura?', [['no', 'No'], ['si', 'Sì, annulla']], 'La fotografia dello stato di fatto viene cancellata e le modifiche non sono più segnate come scelte tecniche.') !== 'si') return;
  for (const pid of Object.keys(S.closure || {})) { const path = pathFor('closure:' + pid); Sync.del(path); Sync.last.delete(path); try { await IDB.del('docs', path); } catch (e) { } }
  S.closure = {}; S.sv.closed = 0; S.showClosure = false; Sync.mark('meta'); renderPanel(); redraw();
}
function techState(it) { // dopo la chiusura: 'nuovo' | 'modificato' | null
  if (!closedAt() || it.hint) return null; const c = closureOf(it.planId); if (!c) return null;
  const o = closureMap(c).get(it.id); if (!o) return 'nuovo';
  const k = ppm(planOf(it.planId));
  if (o.s !== it.s || (o.fate || '') !== (it.fate || '') || plKey(o) !== plKey(it) || (o.n || 1) !== (it.n || 1) || (o.tag || '') !== (it.tag || '') || Math.hypot(o.x - it.x, o.y - it.y) > 0.15 * k || (o.roomId || '') !== (it.roomId || '')) return 'modificato';
  return null;
}
function techRemoved(pid) { const c = closureOf(pid); if (!c) return []; const ids = new Set(S.items.map(i => i.id)); return c.items.filter(x => !x.hint && !ids.has(x.id)); }
function techSummary() {
  const out = { nuovi: 0, modificati: 0, rimossi: 0 }; if (!closedAt()) return out;
  for (const it of S.items) { const t = techState(it); if (t === 'nuovo') out.nuovi++; else if (t === 'modificato') out.modificati++; }
  for (const P of S.sv.plans) out.rimossi += techRemoved(P.id).length;
  return out;
}
const TECH_TXT = { nuovo: 'nuovo', modificato: 'modificato' };
function techChip(it) { const t = techState(it); return t ? `<span class="chip" style="background:#1e3a8a;color:#fff" title="Scelta tecnica: diverso dallo stato di fatto del ${fmtDate(closedAt())}">◆ scelta tecnica: ${TECH_TXT[t]}</span>` : ''; }
function drawTechBadge(x, sx, sy, R, t) { // rombo blu scuro con N o M in alto a sinistra del simbolo
  const bx = sx - R - 2, by = sy - R - 2; x.beginPath(); x.moveTo(bx, by - 8); x.lineTo(bx + 8, by); x.lineTo(bx, by + 8); x.lineTo(bx - 8, by); x.closePath(); x.fillStyle = '#1e3a8a'; x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 1.5; x.stroke();
  x.font = '700 9px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff'; x.fillText(t === 'nuovo' ? 'N' : 'M', bx, by + 0.5); x.textBaseline = 'alphabetic';
}
function drawClosureGhosts(x, P, R) { // stato di fatto in grigio sotto gli elementi attuali; croce rossa su quelli rimossi
  const c = closureOf(P.id); if (!c) return; const cur = new Map(S.items.map(i => [i.id, i])); const k = ppm(P);
  x.save(); x.globalAlpha = 0.55;
  for (const o of c.items) {
    if (o.hint) continue; const it = cur.get(o.id); const same = it && Math.hypot(o.x - it.x, o.y - it.y) <= 0.15 * k && o.s === it.s && plKey(o) === plKey(it); if (same) continue; // invariato: è già disegnato
    if (o.pts) { x.beginPath(); o.pts.forEach((p, i) => { const [a, b] = toS(p[0], p[1]); i ? x.lineTo(a, b) : x.moveTo(a, b); }); x.strokeStyle = '#64748b'; x.lineWidth = 3; x.setLineDash([6, 4]); x.stroke(); x.setLineDash([]); if (!it) { const [a, b] = toS(o.x, o.y); redCross(x, a, b); } continue; }
    const [sx, sy] = toS(o.x, o.y); const sym = symOf(o.s);
    if (isPlate(o)) drawPlate(x, { ...o, s: o.s }, sx, sy, R, true, itemRot(o) - vr()); else drawSym(x, { ...sym, color: '#64748b', dcol: '#64748b' }, sx, sy, R, true, itemRot(o) - vr());
    if (!it) redCross(x, sx, sy); else { const [tx, ty] = toS(it.x, it.y); x.beginPath(); x.moveTo(sx, sy); x.lineTo(tx, ty); x.strokeStyle = '#1e3a8a'; x.lineWidth = 1.2; x.setLineDash([3, 3]); x.stroke(); x.setLineDash([]); }
  }
  x.restore();
}
function redCross(x, a, b) { x.beginPath(); x.moveTo(a - 9, b - 9); x.lineTo(a + 9, b + 9); x.moveTo(a + 9, b - 9); x.lineTo(a - 9, b + 9); x.strokeStyle = '#dc2626'; x.lineWidth = 3; x.stroke(); }
async function withClosureData(fn) { // esegue fn con i dati dello stato di fatto al posto di quelli attuali (per le esportazioni); sincronizzazione sospesa
  while (Sync.busy) await new Promise(r => setTimeout(r, 100));
  const live = { rooms: S.rooms, items: S.items, draws: S.draws, vnotes: S.vnotes, photos: S.photos }; const cur = new Map(S.photos.map(p => [p.id, p]));
  const all = key => Object.values(S.closure || {}).flatMap(c => c[key] || []);
  Sync.paused = true;
  S.rooms = all('rooms'); S.items = all('items'); S.draws = all('draws'); S.vnotes = all('vnotes'); S.photos = all('photos').map(p => ({ ...p, ...(cur.get(p.id) ? { asset: cur.get(p.id).asset, local: cur.get(p.id).local, thumb: cur.get(p.id).thumb } : {}) }));
  try { return await fn(); } finally { Object.assign(S, live); Sync.paused = false; if (Sync.dirty.size) Sync.schedule(); }
}
function closureHtml() { // riquadro nel pannello della tavola
  if (!closedAt()) return `<div class="sec"><div class="row"><b>Controllo generale</b><button class="sm" style="flex:none" data-act="genCheck">Apri</button></div><div class="mut small" style="margin-top:4px">Cosa manca, foto da analizzare e chiusura del sopralluogo con la fotografia dello stato di fatto.</div></div>`;
  const ts = techSummary(); const tot = ts.nuovi + ts.modificati + ts.rimossi;
  return `<div class="sec"><div class="row"><b>Sopralluogo chiuso il ${fmtDate(closedAt())}</b><button class="sm" style="flex:none" data-act="genCheck">Controllo</button></div>
    <div class="small" style="margin-top:4px">${tot ? `Scelte tecniche: <b>${ts.nuovi}</b> nuovi, <b>${ts.modificati}</b> modificati, <b>${ts.rimossi}</b> rimossi.` : 'Nessuna modifica dopo la chiusura.'}</div>
    <div class="row wrap" style="margin-top:6px"><label class="row small" style="flex:none"><input type="checkbox" style="width:auto;min-height:0" data-act="showClosure" ${S.showClosure ? 'checked' : ''}> mostra lo stato di fatto (grigio)</label>
    <button class="sm" data-act="expClosure">Esporta stato di fatto</button><button class="sm ghost" data-act="reopen">Annulla chiusura</button></div></div>`;
}
