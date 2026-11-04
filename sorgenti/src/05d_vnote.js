/* ============ NOTE AUDIO ============ */
// nota: { id, num, planId, roomId, x, y, t, text, mime, ext, size, dur, asset, local }
// Il microfono non è consentito dentro le pagine di Claude: "Registra" apre il registratore del tablet (input file con capture).
// L'audio viaggia come testo base64 (gli asset accettano testo, non audio) e si ricompone qui per l'ascolto.
const VN_COL = '#0f766e';
const VN_MAX = 14 * 1024 * 1024;
const AUD_EXT = { 'audio/mp4': 'm4a', 'audio/x-m4a': 'm4a', 'audio/m4a': 'm4a', 'audio/aac': 'aac', 'audio/x-aac': 'aac', 'audio/mpeg': 'mp3', 'audio/mp3': 'mp3', 'audio/ogg': 'ogg', 'audio/opus': 'opus', 'audio/webm': 'webm', 'audio/amr': 'amr', 'audio/3gpp': '3gp', 'audio/3gpp2': '3g2', 'audio/wav': 'wav', 'audio/x-wav': 'wav', 'audio/wave': 'wav', 'audio/flac': 'flac', 'video/3gpp': '3gp', 'video/mp4': 'mp4', 'video/webm': 'webm' };
const AUD_MIME = { m4a: 'audio/mp4', mp4: 'audio/mp4', aac: 'audio/aac', mp3: 'audio/mpeg', ogg: 'audio/ogg', oga: 'audio/ogg', opus: 'audio/ogg', webm: 'audio/webm', amr: 'audio/amr', '3gp': 'audio/3gpp', '3gpp': 'audio/3gpp', '3g2': 'audio/3gpp2', wav: 'audio/wav', flac: 'audio/flac' };
let pendingVn = null; // nuova nota { planId, roomId, x, y } oppure { replace: id }
const vnoteById = id => S.vnotes.find(n => n.id === id);
const vnLabel = n => 'N' + n.num;
const vnFileName = n => `N${String(n.num).padStart(2, '0')}_${safeName(roomById(n.roomId)?.name || 'esterno')}.${n.ext || 'm4a'}`;
const fmtDur = s => { if (s == null || !isFinite(s)) return ''; const t = Math.round(s); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
const fmtDT = t => { try { return new Date(t).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
function audioKind(f) { // alcuni registratori non dichiarano il tipo: lo ricavo dall'estensione
  const ext = ((/\.([a-z0-9]{2,5})$/i.exec(f.name || '') || [])[1] || '').toLowerCase();
  let mime = (f.type || '').toLowerCase().split(';')[0];
  if (!/^(audio|video)\//.test(mime)) mime = AUD_MIME[ext] || '';
  return { mime, ext: AUD_MIME[ext] ? ext : AUD_EXT[mime] || ext || 'audio' };
}
function audioDuration(blob) {
  return new Promise(res => {
    let done = false; const a = document.createElement('audio'); const u = URL.createObjectURL(blob);
    const end = v => { if (done) return; done = true; a.removeAttribute('src'); URL.revokeObjectURL(u); res(v != null && isFinite(v) && v > 0 ? v : null); };
    a.preload = 'metadata'; a.muted = true;
    a.onloadedmetadata = () => { if (isFinite(a.duration) && a.duration > 0) end(a.duration); else { a.ontimeupdate = () => end(a.duration); try { a.currentTime = 1e7; } catch (e) { end(null); } } };
    a.onerror = () => end(null); setTimeout(() => end(null), 6000);
    a.src = u;
  });
}

/* ---- inserimento ---- */
function vnPlace(x, y) {
  const P = curPlan(); if (!P) return;
  const r = roomAt(P.id, x, y);
  S.tmp = { vn: { x: r1(x), y: r1(y) } }; redraw();
  openVnSheet({ planId: P.id, roomId: r ? r.id : null, x: r1(x), y: r1(y) });
}
function openVnSheet(pose) {
  pendingVn = pose; const rep = pose.replace ? vnoteById(pose.replace) : null; const room = roomById(rep ? rep.roomId : pose.roomId);
  const b = openModal(`<h3>🎙 ${rep ? (rep.mime ? 'Nuovo audio per la nota ' : 'Audio per la nota ') + vnLabel(rep) : 'Nota audio'}</h3><div class="mut small">${esc(room ? room.name : 'Fuori dai locali')}</div>
    <div id="vnBtns"><div class="row" style="margin-top:14px"><button class="pri" style="min-height:64px;font-size:17px" id="vnRec">🎙 Registra</button><button style="min-height:64px;font-size:17px" id="vnPick">📁 Scegli un audio</button></div>
    <div class="mut small" style="margin-top:8px">${Rec.can() ? 'Registra con il microfono del tablet: premi Stop per salvare.' : '"Registra" apre il registratore del tablet: quando premi stop e confermi, l\'audio torna qui.'}</div></div>
    ${rep ? '' : `<label class="f">Testo (facoltativo)</label><textarea id="vnTxt" placeholder="Scrivi, o detta con il microfono della tastiera"></textarea>`}
    <div class="acts"><button id="vnCanc">Annulla</button>${rep ? '' : '<button id="vnTxtOk">Salva solo il testo</button>'}</div>`);
  b.querySelector('#vnRec').onclick = async () => { if (!Rec.can() || !await Rec.start(b.querySelector('#vnBtns'), (blob, dur) => vnGotAudio(blob, dur))) $('#fAudRec').click(); };
  b.querySelector('#vnPick').onclick = () => $('#fAudPick').click();
  b.querySelector('#vnCanc').onclick = () => { closeModal(); pendingVn = null; if (!rep) setTool('sel'); };
  const ok = b.querySelector('#vnTxtOk');
  if (ok) ok.onclick = () => { const t = b.querySelector('#vnTxt').value.trim(); if (!t) { toast('Scrivi il testo, oppure registra', true); return; } const p = pendingVn; pendingVn = null; closeModal(); vnCreate(p, null, t); };
}
function initVnInputs() {
  const h = e => { const f = e.target.files && e.target.files[0]; e.target.value = ''; vnGotAudio(f); };
  $('#fAudRec').onchange = h; $('#fAudPick').onchange = h;
}
function vnGotAudio(f, dur) { // audio dal registratore del tablet, da un file o dal microfono
    if (!f || !pendingVn) return;
    const k = audioKind(f);
    if (!k.mime) { toast('Il file scelto non è un audio', true); return; }
    if (f.size > VN_MAX) { toast('Audio troppo lungo (massimo circa 14 MB, un quarto d\'ora)', true, 5000); return; }
    const p = pendingVn; pendingVn = null; const ta = $('#vnTxt'); const txt = ta ? ta.value.trim() : '';
    closeModal();
    const blob = f.type === k.mime ? f : new Blob([f], { type: k.mime });
    if (p.replace) { const n = vnoteById(p.replace); if (!n) return; pushUndo(); vnSetAudio(n, blob, k, dur); renderPanel(); redraw(); toast('Audio salvato nella nota ' + vnLabel(n)); }
    else vnCreate(p, { blob, k, dur }, txt);
}
function vnCreate(p, a, text) {
  pushUndo();
  const n = { id: uid('n'), num: Math.max(0, ...S.vnotes.map(v => v.num || 0)) + 1, planId: p.planId, roomId: p.roomId, x: p.x, y: p.y, t: Date.now(), text: text || '', mime: null, ext: null, size: 0, dur: null, asset: null, local: false };
  S.vnotes.push(n);
  if (a) vnSetAudio(n, a.blob, a.k, a.dur); else Sync.mark('plan:' + n.planId);
  setTool('sel'); select('vnote', n.id);
  toast(`Nota ${vnLabel(n)} salvata`);
}
function vnSetAudio(n, blob, k, dur) {
  n.mime = k.mime; n.ext = k.ext; n.size = blob.size; n.dur = dur ? Math.round(dur * 10) / 10 : null; n.asset = null; n.local = true; n.tu = Date.now();
  AudURL.delete(n.id);
  Uploads.add('audio_' + n.id, blob, 'audio', n.id);
  Sync.mark('plan:' + n.planId);
  audioDuration(blob).then(d => { if (d == null || !vnoteById(n.id)) return; n.dur = Math.round(d * 10) / 10; Sync.mark('plan:' + n.planId); if (S.sel && S.sel.id === n.id) { const m = $('#vnMeta'); if (m) m.textContent = vnMeta(n); } });
}

/* ---- ascolto ---- */
const AudURL = new Map();
async function vnAudioBlob(n) {
  const rec = await IDB.get('blobs', 'audio_' + n.id); if (rec && rec.blob) return rec.blob;
  if (!n.asset) throw new Error('Audio non ancora caricato: è sul tablet che l\'ha registrato.');
  const r = await fetch('/_blob/' + n.asset); if (!r.ok) throw new Error('Audio non trovato');
  const t = await r.text(); let mime = n.mime || 'audio/mp4', b64 = t;
  const m = /^RILAUDIO1\n([^\n]*)\n/.exec(t.slice(0, 200)); if (m) { mime = m[1] || mime; b64 = t.slice(m[0].length); }
  const bin = atob(b64.replace(/\s+/g, '')); const u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return new Blob([u8], { type: mime });
}
async function vnAudioUrl(n) {
  const key = (n.asset || '') + '|' + (n.tu || n.t);
  const c = AudURL.get(n.id); if (c && c.key === key) return c.url;
  const local = Uploads.localUrls.get('audio_' + n.id); if (local && n.local) return local;
  const url = URL.createObjectURL(await vnAudioBlob(n)); AudURL.set(n.id, { key, url }); return url;
}
function blobToB64(blob) {
  return new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => { const s = String(fr.result); res(s.slice(s.indexOf(',') + 1)); }; fr.onerror = () => rej(fr.error); fr.readAsDataURL(blob); });
}
async function audioUploadBody(blob) { return new Blob(['RILAUDIO1\n' + (blob.type || 'audio/mp4') + '\n', await blobToB64(blob)], { type: 'text/plain' }); }

/* ---- pannello ---- */
const vnMeta = n => [roomById(n.roomId)?.name || 'Fuori dai locali', fmtDT(n.t), fmtDur(n.dur), n.local && CAP.assets ? 'in caricamento' : ''].filter(Boolean).join(' • ');
function vnotePanel(el, n) {
  const canPlay = n.mime ? !!document.createElement('audio').canPlayType(n.mime) : false;
  el.innerHTML = `<h2>🎙 Nota audio ${vnLabel(n)}</h2>
    <div class="mut small" id="vnMeta">${esc(vnMeta(n))}</div>
    ${n.mime ? `<div id="vnPl" style="margin-top:10px"><audio controls preload="metadata" style="width:100%"></audio></div>${canPlay ? '' : `<div class="banner warn">Questo formato (${esc(n.ext || n.mime)}) non si ascolta nel browser: usa "Scarica audio".</div>`}` : '<div class="mut small" style="margin-top:8px">Nota solo testo.</div>'}
    <label class="f">Testo</label><textarea data-vf="text" placeholder="Scrivi, o detta con il microfono della tastiera">${esc(n.text || '')}</textarea>
    <div class="sec row wrap"><button class="sm" data-act="vnRec">🎙 ${n.mime ? 'Registra di nuovo' : 'Aggiungi audio'}</button>${n.mime ? '<button class="sm" data-act="vnDl">⬇ Scarica audio</button>' : ''}</div>
    <div class="mut small">Trascina il simbolo sulla pianta per spostare la nota.</div>
    <div class="sec row"><button class="sm danger" data-act="delVnote">Elimina nota</button><button class="sm ghost" data-act="desel">Chiudi</button></div>`;
  if (n.mime) vnAudioUrl(n).then(u => { const a = el.querySelector('#vnPl audio'); if (a && S.sel && S.sel.id === n.id) a.src = u; })
    .catch(e => { const d = el.querySelector('#vnPl'); if (d) d.innerHTML = `<div class="mut small">${esc(e.message || 'Audio non disponibile')}</div>`; });
}
function vnList(vns) { // elenco nel pannello del locale
  if (!vns.length) return '';
  return `<div class="sec"><b>🎙 Note audio (${vns.length})</b><div class="dlist">${vns.map(n => `<div class="drow" data-act="selVnote" data-id="${n.id}"><span style="font-size:18px">${n.mime ? '🎙' : '📝'}</span><div class="g"><div><b>${vnLabel(n)}</b>${n.dur ? ' • ' + fmtDur(n.dur) : ''} <span class="mut small">${esc(fmtDT(n.t))}</span></div>${n.text ? `<div class="mut small">${esc(n.text.slice(0, 140))}</div>` : ''}</div><span class="mut">›</span></div>`).join('')}</div></div>`;
}
async function vnAct(a, n) {
  if (!n) return;
  if (a === 'vnRec') openVnSheet({ replace: n.id });
  if (a === 'vnDl') { try { await vnDownload(n); } catch (e) { toast(e.message || 'Audio non disponibile', true); } }
  if (a === 'delVnote') { if (!await askConfirm(`Eliminare la nota ${vnLabel(n)}?`, 'Elimina', true)) return; pushUndo(); S.vnotes = S.vnotes.filter(x => x !== n); Sync.mark('plan:' + n.planId); select(null); }
}

const DL_OK = new Set('gif png jpg jpeg webp mp4 webm mov txt json md docx pptx epub csv ttf html svg pdf xlsx zip fig'.split(' '));
async function vnDownload(n) { // i download di Claude accettano solo alcune estensioni: m4a esce come mp4, gli altri dentro uno zip
  const blob = await vnAudioBlob(n); const name = vnFileName(n); const ext = (n.ext || '').toLowerCase();
  if (PLATFORM === 'claude' && !DL_OK.has(ext)) {
    if (ext === 'm4a') return saveFile(name.replace(/\.[^.]+$/, '.mp4'), blob);
    await needLib('zip'); const z = new JSZip(); z.file(name, blob); return saveFile(name.replace(/\.[^.]+$/, '.zip'), await z.generateAsync({ type: 'blob' }));
  }
  return saveFile(name, blob);
}

/* ---- registratore dentro l'app (solo app installata: dentro Claude il microfono è bloccato) ---- */
const Rec = {
  active: false, mr: null, stream: null, chunks: [], t0: 0, timer: null,
  can: () => PLATFORM === 'pwa' && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder),
  mime() { for (const m of ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']) if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) return m; return ''; },
  async start(box, onDone) { // box: elemento dove mostrare tasto stop e tempo
    let stream; try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: true } }); }
    catch (e) { toast(e && e.name === 'NotAllowedError' ? 'Microfono non consentito: abilitalo nelle impostazioni del sito, oppure usa "Scegli un audio".' : 'Microfono non disponibile', true, 6000); return false; }
    const mime = this.mime(); const mr = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 64000 } : undefined);
    Object.assign(this, { active: true, mr, stream, chunks: [], t0: Date.now() });
    mr.ondataavailable = e => { if (e.data && e.data.size) this.chunks.push(e.data); };
    mr.onstop = () => { const dur = (Date.now() - this.t0) / 1000; const type = (mr.mimeType || mime || 'audio/webm').split(';')[0]; const blob = new Blob(this.chunks, { type }); this.cleanup(); if (blob.size) onDone(blob, dur); };
    box.innerHTML = `<div class="rec"><span class="recdot"></span><b id="recT">0:00</b><span class="mut small">in registrazione…</span></div>
      <div class="row" style="margin-top:10px"><button class="danger" style="min-height:64px;font-size:17px" id="recStop">■ Stop e salva</button><button style="min-height:64px" id="recCanc">Annulla</button></div>`;
    this.timer = setInterval(() => { const el = $('#recT'); if (el) el.textContent = fmtDur((Date.now() - this.t0) / 1000); }, 250);
    box.querySelector('#recStop').onclick = () => this.stop();
    box.querySelector('#recCanc').onclick = () => { this.mr.onstop = () => this.cleanup(); this.stop(); closeModal(); pendingVn = null; setTool('sel'); };
    mr.start(1000); return true;
  },
  stop() { if (this.mr && this.mr.state !== 'inactive') this.mr.stop(); else this.cleanup(); },
  cleanup() { clearInterval(this.timer); if (this.stream) this.stream.getTracks().forEach(t => t.stop()); Object.assign(this, { active: false, mr: null, stream: null, chunks: [] }); },
};

