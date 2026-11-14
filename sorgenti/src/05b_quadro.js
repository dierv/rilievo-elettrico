/* ============ QUADRI: contenuto letto dall'AI, in ordine ============ */
const TIPI_Q = { SEZ: 'Sezionatore / generale', MTD: 'Magnetotermico differenziale', MT: 'Magnetotermico', ID: 'Differenziale puro', SPD: 'Scaricatore SPD', FUS: 'Portafusibili', CONT: 'Contattore', RELE: 'Relè / teleruttore', TIMER: 'Orologio / timer', STRUM: 'Strumento di misura', ALTRO: 'Altro', VUOTO: 'Posto libero / coprimodulo' };
const QTIER = 'complex'; // il quadro va letto con la massima precisione
const QRUN = new Set();
const nfq = v => v == null ? '' : String(v).replace('.', ',');
const filaOf = d => d.fila ?? d.riga ?? null;
function fmtApp(d) {
  const p = [d.tipo || '?']; const cv = d.curva && /^[A-Z]{1,2}$/i.test(d.curva) ? d.curva.toUpperCase() : '';
  if (d.poli) p.push(d.poli);
  if (d.In_A != null) p.push(cv ? cv + nfq(d.In_A) : nfq(d.In_A) + 'A');
  if (d.Idn_mA != null) p.push(nfq(d.Idn_mA) + 'mA' + (d.classe ? ' cl.' + d.classe : ''));
  else if (d.classe && (d.tipo === 'ID' || d.tipo === 'MTD')) p.push('cl.' + d.classe);
  if (d.Icn_kA != null) p.push(nfq(d.Icn_kA) + 'kA');
  return p.join(' ');
}
const appRole = d => (d.tipo === 'SEZ' || /general/i.test(d.funzione + ' ' + d.etichetta)) ? 0 : d.tipo === 'SPD' ? 1 : (d.tipo === 'ID' || d.tipo === 'MTD') ? 2 : d.tipo === 'MT' ? 3 : 4;
function quadroStats(q) {
  const Q = q.quadro || {}; const app = q.app || []; const dev = app.filter(d => d.tipo !== 'VUOTO');
  let tot = Q.moduli_totali; const file = (Q.file || []).filter(f => f && f.fila != null);
  if (tot == null && file.length && file.every(f => f.moduli != null)) tot = file.reduce((s, f) => s + f.moduli, 0);
  const occ = dev.length && dev.every(d => d.moduli != null) ? dev.reduce((s, d) => s + d.moduli, 0) : null;
  return { Q, app, dev, tot, file, occ, nFile: file.length || new Set(app.map(filaOf).filter(f => f != null)).size || null };
}
function quadroLabel(it) { if (it.tag) return it.tag; const r = bestReading(it); return (r && r.q && r.q.quadro && r.q.quadro.etichetta) ? r.q.quadro.etichetta.slice(0, 10) : 'QE'; }
function quadroReadings(it) {
  const out = [];
  S.photos.filter(p => p.itemId === it.id && p.kind === 'quadro').forEach(p => out.push({ ph: p, q: p.ai && p.ai.app ? p.ai : null, d: null, src: 'foto del quadro' }));
  const add = (pid, d) => { const p = photoById(pid); if (!p || d == null || out.some(o => o.ph === p && o.d === d)) return; out.push({ ph: p, q: (p.ai && p.ai.qd && p.ai.qd[d]) || null, d, src: p.kind === 'soffitto' ? 'foto del soffitto' : 'foto della parete' }); };
  if (it.photoId) add(it.photoId, it.d); (it.tri || []).forEach(s => add(s.p, s.d));
  return out;
}
const qScore = r => r.q ? (r.q.app || []).filter(d => d.tipo !== 'VUOTO').length + (r.d == null ? 1000 : 0) : -1;
function bestReading(it) { return quadroReadings(it).filter(r => r.q).sort((a, b) => qScore(b) - qScore(a))[0] || null; }

