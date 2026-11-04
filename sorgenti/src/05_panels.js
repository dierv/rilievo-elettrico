/* ============ PANNELLO LATERALE ============ */
const ROOM_KINDS = ['', 'Abitazione – vano', 'Bagno / doccia', 'Cucina', 'Ufficio', 'Negozio / vendita', 'Magazzino', 'Produzione / officina', 'Locale tecnico', 'Servizi / spogliatoi', 'Corridoio / disimpegno', 'Esterno', 'Altro'];
const ROOM_NAMES = ['Soggiorno', 'Cucina', 'Camera', 'Cameretta', 'Bagno', 'Corridoio', 'Ripostiglio', 'Ingresso', 'Balcone', 'Ufficio', 'Sala riunioni', 'Area vendita', 'Magazzino', 'Reparto produzione', 'Locale quadri', 'Spogliatoio', 'WC', 'Archivio', 'Esterno'];
const KINDS = { parete: 'Parete', soffitto: 'Puntuale', quadro: 'Quadro', dettaglio: 'Dettaglio' };
const PEN_COLS = ['#111827', '#dc2626', '#2563eb', '#16a34a', '#f59e0b', '#9333ea', '#0891b2', '#ec4899']; const PEN_W = [1, 2, 4, 8, 14];
const symOptions = cur => Object.entries(CATS).map(([c, cd]) => `<optgroup label="${esc(cd.n)}">${S.lib.symbols.filter(s => s.cat === c).map(s => `<option value="${esc(s.code)}"${s.code === cur ? ' selected' : ''}>${esc(s.code)} – ${esc(s.name)}</option>`).join('')}</optgroup>`).join('');
const imgSrc = ph => blobUrl('photo_' + ph.id, ph.asset) || ph.thumb || '';
const aiChip = ph => ph.kind === 'dettaglio' ? '<span class="chip grey">Riferimento</span>' : ({ none: '<span class="chip grey">Da analizzare</span>', queued: '<span class="chip warn">In coda</span>', run: '<span class="chip warn">Analisi…</span>', done: '<span class="chip ai">Analizzata</span>', err: '<span class="chip bad">Errore</span>' }[ph.aiSt || 'none']);
function countsByCode(items) {
  const m = {}; for (const it of items) { if (it.hint) continue; for (const { k, q } of itemParts(it)) { m[k] = m[k] || { n: 0, dr: 0 }; m[k].n += q; if (!it.ok) m[k].dr += q; } } return m;
}
function countsTable(items) {
  const m = countsByCode(items); const keys = Object.keys(m).sort();
  if (!keys.length) return '<div class="mut small">Nessun elemento.</div>';
  return `<table class="t"><tr><th></th><th>Elemento</th><th class="n">Q.tà</th><th class="n">di cui bozze</th></tr>${keys.map(k => { const s = symOf(kCode(k)); return `<tr><td><img src="${symIcon(s, 40)}" width="20"></td><td>${esc(symShort(s))} ${esc(kName(k))}</td><td class="n"><b>${m[k].n}</b></td><td class="n">${m[k].dr || ''}</td></tr>`; }).join('')}</table>`;
}
function aiAvailHtml() {
  if (PLATFORM === 'pwa' && !CAP.sample) return `<div class="banner warn">Riconoscimento AI spento: inserisci la chiave API in Impostazioni. Puoi comunque rilevare a mano.</div>`;
  if (!CAP.sample) return `<div class="banner warn">AI non disponibile in questa vista: apri l'app da claude.ai (o dall'app Claude) con l'account con cui l'hai creata. Puoi comunque rilevare a mano.</div>`;
  if (!CAP.img) return `<div class="banner warn">Questa vista non può inviare immagini a Claude: riconoscimento automatico non disponibile.</div>`;
  if (CAP.aiOff) return `<div class="banner warn">Hai negato l'uso di Claude a questa app: il riconoscimento resta spento fino al prossimo avvio.</div>`;
  return '';
}

