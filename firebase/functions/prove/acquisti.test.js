'use strict';
// Prove di acquisti.js senza servizi reali: catena di certificati di prova creata con openssl (con le stesse
// estensioni di Apple), transazioni firmate qui, Firestore in memoria.
// Uso: cd firebase/functions && node --test prove/acquisti.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const A = require('../acquisti');
const SP = require('../spazio');

/* ---- catena di certificati di prova ---- */
function catena(dir, nome, conOid = true) {
  const f = x => path.join(dir, nome + '_' + x), ssl = (...a) => execFileSync('openssl', a, { stdio: 'pipe' });
  fs.writeFileSync(f('ext.cnf'), [
    '[ca]', 'basicConstraints=critical,CA:TRUE', 'keyUsage=critical,keyCertSign,cRLSign',
    '[inter]', 'basicConstraints=critical,CA:TRUE,pathlen:0', 'keyUsage=critical,keyCertSign,cRLSign', ...(conOid ? ['1.2.840.113635.100.6.2.1=ASN1:NULL'] : []),
    '[foglia]', 'basicConstraints=critical,CA:FALSE', 'keyUsage=critical,digitalSignature', ...(conOid ? ['1.2.840.113635.100.6.11.1=ASN1:NULL'] : []),
  ].join('\n'));
  ssl('ecparam', '-name', 'secp384r1', '-genkey', '-noout', '-out', f('root.key'));
  ssl('req', '-new', '-x509', '-key', f('root.key'), '-subj', '/CN=Radice di prova', '-days', '3650', '-out', f('root.pem'), '-addext', 'basicConstraints=critical,CA:TRUE', '-addext', 'keyUsage=critical,keyCertSign,cRLSign');
  ssl('ecparam', '-name', 'prime256v1', '-genkey', '-noout', '-out', f('inter.key'));
  ssl('req', '-new', '-key', f('inter.key'), '-subj', '/CN=Intermedio di prova', '-out', f('inter.csr'));
  ssl('x509', '-req', '-in', f('inter.csr'), '-CA', f('root.pem'), '-CAkey', f('root.key'), '-CAcreateserial', '-days', '3650', '-extfile', f('ext.cnf'), '-extensions', 'inter', '-out', f('inter.pem'));
  ssl('ecparam', '-name', 'prime256v1', '-genkey', '-noout', '-out', f('foglia.key'));
  ssl('req', '-new', '-key', f('foglia.key'), '-subj', '/CN=Foglia di prova', '-out', f('foglia.csr'));
  ssl('x509', '-req', '-in', f('foglia.csr'), '-CA', f('inter.pem'), '-CAkey', f('inter.key'), '-CAcreateserial', '-days', '3650', '-extfile', f('ext.cnf'), '-extensions', 'foglia', '-out', f('foglia.pem'));
  const pem = x => fs.readFileSync(f(x + '.pem'), 'utf8'), der = x => new crypto.X509Certificate(pem(x)).raw.toString('base64');
  return { x5c: [der('foglia'), der('inter'), der('root')], key: crypto.createPrivateKey(fs.readFileSync(f('foglia.key'))), radice: new crypto.X509Certificate(pem('root')).fingerprint256 };
}
const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url');
function firma(c, dati, alg = 'ES256') {
  const h = b64({ alg, x5c: c.x5c }), p = b64(dati);
  return h + '.' + p + '.' + crypto.sign('sha256', Buffer.from(h + '.' + p), { key: c.key, dsaEncoding: 'ieee-p1363' }).toString('base64url');
}

/* ---- Firestore in memoria (solo quello che usa acquisti.js) ---- */
function memoria() {
  const docs = new Map();
  const ref = p => ({ path: p, async get() { return snap(p); }, async set(d, o) { scrivi(p, d, o); }, collection: c => ({ doc: id => ref(p + '/' + c + '/' + id) }) });
  const snap = p => ({ exists: docs.has(p), data: () => (docs.has(p) ? JSON.parse(JSON.stringify(docs.get(p))) : undefined), ref: ref(p) });
  const scrivi = (p, d, o) => docs.set(p, Object.assign(o && o.merge && docs.has(p) ? docs.get(p) : {}, JSON.parse(JSON.stringify(d))));
  return {
    docs,
    collection: c => ({
      doc: id => ref(c + '/' + id),
      where: (k, op, v) => ({ async get() {
        const l = [...docs.keys()].filter(p => p.startsWith(c + '/') && p.split('/').length === 2 && docs.get(p)[k] === v).map(snap);
        return { docs: l, forEach: fn => l.forEach(fn) };
      } }),
    }),
    async runTransaction(fn) { return fn({ get: r => r.get(), set: (r, d, o) => scrivi(r.path, d, o) }); },
  };
}

