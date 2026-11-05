/* ============ FOTO ============ */
async function compressImage(file, max = 2048, q = 0.85) {
  let bm; try { bm = await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) { bm = await createImageBitmap(file); }
  const k = Math.min(1, max / Math.max(bm.width, bm.height));
  const c = newCanvas(Math.round(bm.width * k), Math.round(bm.height * k), false); c.getContext('2d').drawImage(bm, 0, 0, c.width, c.height);
  const blob = await canvasToBlob(c, 'image/jpeg', q);
  const tk = Math.min(1, 200 / Math.max(c.width, c.height)); const t = newCanvas(Math.round(c.width * tk), Math.round(c.height * tk), false); t.getContext('2d').drawImage(c, 0, 0, t.width, t.height);
  return { blob, w: c.width, h: c.height, thumb: t.toDataURL('image/jpeg', 0.6) };
}
const canAI = () => CAP.sample && CAP.img && !CAP.aiOff;
async function addPhotos(files, pose) {
  const P = curPlan(); if (!P) return; let last = null;
  const att = pose.itemId ? itemById(pose.itemId) : null;
  for (const f of files) {
    try {
      const { blob, w, h, thumb } = pose.kind === 'quadro' ? await compressImage(f, 3072, 0.9) : await compressImage(f); // il quadro serve più dettagliato
      const id = uid('ph'); const r = att ? roomById(att.roomId) : roomAt(P.id, pose.x, pose.y);
      const ph = { id, planId: P.id, roomId: r ? r.id : null, x: att ? null : r1(pose.x), y: att ? null : r1(pose.y), a: pose.a || 0, len: att ? null : (pose.len || null), fov: ST().fov, kind: pose.kind || 'parete', mir: false, w, h, asset: null, local: true, thumb, ai: null, aiSt: 'none', aiErr: null, t: Date.now(), itemId: att ? att.id : null, note: '' };
      S.photos.push(ph); await Uploads.add('photo_' + id, blob, 'photo', id); Sync.mark('photo:' + id); last = ph;
      if (ST().auto && canAI() && ph.kind !== 'dettaglio') AIQ.add(id);
    } catch (e) { console.error(e); toast('Foto non leggibile: ' + (f.name || ''), true); }
  }
  if (last && !att) select('photo', last.id); else renderPanel();
  redraw();
}

