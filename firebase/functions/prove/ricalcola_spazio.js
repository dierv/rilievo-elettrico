'use strict';
// Conta i file già presenti in Storage (caricati prima della funzione contaSpazio), da Cloud Shell.
// Ogni file si conta una volta sola (spazio.js): si può rilanciare senza doppi conteggi.
// Uso: cd firebase/functions && npm install && node prove/ricalcola_spazio.js
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const spazio = require('../spazio');
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
  for (const [uid, byte] of Object.entries(per)) { const s = await spazio.leggi(db, uid); console.log(uid, (byte / 1e6).toFixed(1) + ' MB in Storage;', 'conteggio:', (s.usati / 1e6).toFixed(1) + ' MB,', s.file, 'file; limite', (s.limite / spazio.GB).toFixed(0) + ' GB'); }
})().catch(e => { console.log('ERRORE', e.message); process.exitCode = 1; });