const ADESSO = Date.now() + 2 * 3600e3; // i certificati di prova nascono adesso: le firme delle prove sono successive
const tx = (o = {}) => Object.assign({
  bundleId: A.BUNDLE, productId: 'sopralux_dxf', environment: 'Sandbox', transactionId: '2000000123', originalTransactionId: '2000000123',
  purchaseDate: ADESSO - 3600e3, originalPurchaseDate: ADESSO - 3600e3, signedDate: ADESSO - 60e3, type: 'Non-Consumable', inAppOwnershipType: 'PURCHASED',
}, o);

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sopralux-acquisti-'));
const C = catena(dir, 'buona'), ALTRA = catena(dir, 'altra'), SENZA_OID = catena(dir, 'senzaoid', false);
const opz = (vivi = ['anna', 'bruno']) => ({ esiste: async u => vivi.includes(u), adesso: () => 1, radice: C.radice });

test('firma: una transazione firmata dalla catena giusta si legge', () => {
  const d = A.verificaJws(firma(C, tx()), C.radice);
  assert.equal(d.productId, 'sopralux_dxf');
});

test('firma: catena con un\'altra radice, firma alterata, estensioni mancanti, algoritmo diverso vengono rifiutati', () => {
  assert.throws(() => A.verificaJws(firma(ALTRA, tx()), C.radice), /radice/);
  const j = firma(C, tx()).split('.'); j[1] = b64(tx({ productId: 'sopralux_tutti' }));
  assert.throws(() => A.verificaJws(j.join('.'), C.radice), /firma/);
  assert.throws(() => A.verificaJws(firma(SENZA_OID, tx()), SENZA_OID.radice), /Apple/);
  assert.throws(() => A.verificaJws(firma(C, tx(), 'RS256'), C.radice), /intestazione/);
  assert.throws(() => A.verificaJws('a.b', C.radice), /malformato/);
  // con la radice vera di Apple la catena di prova non passa
  assert.throws(() => A.verificaJws(firma(C, tx())), /radice/);
});

test('firma: certificato non ancora valido alla data della firma', () => {
  assert.throws(() => A.verificaJws(firma(C, tx({ signedDate: Date.UTC(2001, 0, 1) })), C.radice), /scaduto/);
});

test('transazione: app, prodotto e ambiente devono essere quelli di SopraLux', () => {
  assert.throws(() => A.transazioneApple(tx({ bundleId: 'com.altra.app' })), /app diversa/);
  assert.throws(() => A.transazioneApple(tx({ productId: 'altro_prodotto' })), /prodotto/);
  assert.throws(() => A.transazioneApple(tx({ environment: 'Xcode' })), /ambiente/);
  const r = A.transazioneApple(tx({ appAccountToken: 'ABC' }));
  assert.equal(r.otid, '2000000123'); assert.equal(r.gettone, 'abc'); assert.equal(r.scadenza, null);
});

