# Rilievo elettrico – app per tablet

App per il rilievo dell'impianto elettrico esistente: planimetria (PDF, DXF o foto), stanze, foto con cono di ripresa, simboli della legenda, placche, quadri, note audio, esportazione DXF/CSV/PNG/ZIP.

Indirizzo: **https://dierv.github.io/rilievo-elettrico/**

## Installazione sul tablet
1. Apri l'indirizzo con Chrome.
2. Menu ⋮ → **Installa app** (oppure il pulsante "Installa app" nella prima schermata).
3. Da quel momento la apri dall'icona e funziona anche senza rete.

## Dove stanno i dati
- **Sul tablet**, nella memoria dell'app (non su server).
- **In una cartella scelta da te** (es. Documenti/Rilievi), se la imposti dalla prima schermata. Per ogni sopralluogo:
  - `rilievo.json` (tutti i dati),
  - `piante/`, `foto/`, `audio/`,
  - `esportazioni/` (ZIP con DXF, CSV, PNG).
- **"Recupera dalla cartella"** reimporta i sopralluoghi, per esempio su un tablet nuovo.
- **"Backup completo"** (nel Computo) crea un unico ZIP con tutto il sopralluogo.

In questo repository c'è solo l'app: nessun dato dei rilievi.

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
