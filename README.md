# Rilievo elettrico – app per tablet

App per il rilievo dell'impianto elettrico esistente: planimetria (PDF, DXF o foto), stanze, foto con cono di ripresa, simboli della legenda, placche, quadri, note audio, esportazione DXF/CSV/PNG/ZIP.

Indirizzo: **https://dierv.github.io/rilievo-elettrico/**

## Installazione sul tablet
1. Apri l'indirizzo con Chrome.
2. Menu ⋮ → **Installa app** (oppure il pulsante "Installa app" nella prima schermata).
3. Da quel momento la apri dall'icona e funziona anche senza rete.

## Dove stanno i dati

- **Sul dispositivo**, nella memoria dell'app: è la copia di lavoro, utilizzabile anche offline. Ogni account Google ha un archivio locale separato; l'uso senza accesso mantiene un proprio archivio.
- **Nel cloud Firebase privato dell'account Google**: i sopralluoghi, le tavole, le foto, gli audio e la libreria simboli vengono sincronizzati fra i dispositivi che usano lo stesso account.
- **In una cartella scelta da te** (es. Documenti/Rilievi), se la imposti dalla prima schermata. Per ogni sopralluogo:
  - `rilievo.json` (tutti i dati),
  - `piante/`, `foto/`, `audio/`,
  - `esportazioni/` (ZIP con DXF, CSV, PNG).
- **"Recupera dalla cartella"** reimporta i sopralluoghi, per esempio su un tablet nuovo.
- **"Backup completo"** (nel Computo) crea un unico ZIP con tutto il sopralluogo.

In questo repository c'è solo l'app: nessun dato dei rilievi.

## Accesso Google e sincronizzazione

Premi **Accedi con Google** e usa lo stesso account su PC e tablet per ritrovare i tuoi sopralluoghi. L'app ricorda l'account e permette di uscire con **Esci**. I dati nel progetto Firebase `sopralux-64b29` sono privati per account.

- Le modifiche in sequenza aggiornano automaticamente la revisione condivisa: dopo aver ricevuto l'ultima versione, puoi proseguire da un altro dispositivo.
- Se due dispositivi modificano indipendentemente lo stesso impianto, l'app chiede quale **intero sopralluogo** mantenere. La scelta riguarda anche foto e audio; vale anche se una copia è stata cancellata.
- Foto, audio e modifiche offline rimangono sul dispositivo e in coda per il ritorno della rete. Una copia ricevuta dal cloud è disponibile offline dopo il download completo dei suoi allegati.
- Al primo accesso, i dati locali precedenti vengono copiati nell'archivio dell'account, conservando l'originale. Gli altri account e l'uso senza accesso hanno archivi distinti.
- La libreria personale dei simboli segue lo stesso account. La chiave Anthropic e i collegamenti alle cartelle rimangono sul dispositivo.

Firestore e Storage sono predisposti nella regione `europe-west8`; CORS è stato applicato e verificato per `https://dierv.github.io`. La release iniziale della sincronizzazione ha superato **86 test applicativi e 8 scenari delle regole negli emulatori**. **L'utente ha confermato che l'accesso Google e la sincronizzazione funzionano sui propri dispositivi.** Restano da completare le verifiche sistematiche dei casi offline, dei conflitti e degli allegati.

Configurazione, limiti e verifiche: [Accesso Google](docs/FIREBASE_ACCESSO.md) e [Sincronizzazione](docs/FIREBASE_SINCRONIZZAZIONE.md). Il bundle Firebase è incluso nella cache offline; la build Claude mantiene il proprio salvataggio e non carica Firebase.

## iPhone e iPad
- Su iOS si installa da Safari: **Condividi → «Aggiungi alla schermata Home»**.
- Il browser di iOS non permette di salvare in una cartella: i dati restano nell'app, anche offline.
- Per avere i file: **Computo → Backup completo → Condividi → «Salva su File»** (iCloud Drive o «Sul mio iPhone»). Per riprenderli: **Importa backup**.
- Attenzione: se togli l'icona dalla Home, iOS cancella anche i dati dell'app. Fai prima il backup.
- Sulla scheda di ogni sopralluogo c'è la data dell'ultimo backup.

