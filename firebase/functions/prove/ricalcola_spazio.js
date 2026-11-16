'use strict';
// Conta i file già presenti in Storage (caricati prima della funzione contaSpazio) e ricalcola il limite dello spazio
// di ogni account (abbonamenti e Studio a vita), da Cloud Shell.
// Ogni file si conta una volta sola (spazio.js): si può rilanciare senza doppi conteggi.
// Uso: cd firebase/functions && npm install && node prove/ricalcola_spazio.js
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const { getAuth } = require('firebase-admin/auth');
const spazio = require('../spazio'), acquisti = require('../acquisti');
initializeApp({ projectId: 'sopralux-64b29', storageBucket: 'sopralux-64b29.firebasestorage.app' });
(async () => {
  const db = getFirestore(), [files] = await getStorage().bucket().getFiles({ prefix: 'users/' });
  let nuovi = 0; const per = {};
  for (const f of files) {
    const uid = spazio.uidDi(f.name); if (!uid) continue;
    per[uid] = (per[uid] || 0) + Number(f.metadata.size || 0);
    if (await spazio.contaFile(db, f.name, Number(f.metadata.size || 0), () => FieldValue.serverTimestamp())) nuovi++;
  }
  console.log(`File in Storage: ${files.length}; contati adesso: ${nuovi}`);
  const { users } = await getAuth().listUsers(1000);
  for (const u of users) {
    const prodotti = await acquisti.conRegalo(db, await acquisti.licenza(db, u.uid), u.emailVerified ? u.email : null);
    const limite = await spazio.scriviLimite(db, u.uid, prodotti, () => FieldValue.serverTimestamp());
    if (!per[u.uid]) per[u.uid] = 0;
    console.log('limite', u.uid, Math.round(limite / spazio.GB) + ' GB', Object.keys(prodotti).join(',') || '(nessun piano)');
  }
  for (const [uid, byte] of Object.entries(per)) { const s = await spazio.leggi(db, uid); console.log(uid, (byte / 1e6).toFixed(1) + ' MB in Storage;', 'conteggio:', (s.usati / 1e6).toFixed(1) + ' MB,', s.file, 'file; limite', (s.limite / spazio.GB).toFixed(0) + ' GB'); }
})().catch(e => { console.log('ERRORE', e.message); process.exitCode = 1; });
