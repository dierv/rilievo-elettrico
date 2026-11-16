# Acquisti SopraLux: piani, sblocchi e store

Aggiornato il 16/11/2026. Prezzi e contenuti dei piani: «Versione vendibile – piano di lavoro» (progetto Claude «RILIEVI ELETTRICI»).

## Come funziona

- **Una sola app, gratis.** Dentro: Base (solo penna), sblocchi singoli pagati una volta, abbonamenti (Pro, Studio 3, Studio 10) che comprendono tutti gli sblocchi, pacchetti di memoria.
- **I blocchi valgono solo nell'app degli store.** `sorgenti/build_app.sh` scrive `LIC_ENFORCE = true`; nella versione installabile dal browser e in Claude è tutto aperto.
- **Chi decide che cosa è attivo:** `sorgenti/src/01b_lic.js` (`Lic.can('misura')`, `Lic.need('misura')`, schermata «Piani e sblocchi»).
- **Acquisti:** `sorgenti/src/native_acquisti.js`, plugin `@capgo/native-purchases` 8.9.16 (Play Billing 9.1 su Android, StoreKit 2 su iPad).
- **Un acquisto vale per l'account dello store** (Apple o Google) del dispositivo: l'app chiede allo store che cosa è posseduto, all'avvio e quando torna in primo piano. L'ultimo stato letto resta sul dispositivo, quindi in cantiere senza rete gli sblocchi restano.
- **E vale anche sull'account SopraLux** (dal 16/11, per ora gli acquisti fatti su iPad): vedi «Acquisti sull'account SopraLux» qui sotto.
- **Abbonamento scaduto:** i dati restano e si leggono, il backup resta gratis, gli sblocchi comprati restano.

### Che cosa sblocca che cosa

| Funzione dell'app | Si sblocca con |
|---|---|
| Penna nera, rossa, blu, tratto medio, gomma; tavole PDF, DXF, immagine; tavola in PNG o PDF; backup | Base (gratis) |
| Altri colori, colore a scelta, tratto sottile e spesso | Penne in più |
| «Segui come sono girato» | Bussola |
| Strumenti Misura e Scala | Misura |
| Strumento Nota audio | Note audio |
| Interruttore «colori» e sfondo grigio o nero delle tavole DXF | Colori del DXF |
| «Fotografa il disegno», raddrizzamento e scala dal formato del foglio | Tavola da foto |
| Strumento Foto | Foto sulla pianta |
| Stanze e Riquadro, simboli e libreria, controllo e chiusura, computo, esportazioni DXF/CSV/ZIP, AI | Abbonamento |

Ogni sblocco è compreso anche in «Tutti gli sblocchi» e in tutti gli abbonamenti.

## Acquisti sull'account SopraLux

Così uno sblocco o un abbonamento comprato su un dispositivo vale anche sull'altro tipo di dispositivo (iPad ↔ Android), e il server sa chi ha il Pro.

