'use strict';
// Acquisti negli store legati all'account SopraLux (uid Firebase).
// L'app manda al server le transazioni firmate dallo store; il server controlla la firma, le registra
// sull'account e risponde con i prodotti attivi dell'account (comprati su iPad o su Android).
//
// Apple: ogni transazione di StoreKit 2 è un JWS firmato da Apple. La catena di certificati è dentro il
// JWS (x5c): si controlla che finisca nel certificato radice di Apple («Apple Root CA - G3», impronta
// SHA-256 fissata qui sotto), che ogni certificato firmi il successivo, che abbia le estensioni di Apple
// per le ricevute e che la firma sia giusta. Così non servono chiavi né chiamate ad Apple.
// Le notifiche di Apple (App Store Server Notifications V2: rinnovi, scadenze, rimborsi) usano lo stesso formato.
//
// Firestore (solo il server scrive; le regole negano tutto ai dispositivi):
//   acquistiStore/apple_<originalTransactionId>: { uid, store, pid, otid, tid, env, acquisto, scadenza, revocato, firmato, gettone, aggiornato }
// Un acquisto appartiene a un solo account: al primo che lo registra. Passa a un altro account solo se è
// stato comprato da quell'account (gettone dell'account, appAccountToken) o se il primo account non esiste più.
const crypto = require('crypto');

const BUNDLE = 'it.diervsoft.sopralux';
const PRE = 'sopralux_';
const UNA_VOLTA = ['penne', 'bussola', 'misura', 'audio', 'dxf', 'tavolafoto', 'foto', 'tutti'];
const ABBONAMENTI = ['pro_mese', 'pro_anno', 'studio3_mese', 'studio3_anno', 'studio10_mese', 'studio10_anno', 'mem50', 'mem200', 'mem500'];
const PRODOTTI = new Set(UNA_VOLTA.concat(ABBONAMENTI).map(x => PRE + x));
// SHA-256 di «Apple Root CA - G3» (https://www.apple.com/certificateauthority/)
const APPLE_ROOT_G3 = '63:34:3A:BF:B8:9A:6A:03:EB:B5:7E:9B:3F:5F:A7:BE:7C:4F:5C:75:6F:30:17:B3:A8:C4:88:C3:65:3E:91:79';

function oidDer(oid) { // OID in DER (tag 06), per cercarlo dentro il certificato
  const n = oid.split('.').map(Number), out = [n[0] * 40 + n[1]];
  for (const v of n.slice(2)) { const b = [v & 127]; let x = v >> 7; while (x) { b.unshift((x & 127) | 128); x >>= 7; } out.push(...b); }
  return Buffer.from([6, out.length, ...out]);
}
const OID_FOGLIA = oidDer('1.2.840.113635.100.6.11.1'); // certificato che firma le ricevute dell'App Store
const OID_INTERMEDIO = oidDer('1.2.840.113635.100.6.2.1'); // Apple Worldwide Developer Relations

class Rifiutato extends Error { constructor(m) { super(m); this.rifiutato = true; } }
const b64json = s => { try { return JSON.parse(Buffer.from(s, 'base64url').toString('utf8')); } catch (e) { throw new Rifiutato('JWS non leggibile'); } };

// Controlla un JWS di Apple e ne restituisce il contenuto. radice: impronta del certificato radice (le prove ne usano una loro).
function verificaJws(jws, radice = APPLE_ROOT_G3) {
  if (typeof jws !== 'string' || jws.length > 20000) throw new Rifiutato('JWS mancante');
  const p = jws.split('.'); if (p.length !== 3) throw new Rifiutato('JWS malformato');
  const head = b64json(p[0]), dati = b64json(p[1]);
  if (head.alg !== 'ES256' || !Array.isArray(head.x5c) || head.x5c.length !== 3) throw new Rifiutato('intestazione non valida');
  let certs; try { certs = head.x5c.map(c => new crypto.X509Certificate(Buffer.from(c, 'base64'))); } catch (e) { throw new Rifiutato('certificati non leggibili'); }
  const [foglia, inter, root] = certs;
  if (root.fingerprint256 !== radice) throw new Rifiutato('certificato radice sconosciuto');
  if (!root.verify(root.publicKey) || !inter.checkIssued(root) || !inter.verify(root.publicKey) || !foglia.checkIssued(inter) || !foglia.verify(inter.publicKey)) throw new Rifiutato('catena di certificati non valida');
  if (!inter.ca || foglia.ca) throw new Rifiutato('ruoli dei certificati non validi');
  if (!foglia.raw.includes(OID_FOGLIA) || !inter.raw.includes(OID_INTERMEDIO)) throw new Rifiutato('certificati non di Apple per le ricevute');
  const quando = new Date(Number(dati.signedDate) || Date.now()); // validità alla data della firma, come fa la libreria di Apple senza controlli in linea
  for (const c of certs) if (quando < new Date(c.validFrom) || quando > new Date(c.validTo)) throw new Rifiutato('certificato scaduto');
  const ok = crypto.verify('sha256', Buffer.from(p[0] + '.' + p[1]), { key: foglia.publicKey, dsaEncoding: 'ieee-p1363' }, Buffer.from(p[2], 'base64url'));
  if (!ok) throw new Rifiutato('firma non valida');
  return dati;
}

