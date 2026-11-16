/* ============ PIANI E SBLOCCHI ============ */
// Base gratis (solo penna), sblocchi singoli pagati una volta, abbonamenti (Pro, Studio) che comprendono
// tutti gli sblocchi, memoria in più. Prezzi e contenuti: «Versione vendibile – piano di lavoro», 15/11/2026.
// I blocchi valgono solo nell'app degli store (build_app.sh scrive LIC_ENFORCE): nella PWA e in Claude è tutto aperto.
// Da dove arrivano gli acquisti:
//   - store del dispositivo, Google Play o App Store (LicStore, in native_acquisti.js);
//   - account SopraLux: con l'accesso fatto, l'app manda al server le transazioni firmate dallo store e il server
//     risponde con i prodotti attivi dell'account, anche quelli comprati sull'altro tipo di dispositivo
//     (funzione verificaAcquisti, firebase/functions/acquisti.js). L'ultima risposta resta sul dispositivo;
//   - acquisti simulati, solo nelle build di prova (APP_CHANNEL 'prova'; su iPad solo nell'ambiente di prova di Apple).
// Oggi il server verifica le transazioni di Apple; quelle di Google Play si aggiungono dopo il passaggio dell'app all'account della SRL.
// I codici prodotto sono gli stessi nei due store: LIC_PRE + codice (elenco in docs/ACQUISTI.md).
const LIC_PRE = 'sopralux_';
const LIC_UNLOCKS = [
  ['penne', 'Penne in più', 'Verde, magenta, ciano, qualsiasi colore, tratto sottile e spesso', 0.99],
  ['bussola', 'Bussola', 'La pianta segue come sei girato (giroscopio o bussola)', 0.99],
  ['misura', 'Misura', 'Distanze, aree e scala della tavola', 0.99],
  ['audio', 'Note audio', 'Note vocali sulla pianta', 0.99],
  ['dxf', 'Colori del DXF', 'Colori originali di AutoCAD e sfondo grigio o nero', 0.99],
  ['tavolafoto', 'Tavola da foto', 'Fotografi il disegno cartaceo e diventa una tavola in scala', 1.99],
  ['foto', 'Foto sulla pianta', 'Foto con il cono della direzione, anche all\'esterno', 2.99],
].map(([id, name, desc, price]) => ({ id, name, desc, price, pid: LIC_PRE + id, kind: 'inapp', unlock: id }));
const LIC_ALL = { id: 'tutti', name: 'Tutti gli sblocchi', desc: 'Tutti i sette sblocchi, per sempre', price: 6.99, pid: LIC_PRE + 'tutti', kind: 'inapp', all: true };
const LIC_PLANS = [ // in ordine: il piano più alto comprende quelli sotto
  { id: 'pro', name: 'Pro', users: '1 utente, fino a 3 dispositivi', gb: 25, m: 14.99, y: 149.99, trial: 14 },
  { id: 'studio3', name: 'Studio 3', users: '3 utenti, sopralluoghi condivisi', gb: 100, m: 39.99, y: 399.99 },
  { id: 'studio10', name: 'Studio 10', users: '10 utenti, sopralluoghi condivisi', gb: 300, m: 109.99, y: 1099.99 },
];
const LIC_MEM = [['mem50', 50, 2.99], ['mem200', 200, 9.99], ['mem500', 500, 19.99]].map(([id, gb, price]) => ({ id, name: '+' + gb + ' GB', gb, price, pid: LIC_PRE + id, kind: 'subs', mem: gb, per: 'm' }));
const LIC_SKUS = (() => { // codice prodotto dello store -> che cosa dà
  const m = {};
  for (const u of LIC_UNLOCKS) m[u.pid] = u;
  m[LIC_ALL.pid] = LIC_ALL;
  for (const p of LIC_PLANS) for (const per of ['m', 'y']) { const pid = LIC_PRE + p.id + (per === 'm' ? '_mese' : '_anno'); m[pid] = { id: p.id + '_' + per, name: p.name + (per === 'm' ? ' mensile' : ' annuale'), price: p[per], pid, kind: 'subs', plan: p.id, per }; }
  for (const x of LIC_MEM) m[x.pid] = x;
  return m;
})();
const licPid = (plan, per) => LIC_PRE + plan + (per === 'm' ? '_mese' : '_anno');
// Funzioni dell'app: 'u' = sblocco singolo (o abbonamento), 'p' = solo abbonamento
const LIC_FEAT = {
  penne: ['Penne in più', 'u'], bussola: ['Bussola', 'u'], misura: ['Misura e scala', 'u'], audio: ['Note audio', 'u'], dxf: ['Colori del DXF', 'u'], tavolafoto: ['Tavola da foto', 'u'], foto: ['Foto sulla pianta', 'u'],
  stanze: ['Stanze', 'p'], simboli: ['Simboli e legenda', 'p'], controllo: ['Controllo e chiusura del sopralluogo', 'p'], computo: ['Computo ed esportazioni DXF, CSV e ZIP', 'p'], ai: ['Riconoscimento AI', 'p'], sync: ['Sincronizzazione su più dispositivi', 'p'],
};
const LIC_SOON = ['studio3', 'studio10', 'mem50', 'mem200', 'mem500']; // non ancora in vendita: nelle build per lo store non si comprano
const LIC_SOON_TXT = { pro: 'Con l\'accesso al tuo account SopraLux i sopralluoghi si salvano anche sul server e li ritrovi sugli altri tuoi dispositivi.', studio: 'Sopralluoghi condivisi: in arrivo.', mem: 'Lo spazio sul server è in arrivo.' };
const LIC_URL = { privacy: 'https://dierv.github.io/rilievo-elettrico/privacy.html', terms: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/', help: 'https://dierv.github.io/rilievo-elettrico/supporto.html' };
const LIC_LOCK = '<svg class="lki" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 10V7a5 5 0 0 1 10 0v3h1.5A1.5 1.5 0 0 1 20 11.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5v-8A1.5 1.5 0 0 1 5.5 10H7zm2 0h6V7a3 3 0 0 0-6 0v3z"/></svg>';
const licEur = v => { const [i, d] = v.toFixed(2).split('.'); return '€' + i.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + d; };
const LIC_FN = 'https://europe-west1-sopralux-64b29.cloudfunctions.net/verificaAcquisti'; // funzione «callable» di Firebase, chiamata senza SDK
const licUser = () => { try { return (typeof FirebaseAccount !== 'undefined' && FirebaseAccount.auth && FirebaseAccount.auth.currentUser) || null; } catch (e) { return null; } };
async function licGettone(uid) { // appAccountToken di Apple: UUID ricavato dall'uid, stessa formula del server (gettoneAccount in acquisti.js)
  try {
    const b = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('sopralux:' + uid)));
    const h = [...b].map(x => x.toString(16).padStart(2, '0')).join('');
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-${((parseInt(h[16], 16) & 3) | 8).toString(16)}${h.slice(17, 20)}-${h.slice(20, 32)}`;
  } catch (e) { return null; }
}

const Lic = {
  on: typeof LIC_ENFORCE !== 'undefined' && !!LIC_ENFORCE, // blocchi attivi (app degli store)
  channel: typeof APP_CHANNEL !== 'undefined' ? APP_CHANNEL : 'store', // 'prova' (APK di prova, TestFlight) o 'store'
  storeIds: [], simIds: [], // prodotti posseduti: dallo store del dispositivo, simulati
  acc: null, accKey: '', accAt: 0, accBusy: false, accBusyKey: '', accP: null, accAgain: false, // account SopraLux: { uid, prodotti: { codice: { scade, store, prova } }, altro, t }
  sandbox: null, // iPad: true nell'ambiente di prova di Apple (TestFlight), false nell'App Store
  prices: null, pricesAt: 0, priceErr: '', loading: false, busy: null, focus: null, started: false,

  /* ---- stato ---- */
  load() {
    const c = UIP.get('licStore', null); this.storeIds = c && Array.isArray(c.ids) ? c.ids.filter(p => LIC_SKUS[p]) : [];
    const s = UIP.get('licSim', []); this.simIds = Array.isArray(s) ? s.filter(p => LIC_SKUS[p]) : [];
    this.sandbox = UIP.get('licSb', null) === true ? true : null; // iPad: ultimo ambiente visto (si ricontrolla aprendo «Piani e sblocchi»)
    const a = UIP.get('licAcc', null); this.acc = a && typeof a.uid === 'string' && a.prodotti && typeof a.prodotti === 'object' ? a : null;
  },
  // Prodotti attivi dell'account SopraLux aperto (ultima risposta del server; gli abbonamenti valgono fino alla scadenza)
  accIds() {
    const a = this.acc; if (!a) return [];
    const u = licUser(); if (u && u.uid !== a.uid) return []; // prima della risposta del server: si usa l'ultimo stato del suo stesso account
    if (!u && typeof FirebaseAccount !== 'undefined' && FirebaseAccount.ready) return []; // uscito dall'account
    const now = Date.now();
    return Object.keys(a.prodotti).filter(p => LIC_SKUS[p] && (!a.prodotti[p].scade || a.prodotti[p].scade > now));
  },
  api() { return typeof LicStore !== 'undefined' && LicStore.ok() ? LicStore : null; },
  platform() { try { return window.Capacitor && window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'web'; } catch (e) { return 'web'; } },
  storeName() { return this.platform() === 'ios' ? 'App Store' : this.platform() === 'android' ? 'Google Play' : 'store'; },
  // Acquisti simulati: mai nelle build per lo store. Su iPad anche la build di prova li accetta solo nell'ambiente di prova di Apple.
  testOk() { return this.on && this.channel === 'prova' && (this.platform() !== 'ios' || this.sandbox === true); },
  ids() { const own = this.storeIds.concat(this.accIds()); return new Set(this.testOk() ? own.concat(this.simIds) : own); },
  has(pid) { return this.ids().has(pid); },
  plan() { // piano attivo: il più alto fra quelli posseduti
    if (!this.on) return 'studio10';
    let best = -1; for (const pid of this.ids()) { const s = LIC_SKUS[pid]; if (s && s.plan) best = Math.max(best, LIC_PLANS.findIndex(p => p.id === s.plan)); }
    return best < 0 ? 'base' : LIC_PLANS[best].id;
  },
  planName() { const p = LIC_PLANS.find(x => x.id === this.plan()); return p ? p.name : 'Base'; },
  unlocked(u) { return !this.on || this.plan() !== 'base' || this.has(LIC_PRE + u) || this.has(LIC_ALL.pid); },
  can(f) { // la funzione f è attiva?
    if (!this.on) return true;
    const d = LIC_FEAT[f]; if (!d) return true;
    return d[1] === 'u' ? this.unlocked(f) : this.plan() !== 'base';
  },
  need(f) { if (this.can(f)) return true; this.open(f); return false; }, // se manca apre «Piani e sblocchi» su quella funzione
  memGb() { const p = LIC_PLANS.find(x => x.id === this.plan()); if (!p) return 0; let gb = p.gb; for (const pid of this.ids()) { const s = LIC_SKUS[pid]; if (s && s.mem) gb += s.mem; } return gb; },
  lock(f) { return this.can(f) ? '' : LIC_LOCK; }, // lucchetto da mettere accanto a una voce bloccata

  /* ---- avvio e aggiornamento dallo store ---- */
  async init() {
    if (this.started || !this.on) return; this.started = true; this.load();
    const st = this.api(); if (!st) return;
    st.onChange(() => this.refresh());
    this.refresh(); // senza attendere: l'app parte subito con l'ultimo stato noto
  },
  // iPad, build di prova: l'ambiente (prova di Apple o App Store) si chiede allo store quando si apre «Piani e sblocchi»,
  // non all'avvio, per non far comparire richieste di accesso all'App Store appena si apre l'app.
  async checkSandbox() {
    const st = this.api(); if (!st || this.channel !== 'prova' || this.platform() !== 'ios') return;
    let sb; try { sb = await Promise.race([st.sandbox(), new Promise(r => setTimeout(() => r(null), 4000))]); } catch (e) { sb = null; }
    if (sb === null || sb === this.sandbox) return;
    const was = this.testOk(); this.sandbox = sb; UIP.set('licSb', sb);
    if (was !== this.testOk()) this.changed(); else this.render();
  },
  async refresh(force = false) { // rilegge dallo store che cosa è posseduto su questo dispositivo, poi lo verifica sull'account
    const st = this.api(); if (!st) return false;
    try {
      const ids = (await st.owned()).filter(p => LIC_SKUS[p]).sort(); const old = this.storeIds.slice().sort();
      this.storeIds = ids; UIP.set('licStore', { ids, t: Date.now() });
      if (ids.join() !== old.join()) this.changed();
      this.syncAccount(force);
      return true;
    } catch (e) { console.warn('acquisti: lettura non riuscita', e); this.syncAccount(force); return false; }
  },
  // Account SopraLux: manda al server le transazioni firmate (iPad) e riceve i prodotti attivi dell'account.
  // Si ripete solo se cambiano account o transazioni, oppure dopo 10 minuti (force: subito, per esempio dopo un acquisto).
  async syncAccount(force = false) {
    if (!this.on) return;
    const u = licUser();
    if (!u) { // uscito dall'account: i suoi acquisti non valgono più su questo dispositivo (quelli dello store sì)
      if (this.acc && typeof FirebaseAccount !== 'undefined' && FirebaseAccount.ready) { const had = Object.keys(this.acc.prodotti).length; this.acc = null; this.accKey = ''; UIP.set('licAcc', null); if (had) this.changed(); }
      return;
    }
    const st = this.api(), apple = st && st.platform() === 'ios' ? (st.jws || []).slice() : [];
    const key = u.uid + '|' + apple.join('|');
    if (this.accBusy) { if (force || key !== this.accBusyKey) this.accAgain = true; return this.accP; } // già in corso: si aspetta quella (e, se serve, si ripete dopo)
    if (!navigator.onLine) return;
    if (!force && key === this.accKey && Date.now() - this.accAt < 10 * 60000) return;
    this.accBusy = true; this.accBusyKey = key;
    return (this.accP = this.askAccount(u, apple, key));
  },
  async askAccount(u, apple, key) {
    try {
      const token = await u.getIdToken();
      const r = await fetch(LIC_FN, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify({ data: { apple } }) });
      let j = null; try { j = await r.json(); } catch (e) { }
      if (!r.ok || !j || !j.result) throw new Error((j && j.error && j.error.message) || 'risposta ' + r.status);
      const cur = licUser(); if (!cur || cur.uid !== u.uid) return; // nel frattempo è cambiato account
      const before = this.accIds().sort().join();
      const prodotti = {}; for (const [p, v] of Object.entries(j.result.prodotti || {})) if (LIC_SKUS[p] && v) prodotti[p] = { scade: Number(v.scade) || null, store: v.store || '', prova: !!v.prova };
      const sp = j.result.spazio || {};
      this.acc = { uid: u.uid, prodotti, altro: Number(j.result.altroAccount) || 0, spazio: { usati: Number(sp.usati) || 0, limite: Number(sp.limite) || 0 }, t: Date.now() }; UIP.set('licAcc', this.acc);
      if (typeof PwaCloud !== 'undefined') { PwaCloud.upBytes = 0; PwaCloud.refresh && PwaCloud.refresh(); } // spazio usato: vale il conteggio del server
      this.accKey = key; this.accAt = Date.now();
      if (this.accIds().sort().join() !== before) this.changed(); else this.render();
    } catch (e) { console.warn('acquisti dell\'account: verifica non riuscita', e); }
    finally { this.accBusy = false; if (this.accAgain) { this.accAgain = false; setTimeout(() => this.syncAccount(true), 0); } }
  },
  onAccount() { // l'accesso all'account è cambiato (FirebaseAccount)
    if (!this.on) return;
    if (!licUser()) { this.syncAccount(); return; }
    if (this.acc && this.acc.uid !== licUser().uid) { this.acc = null; this.accKey = ''; UIP.set('licAcc', null); this.changed(); }
    this.syncAccount(true);
  },
  changed() { // gli sblocchi sono cambiati: si ridisegna quello che dipende da loro
    try {
      if (typeof S !== 'undefined' && S.sv) {
        if (typeof TOOL_LIC !== 'undefined' && TOOL_LIC[S.tool] && !this.can(TOOL_LIC[S.tool])) setTool('sel');
        if (!this.can('bussola') && typeof Compass !== 'undefined' && Compass.on) Compass.stop();
        licPenFix(); licTopbar(); renderTools(); renderPalette(); renderPanel(); colBtnUpdate();
        const P = curPlan(); if (P && planIsDxf(P)) loadPlanImage(P.id, true).then(redraw, () => { }); else redraw();
      } else if (typeof renderHome === 'function' && typeof S !== 'undefined' && typeof S.remoteOk !== 'undefined' && $('#home') && !$('#home').classList.contains('hide')) renderHome(); // solo ad avvio finito
    } catch (e) { console.warn(e); }
    if (typeof PwaCloud !== 'undefined' && PwaCloud.licChanged) PwaCloud.licChanged(); // archivio sul server: si accende o si spegne con il Pro
    this.render();
  },

  /* ---- prezzi dello store ---- */
  async loadPrices(force = false) {
    const st = this.api(); if (!st || this.loading) return;
    if (!force && this.prices && Date.now() - this.pricesAt < 5 * 60000) return;
    this.loading = true; this.render();
    try { this.prices = await st.products(Object.values(LIC_SKUS)); this.pricesAt = Date.now(); this.priceErr = Object.keys(this.prices).length ? '' : (st.lastErr || 'nessun prodotto restituito'); }
    catch (e) { this.prices = null; this.priceErr = st.lastErr || (e && e.message) || String(e); }
    this.loading = false; this.render();
  },
  info(pid) { return (this.prices && this.prices[pid]) || null; },
  price(sku) { const i = this.info(sku.pid); return i && i.price ? i.price : licEur(sku.price); },
  sellable(sku) { return !(this.channel === 'store' && LIC_SOON.includes(sku.plan || sku.id)); },

  /* ---- acquisto, ripristino, prova ---- */
  async buy(pid) {
    const sku = LIC_SKUS[pid], st = this.api(); if (!sku || !st || this.busy) return;
    if (!navigator.onLine) { toast('Per comprare serve una connessione.', true, 5000); return; }
    const cur = this.storeIds.map(p => LIC_SKUS[p]).find(s => s && s.plan);
    if (sku.plan && cur && this.platform() === 'android') { // su Android il cambio di piano dentro l'app non c'è ancora
      const go = await askConfirm(`Hai già l'abbonamento ${cur.name}. Su Android per cambiare piano disdici quello attuale da Google Play: alla scadenza scegli il nuovo.`, 'Apri Google Play');
      if (go) st.manage().catch(() => { }); this.open(this.focus); return;
    }
    const accPlan = this.accIds().map(p => LIC_SKUS[p]).find(s => s && s.plan && !this.storeIds.includes(s.pid));
    if (sku.plan && accPlan) { // abbonamento già sull'account, comprato con l'altro store: si evita di pagarne due
      const go = await askConfirm(`Il tuo account SopraLux ha già l'abbonamento ${accPlan.name}, comprato su un altro dispositivo: vale anche qui. Vuoi comunque comprare un altro abbonamento?`, 'Compra lo stesso');
      this.open(this.focus); if (!go) return;
    }
    this.busy = pid; this.render();
    try {
      const u = licUser(), gettone = u && this.platform() === 'ios' ? await licGettone(u.uid) : null;
      await st.buy(sku, this.info(pid), gettone);
      await this.refresh(true);
      toast(this.has(pid) ? `Acquisto completato: «${sku.name}» è attivo.` : 'Acquisto registrato: si attiva appena lo store lo conferma.', false, 6000);
    } catch (e) {
      const k = st.errKind(e);
      if (k === 'owned') { await this.refresh(true); toast(`«${sku.name}» era già tuo: attivato.`); }
      else if (k === 'pending') toast('Acquisto in attesa di approvazione: si attiva da solo quando viene confermato.', false, 7000);
      else if (k === 'missing') toast(`«${sku.name}» non è ancora in vendita su ${this.storeName()}.`, true, 6000);
      else if (k !== 'cancel') toast('Acquisto non riuscito: ' + ((e && e.message) || e), true, 7000);
    }
    this.busy = null; this.render();
  },
  async restore() {
    const st = this.api(); if (!st || this.busy) return;
    this.busy = 'restore'; this.render();
    try { await st.restore(); } catch (e) { if (st.errKind(e) !== 'cancel') console.warn('ripristino', e); }
    const ok = await this.refresh(true); await this.accP;
    this.busy = null; this.render();
    toast(!ok ? 'Ripristino non riuscito: controlla la connessione e riprova.' : this.storeIds.length || this.accIds().length ? 'Acquisti ripristinati.' : `Nessun acquisto trovato su questo account ${this.storeName()}.`, !ok, 6000);
  },
  sim(pid) { // build di prova: accende o spegne un acquisto senza passare dallo store
    if (!this.testOk() || !LIC_SKUS[pid]) return;
    const s = LIC_SKUS[pid]; let ids = this.simIds.filter(p => p !== pid);
    if (ids.length === this.simIds.length) { // si accende; di piani e di pacchetti di memoria ce n'è uno alla volta, come negli store
      if (s.plan) ids = ids.filter(p => !LIC_SKUS[p].plan); if (s.mem) ids = ids.filter(p => !LIC_SKUS[p].mem);
      ids.push(pid);
    }
    this.simIds = ids; UIP.set('licSim', ids); this.changed();
  },
  simClear() { this.simIds = []; UIP.set('licSim', []); this.changed(); },

  /* ---- schermata «Piani e sblocchi» ---- */
  open(focus) {
    this.focus = focus && LIC_FEAT[focus] ? focus : null;
    openModal('<div id="licBox"></div>', true); this.render(); this.loadPrices(); this.checkSandbox();
  },
  btn(sku, label) { // tasto di acquisto di un prodotto, secondo lo stato
    const own = this.has(sku.pid), test = this.testOk(), simd = test && this.simIds.includes(sku.pid), st = this.api();
    const t = test ? `<button class="sm" data-sim="${sku.pid}" title="Solo nell'app di prova: nessun acquisto vero">${simd ? 'Togli prova' : 'Prova'}</button>` : '';
    if (own) return `<span class="chip ok">✓ ${label ? label + ' attivo' : 'Attivo'}${simd ? ' (prova)' : ''}</span>${simd ? t : ''}`;
    if (!this.sellable(sku)) return '<span class="chip grey">In arrivo</span>';
    const price = (label ? label + ' ' : '') + this.price(sku);
    if (this.busy === sku.pid) return `<button class="sm pri" disabled>Attendi…</button>`;
    const ready = st && this.info(sku.pid) && !this.busy;
    return `<button class="sm pri" data-buy="${sku.pid}"${ready ? '' : ' disabled'}>${esc(price)}</button>${t}`;
  },
  html() {
    const plan = this.plan(), base = plan === 'base', st = this.api(), test = this.testOk(), store = this.storeName();
    const subOn = this.storeIds.some(p => LIC_SKUS[p] && LIC_SKUS[p].kind === 'subs');
    const f = this.focus && !this.can(this.focus) ? LIC_FEAT[this.focus] : null;
    const fu = f && f[1] === 'u' ? LIC_UNLOCKS.find(u => u.id === this.focus) : null;
    const nUn = LIC_UNLOCKS.filter(u => this.unlocked(u.id)).length;
    const state = base ? `<b>Base</b>, gratis${nUn ? ` · ${nUn} ${nUn === 1 ? 'sblocco' : 'sblocchi'} su ${LIC_UNLOCKS.length}` : ''}` : `<b>${esc(this.planName())}</b> · archivio ${this.memGb()} GB`;
    const allOwn = this.has(LIC_ALL.pid) || !base;
    const rows = LIC_UNLOCKS.map(u => { const inc = !this.has(u.pid) && allOwn;
      return `<div class="licr${fu && fu.id === u.id ? ' foc' : ''}" data-row="${u.id}"><div class="g"><b>${esc(u.name)}</b><div class="mut small">${esc(u.desc)}</div></div><div class="licb">${inc ? '<span class="chip ok">✓ Compreso</span>' : this.btn(u)}</div></div>`; }).join('');
    const allRow = `<div class="licr all" data-row="tutti"><div class="g"><b>${esc(LIC_ALL.name)}</b><div class="mut small">${esc(LIC_ALL.desc)}: invece di ${licEur(LIC_UNLOCKS.reduce((a, u) => a + u.price, 0))}</div></div><div class="licb">${!this.has(LIC_ALL.pid) && !base ? '<span class="chip ok">✓ Compreso</span>' : this.btn(LIC_ALL)}</div></div>`;
    const cards = LIC_PLANS.map((p, i) => {
      const m = LIC_SKUS[licPid(p.id, 'm')], y = LIC_SKUS[licPid(p.id, 'y')], cur = plan === p.id; const im = this.info(m.pid), iy = this.info(y.pid);
      const trial = p.trial && !cur && ((im && im.trial) || (iy && iy.trial) || (!this.prices && p.trial));
      const soon = i === 0 ? LIC_SOON_TXT.pro : LIC_SOON_TXT.studio;
      return `<div class="licc${cur ? ' cur' : ''}${i === 0 && base ? ' hot' : ''}"><div class="row"><h4>${esc(p.name)}</h4>${cur ? '<span class="chip ok" style="flex:none">Il tuo piano</span>' : ''}</div>
        <div class="licp">${esc(this.price(m))}<span class="mut small"> al mese</span></div>
        <ul class="small"><li>${esc(p.users)}</li><li>Archivio sul server: ${p.gb} GB${i ? ' in comune' : ''}</li><li>${i ? 'Tutto quello che c\'è nel Pro' : 'Stanze, simboli e legenda, quadri, controllo e chiusura, computo, esportazioni DXF/CSV/ZIP, AI'}</li><li>Tutti gli sblocchi compresi</li></ul>
        <div class="mut small">${esc(soon)}</div>
        ${trial ? `<div class="small" style="margin-top:6px;color:var(--ok)"><b>${trial} giorni di prova gratuita</b>, poi il prezzo del periodo scelto.</div>` : ''}
        <div class="licbb">${this.btn(m, 'Mensile')}${this.btn(y, 'Annuale')}</div><div class="mut small">Annuale: 2 mesi gratis.</div></div>`;
    }).join('');
    const mem = LIC_MEM.map(x => `<div class="licr" data-row="${x.id}"><div class="g"><b>${esc(x.name)}</b><div class="mut small">al mese, in aggiunta all'archivio del piano</div></div><div class="licb">${base && !this.has(x.pid) ? `<span class="mut small">${esc(this.price(x))}</span>` : this.btn(x)}</div></div>`).join('');
    const note = !st ? '' : this.loading ? '<div class="mut small">Leggo i prezzi dallo store…</div>'
      : this.prices && Object.keys(this.prices).length ? ''
        : `<div class="banner warn">${this.channel === 'prova' ? `Su ${store} questi prodotti non ci sono ancora (o lo store non risponde): gli acquisti veri si accendono quando i prodotti sono attivi nella console dello store.` : `Prezzi di ${store} non disponibili: controlla la connessione e riapri questa schermata.${this.platform() === 'ios' ? ' Se non tornano, premi «Ripristina acquisti» qui sotto: ricollega l\'app all\'App Store.' : ''}`}${this.priceErr ? `<div class="small mut" style="margin-top:4px">Dettaglio: ${esc(this.priceErr)}</div>` : ''}</div>`;
    return `<div class="row"><h3 style="flex:1">Piani e sblocchi</h3><button class="sm ghost" data-a="close" style="flex:none" title="Chiudi">✕</button></div>
      <div class="small">Adesso hai: ${state}</div>
      ${f ? `<div class="banner info"><span class="lkw">${LIC_LOCK}</span> <b>${esc(f[0])}</b> ${fu ? `si sblocca con «${esc(fu.name)}» (${esc(this.price(fu))}), con «${esc(LIC_ALL.name)}» o con un abbonamento.` : 'fa parte degli abbonamenti (Pro e Studio).'}</div>` : ''}
      ${note}
      ${test ? `<div class="banner warn"><div class="row" style="gap:10px"><div><b>App di prova.</b> «Prova» accende un acquisto senza passare dallo store: vale solo su questo dispositivo e non c'è nell'app in vendita.</div><button class="sm" data-a="simClear" style="flex:none" ${this.simIds.length ? '' : 'disabled'}>Azzera le prove</button></div></div>` : ''}
      <div class="sech">Base – gratis</div>
      <div class="small mut">Sopralluoghi e tavole (PDF, DXF, immagine) senza limiti. Penna nera, rossa e blu, tratto medio, gomma. Esporti la tavola con le scritte (immagine o PDF) e il backup completo. I dati restano sul dispositivo.</div>
      <div class="sech">Sblocchi singoli <span class="mut small" style="font-weight:400">si pagano una volta e restano per sempre</span></div>
      <div class="licl">${rows}${allRow}</div>
      <div class="sech">Abbonamenti <span class="mut small" style="font-weight:400">comprendono tutti gli sblocchi</span></div>
      <div class="licg">${cards}</div>
      <div class="mut small" style="margin-top:8px">Gli abbonamenti si rinnovano da soli, allo stesso prezzo, finché non li disdici dalle impostazioni del tuo account ${store} (almeno 24 ore prima della scadenza). Se l'abbonamento scade i tuoi dati restano leggibili, il backup resta gratis e gli sblocchi comprati restano tuoi.</div>
      <div class="sech">Memoria in più <span class="mut small" style="font-weight:400">con Pro o Studio</span></div>
      <div class="licl">${mem}</div><div class="mut small" style="margin-top:4px">${esc(LIC_SOON_TXT.mem)}</div>
      ${st && this.accOk() ? `<div class="small mut" id="licAccLine" style="margin-top:10px">${esc(this.accText())}</div>` : ''}
      <div class="acts" style="justify-content:flex-start">
        ${st ? `<button data-a="restore"${this.busy ? ' disabled' : ''}>${this.busy === 'restore' ? 'Ripristino…' : 'Ripristina acquisti'}</button>` : ''}
        ${st && subOn ? '<button data-a="manage">Gestisci abbonamento</button>' : ''}
        <span style="flex:1"></span>
        ${this.platform() === 'ios' ? `<a class="small" href="${LIC_URL.terms}" target="_blank" rel="noopener">Condizioni d'uso</a>` : ''}
        <a class="small" href="${LIC_URL.privacy}" target="_blank" rel="noopener">Privacy</a>
        <button class="pri" data-a="close">Chiudi</button></div>`;
  },
  accOk() { try { return typeof FirebaseAccount !== 'undefined' && !FirebaseAccount.hidden(); } catch (e) { return false; } }, // c'è l'accesso all'account in questa app
  accText() {
    if (!licUser()) return 'Entra nel tuo account SopraLux (con Apple o con Google) per usare gli acquisti su tutti i tuoi dispositivi.';
    const n = (this.acc && this.acc.altro) || 0;
    return 'Gli acquisti sono legati al tuo account SopraLux e valgono su tutti i tuoi dispositivi.'
      + (n ? ` ${n === 1 ? 'Un acquisto' : n + ' acquisti'} di questo account ${this.storeName()} ${n === 1 ? 'appartiene' : 'appartengono'} a un altro account SopraLux: su questo dispositivo ${n === 1 ? 'vale' : 'valgono'} lo stesso.` : '');
  },
  render() {
    const box = document.querySelector('#licBox'); if (!box) return;
    const sc = box.parentElement ? box.parentElement.scrollTop : 0;
    box.innerHTML = this.html();
    if (box.parentElement) box.parentElement.scrollTop = sc;
    box.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => this.buy(b.dataset.buy));
    box.querySelectorAll('[data-sim]').forEach(b => b.onclick = () => this.sim(b.dataset.sim));
    box.querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
      const a = b.dataset.a;
      if (a === 'close') closeModal();
      if (a === 'restore') this.restore();
      if (a === 'manage') { const st = this.api(); if (st) st.manage().catch(e => toast('Apri gli abbonamenti dalle impostazioni di ' + this.storeName() + '.', true, 6000)); }
      if (a === 'simClear') this.simClear();
    });
  },

  /* ---- riga nella prima schermata ---- */
  homeHtml() {
    if (!this.on) return '';
    const base = this.plan() === 'base', n = LIC_UNLOCKS.filter(u => this.unlocked(u.id)).length;
    return `<div class="banner${base ? ' info' : ''}" id="licHome"><div class="row wrap" style="gap:10px"><div style="flex:1;min-width:180px">Piano <b>${esc(this.planName())}</b>${base ? ` (gratis)${n ? ` · ${n} ${n === 1 ? 'sblocco' : 'sblocchi'}` : ': penna, tavole e backup'}` : ' ✓'}${this.testOk() && this.simIds.length ? ' <span class="chip warn">prova</span>' : ''}</div><button class="sm${base ? ' pri' : ''}" id="licOpen" style="flex:none">Piani e sblocchi</button></div></div>`;
  },
  homeWire() { const b = document.querySelector('#licOpen'); if (b) b.onclick = () => this.open(); },
};
Lic.load();

/* penna: nella Base restano nero, rosso, blu e il tratto medio */
const licPenCol = c => Lic.can('penne') || PEN_COLS.slice(0, 3).includes(c);
const licPenW = w => Lic.can('penne') || w === PEN_W[1];
function licPenFix() { if (!licPenCol(S.pen.col)) S.pen.col = PEN_COLS[1]; if (!licPenW(S.pen.w)) S.pen.w = PEN_W[1]; }

function licTopbar() { const b = $('#bComputo'); if (b) b.textContent = Lic.can('computo') ? 'Computo / Esporta' : 'Esporta'; } // tasto in alto: nella Base solo l'esportazione

/* pannello della tavola: riga del piano e guida «Come si usa» con le sole funzioni attive */
function licPanelHtml() {
  if (!Lic.on || Lic.plan() !== 'base') return '';
  return `<div class="row" style="margin:2px 0 8px"><span class="chip grey" style="flex:none">Piano Base</span><span style="flex:1"></span><button class="sm" data-act="lic" style="flex:none">Piani e sblocchi</button></div>`;
}
const LIC_GUIDE = [[/^<b>Stanza<\/b>|^Controlla, sposta|^Colori dei locali|^<b>Riquadro<\/b>/, 'stanze'], [/^<b>Foto<\/b>/, 'foto'], [/^<b>Simbolo<\/b>|^<b>Destino<\/b>/, 'simboli'], [/^<b>Nota audio<\/b>/, 'audio'], [/^<b>Tavola da foto<\/b>/, 'tavolafoto'], [/^<b>Misura<\/b>/, 'misura'], [/^<b>Colori del DXF<\/b>/, 'dxf']];
function licGuide(html) { // html: le righe <li> della guida completa
  if (!Lic.on) return html;
  const out = [];
  if (!Lic.can('stanze')) out.push('<b>Penna</b>: scrivi e disegna sulla tavola. Con la penna del tablet le dita spostano soltanto la pianta; due dita per lo zoom. «Fine» per tornare alla freccia.');
  for (const li of html.split('<li>').map(x => x.replace(/<\/li>\s*$/, '').trim()).filter(Boolean)) {
    const g = LIC_GUIDE.find(([re]) => re.test(li));
    if (g && !Lic.can(g[1])) continue;
    if (/^<b>Foto<\/b>/.test(li) && !Lic.can('ai')) { out.push('<b>Foto</b>: tocca dove sei, trascina verso dove guardi e scatta: sulla pianta resta il cono della direzione. Vale anche all\'esterno.'); continue; }
    if (/^<b>Rotazione<\/b>/.test(li) && !Lic.can('bussola')) { out.push('<b>Rotazione</b> (tasto in basso a destra, o due dita che torcono): gira la pianta come sei messo tu.'); continue; }
    out.push(li);
  }
  if (Lic.plan() === 'base') out.push('Stanze, simboli, computo e il resto: <button class="sm" data-act="lic" style="min-height:28px;padding:2px 8px">Piani e sblocchi</button>');
  return out.map(x => '<li>' + x + '</li>').join('');
}
