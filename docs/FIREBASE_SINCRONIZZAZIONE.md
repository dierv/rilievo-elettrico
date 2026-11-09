# Sopralux – sincronizzazione tra dispositivi

La PWA sincronizza sopralluoghi, allegati e libreria personale dei simboli fra dispositivi che usano lo stesso account Google. Il progetto Firebase reale, Firestore, Storage e CORS sono stati verificati; **l'utente ha confermato che l'accesso Google e la sincronizzazione funzionano sui propri dispositivi**.

La release iniziale della sincronizzazione ha superato **86 test applicativi e 8 scenari delle regole negli emulatori**. La conferma sui dispositivi reali riguarda l'uso provato dall'utente: **restano da completare le verifiche sistematiche dei casi offline, dei conflitti e degli allegati**, elencate in fondo a questa guida.

## Comportamento concordato

Entrando con lo stesso account Google, ogni dispositivo ritrova gli stessi sopralluoghi. Una modifica che prosegue dall'ultima revisione ricevuta diventa automaticamente la nuova revisione condivisa.

Sul sopralluogo aperto, un aggiornamento remoto mantiene la tavola e la selezione ancora disponibili; conserva zoom, spostamento e rotazione se l'inquadratura è valida e le dimensioni della tavola sono rimaste uguali. Se la tavola è stata eliminata, apre la prima disponibile; se l'elemento selezionato non esiste più, lo deseleziona. L'aggiornamento attende la fine della modifica di un campo, di un gesto o del caricamento di una tavola.

Quando due dispositivi modificano indipendentemente lo stesso sopralluogo, l'app conserva le due copie e chiede quale **intero sopralluogo** mantenere. Non decide in base all'orologio del tablet e non fonde automaticamente i singoli simboli. La stessa regola copre il caso «modificato qui, cancellato altrove».

L'archivio locale resta la copia di lavoro. Senza rete, le modifiche rimangono sul dispositivo e vengono riprese quando la connessione torna disponibile. Un sopralluogo ricevuto online deve essere scaricato con tutti i suoi file prima di essere considerato disponibile offline. Senza account si continua a lavorare in locale.

## Come è salvata una revisione

| Dato | Posizione |
| --- | --- |
| Riferimento all'ultima revisione del sopralluogo | Firestore: `users/{uid}/surveys/{sid}` |
| Copia completa dei dati, in JSON | Storage: `users/{uid}/surveys/{sid}/snapshots/{sha256}.json` |
| Foto, tavole e audio | Storage: `users/{uid}/surveys/{sid}/files/{sha256}` |
| Legenda e impostazioni sincronizzabili | Stessa struttura, con `sid = _sopralux_library` |

Il documento Firestore contiene soltanto schema, numero di revisione, impronte, percorso della copia completa, nome, dispositivo autore, tipo e data del server. I poligoni, i disegni e le altre liste restano nella JSON: non diventano array annidati Firestore.

Ogni invio segue quest'ordine:

1. Prepara una copia immutabile del sopralluogo e l'elenco preciso dei file che usa.
2. Verifica che ogni file sia già online o lo carica. Una foto o una registrazione modificata ha un nuovo hash, anche se mantiene lo stesso identificativo nell'app.
3. Carica la copia completa in JSON.
4. In una transazione Firestore, controlla che la revisione online sia ancora quella da cui è partita la modifica locale.
5. Se coincide, pubblica il riferimento alla nuova revisione; se non coincide, lascia il riferimento online invariato e restituisce la versione corrente al motore dei conflitti.

Non viene pubblicata una revisione se manca anche un solo file. Un'interruzione o un conflitto può lasciare file appena caricati senza un riferimento attivo, ma non modifica i file delle copie già pubblicate. Le callback di transazione non caricano file e non modificano lo stato locale, perché Firebase può rieseguirle.

La data mostrata per una revisione online proviene da `serverTimestamp`. Il campo `rev` e la versione di partenza determinano la sequenza; una data più recente sul dispositivo non autorizza a sovrascrivere l'altro sopralluogo.

## Isolamento e controlli

Ogni account Google usa un database locale separato. L'archivio senza account è distinto: al primo accesso i suoi sopralluoghi e allegati vengono copiati nell'archivio dell'account, con un registro che permette di riprendere una migrazione interrotta. L'acquisizione dell'archivio sorgente è atomica, così due accessi concorrenti non lo associano a due account. **L'archivio originale viene conservato**; eventuali collisioni di identificativi mantengono entrambe le copie.

