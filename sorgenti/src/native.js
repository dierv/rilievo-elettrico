/* ============ APP NATIVA SopraLux (Capacitor, Android e iOS) – versione gratis ============
   Tutto resta sul dispositivo: niente account, niente sincronizzazione, niente service worker.
   Archivio automatico nella cartella Documenti/SopraLux (Android: app File → Documenti; iPad: app File → Sul mio iPad → SopraLux).
   Questo file si carica solo nella build dell'app (build_app.sh), dopo pwa.js: le funzioni con lo stesso nome sostituiscono quelle della PWA. */
const NAT = (() => { // plugin nativi; se qualcosa manca l'app parte lo stesso (senza archivio automatico)
  try {
    const C = window.Capacitor; if (!C || !C.isNativePlatform || !C.isNativePlatform()) return null;
    const plug = n => (typeof C.registerPlugin === 'function' ? C.registerPlugin(n) : C.Plugins && C.Plugins[n]) || null; // registerPlugin arriva da lib/capacitor.js
    const o = { fs: plug('Filesystem'), share: plug('Share'), app: plug('App') };
    return o.fs ? o : null;
  } catch (e) { console.error('plugin nativi', e); return null; }
})();
const NAT_DIR = 'DOCUMENTS', NAT_ROOT = 'SopraLux';
const FirebaseAccount = { init() { }, html: () => '', wire() { } }; // la versione gratis non ha account

/* cartella del dispositivo vista come una cartella del browser (stesse funzioni usate dall'archivio della PWA) */
const natPath = (...p) => p.filter(Boolean).join('/');
const natErr = e => { const x = new Error((e && e.message) || String(e)); x.name = /exist|not found|no such/i.test(x.message) ? 'NotFoundError' : 'Error'; return x; };
class NatFile {
  constructor(path, name) { this.kind = 'file'; this.path = path; this.name = name; }
  async getFile() {
    let r; try { r = await NAT.fs.readFile({ path: this.path, directory: NAT_DIR }); } catch (e) { throw natErr(e); }
    const type = mimeOfName(this.name); const blob = typeof r.data === 'string' ? await (await fetch(`data:${type};base64,${r.data}`)).blob() : r.data;
    return new File([blob], this.name, { type });
  }
  async createWritable() {
    const path = this.path, parts = [];
    return { async write(d) { parts.push(d); }, async close() { await NAT.fs.writeFile({ path, directory: NAT_DIR, data: await blobToB64(new Blob(parts)), recursive: true }); } };
  }
}
class NatDir {
  constructor(path, name) { this.kind = 'directory'; this.path = path; this.name = name; }
  async getDirectoryHandle(name, o = {}) {
    const p = natPath(this.path, name);
    try { const st = await NAT.fs.stat({ path: p, directory: NAT_DIR }); if (st.type !== 'directory') throw new Error('not found'); }
    catch (e) { if (!o.create) throw natErr(e); try { await NAT.fs.mkdir({ path: p, directory: NAT_DIR, recursive: true }); } catch (x) { /* esiste già */ } }
    return new NatDir(p, name);
  }
  async getFileHandle(name, o = {}) {
    const p = natPath(this.path, name);
    if (!o.create) { try { await NAT.fs.stat({ path: p, directory: NAT_DIR }); } catch (e) { throw natErr(e); } }
    return new NatFile(p, name);
  }
  async removeEntry(name) { try { await NAT.fs.deleteFile({ path: natPath(this.path, name), directory: NAT_DIR }); } catch (e) { throw natErr(e); } }
  async *entries() {
    let r; try { r = await NAT.fs.readdir({ path: this.path, directory: NAT_DIR }); } catch (e) { return; }
    for (const f of r.files || []) {
      const n = typeof f === 'string' ? f : f.name; const dir = typeof f !== 'string' && f.type === 'directory';
      yield [n, dir ? new NatDir(natPath(this.path, n), n) : new NatFile(natPath(this.path, n), n)];
    }
  }
  async queryPermission() { return 'granted'; }
  async requestPermission() { return 'granted'; }
}

