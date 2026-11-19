'use strict';
// Funzioni server di SopraLux (Cloud Functions for Firebase, piano Blaze).
// eliminaDatiAccount: quando un account viene eliminato (dall'app: Account → Elimina account,
// oppure dalla console Firebase) cancella tutti i suoi dati online:
//   - Firestore: il documento users/{uid} con tutte le sottoraccolte (sopralluoghi, versioni);
//   - Storage: tutti i file sotto users/{uid}/ (tavole, foto, note audio, copie);
//   - acquisti negli store: restano senza account (acquistiStore, uid null).
// Serve per Apple 5.1.1(v) e per il GDPR. Le regole impediscono la cancellazione dai dispositivi
// (la cancellazione di un impianto è una revisione), quindi la pulizia la fa il server.
// verificaAcquisti: l'app manda le transazioni firmate dallo store; il server le controlla, le lega
// all'account e risponde con i prodotti attivi dell'account (acquisti.js).
// notificheApple: App Store Server Notifications V2 (rinnovi, scadenze, rimborsi), indirizzo impostato in App Store Connect.
// notificheGoogle: notifiche in tempo reale di Google Play (argomento Pub/Sub «play-notifiche», impostato nella Play Console).
// Google Play: le funzioni chiedono lo stato degli acquisti all'API Android Publisher con l'account di servizio
// predefinito delle funzioni (sopralux-64b29@appspot.gserviceaccount.com), che va invitato nella Play Console
// con i permessi «Visualizzare dati finanziari» e «Gestire ordini e abbonamenti». Nessuna chiave.
// contaSpazio: somma lo spazio occupato da ogni account in Storage (spazio.js); il limite lo scrive verificaAcquisti.
// Pubblicazione: firebase deploy --only functions   (dalla cartella principale del repo)
const functions = require('firebase-functions/v1');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const acquisti = require('./acquisti');
const spazio = require('./spazio');

initializeApp();
const adesso = () => FieldValue.serverTimestamp();
const emailDi = async uid => { try { const u = await getAuth().getUser(uid); return u.emailVerified ? u.email : null; } catch (e) { return null; } };
const esiste = async uid => { try { await getAuth().getUser(uid); return true; } catch (e) { if (e && e.code === 'auth/user-not-found') return false; throw e; } };
const regione = functions.region('europe-west1');

// API Android Publisher con il gettone dell'account di servizio della funzione (server dei metadati, ambito androidpublisher)
let gettoneGoogle = { valore: '', scade: 0 };
async function chiediGoogle(percorso) {
  if (Date.now() > gettoneGoogle.scade - 60e3) {
    const r = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token?scopes=' + encodeURIComponent('https://www.googleapis.com/auth/androidpublisher'), { headers: { 'Metadata-Flavor': 'Google' } });
    if (!r.ok) throw new Error('gettone per Google Play non ottenuto: ' + r.status);
    const j = await r.json(); gettoneGoogle = { valore: j.access_token, scade: Date.now() + (Number(j.expires_in) || 300) * 1000 };
  }
  const r = await fetch(`https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${acquisti.PACCHETTO}/${percorso}`, { headers: { Authorization: 'Bearer ' + gettoneGoogle.valore } });
  if (r.ok) return r.json();
  const testo = (await r.text()).slice(0, 300), e = new Error(`Google Play ${r.status}: ${testo}`);
  if (r.status === 404 || r.status === 410 || (r.status === 400 && /invalid|not.?found/i.test(testo))) e.nonTrovato = true;
  throw e;
}

exports.eliminaDatiAccount = regione
  .runWith({ timeoutSeconds: 540, memory: '512MB' })
  .auth.user()
  .onDelete(async user => {
    const uid = user && user.uid;
    if (!uid || !/^[A-Za-z0-9_-]{1,128}$/.test(uid)) return;
    const db = getFirestore();
    await db.recursiveDelete(db.doc('users/' + uid));
    await getStorage().bucket().deleteFiles({ prefix: 'users/' + uid + '/' });
    await db.recursiveDelete(db.doc('spazio/' + uid));
    const n = await acquisti.staccaAccount(db, uid, adesso);
    functions.logger.info('Dati dell’account eliminati', { uid, acquisti: n });
  });

exports.verificaAcquisti = regione
  .runWith({ timeoutSeconds: 60, memory: '256MB' })
  .https.onCall(async (data, context) => {
    const uid = context.auth && context.auth.uid;
    if (!uid) throw new functions.https.HttpsError('unauthenticated', 'Entra nel tuo account SopraLux.');
    const t = context.auth.token || {}, email = t.email_verified ? t.email : null; // per lo Studio a vita (regali/<email>)
    return acquisti.verificaDaApp(getFirestore(), uid, data, { esiste, adesso, email, chiediGoogle, log: (m, x) => functions.logger.warn(m, x) });
  });

exports.notificheApple = regione
  .runWith({ timeoutSeconds: 60, memory: '256MB' })
  .https.onRequest(async (req, res) => {
    if (req.method !== 'POST') { res.status(405).send('Solo POST'); return; }
    try {
      const tipo = await acquisti.notificaApple(getFirestore(), req.body, { adesso, emailDi });
      functions.logger.info('Notifica Apple', { tipo });
      res.status(200).send('ok');
    } catch (e) {
      if (!e.rifiutato) { functions.logger.error('Notifica Apple non elaborata', e); res.status(500).send('errore'); return; } // Apple riprova
      functions.logger.warn('Notifica Apple scartata', { motivo: e.message });
      res.status(400).send('non valida');
    }
  });

exports.notificheGoogle = regione
  .runWith({ timeoutSeconds: 60, memory: '256MB' })
  .pubsub.topic('play-notifiche')
  .onPublish(async msg => {
    let m; try { m = msg.json; } catch (e) { functions.logger.warn('Notifica Google illeggibile'); return; }
    try {
      const tipo = await acquisti.notificaGoogle(getFirestore(), m, { adesso, emailDi, chiediGoogle });
      functions.logger.info('Notifica Google Play', { tipo });
    } catch (e) {
      if (e.rifiutato) { functions.logger.warn('Notifica Google Play scartata', { motivo: e.message }); return; }
      functions.logger.error('Notifica Google Play non elaborata', e); // l'app riverifica gli acquisti a ogni avvio
    }
  });

exports.contaSpazio = regione
  .runWith({ timeoutSeconds: 60, memory: '256MB' })
  .storage.bucket('sopralux-64b29.firebasestorage.app').object()
  .onFinalize(async obj => {
    if (!spazio.uidDi(obj && obj.name)) return;
    await spazio.contaFile(getFirestore(), obj.name, Number(obj.size) || 0, adesso);
  });
