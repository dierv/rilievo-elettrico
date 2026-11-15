// Capacitor finto per le prove dell'app nativa nel browser (t45_acquisti.py): prende il posto di lib/capacitor.js.
// La configurazione arriva da window.__CAP (messa dalla prova prima del caricamento):
//   platform: 'android' | 'ios' | 'web'
//   store:    null (nessun plugin acquisti) oppure { products: [...], owned: [...], restorable: [...], env: 'Sandbox'|'Production',
//             buy: 'ok'|'cancel'|'pending'|'owned', failOwned: bool }   (oggetti come li restituisce @capgo/native-purchases)
(() => {
  const cfg = window.__CAP || {}; const platform = cfg.platform || 'android'; const st = cfg.store || null;
  const files = new Map(), dirs = new Set(['']); const calls = window.__calls = []; const listeners = window.__listeners = {};
  window.__fs = files;
  const dirOf = p => p.split('/').slice(0, -1).join('/');
  const mk = p => { const parts = p.split('/'); for (let i = 1; i <= parts.length; i++) dirs.add(parts.slice(0, i).join('/')); };
  const Filesystem = {
    async requestPermissions() { return { publicStorage: 'granted' }; },
    async mkdir({ path }) { mk(path); },
    async stat({ path }) { if (dirs.has(path)) return { type: 'directory' }; if (files.has(path)) return { type: 'file', size: files.get(path).length }; throw new Error('File does not exist'); },
    async readdir({ path }) {
      if (!dirs.has(path)) throw new Error('Directory does not exist'); const out = [];
      for (const d of dirs) if (d && dirOf(d) === path) out.push({ name: d.split('/').pop(), type: 'directory' });
      for (const f of files.keys()) if (dirOf(f) === path) out.push({ name: f.split('/').pop(), type: 'file' });
      return { files: out };
    },
    async readFile({ path }) { if (!files.has(path)) throw new Error('File does not exist'); return { data: files.get(path) }; },
    async writeFile({ path, data, recursive }) { if (recursive) mk(dirOf(path)); files.set(path, data); return { uri: 'file:///' + path }; },
    async deleteFile({ path }) { if (!files.delete(path)) throw new Error('File does not exist'); },
    async getUri({ path }) { return { uri: 'file:///' + path }; },
  };
  const App = { addListener(ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); return Promise.resolve({ remove() { } }); }, minimizeApp() { } };
  const plugins = { Filesystem, Share: { async share(o) { calls.push(['share', o]); } }, App };

  if (st) {
    st.owned = st.owned || []; let n = 0;
    const tx = (pid, type) => platform === 'ios'
      ? { transactionId: String(2000000000000000 + (++n)), productIdentifier: pid, purchaseDate: new Date().toISOString(), productType: type, isActive: type === 'subs' ? true : undefined, subscriptionState: type === 'subs' ? 'subscribed' : undefined, environment: st.env || 'Sandbox', willCancel: null, jwsRepresentation: 'jws.' + pid }
      : { transactionId: 'tok_' + (++n), purchaseToken: 'tok_' + n, productIdentifier: pid, purchaseDate: new Date().toISOString(), productType: type, purchaseState: '1', isAcknowledged: true, orderId: 'GPA.0000-' + n, willCancel: null };
    const fail = (message, code) => { const e = new Error(message); if (code) e.code = code; return Promise.reject(e); };
    plugins.NativePurchases = {
      async isBillingSupported() { return { isBillingSupported: true }; },
      getProducts(o) {
        calls.push(['getProducts', o]); const ids = o.productIdentifiers || [];
        if (st.failProducts) return fail('store non raggiungibile');
        if (platform === 'ios') return Promise.resolve({ products: st.products.filter(p => ids.includes(p.identifier)) });
        const type = o.productType || 'inapp';
        const out = st.products.filter(p => (p._type || 'inapp') === type && ids.includes(type === 'subs' ? p.planIdentifier : p.identifier));
        return out.length ? Promise.resolve({ products: out }) : fail('Product not found');
      },
      getPurchases(o) { calls.push(['getPurchases', o || {}]); return st.failOwned ? fail('Failed to query purchases: SERVICE_UNAVAILABLE', 'QUERY_PURCHASES_FAILED') : Promise.resolve({ purchases: st.owned.slice() }); },
      purchaseProduct(o) {
        calls.push(['purchaseProduct', o]);
        if (st.buy === 'cancel') return platform === 'ios' ? fail('User cancelled') : fail('Purchase canceled by user', 'USER_CANCELED');
        if (st.buy === 'pending') return fail('Transaction pending');
        if (st.buy === 'owned') { st.owned.push(tx(o.productIdentifier, o.productType)); return fail('Item already owned', 'ITEM_ALREADY_OWNED'); }
        if (platform === 'android' && o.productType === 'subs' && !o.planIdentifier && !o.offerToken) return fail('planIdentifier cannot be empty if productType is subs unless offerToken is provided');
        const grp = pid => (st.products.find(p => p.identifier === pid) || {}).subscriptionGroupIdentifier || null;
        if (platform === 'ios' && grp(o.productIdentifier)) st.owned = st.owned.filter(t => grp(t.productIdentifier) !== grp(o.productIdentifier)); // stesso gruppo di abbonamenti: il nuovo prende il posto del vecchio
        const t = tx(o.productIdentifier, o.productType); st.owned.push(t); return Promise.resolve(t);
      },
      restorePurchases() { calls.push(['restorePurchases']); for (const t of st.restorable || []) st.owned.push(t); st.restorable = []; return Promise.resolve(); },
      manageSubscriptions() { calls.push(['manageSubscriptions']); return Promise.resolve(); },
      getAppTransaction() { return platform === 'ios' ? Promise.resolve({ appTransaction: { environment: st.env || 'Sandbox', originalAppVersion: '1' } }) : fail('not on android'); },
      addListener(ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); return Promise.resolve({ remove() { } }); },
    };
    window.__store = st; window.__tx = tx;
  }
  const reg = n => plugins[n] || null;
  window.Capacitor = { isNativePlatform: () => platform !== 'web', getPlatform: () => platform, registerPlugin: reg, isPluginAvailable: n => !!plugins[n], Plugins: plugins };
  window.capacitorExports = { registerPlugin: reg, SystemBars: { setStyle: async () => { } } };
})();