/* archivio: sempre attivo, sempre nella stessa cartella */
if (NAT) Object.assign(Archive, {
  ok: () => true,
  async init() {
    try { await NAT.fs.requestPermissions(); } catch (e) { } // serve solo su Android 10 o precedenti
    try { await NAT.fs.mkdir({ path: NAT_ROOT, directory: NAT_DIR, recursive: true }); } catch (e) { /* esiste già */ }
    this.root = new NatDir(NAT_ROOT, NAT_ROOT); this.perm = 'granted';
  },
  async pick() { toast(`Nell'app l'archivio è sempre nella cartella ${natWhere()}: salvo tutti i sopralluoghi…`, false, 5000); await this.syncAll(); return true; },
  async regrant() { this.perm = 'granted'; return true; },
  async recheck() { },
  async saveHandle() { },
});
const natWhere = () => isIOS() ? 'File → Sul mio iPad → SopraLux' : 'Documenti/SopraLux';

/* file esportati: salvati nella cartella del sopralluogo, poi si possono condividere (mail, Drive, WhatsApp…) */
if (NAT) LocalDL.save = async function ({ filename, data }) {
  const blob = data instanceof Blob ? data : new Blob([data]);
  let where; try { where = await Archive.writeExport(filename, blob); } catch (e) { console.warn(e); toast('File non salvato: ' + (e.message || e), true, 6000); return { status: 'error' }; }
  const path = natPath(where, filename);
  return new Promise(res => {
    const b = openModal(`<h3>File salvato</h3><div><b>${esc(filename)}</b></div>
      <div class="mut small" style="margin-top:6px">Nella cartella <b>${esc(isIOS() ? 'File → Sul mio iPad → ' + where : 'Documenti/' + where)}</b>. Puoi anche mandarlo per mail, su Drive o a un'altra app.</div>
      <div class="acts"><button id="nsNo">Chiudi</button><button class="pri" id="nsGo">Condividi</button></div>`);
    b.querySelector('#nsNo').onclick = () => { closeModal(); res({ status: 'archived' }); };
    b.querySelector('#nsGo').onclick = async () => {
      try { const { uri } = await NAT.fs.getUri({ path, directory: NAT_DIR }); await NAT.share.share({ title: filename, files: [uri] }); }
      catch (e) { if (!/cancel/i.test((e && e.message) || '')) toast('Condivisione non riuscita: ' + ((e && e.message) || e), true, 6000); }
      closeModal(); res({ status: 'archived' });
    };
  });
};

/* home: niente installazione né account; l'archivio c'è sempre */
function pwaHomeBanners() {
  const b = [`<div class="banner">📁 Archivio automatico: <b>${esc(natWhere())}</b>${Archive.err ? ' <span style="color:var(--bad)">– errore: ' + esc(Archive.err) + '</span>' : ' ✓'} <button class="sm" id="pwRecover">Recupera dalla cartella</button></div>`];
  if (!CAP.sample) b.push(aiAvailHtml());
  const sp = KV.get('spesa', {}); const m = new Date().toISOString().slice(0, 7); if (sp[m]) b.push(`<div class="mut small">✦ Spesa AI di questo mese su questo dispositivo: ${fmtUsd(sp[m])}</div>`);
  if (appVersionText()) b.push(`<div class="mut small" id="appVer">Versione dell'app: ${appVersionText()}</div>`);
  return b;
}
function pwaHomeWire() { const e = $('#pwRecover'); if (e) e.onclick = recoverFromFolder; }

async function pwaBoot() {
  try { await Archive.init(); } catch (e) { console.error('archivio', e); }
  const mark = Sync.mark; Sync.mark = function (...k) { mark.apply(this, k); Archive.kick(); }; // dopo ogni modifica, anche nella cartella
  if (NAT && NAT.app) {
    NAT.app.addListener('backButton', () => { // tasto Indietro di Android: chiude la finestra aperta, poi torna all'elenco, poi esce
      if (!$('#modal').classList.contains('hide')) closeModal();
      else if (S.sv) goHome();
      else NAT.app.minimizeApp();
    });
    NAT.app.addListener('pause', () => { if (Sync.pending()) Sync.flush(); Archive.kick(true); }); // l'app va in secondo piano: si salva subito
  }
}
