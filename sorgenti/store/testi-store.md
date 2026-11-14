# SopraLux – testi e materiale per gli store

Pagine pubbliche (GitHub Pages):
- Privacy: https://dierv.github.io/rilievo-elettrico/privacy.html
- Assistenza: https://dierv.github.io/rilievo-elettrico/supporto.html

Materiale grafico in questa cartella:
- `icona-1024.png` (App Store) e `icona-play-512.png` (Google Play)
- `screenshot/`:
  - `ipad13_*` 2752×2064 per iPad 13″
  - `tab10_*` 2560×1600 per i tablet Android
  - `phone_*` 1080×1920 per i telefoni Android
  - `play_grafica_1024x500` è la grafica in evidenza di Google Play
- La pianta d'esempio è inventata (`appartamento_demo.dxf`).
- Per rigenerare gli screenshot: `demo_dxf.py`, poi `shots.py`, `frame.py` e `feature.py`. Servono Playwright e l'app costruita in /tmp/appwww.

---

## Nome

- **App Store** (max 30): `SopraLux – Rilievi elettrici`
- **Google Play** (max 30): `SopraLux – Rilievi elettrici`

## Sottotitolo App Store (max 30)

`Rilievo impianti sul tablet`

## Descrizione breve Google Play (max 80)

`Rilievo degli impianti elettrici sul tablet: scrivi a mano sulla pianta.`

## Testo promozionale App Store (max 170)

`Scrivi a mano sulla planimetria come sulla carta e porta in ufficio un rilievo ordinato: stanze, simboli, foto e computo, con export DXF per AutoCAD.`

## Parole chiave App Store (max 100)

`rilievo,impianto elettrico,sopralluogo,planimetria,perito,DXF,AutoCAD,computo,quadro,stato di fatto`

## Descrizione completa (tutti e due gli store)

```
Il rilievo dello stato di fatto elettrico, direttamente sul tablet. Carichi la planimetria, scrivi a mano con la penna come sulla carta e torni in ufficio con un rilievo ordinato, già pronto per il computo e per AutoCAD.

Pensata per periti, ingegneri, studi tecnici e installatori che fanno sopralluoghi in appartamenti, uffici, negozi e capannoni.

PERCHÉ SOPRALUX
• Veloce come la carta: con Apple Pencil, S Pen o la penna del tablet scrivi e disegni sulla pianta; le dita spostano e ingrandiscono, il palmo non lascia segni.
• Niente account e niente rete: tutto resta sul dispositivo e funziona anche in cantiere senza campo.
• Dalla pianta al computo: stanze, simboli, quadri e foto diventano un elenco ordinato da esportare.

COSA PUOI FARE
• Planimetrie PDF, DXF (scala e coordinate reali) o foto del disegno raddrizzata e messa in scala
• Penna con colori, tre spessori, gomma e Indietro
• Stanze disegnate sulla pianta con lo stato del rilievo: manca qualcosa, in lavorazione, rilevato
• Simboli elettrici della tua legenda: prese, comandi, punti luce, quadri, canaline
• Foto posizionate sulla pianta con la direzione dello scatto
• Note audio legate a un punto della pianta
• Misure e scala, riquadro e copia tra tavole
• Quadri elettrici con le file di moduli
• Controllo finale di cosa manca e chiusura del sopralluogo con lo stato di fatto
• Computo ed esportazione: DXF per AutoCAD con layer e blocchi, CSV per Excel, foto e note audio in un unico ZIP
• Archivio automatico nella cartella Documenti/SopraLux e backup completo
• Tema chiaro (si legge al sole) e scuro; sfondo del DXF bianco, grigio o nero
• Intelligenza artificiale facoltativa con la tua chiave (Claude, ChatGPT, Gemini o Grok) per riconoscere gli elementi dalle foto

PRIVACY
I dati restano sul tuo dispositivo. Nessuna pubblicità, nessun tracciamento.

Assistenza: dierv@hotmail.it
```

## Novità di questa versione

`Prima versione di SopraLux.`

## Didascalie degli screenshot (sono già scritte nelle immagini)

1. Scrivi a mano sulla pianta – Come sulla carta: penna, colori e gomma. Il palmo non lascia segni.
2. Ogni locale, il suo stato – Stanze a colori: vedi subito cosa manca e cosa è già rilevato.
3. I simboli della tua legenda – Prese, comandi, luci e quadri con un tocco, dove servono.
4. Dal sopralluogo al computo – Esporta DXF per AutoCAD, CSV per Excel e uno ZIP con foto e note.
5. Tema scuro, DXF su fondo nero – Riposa gli occhi in interni e di sera, come in AutoCAD.

## Impostazioni proposte

| | App Store | Google Play |
|---|---|---|
| Categoria | Produttività (secondaria: Economia) | Produttività |
| Prezzo | Gratis | Gratis |
| Età | 4+ | PEGI 3 (nessun contenuto sensibile) |
| Pubblico | – | 18 anni e più (strumento professionale) |
| Pubblicità | – | No |
| Accesso | Nessun account necessario | Tutte le funzioni senza accesso |
| Dispositivi | Solo iPad (proposta) | Tablet e telefoni |
| Copyright | 2026 Davide Iervolino | – |
| Contatto | dierv@hotmail.it | dierv@hotmail.it |

## Dichiarazione dei dati

- **Dati raccolti dallo sviluppatore:** nessuno. Tutto resta sul dispositivo e non ci sono account, statistiche né pubblicità.
- **Unico caso particolare:** l'AI facoltativa. Se l'utente inserisce la propria chiave, la foto scelta va direttamente dal dispositivo al servizio scelto (Anthropic, OpenAI, Google o xAI), con connessione cifrata.
  - **Google («Sicurezza dei dati»):** si dichiara «Foto» come raccolta, facoltativa, per «Funzionalità dell'app», non condivisa, cifrata in transito. L'eliminazione non è applicabile: lo sviluppatore non conserva nulla.
  - **Apple («App Privacy»):** «Foto o video», non collegate all'identità, per «Funzionalità dell'app», nessun tracciamento.
  - È una scelta prudente. In alternativa si toglie l'AI dalla versione dello store e si dichiara «nessun dato raccolto».
- **Crittografia (Apple):** solo HTTPS di sistema, quindi esente. Nell'app c'è già `ITSAppUsesNonExemptEncryption = false`.
