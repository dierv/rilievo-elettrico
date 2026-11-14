/* ============ COMPUTO ============ */
const lineLenM = it => { if (!it.pts) return 0; const k = ppm(planOf(it.planId)); let L = 0; for (let i = 1; i < it.pts.length; i++) L += dist(it.pts[i - 1], it.pts[i]); return L / k; };
const qtyOf = it => symOf(it.s).mount === 'lineare' ? lineLenM(it) * (it.n || 1) : (it.n || 1);
const umOf = code => symOf(code).mount === 'lineare' ? 'm' : 'nr';
const safeName = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40) || 'x';
function photoNumbers() { const m = new Map(); S.photos.slice().sort((a, b) => (a.t || 0) - (b.t || 0)).forEach((p, i) => m.set(p.id, 'F' + String(i + 1).padStart(3, '0'))); return m; }
function allQuadri() { // un quadro per simbolo QE (lettura migliore) + foto di quadri non agganciate a un simbolo
  const out = []; const seen = new Set();
  S.items.filter(it => !it.hint && isQuadroCode(it.s)).forEach(it => { const r = bestReading(it); quadroReadings(it).forEach(x => seen.add(x.ph.id + ':' + x.d)); out.push({ it, ph: r ? r.ph : null, q: r ? r.q : null, room: it.roomId, name: quadroLabel(it) }); });
  S.photos.filter(p => p.kind === 'quadro' && p.ai && p.ai.app && !seen.has(p.id + ':null')).forEach(p => out.push({ it: null, ph: p, q: p.ai, room: p.roomId, name: (p.ai.quadro && p.ai.quadro.etichetta) || 'Quadro' }));
  return out;
}
function totals(items) {
  const m = {}; for (const it of items) { if (it.hint) continue; for (const { k, q } of itemParts(it)) { m[k] = m[k] || { q: 0, dr: 0 }; m[k].q += q; if (!it.ok) m[k].dr += q; } } return m;
}
function totTable(items) {
  const m = totals(items); const ks = Object.keys(m).sort(); if (!ks.length) return '<div class="mut small">Nessun elemento.</div>';
  return `<table class="t"><tr><th></th><th>Sigla</th><th>Descrizione</th><th class="n">Q.tà</th><th>UM</th><th class="n">di cui bozze</th></tr>${ks.map(k => { const s = symOf(kCode(k)); const u = umOf(kCode(k)); return `<tr><td><img src="${symIcon(s, 40)}" width="18"></td><td><b>${esc(kCode(k))}</b></td><td>${esc(kName(k))}</td><td class="n"><b>${itNum(m[k].q, u === 'm' ? 1 : 0)}</b></td><td>${u}</td><td class="n">${m[k].dr ? itNum(m[k].dr, u === 'm' ? 1 : 0) : ''}</td></tr>`; }).join('')}</table>`;
}
function openComputo() {
  const sv = S.sv; const dr = S.items.filter(i => !i.ok && !i.hint).length;
  const quadri = allQuadri(); const hints = S.items.filter(i => i.hint);
  const crit = S.photos.flatMap(p => ((p.ai && p.ai.crit) || []).map(c => [roomLabel(p.roomId), c]));
  const b = openModal(`<h3>Computo e esportazione – ${esc(sv.name)}</h3>
    ${dr ? `<div class="banner warn">${dr} elementi sono ancora bozze AI non confermate: sono inclusi ma segnati come "bozza".</div>` : ''}
    <div class="row wrap" style="margin:12px 0"><button class="pri" id="xZip">⬇ Esporta pacchetto ZIP</button><label class="row small" style="flex:none"><input type="checkbox" id="xPh" checked style="width:auto;min-height:0"> includi foto</label>
      <button id="xTsv">Copia tabella per Excel</button><button class="ai" id="xRel" ${canAI() ? '' : 'disabled'}>✦ Relazione stato di fatto</button><button id="xFull">Backup completo (foto e audio)</button><button id="xJson">Backup solo dati</button></div>
    <div class="mut small">Backup completo: un file ZIP con tutto il sopralluogo, da reimportare qui o nell'${PLATFORM === 'pwa' ? 'app in Claude' : 'app installata sul tablet'} (Importa backup).</div>
    ${costLine(sv)}
    <div class="mut small">Lo ZIP contiene: DXF per tavola (blocchi per sigla, layer per categoria, coordinate reali), CSV per Excel (elementi, computo per locale, totali, quadri, foto), PNG della pianta annotata, foto numerate F001… come sul DXF${S.vnotes.length ? ', note audio N1…' : ''}.</div>
    <div id="xRelBox"></div>
    <div class="sec"><b>Totale sopralluogo</b>${totTable(S.items)}</div>
    ${sv.plans.map(P => `<div class="sec"><b>${esc(P.name)}</b>${S.rooms.filter(r => r.planId === P.id).map(r => { const its = S.items.filter(i => i.roomId === r.id && !i.hint); return `<details style="margin-top:6px"><summary>${r.done ? '✅' : '⬜'} <b>${esc(r.name)}</b> <span class="mut small">${its.length} elementi</span></summary>${totTable(its)}</details>`; }).join('')}
      ${(() => { const its = S.items.filter(i => i.planId === P.id && !roomById(i.roomId) && !i.hint); return its.length ? `<details style="margin-top:6px"><summary><b>${EXT_NAME}</b> <span class="mut small">${its.length} elementi</span></summary>${totTable(its)}</details>` : ''; })()}</div>`).join('')}
    ${quadri.length ? `<div class="sec"><b>Quadri</b>${quadri.map(Qx => `<details style="margin-top:6px"><summary><b>${esc(Qx.name)}</b> <span class="mut small">${esc(roomLabel(Qx.room))} • ${Qx.q ? (() => { const st = quadroStats(Qx.q); return (st.tot != null ? st.tot + ' moduli • ' : '') + st.dev.length + ' apparecchi'; })() : 'contenuto da fotografare'}</span></summary>${Qx.q ? quadroView(Qx.q, {}) : ''}</details>`).join('')}</div>` : ''}
    ${hints.length ? `<div class="sec"><b>⚠ Indizi da verificare (${hints.length})</b><div class="mut small">Non conteggiati nel computo.</div><ul class="small" style="padding-left:18px">${hints.map(h => `<li><b>${esc(roomLabel(h.roomId))}</b> ${esc(h.note || '')} <span class="mut">(probabile ${esc(symShort(symOf(h.s)))})</span></li>`).join('')}</ul></div>` : ''}
    ${S.vnotes.length ? `<div class="sec"><b>🎙 Note audio (${S.vnotes.length})</b><div class="mut small">Nello ZIP: file nella cartella audio, elenco in csv/note_audio.csv, simboli N1… sul DXF.</div><ul class="small" style="padding-left:18px">${S.vnotes.slice().sort((a, b) => a.num - b.num).map(n => `<li><b>${vnLabel(n)}</b> ${esc(roomLabel(n.roomId))}${n.dur ? ' • ' + fmtDur(n.dur) : ''}${n.text ? ' – ' + esc(n.text.slice(0, 160)) : ''}</li>`).join('')}</ul></div>` : ''}
    ${crit.length ? `<div class="sec"><b>Criticità segnalate dall'AI</b><ul class="small" style="padding-left:18px">${crit.map(([r, c]) => `<li><b>${esc(r)}</b> ${esc(c)}</li>`).join('')}</ul></div>` : ''}
    <div class="acts"><button class="pri" onclick="closeModal()">Chiudi</button></div>`, true);
  b.querySelector('#xZip').onclick = async e => { e.target.disabled = true; e.target.textContent = 'Preparo lo ZIP…'; try { await exportZip(b.querySelector('#xPh').checked, m => e.target.textContent = m); } catch (err) { console.error(err); toast('Errore export: ' + (err.message || err), true, 6000); } e.target.disabled = false; e.target.textContent = '⬇ Esporta pacchetto ZIP'; };
  b.querySelector('#xTsv').onclick = async () => {
    const rows = [['Tavola', 'Locale', 'Sigla', 'Descrizione', 'Quantità', 'UM', 'di cui bozze']];
    for (const P of sv.plans) for (const r of [...S.rooms.filter(x => x.planId === P.id), { id: null, name: EXT_NAME, planId: P.id }]) {
      const its = S.items.filter(i => i.planId === P.id && (r.id ? i.roomId === r.id : !roomById(i.roomId))); const m = totals(its);
      Object.keys(m).sort().forEach(k => rows.push([P.name, r.name, kCode(k), kName(k), itNum(m[k].q, umOf(kCode(k)) === 'm' ? 1 : 0), umOf(kCode(k)), m[k].dr ? itNum(m[k].dr, 1) : '']));
    }
    try { await navigator.clipboard.writeText(rows.map(r => r.join('\t')).join('\n')); toast('Tabella copiata: incollala in Excel'); } catch (e) { toast('Copia non consentita qui', true); }
  };
  b.querySelector('#xJson').onclick = async () => { const data = JSON.stringify({ app: 'rilievo-elettrico', v: 1, survey: S.sv, rooms: S.rooms, items: S.items, draws: S.draws, vnotes: S.vnotes, photos: S.photos.map(cleanPhoto), lib: S.lib }, null, 1); await saveFile(`backup_${safeName(sv.name)}.json`, new Blob([data], { type: 'application/json' })); };
  b.querySelector('#xRel').onclick = () => relazioneAI(b.querySelector('#xRelBox'));
  b.querySelector('#xFull').onclick = async e => { const bt = e.target; bt.disabled = true; try { const { blob, miss } = await fullBackupZip(m => bt.textContent = m); if (await saveFile(`backup_${safeName(sv.name)}_${new Date().toISOString().slice(0, 10)}.zip`, blob)) { sv.lastBackup = Date.now(); Sync.mark('meta'); } if (miss) toast(`${miss} file non disponibili: non sono nel backup`, true, 6000); } catch (err) { console.error(err); toast('Backup non riuscito: ' + (err.message || err), true, 6000); } bt.disabled = false; bt.textContent = 'Backup completo (foto e audio)'; };
}

/* ---- backup completo: dati + piante + foto + audio in un solo ZIP ---- */
const surveySnapshot = () => ({ app: 'rilievo-elettrico', v: 2, saved: Date.now(), survey: S.sv, rooms: S.rooms, items: S.items, draws: S.draws, vnotes: S.vnotes, photos: S.photos.map(cleanPhoto), lib: S.lib, closure: S.closure || {} });
const extOfBlob = (b, d) => ({ 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' })[b && b.type] || d;
async function fullBackupZip(prog) {
  await needLib('zip'); const zip = new JSZip(); const snap = surveySnapshot(); const files = {}; let miss = 0;
  const add = async (key, get, def) => { try { const b = await get(); const name = `file/${key}.${extOfBlob(b, def)}`; zip.file(name, b, { compression: 'STORE' }); files[key] = name; } catch (e) { miss++; } };
  for (const P of S.sv.plans) { prog && prog('Pianta ' + P.name + '…'); await add('plan_' + P.id, () => getBlob('plan_' + P.id, P.asset), 'png'); }
  let i = 0; for (const p of S.photos) { i++; prog && prog(`Foto ${i}/${S.photos.length}…`); await add('photo_' + p.id, () => getBlob('photo_' + p.id, p.asset), 'jpg'); }
  for (const n of S.vnotes.filter(n => n.mime)) { prog && prog('Audio ' + vnLabel(n) + '…'); await add('audio_' + n.id, () => vnAudioBlob(n), n.ext || 'm4a'); }
  snap.files = files; zip.file('rilievo.json', JSON.stringify(snap));
  prog && prog('Comprimo…');
  return { blob: await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 3 } }), miss };
}
/* ---- spesa AI (solo app installata, con la chiave API) ---- */
const fmtUsd = v => (v || 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: v && v < 0.1 ? 3 : 2 }) + ' $';
function costLine(sv) {
  const c = sv && sv.cost; if (!c || !c.calls) return PLATFORM === 'pwa' ? '<div class="mut small" style="margin-top:6px">Spesa AI per questo sopralluogo: 0 $</div>' : '';
  return `<div class="banner" style="margin-top:8px">✦ Spesa AI per questo sopralluogo: <b>${fmtUsd(c.usd)}</b> <span class="mut small">(${c.calls} analisi; stima dai token restituiti dall'API, prezzi in dollari)</span></div>`;
}

/* ---- relazione AI ---- */
async function relazioneAI(box) {
  const sv = S.sv;
  const data = {
    sopralluogo: { nome: sv.name, cliente: sv.client, indirizzo: sv.address, data: fmtDate(sv.created) },
    tavole: sv.plans.map(P => ({
      tavola: P.name,
      locali: S.rooms.filter(r => r.planId === P.id).map(r => {
        const m = totals(S.items.filter(i => i.roomId === r.id)); const phs = S.photos.filter(p => p.roomId === r.id);
        return { locale: r.name, tipo: r.kind, altezza_m: r.h, rilevato: r.done, note_tecnico: r.note, elementi: Object.keys(m).map(k => `${kName(k)}: ${itNum(m[k].q, 1)} ${umOf(kCode(k))}`), osservazioni_foto: phs.map(p => p.ai && p.ai.desc).filter(Boolean), criticita: phs.flatMap(p => (p.ai && p.ai.crit) || []), indizi_da_verificare: S.items.filter(i => i.roomId === r.id && i.hint).map(i => i.note).filter(Boolean), note_elementi: S.items.filter(i => i.roomId === r.id && i.note && !i.hint).map(i => `${symShort(symOf(i.s))}: ${i.note}`).slice(0, 30) };
      }),
      esterni: (() => { // fuori dai locali: facciate, cortili, aree esterne
        const its = S.items.filter(i => i.planId === P.id && !roomById(i.roomId)); const phs = S.photos.filter(p => p.planId === P.id && !roomById(p.roomId) && p.x != null);
        if (!its.length && !phs.length) return undefined; const m = totals(its);
        return { elementi: Object.keys(m).map(k => `${kName(k)}: ${itNum(m[k].q, 1)} ${umOf(kCode(k))}`), osservazioni_foto: phs.map(p => p.ai && p.ai.desc).filter(Boolean), criticita: phs.flatMap(p => (p.ai && p.ai.crit) || []) };
      })(),
    })),
    quadri: allQuadri().filter(Qx => Qx.q).map(Qx => ({ sigla: Qx.name, locale: roomLabel(Qx.room), quadro: Qx.q.quadro, apparecchi: Qx.q.app.filter(d => d.tipo !== 'VUOTO').map(d => `${d.id}: ${fmtApp(d)}${d.funzione ? ' – ' + d.funzione : ''}${d.etichetta ? ' «' + d.etichetta + '»' : ''}${d.a_monte ? ' (sotto ' + d.a_monte + ')' : ''}`), criticita: Qx.q.crit })),
  };
  const prompt = `Sei un progettista elettrico. Con i dati del rilievo qui sotto scrivi in italiano una relazione tecnica sintetica "Stato di fatto dell'impianto elettrico", pronta da incollare in un documento.
Struttura: 1) Premessa (sopralluogo, luogo, data, metodo: rilievo a vista con documentazione fotografica); 2) Descrizione dell'impianto per ambienti (paragrafi brevi, quantità principali; gli "indizi da verificare" citali come punti da controllare, non come impianto rilevato); 3) Quadri elettrici e protezioni (se presenti: dimensione in moduli, schema generale → differenziali → linee); 4) Criticità e non conformità apparenti (elenco puntato, senza citare articoli di norma se non sei certo); 5) Indicazioni per la progettazione e verifiche da eseguire (es. misure di continuità, isolamento, impianto di terra, prova differenziali).
Tono tecnico e sobrio, testo semplice senza markdown pesante (titoli numerati e trattini vanno bene). Non inventare dati che non ci sono; dove un dato manca scrivi "da verificare". Ricorda che le quantità derivano da rilievo fotografico assistito e vanno verificate.

DATI:
${JSON.stringify(data).slice(0, 120000)}`;
  box.innerHTML = `<div class="sec"><div class="row"><b>Relazione stato di fatto</b><button class="sm" style="flex:none" id="rCopy" disabled>Copia</button><button class="sm" style="flex:none" id="rStop">Stop</button></div><textarea id="rTxt" style="min-height:300px;margin-top:6px" placeholder="Sto scrivendo…"></textarea></div>`;
  const ta = box.querySelector('#rTxt'); const ctl = new AbortController(); box.querySelector('#rStop').onclick = () => ctl.abort();
  box.querySelector('#rCopy').onclick = async () => { try { await navigator.clipboard.writeText(ta.value); toast('Relazione copiata'); } catch (e) { ta.select(); toast('Seleziona e copia a mano', true); } };
  try {
    const { text } = await CAP.sample(prompt, { signal: ctl.signal, cache: false, modelTier: 'default', onText: ({ text }) => { ta.value = text; } });
    ta.value = text;
  } catch (e) { if (e && e.text) ta.value = e.text; if (!e || e.code !== 'cancelled') toast(AI_ERR[e && e.code] || 'Errore nella generazione', true); if (e && e.code === 'not_granted') CAP.aiOff = true; }
  box.querySelector('#rCopy').disabled = false; box.querySelector('#rStop').remove();
}

/* ---- salvataggio file ---- */
async function saveFile(filename, data) {
  if (CAP.dl) {
    try { const r = await CAP.dl.save({ filename, data }); if (r && r.status === 'saved') toast('File salvato: ' + filename); return true; }
    catch (e) { const c = e && e.code; if (c === 'declined') return false; toast(c === 'rate_limited' ? 'Attendi qualche secondo e riprova' : 'Download non disponibile qui (' + c + ')', true); return false; }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(data instanceof Blob ? data : new Blob([data])); a.download = filename; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 3000); return true;
}

/* ---- CSV ---- */
const csvCell = v => { const s = v == null ? '' : String(v); return /[;"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const csv = rows => '﻿' + rows.map(r => r.map(csvCell).join(';')).join('\r\n');

/* ---- DXF R2000 (AC1015): handle, tabelle complete, blocchi; immagine di sfondo come IMAGE per le tavole da PDF/foto ---- */
function dxfText(s) { return String(s).replace(/[\r\n]+/g, ' ').replace(/[^\x20-\x7e]/g, c => '\\U+' + c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')); }
function shapePoly(shape) {
  const P = {
    square: [[-.75, -.75], [.75, -.75], [.75, .75], [-.75, .75]], squareX: [[-.75, -.75], [.75, -.75], [.75, .75], [-.75, .75]], rect: [[-1.05, -.55], [1.05, -.55], [1.05, .55], [-1.05, .55]],
    tri: [[0, -.9], [.85, .65], [-.85, .65]], diamond: [[0, -.95], [.85, 0], [0, .95], [-.85, 0]], hex: [0, 1, 2, 3, 4, 5].map(i => [Math.cos(i * Math.PI / 3) * .9, Math.sin(i * Math.PI / 3) * .9]),
    star: Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? .42 : .95; return [Math.cos(a) * r, Math.sin(a) * r]; }),
    semi: Array.from({ length: 13 }, (_, i) => { const a = Math.PI + i * Math.PI / 12; return [Math.cos(a) * .85, .35 + Math.sin(a) * .85]; }),
  }; return P[shape] || null;
}
const DXF_INSUNITS = { 1000: 4, 100: 5, 1: 6 }; // unità disegno per metro → $INSUNITS (mm, cm, m)
// img = { file, w, h }: file immagine (nella stessa cartella del DXF) da mettere sotto il rilievo, sul layer RIL_SFONDO
function buildDxf(P, pnum, img = null) {
  const out = []; const g = (c, v) => { out.push(String(c)); out.push(typeof v === 'number' ? (Number.isInteger(v) ? String(v) : v.toFixed(6)) : String(v)); };
  let hs = 0x100; const H = () => (hs++).toString(16).toUpperCase(); const MS = '1F', PS = '1B'; // handle dei record di spazio modello e carta
  const T = P.dxf ? ((x, y) => [P.dxf.minX + x / P.dxf.s, P.dxf.maxY - y / P.dxf.s]) : ((x, y) => { const k = ppm(P); return [x / k, -y / k]; });
  const U = P.dxf ? 1 / P.dxf.u : 1; // unità disegno per metro
  if (P.dxf) img = null; // la tavola viene da un DXF: il disegno ce l'ha già l'utente, il rilievo si sovrappone
  const layers = new Map([['RIL_LOCALI', 8], ['RIL_LOCALI_NOMI', 7], ['RIL_SIGLE', 7], ['RIL_NOTE', 9], ['RIL_FOTO', 140], ['RIL_INDIZI', 40], ['RIL_DISEGNO', 1], ['RIL_NOTE_AUDIO', aciOf(VN_COL)]]);
  if (img) layers.set('RIL_SFONDO', 7);
  Object.values(CATS).forEach(c => { layers.set(c.layer, c.aci); layers.set(c.layer + '_BOZZE', 211); if (closedAt()) { layers.set(c.layer + '_PROGETTO', 5); layers.set(c.layer + '_PROGETTO_BOZZE', 211); layers.set(c.layer + '_RIMOSSI', 8); } });
  const all = S.items.filter(i => i.planId === P.id); const items = all.filter(i => !i.hint).concat(closedAt() && !Sync.paused ? techRemoved(P.id).map(o => ({ ...o, ok: true, _rem: true })) : []); // dopo la chiusura anche gli elementi rimossi, sul loro layer
  const used = [...new Set(items.filter(i => !i.pts).flatMap(i => isPlate(i) ? plCodes(i).filter(Boolean) : [i.s]))];
  const fatesUsed = new Set(items.map(i => i.fate).filter(Boolean)); // layer del destino solo se servono
  Object.values(CATS).forEach(c => fatesUsed.forEach(f => { layers.set(c.layer + FATE_LAYER[f], { rimuovere: 1, sostituire: 30, nuovo: 3 }[f]); layers.set(c.layer + FATE_LAYER[f] + '_BOZZE', 211); }));
  const [x0, y0] = T(0, P.h), [x1, y1] = T(P.w, 0); const exMin = [Math.min(x0, x1), Math.min(y0, y1)], exMax = [Math.max(x0, x1), Math.max(y0, y1)];
  const IH = img ? { dict: H(), def: H(), react: H(), vars: H(), ent: H() } : null;
  // ---- entità (con handle, proprietario e marcatori di sottoclasse) ----
  const ent = (type, layer, owner, color) => { g(0, type); g(5, H()); g(330, owner || MS); g(100, 'AcDbEntity'); g(8, layer); if (color != null) g(62, color); };
  const lwp = (layer, pts, closed, o = {}) => { ent('LWPOLYLINE', layer, o.owner, o.color); g(100, 'AcDbPolyline'); g(90, pts.length); g(70, closed ? 1 : 0); if (o.w) g(43, o.w); pts.forEach((p, i) => { g(10, p[0]); g(20, p[1]); if (o.vw) { g(40, o.vw[i][0]); g(41, o.vw[i][1]); } }); };
  const line = (layer, a, b, o = {}) => { ent('LINE', layer, o.owner, o.color); g(100, 'AcDbLine'); g(10, a[0]); g(20, a[1]); g(30, 0); g(11, b[0]); g(21, b[1]); g(31, 0); };
  const circ = (layer, x, y, r, o = {}) => { ent('CIRCLE', layer, o.owner, o.color); g(100, 'AcDbCircle'); g(10, x); g(20, y); g(30, 0); g(40, r); };
  const text = (layer, x, y, h, s, center, o = {}) => {
    ent('TEXT', layer, o.owner, o.color); g(100, 'AcDbText'); g(10, x); g(20, y); g(30, 0); g(40, h); g(1, dxfText(s)); if (o.rot) g(50, o.rot); if (o.wf && o.wf !== 1) g(41, o.wf); g(7, 'Standard');
    const ha = center ? 1 : (o.ha || 0), va = center ? 2 : (o.va || 0); if (ha || va) { g(72, ha); g(11, x); g(21, y); g(31, 0); } g(100, 'AcDbText'); if (va) g(73, va);
  };
  const solid = (layer, c, a, b, d, e, owner) => { ent('SOLID', layer, owner, c); g(100, 'AcDbTrace'); g(10, a[0]); g(20, a[1]); g(30, 0); g(11, b[0]); g(21, b[1]); g(31, 0); g(12, e[0]); g(22, e[1]); g(32, 0); g(13, d[0]); g(23, d[1]); g(33, 0); };
  const insert = (layer, name, x, y, sc, rot) => { ent('INSERT', layer); g(100, 'AcDbBlockReference'); g(2, name); g(10, x); g(20, y); g(30, 0); g(41, sc); g(42, sc); g(43, sc); g(50, rot); };
  const E = { g, lwp, line, circ, text, solid };
  // ---- HEADER ----
  g(0, 'SECTION'); g(2, 'HEADER'); g(9, '$ACADVER'); g(1, 'AC1015'); g(9, '$HANDSEED'); const seedAt = out.length + 1; g(5, 'FFFF');
  g(9, '$INSBASE'); g(10, 0); g(20, 0); g(30, 0); g(9, '$EXTMIN'); g(10, exMin[0]); g(20, exMin[1]); g(30, 0); g(9, '$EXTMAX'); g(10, exMax[0]); g(20, exMax[1]); g(30, 0);
  g(9, '$INSUNITS'); g(70, DXF_INSUNITS[Math.round(U)] || 0); g(9, '$MEASUREMENT'); g(70, 1); g(0, 'ENDSEC');
  // ---- CLASSES (servono per l'immagine) ----
  g(0, 'SECTION'); g(2, 'CLASSES');
  if (img) for (const [n, c, f, e] of [['IMAGE', 'AcDbRasterImage', 127, 1], ['IMAGEDEF', 'AcDbRasterImageDef', 0, 0], ['IMAGEDEF_REACTOR', 'AcDbRasterImageDefReactor', 1, 0], ['RASTERVARIABLES', 'AcDbRasterVariables', 0, 0]]) { g(0, 'CLASS'); g(1, n); g(2, c); g(3, 'ISM'); g(90, f); g(280, 0); g(281, e); }
  g(0, 'ENDSEC');
  // ---- TABLES ----
  const tbl = (name, h, n, extra) => { g(0, 'TABLE'); g(2, name); g(5, h); g(330, '0'); g(100, 'AcDbSymbolTable'); g(70, n); if (extra) g(100, extra); };
  const rec = (type, owner, sub) => { g(0, type); g(type === 'DIMSTYLE' ? 105 : 5, H()); g(330, owner); g(100, 'AcDbSymbolTableRecord'); g(100, sub); };
  g(0, 'SECTION'); g(2, 'TABLES');
  const cx = (exMin[0] + exMax[0]) / 2, cy = (exMin[1] + exMax[1]) / 2, vh = Math.max(1e-3, (exMax[1] - exMin[1]) * 1.1), va = Math.max(1e-3, (exMax[0] - exMin[0]) / Math.max(1e-9, exMax[1] - exMin[1]));
  tbl('VPORT', '8', 1); rec('VPORT', '8', 'AcDbViewportTableRecord'); g(2, '*ACTIVE'); g(70, 0); g(10, 0); g(20, 0); g(11, 1); g(21, 1); g(12, cx); g(22, cy); g(13, 0); g(23, 0); g(14, 10); g(24, 10); g(15, 10); g(25, 10); g(16, 0); g(26, 0); g(36, 1); g(17, 0); g(27, 0); g(37, 0); g(40, vh); g(41, va); g(42, 50); g(43, 0); g(44, 0); g(50, 0); g(51, 0); g(71, 0); g(72, 100); g(73, 1); g(74, 3); g(75, 0); g(76, 0); g(77, 0); g(78, 0); g(0, 'ENDTAB');
  tbl('LTYPE', '5', 3); for (const [n, d] of [['ByBlock', ''], ['ByLayer', ''], ['Continuous', 'Solid line']]) { rec('LTYPE', '5', 'AcDbLinetypeTableRecord'); g(2, n); g(70, 0); g(3, d); g(72, 65); g(73, 0); g(40, 0); } g(0, 'ENDTAB');
  tbl('LAYER', '2', layers.size + 1); for (const [n, c] of [['0', 7], ...layers]) { rec('LAYER', '2', 'AcDbLayerTableRecord'); g(2, n); g(70, 0); g(62, c); g(6, 'Continuous'); g(370, -3); g(390, 'F'); } g(0, 'ENDTAB');
  tbl('STYLE', '3', 1); rec('STYLE', '3', 'AcDbTextStyleTableRecord'); g(2, 'Standard'); g(70, 0); g(40, 0); g(41, 1); g(50, 0); g(71, 0); g(42, 2.5); g(3, 'txt'); g(4, ''); g(0, 'ENDTAB');
  tbl('VIEW', '6', 0); g(0, 'ENDTAB'); tbl('UCS', '7', 0); g(0, 'ENDTAB');
  tbl('APPID', '9', 1); rec('APPID', '9', 'AcDbRegAppTableRecord'); g(2, 'ACAD'); g(70, 0); g(0, 'ENDTAB');
  tbl('DIMSTYLE', 'A', 1, 'AcDbDimStyleTable'); rec('DIMSTYLE', 'A', 'AcDbDimStyleTableRecord'); g(2, 'Standard'); g(70, 0); g(0, 'ENDTAB');
  const blocks = []; const written = new Set();
  for (const code of used) { const s = symOf(code); const bn = blockNameOf(s); if (written.has(bn)) continue; written.add(bn); blocks.push({ bn, s, h: H() }); }
  tbl('BLOCK_RECORD', '1', 2 + blocks.length);
  for (const [n, h] of [['*Model_Space', MS], ['*Paper_Space', PS]]) { g(0, 'BLOCK_RECORD'); g(5, h); g(330, '1'); g(100, 'AcDbSymbolTableRecord'); g(100, 'AcDbBlockTableRecord'); g(2, n); g(340, '0'); }
  for (const b of blocks) { g(0, 'BLOCK_RECORD'); g(5, b.h); g(330, '1'); g(100, 'AcDbSymbolTableRecord'); g(100, 'AcDbBlockTableRecord'); g(2, b.bn); g(340, '0'); }
  g(0, 'ENDTAB'); g(0, 'ENDSEC');
  // ---- BLOCKS ----
  const blkBegin = (name, h, paper) => { g(0, 'BLOCK'); g(5, H()); g(330, h); g(100, 'AcDbEntity'); if (paper) g(67, 1); g(8, '0'); g(100, 'AcDbBlockBegin'); g(2, name); g(70, 0); g(10, 0); g(20, 0); g(30, 0); g(3, name); g(1, ''); };
  const blkEnd = (h, paper) => { g(0, 'ENDBLK'); g(5, H()); g(330, h); g(100, 'AcDbEntity'); if (paper) g(67, 1); g(8, '0'); g(100, 'AcDbBlockEnd'); };
  g(0, 'SECTION'); g(2, 'BLOCKS');
  blkBegin('*Model_Space', MS, false); blkEnd(MS, false); blkBegin('*Paper_Space', PS, true); blkEnd(PS, true);
  for (const b of blocks) {
    const s = b.s; blkBegin(b.bn, b.h, false); const o = { owner: b.h };
    const L = s.leg && legGeom(s.code);
    if (L) writeLegGeom(E, b.h, L);
    else {
      const pp = shapePoly(s.shape);
      if (pp) lwp('0', pp.map(([x, y]) => [x * .5, -y * .5]), true, o); else circ('0', 0, 0, s.shape === 'dot' ? .28 : .42, o);
      if (s.shape === 'circleX' || s.shape === 'squareX') { const k = s.shape === 'circleX' ? .3 : .375; line('0', [-k, -k], [k, k], o); line('0', [-k, k], [k, -k], o); }
      if (s.shape === 'dot') circ('0', 0, 0, .14, o);
      if (s.shape === 'rect') line('0', [-.35, 0], [.35, 0], o);
    }
    blkEnd(b.h, false);
  }
  g(0, 'ENDSEC');
  // ---- ENTITIES ----
  g(0, 'SECTION'); g(2, 'ENTITIES');
  if (img) { // immagine di sfondo per prima: resta sotto tutto il resto
    const k = ppm(P), px = 1 / k; const [lx, ly] = T(0, P.h);
    g(0, 'IMAGE'); g(5, IH.ent); g(330, MS); g(100, 'AcDbEntity'); g(8, 'RIL_SFONDO'); g(100, 'AcDbRasterImage'); g(90, 0); g(10, lx); g(20, ly); g(30, 0); g(11, px); g(21, 0); g(31, 0); g(12, 0); g(22, px); g(32, 0); g(13, img.w); g(23, img.h);
    g(340, IH.def); g(70, 3); g(280, 0); g(281, 50); g(282, 50); g(283, 0); g(360, IH.react); g(71, 1); g(91, 2); g(14, -0.5); g(24, -0.5); g(14, img.w - 0.5); g(24, img.h - 0.5);
  }
  for (const r of S.rooms.filter(r => r.planId === P.id)) {
    lwp('RIL_LOCALI', r.poly.map(p => T(p[0], p[1])), true);
    const [cx, cy] = T(...polyCentroid(r.poly)); text('RIL_LOCALI_NOMI', cx, cy, 0.25 * U, r.name + (r.h ? ` h=${String(r.h).replace('.', ',')}m` : ''), true);
  }
  const sz = 0.3 * U;
  for (const it of items) {
    const s = symOf(it.s); const sfx = (it._rem ? '_RIMOSSI' : it.fate ? FATE_LAYER[it.fate] : techState(it) ? '_PROGETTO' : '') + (it.ok || it._rem ? '' : '_BOZZE'); const layer = (CATS[s.cat] || CATS.X).layer + sfx;
    if (it.pts) { lwp(layer, it.pts.map(p => T(p[0], p[1])), false); const [mx, my] = T(it.x, it.y); text('RIL_SIGLE', mx, my + 0.1 * U, 0.12 * U, symShort(s) + (famExtra(it) ? ' ' + famExtra(it) : '')); continue; }
    if (isPlate(it)) { // placca: un blocco per ogni frutto, affiancati lungo il muro
      const ph = itemRot(it), k = ppm(P), n = it.pl.length; plCodes(it).forEach((c, i) => { if (!c) return; const s2 = symOf(c); const off = ((n - 1) / 2 - i) * 0.36 * k; /* posto 1 a sinistra di chi guarda la parete */ const [px, py] = T(it.x + Math.cos(-ph) * off, it.y + Math.sin(-ph) * off); insert((CATS[s2.cat] || CATS.X).layer + sfx, blockNameOf(s2), px, py, s2.leg ? U : sz, s2.leg ? +(ph * 180 / Math.PI).toFixed(3) : 0); });
      const [x, y] = T(it.x, it.y); text('RIL_SIGLE', x + 0.25 * U, y + 0.05 * U, 0.1 * U, 'placca ' + n + 'P' + (it.h != null ? ' h' + String(it.h).replace('.', ',') : '')); if (it.note) text('RIL_NOTE', x + 0.2 * U, y - 0.15 * U, 0.08 * U, it.note.slice(0, 100)); continue;
    }
    const [x, y] = T(it.x, it.y); const sc = s.leg ? U : sz; const rot = s.leg ? itemRot(it) * 180 / Math.PI : 0;
    insert(layer, blockNameOf(s), x, y, sc, +rot.toFixed(3));
    const lab = isQuadroCode(it.s) ? quadroLabel(it) : symShort(s) + (it.tag ? ' ' + it.tag : '');
    text('RIL_SIGLE', x + 0.25 * U, y + 0.05 * U, 0.12 * U, lab + (it.n > 1 ? ' x' + it.n : '') + (it.h != null ? ' h' + String(it.h).replace('.', ',') : ''));
    const nt = [famExtra(it), it.note].filter(Boolean).join(' – '); if (nt) text('RIL_NOTE', x + 0.2 * U, y - 0.15 * U, 0.08 * U, nt.slice(0, 100));
  }
  const wU = P.dxf ? P.dxf.s : ppm(P); // px pianta per unità del disegno
  for (const d of S.draws.filter(d => d.planId === P.id)) for (const st of d.strokes) {
    const w = +(st.w / wU).toFixed(4); const pw = st.pts.some(p => p.length > 2); // tratto a pressione: ogni vertice ha il suo spessore iniziale e finale
    const vw = pw && w > 0 ? st.pts.map((p, i) => { const q = st.pts[i + 1] || p; return [+(w * prW(p[2] ?? 0.5)).toFixed(4), +(w * prW(q[2] ?? 0.5)).toFixed(4)]; }) : null;
    lwp('RIL_DISEGNO', st.pts.map(p => T(p[0], p[1])), false, { color: aciOf(st.col), w: w > 0 && !vw ? w : 0, vw });
  }
  for (const it of all.filter(i => i.hint)) { const [x, y] = T(it.x, it.y); circ('RIL_INDIZI', x, y, 0.15 * U); text('RIL_INDIZI', x + 0.2 * U, y - 0.05 * U, 0.1 * U, '! ' + (it.note || 'indizio').slice(0, 90)); }
  for (const n of S.vnotes.filter(n => n.planId === P.id)) { // note audio: cerchio, numero e testo
    const [x, y] = T(n.x, n.y); circ('RIL_NOTE_AUDIO', x, y, 0.12 * U); circ('RIL_NOTE_AUDIO', x, y, 0.06 * U);
    text('RIL_NOTE_AUDIO', x + 0.17 * U, y - 0.05 * U, 0.12 * U, vnLabel(n) + (n.mime ? ' nota audio' : ' nota'));
    if (n.text) text('RIL_NOTE_AUDIO', x + 0.17 * U, y - 0.23 * U, 0.08 * U, n.text.replace(/\s+/g, ' ').slice(0, 120));
  }
  for (const ph of S.photos.filter(p => p.planId === P.id && p.x != null)) {
    const [x, y] = T(ph.x, ph.y); circ('RIL_FOTO', x, y, 0.12 * U);
    const a = -ph.a; line('RIL_FOTO', [x, y], [x + Math.cos(a) * 0.5 * U, y + Math.sin(a) * 0.5 * U]);
    text('RIL_FOTO', x + 0.15 * U, y - 0.25 * U, 0.12 * U, pnum.get(ph.id) || '');
  }
  g(0, 'ENDSEC');
  // ---- OBJECTS ----
  g(0, 'SECTION'); g(2, 'OBJECTS');
  g(0, 'DICTIONARY'); g(5, 'C'); g(330, '0'); g(100, 'AcDbDictionary'); g(281, 1); g(3, 'ACAD_GROUP'); g(350, 'D'); g(3, 'ACAD_PLOTSTYLENAME'); g(350, 'E'); if (img) { g(3, 'ACAD_IMAGE_DICT'); g(350, IH.dict); g(3, 'ACAD_IMAGE_VARS'); g(350, IH.vars); }
  g(0, 'DICTIONARY'); g(5, 'D'); g(330, 'C'); g(100, 'AcDbDictionary'); g(281, 1);
  g(0, 'ACDBDICTIONARYWDFLT'); g(5, 'E'); g(330, 'C'); g(100, 'AcDbDictionary'); g(281, 1); g(3, 'Normal'); g(350, 'F'); g(100, 'AcDbDictionaryWithDefault'); g(340, 'F');
  g(0, 'ACDBPLACEHOLDER'); g(5, 'F'); g(330, 'E');
  if (img) {
    const px = 1 / ppm(P); const defName = safeName(P.name).toUpperCase() + '_SFONDO';
    g(0, 'DICTIONARY'); g(5, IH.dict); g(330, 'C'); g(100, 'AcDbDictionary'); g(281, 1); g(3, defName); g(350, IH.def);
    g(0, 'IMAGEDEF'); g(5, IH.def); g(102, '{ACAD_REACTORS'); g(330, IH.react); g(102, '}'); g(330, IH.dict); g(100, 'AcDbRasterImageDef'); g(90, 0); g(1, img.file); g(10, img.w); g(20, img.h); g(11, px); g(21, px); g(280, 1); g(281, 0);
    g(0, 'IMAGEDEF_REACTOR'); g(5, IH.react); g(330, IH.ent); g(100, 'AcDbRasterImageDefReactor'); g(90, 2); g(330, IH.ent);
    g(0, 'RASTERVARIABLES'); g(5, IH.vars); g(330, 'C'); g(100, 'AcDbRasterVariables'); g(90, 0); g(70, 1); g(71, 1); g(72, 0);
  }
  g(0, 'ENDSEC'); g(0, 'EOF');
  out[seedAt] = (hs + 16).toString(16).toUpperCase(); // $HANDSEED: oltre l'ultimo handle usato
  return out.join('\r\n') + '\r\n';
}

const blockNameOf = s => s.leg ? (s.block || s.code) : 'RIL_' + safeName(s.code).toUpperCase();
const ACI_TAB = [[1, 255, 0, 0], [2, 255, 255, 0], [3, 0, 255, 0], [4, 0, 255, 255], [5, 0, 0, 255], [6, 255, 0, 255], [7, 255, 255, 255], [8, 128, 128, 128], [9, 192, 192, 192], [30, 255, 127, 0], [40, 255, 191, 0], [90, 63, 255, 0], [140, 0, 191, 255], [150, 0, 127, 255], [160, 0, 63, 255], [170, 0, 0, 191], [174, 94, 103, 175], [178, 41, 49, 137]];
function aciOf(hex) { const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); let best = 7, bd = Infinity; for (const [a, R, G, B] of ACI_TAB) { const d = (r - R) ** 2 + (g - G) ** 2 + (b - B) ** 2; if (d < bd) { bd = d; best = a; } } return best; }
function writeLegGeom(E, owner, L) { // geometria del blocco della legenda (metri, origine = punto di inserimento), dentro il blocco `owner`
  const convex = q => { let sg = 0; const n = q.length / 2; for (let i = 0; i < n; i++) { const ax = q[2 * i], ay = q[2 * i + 1], bx = q[(2 * i + 2) % q.length], by = q[(2 * i + 3) % q.length], cx = q[(2 * i + 4) % q.length], cy = q[(2 * i + 5) % q.length]; const c = (bx - ax) * (cy - by) - (by - ay) * (cx - bx); if (Math.abs(c) < 1e-12) continue; const s = Math.sign(c); if (sg && s !== sg) return false; sg = s; } return true; };
  const pairs = d => { const o = []; for (let i = 0; i < d.length; i += 2) o.push([d[i], d[i + 1]]); return o; };
  for (const p of L.g) {
    const c = aciOf(p.c), o = { owner, color: c };
    if (p.t === 'L') E.line('0', [p.d[0], p.d[1]], [p.d[2], p.d[3]], o);
    else if (p.t === 'P') E.lwp('0', pairs(p.d), !!p.z, o);
    else if (p.t === 'F') for (const q of p.d) {
      const n = q.length / 2; const P = i => [q[2 * i], q[2 * i + 1]];
      if (n === 3) E.solid('0', c, P(0), P(1), P(2), P(2), owner); else if (n === 4) E.solid('0', c, P(0), P(1), P(2), P(3), owner);
      else if (convex(q)) for (let i = 1; i < n - 1; i++) E.solid('0', c, P(0), P(i), P(i + 1), P(i + 1), owner);
      else E.lwp('0', pairs(q), true, o);
    }
    else if (p.t === 'T') E.text('0', p.x, p.y, p.h, p.s, false, { owner, color: c, rot: p.r || 0, wf: p.w, ha: p.ha || 0, va: p.va || 0 });
  }
}

/* ---- PNG annotato ---- */
async function annotatedPng(P, pnum) {
  const im = await loadPlanImage(P.id, false, true); const allIts = S.items.filter(i => i.planId === P.id); const its = allIts.filter(i => !i.hint);
  const LW = Math.round(Math.max(520, P.w * 0.22)); const c = newCanvas(P.w + LW, P.h); const x = c.getContext('2d'); x.drawImage(im.canvas, 0, 0);
  const k = ppm(P); const R = Math.max(10, 0.18 * k); const fs = Math.max(12, 0.22 * k);
  for (const r of S.rooms.filter(r => r.planId === P.id)) {
    x.beginPath(); r.poly.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); x.fillStyle = 'rgba(59,130,246,.06)'; x.fill(); x.strokeStyle = 'rgba(59,130,246,.6)'; x.lineWidth = Math.max(1.5, R / 6); x.stroke();
    const [cx, cy] = polyCentroid(r.poly); x.font = `600 ${fs}px sans-serif`; x.textAlign = 'center'; x.lineWidth = fs / 3; x.strokeStyle = '#fff'; x.strokeText(r.name, cx, cy + fs * 1.6); x.fillStyle = '#1e3a8a'; x.fillText(r.name, cx, cy + fs * 1.6);
  }
  for (const d of S.draws.filter(d => d.planId === P.id)) for (const st of d.strokes) strokePath(x, st.pts, p => p, Math.max(1, st.w), st.col);
  for (const it of its) if (it.pts) { const s = symOf(it.s); x.beginPath(); it.pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.strokeStyle = symColor(s); x.lineWidth = R / 2.5; x.setLineDash(it.ok ? [] : [R, R / 2]); x.stroke(); x.setLineDash([]); }
  const pp = its.filter(i => !i.pts).map(it => ({ id: it.id, x: it.x, y: it.y, it })); const dp = declutter(pp, R);
  for (const p of pp) { const [dx, dy] = dp.get(p.id); if (Math.hypot(dx - p.x, dy - p.y) < 1) continue; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(dx, dy); x.strokeStyle = 'rgba(30,41,59,.6)'; x.lineWidth = Math.max(1, R / 10); x.stroke(); x.beginPath(); x.arc(p.x, p.y, R / 6, 0, 7); x.fillStyle = '#1e293b'; x.fill(); }
  for (const p of pp) { const it = p.it; const s = symOf(it.s); const [dx, dy] = dp.get(p.id); if (isPlate(it)) drawPlate(x, it, dx, dy, R, !it.ok, itemRot(it)); else drawSym(x, s, dx, dy, R, !it.ok, itemRot(it)); if (it.fate) drawFate(x, dx, dy, isPlate(it) ? R * 1.15 : R, it.fate, R / 8); x.font = `600 ${fs * .8}px sans-serif`; x.textAlign = 'left'; x.lineWidth = fs / 4; x.strokeStyle = '#fff'; const l = (isQuadroCode(it.s) ? quadroLabel(it) : symShort(s) + (it.tag ? ' ' + it.tag : '')) + (it.n > 1 ? '×' + it.n : ''); x.strokeText(l, dx + R * 1.1, dy - R * .4); x.fillStyle = symColor(s); x.fillText(l, dx + R * 1.1, dy - R * .4); }
  for (const it of allIts.filter(i => i.hint)) drawHint(x, it.x, it.y, R);
  const vns = S.vnotes.filter(n => n.planId === P.id); for (const n of vns) drawVnMark(x, n.x, n.y, R * 0.75, n, false);
  for (const ph of S.photos.filter(p => p.planId === P.id && p.x != null)) { x.beginPath(); x.arc(ph.x, ph.y, R * .6, 0, 7); x.fillStyle = '#fff'; x.fill(); x.strokeStyle = '#0891b2'; x.lineWidth = R / 5; x.stroke(); x.beginPath(); x.moveTo(ph.x, ph.y); x.lineTo(ph.x + Math.cos(ph.a) * R * 2, ph.y + Math.sin(ph.a) * R * 2); x.stroke(); x.font = `${fs * .75}px sans-serif`; x.fillStyle = '#0891b2'; x.textAlign = 'left'; x.fillText(pnum.get(ph.id) || '', ph.x + R * .8, ph.y + R * 1.4); }
  // legenda a destra
  const lx = P.w, pad = LW * 0.05, lf = Math.max(14, LW / 26), lh = lf * 1.9;
  x.fillStyle = '#fff'; x.fillRect(lx, 0, LW, P.h); x.strokeStyle = '#333'; x.lineWidth = 2; x.beginPath(); x.moveTo(lx, 0); x.lineTo(lx, P.h); x.stroke();
  x.textAlign = 'left'; x.fillStyle = '#111'; x.font = `700 ${lf * 1.2}px sans-serif`; x.fillText('RILIEVO IMPIANTO ESISTENTE', lx + pad, pad + lf * 1.2);
  x.font = `${lf}px sans-serif`; let yy = pad + lf * 3;
  for (const t of [S.sv.name, S.sv.client, S.sv.address, 'Tavola: ' + P.name, 'Data: ' + new Date().toLocaleDateString('it-IT')]) { if (t) { x.fillText(String(t).slice(0, 48), lx + pad, yy); yy += lf * 1.4; } }
  yy += lf; x.font = `700 ${lf}px sans-serif`; x.fillText('Legenda', lx + pad, yy); yy += lh;
  const m = totals(its);
  Object.keys(m).sort().forEach(key => {
    const code = kCode(key);
    if (yy > P.h - lh * 3) return; const s = symOf(code); drawSymFit(x, s, lx + pad + lf * .6, yy - lf * .35, lf * 1.3);
    x.font = `700 ${lf * .9}px sans-serif`; x.fillStyle = '#111'; x.fillText(symShort(s), lx + pad + lf * 1.6, yy);
    x.font = `${lf * .85}px sans-serif`; x.fillText(`${kName(key).slice(0, 40)} – ${itNum(m[key].q, umOf(code) === 'm' ? 1 : 0)} ${umOf(code)}`, lx + pad + lf * 4.6, yy); yy += lh;
  });
  yy += lf * .5; x.font = `${lf * .8}px sans-serif`; x.fillStyle = '#555';
  x.fillText('Simboli tratteggiati = bozze AI da verificare', lx + pad, yy); yy += lf * 1.3; x.fillText('F001… = punti di scatto delle foto', lx + pad, yy);
  if (allIts.some(i => i.hint)) { yy += lf * 1.3; x.fillText('⚠ = indizio da verificare (non conteggiato)', lx + pad, yy); }
  if (vns.length) { yy += lf * 1.3; x.fillText('N1… = note audio (file nella cartella audio)', lx + pad, yy); }
  return await canvasToBlob(c, 'image/png');
}

/* ---- ZIP ---- */
async function exportZip(withPhotos, prog, tag = 'rilievo') {
  await needLib('zip'); const zip = new JSZip(); const sv = S.sv; const pnum = photoNumbers(); const P2 = id => planOf(id)?.name || '';
  const rn = id => roomLabel(id);
  zip.file('LEGGIMI.txt', `Rilievo elettrico: ${sv.name}\r\nCliente: ${sv.client || ''}\r\nIndirizzo: ${sv.address || ''}\r\nEsportato: ${new Date().toLocaleString('it-IT')}\r\n\r\nDXF: un file per tavola. Layer RIL_* per categoria (RIL_*_BOZZE = bozze AI non confermate), blocchi con i nomi della tua legenda (inseriti in scala 1:1 in metri, ruotati sul muro: se li ridefinisci con la tua libreria si aggiornano tutti), RIL_FOTO = punti di scatto con numero foto, RIL_NOTE_AUDIO = note audio N1… (file nella cartella audio, elenco in csv/note_audio.csv).\r\nSe la tavola era un DXF le coordinate coincidono con l'originale; se era PDF/immagine sono in metri con origine in alto a sinistra (allinea con il comando ALLINEA) e il disegno di partenza è agganciato sotto il rilievo come immagine (file *_sfondo accanto al DXF, da tenere nella stessa cartella; layer RIL_SFONDO: spegnilo o cancella l'immagine quando non serve più).\r\nCSV: separatore punto e virgola, apribili con Excel.\r\n`);
  for (const P of sv.plans) {
    prog && prog('DXF ' + P.name + '…');
    let img = null;
    if (!P.dxf) { try { const pb = await getBlob('plan_' + P.id, P.asset); const ext = /jpe?g/.test(pb.type) ? 'jpg' : 'png'; img = { file: `${safeName(P.name)}_sfondo.${ext}`, w: P.w, h: P.h }; zip.file('dxf/' + img.file, pb, { compression: 'STORE' }); } catch (e) { console.warn('sfondo DXF non disponibile', e); } } // la tavola (PDF/foto) sotto il rilievo, sul layer RIL_SFONDO
    zip.file(`dxf/${safeName(P.name)}_rilievo.dxf`, buildDxf(P, pnum, img));
    try { prog && prog('PNG ' + P.name + '…'); zip.file(`pianta/${safeName(P.name)}_rilievo.png`, await annotatedPng(P, pnum)); } catch (e) { console.warn(e); }
    if (P.id !== S.planId) delete S.planImg[P.id];
  }
  const el = [['N', 'Tavola', 'Locale', 'Sigla', 'Descrizione', 'Caratteristiche', 'Categoria', 'Quantità', 'UM', 'Stato', 'Destino', 'Scelta_tecnica', 'Altezza_m', 'Scritta', 'Note', 'Foto', 'Affidabilità_%', 'Posizione_stimata', 'X_m', 'Y_m']];
  S.items.filter(i => !i.hint).forEach((it, i) => { const s = symOf(it.s); const P = planOf(it.planId); const k = ppm(P); el.push([i + 1, P2(it.planId), rn(it.roomId), isPlate(it) ? 'PLACCA' : s.code, isPlate(it) ? 'Placca ' + it.pl.length + ' posti' : s.name, isPlate(it) ? plDesc(it) : famExtra(it), CATS[s.cat]?.n || '', itNum(qtyOf(it), umOf(it.s) === 'm' ? 2 : 0), umOf(it.s), it.ok ? 'confermato' : 'bozza AI', fateLabel(it.fate), techState(it) || '', itNum(it.h, 2), it.tag || '', it.note || '', it.photoId ? pnum.get(it.photoId) : '', it.conf != null ? Math.round(it.conf * 100) : '', it.est ? 'sì' : '', itNum(it.x / k, 2), itNum(-it.y / k, 2)]); });
  zip.file('csv/elementi.csv', csv(el));
  const hints = S.items.filter(i => i.hint);
  if (hints.length) zip.file('csv/indizi.csv', csv([['N', 'Tavola', 'Locale', 'Indizio', 'Impianto probabile', 'Foto', 'X_m', 'Y_m'], ...hints.map((it, i) => { const k = ppm(planOf(it.planId)); return [i + 1, P2(it.planId), rn(it.roomId), it.note || '', symShort(symOf(it.s)) + ' ' + symOf(it.s).name, it.photoId ? pnum.get(it.photoId) : '', itNum(it.x / k, 2), itNum(-it.y / k, 2)]; })]));
  const cl = [['Tavola', 'Locale', 'Sigla', 'Descrizione', 'Quantità', 'UM', 'di cui bozze']];
  for (const P of sv.plans) for (const r of [...S.rooms.filter(x => x.planId === P.id), { id: null, name: EXT_NAME }]) { const m = totals(S.items.filter(i => i.planId === P.id && (r.id ? i.roomId === r.id : !roomById(i.roomId)))); Object.keys(m).sort().forEach(k => cl.push([P.name, r.name, kCode(k), kName(k), itNum(m[k].q, umOf(kCode(k)) === 'm' ? 2 : 0), umOf(kCode(k)), m[k].dr ? itNum(m[k].dr, 2) : ''])); }
  zip.file('csv/computo_per_locale.csv', csv(cl));
  const tm = totals(S.items); zip.file('csv/computo_totale.csv', csv([['Sigla', 'Descrizione', 'Categoria', 'Quantità', 'UM', 'di cui bozze'], ...Object.keys(tm).sort().map(k => [kCode(k), kName(k), CATS[symOf(kCode(k)).cat]?.n || '', itNum(tm[k].q, umOf(kCode(k)) === 'm' ? 2 : 0), umOf(kCode(k)), tm[k].dr ? itNum(tm[k].dr, 2) : ''])]));
  zip.file('csv/locali.csv', csv([['Tavola', 'Locale', 'Tipo', 'Altezza_m', 'Superficie_m2', 'Rilevato', 'Note', 'Criticità'], ...S.rooms.map(r => { const k = ppm(planOf(r.planId)); return [P2(r.planId), r.name, r.kind, itNum(r.h, 2), itNum(polyArea(r.poly) / (k * k), 1), r.done ? 'sì' : 'no', r.note, S.photos.filter(p => p.roomId === r.id).flatMap(p => (p.ai && p.ai.crit) || []).join(' | ')]; })]));
  const QQ = allQuadri();
  const qd = [['Quadro', 'Locale', 'Foto', 'Id', 'Fila', 'Pos', 'Moduli', 'Tipo', 'Apparecchio', 'Poli', 'In_A', 'Curva', 'Idn_mA', 'Classe', 'Icn_kA', 'Funzione', 'Etichetta', 'A monte', 'Marca', 'Modello', 'Affidabilità_%']];
  QQ.filter(Qx => Qx.q).forEach(Qx => Qx.q.app.forEach(d => qd.push([Qx.name, rn(Qx.room), Qx.ph ? pnum.get(Qx.ph.id) : '', d.id, filaOf(d), d.pos, itNum(d.moduli, 1), d.tipo, TIPI_Q[d.tipo] || d.tipo, d.poli, itNum(d.In_A, 1), d.curva, itNum(d.Idn_mA, 0), d.classe, itNum(d.Icn_kA, 1), d.funzione, d.etichetta, d.a_monte, d.marca, d.modello, d.conf != null ? Math.round(d.conf * 100) : ''])));
  if (qd.length > 1) zip.file('csv/quadri_apparecchi.csv', csv(qd));
  if (QQ.length) zip.file('csv/quadri_riepilogo.csv', csv([['Quadro', 'Locale', 'Foto', 'Involucro', 'Materiale', 'IP', 'Moduli totali', 'File', 'Moduli occupati', 'Moduli liberi', 'Apparecchi', 'Criticità', 'Note'], ...QQ.map(Qx => { if (!Qx.q) return [Qx.name, rn(Qx.room), '', '', '', '', '', '', '', '', '', '', 'contenuto non fotografato']; const st = quadroStats(Qx.q); return [Qx.name, rn(Qx.room), Qx.ph ? pnum.get(Qx.ph.id) : '', st.Q.involucro, st.Q.materiale, st.Q.ip, st.tot ?? '', st.nFile ?? '', st.occ ?? '', st.tot != null && st.occ != null ? Math.max(0, st.tot - st.occ) : '', st.dev.length, (Qx.q.crit || []).join(' | '), st.Q.note]; })]));
  const fname = p => `${pnum.get(p.id)}_${safeName(rn(p.roomId))}_${p.kind}.jpg`;
  zip.file('csv/foto.csv', csv([['Foto', 'File', 'Tavola', 'Locale', 'Tipo', 'Descrizione AI', 'Criticità', 'Nota', 'Data'], ...S.photos.map(p => [pnum.get(p.id), fname(p), P2(p.planId), rn(p.roomId), p.kind, p.ai ? p.ai.desc : '', p.ai ? (p.ai.crit || []).join(' | ') : '', p.note, new Date(p.t || 0).toLocaleString('it-IT')])]));
  if (withPhotos) {
    let i = 0; for (const p of S.photos) { i++; prog && prog(`Foto ${i}/${S.photos.length}…`); try { zip.file('foto/' + fname(p), await getBlob('photo_' + p.id, p.asset), { compression: 'STORE' }); } catch (e) { console.warn('foto mancante', p.id); } }
  }
  const vns = S.vnotes.slice().sort((a, b) => a.num - b.num);
  if (vns.length) {
    zip.file('csv/note_audio.csv', csv([['Nota', 'Tavola', 'Locale', 'Data', 'Durata', 'File audio', 'Testo', 'X_m', 'Y_m'], ...vns.map(n => { const k = ppm(planOf(n.planId)); return [vnLabel(n), P2(n.planId), rn(n.roomId), fmtDT(n.t), fmtDur(n.dur), n.mime ? 'audio/' + vnFileName(n) : '', n.text || '', itNum(n.x / k, 2), itNum(-n.y / k, 2)]; })]));
    let i = 0; for (const n of vns.filter(n => n.mime)) { i++; prog && prog(`Audio ${i}…`); try { zip.file('audio/' + vnFileName(n), await vnAudioBlob(n), { compression: 'STORE' }); } catch (e) { console.warn('audio mancante', n.id); } }
  }
  prog && prog('Comprimo…');
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 5 } });
  await saveFile(`${tag}_${safeName(sv.name)}_${new Date().toISOString().slice(0, 10)}.zip`, blob);
}
