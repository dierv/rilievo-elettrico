'use strict';
// Prova dal vivo di eliminaDatiAccount (da Cloud Shell, con le credenziali del titolare del progetto):
// crea un account di prova con un sopralluogo e un file, elimina l'account e controlla che il server cancelli i dati.
// Uso: cd firebase/functions && npm install && node prove/eliminazione.js
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
initializeApp({ projectId: 'sopralux-64b29', storageBucket: 'sopralux-64b29.firebasestorage.app' });
const uid = 'prova-eliminazione';
(async () => {
  await getAuth().createUser({ uid }).catch(() => {});
  await getFirestore().doc(`users/${uid}/surveys/s1`).set({ prova: true });
  await getStorage().bucket().file(`users/${uid}/prova.txt`).save('prova');
  await getAuth().deleteUser(uid);
  console.log('Account di prova creato ed eliminato: attendo la pulizia…');
  for (let i = 1; i <= 30; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const doc = await getFirestore().doc(`users/${uid}/surveys/s1`).get();
    const [file] = await getStorage().bucket().file(`users/${uid}/prova.txt`).exists();
    console.log(`${i * 5} s: documento ${doc.exists ? 'c’è' : 'cancellato'}, file ${file ? 'c’è' : 'cancellato'}`);
    if (!doc.exists && !file) { console.log('PROVA RIUSCITA'); return; }
  }
  console.log('PROVA NON RIUSCITA: i dati sono ancora lì');
  process.exitCode = 1;
})().catch(e => { console.log('ERRORE', e.message); process.exitCode = 1; });