/* ============ CODA ANALISI AI ============ */
const AIQ = {
  q: [], running: 0, max: 2, offline: new Set(),
  add(id, force) { const ph = photoById(id); if (!ph || ph.aiSt === 'queued' || ph.aiSt === 'run') return; ph.aiSt = 'queued'; ph._force = !!force; this.q.push(id); this.pump(); redraw(); },
  pump() { while (this.running < this.max && this.q.length) { const id = this.q.shift(); this.running++; runAI(id).finally(() => { this.running--; aiBadge(); this.pump(); }); } aiBadge(); },
  stop() { this.q.forEach(id => { const p = photoById(id); if (p) p.aiSt = 'none'; }); this.q = []; aiBadge(); },
};
window.addEventListener('online', () => { const ids = [...AIQ.offline]; AIQ.offline.clear(); ids.forEach(id => AIQ.add(id)); });
function aiBadge() {
  const el = $('#aiQ'); if (!el) return; const n = AIQ.running + AIQ.q.length;
  el.innerHTML = n ? `<span class="chip ai" style="padding:7px 12px;font-size:13px">✦ AI: ${AIQ.running} in analisi${AIQ.q.length ? `, ${AIQ.q.length} in coda` : ''}</span>` : '';
}
const AI_ERR = {
  not_granted: 'Uso di Claude non consentito per questa app (puoi riattivarlo riaprendo l\'app).', sampling_disabled: 'Claude non disponibile per questo account.',
  images_unavailable: 'Questa vista non può inviare foto a Claude.', rate_limited: 'Limite di utilizzo raggiunto: riprova più tardi.',
  invalid_json: 'Risposta non leggibile: premi Rianalizza.', image_rejected: 'Foto non accettata (formato o dimensione).', refused: 'Analisi rifiutata per questa foto.',
  empty_completion: 'Nessuna risposta: riprova.', session_expired: 'Sessione scaduta: ricarica la pagina.', prompt_too_large: 'Richiesta troppo grande.',
};
const isQuadroCode = code => { const s = symOf(code); return code === 'Q1' || code === 'QE_VUOTO' || (s.cat === 'Q' && /quadro|centralino/i.test(s.name) && !/rack|centralino imp|telefon/i.test(s.name)); };
async function runAI(id) {
  const ph = photoById(id); if (!ph) return;
  if (!canAI()) { ph.aiSt = 'none'; return; }
  ph.aiSt = 'run'; redraw(); if (S.sel && S.sel.id === id) renderPanel();
  const force = !!ph._force; const nocache = force ? { cache: false } : {};
  try {
    const blob = await getBlob('photo_' + id, ph.asset);
    if (ph.kind === 'quadro') {
      const { imgs, box } = await quadroImages(blob, null);
      const res = await CAP.sample.json(promptQuadro(imgs.length), { images: imgs, modelTier: QTIER, ...nocache });
      if (!photoById(id)) return;
      ph.ai = normQuadro(res); ph.ai.crop = box;
    } else {
      const res = await CAP.sample.json(promptRilievo(ph), { images: [blob], modelTier: ST().tier, ...nocache });
      if (!photoById(id)) return;
      ph.ai = normRilievo(res);
      if (ST().plZoom === true) { try { await zoomPlates(ph, blob, nocache); } catch (e) { console.warn('ingrandimento placche', e); if (e && e.code === 'rate_limited') toast(AI_ERR.rate_limited, true); } }
      if (!photoById(id)) return;
      if (ph.kind === 'parete' || ph.kind === 'soffitto') applyDetections(ph, true);
    }
    ph.ai.at = Date.now(); ph.aiSt = 'done'; ph.aiErr = null;
  } catch (e) {
    const c = e && e.code;
    if (!navigator.onLine && c !== 'not_granted') { ph.aiSt = 'none'; ph.aiErr = null; AIQ.offline.add(id); delete ph._force; Sync.mark('photo:' + id); redraw(); return; }
    ph.aiSt = 'err'; ph.aiErr = AI_ERR[c] || ('Errore di rete o del servizio' + (c ? ' (' + c + ')' : '') + ': riprova.');
    if (['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed', 'images_unavailable'].includes(c)) { CAP.aiOff = true; AIQ.stop(); }
    if (c === 'rate_limited') { AIQ.stop(); toast(ph.aiErr, true, 6000); }
    if (!e || !e.code) console.error(e);
  }
  delete ph._force; Sync.mark('photo:' + id); redraw(); if (S.sel && (S.sel.id === id || S.sel.t === 'item')) renderPanel();
  // quadri visti nella foto: lettura dettagliata del contenuto sull'ingrandimento
  if (ph.aiSt === 'done' && ph.ai && ph.ai.dets) {
    for (let di = 0; di < ph.ai.dets.length; di++) {
      const d = ph.ai.dets[di]; if (d.indizio || !isQuadroCode(d.code) || !d.bbox) continue;
      const key = id + ':' + di; QRUN.add(key); if (S.sel && S.sel.t === 'item') renderPanel();
      try { await readQuadroDet(ph, di, force); }
      catch (e) { const c = e && e.code; if (c) toast('Lettura del quadro: ' + (AI_ERR[c] || c), true); if (['rate_limited', 'not_granted', 'sampling_disabled'].includes(c)) { QRUN.delete(key); break; } }
      QRUN.delete(key); if (S.sel && S.sel.t === 'item') renderPanel();
    }
  }
}
/* ---- secondo sguardo alle placche: ogni placca viene ritagliata e ingrandita, così l'AI conta i posti e distingue tappi e frutti ---- */
const zoomable = d => !d.indizio && !d.linea && !!d.bbox && (d.bbox[2] - d.bbox[0]) < 0.5 && (d.bbox[3] - d.bbox[1]) < 0.5 && !!(d.pl || PL_REV[d.code]);
const zoomBox = b => { const w = b[2] - b[0], h = b[3] - b[1]; const mx = Math.max(1.2 * w, 0.1), my = Math.max(1.0 * h, 0.07); return [b[0] - mx, b[1] - my, b[2] + mx, b[3] + my].map(v => r3(clamp(v, 0, 1))); };
const unionBox = bs => [Math.min(...bs.map(b => b[0])), Math.min(...bs.map(b => b[1])), Math.max(...bs.map(b => b[2])), Math.max(...bs.map(b => b[3]))].map(r3);
function plateGroups(dets) { // le rilevazioni da ingrandire, raggruppate quando sono frutti della stessa placca
  const groups = [];
  dets.filter(zoomable).forEach(d => { const g = groups.find(g => g.dets.some(x => samePlate(x.bbox, d.bbox))); if (g) g.dets.push(d); else groups.push({ dets: [d] }); });
  groups.forEach(g => { g.box = unionBox(g.dets.map(d => d.bbox)); });
  return groups.slice(0, 12);
}
function promptPlacche(n) {
  return `Sei un tecnico che esegue il rilievo dell'impianto elettrico esistente. Ricevi ingrandimenti di placche (comandi e prese) ritagliati da una foto di sopralluogo.

CONTESTO
- Ti mando ${n} ingrandiment${n > 1 ? 'i' : 'o'} presi dalla stessa foto, numerati nell'ordine in cui li ricevi: la placca è al centro, intorno c'è parete o altro.

COMPITO
Per ogni ingrandimento:
1. Conta i POSTI della placca, tappi compresi: un posto è largo come un tasto. La placca rettangolare orizzontale classica (scatola 503) ha 3 posti; esistono anche placche da 1, 2, 4, 6 e 7 posti.
2. Dì cosa c'è in OGNI posto, da sinistra a destra (dall'alto in basso se la placca è verticale):
- TAPPO (copriforo): modulo liscio e piatto, senza tasto, senza fori, senza simboli, a filo della cornice → null.
- Tasto di interruttore, deviatore o pulsante: di solito è un po' sporgente o inclinato (bascula), a volte con spia o simbolo. In foto interruttore, deviatore e invertitore sono uguali: usa 0035_INTERRUTTORE (con spia luminosa 0037_INTERRUTTORE_LUMINOSO; con le frecce su/giù per la tapparella 0106_SALI-SCENDI). Pulsante o campanello SOLO se vedi il simbolo del campanello o la scritta: un modulo bianco liscio senza fori, spie o simboli è un tappo (null), mai un pulsante.
- Presa italiana con 3 fori in linea → 0075a_BIPRESA (0046_PRESA_10A solo se leggi la scritta 10A sul frutto, e in quel caso scrivi «scritta 10A» nella nota).
- Presa con due fori più il buco tondo grande o le alette laterali (schuko o universale) → è larga 2 posti: il suo codice e poi null.
- Prese TV, SAT, dati, telefono, USB, termostati, variatori: i codici qui sotto.
Codici della legenda:
${symListForAI(['C', 'P'])}
Se un ingrandimento non è una placca a più posti (es. presa CEE, frutto a giorno, scatola), rispondi "posti":1 con il codice del frutto. Se non riesci a capire, "conf" bassa.
Rispondi SOLO con questo JSON:
{"placche":[{"img":1,"posti":3,"placca":[null,"0035_INTERRUTTORE",null],"conf":0.8,"note":"breve: cosa vedi in ogni posto"}]}`;
}
async function zoomPlates(ph, blob, nocache) { // seconda passata: aggiorna ph.ai.dets prima che diventino oggetti
  const ai = ph.ai; if (!ai || !ai.dets || !ai.dets.length) return;
  const groups = plateGroups(ai.dets); if (!groups.length) return;
  const per = Math.max(1, Math.min(CAP.imgMax || 1, 6)); const drop = new Set(); let calls = 0;
  for (let i0 = 0; i0 < groups.length && calls < 4; i0 += per, calls++) {
    const part = groups.slice(i0, i0 + per); const imgs = [];
    for (const g of part) imgs.push((await cropBlob(blob, zoomBox(g.box), 1600, 900)).blob);
    const res = await CAP.sample.json(promptPlacche(imgs.length), { images: imgs, modelTier: ST().tier, ...nocache });
    const arr = res && Array.isArray(res.placche) ? res.placche : Array.isArray(res) ? res : [];
    part.forEach((g, gi) => {
      const r = arr.find(x => x && parseInt(x.img) === gi + 1) || arr[gi]; if (!r || typeof r !== 'object') return;
      const d = g.dets[0]; const note = String(r.note || '').slice(0, 160);
      const no10 = c => c === '0046_PRESA_10A' && !/scritta\s*["«']?\s*10\s*A/i.test(note) && hasSym('0075a_BIPRESA') ? '0075a_BIPRESA' : c;
      const posti = parseInt(r.posti); let pl = posti === 1 ? null : normPlacca(r.placca, r.posti);
      if (pl) { pl = pl.map(c => c && no10(c)); d.pl = pl; d.code = pl.find(Boolean); d.n = 1; }
      else if (posti === 1 && Array.isArray(r.placca) && r.placca.filter(Boolean).length === 1 && resolveCode(r.placca.find(Boolean))) { d.code = no10(resolveCode(r.placca.find(Boolean))); delete d.pl; d.n = 1; }
      else return; // niente di utile: resta la prima lettura
      d.bbox = g.box; d.zoom = true; const c = n01(r.conf); if (c != null) d.conf = c;
      if (note) d.note = ((d.note ? d.note + ' – ' : '') + 'ingrandimento: ' + note).slice(0, 200);
      g.dets.slice(1).forEach(x => drop.add(x));
    });
  }
  if (drop.size) ai.dets = ai.dets.filter(d => !drop.has(d));
}
/* ---- ritagli per leggere i quadri ---- */
async function cropBlob(blob, box, maxSide = 2048, minSide = 0) { // minSide: i ritagli piccoli vengono ingranditi (fino a 3x)
  const bm = await createImageBitmap(blob); const W = bm.width, H = bm.height;
  const x0 = clamp(Math.floor(box[0] * W), 0, W - 2), y0 = clamp(Math.floor(box[1] * H), 0, H - 2);
  const x1 = clamp(Math.ceil(box[2] * W), x0 + 2, W), y1 = clamp(Math.ceil(box[3] * H), y0 + 2, H);
  const cw = x1 - x0, ch = y1 - y0; let k = Math.min(1, maxSide / Math.max(cw, ch)); if (minSide && Math.max(cw, ch) * k < minSide) k = Math.min(3, minSide / Math.max(cw, ch));
  const c = newCanvas(Math.round(cw * k), Math.round(ch * k), false); c.getContext('2d').drawImage(bm, x0, y0, cw, ch, 0, 0, c.width, c.height);
  return { blob: await canvasToBlob(c, 'image/jpeg', 0.92), px: c.width * c.height };
}
async function quadroImages(blob, box) { // quadro intero + metà sinistra e destra ingrandite (se servono a leggere meglio)
  const b = box ? [box[0] - 0.04, box[1] - 0.04, box[2] + 0.04, box[3] + 0.04].map(v => r3(clamp(v, 0, 1))) : [0, 0, 1, 1];
  const full = await cropBlob(blob, b); const imgs = [full.blob];
  if ((CAP.imgMax || 1) >= 3 && full.px > 1.3e6) {
    const mx = (b[0] + b[2]) / 2, ov = (b[2] - b[0]) * 0.06;
    imgs.push((await cropBlob(blob, [b[0], b[1], mx + ov, b[3]])).blob, (await cropBlob(blob, [mx - ov, b[1], b[2], b[3]])).blob);
  }
  return { imgs, box: b };
}
const r3 = v => Math.round(v * 1000) / 1000;
function symListForAI(cats) { // i simboli della legenda dell'utente, per categoria (tutte o solo alcune)
  const by = {}; S.lib.symbols.filter(s => s.ai !== 0 && s.ai !== false && (!cats || cats.includes(s.cat))).forEach(s => (by[s.cat] = by[s.cat] || []).push(s));
  return Object.entries(CATS).filter(([c]) => by[c]).map(([c, cd]) => `# ${cd.n}\n` + by[c].map(s => `${s.code} | ${s.name} | ${MOUNTS[s.mount] || s.mount}`).join('\n')).join('\n');
}
const hasSym = c => S.lib.symbols.some(s => s.code === c);
function promptRilievo(ph) {
  const room = roomById(ph.roomId); const H = (room && room.h) || ST().roomH; const { tH } = camTan(ph); const hfov = Math.round(2 * Math.atan(tH) * 180 / Math.PI);
  return `Sei un tecnico che esegue il RILIEVO DELL'IMPIANTO ELETTRICO ESISTENTE durante un sopralluogo. Ti mando UNA foto.

CONTESTO
- Locale: "${room ? room.name : 'non specificato'}"${room && room.kind ? ' (' + room.kind + ')' : ''}, altezza soffitto circa ${H} m.
- ${ph.kind === 'soffitto' ? `Foto PUNTUALE: tablet puntato verso il soffitto oppure verso il pavimento, a circa ${ST().camH} m da terra; per ogni oggetto indica la posa (soffitto o pavimento).` : `Foto di PARETE/AMBIENTE: tablet tenuto in verticale a circa ${ST().camH} m da terra, inquadratura circa orizzontale.`}
- Campo visivo orizzontale circa ${hfov} gradi.${room && room.note ? '\n- Note del tecnico sul locale: ' + room.note : ''}

COMPITO
Trova OGNI componente elettrico visibile (anche parziale o lontano) e classificalo con UNO dei simboli della legenda del tecnico (codice | descrizione | posa tipica):
${symListForAI()}
Se non rientra in nessun simbolo usa "X" e descrivilo nella nota.

COME SCEGLIERE IL SIMBOLO
- Scegli il simbolo più specifico che la foto permette di confermare. Se dalla foto non si capiscono potenza, IP, lumen o tipo di scatola, usa il simbolo generico della famiglia (es. 0047 punto luce generico a soffitto, 0048 a parete, 0050 faretto, 0051 lampada di emergenza, 0019 scatola di derivazione, 0024 canalina${hasSym('RIL_PLAFONIERA') ? ', RIL_PLAFONIERA plafoniera lineare' : ''}) e scrivi nella nota quello che vedi.
- Prese italiane con 3 fori in linea: usa 0075a_BIPRESA (bipasso 10/16A). In foto la 10A e la bipasso sembrano uguali: usa 0046_PRESA_10A solo se sul frutto leggi la scritta 10A, e in quel caso scrivi nella nota «scritta 10A».
- Rivelatori di fumo: usa la serie 0156 / 0157. I simboli NOTIFIER solo se sul dispositivo leggi il marchio Notifier.
- Climatizzatore split: unità interna e unità esterna sono 0101 (punto alimentazione) con "etichetta" "U.I." oppure "U.E.".
- Quadro elettrico: QE_VUOTO, con "etichetta" la sigla scritta sul quadro se leggibile (es. QG, Q1).

REGOLE
- In "oggetti" l'impianto fisso: prese, comandi, punti luce fissi, quadri, scatole, canaline, utenze collegate fisse.
- Includi anche i componenti che vedi attraverso porte o finestre aperte in altri locali, con "oltre_porta": true (verranno messi nel locale giusto e incrociati con le foto di quel locale).
- Le cose non fisse (lampade da tavolo o da terra, prolunghe, ciabatte, adattatori, elettrodomestici, cavi volanti) NON vanno in "oggetti" ma in "indizi": per ognuna scrivi cosa ti fa pensare (es. "lampada accesa sul comodino: probabile presa nascosta dietro il comodino") e indica il punto dove probabilmente si trova l'impianto nascosto, con il codice probabile.
- Un oggetto per ogni apparecchio fisico.
- Placche (comandi, prese, pulsanti, prese dati/TV…, anche su battiscopa o canalina): UN SOLO oggetto per ogni placca a 2 o più posti, con il bbox di tutta la placca, ANCHE SE C'È UN SOLO FRUTTO e gli altri posti sono tappi. Prima CONTA I POSTI sommando i frutti che vedi: una presa rotonda (schuko o universale) = 2 posti, una presa a 3 fori in linea (bipasso o 10A) = 1 posto, un tasto = 1 posto, una presa dati/TV = 1 posto, un tappo = 1 posto (modulo liscio, senza tasto né fori). Le placche esistono da 1, 2, 3, 4, 6 e 7 posti; la classica rettangolare orizzontale (scatola 503) ha 3 posti, anche quando due sono tappi; le placche lunghe (6-7 posti) sono frequenti negli uffici e nei capannoni: 2 schuko + 3 bipasso = 7 posti. Scrivi il totale in "posti" e in "placca" metti UN ELEMENTO PER OGNI POSTO, da sinistra a destra (dall'alto in basso se la placca è verticale): il codice della legenda del frutto, oppure null per un tappo o un posto vuoto; un frutto largo 2 posti occupa 2 elementi: il suo codice e poi null. La lunghezza di "placca" deve essere uguale a "posti" e MAI inferiore al numero di frutti che vedi. "code" = codice del primo frutto, "n" = 1. Esempi: interruttore, presa bipasso, interruttore = "posti":3, ["0035_INTERRUTTORE","0075a_BIPRESA","0035_INTERRUTTORE"]; tappo, presa bipasso, tappo = "posti":3, [null,"0075a_BIPRESA",null]; tappo, interruttore, tappo = "posti":3, [null,"0035_INTERRUTTORE",null]; 2 schuko e 3 bipasso = "posti":7, ["0076_SCHUKO",null,"0076_SCHUKO",null,"0075a_BIPRESA","0075a_BIPRESA","0075a_BIPRESA"]; due prese dati = "posti":2, ["0080_DATI","0080_DATI"]. "placca":null e "posti":1 solo per un frutto senza placca a più posti (es. presa a giorno, placca da un posto).
- Corpi illuminanti: un oggetto per apparecchio (in un capannone conta ogni armatura).
- Quadro elettrico: in "oggetti" mettilo una sola volta, con il bbox di tutto il quadro; il suo contenuto (moduli e interruttori) viene letto a parte su un ingrandimento.
- Canaline, passerelle, tubi a vista, strisce LED, binari: oggetti lineari; in "linea" metti i punti che seguono tutto il percorso visibile (inizio, ogni cambio di direzione, fine).
- Ogni voce deve corrispondere a qualcosa che si vede: niente voci vuote o di prova. Se non vedi nulla, liste vuote.
- Se sei incerto metti "conf" bassa (0-1) invece di inventare.
- Coordinate normalizzate 0-1 sulla foto: x da sinistra a destra, y dall'alto in basso.

Rispondi SOLO con questo JSON:
{"descrizione":"max 25 parole su ambiente e stato dell'impianto",
 "oggetti":[{"code":"0075a_BIPRESA","n":1,"bbox":[0.39,0.62,0.49,0.69],"pt":[0.44,0.655],"posti":3,"placca":[null,"0075a_BIPRESA",null],"linea":null,"posa":"parete","oltre_porta":false,"dist_m":2.5,"h_m":0.3,"etichetta":null,"note":"breve: tipo, serie, stato","conf":0.9}],
 "indizi":[{"testo":"lampada accesa sul comodino: probabile presa dietro il comodino","code":"0075a_BIPRESA","pt":[0.72,0.80],"posa":"parete","dist_m":2.0,"h_m":0.3,"conf":0.5}],
 "criticita":["anomalie visibili: cavi volanti, scatole senza coperchio, prese danneggiate, protezioni mancanti…"]}
"pt" = punto di fissaggio; "posti" = numero di posti della placca (tappi compresi); "placca" = un elemento per ogni posto da sinistra a destra (codice del frutto, null per tappo o posto vuoto), per ogni placca a 2 o più posti anche con un solo frutto; null solo per un frutto senza placca a più posti; "linea" = [[x,y],[x,y],…] solo per oggetti lineari, altrimenti null; "etichetta" = breve testo da scrivere accanto al simbolo (U.I., U.E., sigla del quadro), altrimenti null; "posa" = "parete" (fissato a un muro, anche se in alto, es. applique o faretti di un mobile a specchio) | "soffitto" (solo se fissato al soffitto) | "pavimento"; "dist_m" = distanza ORIZZONTALE stimata dal punto di scatto al muro o al punto dove l'oggetto è fissato, in metri (null se non stimabile); "h_m" = altezza da terra stimata in metri (null se non stimabile).`;
}
function promptQuadro(nImgs = 1) {
  return `Rilievo dell'impianto elettrico esistente. ${nImgs > 1 ? `Ti mando ${nImgs} immagini dello STESSO quadro elettrico: la prima intera, le altre sono ingrandimenti (metà sinistra e metà destra) per leggere meglio le targhette.` : 'Ti mando la foto di un quadro elettrico.'}

COMPITO
1. Dimensione: conta i moduli DIN di ogni fila (1 modulo = 17,5-18 mm, la larghezza di un magnetotermico 1P stretto). Moduli totali = somma di tutte le file, compresi posti vuoti e coprimoduli.
2. Elenca TUTTI gli apparecchi, fila per fila dall'alto, da sinistra a destra, con la posizione del primo modulo occupato ("pos") e quanti moduli occupa ("moduli"). Inserisci anche coprimoduli e posti vuoti come tipo "VUOTO", così la somma dei moduli di ogni fila torna.
3. Ricostruisci lo schema in modo elettricamente sensato: per ogni apparecchio indica in "a_monte" l'id dell'apparecchio che lo protegge (generale → differenziali → linee), deducendolo da posizione, pettine e cavi visibili. Se non è deducibile metti null e scrivilo nelle note.
4. Leggi le targhette: corrente nominale, curva, sensibilità e classe del differenziale, potere di interruzione, marca, modello, utenza scritta sull'etichetta.

Tipi: MT magnetotermico, MTD magnetotermico differenziale, ID differenziale puro, SPD scaricatore, SEZ sezionatore/generale non automatico, FUS portafusibili, CONT contattore, RELE relè/teleruttore, TIMER orologio/temporizzatore, STRUM strumento di misura, ALTRO, VUOTO.

Rispondi SOLO con questo JSON:
{"quadro":{"etichetta":"nome o sigla se scritti","involucro":"es. centralino da incasso","materiale":"plastica|metallo","ip":"IP40","moduli_totali":24,"file":[{"fila":1,"moduli":12,"occupati":10,"liberi":2}],"note":"stato generale e cosa non si legge, max 30 parole"},
 "apparecchi":[{"id":"A1","fila":1,"pos":1,"moduli":2,"tipo":"MTD","poli":"1P+N","In_A":25,"curva":"C","Idn_mA":30,"classe":"A","Icn_kA":4.5,"marca":"","modello":"","etichetta":"utenza scritta, se leggibile","funzione":"es. Generale, Linea prese cucina","a_monte":null,"bbox":[0.1,0.2,0.18,0.4],"conf":0.8}],
 "criticita":["es. differenziale assente, targhette mancanti, cavi non siglati, coperchi mancanti"]}
Usa null per ciò che non si legge: non inventare correnti o sensibilità. bbox normalizzato 0-1 sulla PRIMA immagine (x da sinistra, y dall'alto).`;
}
const n01 = v => (typeof v === 'number' && isFinite(v)) ? clamp(v, 0, 1) : null;
const arr2 = a => Array.isArray(a) && a.length === 2 && a.every(v => typeof v === 'number') ? a.map(v => clamp(v, 0, 1)) : null;
const arr4 = a => Array.isArray(a) && a.length === 4 && a.every(v => typeof v === 'number') ? a.map(v => clamp(v, 0, 1)) : null;
function normPlacca(a, posti) { // ["0035…", "0075a…", null] -> codici della legenda (null = tappo); basta un frutto (gli altri posti possono essere tappi); "posti" = quanti posti ha contato l'AI
  const np = parseInt(posti); const N0 = np >= 2 && np <= Math.max(...PL_SIZES) ? np : 0;
  if (!Array.isArray(a) || a.length < 2) { if (N0 && resolveCode(Array.isArray(a) ? a[0] : a)) a = [Array.isArray(a) ? a[0] : a]; else return null; } // un solo codice ma più posti contati: il resto sono tappi
  let pl = a.slice(0, 12).map(c => c == null || /^\s*(null|none|tappo|vuoto|-)?\s*$/i.test(String(c)) ? null : resolveCode(c) || 'X');
  while (pl.length > 2 && pl[pl.length - 1] == null && pl.length > Math.max(...PL_SIZES)) pl.pop();
  if (!pl.some(Boolean)) return null;
  while (pl.length < N0) pl.push(null); // l'AI ha contato più posti di quelli che ha elencato: la placca resta della misura giusta
  pl = pl.slice(0, Math.max(...PL_SIZES)); const N = PL_SIZES.find(n => n >= pl.length) || pl.length; while (pl.length < N) pl.push(null);
  return pl;
}
function normRilievo(res) {
  const o = res && typeof res === 'object' && !Array.isArray(res) ? res : {};
  const list = Array.isArray(o.oggetti) ? o.oggetti : Array.isArray(res) ? res : [];
  const hints = Array.isArray(o.indizi) ? o.indizi : [];
  const fb = S.lib.symbols.some(s => s.code === 'X') ? 'X' : S.lib.symbols[0].code;
  const one = (d, ind) => {
    const code = resolveCode(d.code) || fb;
    const ln = !ind && Array.isArray(d.linea) ? d.linea.map(arr2).filter(Boolean).slice(0, 24) : null;
    const out = { code, n: ind ? 1 : clamp(parseInt(d.n) || 1, 1, 99), bbox: arr4(d.bbox), pt: arr2(d.pt) || (ind && !arr4(d.bbox) ? [0.5, 0.65] : null), linea: ln && ln.length >= 2 ? ln : null, posa: ['parete', 'soffitto', 'pavimento'].includes(d.posa) ? d.posa : null, dist_m: num(d.dist_m), h_m: num(d.h_m), note: String((ind ? d.testo || d.note : d.note) || '').slice(0, 200), conf: n01(d.conf) };
    const tag = !ind && d.etichetta != null ? String(d.etichetta).trim().slice(0, 12) : ''; if (tag && !/^(null|none|-)$/i.test(tag)) out.tag = tag;
    if (d.oltre_porta === true) out.oltre = true; if (ind) out.indizio = true;
    const pl = !ind && normPlacca(d.placca, d.posti); if (pl) { out.pl = pl; out.code = pl.find(Boolean); out.n = 1; }
    // la 10A solo se l'AI ha letto la scritta sul frutto: da lontano 10A e bipasso sono uguali e di solito è una bipasso
    const no10 = c => c === '0046_PRESA_10A' && !/scritta\s*["«']?\s*10\s*A/i.test(out.note) && hasSym('0075a_BIPRESA') ? '0075a_BIPRESA' : c;
    out.code = no10(out.code); if (out.pl) out.pl = out.pl.map(c => c && no10(c));
    return out;
  };
  const dets = list.filter(d => d && typeof d === 'object' && !junkDet({ conf: n01(d.conf), note: d.note, bbox: d.bbox, pt: d.pt })).slice(0, 150).map(d => one(d, false))
    .concat(hints.filter(d => d && typeof d === 'object' && String(d.testo || d.note || '').trim() && !/placeholder|segnaposto/i.test(d.testo || '')).slice(0, 40).map(d => one(d, true)));
  return { desc: String(o.descrizione || '').slice(0, 300), crit: (Array.isArray(o.criticita) ? o.criticita : []).map(c => String(c).slice(0, 200)).filter(Boolean).slice(0, 10), dets };
}
function normQuadro(res) {
  const o = res && typeof res === 'object' ? res : {}; const q = o.quadro && typeof o.quadro === 'object' ? o.quadro : {};
  const s = (v, n = 60) => v == null ? '' : String(v).slice(0, n);
  const file = (Array.isArray(q.file) ? q.file : []).filter(f => f && typeof f === 'object').slice(0, 12).map(f => ({ fila: parseInt(f.fila) || null, moduli: num(f.moduli), occupati: num(f.occupati), liberi: num(f.liberi) }));
  const app = (Array.isArray(o.apparecchi) ? o.apparecchi : []).filter(d => d && typeof d === 'object').slice(0, 200).map((d, i) => ({
    id: s(d.id || 'A' + (i + 1), 8), fila: parseInt(d.fila ?? d.riga) || null, pos: parseInt(d.pos) || null, moduli: num(d.moduli), tipo: s(d.tipo, 10).toUpperCase(), poli: s(d.poli, 10), In_A: num(d.In_A), curva: s(d.curva, 4), Idn_mA: num(d.Idn_mA), classe: s(d.classe, 4), Icn_kA: num(d.Icn_kA),
    marca: s(d.marca, 30), modello: s(d.modello, 40), etichetta: s(d.etichetta, 80), funzione: s(d.funzione, 80), a_monte: d.a_monte == null || d.a_monte === '' ? null : s(d.a_monte, 8), bbox: arr4(d.bbox), conf: n01(d.conf),
  }));
  return { quadro: { etichetta: s(q.etichetta, 80), involucro: s(q.involucro, 120), materiale: s(q.materiale, 30), ip: s(q.ip, 10), moduli_totali: num(q.moduli_totali), file, note: s(q.note, 300) }, app, crit: (Array.isArray(o.criticita) ? o.criticita : []).map(c => String(c).slice(0, 200)).filter(Boolean).slice(0, 10), desc: s(q.note, 200) };
}
function applyDetections(ph, fresh) {
  if (fresh) { // nuova analisi: i riferimenti a questa foto non valgono più
    const touched = new Set();
    S.items.forEach(i => { if (i.tri && i.tri.some(s => s.p === ph.id)) { i.tri = i.tri.filter(s => s.p !== ph.id); touched.add(i); Sync.markItem(i); } });
    S.items.filter(i => i.photoId === ph.id && !i.ok && !i.lk && i.tri && i.tri.length).forEach(i => { const s0 = i.tri.shift(); Sync.markItem(i); i.photoId = s0.p; i.d = s0.d; touched.add(i); Sync.markItem(i); });
    touched.forEach(i => { relocateItem(i); Sync.markItem(i); });
  }
  const kept = S.items.filter(i => i.photoId === ph.id && (i.ok || i.lk));
  if (fresh) kept.forEach(i => { i.d = null; });
  const keptD = new Set(kept.map(i => i.d).filter(d => d != null));
  S.items = S.items.filter(i => !(i.photoId === ph.id && !i.ok && !i.lk));
  const k = ppm(planOf(ph.planId)); const created = [];
  (ph.ai.dets || []).forEach((det, di) => {
    if (keptD.has(di)) return;
    const it = { id: uid('i'), planId: ph.planId, photoId: ph.id, roomId: ph.roomId, s: det.code, x: 0, y: 0, pts: null, d: di, src: 'ai', ok: false, lk: false, n: det.n, h: det.h_m, note: det.note, conf: det.conf, est: false };
    if (det.indizio) it.hint = true; if (det.oltre) it.oltre = true; if (det.tag) it.tag = det.tag; detPlate(it, det);
    placeItem(it, ph); const r = roomAt(ph.planId, it.x, it.y); it.roomId = r ? r.id : ph.roomId;
    if (fresh && !it.hint && kept.some(o => Math.hypot(o.x - it.x, o.y - it.y) < 0.35 * k && (plKey(o) === plKey(it) || (isPlate(o) && (isPlate(it) || PL_REV[it.s]))))) return; // già confermato lì (anche una placca riletta con posti diversi)
    created.push(it);
  });
  spreadOverlaps(created.filter(i => !i.hint), ph);
  S.items.push(...created);
  const n = autoTriangulate(ph.planId); if (n) toast(`${n} oggett${n > 1 ? 'i visti' : 'o visto'} anche in un'altra foto: posizione incrociata`);
  Sync.mark('photo:' + ph.id);
}
