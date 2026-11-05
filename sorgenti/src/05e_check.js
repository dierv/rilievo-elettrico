/* ---- controllo di completezza: ogni locale si colora da solo (arancio = manca qualcosa, blu = in lavorazione, verde = rilevato) ---- */
const ISSUE_TXT = {
  nophoto: 'nessuna foto e nessun elemento', noel: 'nessun elemento elettrico', nolight: 'nessun punto luce', nocmd: 'nessun comando (luce comandata da un altro locale?)',
  aipend: n => `${n} foto ancora da analizzare`, aierr: n => `${n} foto con analisi fallita`, drafts: n => `${n} bozze AI da confermare`, hints: n => `${n} indizi da verificare`,
};
const issueText = (k, n) => typeof ISSUE_TXT[k] === 'function' ? ISSUE_TXT[k](n) : ISSUE_TXT[k];
function roomIssues(r) { // motivi per cui il locale non è coerente (warn) o è ancora in lavorazione (info)
  const all = S.items.filter(i => i.roomId === r.id); const its = all.filter(i => !i.hint); const hints = all.filter(i => i.hint);
  const phs = S.photos.filter(p => p.roomId === r.id && p.kind !== 'dettaglio');
  const out = []; const add = (lvl, k, n) => out.push({ k, lvl, n, t: issueText(k, n) });
  if (!phs.length && !its.length) add('warn', 'nophoto');
  else if (!its.length) add('warn', 'noel');
  else if (!its.some(i => symOf(i.s).cat === 'L')) add('warn', 'nolight');
  else if (!its.some(i => symOf(i.s).cat === 'C')) add('info', 'nocmd');
  const pend = phs.filter(p => p.aiSt === 'queued' || p.aiSt === 'run' || (p.aiSt === 'none' && canAI())).length; if (pend) add('warn', 'aipend', pend);
  const err = phs.filter(p => p.aiSt === 'error').length; if (err) add('warn', 'aierr', err);
  const dr = its.filter(i => !i.ok).length; if (dr) add('info', 'drafts', dr);
  if (hints.length) add('info', 'hints', hints.length);
  return out;
}
const roomState = r => r.done ? 'done' : roomIssues(r).some(i => i.lvl === 'warn') ? 'warn' : 'ok';
const ROOM_COL = { // riempimento, bordo, testo del nome
  done: ['rgba(22,163,74,.12)', 'rgba(22,163,74,.85)', '#166534'],
  warn: ['rgba(234,88,12,.14)', 'rgba(194,65,12,.85)', '#9a3412'],
  ok: ['rgba(59,130,246,.06)', 'rgba(37,99,235,.75)', '#1e3a8a'],
};
const ROOM_DOT = { done: '🟢', warn: '🟠', ok: '🔵' };
const ROOM_LEGEND = '<span style="color:#c2410c">🟠 manca qualcosa</span> • <span style="color:#1e3a8a">🔵 in lavorazione</span> • <span style="color:#166534">🟢 rilevato</span>';
function issuesHtml(r, opt = {}) { // elenco dei motivi per il pannello del locale
  const iss = roomIssues(r); if (!iss.length) return opt.empty === false ? '' : '<div class="small" style="color:#166534;margin-top:4px">✓ Nessuna segnalazione: foto, punto luce e comandi ci sono.</div>';
  return `<ul class="small" style="padding-left:18px;margin:4px 0">${iss.map(i => `<li style="color:${i.lvl === 'warn' ? '#c2410c' : '#1e3a8a'}">${esc(i.t)}</li>`).join('')}</ul>`;
}
