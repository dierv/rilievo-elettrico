# Acquisti SopraLux: piani, sblocchi e store

Aggiornato il 15/11/2026. Prezzi e contenuti dei piani: «Versione vendibile – piano di lavoro» (progetto Claude «RILIEVI ELETTRICI»).

## Come funziona

- **Una sola app, gratis.** Dentro: Base (solo penna), sblocchi singoli pagati una volta, abbonamenti (Pro, Studio 3, Studio 10) che comprendono tutti gli sblocchi, pacchetti di memoria.
- **I blocchi valgono solo nell'app degli store.** `sorgenti/build_app.sh` scrive `LIC_ENFORCE = true`; nella versione installabile dal browser e in Claude è tutto aperto.
- **Chi decide che cosa è attivo:** `sorgenti/src/01b_lic.js` (`Lic.can('misura')`, `Lic.need('misura')`, schermata «Piani e sblocchi»).
- **Acquisti:** `sorgenti/src/native_acquisti.js`, plugin `@capgo/native-purchases` 8.9.16 (Play Billing 9.1 su Android, StoreKit 2 su iPad).
- **Per ora un acquisto vale per l'account dello store** (Apple o Google) del dispositivo: l'app chiede allo store che cosa è posseduto, all'avvio e quando torna in primo piano. L'ultimo stato letto resta sul dispositivo, quindi in cantiere senza rete gli sblocchi restano.
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
- Build di prova (`APP_CHANNEL=prova`): APK di prova e build iOS automatiche (a ogni modifica). Nella prima schermata c'è scritto «build di prova (non per lo store)».
- Build per lo store (`APP_CHANNEL=store`): workflow «App Android per Google Play»; per iOS il workflow «App iOS di prova (TestFlight)» **avviato a mano** con canale «store». In App Store Connect va scelta quella build.
- Su iPad l'interruttore funziona solo nell'ambiente di prova di Apple (TestFlight): una build di prova arrivata per errore nell'App Store non lo mostra.
- Nelle build per lo store Studio e memoria sono «In arrivo» e non si comprano (`LIC_SOON` in `01b_lic.js`).

## Prove automatiche

`python3 test/t45_acquisti.py` (dopo `npm ci` in `app/`): l'app nativa gira in Chrome con un Capacitor finto (`test/t45_capacitor_mock.js`) che simula archivio e store. Copre Base, sblocchi uno per uno, acquisti Android e iPad, stati (annullato, in attesa, già comprato, prodotto mancante, senza rete, scadenza), interruttore di prova, build per lo store, versione installabile e versione in Claude senza blocchi.

## Che cosa manca prima di vendere

1. **Acquisti sull'account SopraLux** (comprato su Android, vale sull'iPad): verifica delle ricevute sul server (Cloud Functions) e stato degli acquisti legato all'account. Per Google serve dare all'account di servizio delle funzioni l'accesso in Play Console; per Apple la firma delle transazioni si verifica senza chiavi.
2. **Cambio di piano su Android:** il plugin non passa a Google Play la sostituzione di un abbonamento con un altro. Oggi l'app spiega di disdire e riabbonarsi alla scadenza. Va risolto prima di vendere più piani su Android.
3. **Pro nell'app nativa:** sincronizzazione e archivio sul server (oggi ci sono solo nella versione installabile dal browser). Poi il limite di spazio e i pacchetti di memoria.
4. **Studio:** sopralluoghi condivisi.
5. **Notifiche degli store al server** (rinnovi, disdette, rimborsi).
6. **Condizioni d'uso proprie:** oggi su iPad il link porta al contratto standard di Apple; su Android c'è solo la privacy.
7. **Oggetti già presenti dopo una scadenza:** stanze e simboli esistenti restano modificabili; sono bloccati solo gli strumenti per crearne di nuovi.
8. Nelle schede degli store: dichiarare gli acquisti in-app (Play: «acquisti digitali: Sì» nel questionario dei contenuti; Apple: acquisti allegati alla versione 1.0 al primo invio).