## Penna (Apple Pencil, S Pen…)
- Appena l'app vede la penna: la penna disegna e posiziona, le dita spostano soltanto la pianta e il palmo appoggiato non lascia segni. Con due dita si fa lo zoom.
- Con la penna non compare la lente: il punto è sotto la punta.
- Il disegno a mano segue la pressione, anche nel DXF e nel PNG.
- Se tablet e penna lo supportano, avvicinando la penna allo schermo compare il mirino dove cadrà il punto.
- Si disattiva in **Impostazioni**.

## Tavola da una foto del disegno cartaceo
«+ Tavola → Fotografa il disegno» (o un'immagine/scansione da file): trascini i 4 cerchi sugli angoli del foglio, scegli il formato (A4…A0, o un rettangolo di cui sai le misure) e la scala del disegno (1:50, 1:100…): la foto viene raddrizzata (correzione prospettica), pulita come una scansione (ombre e grigio della carta tolti, colori conservati) e la tavola nasce già in scala. Se non sai formato o scala, calibri dopo con lo strumento Scala su una quota nota. «Usa così com'è» salta il raddrizzamento. Le tavole da foto si salvano in JPEG.

## Durante il sopralluogo
- **Stanze a mano libera**: i punti della stanza (e i vertici quando li sposti) vanno esattamente dove tocchi, senza agganci ad angoli o lati di altre stanze e senza raddrizzare i lati. Per chiudere: tocca il primo punto o «Chiudi stanza».
- **Esterni**: foto, simboli e note si possono mettere anche fuori dai riquadri dei locali (facciate, cortili, aree esterne). Finiscono nel gruppo **Esterni**: riga e pannello propri nella panoramica, voce «Esterni» nel computo per locale e nella colonna Locale dei CSV. I simboli vanno sempre nel punto esatto del dito o della penna, senza agganci; contano nel locale se almeno metà del simbolo, come lo vedi disegnato in quel momento, è dentro i muri; se più di metà è fuori vanno negli Esterni e, se sono a parete, sono girati di 180° (verso il muro, visti da fuori). Le foto scattate da fuori verso la facciata mettono gli oggetti sulla facciata, fuori dal locale.
- **Colori del DXF**: per le tavole importate da DXF, l'interruttore «colori» sopra il tasto della rotazione mostra la pianta con i colori di AutoCAD (bianco → nero, giallo e celeste più scuri) o tutta in nero, che è la scelta di partenza. Per una tavola DXF importata prima, il primo tocco sull'interruttore chiede lo stesso file DXF e aggiunge i colori senza spostare locali e simboli.
- **Tavolozza dei simboli su due righe**, come le emoji del telefono: sopra Cerca, Timbro, Più usati, Illuminazione (simboli verdi), Forza motrice (rossi), Speciali, Distribuzione (quadri, linee, pozzetti, terra); sotto i simboli, che scorrono di gruppo in gruppo e accendono il gruppo che stai guardando. Timbro: ritoccandolo si torna alla freccia.
- **Colore dei locali**: arancione = manca qualcosa (nessuna foto, nessun punto luce, nessun elemento), blu = in lavorazione, verde = rilevato. Nel pannello del locale c'è l'elenco di cosa manca.
- **Controllo generale** (nel pannello della tavola): elenco dei locali da verificare e foto ancora da analizzare; con doppia conferma **chiude il sopralluogo** e fotografa lo *stato di fatto*. Da lì in poi ogni modifica è una *scelta tecnica*: compare con un distintivo sulla pianta, nel CSV (colonna `Scelta_tecnica`) e nel DXF su layer con suffisso `_PROGETTO` (gli elementi tolti dopo la chiusura finiscono su `_RIMOSSI`); lo stato di fatto chiuso resta sempre consultabile ed esportabile.
- **Destino** di ogni elemento: *da rimuovere*, *da sostituire*, *nuovo*. Si sceglie dal pannello dell'elemento; va nel CSV (colonna `Destino`) e nel DXF su layer con suffisso `_RIMUOVERE`, `_SOSTITUIRE`, `_NUOVO`.
- **Barra dei simboli più usati** sotto la pianta (grafica + descrizione), con **timbro** per mettere più volte lo stesso simbolo.
- **Misura**: con la scala impostata tocca due o più punti (si agganciano agli angoli dei locali): distanza per tratto, totale, e area/perimetro se chiudi il poligono.
- **Pianta che segue come sei girato**: tasto in basso a destra (o due dita che torcono) per girare la pianta come sei messo tu; **Segui come sono girato** la fa ruotare da sola quando ti giri e, nel tool Foto, un tocco crea la foto verso la parete che hai davanti. Usa il giroscopio (non il nord magnetico, che vicino a ferro e magneti sbaglia): il riferimento è il momento in cui lo attivi; se la pianta si sfasa la raddrizzi con due dita, col cursore o con «Dritta», e da lì riparte. Sui tablet senza giroscopio (per esempio il TCL NXTPAPER 11 Plus) ripiega sulla bussola magnetica, che vicino a ferro e magneti perde anche decine di gradi: il pannello lo dice, e lì conviene raddrizzare spesso o girare la pianta a mano. Serve il permesso ai sensori di movimento del browser (su iPhone/iPad lo chiede la prima volta); dentro Claude i sensori possono essere bloccati, nell'app installata funzionano.

## Esportazioni
DXF, CSV, PNG e ZIP (backup completo). Il DXF del rilievo (formato R2000; locali, simboli, tratti, note, su layer separati, in metri reali) si esporta qualunque sia l'origine della tavola: DXF, PDF, immagine o foto. Se la tavola viene da un DXF le coordinate sono quelle del disegno originale e il rilievo si sovrappone al DWG. Da PDF o foto l'origine è l'angolo in alto a sinistra della tavola e il disegno di partenza è agganciato sotto il rilievo come immagine (entità IMAGE sul layer `RIL_SFONDO`, file `*_sfondo.png/jpg` accanto al DXF nella cartella `dxf/`: vanno tenuti insieme; quando non serve più, spegni il layer o cancella l'immagine). Il disegno non viene vettorializzato: i vettori sono i locali e gli elementi del rilievo.

