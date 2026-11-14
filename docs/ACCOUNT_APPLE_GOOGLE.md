# Account SopraLux: accesso con Apple o Google

Aggiornato il 14/11/2026.

## Come funziona

- **Un solo account** (uid Firebase) per browser, Android e iPad. Si entra con Apple o con Google; dalla scheda **Account** si collega anche l'altro metodo. Acquisti e impianti seguono l'account, non il metodo.
- **Stessa email già registrata con l'altro metodo** (impostazione Firebase «collega gli account con lo stesso indirizzo email»): l'app spiega di entrare con il metodo già usato e, appena l'utente entra, collega da sola il nuovo metodo.
- **Email nascosta di Apple** (`…@privaterelay.appleid.com`): l'email non coincide, quindi si collega a mano dalla scheda Account (per esempio sull'iPad: entra con Apple → Account → Collega Google; poi su Android entra con Google).
- **Browser (PWA):** popup di Firebase.
- **App nativa:** plugin `@capacitor-firebase/authentication`. Mostra le schermate di sistema e passa le credenziali all'SDK JavaScript (`skipNativeAuth: true`), così nell'app c'è un solo account.
- **Su Android**, Apple funziona solo per entrare: il suo flusso apre già una sessione nativa, quindi non si può collegare a un account aperto. Su Android si collega Google; Apple si collega dall'iPad o dal browser.
- **Eliminazione dell'account** (Apple 5.1.1(v)):
  - si conferma l'accesso;
  - con Apple si revoca anche l'autorizzazione (sull'iPad e nel browser);
  - si elimina l'utente;
  - i dati online li cancella la funzione `eliminaDatiAccount` sul server.

Codice: `sorgenti/src/pwa_firebase.js` (account e scheda Account); `pwa_cloud.js` usa gli stessi pulsanti e aspetta la fine del collegamento prima di ricaricare. Prova: `test/t44.py` nella cartella di lavoro (SDK e plugin finti).

## Interruttori in `sorgenti/src/pwa.js`

| Costante | Ora | Quando diventa `true` |
|---|---|---|
| `FIREBASE_APPLE_WEB` | `false` | Quando in Firebase c'è il Services ID di Apple (Apple nel browser e su Android) |
| `FIREBASE_DELETE_READY` | `false` | Quando la funzione `eliminaDatiAccount` è pubblicata: compare «Elimina account» |

## Cosa è già attivo

- **PWA:** accesso Google come prima, più la scheda Account (collega o scollega i metodi).
- **App nativa:** il codice dell'account c'è, ma resta nascosto finché nell'app non c'è il plugin. Le build di prova non cambiano e non fanno richieste a Firebase.

## Configurazione che manca (in ordine)

1. **Firebase → Impostazioni progetto → Aggiungi app Android** `it.diervsoft.sopralux`. Impronte SHA-1 da inserire:
   - chiave di prova (APK di prova): `70:06:F2:83:7F:83:3D:BE:5B:8B:6D:CA:44:F2:47:DC:D9:F1:FD:0C`;
   - chiave di caricamento per Play: si legge dopo la prima build `app-android-play.yml`;
   - chiave di firma di Google Play: Play Console → Integrità dell'app → Firma dell'app, dopo il primo caricamento.

   Scaricare `google-services.json` in `app/android/app/`.
2. **Firebase → Aggiungi app iOS** `it.diervsoft.sopralux` (Team `4T9977N43U`). Scaricare `GoogleService-Info.plist` in `app/ios/App/App/` e aggiungerlo al target App.
3. **Apple Developer → Identifiers → `it.diervsoft.sopralux`:** attivare la capability **Sign in with Apple**. I profili creati dalla build GitHub la includono da soli.
4. **Firebase Authentication → Metodo di accesso → Apple:** abilitarlo. Basta per l'iPad. Per il browser e Android servono anche:
   - un **Services ID** con dominio `sopralux-64b29.firebaseapp.com` e indirizzo di ritorno `https://sopralux-64b29.firebaseapp.com/__/auth/handler`;
   - una **chiave Sign in with Apple** (.p8). La crea e la incolla in Firebase il titolare dell'account, non va nel repo. Vanno inseriti anche Team ID e Key ID.

   Poi `FIREBASE_APPLE_WEB = true`.
5. **App:**
   - `npm i @capacitor-firebase/authentication@8.6.0` nella cartella `app`;
   - in `capacitor.config.json`: `"FirebaseAuthentication": { "skipNativeAuth": true, "providers": ["apple.com", "google.com"] }`;
   - in `android/variables.gradle`: `rgcfaIncludeGoogle = true` e `androidxCredentialsVersion = '1.3.0'`;
   - iOS: URL scheme con il `REVERSED_CLIENT_ID` del plist e diritto `com.apple.developer.applesignin` (file `App.entitlements`);
   - infine `npx cap sync`.
6. **Funzione di pulizia:** `firebase deploy --only functions` dalla cartella principale del repo (codice in `firebase/functions`). Poi `FIREBASE_DELETE_READY = true`.

Senza i passi 1–2 il plugin farebbe chiudere l'app all'avvio: per questo il passo 5 viene dopo.