I wrapper IndexedDB della PWA confermano una scrittura soltanto al completamento della transazione e annullano tutte le operazioni se una parte fallisce. L'applicazione di una copia remota salva insieme dati, allegati e revisione; una modifica locale intervenuta nel frattempo impedisce di applicare una lettura superata. Questi adattamenti riguardano soltanto la PWA e conservano il comportamento della build Claude.

Le regole consentono l'accesso soltanto all'UID Firebase proprietario. Un account diverso e gli utenti non autenticati non possono leggere o scrivere i dati. La legenda sincronizzata appartiene allo stesso account, senza percorsi comuni pubblici.

L'app non inserisce negli snapshot la chiave Anthropic, token di accesso, URL di download con token, URL `blob:`, riferimenti locali o handle di cartelle. I file sono scaricati mediante l'SDK autenticato e l'impronta SHA-256 viene verificata prima di usarli. Il percorso di un file viene ricostruito dall'UID della sessione, dall'identificativo del sopralluogo e dal suo hash; un percorso arbitrario contenuto nei dati non viene seguito.

Ogni sessione controlla l'account prima e dopo le operazioni asincrone e anche dentro la transazione. Cambiare account o uscire impedisce alle operazioni rimaste in attesa di pubblicare la revisione sotto la nuova identità.

Il limite è **20 MiB per singolo file** e **20 MiB per copia JSON dei dati**. Superarlo genera un messaggio e mantiene la modifica locale in attesa; non viene pubblicata una copia parziale.

La cancellazione di un sopralluogo è una revisione con `del: true`. Le vecchie copie e i file immutabili restano conservati per non distruggere una versione ancora necessaria a un dispositivo offline o a un conflitto. Questa versione non applica una pulizia automatica della cronologia né elimina fisicamente i vecchi oggetti dal bucket; il loro spazio occupato deve essere considerato nel controllo dei consumi.

## Backend verificato

Verifiche sul progetto reale del **9 novembre 2026**:

| Componente | Configurazione verificata |
| --- | --- |
| Progetto | `sopralux-64b29`, numero `1009612427289` |
| Fatturazione | Già attiva sul progetto |
| Firestore | Database `(default)`, modalità Native, edizione Standard, regione `europe-west8` |
| Storage | Bucket `sopralux-64b29.firebasestorage.app`, posizione `EUROPE-WEST8`, classe restituita dall'API `REGIONAL` |
| Regole | `firebase/firestore.rules` e `firebase/storage.rules`, validate, pubblicate e rilette identiche ai file del repository |
| CORS | Applicato e riletto identico a `firebase/cors.json`; origine `https://dierv.github.io`, metodo `GET`, cache 3600 secondi |

Il bucket è passato da CORS vuoto e `metageneration: 1` alla configurazione prevista e `metageneration: 2`. Non sono stati creati nuovi servizi o cambiati piano di fatturazione e regioni. L'hosting dell'app resta su GitHub Pages.

### Pubblicazione delle regole

La normale build della PWA non pubblica le regole. Per aggiornamenti successivi, con un accesso amministrativo autorizzato, il comando dalla radice del repository è:

```sh
npx --yes firebase-tools@15.35.0 deploy --only firestore:rules,storage --project sopralux-64b29
```

`firebase.json` indica soltanto regole ed emulatori. Non contiene una configurazione Hosting.

### CORS per scaricare foto e audio

L'SDK `getBlob` richiede CORS sul bucket anche quando l'accesso è autenticato. La configurazione di `firebase/cors.json` è stata applicata e verificata: autorizza soltanto l'origine attuale della PWA. L'origine non include `/rilievo-elettrico/`.

Per eventuali aggiornamenti, con gli strumenti Google Cloud già autorizzati:

```sh
gcloud storage buckets update gs://sopralux-64b29.firebasestorage.app --cors-file=firebase/cors.json
gcloud storage buckets describe gs://sopralux-64b29.firebasestorage.app --format="default(cors_config)"
```

In alternativa, la JSON API di Cloud Storage accetta un aggiornamento del solo campo `{ "cors": [...] }`; il file per `gcloud` contiene invece direttamente l'array. Quando cambierà il dominio dell'app, aggiornare la lista delle origini e i domini di Authentication. CORS non concede accesso ai dati: restano necessarie autenticazione e regole per UID.

## Verifiche automatiche

L'aggiornamento del 9 novembre 2026 che mantiene la vista dell'impianto ha superato **95 test applicativi**: i precedenti 86 più 9 regressioni sull'editor reale, inclusi caricamenti asincroni, selezione e tavole eliminate. Le regole Firebase non sono cambiate rispetto alla release iniziale.

