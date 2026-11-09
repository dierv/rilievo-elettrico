# Sopralux – accesso Google

L'accesso Google è già pubblicato nella PWA ed è stato confermato funzionante dall'utente. Questa guida ne descrive la configurazione e le verifiche.

Il ramo `feat/firebase-sync` aggiunge archivi locali separati per account e sincronizzazione dei sopralluoghi. Il codice è implementato; l'attivazione in produzione richiede la verifica di Firestore, Storage, regole e CORS. La procedura è in [Sincronizzazione tra dispositivi](FIREBASE_SINCRONIZZAZIONE.md).

## Cosa comprende l'accesso

- Configurazione del progetto `sopralux-64b29` in `sorgenti/src/pwa.js`.
- Pulsanti **Accedi con Google** ed **Esci**, indirizzo dell'account e messaggi in italiano.
- Ripristino della sessione Google tramite Firebase Authentication.
- SDK Firebase incluso nell'app e nella cache offline.

La release iniziale con Google conserva l'archivio locale precedente. Nel ramo della sincronizzazione, il primo accesso migra i dati locali nell'archivio dell'account conservando l'originale; gli altri account e l'uso senza accesso hanno archivi distinti. La chiave Anthropic resta sul dispositivo.

## Configurazione del provider

1. Aprire [Authentication del progetto Sopralux](https://console.firebase.google.com/project/sopralux-64b29/authentication/providers).
2. In **Metodo di accesso / Sign-in method**, verificare che **Google** sia abilitato.
3. Se richiesto, scegliere l'indirizzo email di assistenza del progetto e salvare.
4. In **Impostazioni / Settings → Domini autorizzati / Authorized domains**, verificare `dierv.github.io`. Usare soltanto il dominio, senza `https://` e senza `/rilievo-elettrico/`.

Per questo accesso è sufficiente Authentication. Il funzionamento del login non prova che Firestore e Storage siano già predisposti per la sincronizzazione.

## Verifica sul dispositivo

1. Aprire [Sopralux](https://dierv.github.io/rilievo-elettrico/); dopo un aggiornamento dell'app installata, chiuderla e riaprirla.
2. Premere **Accedi con Google** e scegliere l'account.
3. Verificare che compaia l'indirizzo email. Chiudere e riaprire: l'account viene ripristinato se il browser conserva i dati dei siti.
4. Dopo l'uscita, rientrare con lo stesso account e verificare il proprio archivio. Nella versione con sincronizzazione, un altro account deve aprire il proprio archivio separato.
5. Ripetere sui dispositivi utilizzati. In modalità aereo l'app apre le copie locali; un nuovo accesso Google richiede rete.

Se il popup è bloccato, consentirlo per il sito oppure aprire lo stesso indirizzo nel browser. L'app non avvia automaticamente un accesso con reindirizzamento.

## Sviluppo e verifiche

Build PWA dalla radice del repository:

```sh
sh sorgenti/build_pwa.sh ..
```

Build Claude:

```sh
sh sorgenti/build.sh
```

La build Claude genera `sorgenti/index.html` senza Firebase. La build PWA non applica regole o configurazioni alla console Firebase.

Test dell'accesso, senza servizi cloud o dati reali:

```sh
node --test test/auth.test.cjs
```

Per rigenerare il solo SDK, vedere [sorgenti/firebase/README.md](../sorgenti/firebase/README.md). Le prove del motore, dell'integrazione e delle regole sono descritte nella [guida alla sincronizzazione](FIREBASE_SINCRONIZZAZIONE.md).

## Riferimenti

- [Firebase: accesso Google sul web](https://firebase.google.com/docs/auth/web/google-signin).
- [Firebase: persistenza della sessione](https://firebase.google.com/docs/auth/web/auth-state-persistence).
- [Firebase: reindirizzamenti e alternativa popup](https://firebase.google.com/docs/auth/web/redirect-best-practices).
