'use strict';
// Funzioni server di SopraLux (Cloud Functions for Firebase, piano Blaze).
// eliminaDatiAccount: quando un account viene eliminato (dall'app: Account → Elimina account,
// oppure dalla console Firebase) cancella tutti i suoi dati online:
//   - Firestore: il documento users/{uid} con tutte le sottoraccolte (sopralluoghi, versioni);
//   - Storage: tutti i file sotto users/{uid}/ (tavole, foto, note audio, copie).
// Serve per Apple 5.1.1(v) e per il GDPR. Le regole impediscono la cancellazione dai dispositivi
// (la cancellazione di un impianto è una revisione), quindi la pulizia la fa il server.
// Pubblicazione: firebase deploy --only functions   (dalla cartella principale del repo)
const functions = require('firebase-functions/v1');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');

initializeApp();

exports.eliminaDatiAccount = functions
  .region('europe-west1')
  .runWith({ timeoutSeconds: 540, memory: '512MB' })
  .auth.user()
  .onDelete(async user => {
    const uid = user && user.uid;
    if (!uid || !/^[A-Za-z0-9_-]{1,128}$/.test(uid)) return;
    const db = getFirestore();
    await db.recursiveDelete(db.doc('users/' + uid));
    await getStorage().bucket().deleteFiles({ prefix: 'users/' + uid + '/' });
    functions.logger.info('Dati dell’account eliminati', { uid });
  });