function renderPanel() {
  const el = $('#panel'); if (!el || !S.sv) return;
  const P = curPlan();
  if (S.tool === 'room') {
    const n = (S.tmp.poly || []).length; const re = S.redrawRoom ? roomById(S.redrawRoom) : null;
    el.innerHTML = `<h2>${re ? 'Ridisegna: ' + esc(re.name) : 'Nuova stanza'}</h2>
      <ol class="small" style="padding-left:18px;margin:4px 0 10px;line-height:1.5"><li>${penMode() ? 'Tocca gli angoli della stanza con la penna, uno dopo l\'altro. Avvicinando la penna allo schermo vedi il mirino dove cadrà il punto (se il tablet lo supporta).' : 'Tocca gli angoli della stanza uno dopo l\'altro. Tieni il dito appoggiato: compare la lente con il mirino, il punto si fissa quando sollevi il dito.'}</li>
      <li>I lati quasi orizzontali o verticali si raddrizzano da soli; vicino agli angoli delle altre stanze il punto si aggancia (mirino rosso).</li>
      <li>Per chiudere tocca il primo punto (verde) o "Chiudi stanza".</li></ol>
      <div class="mut">Angoli inseriti: <b>${n}</b></div>
      <div class="row" style="margin-top:12px"><button data-act="manUndo" ${n ? '' : 'disabled'}>Togli ultimo</button><button class="pri" data-act="manDone" ${n >= 3 ? '' : 'disabled'}>Chiudi stanza</button></div>
      <button style="width:100%;margin-top:8px" data-act="manCancel">Annulla</button>`;
    return;
  }
  const sel = S.sel;
  if (sel && sel.t === 'item' && itemById(sel.id)) return itemPanel(el, itemById(sel.id));
  if (sel && sel.t === 'photo' && photoById(sel.id)) return photoPanel(el, photoById(sel.id));
  if (sel && sel.t === 'room' && roomById(sel.id)) return roomPanel(el, roomById(sel.id));
  if (sel && sel.t === 'draw' && drawById(sel.id)) return drawPanel(el, drawById(sel.id));
  if (sel && sel.t === 'vnote' && vnoteById(sel.id)) return vnotePanel(el, vnoteById(sel.id));
  if (!P) { el.innerHTML = `<h2>${esc(S.sv.name)}</h2><p class="mut">Carica la prima tavola: PDF, DXF (da AutoCAD) o una foto della pianta.</p><button class="pri" data-act="addPlan" style="width:100%">+ Aggiungi tavola</button>${aiAvailHtml()}`; return; }
  const rooms = S.rooms.filter(r => r.planId === P.id); const all = S.items.filter(i => i.planId === P.id); const its = all.filter(i => !i.hint); const nh = all.length - its.length; const phs = S.photos.filter(p => p.planId === P.id);
  const dr = its.filter(i => !i.ok).length;
  el.innerHTML = `<h2>${esc(P.name)}</h2>
    <div class="row wrap" style="gap:6px">${P.ppm ? `<span class="chip ok">Scala ok</span>` : `<span class="chip warn">Scala da calibrare</span>`}
      <span class="chip grey">${rooms.length} locali (${rooms.filter(r => r.done).length} fatti)</span><span class="chip grey">${phs.length} foto</span>${(() => { const nv = S.vnotes.filter(n => n.planId === P.id).length; return nv ? `<span class="chip grey">🎙 ${nv} not${nv === 1 ? 'a' : 'e'}</span>` : ''; })()}<span class="chip grey">${its.length} elementi</span>${dr ? `<span class="chip ai">${dr} bozze AI</span>` : ''}${nh ? `<span class="chip warn">⚠ ${nh} indizi</span>` : ''}</div>
    ${aiAvailHtml()}
    ${!P.ppm ? `<button style="width:100%;margin-top:10px" data-act="tool" data-v="cal">Calibra la scala</button>` : ''}
    <div class="sec"><b>Come si usa</b>
      <ol class="small mut" style="padding-left:18px;margin:6px 0">
      <li><b>Stanza</b>: tocca gli angoli del locale (tieni il dito per la lente) e chiudi sul primo punto.</li>
      <li><b>Foto</b>: tocca dentro la stanza dove sei, trascina verso dove guardi, scatta. L'AI mette i simboli sulle pareti della stanza, in bozza (viola).</li>
      <li>Controlla, sposta, <b>conferma</b>. Segna il locale come rilevato.</li>
      <li><b>Nota audio</b>: tocca un punto e registra (si apre il registratore del tablet), oppure scrivi o detta il testo.</li></ol></div>
    <div class="sec"><b>Locali</b><div class="dlist">${rooms.length ? rooms.map(r => { const n = S.items.filter(i => i.roomId === r.id && !i.hint); const nd = n.filter(i => !i.ok).length; return `<div class="drow" data-act="goRoom" data-id="${r.id}"><span style="font-size:18px">${r.done ? '✅' : '⬜'}</span><div class="g"><div><b>${esc(r.name)}</b></div><div class="mut small">${S.photos.filter(p => p.roomId === r.id).length} foto • ${n.length} elementi${nd ? ` • <span style="color:var(--ai)">${nd} bozze</span>` : ''}</div></div></div>`; }).join('') : '<div class="mut small">Nessun locale. Usa lo strumento Stanza.</div>'}</div></div>
    <div class="sec"><b>Visualizza</b>
      <div class="row wrap" style="margin-top:6px"><label class="row small" style="flex:none"><input type="checkbox" style="width:auto;min-height:0" data-set="cones" ${ST().cones ? 'checked' : ''}> coni foto</label>
      <label class="row small" style="flex:none"><input type="checkbox" style="width:auto;min-height:0" data-set="drafts" ${ST().drafts ? 'checked' : ''}> bozze AI</label>
      <label class="row small" style="flex:none"><input type="checkbox" style="width:auto;min-height:0" data-set="hints" ${ST().hints !== false ? 'checked' : ''}> indizi</label>
      <label class="row small" style="flex:none"><input type="checkbox" style="width:auto;min-height:0" data-set="labels" ${ST().labels ? 'checked' : ''}> sigle</label></div></div>`;
}
function roomPanel(el, r) {
  const all = S.items.filter(i => i.roomId === r.id); const its = all.filter(i => !i.hint); const hints = all.filter(i => i.hint); const phs = S.photos.filter(p => p.roomId === r.id); const dr = its.filter(i => !i.ok).length;
  const crit = phs.flatMap(p => (p.ai && p.ai.crit) || []);
  el.innerHTML = `<h2>${r.done ? '✅' : '⬜'} ${esc(r.name)}</h2>
    <label class="f">Nome</label><input data-rf="name" value="${esc(r.name)}" list="dlRooms"><datalist id="dlRooms">${ROOM_NAMES.map(n => `<option value="${n}">`).join('')}</datalist>
    <div class="row"><div><label class="f">Tipo</label><select data-rf="kind">${ROOM_KINDS.map(k => `<option${k === r.kind ? ' selected' : ''} value="${k}">${k || '—'}</option>`).join('')}</select></div>
    <div style="flex:.6"><label class="f">Altezza (m)</label><input data-rf="h" type="number" step="0.05" inputmode="decimal" value="${r.h ?? ''}"></div></div>
    <label class="f">Note</label><textarea data-rf="note" placeholder="es. impianto sottotraccia, placche Living, manca terra…">${esc(r.note)}</textarea>
    <button style="width:100%;margin-top:10px" class="${r.done ? '' : 'okb'}" data-act="roomDone">${r.done ? 'Riapri il locale' : '✓ Segna locale come rilevato'}</button>
    <div class="sec"><div class="row"><b>Foto (${phs.length})</b><button class="sm" style="flex:none" data-act="tool" data-v="photo">+ Foto</button></div>
      <div class="thumbs" style="margin-top:6px">${phs.map(p => `<img src="${esc(imgSrc(p))}" data-act="selPhoto" data-id="${p.id}" title="${KINDS[p.kind]}">`).join('') || '<div class="mut small" style="grid-column:1/-1">Nessuna foto.</div>'}</div></div>
    ${vnList(S.vnotes.filter(n => n.roomId === r.id).sort((a, b) => a.num - b.num))}
    <div class="sec"><b>Elementi</b>${countsTable(its)}
      <div class="row wrap" style="margin-top:8px">${dr ? `<button class="okb sm" data-act="confirmRoom">Conferma ${dr} bozze</button>` : ''}<button class="sm" data-act="dedupe">Rimuovi doppioni</button></div></div>
    ${hintList(hints)}
    ${crit.length ? `<div class="sec"><b>Criticità viste dall'AI</b><ul class="small" style="padding-left:18px;margin:6px 0">${crit.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>` : ''}
    <div class="sec"><b>Contorno</b><div class="mut small" style="margin:4px 0 8px">Trascina i pallini blu sulla pianta per spostare gli angoli; tocca i "+" a metà lato per aggiungerne uno; porta un angolo sopra quello vicino per toglierlo.</div>
      <div class="row wrap"><button class="sm" data-act="redrawMan">Ridisegna da capo</button><button class="sm danger" data-act="delRoom">Elimina stanza</button></div></div>
    <button class="ghost" style="width:100%;margin-top:6px" data-act="desel">← Panoramica tavola</button>`;
}
function photoPanel(el, ph) {
  const all = S.items.filter(i => i.photoId === ph.id); const its = all.filter(i => !i.hint); const ai = ph.ai || {};
  const canAI = CAP.sample && CAP.img && !CAP.aiOff && ph.kind !== 'dettaglio';
  const att = ph.itemId ? itemById(ph.itemId) : null;
  el.innerHTML = `<h2>Foto ${aiChip(ph)}</h2>
    <img src="${esc(imgSrc(ph))}" data-act="view" data-id="${ph.id}" style="width:100%;border-radius:8px;border:1px solid var(--line);cursor:zoom-in;background:#ddd;max-height:260px;object-fit:contain">
    <div class="mut small">${esc(roomById(ph.roomId)?.name || 'fuori dai locali')}${att ? ' • allegata a ' + esc(symOf(att.s).name) : ''} • ${new Date(ph.t || Date.now()).toLocaleString('it-IT')}</div>
    <label class="f">Tipo di foto</label>
    <div class="row wrap">${Object.entries(KINDS).map(([k, n]) => `<button class="sm ${ph.kind === k ? 'pri' : ''}" data-act="kind" data-v="${k}">${n}</button>`).join('')}</div>
    ${(ph.kind === 'parete' || ph.kind === 'soffitto') ? `
      <label class="f">Campo visivo: <span id="fovV">${ph.fov}</span>°</label><input type="range" min="35" max="110" value="${ph.fov}" data-pf="fov" style="min-height:0;padding:0">
      ${ph.kind === 'soffitto' ? `<label class="row small" style="margin-top:6px"><input type="checkbox" style="width:auto;min-height:0" data-pf="mir" ${ph.mir ? 'checked' : ''}> Specchia (se i punti escono invertiti)</label>` : ''}
      <div class="mut small" style="margin-top:4px">${ph.kind === 'parete' ? 'Trascina il pallino in punta al cono per cambiare direzione e lunghezza' : 'Trascina il pallino ⟳ per ruotare'}, il centro per spostare: i simboli in bozza si riposizionano.</div>` : ''}
    <div class="sec">
      ${canAI ? `<button class="ai" style="width:100%" data-act="analyze" ${ph.aiSt === 'run' || ph.aiSt === 'queued' ? 'disabled' : ''}>${ph.aiSt === 'done' ? '↻ Rianalizza con AI' : '✦ Analizza con AI'}</button>` : (ph.kind !== 'dettaglio' ? aiAvailHtml() : '')}
      ${ph.aiErr && ph.aiSt === 'err' ? `<div class="banner warn">${esc(ph.aiErr)}</div>` : ''}
      ${ai.desc ? `<p class="small" style="margin:10px 0 4px">${esc(ai.desc)}</p>` : ''}
      ${(ai.crit || []).length ? `<div class="small" style="color:var(--warn)"><b>Criticità:</b> ${ai.crit.map(esc).join(' • ')}</div>` : ''}
      ${ph.kind === 'quadro' ? (ai.app ? `<div class="sec"><b>Contenuto del quadro</b>${quadroView(ai, { ph, d: null })}</div>` : '') : ''}
    </div>
    ${its.length ? `<div class="sec"><b>Elementi da questa foto (${its.length})</b><div class="dlist">${its.map(it => { const s = symOf(it.s); return `<div class="drow" data-act="selItem" data-id="${it.id}"><img src="${symIcon(s, 40)}"><div class="g"><div>${isPlate(it) ? 'Placca ' + it.pl.length + ' posti' : esc(s.code) + ' ' + esc(s.name)}${it.n > 1 ? ' ×' + it.n : ''}</div><div class="mut small">${it.ok ? 'confermato' : 'bozza'}${isPlate(it) ? ' • ' + esc(plDesc(it)) : famExtra(it) ? ' • ' + esc(famExtra(it)) : ''}${it.conf != null && it.conf < 1 ? ' • ' + Math.round(it.conf * 100) + '%' : ''}${(it.tri || []).length ? ' • vista in ' + (it.tri.length + 1) + ' foto' : ''}${it.oltre ? ' • oltre la porta' : ''}${it.note ? ' • ' + esc(it.note) : ''}</div></div></div>`; }).join('')}</div>
      ${its.some(i => !i.ok) ? `<button class="okb sm" style="margin-top:8px" data-act="confirmPhoto">Conferma tutte</button>` : ''}</div>` : ''}
    ${hintList(all.filter(i => i.hint))}
    <label class="f">Nota</label><textarea data-pf="note">${esc(ph.note || '')}</textarea>
    <div class="sec row"><button class="sm danger" data-act="delPhoto">Elimina foto</button><button class="sm ghost" data-act="desel">Chiudi</button></div>`;
}
function drawPanel(el, d) {
  const cols = [...new Set(d.strokes.map(s => s.col))];
  el.innerHTML = `<h2>✎ Disegno a mano</h2><div class="mut small">${d.strokes.length} tratt${d.strokes.length === 1 ? 'o' : 'i'} • trascinalo sulla pianta per spostarlo</div>
    <label class="f">Colore</label><div class="row wrap" style="gap:8px">${PEN_COLS.map(c => `<button class="sw${cols.length === 1 && cols[0] === c ? ' on' : ''}" data-act="drawCol" data-v="${c}" style="background:${c}" title="${c}"></button>`).join('')}</div>
    <div class="sec row"><button class="sm danger" data-act="delDraw">Elimina disegno</button><button class="sm ghost" data-act="desel">Chiudi</button></div>`;
}
function hintList(hints) {
  if (!hints.length) return '';
  return `<div class="sec"><b>⚠ Indizi da verificare (${hints.length})</b><div class="mut small">Cose non fisse viste in foto: non sono conteggiate, ma possono nascondere impianto.</div><div class="dlist">${hints.map(h => `<div class="drow" data-act="selItem" data-id="${h.id}"><span style="font-size:18px">⚠</span><div class="g"><div>${esc(h.note || 'Indizio')}</div><div class="mut small">probabile ${esc(symOf(h.s).code)} ${esc(symOf(h.s).name)}</div></div></div>`).join('')}</div></div>`;
}
function itemSources(it) { const out = []; if (it.photoId && it.d != null && photoById(it.photoId)) out.push({ ph: photoById(it.photoId), d: it.d }); (it.tri || []).forEach(q => { const p = photoById(q.p); if (p) out.push({ ph: p, d: q.d }); }); return out; }
function itemPanel(el, it) {
  const s = symOf(it.s); const ph = it.photoId ? photoById(it.photoId) : null;
  const att = S.photos.filter(p => p.itemId === it.id);
  if (it.hint) {
    el.innerHTML = `<h2>⚠ Indizio <span class="chip warn">non conteggiato</span></h2>
      <p style="margin:6px 0 10px">${esc(it.note || 'Elemento non fisso visto in foto.')}</p>
      <div class="small">Impianto probabile: <img src="${symIcon(s, 40)}" width="20" style="vertical-align:middle"> <b>${esc(s.code)}</b> ${esc(s.name)}</div>
      <div class="row" style="margin-top:12px"><button class="okb" data-act="hintAdd">+ Aggiungi come elemento</button><button class="danger" data-act="delItem">Ignora</button></div>
      ${ph ? `<button class="sm" style="margin-top:8px;width:100%" data-act="viewDet">Vedi nella foto</button>` : ''}
      <div class="sec row"><button class="sm ghost" data-act="desel">Chiudi</button></div>`;
    return;
  }
  const srcs = itemSources(it); const pn = photoNumbers(); const isQ = isQuadroCode(it.s);
  const from = ph ? roomById(ph.roomId) : null;
  el.innerHTML = `<h2><img src="${symIcon(s, 48)}" width="26"> ${esc(isQ ? quadroLabel(it) : isPlate(it) ? 'Placca ' + it.pl.length + ' posti' : symShort(s))} ${it.ok ? '<span class="chip ok">Confermato</span>' : '<span class="chip ai">Bozza AI</span>'}</h2>
    ${famFieldsHtml(it)}
    <div class="row"><div><label class="f">Quantità</label><div class="row"><button class="sm" style="flex:none" data-act="nMinus">−</button><input data-if="n" type="number" min="1" value="${it.n || 1}" style="text-align:center"><button class="sm" style="flex:none" data-act="nPlus">+</button></div></div>
    <div><label class="f">Altezza (m)</label><input data-if="h" type="number" step="0.05" inputmode="decimal" value="${it.h ?? ''}"></div></div>
    <label class="f">Simbolo della legenda</label><select data-if="s">${symOptions(it.s)}</select>
    <div class="row"><div><label class="f">Scritta sul disegno</label><input data-if="tag" value="${esc(it.tag || '')}" placeholder="es. U.I., U.E., QG" maxlength="12"></div></div>
    <label class="f">Note</label><textarea data-if="note" placeholder="es. 2 frutti, placca BTicino Living, IP55, 2x58W…">${esc(it.note || '')}</textarea>
    ${!it.ok ? `<div class="row" style="margin-top:10px"><button class="okb" data-act="confirmItem">✓ Conferma</button><button class="danger" data-act="delItem">✕ Scarta</button></div>` : ''}
    ${srcs.length > 1 ? `<div class="sec small"><b>Visto in ${srcs.length} foto</b>: posizione incrociata tra le foto.
        <div class="row wrap" style="margin-top:6px">${srcs.map(x => `<button class="sm" style="flex:none" data-act="viewSrc" data-id="${x.ph.id}" data-v="${x.d}">${pn.get(x.ph.id) || 'foto'}${x.ph.roomId !== it.roomId ? ' (' + esc(roomById(x.ph.roomId)?.name || '') + ')' : ''}</button>`).join('')}</div>
        <button class="sm" style="margin-top:6px" data-act="split">Non è lo stesso oggetto: separa</button></div>`
      : ph ? `<div class="sec small"><div class="row"><span>Da foto ${pn.get(ph.id) || ''}${it.conf != null ? ' • affidabilità ' + Math.round(it.conf * 100) + '%' : ''}${it.est ? ' • <span style="color:var(--warn)">posizione stimata</span>' : ''}</span><button class="sm" style="flex:none" data-act="viewDet">Vedi nella foto</button></div></div>` : ''}
    ${it.oltre && from ? `<div class="small mut">Visto attraverso una porta da ${esc(from.name)}: messo sulla parete del locale accanto${(it.tri || []).length ? '' : '. Una foto da dentro quel locale lo posiziona meglio'}.</div>` : ''}
    ${isQ ? quadroSection(it) : ''}
    <div class="sec"><div class="row"><b>Foto di dettaglio</b><button class="sm" style="flex:none" data-act="attPhoto" data-v="dettaglio">+ Foto</button></div>
      <div class="thumbs" style="margin-top:6px">${att.filter(p => p.kind === 'dettaglio' || (isQ && p.kind === 'quadro')).map(p => `<img src="${esc(imgSrc(p))}" data-act="view" data-id="${p.id}">`).join('')}</div></div>
    <div class="sec row"><button class="sm danger" data-act="delItem">Elimina</button><button class="sm ghost" data-act="desel">Chiudi</button></div>`;
}

function initPanel() {
  const el = $('#panel');
  el.addEventListener('click', async e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, id = b.dataset.id, v = b.dataset.v; const sel = S.sel;
    const it = sel && sel.t === 'item' ? itemById(sel.id) : null, ph = sel && sel.t === 'photo' ? photoById(sel.id) : null, rm = sel && sel.t === 'room' ? roomById(sel.id) : null;
    switch (a) {
      case 'addPlan': $('#fPlan').click(); break;
      case 'tool': setTool(v); break;
      case 'desel': select(null); break;
      case 'goRoom': { const r = roomById(id); select('room', id); centerOn(...polyCentroid(r.poly)); break; }
      case 'selPhoto': select('photo', id); break;
      case 'selItem': select('item', id); break;
      case 'selVnote': { const n = vnoteById(id); if (n) { select('vnote', id); centerOn(n.x, n.y); } break; }
      case 'vnRec': case 'vnDl': case 'delVnote': await vnAct(a, sel && sel.t === 'vnote' ? vnoteById(sel.id) : null); break;
      case 'view': openViewer(id); break;
      case 'manUndo': (S.tmp.poly || []).pop(); renderPanel(); redraw(); break;
      case 'manDone': finishRoom(); break;
      case 'manCancel': setTool('sel'); break;
      case 'roomDone': rm.done = !rm.done; Sync.mark('plan:' + rm.planId); renderPanel(); redraw(); break;
      case 'confirmRoom': pushUndo(); S.items.filter(i => i.roomId === rm.id && !i.ok && !i.hint).forEach(i => { i.ok = true; Sync.markItem(i); }); renderPanel(); redraw(); break;
      case 'dedupe': { const n = dedupeRoom(rm); toast(n ? `Rimossi ${n} doppioni` : 'Nessun doppione trovato'); renderPanel(); redraw(); break; }
      case 'redrawMan': setTool('room'); S.redrawRoom = rm.id; renderPanel(); break;
      case 'delRoom': if (await askConfirm(`Eliminare il locale "${rm.name}"? Foto ed elementi restano sulla pianta.`, 'Elimina', true)) { pushUndo(); S.rooms = S.rooms.filter(r => r.id !== rm.id); roomGeometryChanged(rm.planId); Sync.mark('plan:' + rm.planId); select(null); } break;
      case 'kind': {
        const was = ph.kind; ph.kind = v;
        if (v === 'quadro' || v === 'dettaglio') removeDrafts(ph); else if (ph.ai && ph.ai.dets) applyDetections(ph);
        const fits = v === 'quadro' ? !!(ph.ai && ph.ai.app) : v === 'dettaglio' ? true : !!(ph.ai && ph.ai.dets);
        if (!fits && was !== v) { ph.aiSt = 'none'; if (canAI() && ST().auto) AIQ.add(ph.id, true); }
        Sync.mark('photo:' + ph.id); renderPanel(); redraw(); break;
      }
      case 'analyze': AIQ.add(ph.id, true); renderPanel(); break;
      case 'confirmPhoto': pushUndo(); S.items.filter(i => i.photoId === ph.id && !i.ok && !i.hint).forEach(i => i.ok = true); Sync.mark('photo:' + ph.id); renderPanel(); redraw(); break;
      case 'delPhoto': {
        const n = S.items.filter(i => i.photoId === ph.id && !i.ok).length;
        if (!await askConfirm(`Eliminare la foto?${n ? ` Spariscono anche ${n} bozze non confermate.` : ''}`, 'Elimina', true)) break;
        deletePhoto(ph); select(null); break;
      }
      case 'confirmItem': pushUndo(); it.ok = true; Sync.markItem(it); renderPanel(); redraw(); break;
      case 'nMinus': case 'nPlus': pushUndo(); it.n = Math.max(1, (it.n || 1) + (a === 'nPlus' ? 1 : -1)); Sync.markItem(it); renderPanel(); redraw(); break;
      case 'viewDet': openViewer(it.photoId, it.d); break;
      case 'drawCol': { const d = drawById(sel.id); if (!d) break; pushUndo(); d.strokes.forEach(st => st.col = v); Sync.mark('plan:' + d.planId); renderPanel(); redraw(); break; }
      case 'delDraw': { const d = drawById(sel.id); if (!d) break; pushUndo(); S.draws = S.draws.filter(x => x !== d); Sync.mark('plan:' + d.planId); select(null); break; }
      case 'viewSrc': openViewer(id, v === '' ? null : +v); break;
      case 'split': { pushUndo(); const n = splitItem(it); toast(n ? `Separato: ${n + 1} oggetti, uno per foto` : 'Niente da separare'); renderPanel(); redraw(); break; }
      case 'hintAdd': pushUndo(); it.hint = false; it.ok = true; Sync.markItem(it); renderPanel(); redraw(); break;
      case 'reread': rereadQuadro(it); renderPanel(); break;
      case 'qbox': openViewer(id, b.dataset.v === '' ? null : +b.dataset.v, { qd: b.dataset.q === '' ? 'q' : +b.dataset.q }); break;
      case 'attPhoto': openPhotoSheet({ x: it.x, y: it.y, a: 0, kind: v, itemId: it.id }); break;
      case 'delItem': pushUndo(); S.items = S.items.filter(i => i.id !== it.id); Sync.markItem(it); select(null); break;
    }
  });
  el.addEventListener('change', e => {
    const t = e.target; const sel = S.sel;
    if (t.dataset.set) { ST()[t.dataset.set] = t.checked; Sync.mark('lib'); redraw(); return; }
    if (t.dataset.vf && sel && sel.t === 'vnote') { const n = vnoteById(sel.id); if (n) { n[t.dataset.vf] = t.value.trim(); Sync.mark('plan:' + n.planId); redraw(); } return; }
    if (t.dataset.rf && sel && sel.t === 'room') { const r = roomById(sel.id); const f = t.dataset.rf; r[f] = f === 'h' ? num(t.value) : t.value; Sync.mark('plan:' + r.planId); if (f === 'h') S.photos.filter(p => p.roomId === r.id).forEach(p => { reprojectPhoto(p); Sync.mark('photo:' + p.id); }); if (f === 'name') renderPanel(); redraw(); return; }
    if (t.dataset.fa && sel && sel.t === 'item') { const it = itemById(sel.id); famSet(it, t.dataset.fa, t.value); renderPanel(); redraw(); return; }
    if (t.dataset.pln && sel && sel.t === 'item') { plSetSize(itemById(sel.id), +t.value); renderPanel(); redraw(); return; }
    if (t.dataset.pli && sel && sel.t === 'item') { plSet(itemById(sel.id), 'inst', t.value); renderPanel(); redraw(); return; }
    if (t.dataset.plp != null && t.dataset.plp !== '' && sel && sel.t === 'item') { plSet(itemById(sel.id), +t.dataset.plp, t.value); renderPanel(); redraw(); return; }
    if (t.dataset.if && sel && sel.t === 'item') {
      const it = itemById(sel.id); const f = t.dataset.if; pushUndo();
      if (f === 's') { const was = symOf(it.s).mount === 'lineare', now = symOf(t.value).mount === 'lineare'; it.s = t.value; it.ok = true; delete it.at; delete it.pl; delete it.plInst; if (was && !now) it.pts = null; if (!was && now && !it.pts) { const k = ppm(); it.pts = [[it.x - 0.5 * k, it.y], [it.x + 0.5 * k, it.y]]; } }
      else if (f === 'n') it.n = Math.max(1, parseInt(t.value) || 1); else if (f === 'h') it.h = num(t.value); else if (f === 'tag') { const v = t.value.trim(); if (v) it.tag = v.slice(0, 12); else delete it.tag; } else it[f] = t.value;
      Sync.markItem(it); renderPanel(); redraw(); return;
    }
    if (t.dataset.pf && sel && sel.t === 'photo') {
      const ph = photoById(sel.id); const f = t.dataset.pf;
      if (f === 'fov') ph.fov = +t.value; else if (f === 'mir') ph.mir = t.checked; else ph[f] = t.value;
      if (f !== 'note') reprojectPhoto(ph); Sync.mark('photo:' + ph.id); redraw(); return;
    }
  });
  el.addEventListener('input', e => {
    const t = e.target; if (t.dataset.pf === 'fov' && S.sel) { const ph = photoById(S.sel.id); if (!ph) return; ph.fov = +t.value; const s = $('#fovV'); if (s) s.textContent = t.value; reprojectPhoto(ph); redraw(); }
  });
}
function dedupeRoom(r) {
  const k = ppm(planOf(r.planId)); const its = S.items.filter(i => i.roomId === r.id && !i.pts); let n = 0; const gone = new Set();
  pushUndo();
  for (let i = 0; i < its.length; i++) {
    const a = its[i]; if (gone.has(a.id)) continue;
    for (let j = i + 1; j < its.length; j++) {
      const b = its[j]; if (gone.has(b.id) || !triMatch(a, b) || a.hint || b.hint || (a.photoId && a.photoId === b.photoId)) continue;
      if (Math.hypot(a.x - b.x, a.y - b.y) < 0.45 * k) {
        const keepB = (b.ok && !a.ok) || (b.lk && !a.lk); const [kp, rm] = keepB ? [b, a] : [a, b];
        kp.n = Math.max(kp.n || 1, rm.n || 1); gone.add(rm.id); n++;
        if (kp.photoId && kp.d != null) kp.tri = (kp.tri || []).concat(rm.photoId && rm.d != null ? [{ p: rm.photoId, d: rm.d }] : [], rm.tri || []).filter(q => q.p !== kp.photoId);
        Sync.markItem(kp); Sync.markItem(rm); if (rm === a) break;
      }
    }
  }
  S.items = S.items.filter(i => !gone.has(i.id));
  return n;
}
function removeDrafts(ph) { S.items = S.items.filter(i => !(i.photoId === ph.id && !i.ok)); }
function deletePhoto(ph) {
  pushUndo();
  S.items.forEach(i => { if (i.photoId === ph.id && i.ok) { i.photoId = null; i.d = null; Sync.mark('plan:' + i.planId); } });
  S.items = S.items.filter(i => i.photoId !== ph.id);
  S.photos = S.photos.filter(p => p.id !== ph.id);
  Sync.del(pathFor('photo:' + ph.id)); IDB.del('blobs', 'photo_' + ph.id); Uploads.q.delete('photo_' + ph.id);
  Sync.mark('meta'); redraw();
}

/* ============ TAVOLOZZA SIMBOLI ============ */
function renderPenBar(p) {
  const d = S.penDraw && drawById(S.penDraw); const n = d ? d.strokes.length : 0;
  p.innerHTML = PEN_COLS.map(c => `<button class="sw${S.pen.col === c ? ' on' : ''}" data-pc="${c}" style="background:${c}" title="${c}"></button>`).join('') +
    `<label class="sw swc${PEN_COLS.includes(S.pen.col) ? '' : ' on'}" title="Altro colore" style="${PEN_COLS.includes(S.pen.col) ? '' : 'background:' + S.pen.col}"><input type="color" id="penCol" value="${S.pen.col}"></label>` +
    `<span class="pcat">Spessore</span>` + PEN_W.map(w => `<button class="pw${S.pen.w === w ? ' on' : ''}" data-pw="${w}" title="${w} px"><span style="height:${Math.min(w, 14)}px;background:${S.pen.col}"></span></button>`).join('') +
    `<button class="sm" data-pu="1" ${n ? '' : 'disabled'} style="flex:none">↶ Togli ultimo</button><button class="sm okb" data-pf="1" style="flex:none">Fine</button>`;
  p.querySelectorAll('[data-pc]').forEach(b => b.onclick = () => { S.pen.col = b.dataset.pc; renderPalette(); });
  p.querySelectorAll('[data-pw]').forEach(b => b.onclick = () => { S.pen.w = +b.dataset.pw; renderPalette(); });
  const ci = p.querySelector('#penCol'); ci.oninput = ci.onchange = () => { S.pen.col = ci.value; renderPalette(); };
  p.querySelector('[data-pu]').onclick = () => { const d2 = S.penDraw && drawById(S.penDraw); if (!d2) return; pushUndo(); d2.strokes.pop(); if (!d2.strokes.length) { S.draws = S.draws.filter(x => x !== d2); S.penDraw = null; } Sync.mark('plan:' + d2.planId); renderPalette(); redraw(); };
  p.querySelector('[data-pf]').onclick = () => { const id = S.penDraw; setTool('sel'); if (id && drawById(id)) select('draw', id); };
}
function renderPalette() {
  const p = $('#palette'); if (S.tool === 'pen') { p.classList.remove('hide'); renderPenBar(p); return; }
  if (S.tool !== 'sym') { p.classList.add('hide'); return; }
  p.classList.remove('hide');
  const ln = S.tmp.line || []; const q = (S.palQ || '').trim().toLowerCase();
  const lineBtns = symOf(S.symSel).mount === 'lineare' ? `<button class="sm okb" data-fin="1" ${ln.length < 2 ? 'disabled' : ''}>Fine (${ln.length})</button><button class="sm" data-clr="1">Annulla</button>` : '';
  const match = s => !q || q.split(/\s+/).every(w => (s.code + ' ' + s.name).toLowerCase().includes(w));
  const chip = s => `<button class="pchip${s.code === S.symSel ? ' on' : ''}" data-c="${esc(s.code)}" title="${esc(s.code + ' – ' + s.name)}"><img src="${symIcon(s, 44)}"><span><b>${esc(symShort(s))}</b> ${esc(s.name.split(/[(\/–]/)[0].trim().slice(0, 30))}</span></button>`;
  const rec = (S.recent || []).filter(c => S.lib.symbols.some(s => s.code === c)).map(symOf);
  let shown = 0;
  const cats = Object.entries(CATS).map(([c, cd]) => { const ss = S.lib.symbols.filter(s => s.cat === c && match(s)).slice(0, q ? 60 : 1000); shown += ss.length; return ss.length ? `<span class="pcat">${esc(cd.n)}</span>` + ss.map(chip).join('') : ''; }).join('');
  p.innerHTML = `<input id="palQ" class="palq" type="search" placeholder="Cerca simbolo…" value="${esc(S.palQ || '')}">` + lineBtns + (rec.length && !q ? `<span class="pcat">Recenti</span>${rec.map(chip).join('')}` : '') + (shown ? cats : '<span class="mut small" style="padding:0 8px">Nessun simbolo trovato</span>');
  p.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { S.symSel = b.dataset.c; S.tmp = {}; renderPalette(); updateHint(); redraw(); });
  const f = p.querySelector('[data-fin]'); if (f) f.onclick = finishLine;
  const cl = p.querySelector('[data-clr]'); if (cl) cl.onclick = () => { S.tmp = {}; renderPalette(); redraw(); };
  const inp = p.querySelector('#palQ'); inp.oninput = () => { S.palQ = inp.value; clearTimeout(S._palT); S._palT = setTimeout(() => { renderPalette(); const i2 = $('#palQ'); if (i2) { i2.focus(); const n = i2.value.length; try { i2.setSelectionRange(n, n); } catch (e) { } } }, 180); };
}

/* ============ NUOVA FOTO ============ */
let pendingPose = null;
function openPhotoSheet(pose) {
  pendingPose = pose; const attached = !!pose.itemId;
  if (!pose.kind) pose.kind = 'parete';
  const title = attached ? (pose.kind === 'quadro' ? 'Foto del quadro' : 'Foto di dettaglio') : pose.kind === 'parete' ? 'Foto verso la parete' : 'Foto puntuale (soffitto o pavimento)';
  const help = attached ? (pose.kind === 'quadro' ? 'Quadro aperto, inquadratura frontale, targhette leggibili. Se il quadro è grande fai più foto.' : '')
    : pose.kind === 'parete' ? 'Tablet in verticale davanti a te, nella direzione del cono.' : 'Tablet puntato in alto (soffitto) o in basso (pavimento), sopra il punto che hai toccato.';
  const b = openModal(`<h3>${title}</h3>${help ? `<div class="mut small">${help}</div>` : ''}
    <div class="row" style="margin-top:14px"><button class="pri" style="min-height:64px;font-size:17px" id="pCam">📷 Scatta</button><button style="min-height:64px;font-size:17px" id="pGal">🖼 Dalla galleria</button></div>
    <div class="acts"><button id="pCanc">Annulla</button></div>`);
  b.querySelector('#pCam').onclick = () => $('#fCam').click();
  b.querySelector('#pGal').onclick = () => $('#fGal').click();
  b.querySelector('#pCanc').onclick = () => { closeModal(); pendingPose = null; S.tmp = {}; if (!attached) setTool('sel'); else redraw(); };
}
function initPhotoInputs() {
  const h = async e => { const fs = [...e.target.files]; e.target.value = ''; if (!fs.length || !pendingPose) return; const pose = pendingPose; pendingPose = null; closeModal(); S.tmp = {}; if (!pose.itemId && S.tool !== 'sel') setTool('sel'); await addPhotos(fs, pose); };
  $('#fCam').onchange = h; $('#fGal').onchange = h;
}

/* ============ VISUALIZZATORE FOTO ============ */
const VW = { id: null, s: 1, tx: 0, ty: 0, boxes: true, hl: null };
function openViewer(id, detIdx, opt = {}) {
  const ph = photoById(id); if (!ph) return; VW.id = id; VW.hl = detIdx ?? null; VW.qd = opt.qd ?? null;
  $('#viewer').classList.remove('hide');
  const img = $('#vimg'); img.onload = () => { if (!ph.w) { ph.w = img.naturalWidth; ph.h = img.naturalHeight; } fitViewer(); drawBoxes(); };
  img.src = imgSrc(ph); if (img.complete && img.naturalWidth) { fitViewer(); drawBoxes(); }
  const room = roomById(ph.roomId); $('#vTitle').textContent = `${KINDS[ph.kind]} • ${room ? room.name : ''}`;
  const ai = ph.ai || {}; const its = S.items.filter(i => i.photoId === id);
  $('#vside').innerHTML = (ai.desc ? `<div>${esc(ai.desc)}</div>` : '<div style="opacity:.7">Nessuna analisi AI su questa foto.</div>') + ((ai.crit || []).length ? `<div style="color:#fbbf24;margin-top:4px">⚠ ${ai.crit.map(esc).join(' • ')}</div>` : '') +
    (its.length ? `<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px">${its.map(it => `<button class="sm" style="background:#22262e;color:#fff;border-color:#343a45" data-vi="${it.id}">${it.hint ? '⚠ ' : ''}${isPlate(it) ? 'Placca ' + it.pl.length : esc(symShort(symOf(it.s)))}${it.n > 1 ? '×' + it.n : ''} ${it.ok ? '✓' : ''}</button>`).join('')}</div>` : '');
  $('#vside').querySelectorAll('[data-vi]').forEach(b => b.onclick = () => { const it = itemById(b.dataset.vi); VW.qd = null; VW.hl = it.d; drawBoxes(); });
}
function closeViewer() { $('#viewer').classList.add('hide'); $('#vimg').src = ''; }
function fitViewer() {
  const st = $('#vstage'), img = $('#vimg'); const W = st.clientWidth, H = st.clientHeight, iw = img.naturalWidth || 1, ih = img.naturalHeight || 1;
  VW.s = Math.min(W / iw, H / ih); VW.tx = (W - iw * VW.s) / 2; VW.ty = (H - ih * VW.s) / 2; applyViewer();
}
function applyViewer() { const i = $('#vinner'); const img = $('#vimg'); i.style.width = img.naturalWidth + 'px'; i.style.height = img.naturalHeight + 'px'; i.style.transform = `translate(${VW.tx}px,${VW.ty}px) scale(${VW.s})`; }
function drawBoxes() {
  const ph = photoById(VW.id); const img = $('#vimg'); const svg = $('#vsvg'); const W = img.naturalWidth || 1, H = img.naturalHeight || 1;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); if (!VW.boxes || !ph || !ph.ai) { svg.innerHTML = ''; return; }
  const qr = VW.qd == null ? (ph.kind === 'quadro' ? ph.ai : null) : VW.qd === 'q' ? ph.ai : (ph.ai.qd && ph.ai.qd[VW.qd]);
  const cb = (qr && qr.crop) || [0, 0, 1, 1]; const mapB = bb => Array.isArray(bb) ? [cb[0] + bb[0] * (cb[2] - cb[0]), cb[1] + bb[1] * (cb[3] - cb[1]), cb[0] + bb[2] * (cb[2] - cb[0]), cb[1] + bb[3] * (cb[3] - cb[1])] : null;
  const list = qr && qr.app ? qr.app.map(d => ({ bbox: mapB(d.bbox), code: d.tipo === 'VUOTO' ? '' : fmtApp(d), q: 1 })) : (ph.ai.dets || []);
  const sw = Math.max(W, H) / 380;
  svg.innerHTML = list.map((d, i) => {
    if (!Array.isArray(d.bbox) || d.bbox.length !== 4) return '';
    const [x0, y0, x1, y1] = d.bbox; const col = d.q ? '#22d3ee' : d.indizio ? '#f59e0b' : symColor(symOf(d.code)); const hl = VW.hl === i;
    return `<rect x="${x0 * W}" y="${y0 * H}" width="${(x1 - x0) * W}" height="${(y1 - y0) * H}" fill="${hl ? 'rgba(250,204,21,.18)' : 'none'}" stroke="${hl ? '#facc15' : col}" stroke-width="${sw * (hl ? 2.2 : 1.3)}"/>
      <text x="${x0 * W}" y="${y0 * H - sw * 2}" fill="${hl ? '#facc15' : col}" font-size="${sw * 9}" font-weight="700" paint-order="stroke" stroke="#000" stroke-width="${sw * 2}">${d.indizio ? '⚠ ' : ''}${esc(d.q ? d.code : d.pl ? 'Placca: ' + d.pl.map(c => c ? symShort(symOf(c)) : '–').join(' · ') : symShort(symOf(d.code)))}${d.n > 1 ? '×' + d.n : ''}</text>`;
  }).join('');
}
function initViewer() {
  $('#vClose').onclick = closeViewer;
  $('#vBoxes').onclick = () => { VW.boxes = !VW.boxes; drawBoxes(); };
  const nav = d => { const ph = photoById(VW.id); const list = S.photos.filter(p => p.planId === ph.planId && (ph.roomId ? p.roomId === ph.roomId : true)); const i = list.findIndex(p => p.id === ph.id); const n = list[(i + d + list.length) % list.length]; if (n) openViewer(n.id); };
  $('#vPrev').onclick = () => nav(-1); $('#vNext').onclick = () => nav(1);
  const st = $('#vstage'); const P = new Map(); let g = null;
  st.addEventListener('pointerdown', e => { st.setPointerCapture(e.pointerId); P.set(e.pointerId, [e.clientX, e.clientY]); const v = [...P.values()]; g = v.length === 2 ? { d0: Math.hypot(v[0][0] - v[1][0], v[0][1] - v[1][1]), m0: [(v[0][0] + v[1][0]) / 2, (v[0][1] + v[1][1]) / 2], s0: VW.s, tx: VW.tx, ty: VW.ty } : { p0: [e.clientX, e.clientY], tx: VW.tx, ty: VW.ty }; });
  st.addEventListener('pointermove', e => {
    if (!P.has(e.pointerId) || !g) return; P.set(e.pointerId, [e.clientX, e.clientY]); const v = [...P.values()]; const r = st.getBoundingClientRect();
    if (g.d0 && v.length >= 2) { const d = Math.hypot(v[0][0] - v[1][0], v[0][1] - v[1][1]); const m = [(v[0][0] + v[1][0]) / 2, (v[0][1] + v[1][1]) / 2]; const ns = clamp(g.s0 * d / g.d0, 0.05, 20), k = ns / g.s0; VW.s = ns; VW.tx = (m[0] - r.left) - ((g.m0[0] - r.left) - g.tx) * k; VW.ty = (m[1] - r.top) - ((g.m0[1] - r.top) - g.ty) * k; applyViewer(); }
    else if (g.p0) { VW.tx = g.tx + e.clientX - g.p0[0]; VW.ty = g.ty + e.clientY - g.p0[1]; applyViewer(); }
  });
  const up = e => { P.delete(e.pointerId); if (!P.size) g = null; else { const v = [...P.values()][0]; g = { p0: v, tx: VW.tx, ty: VW.ty }; } };
  st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  st.addEventListener('wheel', e => { e.preventDefault(); const r = st.getBoundingClientRect(); const f = Math.exp(-e.deltaY * 0.0015); const sx = e.clientX - r.left, sy = e.clientY - r.top; const ns = clamp(VW.s * f, 0.05, 20), k = ns / VW.s; VW.tx = sx - (sx - VW.tx) * k; VW.ty = sy - (sy - VW.ty) * k; VW.s = ns; applyViewer(); }, { passive: false });
  st.addEventListener('dblclick', () => fitViewer());
}