// Transazione di Apple valida per SopraLux -> record da salvare
function transazioneApple(t) {
  if (!t || t.bundleId !== BUNDLE) throw new Rifiutato('app diversa');
  if (!PRODOTTI.has(t.productId)) throw new Rifiutato('prodotto sconosciuto');
  if (t.environment !== 'Production' && t.environment !== 'Sandbox') throw new Rifiutato('ambiente non valido');
  const otid = String(t.originalTransactionId || ''); if (!/^\d{1,30}$/.test(otid)) throw new Rifiutato('transazione senza numero');
  const num = v => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : null);
  return {
    store: 'apple', pid: t.productId, otid, tid: String(t.transactionId || otid), env: t.environment,
    acquisto: num(t.originalPurchaseDate) || num(t.purchaseDate), scadenza: num(t.expiresDate),
    revocato: !!t.revocationDate, firmato: num(t.signedDate) || 0,
    gettone: typeof t.appAccountToken === 'string' ? t.appAccountToken.toLowerCase() : null,
  };
}

// Gettone dell'account (appAccountToken di StoreKit): UUID ricavato dall'uid. L'app usa la stessa formula.
function gettoneAccount(uid) {
  const h = crypto.createHash('sha256').update('sopralux:' + uid).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-${((parseInt(h[16], 16) & 3) | 8).toString(16)}${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

const chiave = r => r.store + '_' + r.otid;

// Registra un acquisto sull'account uid. Risultato: 'tuo' oppure 'altro' (appartiene a un altro account esistente).
// esiste(uid) -> true se l'account esiste ancora. adesso: per le prove.
async function registra(db, uid, r, esiste, adesso) {
  const ref = db.collection('acquistiStore').doc(chiave(r));
  return db.runTransaction(async tx => {
    const s = await tx.get(ref), cur = s.exists ? s.data() : null;
    let prop = cur && cur.uid ? cur.uid : null, esito = 'tuo';
    if (prop && prop !== uid) {
      if (r.gettone && r.gettone === gettoneAccount(uid)) prop = uid; // comprato da questo account
      else if (!(await esiste(prop))) prop = uid; // il vecchio account non c'è più
      else esito = 'altro';
    } else prop = uid;
    const piuNuovo = !cur || !cur.firmato || r.firmato >= cur.firmato;
    tx.set(ref, Object.assign(piuNuovo ? r : {}, { uid: prop, aggiornato: adesso() }), { merge: true });
    return esito;
  });
}

// Aggiornamento da una notifica dello store: cambia i dati dell'acquisto, non l'account a cui appartiene.
async function aggiorna(db, r, adesso) {
  const ref = db.collection('acquistiStore').doc(chiave(r));
  return db.runTransaction(async tx => {
    const s = await tx.get(ref), cur = s.exists ? s.data() : null;
    if (cur && cur.firmato && r.firmato < cur.firmato) return false;
    tx.set(ref, Object.assign({}, r, { uid: cur && cur.uid ? cur.uid : null, aggiornato: adesso() }), { merge: true });
    return true;
  });
}

// Prodotti attivi dell'account: { codice: { scade (ms o null per sempre), store, prova (ambiente di prova) } }
async function licenza(db, uid, ora = Date.now()) {
  const q = await db.collection('acquistiStore').where('uid', '==', uid).get(), out = {};
  q.forEach(d => {
    const a = d.data(); if (!a || a.revocato || !PRODOTTI.has(a.pid)) return;
    if (a.scadenza && a.scadenza <= ora) return;
    const scade = a.scadenza || null, cur = out[a.pid];
    if (!cur || (cur.scade && (!scade || scade > cur.scade))) out[a.pid] = { scade, store: a.store, prova: a.env === 'Sandbox' };
  });
  return out;
}

// Account eliminato: i suoi acquisti restano senza account (si possono registrare di nuovo da chi ha lo stesso account dello store)
async function staccaAccount(db, uid, adesso) {
  const q = await db.collection('acquistiStore').where('uid', '==', uid).get(); let n = 0;
  for (const d of q.docs) { await d.ref.set({ uid: null, aggiornato: adesso() }, { merge: true }); n++; }
  return n;
}

// Chiamata dall'app: { apple: [JWS delle transazioni attive su questo iPad] }
async function verificaDaApp(db, uid, data, opz) {
  const { esiste, adesso, radice, log } = opz;
  const jws = Array.isArray(data && data.apple) ? data.apple.filter(x => typeof x === 'string').slice(0, 60) : [];
  let registrati = 0, altroAccount = 0, scartati = 0;
  for (const j of jws) {
    try {
      const r = transazioneApple(verificaJws(j, radice));
      const e = await registra(db, uid, r, esiste, adesso);
      if (e === 'altro') altroAccount++; else registrati++;
    } catch (e) {
      if (!e.rifiutato) throw e;
      scartati++; if (log) log('transazione Apple scartata', { uid, motivo: e.message });
    }
  }
  return { prodotti: await licenza(db, uid), registrati, altroAccount, scartati };
}

// Notifica di Apple (corpo { signedPayload }). Risultato: tipo della notifica.
async function notificaApple(db, corpo, opz) {
  const { adesso, radice } = opz;
  const n = verificaJws(corpo && corpo.signedPayload, radice);
  const d = n.data || {};
  if (d.bundleId !== BUNDLE) throw new Rifiutato('notifica di un\'altra app');
  if (d.signedTransactionInfo) await aggiorna(db, transazioneApple(verificaJws(d.signedTransactionInfo, radice)), adesso);
  return n.notificationType || '?';
}

module.exports = { BUNDLE, PRODOTTI, APPLE_ROOT_G3, Rifiutato, verificaJws, transazioneApple, gettoneAccount, registra, aggiorna, licenza, staccaAccount, verificaDaApp, notificaApple, oidDer };
