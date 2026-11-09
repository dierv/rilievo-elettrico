# Sopralux – accesso Google

Primo passo della Fase 1, preparato sul commit `f8cfc89` del repository `dierv/rilievo-elettrico`.

## Cosa comprende

- Configurazione del progetto `sopralux-64b29` in `sorgenti/src/pwa.js`.
- Pulsanti **Accedi con Google** ed **Esci**, indirizzo dell'account e messaggi in italiano.
- Ripristino della sessione Google tramite Firebase Authentication.
- SDK Firebase App e Authentication incluso nell'app e nella cache offline.

**La sincronizzazione tra dispositivi è il passo successivo.** In questa versione il login non carica sopralluoghi, foto o audio: l'archivio locale resta comune ai login Google usati in quel browser. La migrazione dei dati al primo account e gli archivi separati per account saranno introdotti insieme alla sincronizzazione e alla gestione dei conflitti.

## 1. Abilitare Google in Firebase

1. Aprire il [progetto Sopralux, Authentication](https://console.firebase.google.com/project/sopralux-64b29/authentication/providers).
2. Se compare **Inizia**, completare l'attivazione di Authentication.
3. In **Metodo di accesso / Sign-in method**, scegliere **Google** e abilitarlo.
4. Se richiesto, scegliere l'indirizzo email di assistenza del progetto e salvare.
5. In **Impostazioni / Settings → Domini autorizzati / Authorized domains**, verificare che sia presente `dierv.github.io`; aggiungerlo se manca. Scrivere solo il dominio, senza `https://` e senza `/rilievo-elettrico/`.

Per questo passo si usa soltanto Authentication. Firestore, Storage, regole e migrazione dei dati saranno configurati nel passo della sincronizzazione.

## 2. Applicare il pacchetto

Il pacchetto ZIP contiene i file completi aggiornati e mantiene i percorsi del repository. Copiarne il contenuto nella cartella locale `rilievo-elettrico`, accettando la sostituzione dei file corrispondenti. Usare come base la versione `f8cfc89`: se nel frattempo sono state fatte altre modifiche agli stessi file, unirle prima di sostituirli.

`index.html`, `sw.js` e `lib/firebase.js` sono già generati. Non serve installare npm per applicare questo pacchetto.

Per pubblicarlo, dalla radice della propria copia del repository:

```sh
git add README.md docs/FIREBASE_ACCESSO.md index.html sw.js lib/firebase.js sorgenti/build_pwa.sh sorgenti/pwa_static/sw.js sorgenti/src/pwa.js sorgenti/src/pwa_firebase.js sorgenti/firebase test/auth.test.cjs
git commit -m "Sopralux: primo accesso Google con Firebase"
git push
```

Questi comandi pubblicano sul ramo attualmente selezionato. Sul ramo `main` del repository usato per GitHub Pages, il push rende disponibile la nuova versione dell'app secondo la configurazione Pages esistente.

## 3. Provare l'accesso

1. Aprire [Sopralux](https://dierv.github.io/rilievo-elettrico/) e, se l'app era già installata, chiuderla e riaprirla dopo l'avviso di aggiornamento.
2. Premere **Accedi con Google** e scegliere l'account.
3. Verificare che compaia l'indirizzo email. Chiudere e riaprire: l'account deve restare collegato, se il browser conserva i dati dei siti.
4. Premere **Esci** e controllare che i sopralluoghi locali siano ancora visibili.
5. Ripetere la prova sul tablet e sull'iPad. In modalità aereo l'app deve continuare ad aprire i dati locali; un nuovo accesso richiede rete.

Se il popup è bloccato, consentire i popup per il sito oppure aprire lo stesso indirizzo nel browser. L'app non avvia automaticamente un accesso con reindirizzamento: su GitHub Pages richiede ulteriori accorgimenti, soprattutto su Safari.

## Sviluppo e verifiche

Build PWA, dalla radice del repository:

```sh
sh sorgenti/build_pwa.sh ..
```

Build Claude:

```sh
sh sorgenti/build.sh
```

La seconda genera `sorgenti/index.html` e non include Firebase. Non è necessario aggiungere quell'artefatto al commit della PWA.

Test automatici dell'integrazione, senza servizi cloud o dati reali:

```sh
node --test test/auth.test.cjs
```

Le istruzioni per rigenerare il solo SDK sono in [sorgenti/firebase/README.md](../sorgenti/firebase/README.md).

I test simulano gli esiti di Firebase: non sostituiscono la prova effettiva con Google dal dominio autorizzato né quella sui dispositivi. Nessuna impostazione della console Firebase viene cambiata dalla build.

### Verifiche eseguite il 09/11/2026

- 15 test automatici superati, compresi annullamento del popup, rete assente, cambio account e risposte tardive da altre schede.
- Bundle SDK e build PWA generati; JavaScript valido e tutti i file della cache presenti.
- Build Claude identica byte per byte alla build del commit `f8cfc89`.
- La prova interattiva nel browser non è stata eseguita: l'ambiente di verifica impedisce l'avvio del browser. L'accesso Google reale e il comportamento su Android/iPad restano da provare come indicato al punto 3.

## Riferimenti

- [Firebase: accesso Google sul web](https://firebase.google.com/docs/auth/web/google-signin).
- [Firebase: persistenza della sessione](https://firebase.google.com/docs/auth/web/auth-state-persistence).
- [Firebase: limiti dei reindirizzamenti e alternativa popup](https://firebase.google.com/docs/auth/web/redirect-best-practices).
