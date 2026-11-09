# Sopralux – accesso Google

L'accesso Google della PWA è stato confermato funzionante dall'utente. Lo stesso account identifica l'archivio locale e la copia privata nel cloud: entrando su un altro dispositivo, l'app sincronizza sopralluoghi, allegati e libreria personale dei simboli.

Firestore e Storage del progetto sono stati verificati in `europe-west8` e CORS è stato applicato all'origine della PWA. Comportamento, regole, limiti e verifiche sono descritti in [Sincronizzazione tra dispositivi](FIREBASE_SINCRONIZZAZIONE.md). La prova completa di sincronizzazione su due dispositivi reali resta da eseguire.

## Cosa comprende l'accesso

- Configurazione del progetto `sopralux-64b29` in `sorgenti/src/pwa.js`.
- Pulsanti **Accedi con Google** ed **Esci**, indirizzo dell'account e messaggi in italiano.
- Ripristino della sessione Google tramite Firebase Authentication.
- SDK Firebase incluso nell'app e nella cache offline.
- Archivio locale separato per ogni account e un archivio distinto per l'uso senza accesso.
- Sincronizzazione privata fra dispositivi dello stesso account, con scelta dell'intero sopralluogo se le modifiche sono indipendenti.

Al primo accesso, i dati locali precedenti vengono copiati nell'archivio dell'account conservando l'originale. Una migrazione interrotta può riprendere; lo stesso archivio sorgente non viene acquisito da due account. Uscendo, si torna all'archivio senza account; entrando con un altro account si apre il suo archivio separato. La chiave Anthropic e gli handle delle cartelle restano sul dispositivo.

## Configurazione del provider

1. Aprire [Authentication del progetto Sopralux](https://console.firebase.google.com/project/sopralux-64b29/authentication/providers).
2. In **Metodo di accesso / Sign-in method**, verificare che **Google** sia abilitato.
3. Se richiesto, scegliere l'indirizzo email di assistenza del progetto e salvare.
4. In **Impostazioni / Settings → Domini autorizzati / Authorized domains**, verificare `dierv.github.io`. Usare soltanto il dominio, senza `https://` e senza `/rilievo-elettrico/`.

Authentication gestisce l'accesso; Firestore e Storage gestiscono le revisioni e i file. La build della PWA non applica automaticamente regole o configurazioni a questi servizi.

## Verifica sul dispositivo

1. Aprire [Sopralux](https://dierv.github.io/rilievo-elettrico/); dopo un aggiornamento dell'app installata, chiuderla e riaprirla.
2. Premere **Accedi con Google** e scegliere l'account.
3. Verificare che compaia l'indirizzo email. Chiudere e riaprire: l'account viene ripristinato se il browser conserva i dati dei siti.
4. Dopo l'uscita, rientrare con lo stesso account e verificare il proprio archivio. Un altro account deve aprire il proprio archivio separato.
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

La verifica automatica della release comprende **86 test applicativi superati** e **8 scenari delle regole superati negli emulatori**. Questi risultati non sostituiscono la prova reale su PC e tablet. Per rigenerare il solo SDK, vedere [sorgenti/firebase/README.md](../sorgenti/firebase/README.md). I comandi e i casi coperti sono nella [guida alla sincronizzazione](FIREBASE_SINCRONIZZAZIONE.md).

## Riferimenti

- [Firebase: accesso Google sul web](https://firebase.google.com/docs/auth/web/google-signin).
- [Firebase: persistenza della sessione](https://firebase.google.com/docs/auth/web/auth-state-persistence).
- [Firebase: reindirizzamenti e alternativa popup](https://firebase.google.com/docs/auth/web/redirect-best-practices).
