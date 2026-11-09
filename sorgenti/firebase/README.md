# SDK Firebase della PWA

`lib/firebase.js` è un bundle locale con Firebase App, Authentication, Firestore e Storage. Espone il globale `FB`, viene caricato soltanto dalla PWA ed è incluso nella sua cache offline.

Il bundle già generato è nel repository: la normale build della PWA non richiede npm né una connessione a internet.

Per rigenerarlo (Node.js 24.12.0 o successivo), dalla radice del repository:

```sh
cd sorgenti/firebase
npm ci
npm run build
```

Le versioni di Firebase ed esbuild sono fissate in `package.json` e `package-lock.json`. Non modificare il file minificato a mano. Quando cambia il bundle, eseguire anche `sh build_pwa.sh ..` dalla cartella `sorgenti` per aggiornare la versione della cache.

Firestore conserva il riferimento all'ultima revisione di ogni sopralluogo; Storage conserva copie complete immutabili e file identificati dal loro contenuto. Le funzioni incluse sono soltanto quelle usate dall'app. Non vengono esposti URL pubblici di download.

Regole, CORS e verifiche della sincronizzazione sono descritti in [docs/FIREBASE_SINCRONIZZAZIONE.md](../../docs/FIREBASE_SINCRONIZZAZIONE.md).