Test di accesso, motore, backend e integrazione con dati sintetici, senza connessione al progetto reale:

```sh
node --test test/auth.test.cjs test/cloud_engine.test.cjs test/cloud_backend.test.cjs test/cloud_integration.test.cjs
```

Coprono la sequenza file → snapshot → revisione, conflitti fra due dispositivi, retry, mancata disponibilità dei file e verifica delle impronte. Le prove d'integrazione esercitano inoltre migrazione e isolamento degli archivi, transazioni atomiche, cambio account, importazione dei backup e conservazione degli audio dello stato di fatto.

Per verificare realmente le regole con gli emulatori Firebase, servono Node.js 24.12.0 o successivo, Java 21 e le dipendenze di sviluppo:

```sh
cd sorgenti/firebase
npm ci
cd ../..
npx --yes firebase-tools@15.35.0 emulators:exec --only firestore,storage --project demo-sopralux-sync "node --test test/cloud_rules.test.cjs"
```

Il progetto fittizio `demo-sopralux-sync` mantiene i test separati dal progetto reale. I test delle regole verificano accesso senza account, accesso incrociato, revisioni non valide, percorsi errati, cancellazioni, immutabilità e limite di dimensione. Se eseguiti senza emulatori, risultano esplicitamente saltati.

Verifiche della release iniziale della sincronizzazione, del 9 novembre 2026: **86 test applicativi superati** fra accesso, motore, backend e integrazione, più **8 scenari delle regole superati negli emulatori** (9 test contando la suite contenitore). Le prove hanno verificato anche che le chiavi numeriche degli oggetti producano la stessa JSON canonica nel motore e nel backend. Le verifiche del backend reale e la successiva conferma dell'utente sui propri dispositivi sono distinte da questi test automatici.

L'SDK rimane fissato a Firebase **13.2.0**. Per rigenerare il bundle dopo una modifica agli import:

```sh
cd sorgenti/firebase
npm run build
cd ..
sh build_pwa.sh ..
```

## Verifiche su due dispositivi

**Sincronizzazione confermata dall'utente sui propri dispositivi.** L'elenco seguente è il piano di verifica completo: la conferma ricevuta non attesta ancora tutti i casi, in particolare offline, conflitti e allegati.

1. Accedere con lo stesso account su PC e tablet: verificare stesso elenco e apertura completa di tavole, foto e audio.
2. Modificare un sopralluogo sul PC; dopo la ricezione sul tablet, proseguire dal tablet: aggiornamento automatico, senza conflitto.
3. Portare il tablet offline e modificare lo stesso sopralluogo su entrambi: al ritorno della rete deve comparire la scelta dell'intero sopralluogo.
4. Scegliere prima una copia e poi, con un nuovo caso di prova, l'altra: entrambi i dispositivi devono convergere alla scelta fatta.
5. Modificare una registrazione già esistente mentre un'altra versione del sopralluogo è online: la registrazione di quella copia deve restare intatta fino alla decisione.
6. Creare una foto offline, chiudere e riaprire l'app, poi ripristinare la rete: il file deve essere ancora in coda e arrivare sull'altro dispositivo.
7. Ricevere un sopralluogo online, scollegare il dispositivo e riaprirlo con tutte le foto scaricate.
8. Cancellare da un dispositivo e verificare la rimozione dall'altro; ripetere con modifiche offline concorrenti e verificare la richiesta di scelta.
9. Uscire e accedere con un altro account: nessun sopralluogo del primo account deve essere caricato nel secondo.
10. Verificare che la build Claude e l'uso senza account continuino a funzionare.

## Riferimenti ufficiali

- [Transazioni Firestore, retry e comportamento offline](https://firebase.google.com/docs/firestore/manage-data/transactions).
- [API JavaScript Firestore](https://firebase.google.com/docs/reference/js/firestore).
- [Download Storage e CORS](https://firebase.google.com/docs/storage/web/download-files).
- [Configurare e verificare CORS del bucket](https://docs.cloud.google.com/storage/docs/using-cors).
- [Struttura della configurazione CORS](https://docs.cloud.google.com/storage/docs/cors-configurations).
- [API JavaScript Storage](https://firebase.google.com/docs/reference/js/storage).
- [Condizioni nelle regole Storage](https://firebase.google.com/docs/storage/security/rules-conditions).
- [Riferimento delle regole Storage e immutabilità](https://firebase.google.com/docs/reference/security/storage).