function quadroView(q, o = {}) {
  if (!q || !q.app) return '';
  const st = quadroStats(q); const { Q, app, dev } = st;
  const where = (d, i) => o.ph ? ` data-act="qbox" data-id="${o.ph.id}" data-v="${i}" data-q="${o.d == null ? '' : o.d}"` : '';
  // riepilogo
  const head = [Q.etichetta && `<b>${esc(Q.etichetta)}</b>`, [Q.involucro, Q.materiale, Q.ip].filter(Boolean).map(esc).join(' • ')].filter(Boolean).join(' – ');
  const nums = [st.tot != null ? `<b>${st.tot} moduli</b>${st.file.length ? ` (${st.file.map(f => f.moduli ?? '?').join(' + ')})` : ''}` : '<b>moduli: da verificare</b>',
    st.nFile ? `${st.nFile} fil${st.nFile > 1 ? 'e' : 'a'}` : '', st.occ != null ? `${st.occ} occupati` : '', st.tot != null && st.occ != null ? `${Math.max(0, st.tot - st.occ)} liberi` : '', `${dev.length} apparecchi`].filter(Boolean).join(' • ');
  // controllo somma moduli per fila
  const byFila = new Map(); app.forEach((d, i) => { const f = filaOf(d) ?? 0; if (!byFila.has(f)) byFila.set(f, []); byFila.get(f).push({ d, i }); });
  const warn = [];
  for (const f of st.file) { const l = byFila.get(f.fila) || []; if (f.moduli != null && l.length && l.every(x => x.d.moduli != null)) { const s = l.reduce((a, x) => a + x.d.moduli, 0); if (Math.abs(s - f.moduli) > 0.01) warn.push(`Fila ${f.fila}: gli apparecchi letti occupano ${nfq(s)} moduli su ${f.moduli}`); } }
  // schema: chi protegge chi
  const ids = new Map(dev.map(d => [d.id, d])); const kids = new Map(); const roots = [];
  dev.forEach(d => { const up = d.a_monte && d.a_monte !== d.id && ids.has(d.a_monte) ? d.a_monte : null; if (up) { if (!kids.has(up)) kids.set(up, []); kids.get(up).push(d); } else roots.push(d); });
  const ord = (a, b) => appRole(a) - appRole(b) || (filaOf(a) || 0) - (filaOf(b) || 0) || (a.pos || 0) - (b.pos || 0);
  const linked = dev.some(d => d.a_monte && ids.has(d.a_monte));
  const node = (d, depth, seen) => {
    if (seen.has(d.id) || depth > 6) return ''; seen.add(d.id); const i = app.indexOf(d);
    const lab = [d.funzione, d.etichetta && d.etichetta !== d.funzione ? '«' + d.etichetta + '»' : ''].filter(Boolean).map(esc).join(' ');
    const ch = (kids.get(d.id) || []).sort(ord);
    return `<li><span class="qd"${where(d, i)}><b>${esc(fmtApp(d))}</b>${lab ? ' ' + lab : ''} <span class="mut">${filaOf(d) != null ? 'F' + filaOf(d) + (d.pos ? '.' + d.pos : '') : ''}${d.conf != null && d.conf < 0.5 ? ' • incerto' : ''}</span></span>${ch.length ? `<ul>${ch.map(c => node(c, depth + 1, seen)).join('')}</ul>` : ''}</li>`;
  };
  const seen = new Set(); const tree = roots.sort(ord).map(d => node(d, 0, seen)).join('') + dev.filter(d => !seen.has(d.id)).sort(ord).map(d => node(d, 0, seen)).join('');
  // disposizione fila per fila
  const filaKeys = [...byFila.keys()].sort((a, b) => a - b);
  const disp = filaKeys.map(f => {
    const l = byFila.get(f).slice().sort((a, b) => (a.d.pos || 0) - (b.d.pos || 0)); const decl = st.file.find(x => x.fila === f);
    return `<tr><th colspan="4" style="text-align:left;background:var(--sub)">Fila ${f || '?'}${decl && decl.moduli != null ? ` – ${decl.moduli} moduli` : ''}</th></tr>` + l.map(({ d, i }) => d.tipo === 'VUOTO'
      ? `<tr class="mut"${where(d, i)}><td class="n">${d.pos ?? ''}</td><td class="n">${nfq(d.moduli)}</td><td colspan="2">libero / coprimodulo</td></tr>`
      : `<tr${where(d, i)}><td class="n">${d.pos ?? ''}</td><td class="n">${nfq(d.moduli)}</td><td><b>${esc(fmtApp(d))}</b></td><td>${esc([d.funzione, d.etichetta && d.etichetta !== d.funzione ? '«' + d.etichetta + '»' : '', [d.marca, d.modello].filter(Boolean).join(' ')].filter(Boolean).join(' • '))}</td></tr>`).join('');
  }).join('');
  // conteggio per tipo (utile per il computo)
  const cnt = {}; dev.forEach(d => { const k = fmtApp(d); cnt[k] = (cnt[k] || 0) + 1; });
  const cntHtml = Object.entries(cnt).sort((a, b) => b[1] - a[1]).map(([k, n]) => `<div>${n} × ${esc(k)}</div>`).join('');
  return `<div class="quadro">
    ${head ? `<div class="small">${head}</div>` : ''}<div class="small" style="margin-top:2px">${nums}</div>
    ${warn.map(w => `<div class="banner warn" style="margin-top:6px">${esc(w)}: verifica sulla foto.</div>`).join('')}
    ${dev.length ? `<div style="margin-top:8px"><b class="small">Schema${linked ? '' : ' (collegamenti non leggibili: ordine generale → protezioni → linee)'}</b><ul class="qtree">${tree}</ul></div>` : ''}
    <details style="margin-top:6px"${o.open ? ' open' : ''}><summary class="small"><b>Disposizione fila per fila</b></summary><div style="max-height:340px;overflow:auto"><table class="t small"><tr><th class="n">Pos</th><th class="n">Mod</th><th>Apparecchio</th><th>Funzione / etichetta</th></tr>${disp}</table></div></details>
    ${cntHtml ? `<details style="margin-top:4px"><summary class="small"><b>Conteggio apparecchi</b></summary><div class="small">${cntHtml}</div></details>` : ''}
    ${(q.crit || []).length ? `<div class="small" style="color:var(--warn);margin-top:6px"><b>Criticità:</b> ${q.crit.map(esc).join(' • ')}</div>` : ''}
    ${Q.note ? `<div class="small mut" style="margin-top:4px">${esc(Q.note)}</div>` : ''}
    ${o.ph ? `<button class="sm" style="margin-top:6px" data-act="qbox" data-id="${o.ph.id}" data-v="" data-q="${o.d == null ? '' : o.d}">Vedi gli apparecchi sulla foto</button>` : ''}</div>`;
}
function quadroSection(it) {
  const rs = quadroReadings(it); const best = rs.filter(r => r.q).sort((a, b) => qScore(b) - qScore(a))[0];
  const running = rs.some(r => r.d == null ? (r.ph.aiSt === 'run' || r.ph.aiSt === 'queued') : QRUN.has(r.ph.id + ':' + r.d));
  const pn = photoNumbers();
  return `<div class="sec"><div class="row"><b>Contenuto del quadro</b>${running ? '<span class="chip warn" style="flex:none">Lettura in corso…</span>' : ''}</div>
    ${best ? `<div class="mut small" style="margin:2px 0 6px">Letto da ${pn.get(best.ph.id) || 'foto'} (${best.src})</div>${quadroView(best.q, { ph: best.ph, d: best.d })}`
      : `<div class="mut small" style="margin-top:4px">${rs.length && !running ? 'Lettura non disponibile. ' : ''}Per l'elenco esatto di moduli e interruttori fotografa il quadro aperto, di fronte, con le targhette leggibili.</div>`}
    ${rs.filter(r => r.q && r !== best).map(r => `<details style="margin-top:6px"><summary class="small">Altra lettura da ${pn.get(r.ph.id) || 'foto'} (${r.src})</summary>${quadroView(r.q, { ph: r.ph, d: r.d })}</details>`).join('')}
    <div class="row wrap" style="margin-top:8px"><button class="ai sm" data-act="attPhoto" data-v="quadro">📷 Foto quadro aperto</button>${rs.length && canAI() ? `<button class="sm" data-act="reread" ${running ? 'disabled' : ''}>↻ Rileggi quadro</button>` : ''}</div></div>`;
}
async function readQuadroDet(ph, di, force) {
  const det = ph.ai && ph.ai.dets && ph.ai.dets[di]; if (!det || !det.bbox) throw { code: 'nobox' };
  const blob = await getBlob('photo_' + ph.id, ph.asset);
  const { imgs, box } = await quadroImages(blob, det.bbox);
  const res = await CAP.sample.json(promptQuadro(imgs.length), { images: imgs, modelTier: QTIER, ...(force ? { cache: false } : {}) });
  const q = normQuadro(res); q.crop = box; q.at = Date.now();
  if (!photoById(ph.id) || !ph.ai) return q;
  (ph.ai.qd = ph.ai.qd || {})[di] = q; Sync.mark('photo:' + ph.id);
  return q;
}
async function rereadQuadro(it) {
  const rs = quadroReadings(it); if (!rs.length) { toast('Nessuna foto del quadro da rileggere', true); return; }
  const jobs = rs.map(async r => {
    if (r.d == null) { AIQ.add(r.ph.id, true); return; }
    const key = r.ph.id + ':' + r.d; if (QRUN.has(key)) return; QRUN.add(key); renderPanel();
    try { await readQuadroDet(r.ph, r.d, true); } catch (e) { toast(e && e.code === 'nobox' ? 'Il quadro non è riquadrato nella foto: rianalizza la foto' : (AI_ERR[e && e.code] || 'Lettura del quadro non riuscita'), true); }
    QRUN.delete(key); if (S.sel && S.sel.id === it.id) renderPanel();
  });
  await Promise.all(jobs);
}
