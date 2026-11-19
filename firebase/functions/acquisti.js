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
// Google Play: l'app manda il token di ogni acquisto (purchaseToken); il server chiede lo stato a Google con
// l'API Android Publisher (con l'identità della funzione, che va aggiunta come utente nella Play Console).
// Le notifiche in tempo reale di Google Play (RTDN, via Pub/Sub) aggiornano rinnovi, disdette e rimborsi.
//
// Firestore (solo il server scrive; le regole negano tutto ai dispositivi):
//   acquistiStore/apple_<originalTransactionId>: { uid, store, pid, otid, tid, env, acquisto, scadenza, revocato, firmato, gettone, aggiornato }
//   acquistiStore/google_<sha256 del token, 40 caratteri>: stessi campi (tid = numero d'ordine GPA., firmato = ora della verifica)
// Un acquisto appartiene a un solo account: al primo che lo registra. Passa a un altro account solo se è
// stato comprato da quell'account (gettone dell'account, appAccountToken) o se il primo account non esiste più.
const crypto = require('crypto');
const spazio = require('./spazio');

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

// ---- Google Play ----
const PACCHETTO = 'it.diervsoft.sopralux';
// Stati in cui l'abbonamento dà ancora accesso (CANCELED: disdetto, vale fino alla scadenza già pagata)
const GOOGLE_ATTIVI = new Set(['SUBSCRIPTION_STATE_ACTIVE', 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD', 'SUBSCRIPTION_STATE_CANCELED']);
const idGoogle = token => crypto.createHash('sha256').update(token).digest('hex').slice(0, 40);
const tokenOk = t => typeof t === 'string' && t.length >= 20 && t.length <= 1000 && /^[A-Za-z0-9._:-]+$/.test(t);

// Acquisto di Google Play -> record da salvare. a: { token, pid, tipo: 'inapp' | 'subs' }.
// chiedi(percorso) -> JSON dell'API Android Publisher (applications/<pacchetto>/<percorso>); un errore con nonTrovato = token sconosciuto.
async function transazioneGoogle(chiedi, a, ora) {
  if (!a || !tokenOk(a.token)) throw new Rifiutato('token Google non valido');
  const pid = String(a.pid || ''); if (!PRODOTTI.has(pid)) throw new Rifiutato('prodotto sconosciuto');
  const otid = idGoogle(a.token), base = { store: 'google', pid, otid, firmato: ora };
  const gettone = x => (typeof x === 'string' && x ? x.toLowerCase() : null);
  let r;
  try { r = await chiedi(a.tipo === 'subs' ? `purchases/subscriptionsv2/tokens/${encodeURIComponent(a.token)}` : `purchases/products/${encodeURIComponent(pid)}/tokens/${encodeURIComponent(a.token)}`); }
  catch (e) { if (e && e.nonTrovato) throw new Rifiutato('acquisto sconosciuto a Google'); throw e; }
  if (a.tipo === 'subs') {
    const riga = (r.lineItems || []).find(x => x && x.productId === pid); if (!riga) throw new Rifiutato('abbonamento diverso');
    if (r.subscriptionState === 'SUBSCRIPTION_STATE_PENDING') throw new Rifiutato('pagamento in attesa');
    const scad = Date.parse(riga.expiryTime) || null, attivo = GOOGLE_ATTIVI.has(r.subscriptionState);
    return Object.assign(base, {
      tid: r.latestOrderId || otid, env: r.testPurchase ? 'Sandbox' : 'Production', acquisto: Date.parse(r.startTime) || null,
      scadenza: attivo ? scad : Math.min(scad || ora, ora), revocato: false, stato: r.subscriptionState || '',
      gettone: gettone(r.externalAccountIdentifiers && r.externalAccountIdentifiers.obfuscatedExternalAccountId),
    });
  }
  if (r.purchaseState === 2) throw new Rifiutato('pagamento in attesa');
  return Object.assign(base, {
    tid: r.orderId || otid, env: r.purchaseType === 0 ? 'Sandbox' : 'Production', acquisto: Number(r.purchaseTimeMillis) || null,
    scadenza: null, revocato: r.purchaseState === 1, gettone: gettone(r.obfuscatedExternalAccountId),
  });
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
// Risultato: l'account a cui appartiene l'acquisto (o null).
async function aggiorna(db, r, adesso) {
  const ref = db.collection('acquistiStore').doc(chiave(r));
  return db.runTransaction(async tx => {
    const s = await tx.get(ref), cur = s.exists ? s.data() : null, uid = cur && cur.uid ? cur.uid : null;
    if (cur && cur.firmato && r.firmato < cur.firmato) return uid;
    tx.set(ref, Object.assign({}, r, { uid, aggiornato: adesso() }), { merge: true });
    return uid;
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

// Studio a vita (versione web e persone fidate): regali/<email in minuscolo>, scritto solo dall'amministratore
// (prove/regalo.js). Vale anche nell'app degli store e per le regole di Firestore e Storage.
const REGALO = 'sopralux_studio10_anno';
async function conRegalo(db, prodotti, email) {
  if (typeof email !== 'string' || !email) return prodotti;
  const s = await db.collection('regali').doc(email.toLowerCase()).get();
  if (s.exists) prodotti[REGALO] = { scade: null, store: 'regalo', prova: false };
  return prodotti;
}

// Account eliminato: i suoi acquisti restano senza account (si possono registrare di nuovo da chi ha lo stesso account dello store)
async function staccaAccount(db, uid, adesso) {
  const q = await db.collection('acquistiStore').where('uid', '==', uid).get(); let n = 0;
  for (const d of q.docs) { await d.ref.set({ uid: null, aggiornato: adesso() }, { merge: true }); n++; }
  return n;
}

// Chiamata dall'app: { apple: [JWS delle transazioni attive su questo iPad], google: [{ token, pid, tipo }] (Android) }
// opz.chiediGoogle: API Android Publisher (vedi transazioneGoogle); opz.ora: millisecondi adesso (prove).
async function verificaDaApp(db, uid, data, opz) {
  const { esiste, adesso, radice, log, email, chiediGoogle } = opz, ora = opz.ora || Date.now();
  const jws = Array.isArray(data && data.apple) ? data.apple.filter(x => typeof x === 'string').slice(0, 60) : [];
  const gp = Array.isArray(data && data.google) ? data.google.filter(x => x && typeof x === 'object').slice(0, 60) : [];
  let registrati = 0, altroAccount = 0, scartati = 0, nonVerificati = 0;
  const conta = e => { if (e === 'altro') altroAccount++; else registrati++; };
  for (const j of jws) {
    try { conta(await registra(db, uid, transazioneApple(verificaJws(j, radice)), esiste, adesso)); }
    catch (e) {
      if (!e.rifiutato) throw e;
      scartati++; if (log) log('transazione Apple scartata', { uid, motivo: e.message });
    }
  }
  for (const g of gp) {
    try {
      if (!chiediGoogle) throw new Error('verifica di Google Play non configurata');
      conta(await registra(db, uid, await transazioneGoogle(chiediGoogle, g, ora), esiste, adesso));
    } catch (e) {
      if (e.rifiutato) { scartati++; if (log) log('acquisto Google scartato', { uid, motivo: e.message }); continue; }
      // Google non risponde o la Play Console non ha ancora dato il permesso: restano valide le registrazioni già fatte
      nonVerificati++; if (log) log('acquisto Google non verificato', { uid, motivo: (e && e.message) || String(e) });
    }
  }
  const prodotti = await conRegalo(db, await licenza(db, uid, ora), email);
  await spazio.scriviLimite(db, uid, prodotti, adesso); // il limite dello spazio sul server segue il piano
  const sp = await spazio.leggi(db, uid);
  return { prodotti, registrati, altroAccount, scartati, nonVerificati, spazio: { usati: sp.usati, limite: sp.limite } };
}

// Notifica di Apple (corpo { signedPayload }). Risultato: tipo della notifica.
async function notificaApple(db, corpo, opz) {
  const { adesso, radice, emailDi } = opz;
  const n = verificaJws(corpo && corpo.signedPayload, radice);
  const d = n.data || {};
  if (d.bundleId !== BUNDLE) throw new Rifiutato('notifica di un\'altra app');
  if (d.signedTransactionInfo) {
    const uid = await aggiorna(db, transazioneApple(verificaJws(d.signedTransactionInfo, radice)), adesso);
    if (uid) await spazio.scriviLimite(db, uid, await conRegalo(db, await licenza(db, uid), emailDi ? await emailDi(uid) : null), adesso); // rinnovo, scadenza, rimborso: cambia il limite
  }
  return n.notificationType || '?';
}

// Notifica in tempo reale di Google Play (messaggio Pub/Sub già decodificato). Risultato: descrizione breve.
// Abbonamento o acquisto singolo: si rilegge lo stato da Google. Rimborso o annullamento (voided): acquisto revocato.
async function notificaGoogle(db, m, opz) {
  const { adesso, emailDi, chiediGoogle } = opz, ora = opz.ora || Date.now();
  if (!m || typeof m !== 'object') throw new Rifiutato('notifica illeggibile');
  if (m.packageName !== PACCHETTO) throw new Rifiutato('notifica di un\'altra app');
  if (m.testNotification) return 'prova';
  let uid = null, tipo;
  if (m.subscriptionNotification || m.oneTimeProductNotification) {
    const n = m.subscriptionNotification || m.oneTimeProductNotification, subs = !!m.subscriptionNotification;
    const r = await transazioneGoogle(chiediGoogle, { token: n.purchaseToken, pid: subs ? n.subscriptionId : n.sku, tipo: subs ? 'subs' : 'inapp' }, ora);
    uid = await aggiorna(db, r, adesso); tipo = (subs ? 'abbonamento ' : 'acquisto ') + n.notificationType;
  } else if (m.voidedPurchaseNotification) {
    const v = m.voidedPurchaseNotification; if (!tokenOk(v.purchaseToken)) throw new Rifiutato('token Google non valido');
    const ref = db.collection('acquistiStore').doc('google_' + idGoogle(v.purchaseToken));
    uid = await db.runTransaction(async tx => {
      const s = await tx.get(ref); if (!s.exists) return null;
      tx.set(ref, { revocato: true, firmato: ora, aggiornato: adesso() }, { merge: true }); return s.data().uid || null;
    });
    tipo = 'annullato';
  } else throw new Rifiutato('notifica sconosciuta');
  if (uid) await spazio.scriviLimite(db, uid, await conRegalo(db, await licenza(db, uid, ora), emailDi ? await emailDi(uid) : null), adesso);
  return tipo;
}

module.exports = { BUNDLE, PACCHETTO, PRODOTTI, transazioneGoogle, notificaGoogle, idGoogle, REGALO, conRegalo, APPLE_ROOT_G3, Rifiutato, verificaJws, transazioneApple, gettoneAccount, registra, aggiorna, licenza, staccaAccount, verificaDaApp, notificaApple, oidDer };
