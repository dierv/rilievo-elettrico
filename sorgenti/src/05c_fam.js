/* ============ MODIFICA RAPIDA: menu a tendina per famiglia di oggetti ============ */
// ogni opzione: [valore, etichetta nel menu, testo aggiunto alla descrizione quando il simbolo della legenda non lo dice già]
const CEE_L = { A: 'a', B: 'b', 'B+N': 'c', C: 'd', 'C+N': 'e', D: 'f', 'D+N': 'g', E: 'h', 'E+N': 'i' };
const ceeCode = (ser, t) => { const l = CEE_L[t]; if (!l) return null; const suf = { '0115': '', '0117': '_MT', '0118': '_FUS', '0119': '_IMT' }[ser]; return `${ser}${l}_CEE_${t}${suf}`; };
const FAMS = [
  {
    id: 'cmd', def: { tipo: 'interruttore', lum: 'no', puls: 'luce', inst: 'inc' },
    map: {
      '0035_INTERRUTTORE': {}, '0036a_INTERRUTTORE_EXT': { inst: 'ext' }, '0036b_INTERRUTTORE_IP55': { inst: 'ip55' }, '0037_INTERRUTTORE_LUMINOSO': { lum: 'si' },
      '0038_INTERRUTTORE_BIPOLARE': { bip: 1 }, '0038a_INTERRUTTORE_BIPOLARE_EXT': { bip: 1, inst: 'ext' },
      '0039_DEVIATORE': { tipo: 'deviatore' }, '0039a_DEVIATORE_EXT': { tipo: 'deviatore', inst: 'ext' }, '0040_INVERTITORE': { tipo: 'invertitore' }, '0040a_INVERTITORE_EXT': { tipo: 'invertitore', inst: 'ext' },
      '0043a_PULSANTE': { tipo: 'pulsante' }, '0043b_PULSANTE_EXT': { tipo: 'pulsante', inst: 'ext' }, '0043c_PULSANTE_IP55': { tipo: 'pulsante', inst: 'ip55' }, '0044_PULSANTE_LUMINOSO': { tipo: 'pulsante', lum: 'si' },
      '0132_CH': { tipo: 'pulsante', puls: 'campanello' }, '0131_TN': { tipo: 'pulsante', puls: 'campanello', tn: 1 }, '0135_AP': { tipo: 'pulsante', puls: 'cancellino' },
    },
    fields: [
      { k: 'tipo', l: 'Tipo', o: [['interruttore', 'Interruttore', 'interruttore'], ['deviatore', 'Deviatore', 'deviatore'], ['invertitore', 'Invertitore', 'invertitore'], ['pulsante', 'Pulsante', 'pulsante']] },
      { k: 'lum', l: 'Luminoso', o: [['no', 'No', 'non luminoso'], ['si', 'Sì', 'luminoso']] },
      { k: 'puls', l: 'Pulsante per', show: a => a.tipo === 'pulsante', o: [['luce', 'Luce', 'per luce'], ['campanello', 'Campanello', 'per campanello'], ['cancellino', 'Apertura cancellino', 'apertura cancellino'], ['porta', 'Apertura porta', 'apertura porta'], ['altro', 'Altro', 'altro uso']] },
    ],
    code(a) {
      const e = a.inst === 'ext', ip = a.inst === 'ip55';
      if (a.tipo === 'pulsante') {
        if (a.puls === 'campanello') return a.tn ? '0131_TN' : '0132_CH';
        if (a.puls === 'cancellino' || a.puls === 'porta') return '0135_AP';
        return a.lum === 'si' ? '0044_PULSANTE_LUMINOSO' : e ? '0043b_PULSANTE_EXT' : ip ? '0043c_PULSANTE_IP55' : '0043a_PULSANTE';
      }
      if (a.tipo === 'deviatore') return e ? '0039a_DEVIATORE_EXT' : '0039_DEVIATORE';
      if (a.tipo === 'invertitore') return e ? '0040a_INVERTITORE_EXT' : '0040_INVERTITORE';
      if (a.lum === 'si') return '0037_INTERRUTTORE_LUMINOSO';
      if (a.bip) return e ? '0038a_INTERRUTTORE_BIPOLARE_EXT' : '0038_INTERRUTTORE_BIPOLARE';
      return e ? '0036a_INTERRUTTORE_EXT' : ip ? '0036b_INTERRUTTORE_IP55' : '0035_INTERRUTTORE';
    },
  },
  {
    id: 'presa', def: { tipo: '', inst: 'inc' },
    map: {
      '0046_PRESA_10A': { tipo: '10A' }, '0073_10A_FM': { tipo: '10A' }, '0074_16A_FM': { tipo: '16A' }, '0085_GENERICA': {},
      '0075a_BIPRESA': { tipo: 'bipasso' }, '0075b_BIPRESA_EXT': { tipo: 'bipasso', inst: 'ext' }, '0075c_BIPRESA_IP55': { tipo: 'bipasso', inst: 'ip55' }, '0075c_BIPRESA_UPS': { tipo: 'bipasso', ups: 1 },
      '0076_SCHUKO': { tipo: 'schuko' }, '0077a_UNIVERSALE': { tipo: 'universale' }, '0077b_UNIVERSALE_EXT': { tipo: 'universale', inst: 'ext' }, '0077c_UNIVERSALE_IP55': { tipo: 'universale', inst: 'ip55' }, '0077c_UNIVERSALE_UPS': { tipo: 'universale', ups: 1 },
      '0086a_10A_FM_MT': { tipo: '10A', prot: 'mt' }, '0086b_16A_FM_MT': { tipo: '16A', prot: 'mt' }, '0086c_BIPRESA_MT': { tipo: 'bipasso', prot: 'mt' }, '0086d_SCHUKO_MT': { tipo: 'schuko', prot: 'mt' }, '0086e_UNIVERSALE_MT': { tipo: 'universale', prot: 'mt' },
      '0087a_10A_FM_MTD': { tipo: '10A', prot: 'mtd' }, '0087b_16A_FM_MTD': { tipo: '16A', prot: 'mtd' }, '0087c_BIPRESA_MTD': { tipo: 'bipasso', prot: 'mtd' }, '0087d_SCHUKO_MTD': { tipo: 'schuko', prot: 'mtd' }, '0087e_UNIVERSALE_MTD': { tipo: 'universale', prot: 'mtd' },
    },
    fields: [
      { k: 'tipo', l: 'Tipo', o: [['10A', '10A', '10A'], ['bipasso', 'Bipasso 10/16A', 'bipasso 10/16A'], ['schuko', 'Schuko', 'schuko'], ['universale', 'Universale (schuko + bipasso)', 'universale'], ['16A', 'Solo 16A', '16A']] },
      { k: 'inst', l: 'Installazione', o: [['inc', 'A muro', 'a muro'], ['ext', 'Con scatola PVC', 'con scatola PVC'], ['ip55', 'Con coperchio IP55', 'con coperchio IP55']] },
    ],
    code(a) {
      const P = { mt: { '10A': '0086a_10A_FM_MT', '16A': '0086b_16A_FM_MT', bipasso: '0086c_BIPRESA_MT', schuko: '0086d_SCHUKO_MT', universale: '0086e_UNIVERSALE_MT' }, mtd: { '10A': '0087a_10A_FM_MTD', '16A': '0087b_16A_FM_MTD', bipasso: '0087c_BIPRESA_MTD', schuko: '0087d_SCHUKO_MTD', universale: '0087e_UNIVERSALE_MTD' } };
      if (!a.tipo) return null;
      if (a.prot && P[a.prot]) return P[a.prot][a.tipo];
      if (a.ups && (a.tipo === 'bipasso' || a.tipo === 'universale')) return a.tipo === 'bipasso' ? '0075c_BIPRESA_UPS' : '0077c_UNIVERSALE_UPS';
      if (a.tipo === '10A') return '0046_PRESA_10A';
      if (a.tipo === '16A') return '0074_16A_FM';
      if (a.tipo === 'schuko') return '0076_SCHUKO';
      if (a.tipo === 'bipasso') return a.inst === 'ext' ? '0075b_BIPRESA_EXT' : a.inst === 'ip55' ? '0075c_BIPRESA_IP55' : '0075a_BIPRESA';
      return a.inst === 'ext' ? '0077b_UNIVERSALE_EXT' : a.inst === 'ip55' ? '0077c_UNIVERSALE_IP55' : '0077a_UNIVERSALE';
    },
  },
  {
    id: 'cee', def: { tipo: 'A', prot: 'no' },
    map: (() => { const m = { '0116_CEE_24V': { tipo: '24V' } }; for (const t of Object.keys(CEE_L)) { m[ceeCode('0115', t)] = { tipo: t }; m[ceeCode('0117', t)] = { tipo: t, prot: 'mt' }; m[ceeCode('0118', t)] = { tipo: t, prot: 'fus', ib: 1 }; m[ceeCode('0119', t)] = { tipo: t, prot: 'mt', ib: 1 }; } return m; })(),
    fields: [
      { k: 'tipo', l: 'Tipo', o: [['A', 'Monofase 2P+T 16A', 'monofase 16A'], ['B', 'Trifase 3P+T 16A', 'trifase 3P+T 16A'], ['B+N', 'Trifase 3P+N+T 16A', 'trifase 3P+N+T 16A'], ['C', 'Trifase 3P+T 32A', 'trifase 3P+T 32A'], ['C+N', 'Trifase 3P+N+T 32A', 'trifase 3P+N+T 32A'], ['D', 'Trifase 3P+T 63A', 'trifase 3P+T 63A'], ['D+N', 'Trifase 3P+N+T 63A', 'trifase 3P+N+T 63A'], ['E', 'Trifase 3P+T 125A', 'trifase 3P+T 125A'], ['E+N', 'Trifase 3P+N+T 125A', 'trifase 3P+N+T 125A'], ['24V', '24V con trasformatore', '24V']] },
      { k: 'prot', l: 'Protezione', o: [['no', 'Senza', 'senza protezione'], ['fus', 'Fusibili', 'con fusibili'], ['mt', 'MT', 'con MT'], ['mtd', 'MTD', 'con MTD']] },
    ],
    code(a) {
      if (a.tipo === '24V') return '0116_CEE_24V';
      if (a.prot === 'fus') return ceeCode('0118', a.tipo);
      if (a.prot === 'mt' || a.prot === 'mtd') return ceeCode(a.ib ? '0119' : '0117', a.tipo); // MTD non c'è in legenda: resta MT con la nota "con MTD"
      return ceeCode('0115', a.tipo);
    },
  },
  {
    id: 'can', def: { tipo: 'gen', dim: '', circ: '' },
    map: {
      '0024_CANALINA_POSACAVI': {}, '0025_CANALINA_ZINCATA_75': { tipo: 'lam', dim: '75' }, '0025a_CANALINA_ZINCATA_100': { tipo: 'lam', dim: '100' }, '0025b_CANALINA_ZINCATA_150': { tipo: 'lam', dim: '150' },
      '0025c_CANALINA_ZINCATA_200': { tipo: 'lam', dim: '200' }, '0025d_CANALINA_ZINCATA_300': { tipo: 'lam', dim: '300' }, '0025e_CANALINA_ZINCATA_400': { tipo: 'lam', dim: '400' }, '0025f_CANALINA_ZINCATA_500': { tipo: 'lam', dim: '500' },
      '0026_PASSERELLA_ACCIAIO_100': { tipo: 'filo', dim: '100' }, '0026a_PASSERELLA_ACCIAIO_150': { tipo: 'filo', dim: '150' }, '0026b_PASSERELLA_ACCIAIO_200': { tipo: 'filo', dim: '200' }, '0026c_PASSERELLA_ACCIAIO_300': { tipo: 'filo', dim: '300' }, '0026d_PASSERELLA_ACCIAIO_400': { tipo: 'filo', dim: '400' },
      'LEG_PASSERELLA_DOPPIA_200': { tipo: 'filo', dim: '200', dop: 1 }, 'LEG_PASSERELLA_DOPPIA_300': { tipo: 'filo', dim: '300', dop: 1 }, 'LEG_PASSERELLA_DOPPIA_400': { tipo: 'filo', dim: '400', dop: 1 }, 'LEG_PASSERELLA_DOPPIA_500': { tipo: 'filo', dim: '500', dop: 1 },
    },
    fields: [
      { k: 'tipo', l: 'Tipo', o: [['gen', 'Canalina (generica / PVC)', 'canalina'], ['lam', 'Passerella', 'passerella'], ['filo', 'A filo', 'a filo']] },
      { k: 'dim', l: 'Dimensione', o: [['30', '30 mm', '30 mm'], ['50', '50 mm', '50 mm'], ['75', '75 mm', '75 mm'], ['100', '100 mm', '100 mm'], ['150', '150 mm', '150 mm'], ['200', '200 mm', '200 mm'], ['300', '300 mm', '300 mm'], ['400', '400 mm', '400 mm'], ['500', '500 mm', '500 mm'], ['600', '600 mm', '600 mm']] },
      { k: 'circ', l: 'Circuito', o: [['energia', 'Energia', 'energia'], ['speciali', 'Speciali', 'speciali'], ['altro', 'Altro', 'altro circuito']] },
    ],
    code(a) {
      const L = { 75: '0025_CANALINA_ZINCATA_75', 100: '0025a_CANALINA_ZINCATA_100', 150: '0025b_CANALINA_ZINCATA_150', 200: '0025c_CANALINA_ZINCATA_200', 300: '0025d_CANALINA_ZINCATA_300', 400: '0025e_CANALINA_ZINCATA_400', 500: '0025f_CANALINA_ZINCATA_500' };
      const F = { 100: '0026_PASSERELLA_ACCIAIO_100', 150: '0026a_PASSERELLA_ACCIAIO_150', 200: '0026b_PASSERELLA_ACCIAIO_200', 300: '0026c_PASSERELLA_ACCIAIO_300', 400: '0026d_PASSERELLA_ACCIAIO_400' };
      const D = { 200: 'LEG_PASSERELLA_DOPPIA_200', 300: 'LEG_PASSERELLA_DOPPIA_300', 400: 'LEG_PASSERELLA_DOPPIA_400', 500: 'LEG_PASSERELLA_DOPPIA_500' };
      const near = (T, d) => { const ks = Object.keys(T).map(Number); if (!d) return T[ks[0]]; return T[ks.reduce((b, k) => Math.abs(k - d) < Math.abs(b - d) ? k : b, ks[0])]; }; // misura non in legenda: la più vicina, la misura vera resta nella descrizione
      if (a.tipo === 'lam') return near(L, +a.dim);
      if (a.tipo === 'filo') return a.dop && D[a.dim] ? D[a.dim] : near(F, +a.dim);
      return '0024_CANALINA_POSACAVI';
    },
  },
];
const famOf = code => FAMS.find(f => f.map[code]) || null;
const famBase = (f, code) => ({ ...f.def, ...(f.map[code] || {}) });
const famAttrs = it => { const f = famOf(it.s); return f ? { ...famBase(f, it.s), ...(it.at || {}) } : null; };
function famExtra(it) { // caratteristiche scelte che il simbolo della legenda non dice già
  const f = famOf(it.s); if (!f || !it.at) return '';
  const base = famBase(f, it.s), a = famAttrs(it), out = [];
  for (const fd of f.fields) { if (fd.show && !fd.show(a)) continue; const v = a[fd.k]; if (v == null || v === '' || v === base[fd.k]) continue; const o = fd.o.find(x => x[0] === v); if (o) out.push(o[2]); }
  return out.join(', ');
}
function famSet(it, k, v) {
  const f = famOf(it.s); if (!f) return;
  const a = famAttrs(it); a[k] = v;
  if (f.id === 'cmd' && k === 'tipo') { delete a.bip; delete a.tn; if (v === 'pulsante' && !a.puls) a.puls = 'luce'; }
  if (f.id === 'cee' && k === 'prot') delete a.ib; // l'interblocco resta solo se non si cambia la protezione
  pushUndo();
  const code = f.code(a); if (code && S.lib.symbols.some(s => s.code === code)) it.s = code;
  it.at = a; it.ok = true; Sync.markItem(it);
}
function famFieldsHtml(it) {
  const pl = plateFieldsHtml(it); if (isPlate(it)) return `<div class="fam">${pl}</div>`;
  const f = famOf(it.s); if (!f) return pl ? `<div class="fam">${pl}</div>` : ''; const a = famAttrs(it);
  return `<div class="fam">${pl}${f.fields.filter(fd => !fd.show || fd.show(a)).map(fd => `<div><label class="f">${fd.l}</label><select data-fa="${fd.k}">${a[fd.k] ? '' : '<option value="" selected>— scegli —</option>'}${fd.o.map(o => `<option value="${o[0]}"${a[fd.k] === o[0] ? ' selected' : ''}>${esc(o[1])}</option>`).join('')}</select></div>`).join('')}</div>`;
}
// computo: stessa sigla ma caratteristiche diverse = righe diverse
const itemKey = it => { const x = famExtra(it); return x ? it.s + '|' + x : it.s; };
const kCode = k => k.split('|')[0];
const kExtra = k => k.split('|')[1] || '';
const kName = k => kCode(k) === 'PLACCA' ? 'Placca ' + kExtra(k) : symOf(kCode(k)).name + (kExtra(k) ? ' – ' + kExtra(k) : '');