/* ============ LIBRERIA SIMBOLI ============ */
function openLibrary() {
  const b = openModal(`<h3>Libreria simboli</h3>
    <div class="mut small">Sono i simboli della tua legenda (${S.lib.symbols.filter(s => s.leg).length}): disegno e nome blocco come nel tuo DXF. Puoi cambiare descrizione, categoria, posa e se l'AI li usa; puoi aggiungerne di tuoi.</div>
    <div id="libL" class="dlist" style="margin-top:10px"></div>
    <div class="acts"><button id="lReset" class="danger">Ripristina predefiniti</button><button id="lExp">Copia libreria (JSON)</button><button id="lImp">Incolla libreria</button><button id="lAdd">+ Nuovo simbolo</button><button class="pri" onclick="closeModal();renderPalette();renderPanel();redraw()">Fatto</button></div>`, true);
  const list = () => { b.querySelector('#libL').innerHTML = S.lib.symbols.map((s, i) => `<div class="drow" data-i="${i}"><img src="${symIcon(s, 40)}"><div class="g"><div><b>${esc(s.code)}</b> ${esc(s.name)}</div><div class="mut small">${esc(CATS[s.cat]?.n || s.cat)} • ${MOUNTS[s.mount] || s.mount}${s.ai === 0 ? ' • non usato dall\'AI' : ''}</div></div><span class="mut">›</span></div>`).join(''); b.querySelectorAll('[data-i]').forEach(r => r.onclick = () => editSymbol(+r.dataset.i)); };
  list();
  b.querySelector('#lAdd').onclick = () => editSymbol(-1);
  b.querySelector('#lReset').onclick = async () => { if (await askConfirm('Ripristinare i simboli della legenda? Le modifiche e i simboli aggiunti si perdono.', 'Ripristina', true)) { S.lib.symbols = DEFAULT_SYMBOLS.map(s => ({ ...s })); S.lib.legV = LEGENDA.v; symsChanged(); Sync.mark('lib'); } openLibrary(); };
  b.querySelector('#lExp').onclick = async () => { try { await navigator.clipboard.writeText(JSON.stringify(S.lib.symbols)); toast('Libreria copiata negli appunti'); } catch (e) { toast('Copia non consentita qui', true); } };
  b.querySelector('#lImp').onclick = async () => {
    const t = await askText('Incolla libreria', 'JSON della libreria'); if (!t) return openLibrary();
    try { const a = JSON.parse(t); if (!Array.isArray(a) || !a.every(s => s.code && s.name)) throw 0; S.lib.symbols = a.map(s => { const o = { code: String(s.code), name: String(s.name), cat: CATS[s.cat] ? s.cat : 'X', mount: MOUNTS[s.mount] ? s.mount : 'parete', shape: SHAPES[s.shape] ? s.shape : 'circle', color: /^#[0-9a-f]{6}$/i.test(s.color) ? s.color : '#64748b', img: typeof s.img === 'string' && s.img.startsWith('data:image/') ? s.img : undefined }; if (s.leg && LEG.has(o.code)) Object.assign(o, { leg: 1, short: s.short || LEG.get(o.code).s, block: s.block || LEG.get(o.code).b, ai: s.ai === 0 ? 0 : 1 }); else if (s.ai === 0) o.ai = 0; return o; }); if (!S.lib.symbols.some(s => s.code === 'X')) S.lib.symbols.push({ ...DEFAULT_SYMBOLS.find(s => s.code === 'X') }); symsChanged(); Sync.mark('lib'); toast('Libreria importata'); } catch (e) { toast('JSON non valido', true); }
    openLibrary();
  };
}
function editSymbol(i) {
  const s = i >= 0 ? { ...S.lib.symbols[i] } : { code: '', name: '', cat: 'X', mount: 'parete', shape: 'circle', color: '#2563eb' };
  const leg = !!(s.leg && LEG.has(s.code));
  const b = openModal(`<h3>${i >= 0 ? 'Modifica simbolo' : 'Nuovo simbolo'}</h3>
    ${leg ? `<div class="row" style="align-items:center"><img src="${symIcon(s, 96)}" width="64" style="background:#f8fafc;border:1px solid var(--line);border-radius:8px"><div class="small mut">Blocco <b>${esc(s.block || s.code)}</b> della tua legenda: il disegno è quello del DXF.</div></div>` : ''}
    <div class="row"><div style="flex:.5"><label class="f">Sigla</label><input id="sC" value="${esc(s.code)}" ${i >= 0 ? 'disabled' : ''} maxlength="16"></div><div><label class="f">Descrizione</label><input id="sN" value="${esc(s.name)}"></div></div>
    <div class="row"><div><label class="f">Categoria</label><select id="sCat">${Object.entries(CATS).map(([k, v]) => `<option value="${k}"${k === s.cat ? ' selected' : ''}>${v.n}</option>`).join('')}</select></div>
    <div><label class="f">Posa tipica</label><select id="sM">${Object.entries(MOUNTS).map(([k, v]) => `<option value="${k}"${k === s.mount ? ' selected' : ''}>${v}</option>`).join('')}</select></div></div>
    <label class="row small" style="margin-top:10px"><input type="checkbox" id="sAI" style="width:auto;min-height:0" ${s.ai === 0 ? '' : 'checked'}> L'AI può usare questo simbolo nel rilievo</label>
    ${leg ? '' : `<div class="row"><div><label class="f">Forma</label><select id="sS">${Object.entries(SHAPES).map(([k, v]) => `<option value="${k}"${k === s.shape ? ' selected' : ''}>${v}</option>`).join('')}</select></div>
    <div style="flex:.5"><label class="f">Colore</label><input id="sCol" type="color" value="${esc(s.color || '#2563eb')}" style="padding:2px"></div>
    <div style="flex:.4;text-align:center"><label class="f">Anteprima</label><img id="sPrev" width="40"></div></div>
    <div class="row" style="margin-top:10px"><button class="sm" id="sImg">Usa un'immagine…</button><button class="sm" id="sImgX" ${s.img ? '' : 'disabled'}>Togli immagine</button></div>`}
    <div class="acts">${i >= 0 && s.code !== 'X' ? '<button class="danger" id="sDel">Elimina</button>' : ''}<button id="sCanc">Annulla</button><button class="pri" id="sOk">Salva</button></div>`);
  const rd = () => { if (leg) return; s.shape = b.querySelector('#sS').value; s.color = b.querySelector('#sCol').value; b.querySelector('#sPrev').src = symIcon(s, 48); };
  if (!leg) {
    rd(); b.querySelector('#sS').onchange = rd; b.querySelector('#sCol').oninput = rd;
    b.querySelector('#sImg').onclick = () => { const f = $('#fSymImg'); f.onchange = async () => { const file = f.files[0]; f.value = ''; if (!file) return; try { const bm = await createImageBitmap(file); const c = newCanvas(64, 64, false); const k = Math.min(64 / bm.width, 64 / bm.height); c.getContext('2d').drawImage(bm, (64 - bm.width * k) / 2, (64 - bm.height * k) / 2, bm.width * k, bm.height * k); s.img = c.toDataURL('image/png'); b.querySelector('#sImgX').disabled = false; rd(); } catch (e) { toast('Immagine non leggibile', true); } }; f.click(); };
    b.querySelector('#sImgX').onclick = () => { delete s.img; rd(); };
  }
  b.querySelector('#sCanc').onclick = openLibrary;
  const del = b.querySelector('#sDel'); if (del) del.onclick = async () => { const used = S.items.filter(it => it.s === s.code).length; if (await askConfirm(`Eliminare ${s.code}?${used ? ` ${used} elementi di questo sopralluogo diventano "Altro".` : ''}`, 'Elimina', true)) { S.lib.symbols.splice(i, 1); symsChanged(); S.items.forEach(it => { if (it.s === s.code) { it.s = 'X'; Sync.markItem(it); } }); Sync.mark('lib'); } openLibrary(); };
  b.querySelector('#sOk').onclick = () => {
    if (i < 0) s.code = (b.querySelector('#sC').value || '').trim().toUpperCase().replace(/[^A-Z0-9_.-]/g, '');
    s.name = b.querySelector('#sN').value.trim(); s.cat = b.querySelector('#sCat').value; s.mount = b.querySelector('#sM').value; s.ai = b.querySelector('#sAI').checked ? 1 : 0; rd();
    if (!s.code || !s.name) { toast('Sigla e descrizione obbligatorie', true); return; }
    if (i < 0 && S.lib.symbols.some(x => x.code === s.code)) { toast('Sigla già usata', true); return; }
    if (i >= 0) S.lib.symbols[i] = s; else S.lib.symbols.push(s);
    symsChanged(); Sync.mark('lib'); openLibrary();
  };
}

/* ============ IMPOSTAZIONI ============ */
async function openSettings() {
  const st = ST();
  const b = openModal(`<h3>Impostazioni</h3>${PLATFORM === 'pwa' ? pwaSettingsHtml() : ''}
    <label class="f">Riconoscimento AI</label>
    <div class="row"><select id="tTier"><option value="quick">Veloce (meno preciso)</option><option value="default">Standard (consigliato)</option><option value="complex">Massima precisione (più lento)</option></select>
    <label class="row small" style="flex:none"><input type="checkbox" id="tAuto" style="width:auto;min-height:0" ${st.auto ? 'checked' : ''}> Analizza subito ogni foto</label></div>
    <div class="row"><div><label class="f">Campo visivo fotocamera (°)</label><input id="tFov" type="number" value="${st.fov}"></div><div><label class="f">Altezza tablet (m)</label><input id="tCam" type="number" step="0.05" value="${st.camH}"></div><div><label class="f">Altezza locali default (m)</label><input id="tH" type="number" step="0.05" value="${st.roomH}"></div></div>
    <div class="mut small">Campo visivo: lato lungo della foto. Taratura: fotografa in orizzontale una parete da 2 m di distanza e misura quanti metri entrano nella foto (L): FOV = 2·atan(L/4).</div>
    <label class="f">Disegno</label>
    <div class="row"><label class="row small" style="flex:none"><input type="checkbox" id="tOrtho" style="width:auto;min-height:0" ${st.ortho !== false ? 'checked' : ''}> Raddrizza i lati delle stanze (orizzontali/verticali)</label><div style="flex:.5"><label class="f">Dimensione simboli (px)</label><input id="tSym" type="number" value="${st.symPx}"></div></div>
    <label class="row small"><input type="checkbox" id="tPen" style="width:auto;min-height:0" ${st.penOnly !== false ? 'checked' : ''}> Con la penna (Apple Pencil, S Pen…): la penna disegna e posiziona, le dita spostano soltanto la pianta e il palmo non lascia segni</label>
    <div id="tStore" class="mut small" style="margin-top:10px"></div>
    <div class="acts"><button onclick="closeModal()">Annulla</button><button class="pri" id="tOk">Salva</button></div>`);
  b.querySelector('#tTier').value = st.tier;
  b.querySelector('#tOk').onclick = () => {
    st.tier = b.querySelector('#tTier').value; st.auto = b.querySelector('#tAuto').checked;
    st.fov = clamp(num(b.querySelector('#tFov').value, 66), 30, 120); st.camH = clamp(num(b.querySelector('#tCam').value, 1.4), 0.3, 3);
    st.roomH = clamp(num(b.querySelector('#tH').value, 2.7), 2, 30); st.ortho = b.querySelector('#tOrtho').checked;
    st.symPx = clamp(num(b.querySelector('#tSym').value, 22), 12, 48); st.penOnly = b.querySelector('#tPen').checked;
    if (PLATFORM === 'pwa') pwaSettingsSave(b);
    Sync.mark('lib'); closeModal(); updateHint(); redraw();
  };
  if (PLATFORM === 'pwa') pwaSettingsWire(b);
  const sEl = b.querySelector('#tStore');
  sEl.textContent = PLATFORM === 'pwa' ? 'Dati salvati su questo tablet.' : CAP.db ? 'Dati salvati sul tuo account Claude (privati).' : 'Attenzione: i dati restano solo in questo browser. Esporta spesso.';
  if (PLATFORM === 'pwa' && navigator.storage && navigator.storage.estimate) { try { const e = await navigator.storage.estimate(); sEl.textContent += ` Spazio usato: ${Math.round((e.usage || 0) / 1048576)} MB.`; } catch (e) { } }
  if (CAP.assets) { try { const l = await CAP.assets.list(); const u = l.usage; if (u && u.maxBytes) sEl.textContent += ` Spazio foto: ${Math.round(u.bytes / 1048576)} MB su ${Math.round(u.maxBytes / 1048576)} MB (${u.files} file).`; } catch (e) { } }
}
