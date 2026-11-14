# Account SopraLux: accesso con Apple o Google

Aggiornato il 15/11/2026.

## Come funziona

- **Un solo account** (uid Firebase) per browser, Android e iPad. Si entra con Apple o con Google; dalla scheda **Account** si collega anche l'altro metodo. Acquisti e impianti seguono l'account, non il metodo.
- **Stessa email già registrata con l'altro metodo** (impostazione Firebase «collega gli account con lo stesso indirizzo email»): l'app spiega di entrare con il metodo già usato e, appena l'utente entra, collega da sola il nuovo metodo.
- **Email nascosta di Apple** (`…@privaterelay.appleid.com`): l'email non coincide, quindi si collega a mano dalla scheda Account (per esempio sull'iPad: entra con Apple → Account → Collega Google; poi su Android entra con Google).
- **Browser (PWA):** popup di Firebase.
- **App nativa:** plugin `@capacitor-firebase/authentication` 8.6.0. Mostra le schermate di sistema e passa le credenziali all'SDK JavaScript (`skipNativeAuth: true`), così nell'app c'è un solo account.
- **Su Android**, Apple funziona solo per entrare: il suo flusso apre già una sessione nativa, quindi non si può collegare a un account aperto. Su Android si collega Google; Apple si collega dall'iPad o dal browser.
- **Eliminazione dell'account** (Apple 5.1.1(v)):
  - si conferma l'accesso;
  - con Apple si revoca anche l'autorizzazione (sull'iPad e nel browser);
  - si elimina l'utente;
  - la funzione `eliminaDatiAccount` sul server cancella `users/{uid}` in Firestore e i file `users/{uid}/` in Storage.

Codice: `sorgenti/src/pwa_firebase.js` (account e scheda Account); `pwa_cloud.js` usa gli stessi pulsanti e aspetta la fine del collegamento prima di ricaricare. Prova: `test/t44.py` nella cartella di lavoro (SDK e plugin finti).

## Stato della configurazione (15/11/2026)

| Cosa | Stato |
|---|---|
| Firebase: app Android `it.diervsoft.sopralux` | Registrata. Impronte SHA-1: chiave di prova `70:06:F2:…:FD:0C` e chiave di caricamento `22:99:27:…:17:5D` |
| Firebase: app iOS `it.diervsoft.sopralux` (App Store 6834807545) | Registrata |
| File di configurazione | `app/android/app/google-services.json`, `app/ios/App/App/GoogleService-Info.plist` (identificativi pubblici, non segreti) |
| Firebase Authentication | Google e Apple attivi; «collega gli account con lo stesso indirizzo email» |
| Apple: capability «Accedi con Apple» | La attiva la build iOS stessa (`app/ios/ci_signing.rb`, API App Store Connect) |
| App: plugin, diritto Apple, schema URL Google | Fatto (`capacitor.config.json`, `App.entitlements`, `Info.plist`, `variables.gradle`) |
| Funzione `eliminaDatiAccount` | **Pubblicata** (europe-west1, 1ª generazione). Provata dal vivo con `firebase/functions/prove/eliminazione.js` |

## Interruttori in `sorgenti/src/pwa.js`

| Costante | Valore | Significato |
|---|---|---|
| `FIREBASE_APPLE_WEB` | `false` | Diventa `true` quando in Firebase c'è il Services ID di Apple: Apple anche nel browser e su Android |
| `FIREBASE_DELETE_READY` | `true` | «Elimina account» visibile: la pulizia sul server c'è |

## Da fare

1. **Impronta della chiave di firma di Google Play.** Dopo il primo caricamento dell'AAB: Play Console → Integrità dell'app → Firma dell'app → SHA-1. Va aggiunta all'app Android in Firebase, altrimenti l'accesso Google non funziona nell'app scaricata da Play.
2. **(Facoltativo) Apple nel browser e su Android:** serve un Services ID con dominio `sopralux-64b29.firebaseapp.com` e indirizzo di ritorno `https://sopralux-64b29.firebaseapp.com/__/auth/handler`. Serve anche una chiave «Sign in with Apple» (.p8): la crea il titolare dell'account e la incolla in Firebase con Team ID e Key ID. Poi `FIREBASE_APPLE_WEB = true`.

## Pubblicare le funzioni

Dalla Cloud Shell del progetto (shell.cloud.google.com, già autenticata come titolare):

```
cd ~/rilievo-elettrico && git pull -q
(cd firebase/functions && npm install --no-audit --no-fund --silent)
npx -y firebase-tools@14 deploy --only functions --project sopralux-64b29 --non-interactive --force
```

La prima pubblicazione ha attivato le API Cloud Functions, Cloud Build e Artifact Registry. Le immagini più vecchie di 1 giorno si cancellano da sole (regola di pulizia di Artifact Registry). La funzione gira con l'account di servizio predefinito di App Engine (ruolo Editor).
