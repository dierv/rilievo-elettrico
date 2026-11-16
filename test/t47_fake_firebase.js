// Firebase finto per le prove nel browser (t47_sincronizzazione.py): prende il posto di lib/firebase.js (window.FB).
// Account già aperto, Firestore e Storage in memoria con le stesse funzioni usate da pwa_firebase.js e pwa_cloud_backend.js.
// Configurazione da window.__FB (messa dalla prova prima del caricamento):
//   user:   uid dell'account aperto, oppure null
//   server: stato del server di un altro «dispositivo» (JSON di window.__srv), per provare il passaggio fra dispositivi
(() => {
  const cfg = window.__FB || {};
  const srv = window.__srv = { docs: {}, files: {}, writes: 0, uploads: 0 };
  if (cfg.server) Object.assign(srv, JSON.parse(cfg.server));
  const clone = v => JSON.parse(JSON.stringify(v));
  const user = cfg.user ? { uid: cfg.user, email: cfg.user + '@prova.it', displayName: cfg.user, providerData: [{ providerId: 'google.com', email: cfg.user + '@prova.it' }], getIdToken: async () => 'tok-' + cfg.user } : null;
  const auth = { currentUser: user, languageCode: 'it' };
  const TS = { __serverTimestamp: true };
  const out = v => { // dal formato salvato a quello di Firestore (date con toMillis)
    if (Array.isArray(v)) return v.map(out);
    if (v && typeof v === 'object') { if (typeof v.__ts === 'number') { const n = v.__ts; return { toMillis: () => n }; } return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, out(x)])); }
    return v;
  };
  const inn = v => (v && v.__serverTimestamp ? { __ts: Date.now() } : Array.isArray(v) ? v.map(inn) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, inn(x)])) : v);
  class Snap { constructor(path, data) { this.ref = { path }; this.id = path.split('/').pop(); this._d = data; } exists() { return this._d != null; } data() { return this._d == null ? undefined : out(clone(this._d)); } }
  const listeners = new Set();
  const notify = () => { for (const l of [...listeners]) setTimeout(() => l.fire(), 5); };
  const err = (code, message) => Object.assign(new Error(message || code), { code });
  const b64 = async blob => { const a = new Uint8Array(await blob.arrayBuffer()); let s = ''; for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); };
  const unb64 = s => { const b = atob(s), a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; };
  class GoogleAuthProvider { setCustomParameters() { } }
  class OAuthProvider { constructor(id) { this.providerId = id; } addScope() { } setCustomParameters() { } credential(o) { return o; } }
  GoogleAuthProvider.credential = (idToken, accessToken) => ({ idToken, accessToken });
  window.FB = {
    initializeApp: (c, name) => ({ name, options: c }), getApps: () => [],
    getAuth: () => auth, GoogleAuthProvider, OAuthProvider,
    onAuthStateChanged(a, next) { setTimeout(() => next(auth.currentUser), 20); return () => { }; },
    signInWithPopup: async () => { throw err('auth/operation-not-supported-in-this-environment'); },
    signInWithCredential: async () => ({ user: auth.currentUser }), signOut: async () => { auth.currentUser = null; },
    linkWithPopup: async () => ({}), linkWithCredential: async () => ({}), unlink: async () => ({}), reauthenticateWithPopup: async () => ({}), deleteUser: async () => { }, revokeAccessToken: async () => { },
    getFirestore: () => ({}), serverTimestamp: () => TS,
    doc: (db, ...p) => ({ path: p.join('/'), id: p[p.length - 1] }),
    collection: (db, ...p) => ({ path: p.join('/') }),
    getDocFromServer: async r => { if (!navigator.onLine) throw err('unavailable'); return new Snap(r.path, srv.docs[r.path]); },
    onSnapshot(col, opts, next, onErr) {
      const l = { fire: () => { const docs = Object.keys(srv.docs).filter(p => p.startsWith(col.path + '/') && p.split('/').length === col.path.split('/').length + 1).map(p => new Snap(p, srv.docs[p])); next({ docs, metadata: { fromCache: false, hasPendingWrites: false } }); } };
      listeners.add(l); setTimeout(() => l.fire(), 10); return () => listeners.delete(l);
    },
    async runTransaction(db, fn) {
      const sets = [];
      const r = await fn({ get: async ref => new Snap(ref.path, srv.docs[ref.path]), set: (ref, data) => { sets.push([ref, data]); } });
      for (const [ref, data] of sets) { srv.docs[ref.path] = inn(data); srv.writes++; }
      if (sets.length) notify();
      return r;
    },
    getStorage: () => ({}),
    ref: (st, path) => ({ fullPath: path }),
    async getMetadata(r) { const f = srv.files[r.fullPath]; if (!f) throw err('storage/object-not-found'); return { size: f.size, contentType: f.type, customMetadata: clone(f.meta) }; },
    async uploadBytes(r, blob, meta) {
      if (srv.files[r.fullPath]) throw err('storage/unauthorized');
      srv.files[r.fullPath] = { b64: await b64(blob), size: blob.size, type: meta.contentType, meta: clone(meta.customMetadata || {}) }; srv.uploads++;
      return { metadata: {} };
    },
    async getBlob(r) { const f = srv.files[r.fullPath]; if (!f) throw err('storage/object-not-found'); return new Blob([unb64(f.b64)], { type: f.type }); },
  };
})();
