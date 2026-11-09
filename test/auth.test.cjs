'use strict';

// Test offline dell'integrazione: nessun accesso a Firebase o a dati di rilievo reali.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'sorgenti/src/pwa_firebase.js'), 'utf8');

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

function setup(options = {}) {
  const calls = { app: 0, auth: 0, subscribe: 0, popup: 0, signOut: 0, toasts: [] };
  const auth = { currentUser: null };
  const els = new Map();
  const panel = { innerHTML: '', querySelector: selector => els.get(selector) || null };
  els.set('#pwaAccount', panel);
  els.set('#fbSignIn', { disabled: false, onclick: null });
  els.set('#fbSignOut', { disabled: false, onclick: null });
  let next, error;
  const sdk = {
    getApps: () => [],
    initializeApp: () => { calls.app++; return { name: '[DEFAULT]' }; },
    getAuth: () => { calls.auth++; if (options.initError) throw options.initError; return auth; },
    GoogleAuthProvider: class {
      setCustomParameters(params) { this.params = params; }
    },
    onAuthStateChanged: (_, onNext, onError) => {
      calls.subscribe++; next = onNext; error = onError; return () => {};
    },
    signInWithPopup: () => {
      calls.popup++;
      return options.popup ? options.popup() : Promise.resolve({ user: { uid: 'account-a', email: 'a@example.test' } });
    },
    signOut: () => {
      calls.signOut++;
      return options.signOut ? options.signOut() : Promise.resolve();
    },
  };
  const noLocalWrite = () => { throw new Error('Il login non deve modificare i dati locali'); };
  const cap = Object.freeze({ uid: null, user: null, db: null, assets: null });
  const state = Object.freeze({ sv: Object.freeze({ id: 'local-survey' }), surveys: Object.freeze([{ id: 'local-survey' }]) });
  const browserWindow = { addEventListener() {} };
  if (!options.missingSdk) browserWindow.FB = sdk;
  const ctx = vm.createContext({
    window: browserWindow,
    navigator: { onLine: options.online !== false },
    location: { hostname: 'dierv.github.io', protocol: 'https:' },
    document: {
      querySelector: selector => els.get(selector) || null,
      getElementById: id => els.get('#' + id) || null,
    },
    $: selector => els.get(selector) || null,
    esc: value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]),
    toast: (...args) => calls.toasts.push(args),
    console: { warn() {}, error() {}, log() {} },
    setTimeout, clearTimeout,
    CAP: cap, S: state,
    IDB: { put: noLocalWrite, del: noLocalWrite, open: noLocalWrite, get: noLocalWrite, all: noLocalWrite },
    Archive: { kick: noLocalWrite, init: noLocalWrite },
    Sync: { mark: noLocalWrite, flush: noLocalWrite },
    renderHome: () => { throw new Error('Il login non deve cambiare la schermata aperta'); },
    PLATFORM: 'pwa',
    FIREBASE_CONFIG: { projectId: 'auth-test' },
  });
  vm.runInContext('"use strict";\n' + source + '\n;globalThis.account = FirebaseAccount;', ctx);
  const account = ctx.account;
  return {
    account, auth, sdk, calls, panel, els, ctx,
    emit(user) { auth.currentUser = user; assert.equal(typeof next, 'function'); next(user); },
    fail(err) { assert.equal(typeof error, 'function'); error(err); },
    localUnchanged() {
      assert.equal(ctx.CAP, cap);
      assert.equal(ctx.CAP.uid, null);
      assert.equal(ctx.S, state);
      assert.equal(ctx.S.sv.id, 'local-survey');
    },
  };
}

test('SDK non disponibile: l’avvio locale rimane possibile', () => {
  const h = setup({ missingSdk: true });
  assert.doesNotThrow(() => h.account.init());
  assert.equal(h.calls.auth, 0);
  assert.equal(h.calls.subscribe, 0);
  assert.match(h.account.html(), /locale|dispositivo|tablet/i);
  h.localUnchanged();
});

test('Errore di inizializzazione: nessuna modifica all’archivio locale', () => {
  const h = setup({ initError: { code: 'auth/invalid-api-key' } });
  assert.doesNotThrow(() => h.account.init());
  assert.ok(h.account.error);
  assert.equal(h.calls.subscribe, 0);
  h.localUnchanged();
});

test('Il ripristino della sessione non blocca init e non cambia schermata', () => {
  const h = setup();
  h.account.init();
  assert.equal(h.calls.subscribe, 1);
  assert.equal(h.account.ready, false);
  assert.equal(h.auth.languageCode, 'it');
  h.emit({ uid: 'account-a', displayName: 'Mario', email: 'mario@example.test' });
  assert.equal(h.account.ready, true);
  assert.equal(h.account.user.uid, 'account-a');
  assert.match(h.account.html(), /mario@example\.test/);
  h.localUnchanged();
});

