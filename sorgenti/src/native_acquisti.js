/* ============ ACQUISTI NEGLI STORE (Google Play e App Store) ============ */
// Plugin @capgo/native-purchases (Play Billing su Android, StoreKit 2 su iPad). Questo file si carica solo nell'app nativa.
// Dà a Lic (01b_lic.js): prezzi dei prodotti, acquisto, ripristino, elenco di quello che è posseduto su questo dispositivo.
// Gli acquisti qui valgono per l'account dello store (Apple o Google) del dispositivo; il passaggio sull'account
// SopraLux, con la verifica sul server, è il passo successivo (docs/ACQUISTI.md).
const LicStore = (() => {
  let plugin; // undefined = non ancora cercato; null = non c'è
  const cap = () => window.Capacitor;
  const plug = () => {
    if (plugin !== undefined) return plugin;
    plugin = null;
    try {
      const C = cap(), reg = (window.capacitorExports && window.capacitorExports.registerPlugin) || (C && C.registerPlugin);
      if (C && C.isNativePlatform && C.isNativePlatform() && reg && (!C.isPluginAvailable || C.isPluginAvailable('NativePurchases'))) plugin = reg('NativePurchases');
    } catch (e) { plugin = null; }
    return plugin;
  };
  const platform = () => { try { return cap().getPlatform(); } catch (e) { return 'web'; } };
  const DAYS = [1, 7, 30, 365]; // unità del periodo: giorno, settimana, mese, anno
  const trialDays = d => { // offerta introduttiva gratuita -> giorni di prova
    if (!d || d.price !== 0) return 0;
    const sp = d.subscriptionPeriod || {}; return (sp.numberOfUnits || 0) * (DAYS[sp.unit] || 0) * Math.max(1, d.numberOfPeriods || 1);
  };

  return {
    ok: () => !!plug(),
    platform,
    // Prezzi e offerte dallo store: { codice prodotto: { price, trial (giorni), plan e token (solo Android, abbonamenti) } }.
    // I prodotti che lo store non conosce (non ancora creati o non attivi) mancano dal risultato.
    async products(skus) {
      const p = plug(), out = {}; const ids = k => skus.filter(s => s.kind === k).map(s => s.pid);
      if (platform() === 'ios') {
        const r = await p.getProducts({ productIdentifiers: skus.map(s => s.pid) });
        for (const x of (r && r.products) || []) out[x.identifier] = { price: x.priceString, trial: x.introEligibility === 2 ? trialDays(x.introductoryPrice) : 0 };
        return out;
      }
      // Android: una richiesta per tipo, indipendenti (un errore negli abbonamenti non fa perdere gli sblocchi).
      // Se non trova nessun prodotto il plugin risponde «Product not found»: il motivo resta in lastErr per la schermata.
      const errs = []; let hard = null;
      const ask = async (k, fn) => { if (!ids(k).length) return; try { fn(await p.getProducts({ productIdentifiers: ids(k), productType: k })); }
        catch (e) { const m = (e && e.message) || String(e); errs.push(k + ': ' + m + (e && e.code ? ' [' + e.code + ']' : '')); if (!/not found/i.test(m)) hard = e; } };
      await ask('inapp', r => { for (const x of (r && r.products) || []) if (!out[x.identifier]) out[x.identifier] = { price: x.priceString }; });
      await ask('subs', r => {
        for (const x of (r && r.products) || []) { // una voce per il piano base e una per ogni offerta a cui l'utente ha diritto
          const o = out[x.planIdentifier] = out[x.planIdentifier] || {};
          if (x.offerId == null) { o.price = x.priceString; o.plan = x.identifier; }
          else { const d = trialDays(x.introductoryPrice); if (d && !o.trial) { o.trial = d; o.token = x.offerToken; o.plan = o.plan || x.identifier; } }
        }
        for (const k of Object.keys(out)) if (!out[k].price) delete out[k]; // offerta senza il suo piano base: non si mostra
      });
      if (!Object.keys(out).length) { // per capire il motivo: Google Play risponde? da quale paese?
        const t = (pr, ms) => Promise.race([pr, new Promise(r => setTimeout(() => r(null), ms))]);
        try { const b = await t(p.isBillingSupported(), 8000); errs.push('billing: ' + (b ? (b.isBillingSupported ? 'sì' : 'no') : '?')); } catch (e) { }
        try { const c = await t(p.getStorefront(), 8000); errs.push('paese: ' + ((c && c.countryCode) || '?')); } catch (e) { }
      }
      this.lastErr = errs.join(' · ');
      if (hard && !Object.keys(out).length) throw hard;
      return out;
    },
    // Prodotti posseduti adesso su questo dispositivo (sblocchi e abbonamenti attivi)
    async owned() {
      const p = plug(), ios = platform() === 'ios', ids = [];
      const r = await p.getPurchases(ios ? { onlyCurrentEntitlements: true } : {});
      for (const t of (r && r.purchases) || []) {
        if (!t || !t.productIdentifier) continue;
        if (!ios && String(t.purchaseState) !== '1') continue; // pagamento ancora in attesa
        if (t.revocationDate || t.isActive === false || t.subscriptionState === 'expired' || t.subscriptionState === 'revoked') continue;
        if (!ids.includes(t.productIdentifier)) ids.push(t.productIdentifier);
      }
      return ids;
    },
    async buy(sku, info) {
      const p = plug(), o = { productIdentifier: sku.pid, productType: sku.kind, quantity: 1 };
      if (platform() === 'android' && sku.kind === 'subs') {
        // i gettoni delle offerte scadono: si rileggono subito prima dell'acquisto
        let i = info; try { i = (await this.products([sku]))[sku.pid] || info; } catch (e) { }
        if (!i || !i.plan) throw { code: 'PRODUCT_MISSING', message: 'prodotto non trovato' };
        o.planIdentifier = i.plan; if (i.token) o.offerToken = i.token; // con la prova gratuita, se spetta
      }
      return p.purchaseProduct(o);
    },
    async restore() { return plug().restorePurchases(); },
    async manage() { return plug().manageSubscriptions(); },
    // iPad: true nell'ambiente di prova di Apple (TestFlight e verifica dell'app), false nell'App Store, null se non si riesce a saperlo
    // (per esempio iPadOS 15, dove questa informazione non c'è). Android: non serve.
    async sandbox() {
      if (platform() !== 'ios') return true;
      try { const r = await plug().getAppTransaction(); const env = r && r.appTransaction && r.appTransaction.environment; return env === 'Sandbox' || env === 'Xcode' ? true : env === 'Production' ? false : null; }
      catch (e) { return null; }
    },
    onChange(fn) { // rinnovi, rimborsi, acquisti approvati più tardi (iPad) e ritorno dell'app in primo piano
      const p = plug(); if (!p) return; let last = 0; const go = () => { if (Date.now() - last < 30000) return; last = Date.now(); fn(); };
      try { p.addListener('transactionUpdated', () => { last = 0; go(); }); } catch (e) { }
      document.addEventListener('visibilitychange', () => { if (!document.hidden) go(); });
    },
    errKind(e) { // tipo di errore di un acquisto
      const c = String((e && e.code) || ''), m = String((e && e.message) || e || '');
      if (c === 'USER_CANCELED' || /cancel/i.test(m)) return 'cancel';
      if (c === 'ITEM_ALREADY_OWNED' || /already owned/i.test(m)) return 'owned';
      if (/pending/i.test(m)) return 'pending';
      if (c === 'PRODUCT_MISSING' || c === 'ITEM_UNAVAILABLE' || /not found|cannot find product|no .*offer/i.test(m)) return 'missing';
      return 'error';
    },
  };
})();