/* ---- disegno ---- */
function drawVnMark(x, cx, cy, r, n, sel) {
  const k = r / 11; x.save();
  if (sel) { x.beginPath(); x.arc(cx, cy, r + 7 * k, 0, 7); x.fillStyle = 'rgba(250,204,21,.45)'; x.fill(); }
  x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fillStyle = VN_COL; x.fill(); x.lineWidth = Math.max(1.5, 2 * k); x.strokeStyle = '#fff'; x.stroke();
  x.strokeStyle = '#fff'; x.fillStyle = '#fff'; x.lineWidth = 1.6 * k; x.lineCap = 'round';
  if (!n || n.mime) { // microfono
    x.beginPath(); if (x.roundRect) x.roundRect(cx - 2.6 * k, cy - 6.8 * k, 5.2 * k, 8.6 * k, 2.6 * k); else x.rect(cx - 2.6 * k, cy - 6.8 * k, 5.2 * k, 8.6 * k); x.fill();
    x.beginPath(); x.arc(cx, cy - 2 * k, 5 * k, 0.12 * Math.PI, 0.88 * Math.PI); x.stroke();
    x.beginPath(); x.moveTo(cx, cy + 3 * k); x.lineTo(cx, cy + 6.5 * k); x.stroke();
  } else for (const dy of [-4, 0, 4]) { x.beginPath(); x.moveTo(cx - 5 * k, cy + dy * k); x.lineTo(cx + 5 * k, cy + dy * k); x.stroke(); } // solo testo
  if (n) { const lb = vnLabel(n); x.font = `700 ${Math.round(12 * k)}px sans-serif`; x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.lineWidth = 3 * k; x.strokeStyle = '#fff'; x.strokeText(lb, cx + r + 3 * k, cy + 4 * k); x.fillStyle = VN_COL; x.fillText(lb, cx + r + 3 * k, cy + 4 * k); }
  x.restore();
}
