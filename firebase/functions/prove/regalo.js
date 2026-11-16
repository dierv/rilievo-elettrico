'use strict';
// Studio a vita per un account (versione web e persone fidate), da Cloud Shell:
//   node prove/regalo.js aggiungi nome@esempio.it [nota]
//   node prove/regalo.js togli nome@esempio.it
//   node prove/regalo.js elenco
// Scrive regali/<email in minuscolo>: le regole di Firestore e Storage lo leggono subito; nell'app vale dal prossimo controllo
// degli acquisti. Se l'account esiste già si aggiorna anche il limite dello spazio (spazio/<uid>.limite).
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const acquisti = require('../acquisti'), spazio = require('../spazio');
initializeApp({ projectId: 'sopralux-64b29' });
const [, , cosa, emailRaw, ...nota] = process.argv;
(async () => {
  const db = getFirestore(), adesso = () => FieldValue.serverTimestamp();
  if (cosa === 'elenco') { const q = await db.collection('regali').get(); q.forEach(d => console.log(d.id, JSON.stringify(d.data().nota || ''))); console.log(q.size + ' account con Studio a vita'); return; }
  const email = String(emailRaw || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !['aggiungi', 'togli'].includes(cosa)) { console.log('Uso: node prove/regalo.js aggiungi|togli email [nota]  oppure  elenco'); process.exitCode = 1; return; }
  if (cosa === 'aggiungi') await db.collection('regali').doc(email).set({ piano: 'studio10', nota: nota.join(' '), aggiunto: adesso() });
  else await db.collection('regali').doc(email).delete();
  let u = null; try { u = await getAuth().getUserByEmail(email); } catch (e) { }
  if (u) {
    const prodotti = await acquisti.conRegalo(db, await acquisti.licenza(db, u.uid), u.emailVerified ? u.email : null);
    const limite = await spazio.scriviLimite(db, u.uid, prodotti, adesso);
    console.log(`${cosa === 'aggiungi' ? 'Studio a vita' : 'Regalo tolto'}: ${email} (account ${u.uid}), spazio sul server ${Math.round(limite / spazio.GB)} GB`);
  } else console.log(`${cosa === 'aggiungi' ? 'Studio a vita' : 'Regalo tolto'}: ${email} (nessun account ancora: vale dal primo accesso)`);
})().catch(e => { console.log('ERRORE', e.message); process.exitCode = 1; });