## Riconoscimento AI
- Funziona con una chiave API Anthropic, da inserire in **Impostazioni**. Resta solo sul tablet.
- Costi indicativi con Sonnet 5.5: circa 2 centesimi di dollaro a foto e circa 10 per la lettura di un quadro.
- **Secondo sguardo alle placche** (acceso, si spegne in Impostazioni): ogni placca viene ritagliata e ingrandita per contare i posti e riconoscere le prese; tasti e tappi restano come nella prima lettura. Costa circa mezzo centesimo in più per foto con placche.
- La spesa di ogni sopralluogo compare sulla sua scheda e nel Computo.
- Senza chiave l'app funziona lo stesso, con rilievo a mano.
- Le foto fatte offline vengono analizzate al ritorno della rete.

## Versione in Claude
La stessa app esiste anche dentro Claude: lì l'AI è compresa nell'abbonamento, ma serve internet. Per spostare un sopralluogo da una versione all'altra: **Backup completo** da una parte, **Importa backup** dall'altra (aggiorna o crea una copia).

## Sorgenti
`sorgenti/` contiene il codice condiviso dalle due versioni:
- `sh build_pwa.sh ..` (lanciato da `sorgenti/`) rigenera l'app pubblicata qui;
- `sh build.sh` crea la versione per Claude.