/* ---- placche: una tendina per ogni posto ---- */
const PL_OPTS = [['', '— tappo / vuoto —'], ['interruttore', 'Interruttore'], ['interruttore_lum', 'Interruttore luminoso'], ['deviatore', 'Deviatore'], ['invertitore', 'Invertitore'],
  ['puls_luce', 'Pulsante luce'], ['puls_lum', 'Pulsante luminoso'], ['puls_campanello', 'Pulsante campanello'], ['puls_cancellino', 'Pulsante apertura cancellino'], ['puls_altro', 'Pulsante (altro uso)'],
  ['10A', 'Presa 10A'], ['bipasso', 'Presa bipasso 10/16A'], ['16A', 'Presa 16A'], ['schuko', 'Presa schuko'], ['universale', 'Presa universale'], ['usb', 'Presa USB'],
  ['dati', 'Presa dati RJ45'], ['tel', 'Presa telefono'], ['tv', 'Presa TV'], ['sat', 'Presa SAT'], ['tapparella', 'Comando tapparella'], ['variatore', 'Variatore (dimmer)'], ['termostato', 'Termostato'], ['altro', 'Altro']];
const PL_SIZES = [1, 2, 3, 4, 6, 7];
function plCode(o, inst) {
  const cmd = FAMS[0], pr = FAMS[1]; const i = inst || 'inc';
  switch (o) {
    case 'interruttore': return cmd.code({ tipo: 'interruttore', inst: i }); case 'interruttore_lum': return '0037_INTERRUTTORE_LUMINOSO';
    case 'deviatore': return cmd.code({ tipo: 'deviatore', inst: i }); case 'invertitore': return cmd.code({ tipo: 'invertitore', inst: i });
    case 'puls_luce': case 'puls_altro': return cmd.code({ tipo: 'pulsante', puls: 'luce', inst: i }); case 'puls_lum': return '0044_PULSANTE_LUMINOSO';
    case 'puls_campanello': return '0132_CH'; case 'puls_cancellino': return '0135_AP';
    case '10A': return '0046_PRESA_10A'; case '16A': return '0074_16A_FM'; case 'schuko': return '0076_SCHUKO';
    case 'bipasso': case 'universale': return pr.code({ tipo: o, inst: i });
    case 'usb': return '0084a_USB'; case 'dati': return '0080_DATI'; case 'tel': return '0079_TELEFONO'; case 'tv': return '0081_TV'; case 'sat': return '0082_SAT';
    case 'tapparella': return '0106_SALI-SCENDI'; case 'variatore': return '0041_INTERRUTTORE_VARIATORE'; case 'termostato': return '0092a_TERMOSTATO';
    default: return o && o !== 'altro' && S.lib.symbols.some(s => s.code === o) ? o : 'X'; // frutto della legenda senza voce in tendina: resta il suo simbolo
  }
}
const PL_REV = (() => { // simbolo della legenda -> voce della tendina
  const m = {}; const set = (o, ...cs) => cs.forEach(c => m[c] = o);
  set('interruttore', '0035_INTERRUTTORE', '0036a_INTERRUTTORE_EXT', '0036b_INTERRUTTORE_IP55', '0038_INTERRUTTORE_BIPOLARE', '0038a_INTERRUTTORE_BIPOLARE_EXT'); set('interruttore_lum', '0037_INTERRUTTORE_LUMINOSO');
  set('deviatore', '0039_DEVIATORE', '0039a_DEVIATORE_EXT'); set('invertitore', '0040_INVERTITORE', '0040a_INVERTITORE_EXT');
  set('puls_luce', '0043a_PULSANTE', '0043b_PULSANTE_EXT', '0043c_PULSANTE_IP55'); set('puls_lum', '0044_PULSANTE_LUMINOSO'); set('puls_campanello', '0132_CH', '0131_TN'); set('puls_cancellino', '0135_AP');
  set('10A', '0046_PRESA_10A', '0073_10A_FM'); set('16A', '0074_16A_FM'); set('bipasso', '0075a_BIPRESA', '0075b_BIPRESA_EXT', '0075c_BIPRESA_IP55', '0085_GENERICA'); set('schuko', '0076_SCHUKO');
  set('universale', '0077a_UNIVERSALE', '0077b_UNIVERSALE_EXT', '0077c_UNIVERSALE_IP55'); set('usb', '0084a_USB'); set('dati', '0080_DATI'); set('tel', '0079_TELEFONO'); set('tv', '0081_TV'); set('sat', '0082_SAT');
  set('tapparella', '0106_SALI-SCENDI'); set('variatore', '0041_INTERRUTTORE_VARIATORE'); set('termostato', '0092a_TERMOSTATO', '0091_CRONOTERMOSTATO');
  return m;
})();
const isPlate = it => !!(it.pl && it.pl.length >= 2);
const plCodes = it => it.pl.map(o => o ? plCode(o, it.plInst) : null);
const lc1 = s => s.charAt(0).toLowerCase() + s.slice(1);
const plOptName = o => { const f = PL_OPTS.find(x => x[0] === o); return f ? f[1] : (symOf(o).name || o).replace(/\s*–?\s*in scatola PVC da incasso$/i, ''); };
const plDesc = it => isPlate(it) ? `placca ${it.pl.length} posti${it.plInst === 'ext' ? ' con scatola PVC' : it.plInst === 'ip55' ? ' con coperchio IP55' : ''}: ` + it.pl.map(o => o ? lc1(plOptName(o)) : 'tappo').join(', ') : '';
const plOpt = c => { const o = PL_REV[c]; return o && ['inc', 'ext', 'ip55'].some(i => plCode(o, i) === c) ? o : c; }; // voce della tendina, o il simbolo stesso se la tendina lo semplificherebbe
const triMatch = (A, B) => { // stesso oggetto visto in due foto? le placche devono avere gli stessi posti (almeno metà uguali)
  const pa = isPlate(A), pb = isPlate(B); if (pa !== pb) return false; if (!pa) return A.s === B.s;
  return A.pl.length === B.pl.length && A.pl.filter((o, i) => o === B.pl[i]).length * 2 >= A.pl.length;
};
const plKey = it => isPlate(it) ? 'PL' + it.pl.length + ':' + plCodes(it).join(',') : it.s; // stessa cosa? (doppioni)
function detPlate(it, det) { // placca letta dall'AI: un posto per frutto, da sinistra a destra
  if (!det || !Array.isArray(det.pl) || det.pl.length < 2) return;
  const inst = det.pl.some(c => c && /IP55/.test(c)) ? 'ip55' : det.pl.some(c => c && /EXT/.test(c)) ? 'ext' : 'inc';
  it.pl = det.pl.map(c => c ? plOpt(c) : ''); it.plInst = inst; it.n = 1; delete it.at;
  const f = it.pl.find(Boolean); if (f) it.s = plCode(f, inst);
}
function samePlate(a, b) { // due riquadri della stessa placca: uno dentro l'altro, oppure frutti affiancati alla stessa altezza
  const w = Math.min(a[2], b[2]) - Math.max(a[0], b[0]), h = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
  const ar = (a[2] - a[0]) * (a[3] - a[1]), br = (b[2] - b[0]) * (b[3] - b[1]);
  if (w > 0 && h > 0 && w * h / Math.max(1e-6, Math.min(ar, br)) > 0.5) return true;
  const ha = a[3] - a[1], hb = b[3] - b[1], hm = Math.min(ha, hb);
  return hm > 0 && h > 0.6 * hm && Math.max(ha, hb) < 1.6 * hm && -w < 0.35 * hm;
}
function plSiblings(it) { // gli altri frutti della stessa placca riconosciuti dall'AI: stessa foto, riquadri sovrapposti o affiancati
  const ph = it.photoId && photoById(it.photoId); const dets = ph && ph.ai && ph.ai.dets; const det = dets && dets[it.d]; if (!det || !det.bbox) return [];
  return S.items.filter(x => x !== it && x.photoId === it.photoId && x.d != null && !x.hint && !isPlate(x) && PL_REV[x.s] && dets[x.d] && dets[x.d].bbox && samePlate(dets[x.d].bbox, det.bbox));
}
function plOrder(parts, N) { // posti da sinistra a destra; se un riquadro è tutta la placca, gli altri frutti vanno nel posto in cui si trovano
  const cx = p => (p.b[0] + p.b[2]) / 2, area = p => (p.b[2] - p.b[0]) * (p.b[3] - p.b[1]);
  const C = parts.reduce((m, p) => area(p) > area(m) ? p : m);
  const inside = p => { const a = p.b, c = C.b; const w = Math.min(a[2], c[2]) - Math.max(a[0], c[0]), h = Math.min(a[3], c[3]) - Math.max(a[1], c[1]); return w > 0 && h > 0 && w * h > 0.6 * area(p); };
  if (parts.length > 1 && C.b[2] > C.b[0] && parts.every(p => p === C || (inside(p) && area(p) < 0.7 * area(C)))) {
    const out = Array(N).fill(null);
    const put = (o, i) => { let best = -1; for (let j = 0; j < N; j++) if (out[j] == null && (best < 0 || Math.abs(j - i) < Math.abs(best - i))) best = j; if (best >= 0) out[best] = o; };
    parts.filter(p => p !== C).sort((p, q) => cx(p) - cx(q)).forEach(p => {
      const i0 = Math.floor((cx(p) - C.b[0]) / (C.b[2] - C.b[0]) * N - (p.o.length - 1) / 2);
      p.o.forEach((o, k) => put(o, clamp(i0 + k, 0, N - 1)));
    });
    C.o.forEach(o => put(o, 0));
    return out.map(v => v || '');
  }
  const flat = parts.slice().sort((p, q) => cx(p) - cx(q)).flatMap(p => p.o);
  return flat.concat(Array(Math.max(0, N - flat.length)).fill('')).slice(0, N);
}
function plSetSize(it, N) {
  pushUndo();
  if (N <= 1) { if (it.pl) { const f = it.pl.find(Boolean); if (f) it.s = plCode(f, it.plInst); delete it.pl; delete it.plInst; } it.ok = true; Sync.markItem(it); return; }
  if (!it.pl) {
    const own = { b: null, o: Array(Math.max(1, it.n || 1)).fill(plOpt(it.s)) }; const inst = (famAttrs(it) || {}).inst || (/IP55/.test(it.s) ? 'ip55' : /EXT/.test(it.s) ? 'ext' : 'inc');
    const ph = it.photoId && photoById(it.photoId); const dets = ph && ph.ai && ph.ai.dets; own.b = dets && dets[it.d] && dets[it.d].bbox;
    const sib = plSiblings(it); const parts = [own].concat(sib.map(x => ({ b: dets[x.d].bbox, o: Array(Math.max(1, x.n || 1)).fill(plOpt(x.s)) })));
    const tot = parts.reduce((s, p) => s + p.o.length, 0);
    let list = own.o;
    if (sib.length && tot <= N) { list = plOrder(parts, N); sib.forEach(x => Sync.markItem(x)); S.items = S.items.filter(x => !sib.includes(x)); }
    it.pl = list; it.plInst = inst; it.n = 1; delete it.at;
  }
  while (it.pl.length < N) it.pl.push(''); it.pl.length = N;
  const f = it.pl.find(Boolean); if (f) it.s = plCode(f, it.plInst); it.ok = true; Sync.markItem(it);
}
function plSet(it, i, v) { pushUndo(); if (i === 'inst') it.plInst = v; else it.pl[i] = v; const f = it.pl.find(Boolean); if (f) it.s = plCode(f, it.plInst); it.ok = true; Sync.markItem(it); }
function plateFieldsHtml(it) {
  const canPlate = isPlate(it) || PL_REV[it.s]; if (!canPlate) return '';
  const N = isPlate(it) ? it.pl.length : 1;
  const sizeSel = `<div><label class="f">Placca</label><select data-pln="1">${PL_SIZES.map(n => `<option value="${n}"${n === N ? ' selected' : ''}>${n === 1 ? 'Frutto singolo' : n + ' posti'}</option>`).join('')}</select></div>`;
  if (!isPlate(it)) return sizeSel;
  return sizeSel + `<div><label class="f">Installazione</label><select data-pli="1">${[['inc', 'A muro'], ['ext', 'Con scatola PVC'], ['ip55', 'Con coperchio IP55']].map(([v, l]) => `<option value="${v}"${(it.plInst || 'inc') === v ? ' selected' : ''}>${l}</option>`).join('')}</select></div>` +
    it.pl.map((o, i) => `<div><label class="f">Posto ${i + 1}</label><select data-plp="${i}">${(PL_OPTS.some(x => x[0] === o) ? PL_OPTS : PL_OPTS.concat([[o, plOptName(o)]])).map(([v, l]) => `<option value="${esc(v)}"${o === v ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></div>`).join('');
}
function itemParts(it) { // cosa conta nel computo: una placca vale un frutto per ogni posto, più la placca
  if (isPlate(it)) { const q = it.n || 1; const inst = it.plInst || 'inc'; const ex = c => inst === 'ext' && !/EXT/.test(c) ? '|con scatola PVC' : inst === 'ip55' && !/IP55/.test(c) ? '|con coperchio IP55' : ''; return plCodes(it).filter(Boolean).map(c => ({ k: c + ex(c), q })).concat([{ k: 'PLACCA|' + it.pl.length + ' posti' + (inst === 'ext' ? ' con scatola PVC' : inst === 'ip55' ? ' con coperchio IP55' : ''), q }]); }
  return [{ k: itemKey(it), q: qtyOf(it) }];
}