test('L’identità visualizzata viene escapata come testo', () => {
  const h = setup(); h.account.init();
  h.emit({ uid: 'account-a', displayName: '<script>bad()</script>', email: '<img src=x onerror=bad()>' });
  const html = h.account.html();
  assert.doesNotMatch(html, /<script>|<img src=x/);
  assert.match(html, /&lt;/);
});

test('Il popup parte dal click e i click ripetuti non lo duplicano', async () => {
  const work = deferred();
  const h = setup({ popup: () => work.promise }); h.account.init(); h.emit(null);
  const first = h.account.signIn();
  assert.equal(h.calls.popup, 1, 'Il popup deve partire prima di altre attese');
  const second = h.account.signIn();
  assert.equal(h.calls.popup, 1);
  work.resolve({ user: { uid: 'account-a', email: 'a@example.test' } });
  h.emit({ uid: 'account-a', email: 'a@example.test' });
  await Promise.all([first, second]);
  assert.equal(h.account.user.uid, 'account-a');
  assert.equal(h.account.busy, null);
  h.localUnchanged();
});

test('Popup annullato: si resta in locale e si può ritentare', async () => {
  const h = setup({ popup: () => Promise.reject({ code: 'auth/popup-closed-by-user' }) });
  h.account.init(); h.emit(null);
  await h.account.signIn();
  assert.equal(h.account.user, null);
  assert.equal(h.account.busy, null);
  await h.account.signIn();
  assert.equal(h.calls.popup, 2);
  h.localUnchanged();
});

test('Popup bloccato: messaggio utile e nessun redirect automatico', async () => {
  const h = setup({ popup: () => Promise.reject({ code: 'auth/popup-blocked' }) });
  h.account.init(); h.emit(null);
  await h.account.signIn();
  assert.match(h.account.error, /popup|finestr/i);
  assert.equal(h.account.busy, null);
  h.localUnchanged();
});

test('Offline: il login non avvia richieste e non blocca il rilievo', async () => {
  const h = setup({ online: false }); h.account.init(); h.emit(null);
  await h.account.signIn();
  assert.equal(h.calls.popup, 0);
  assert.match(h.account.error, /offline|rete|connessione/i);
  h.localUnchanged();
});

test('Logout: l’account viene tolto senza cancellare i dati del dispositivo', async () => {
  const h = setup(); h.account.init();
  h.emit({ uid: 'account-a', email: 'a@example.test' });
  await h.account.signOut();
  h.emit(null);
  assert.equal(h.calls.signOut, 1);
  assert.equal(h.account.user, null);
  assert.equal(h.account.busy, null);
  h.localUnchanged();
});

test('Logout fallito: l’account resta visibile e si può riprovare', async () => {
  const h = setup({ signOut: () => Promise.reject({ code: 'auth/network-request-failed' }) });
  h.account.init(); h.emit({ uid: 'account-a', email: 'a@example.test' });
  await h.account.signOut();
  assert.equal(h.account.user.uid, 'account-a');
  assert.equal(h.account.busy, null);
  assert.ok(h.account.error);
  h.localUnchanged();
});

test('Il cambio account non cambia i percorsi né i sopralluoghi locali', () => {
  const h = setup(); h.account.init();
  h.emit({ uid: 'account-a', email: 'a@example.test' });
  h.emit(null);
  h.emit({ uid: 'account-b', email: 'b@example.test' });
  assert.equal(h.account.user.uid, 'account-b');
  h.localUnchanged();
});

test('Un popup concluso in ritardo non ripristina una sessione già uscita', async () => {
  const work = deferred();
  const h = setup({ popup: () => work.promise }); h.account.init(); h.emit(null);
  const signingIn = h.account.signIn();
  const user = { uid: 'account-a', email: 'a@example.test' };
  h.emit(user);
  h.emit(null); // Uscita effettuata da un'altra scheda mentre il popup si chiude.
  work.resolve({ user });
  await signingIn;
  assert.equal(h.account.user, null);
  h.localUnchanged();
});

test('Un logout concluso in ritardo non nasconde il nuovo account', async () => {
  const work = deferred();
  const h = setup({ signOut: () => work.promise }); h.account.init();
  h.emit({ uid: 'account-a', email: 'a@example.test' });
  const signingOut = h.account.signOut();
  h.emit(null);
  h.emit({ uid: 'account-b', email: 'b@example.test' });
  work.resolve();
  await signingOut;
  assert.equal(h.account.user.uid, 'account-b');
  h.localUnchanged();
});

test('Errore del listener gestito senza impedire il funzionamento locale', () => {
  const h = setup(); h.account.init();
  h.fail({ code: 'auth/network-request-failed' });
  assert.ok(h.account.error);
  h.localUnchanged();
});

test('init ripetuto non duplica il listener di autenticazione', () => {
  const h = setup(); h.account.init(); h.account.init();
  assert.equal(h.calls.auth, 1);
  assert.equal(h.calls.subscribe, 1);
});