- **App** (`01b_lic.js`, `native_acquisti.js`): con l'accesso all'account fatto, dopo ogni lettura dello store (avvio, ritorno in primo piano, acquisto, ripristino) l'app chiama la funzione `verificaAcquisti` con le transazioni firmate dello store. Il server risponde con i prodotti attivi dell'account; l'app li somma a quelli dello store e tiene l'ultima risposta sul dispositivo (vale anche senza rete; gli abbonamenti fino alla scadenza). Senza accesso, o uscendo dall'account, valgono solo gli acquisti dello store del dispositivo. La chiamata si ripete solo se cambiano account o transazioni, o dopo 10 minuti.
- **Acquisti su iPad con l'accesso fatto:** l'app passa ad Apple il «gettone» dell'account (`appAccountToken`, UUID ricavato dall'uid, stessa formula nell'app e sul server), che Apple scrive nella transazione firmata.
- **Server** (`firebase/functions/acquisti.js`, regione europe-west1):
  - `verificaAcquisti` (funzione «callable», chiamata dall'app senza SDK, con il gettone di accesso di Firebase). Per Apple controlla ogni JWS di StoreKit 2 senza chiavi né chiamate ad Apple: catena di certificati fino ad «Apple Root CA - G3» (impronta SHA-256 fissata nel codice), estensioni di Apple per le ricevute, firma ES256, app `it.diervsoft.sopralux`, prodotto del catalogo.
  - `notificheApple`: App Store Server Notifications V2 (rinnovi, scadenze, rimborsi). Indirizzo `https://europe-west1-sopralux-64b29.cloudfunctions.net/notificheApple`, impostato il 16/11 in App Store Connect per produzione e prova (versione 2).
  - Firestore `acquistiStore/apple_<originalTransactionId>`: account (uid), prodotto, ambiente, scadenza, rimborso, data della firma. Solo il server scrive; i dispositivi non leggono (regole: tutto negato).
  - **Un acquisto appartiene a un solo account SopraLux:** al primo che lo registra. Passa a un altro account solo se è stato comprato da quell'account (gettone) o se il primo account non esiste più. Sul dispositivo con lo stesso account dello store vale comunque.
  - Account eliminato: gli acquisti restano senza account (`uid` vuoto) e si possono registrare di nuovo.
- **Acquisti dell'ambiente di prova di Apple** (TestFlight) contano come gli altri, segnati con `prova`: li fanno solo i tester.
- **Google Play:** la verifica dei gettoni di acquisto si aggiunge dopo il trasferimento dell'app all'account della SRL (serve l'accesso dell'account di servizio delle funzioni in Play Console). Fino ad allora gli acquisti fatti su Android valgono solo su Android; quelli fatti su iPad valgono anche su Android.
- **Pubblicazione delle funzioni:** in Cloud Shell `sh ~/rilievo-elettrico/firebase/pubblica_funzioni.sh` (aggiorna il codice, fa le prove, pubblica); controllo rapido: `sh ~/rilievo-elettrico/firebase/prova.sh`.
- **Prove:** `cd firebase/functions && npm test` (12, con una catena di certificati di prova creata con openssl) e la sezione 9 di `test/t45_acquisti.py`.

## Sincronizzazione e spazio sul server (Pro e Studio)

- **Sincronizzazione nell'app** (dal 16/11): gli stessi moduli della PWA (`pwa_cloud*.js`) sono nella build dell'app. Il collegamento al server parte solo con un piano (Pro o Studio) e l'accesso all'account (`PwaCloud.allowed()`); senza, i dati restano nell'archivio locale dell'account e nella cartella del dispositivo. Se il piano finisce la sincronizzazione si ferma e i dati restano. Provata sull'iPad il 16/11 (sopralluogo con tavola, 4 foto e nota audio arrivato sul server).
- **Spazio usato** (`firebase/functions/spazio.js`): la funzione `contaSpazio` somma i byte di ogni file caricato in `users/<uid>/` (una volta sola per file) in `spazio/<uid>`; i file già presenti al 16/11 sono stati contati con `prove/ricalcola_spazio.js`.
- **Limite:** 25 GB Pro, 100 GB Studio 3, 300 GB Studio 10, più i pacchetti di memoria (solo insieme a un piano). Lo scrive `verificaAcquisti` in `spazio/<uid>.limite` (e le notifiche di Apple quando cambia l'abbonamento) e lo restituisce all'app con lo spazio usato.
- **Nell'app:** la scheda dell'account mostra «Archivio sul server: X di Y». Oltre il limite i file nuovi non partono (il sopralluogo con le foto nuove resta in coda sul dispositivo, gli altri si sincronizzano) e lo stato lo dice; con più memoria l'invio riparte da solo.
- **Controllo sul server** (regole pubblicate il 16/11): sopralluoghi e copie si scrivono solo con un piano attivo (`spazio/<uid>.limite > 0`, scritto dal server) o con lo Studio a vita; i file (foto, tavole, audio) anche solo con spazio libero. Senza piano i dati sul server restano leggibili. Le regole di Storage leggono Firestore (permesso concesso a Storage alla pubblicazione). Prova negli emulatori: `sh firebase/prova_regole.sh` in Cloud Shell; pubblicazione: `sh firebase/pubblica_regole.sh`.
- **Studio a vita** (versione web e persone fidate): documento `regali/<email in minuscolo>`; vale per le regole, nell'app e per il limite (300 GB). Da Cloud Shell: `cd ~/rilievo-elettrico/firebase/functions && node prove/regalo.js aggiungi <email> [nota]` (oppure `togli`, `elenco`). Il server non distingue la versione web dall'app: un nuovo utente della versione web sincronizza solo dopo essere stato aggiunto (la versione web si sistemerà più avanti).
- Prova: `test/t47_sincronizzazione.py` (Firebase finto, due dispositivi, Base, Pro comprato dopo e scaduto, archivio pieno).

## Prodotti da creare negli store

Gli stessi 17 codici su Google Play e App Store. **Un codice non si può più cambiare né riusare dopo la creazione.**

| Codice | Tipo | Prezzo | Note |
|---|---|---|---|
| `sopralux_penne` | una volta | €0,99 | Penne in più |
| `sopralux_bussola` | una volta | €0,99 | Bussola |
| `sopralux_misura` | una volta | €0,99 | Misura |
| `sopralux_audio` | una volta | €0,99 | Note audio |
| `sopralux_dxf` | una volta | €0,99 | Colori del DXF |
| `sopralux_tavolafoto` | una volta | €1,99 | Tavola da foto |
| `sopralux_foto` | una volta | €2,99 | Foto sulla pianta |
| `sopralux_tutti` | una volta | €6,99 | Tutti gli sblocchi |
| `sopralux_pro_mese` | abbonamento, 1 mese | €14,99 | Pro; prova gratuita di 14 giorni |
| `sopralux_pro_anno` | abbonamento, 1 anno | €149,99 | Pro; prova gratuita di 14 giorni |
| `sopralux_studio3_mese` | abbonamento, 1 mese | €39,99 | Studio 3 |
| `sopralux_studio3_anno` | abbonamento, 1 anno | €399,99 | Studio 3 |
| `sopralux_studio10_mese` | abbonamento, 1 mese | €109,99 | Studio 10 |
| `sopralux_studio10_anno` | abbonamento, 1 anno | €1.099,99 | Studio 10 |
| `sopralux_mem50` | abbonamento, 1 mese | €2,99 | +50 GB |
| `sopralux_mem200` | abbonamento, 1 mese | €9,99 | +200 GB |
| `sopralux_mem500` | abbonamento, 1 mese | €19,99 | +500 GB |

**App Store Connect**
- Sblocchi: acquisti in-app di tipo «Non consumabile».
- Abbonamenti dei piani: un solo gruppo («SopraLux – Piani»), livelli dall'alto: Studio 10, Studio 3, Pro (mensile e annuale sullo stesso livello). Con un solo gruppo il cambio di piano lo gestisce l'App Store.
- Memoria: un secondo gruppo («SopraLux – Memoria»), livelli dall'alto: +500, +200, +50 GB.
- Prova gratuita: «offerta introduttiva» gratuita di 2 settimane su `sopralux_pro_mese` e `sopralux_pro_anno`.

**Play Console**
- Sblocchi: prodotti singoli, non consumabili (in inglese «One-time products»).
- Abbonamenti: un prodotto per codice, ognuno con **un piano base di nome `base`** a rinnovo automatico (1 mese o 1 anno).
- Prova gratuita: sui due prodotti del Pro un'offerta (per esempio `prova14`) con 14 giorni gratis, idoneità «nuovi clienti: non ha mai avuto nessun abbonamento». L'app la usa da sola quando Play la propone.
- **Prezzi:** il prezzo scritto in «Modifica collettivamente i prezzi» / «Imposta prezzo» è **senza IVA**: Play aggiunge l'IVA di ogni paese. Per avere €0,99 in Italia si scrive 0,81 (= 0,99 / 1,22). Prezzi netti usati: 0,81 · 1,63 · 2,45 · 5,73 · 12,29 (Pro mese) · 122,94 (Pro anno).

**Stato su App Store Connect (15/11/2026, sera)**
- Accordo per le app a pagamento attivo.
- Creati: gli 8 sblocchi (non consumabili) e il gruppo «SopraLux Pro» con `sopralux_pro_mese` e `sopralux_pro_anno` (livello 1, prova gratuita di 2 settimane per i nuovi abbonati in tutti i paesi). Paese di base Italia: €0,99, €1,99, €2,99, €6,99, €14,99, €149,99 (su Apple i prezzi UE comprendono l'IVA). Disponibili in tutti i 175 paesi, testo in italiano.
- Stato «Metadati mancanti»: manca lo screenshot per la verifica (serve solo per l'invio ad Apple, non per le prove da TestFlight).
- Creati con le chiamate che usa la pagina di App Store Connect (`/iris/v1`, `/iris/v2`), dal browser con il tuo accesso: nessuna chiave salvata.

**Stato su Google Play (15/11/2026, sera)**
- Creati e attivi: gli 8 prodotti a pagamento singolo (opzione di acquisto `acquisto`, compatibile con le versioni precedenti) e i 2 abbonamenti Pro (piano base `base`, offerta `prova14` di 14 giorni). Prezzi in Italia controllati: €0,99, €1,99, €2,99, €6,99, €14,99, €149,99.
- **Provati sul tablet (15/11, sera), con la carta di prova:** acquisto di sblocchi e abbonamento Pro funzionano. I prodotti appena creati sono comparsi nell'app solo dopo 1-3 ore (prima: «Prezzi di Google Play non disponibili»).
- Non ancora creati: Studio 3, Studio 10 e i pacchetti di memoria (nell'app sono «In arrivo»).
- Test interno: release 3 (1.0) pubblicata il 15/11; tester = elenco «Tester delle licenze».
- Firebase: aggiunta l'impronta SHA-1 della chiave di firma di Play (`9F:28:3D:…:C6:D9`) all'app Android, per «Accedi con Google» nella versione scaricata da Play.

## Come si provano gli acquisti veri (senza pagare)

**Android**
1. Profilo pagamenti collegato all'account sviluppatore.
2. Una versione dell'app con il plugin degli acquisti pubblicata almeno nel test interno (workflow «App Android per Google Play», poi caricamento dell'AAB).
3. Prodotti creati e attivi.
4. Il proprio account Google fra i tester delle licenze (in inglese Settings → License testing) e fra i tester del test interno.
5. Acquisto dall'app: compaiono le carte di prova. Va bene anche l'APK di prova, purché l'account Google del tablet sia un tester delle licenze.

**iPad**
1. Accordo per le app a pagamento («Paid Apps Agreement») attivo, con banca e dati fiscali, nella sezione degli accordi di App Store Connect.
2. Prodotti creati con prezzo e testo, anche solo in stato «Pronto per l'invio».
3. Acquisto dall'app installata con TestFlight: è gratuito, nell'ambiente di prova di Apple. Gli abbonamenti si rinnovano una volta al giorno, fino a 6 volte.

Fonti: [Android Developers – Test your Google Play Billing Library integration](https://developer.android.com/google/play/billing/test), [Android Developers – Getting ready](https://developer.android.com/google/play/billing/getting-ready), [Play Console Help – licenze di prova](https://support.google.com/googleplay/android-developer/answer/6062777), [App Store Connect Help – Subscription renewal rate in TestFlight](https://developer.apple.com/help/app-store-connect/test-a-beta-version/subscription-renewal-rate-in-testflight), [WWDC23 – Explore testing in-app purchases](https://developer.apple.com/videos/play/wwdc2023/10142).

## Interruttore di prova

- In «Piani e sblocchi», nelle sole build di prova, ogni prodotto ha il tasto **Prova**: accende l'acquisto senza passare dallo store. Vale solo su quel dispositivo; «Azzera le prove» riporta alla Base.
- Build di prova (`APP_CHANNEL=prova`): l'APK di prova (a ogni modifica) e le build iOS avviate a mano con canale «prova». Nella prima schermata c'è scritto «build di prova (non per lo store)».
- Build per lo store (`APP_CHANNEL=store`): workflow «App Android per Google Play» e, dal 15/11 sera, **tutte le build iOS automatiche** (da TestFlight gli acquisti veri sono già gratuiti, i tasti «Prova» non servono).
- Su iPad l'interruttore funziona solo nell'ambiente di prova di Apple (TestFlight): una build di prova arrivata per errore nell'App Store non lo mostra.
- Nelle build per lo store Studio e memoria sono «In arrivo» e non si comprano (`LIC_SOON` in `01b_lic.js`).

## Prove automatiche

`python3 test/t45_acquisti.py` (dopo `npm ci` in `app/`): l'app nativa gira in Chrome con un Capacitor finto (`test/t45_capacitor_mock.js`) che simula archivio e store. Copre Base, sblocchi uno per uno, acquisti Android e iPad, stati (annullato, in attesa, già comprato, prodotto mancante, senza rete, scadenza), interruttore di prova, build per lo store, versione installabile e versione in Claude senza blocchi.

## Che cosa manca prima di vendere

1. **Acquisti sull'account SopraLux:** fatto per Apple (16/11). Manca Google Play: verifica dei gettoni di acquisto con l'API di Google Play (account di servizio delle funzioni con accesso in Play Console), da fare dopo il trasferimento dell'app all'account della SRL.
2. **Cambio di piano su Android:** il plugin non passa a Google Play la sostituzione di un abbonamento con un altro. Oggi l'app spiega di disdire e riabbonarsi alla scadenza. Va risolto prima di vendere più piani su Android.
3. **Pro nell'app nativa:** sincronizzazione, conteggio dello spazio e controllo sul server fatti (16/11). Mancano i pacchetti di memoria in vendita.
4. **Studio:** sopralluoghi condivisi.
5. **Notifiche degli store al server** (rinnovi, disdette, rimborsi): Apple fatto (16/11); Google Play (notifiche in tempo reale con Pub/Sub) insieme al punto 1.
6. **Condizioni d'uso proprie:** oggi su iPad il link porta al contratto standard di Apple; su Android c'è solo la privacy.
7. **Oggetti già presenti dopo una scadenza:** stanze e simboli esistenti restano modificabili; sono bloccati solo gli strumenti per crearne di nuovi.
8. Nelle schede degli store: dichiarare gli acquisti in-app (Play: «acquisti digitali: Sì» nel questionario dei contenuti; Apple: acquisti allegati alla versione 1.0 al primo invio).