test('gettone dell\'account: UUID stabile, diverso per ogni account', () => {
  const g = A.gettoneAccount('anna');
  assert.match(g, /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(g, A.gettoneAccount('anna')); assert.notEqual(g, A.gettoneAccount('bruno'));
});

test('dall\'app: registra sull\'account e risponde con i prodotti attivi', async () => {
  const db = memoria();
  const pro = tx({ productId: 'sopralux_pro_mese', transactionId: '300', originalTransactionId: '300', expiresDate: ADESSO + 30 * 864e5, type: 'Auto-Renewable Subscription' });
  const r = await A.verificaDaApp(db, 'anna', { apple: [firma(C, tx()), firma(C, pro), 'spazzatura', firma(ALTRA, tx({ originalTransactionId: '9' }))] }, opz());
  assert.equal(r.registrati, 2); assert.equal(r.scartati, 2); assert.equal(r.altroAccount, 0);
  assert.deepEqual(Object.keys(r.prodotti).sort(), ['sopralux_dxf', 'sopralux_pro_mese']);
  assert.equal(r.prodotti.sopralux_dxf.scade, null); assert.equal(r.prodotti.sopralux_dxf.prova, true);
  assert.equal(db.docs.get('acquistiStore/apple_2000000123').uid, 'anna');
  // un altro account non lo vede
  assert.deepEqual((await A.verificaDaApp(db, 'bruno', {}, opz())).prodotti, {});
});

test('un acquisto resta all\'account che lo ha registrato per primo', async () => {
  const db = memoria();
  await A.verificaDaApp(db, 'anna', { apple: [firma(C, tx())] }, opz());
  const r = await A.verificaDaApp(db, 'bruno', { apple: [firma(C, tx())] }, opz());
  assert.equal(r.altroAccount, 1); assert.deepEqual(r.prodotti, {});
  assert.equal(db.docs.get('acquistiStore/apple_2000000123').uid, 'anna');
});

test('passa a un altro account se il primo non esiste più o se è stato comprato da quell\'account', async () => {
  const db = memoria();
  await A.verificaDaApp(db, 'anna', { apple: [firma(C, tx())] }, opz());
  let r = await A.verificaDaApp(db, 'bruno', { apple: [firma(C, tx())] }, opz(['bruno'])); // anna eliminata
  assert.ok(r.prodotti.sopralux_dxf); assert.equal(db.docs.get('acquistiStore/apple_2000000123').uid, 'bruno');
  const t2 = tx({ originalTransactionId: '444', transactionId: '444', productId: 'sopralux_misura', appAccountToken: A.gettoneAccount('anna') });
  await A.verificaDaApp(db, 'bruno', { apple: [firma(C, t2)] }, opz());
  r = await A.verificaDaApp(db, 'anna', { apple: [firma(C, t2)] }, opz()); // comprato da anna
  assert.ok(r.prodotti.sopralux_misura); assert.equal(db.docs.get('acquistiStore/apple_444').uid, 'anna');
});

test('abbonamenti: scaduti esclusi, una transazione vecchia non sovrascrive quella nuova', async () => {
  const db = memoria(), sub = o => tx(Object.assign({ productId: 'sopralux_pro_anno', originalTransactionId: '500', type: 'Auto-Renewable Subscription' }, o));
  await A.verificaDaApp(db, 'anna', { apple: [firma(C, sub({ transactionId: '502', expiresDate: ADESSO + 864e5, signedDate: ADESSO - 1000 }))] }, opz());
  const r = await A.verificaDaApp(db, 'anna', { apple: [firma(C, sub({ transactionId: '501', expiresDate: ADESSO - 864e5, signedDate: ADESSO - 3600e3 }))] }, opz());
  assert.ok(r.prodotti.sopralux_pro_anno, 'la transazione più vecchia non deve togliere il rinnovo');
  assert.equal(db.docs.get('acquistiStore/apple_500').tid, '502');
  assert.deepEqual(await A.licenza(db, 'anna', ADESSO + 2 * 864e5), {}, 'dopo la scadenza non è più attivo');
});

test('notifiche di Apple: rimborso e rinnovo aggiornano l\'acquisto senza cambiare account', async () => {
  const db = memoria();
  await A.verificaDaApp(db, 'anna', { apple: [firma(C, tx())] }, opz());
  const notifica = (tipo, t) => ({ signedPayload: firma(C, { notificationType: tipo, signedDate: ADESSO, data: { bundleId: A.BUNDLE, environment: 'Sandbox', signedTransactionInfo: firma(C, t) } }) });
  assert.equal(await A.notificaApple(db, notifica('REFUND', tx({ revocationDate: ADESSO, signedDate: ADESSO })), opz()), 'REFUND');
  assert.deepEqual(await A.licenza(db, 'anna'), {});
  assert.equal(db.docs.get('acquistiStore/apple_2000000123').uid, 'anna');
  // rinnovo di un abbonamento mai registrato dall'app: si salva senza account
  const s = tx({ productId: 'sopralux_pro_mese', originalTransactionId: '700', transactionId: '701', expiresDate: ADESSO + 864e5, signedDate: ADESSO });
  await A.notificaApple(db, notifica('DID_RENEW', s), opz());
  assert.equal(db.docs.get('acquistiStore/apple_700').uid, null);
  // poi l'app lo registra
  assert.ok((await A.verificaDaApp(db, 'bruno', { apple: [firma(C, s)] }, opz())).prodotti.sopralux_pro_mese);
  // notifica di un'altra app o con firma sbagliata
  await assert.rejects(A.notificaApple(db, { signedPayload: firma(C, { notificationType: 'TEST', data: { bundleId: 'com.altra' } }) }, opz()), /altra app/);
  await assert.rejects(A.notificaApple(db, { signedPayload: firma(ALTRA, { notificationType: 'TEST', data: { bundleId: A.BUNDLE } }) }, opz()), /radice/);
  await assert.rejects(A.notificaApple(db, {}, opz()), /mancante/);
});

test('account eliminato: gli acquisti restano senza account', async () => {
  const db = memoria();
  await A.verificaDaApp(db, 'anna', { apple: [firma(C, tx())] }, opz());
  assert.equal(await A.staccaAccount(db, 'anna', () => 2), 1);
  assert.equal(db.docs.get('acquistiStore/apple_2000000123').uid, null);
  assert.deepEqual(await A.licenza(db, 'anna'), {});
});

test('OID in DER come nei certificati di Apple', () => {
  assert.equal(A.oidDer('1.2.840.113635.100.6.11.1').toString('hex'), '060a2a864886f76364060b01');
});

test('spazio: limite dal piano, memoria solo con un piano', () => {
  const G = SP.GB;
  assert.equal(SP.limiteDa({}), 0);
  assert.equal(SP.limiteDa({ sopralux_dxf: {} }), 0);
  assert.equal(SP.limiteDa({ sopralux_pro_mese: {} }), 25 * G);
  assert.equal(SP.limiteDa({ sopralux_pro_anno: {}, sopralux_studio3_mese: {} }), 100 * G);
  assert.equal(SP.limiteDa({ sopralux_studio10_anno: {}, sopralux_mem50: {}, sopralux_mem200: {} }), 550 * G);
  assert.equal(SP.limiteDa({ sopralux_mem500: {} }), 0);
});

test('spazio: ogni file si conta una volta sola, solo nella cartella di un account', async () => {
  const db = memoria();
  assert.equal(await SP.contaFile(db, 'users/anna/surveys/s1/files/' + 'a'.repeat(64), 1000, () => 1), true);
  assert.equal(await SP.contaFile(db, 'users/anna/surveys/s1/files/' + 'a'.repeat(64), 1000, () => 1), false, 'notifica ripetuta');
  await SP.contaFile(db, 'users/anna/surveys/s1/snapshots/' + 'b'.repeat(64) + '.json', 300, () => 1);
  assert.equal(await SP.contaFile(db, 'altro/file.bin', 5, () => 1), false);
  assert.deepEqual(await SP.leggi(db, 'anna'), { usati: 1300, file: 2, limite: 0 });
});

test('spazio: la risposta all\'app e le notifiche aggiornano il limite', async () => {
  const db = memoria();
  const sub = tx({ productId: 'sopralux_pro_mese', originalTransactionId: '800', transactionId: '800', expiresDate: ADESSO + 864e5, type: 'Auto-Renewable Subscription' });
  await SP.contaFile(db, 'users/anna/surveys/s1/files/' + 'c'.repeat(64), 5000, () => 1);
  const r = await A.verificaDaApp(db, 'anna', { apple: [firma(C, sub)] }, opz());
  assert.deepEqual(r.spazio, { usati: 5000, limite: 25 * SP.GB });
  const notifica = t => ({ signedPayload: firma(C, { notificationType: 'REFUND', signedDate: ADESSO, data: { bundleId: A.BUNDLE, signedTransactionInfo: firma(C, t) } }) });
  await A.notificaApple(db, notifica(Object.assign({}, sub, { revocationDate: ADESSO, signedDate: ADESSO + 1000 })), opz());
  assert.equal((await SP.leggi(db, 'anna')).limite, 0, 'rimborso: niente più spazio sul server');
});

test('Studio a vita: regali/<email> vale nell\'app e resta dopo le notifiche', async () => {
  const db = memoria();
  await db.collection('regali').doc('anna@prova.it').set({ piano: 'studio10' });
  const r = await A.verificaDaApp(db, 'anna', {}, Object.assign(opz(), { email: 'Anna@Prova.it' }));
  assert.deepEqual(r.prodotti[A.REGALO], { scade: null, store: 'regalo', prova: false });
  assert.equal(r.spazio.limite, 300 * SP.GB);
  assert.deepEqual((await A.verificaDaApp(db, 'bruno', {}, Object.assign(opz(), { email: 'bruno@prova.it' }))).prodotti, {});
  // una notifica su un altro acquisto di anna non toglie il regalo
  const t = tx({ originalTransactionId: '900', transactionId: '900' });
  await A.verificaDaApp(db, 'anna', { apple: [firma(C, t)] }, Object.assign(opz(), { email: 'anna@prova.it' }));
  await A.notificaApple(db, { signedPayload: firma(C, { notificationType: 'REFUND', signedDate: ADESSO, data: { bundleId: A.BUNDLE, signedTransactionInfo: firma(C, Object.assign({}, t, { revocationDate: ADESSO, signedDate: ADESSO + 5 })) } }) }, Object.assign(opz(), { emailDi: async u => u + '@prova.it' }));
  assert.equal((await SP.leggi(db, 'anna')).limite, 300 * SP.GB);
});

test.after(() => fs.rmSync(dir, { recursive: true, force: true }));
