'use strict';

// Integrazione con IndexedDB transazionale simulato: nessun servizio remoto,
// credenziale o dato di sopralluogo reale viene usato da queste prove.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const { IDBFactory, IDBKeyRange } = require('fake-indexeddb');

const sourceRoot = path.join(__dirname, '..', 'sorgenti', 'src');

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

function localStorageFor(values = new Map()) {
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
    clear: () => values.clear(),
    key: index => [...values.keys()][index] ?? null,
    get length() { return values.size; },
  };
}

function element() {
  const classes = new Set();
  return {
    innerHTML: '', textContent: '', value: '', disabled: false, style: {}, dataset: {},
    classList: {
      add: (...names) => names.forEach(name => classes.add(name)),
      remove: (...names) => names.forEach(name => classes.delete(name)),
      contains: name => classes.has(name),
      toggle: (name, force) => {
        const active = force === undefined ? !classes.has(name) : force;
        if (active) classes.add(name); else classes.delete(name);
        return active;
      },
    },
    setAttribute() {}, removeAttribute() {}, addEventListener() {},
    querySelector() { return null; }, querySelectorAll() { return []; },
    appendChild() {}, remove() {}, focus() {}, click() {},
  };
}

function runtime(options = {}) {
  const factory = options.factory || new IDBFactory();
  const storage = options.storage || new Map();
  const elements = new Map();
  const listeners = new Map();
  const timers = new Set();
  const events = { reloads: 0, toasts: [], urls: new Map(), revoked: [] };
  const lookup = selector => {
    if (!elements.has(selector)) {
      const value = element();
      if (selector === '#modal') value.classList.add('hide');
      elements.set(selector, value);
    }
    return elements.get(selector);
  };
  const timer = (fn, ms, ...args) => {
    const handle = setTimeout(() => { timers.delete(handle); fn(...args); }, ms);
    timers.add(handle); handle.unref(); return handle;
  };
  const context = vm.createContext({
    indexedDB: factory, IDBKeyRange, structuredClone, Blob, File: globalThis.File, DOMException,
    crypto: webcrypto, TextEncoder, TextDecoder, URL: class TestURL extends URL {
      static createObjectURL(blob) { const key = 'blob:test-' + (events.urls.size + 1); events.urls.set(key, blob); return key; }
      static revokeObjectURL(url) { events.revoked.push(url); events.urls.delete(url); }
    },
    localStorage: localStorageFor(storage),
    navigator: { onLine: options.online !== false, userAgent: 'Sopralux integration test', maxTouchPoints: 0 },
    location: { hostname: 'dierv.github.io', protocol: 'https:', reload: () => { events.reloads++; } },
    document: {
      hidden: false, activeElement: null,
      body: element(),
      querySelector: lookup,
      querySelectorAll: () => [],
      getElementById: id => lookup('#' + id),
      createElement: () => element(),
      addEventListener() {},
    },
    console: { log() {}, warn() {}, error() {} },
    setTimeout: timer,
    clearTimeout: handle => { timers.delete(handle); clearTimeout(handle); },
    setInterval: () => 0, clearInterval() {}, queueMicrotask,
    matchMedia: () => ({ matches: false }),
    addEventListener: (name, listener) => {
      if (!listeners.has(name)) listeners.set(name, []);
      listeners.get(name).push(listener);
    },
    PLATFORM: 'pwa', APP_VERSION: 'test',
    LEGENDA: { sym: [], pal: [], v: 1 },
    fetch: async () => { throw new Error('Le prove non devono eseguire chiamate di rete'); },
  });
  context.window = context;
  return {
    factory, storage, context, events, elements,
    load(...filenames) {
      for (const name of filenames) {
        const source = fs.readFileSync(path.join(sourceRoot, name), 'utf8')
          .replace(/\nboot\(\);\s*$/, '\n')
          .replace(/\nPwaCloud\.install\(\);\s*$/, '\n');
        vm.runInContext(source, context, { filename: name });
      }
      return this;
    },
    evaluate(code) { return vm.runInContext(code, context); },
    emit(name) { for (const listener of listeners.get(name) || []) listener(); },
    close() {
      for (const handle of timers) clearTimeout(handle);
      timers.clear();
      try { this.evaluate('if (IDB.db) IDB.db.close();'); } catch (_) {}
    },
  };
}

function openRaw(factory, name, version = 2) {
  return new Promise((resolve, reject) => {
    const request = factory.open(name, version);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const [store, keyPath] of [['docs', 'path'], ['blobs', 'id'], ['cloud', 'id']]) {
        if (store === 'cloud' && version < 2) continue;
        if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function rawTransaction(db, storeNames, callback) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeNames, 'readwrite');
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error || new Error('Transazione annullata'));
    transaction.onerror = () => reject(transaction.error);
    callback(transaction);
  });
}

function rawGet(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, 'readonly').objectStore(storeName).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function configured(options = {}) {
  const h = runtime(options);
  const authListeners = [];
  const account = {
    user: options.user === undefined ? { uid: 'account-a' } : options.user,
    auth: {}, app: {}, init() {}, refresh() {},
    async signIn() {}, async signOut() {},
    sdk: {
      onAuthStateChanged(auth, next) {
        authListeners.push(next);
        queueMicrotask(() => next(account.user));
        return () => {};
      },
    },
  };
  h.context.FirebaseAccount = account;
  h.context.AI_ERR = {};
  h.context.Rec = { active: false, async start() {} };
  h.context.AIQ = { stop() {} };
  h.load('01_core.js', 'pwa.js', 'pwa_cloud_engine.js');
  if (options.backend) h.context.CloudBackend = options.backend;
  else h.load('pwa_cloud_backend.js');
  h.load('pwa_cloud.js');
  h.evaluate(`
    IDB.tx = (store, mode, fn) => PwaCloud.transaction(IDB.db, store, mode, fn);
    Sync.drain = async () => true;
    PwaCloud.refresh = () => {};
    PwaCloud.refreshApplied = async () => {};
  `);
  h.cloud = h.evaluate('PwaCloud');
  h.idb = h.evaluate('IDB');
  h.sync = h.evaluate('Sync');
  h.account = account;
  h.emitAuth = user => { account.user = user; for (const next of authListeners) next(user); };
  h.select = async (name = 'rilievoEL-google-account-a') => {
    h.cloud.uid = account.user?.uid || null;
    h.cloud.dbName = name;
    h.idb.db = await h.cloud.openDatabase(name);
    return h.idb.db;
  };
  if (options.install) {
    h.load('08_home.js');
    for (const name of ['importPlanFile', 'addPhotos', 'runAI', 'readQuadroDet', 'withClosureData', 'photoPlanFlow', 'vnAudioBlob']) h.context[name] = async () => {};
    h.context.vnoteById = id => h.evaluate('S').vnotes.find(note => note.id === id);
    h.context.AudURL = new Map();
    h.evaluate(`
      renderHome = () => {};
      showSurvey = () => {};
      PwaCloud.install();
    `);
  }
  return h;
}

const surveyRow = (id, name = 'Impianto di prova', plans = []) => ({
  path: 'data/users/local/' + id, sid: id, ts: 200, dirty: true,
  data: { type: 'survey', id, name, plans, created: 100, updated: 200 },
});

async function seed(factory, name, rows, blobs = [], version = 2) {
  const db = await openRaw(factory, name, version);
  await rawTransaction(db, ['docs', 'blobs'], tx => {
    for (const row of rows) tx.objectStore('docs').put(row);
    for (const blob of blobs) tx.objectStore('blobs').put(blob);
  });
  db.close();
}

test('L’upgrade da IndexedDB v1 conserva sopralluoghi e allegati locali', async t => {
  const h = await configured(); t.after(() => h.close());
  const blob = new Blob(['allegato sintetico'], { type: 'image/png' });
  await seed(h.factory, 'rilievoEL', [surveyRow('s1')], [{ id: 'plan_p1', sid: 's1', ref: 'p1', kind: 'plan', blob }], 1);
  const db = await h.cloud.openDatabase('rilievoEL');
  t.after(() => db.close());
  assert.equal(db.version, 2);
  assert.equal(db.objectStoreNames.contains('cloud'), true);
  assert.equal((await rawGet(db, 'docs', 'data/users/local/s1')).data.name, 'Impianto di prova');
  assert.equal(await (await rawGet(db, 'blobs', 'plan_p1')).blob.text(), 'allegato sintetico');
});

test('Il primo account riceve i dati guest una sola volta; guest e altri account rimangono separati', async t => {
  const factory = new IDBFactory(); const storage = new Map();
  await seed(factory, 'rilievoEL', [surveyRow('s1')]);
  const first = await configured({ factory, storage }); t.after(() => first.close());
  await first.cloud.prepare();
  assert.equal(first.cloud.dbName, 'rilievoEL-google-account-a');
  assert.ok(await first.idb.get('docs', 'data/users/local/s1'));
  first.close();

  const again = await configured({ factory, storage }); t.after(() => again.close());
  await again.cloud.prepare();
  const surveys = (await again.idb.all('docs')).filter(row => row.data?.type === 'survey');
  assert.equal(surveys.length, 1);
  again.close();

  const guest = await configured({ factory, storage, user: null }); t.after(() => guest.close());
  await guest.cloud.prepare();
  assert.notEqual(guest.cloud.dbName, 'rilievoEL');
  assert.equal((await guest.idb.all('docs')).filter(row => row.data?.type === 'survey').length, 0);
  guest.close();

  const other = await configured({ factory, storage, user: { uid: 'account-b' } }); t.after(() => other.close());
  await other.cloud.prepare();
  assert.equal(other.cloud.dbName, 'rilievoEL-google-account-b');
  assert.equal((await other.idb.all('docs')).filter(row => row.data?.type === 'survey').length, 0);
  const source = await openRaw(factory, 'rilievoEL'); t.after(() => source.close());
  assert.ok(await rawGet(source, 'docs', 'data/users/local/s1'), 'La fonte originale resta conservata');
  assert.equal((await rawGet(source, 'docs', '__cloudMigration')).uid, 'account-a');
});

test('Un riavvio riprende la migrazione dal journal anche se il guest corrente è già cambiato', async t => {
  const factory = new IDBFactory();
  const storage = new Map([['ril_cloudGuestDb', JSON.stringify('rilievoEL-guest-fresh')]]);
  await seed(factory, 'rilievoEL', [surveyRow('old'), { path: '__cloudMigration', uid: 'account-a', done: false }]);
  await seed(factory, 'rilievoEL-guest-fresh', [surveyRow('new', 'Nuovo lavoro guest')]);
  await seed(factory, 'rilievoEL-google-account-a', [{ path: '__cloudMigrationPending', sourceName: 'rilievoEL', uid: 'account-a' }]);
  const h = await configured({ factory, storage }); t.after(() => h.close());
  await h.cloud.prepare();
  assert.ok(await h.idb.get('docs', 'data/users/local/old'));
  assert.ok(await h.idb.get('docs', 'data/users/local/new'));
  assert.equal(await h.idb.get('docs', '__cloudMigrationPending'), undefined);
});

test('Una collisione di ID durante la migrazione conserva entrambe le copie con riferimenti coerenti', async t => {
  const h = await configured(); t.after(() => h.close());
  await seed(h.factory, 'rilievoEL', [
    surveyRow('same', 'Dal guest', [{ id: 'p1', name: 'Pianta' }]),
    { path: 'data/users/local/same/plans/p1', sid: 'same', data: { type: 'plan', id: 'p1', rooms: [], items: [], draws: [], vnotes: [{ id: 'n1', planId: 'p1', text: 'Nota sintetica' }] } },
    { path: 'data/users/local/same/photos/ph1', sid: 'same', data: { type: 'photo', id: 'ph1', planId: 'p1', items: [] } },
  ], [{ id: 'photo_ph1', sid: 'same', ref: 'ph1', kind: 'photo', blob: new Blob(['foto sintetica']) }]);
  await seed(h.factory, 'rilievoEL-google-account-a', [surveyRow('same', 'Già nell’account')]);
  await h.cloud.prepare();
  const rows = await h.idb.all('docs');
  const imported = rows.find(row => row.data?.type === 'survey' && row.data.id !== 'same');
  assert.ok(imported);
  assert.equal((await h.idb.get('docs', 'data/users/local/same')).data.name, 'Già nell’account');
  const root = 'data/users/local/' + imported.data.id;
  const plan = rows.find(row => row.path.startsWith(root + '/plans/'));
  const photo = rows.find(row => row.path.startsWith(root + '/photos/'));
  assert.equal(plan.data.id, imported.data.plans[0].id);
  assert.equal(photo.data.planId, plan.data.id);
  assert.equal(plan.data.vnotes[0].planId, plan.data.id);
  const copied = await h.idb.get('blobs', 'photo_' + photo.data.id);
  assert.equal(copied.sid, imported.data.id);
  assert.equal(await copied.blob.text(), 'foto sintetica');
});

test('L’acquisizione concorrente dello stesso guest consente la migrazione a un solo account', async t => {
  const factory = new IDBFactory(); const storage = new Map();
  await seed(factory, 'rilievoEL', [surveyRow('s1')]);
  const a = await configured({ factory, storage, user: { uid: 'account-a' } });
  const b = await configured({ factory, storage, user: { uid: 'account-b' } });
  t.after(() => { a.close(); b.close(); });
  await a.select('rilievoEL-google-account-a'); await b.select('rilievoEL-google-account-b');
  const bothRead = deferred(); let readers = 0;
  for (const h of [a, b]) {
    const original = h.cloud.transaction.bind(h.cloud); let held = false;
    h.cloud.transaction = async (db, store, mode, fn) => {
      const result = await original(db, store, mode, fn);
      if (!held && db.name === 'rilievoEL' && store === 'docs' && mode === 'readonly' && result === undefined) {
        held = true; readers++; if (readers === 2) bothRead.resolve(); await bothRead.promise;
      }
      return result;
    };
  }
  await Promise.all([a.cloud.migrateGuest('rilievoEL'), b.cloud.migrateGuest('rilievoEL')]);
  const copies = (await a.idb.all('docs')).filter(row => row.data?.type === 'survey').length
    + (await b.idb.all('docs')).filter(row => row.data?.type === 'survey').length;
  assert.equal(copies, 1, 'La stessa fonte locale non deve finire in due account diversi');
});

test('Una scrittura atomica non lascia dati parziali se un record non è valido', async t => {
  const h = await configured(); t.after(() => h.close()); await h.select();
  await assert.rejects(h.cloud.atomic(h.idb.db, [
    { store: 'docs', value: surveyRow('s1') },
    { store: 'cloud', value: { invalid: 'record senza chiave id' } },
  ]));
  assert.equal(await h.idb.get('docs', 'data/users/local/s1'), undefined);
});

test('Una transazione con callback fallita annulla anche le richieste già accodate', async t => {
  const h = await configured(); t.after(() => h.close()); await h.select();
  await assert.rejects(h.cloud.transaction(h.idb.db, 'docs', 'readwrite', store => {
    store.put(surveyRow('s1'));
    throw new Error('Errore simulato dopo la prima richiesta');
  }));
  assert.equal(await h.idb.get('docs', 'data/users/local/s1'), undefined);
});

test('Il commit cloud applica la CAS nella transazione e rifiuta una versione locale superata', async t => {
  const h = await configured(); t.after(() => h.close()); await h.select();
  await h.idb.put('cloud', { id: 's1', version: 3, hash: 'local', base: null });
  const stale = await h.cloud.localCommit('s1', 2, { base: { rev: 1, hash: 'remote' } });
  assert.equal(stale, null);
  assert.equal((await h.idb.get('cloud', 's1')).version, 3);
  const accepted = await h.cloud.localCommit('s1', 3, { base: { rev: 1, hash: 'local' } });
  assert.equal(accepted.version, 4);
  assert.equal((await h.idb.get('cloud', 's1')).base.rev, 1);
});

test('Un risultato remoto con sessione scaduta non aggiorna dati o revisione', async t => {
  const h = await configured(); t.after(() => h.close()); await h.select();
  await h.idb.put('cloud', { id: 's1', version: 1, hash: 'local', base: null });
  assert.equal(await h.cloud.localCommit('s1', 1, { base: { rev: 2, hash: 'remote' } }, () => false), null);
  assert.equal((await h.idb.get('cloud', 's1')).version, 1);
});

test('Una cancellazione applicata resta durevole senza cancellare dati di altri impianti', async t => {
  const h = await configured(); t.after(() => h.close()); await h.select();
  await h.idb.put('docs', surveyRow('s1'));
  await h.idb.put('docs', { path: 'data/users/local/s1/plans/p1', sid: 's1', data: { type: 'plan', id: 'p1' } });
  await h.idb.put('docs', surveyRow('s2'));
  await h.idb.put('cloud', { id: 's1', version: 1, hash: 'old', base: { rev: 1, hash: 'old' } });
  const applied = await h.cloud.localCommit('s1', 1, { snapshot: null, deleted: true, hash: '', base: { rev: 2, deleted: true, hash: '' } });
  assert.ok(applied);
  assert.equal(await h.idb.get('docs', 'data/users/local/s1'), undefined);
  assert.equal(await h.idb.get('docs', 'data/users/local/s1/plans/p1'), undefined);
  assert.ok(await h.idb.get('docs', 'data/users/local/s2'));
  const name = h.cloud.dbName; h.idb.db.close(); h.idb.db = await h.cloud.openDatabase(name);
  const stored = await h.idb.get('cloud', 's1');
  assert.equal(stored.deleted, true);
  assert.equal(stored.base.rev, 2);
});

test('La nota audio dello stato di fatto usa la versione antecedente alla chiusura', async t => {
  const h = await configured(); t.after(() => h.close()); await h.select();
  const old = new Blob(['audio originale'], { type: 'audio/webm' });
  const recent = new Blob(['audio sostituito'], { type: 'audio/webm' });
  const digest = h.evaluate('CloudBackend.digestBlob');
  const oldHash = await digest(old); const newHash = await digest(recent);
  await h.idb.put('blobs', { id: '__file_' + oldHash, logicalId: 'audio_n1', sid: 's1', kind: 'audio', ref: 'n1', blob: old, sha256: oldHash, ts: 100 });
  await h.idb.put('blobs', { id: 'audio_n1', sid: 's1', kind: 'audio', ref: 'n1', blob: recent, sha256: newHash, ts: 300 });
  const descriptor = await h.cloud.blobDescriptor('audio_n1', { id: 'n1', mime: 'audio/webm' }, 'audio', 's1', 200);
  assert.equal(descriptor.sha256, oldHash);
});

test('La cattura locale non perde una conferma remota arrivata durante la lettura della revisione', async t => {
  const h = await configured(); t.after(() => h.close()); await h.select();
  await h.idb.put('docs', surveyRow('s1', 'Versione locale nuova'));
  await h.idb.put('cloud', { id: 's1', version: 1, hash: 'old', base: null, snapshot: { old: true } });
  const original = h.idb.get.bind(h.idb); let injected = false;
  h.idb.get = async (store, key) => {
    const value = await original(store, key);
    if (!injected && store === 'cloud' && key === 's1') {
      injected = true;
      await h.cloud.localCommit('s1', 1, { base: { rev: 1, hash: 'old', deleted: false } });
    }
    return value;
  };
  await h.cloud.capture(['s1']);
  await h.cloud.capture([]); // Eventuale ritentativo CAS senza nuovi eventi utente.
  const state = await original('cloud', 's1');
  assert.equal(state.base?.rev, 1, 'La nuova base confermata deve sopravvivere alla cattura');
  assert.equal(state.base?.hash, 'old');
  assert.equal(state.snapshot.survey.name, 'Versione locale nuova');
  assert.ok(state.version >= 3);
});

async function remoteFixture(h) {
  const digest = h.evaluate('CloudBackend.digestBlob');
  const blobs = new Map();
  const file = async (localId, kind, ref, text, type) => {
    const blob = new Blob([text], { type }); const sha256 = await digest(blob);
    blobs.set(sha256, blob);
    return { id: localId + '.' + sha256, localId, kind, ref, sha256, size: blob.size, type };
  };
  const plan = await file('plan_p1', 'plan', 'p1', 'pianta sintetica', 'image/png');
  const liveAudio = await file('audio_n1', 'audio', 'n1', 'nuova registrazione', 'audio/webm');
  const oldAudio = await file('audio_n1', 'audio', 'n1', 'registrazione chiusa', 'audio/webm');
  const snapshot = {
    app: 'sopralux-sync', schema: 1, kind: 'survey', id: 's1',
    survey: { id: 's1', name: 'Versione online', created: 100, closed: 150, plans: [{ id: 'p1', name: 'Piano', cloudFile: plan.sha256 }] },
    rooms: [], items: [], draws: [], photos: [],
    vnotes: [{ id: 'n1', planId: 'p1', mime: 'audio/webm', cloudFile: liveAudio.sha256, t: 100, tu: 200 }],
    closure: { p1: { type: 'closure', id: 'p1', at: 150, rooms: [], items: [], draws: [], photos: [], vnotes: [{ id: 'n1', planId: 'p1', mime: 'audio/webm', cloudFile: oldAudio.sha256, t: 100 }] } },
    files: [plan, liveAudio, oldAudio],
  };
  return { snapshot, blobs, plan, liveAudio, oldAudio };
}

test('Il pull salva progetto e tutte le versioni degli allegati in una sola applicazione locale', async t => {
  const h = await configured(); t.after(() => h.close()); await h.select();
  const fixture = await remoteFixture(h);
  h.cloud.remote = { getFile: async (id, file) => fixture.blobs.get(file.sha256) };
  await h.idb.put('docs', surveyRow('s1', 'Vecchia versione'));
  await h.idb.put('cloud', { id: 's1', version: 1, hash: 'old', base: { rev: 1, hash: 'old' } });
  const result = await h.cloud.localCommit('s1', 1, { snapshot: fixture.snapshot, hash: 'new', deleted: false, modifiedAt: 200, base: { rev: 2, hash: 'new', deleted: false } });
  assert.ok(result);
  const meta = await h.idb.get('docs', 'data/users/local/s1');
  assert.equal(meta.data.name, 'Versione online');
  assert.equal(meta.data.plans[0].asset, 'users/account-a/surveys/s1/files/' + fixture.plan.sha256);
  const alias = await h.idb.get('blobs', 'audio_n1');
  assert.equal(alias.sha256, fixture.liveAudio.sha256);
  assert.equal(await alias.blob.text(), 'nuova registrazione');
  const archived = await h.idb.get('blobs', '__file_' + fixture.oldAudio.sha256);
  assert.equal(await archived.blob.text(), 'registrazione chiusa');
  assert.equal((await h.idb.get('cloud', 's1')).base.rev, 2);
  h.idb.db.close(); h.idb.db = await h.cloud.openDatabase(h.cloud.dbName);
  assert.equal(await (await h.cloud.readLocalBlob(fixture.oldAudio)).text(), 'registrazione chiusa');
});

test('Un allegato remoto mancante impedisce di applicare una copia parziale del progetto', async t => {
  const h = await configured(); t.after(() => h.close()); await h.select();
  const fixture = await remoteFixture(h); let downloads = 0;
  h.cloud.remote = { getFile: async (id, file) => {
    if (++downloads === 2) throw new Error('Interruzione rete simulata');
    return fixture.blobs.get(file.sha256);
  } };
  await h.idb.put('docs', surveyRow('s1', 'Vecchia versione completa'));
  await h.idb.put('cloud', { id: 's1', version: 1, hash: 'old', base: { rev: 1, hash: 'old' } });
  await assert.rejects(h.cloud.localCommit('s1', 1, { snapshot: fixture.snapshot, hash: 'new', deleted: false, base: { rev: 2, hash: 'new' } }));
  assert.equal((await h.idb.get('docs', 'data/users/local/s1')).data.name, 'Vecchia versione completa');
  assert.equal((await h.idb.get('cloud', 's1')).version, 1);
  assert.equal((await h.idb.all('blobs')).length, 0);
});

test('La lettura di un digest storico non restituisce il contenuto dell’alias audio più recente', async t => {
  const h = await configured(); t.after(() => h.close()); await h.select();
  const fixture = await remoteFixture(h);
  await h.idb.put('blobs', { id: 'audio_n1', blob: fixture.blobs.get(fixture.liveAudio.sha256), sha256: fixture.liveAudio.sha256 });
  await h.idb.put('blobs', { id: '__file_' + fixture.oldAudio.sha256, blob: fixture.blobs.get(fixture.oldAudio.sha256), sha256: fixture.oldAudio.sha256 });
  assert.equal(await (await h.cloud.readLocalBlob(fixture.oldAudio)).text(), 'registrazione chiusa');
});

test('Il drain aspetta il salvataggio in corso e salva anche le modifiche intervenute nel frattempo', async t => {
  const h = await configured({ install: true }); t.after(() => h.close()); await h.select();
  const state = h.evaluate('S'); state.sv = surveyRow('s1', 'Prima versione').data;
  const entered = deferred(), release = deferred(); let held = false;
  const atomic = h.cloud.atomic.bind(h.cloud);
  h.cloud.atomic = async (...args) => {
    if (!held) { held = true; entered.resolve(); await release.promise; }
    return atomic(...args);
  };
  h.sync.mark('meta'); const firstSave = h.sync.flush(); await entered.promise;
  state.sv.name = 'Seconda versione'; h.sync.mark('meta');
  let finished = false; const drain = h.sync.drain().then(ok => { finished = true; return ok; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(finished, false);
  release.resolve(); await firstSave;
  assert.equal(await drain, true);
  assert.equal((await h.idb.get('docs', 'data/users/local/s1')).data.name, 'Seconda versione');
  assert.equal(h.sync.pending(), 0);
});

test('Un errore locale mantiene la coda e impedisce il riavvio per cambio account', async t => {
  const h = await configured({ install: true }); t.after(() => h.close()); await h.select();
  h.evaluate('S').sv = surveyRow('s1').data;
  h.cloud.atomic = async () => { throw new DOMException('Spazio locale esaurito simulato', 'QuotaExceededError'); };
  h.sync.mark('meta');
  assert.equal(await h.sync.flush(), false);
  assert.ok(h.sync.pending());
  assert.ok(h.cloud.localError);
  h.account.user = { uid: 'account-b' };
  await h.cloud.accountChanged();
  assert.equal(h.events.reloads, 0);
  assert.equal(h.idb.db.name, 'rilievoEL-google-account-a');
  assert.equal(h.cloud.uid, 'account-a');
  assert.ok(h.sync.pending());
});

test('Il cambio account ferma il motore e attende le attività sul vecchio database prima del reload', async t => {
  const h = await configured({ install: true }); t.after(() => h.close()); await h.select();
  h.evaluate('S').sv = surveyRow('s1', 'Ultima modifica su A').data;
  let stopped = 0; h.cloud.engine = { stop() { stopped++; }, notifyLocal() {} };
  h.cloud.activities = 1; h.sync.mark('meta'); h.account.user = { uid: 'account-b' };
  const changing = h.cloud.accountChanged();
  assert.equal(stopped, 1);
  assert.equal(h.cloud.current(), false);
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.equal(h.events.reloads, 0);
  h.cloud.activities = 0; await changing;
  assert.equal(h.events.reloads, 1);
  assert.equal(h.idb.db.name, 'rilievoEL-google-account-a');
  assert.equal(h.cloud.uid, 'account-a');
  assert.equal((await h.idb.get('docs', 'data/users/local/s1')).data.name, 'Ultima modifica su A');
});

test('Una nuova registrazione sostituisce cloudFile ma conserva il vecchio audio per la chiusura', async t => {
  const h = await configured({ install: true }); t.after(() => h.close()); await h.select();
  const state = h.evaluate('S'); state.sv = surveyRow('s1', 'Audio', [{ id: 'p1' }]).data;
  const old = new Blob(['audio vecchio'], { type: 'audio/webm' });
  const recent = new Blob(['audio nuovo'], { type: 'audio/webm' });
  const digest = h.evaluate('CloudBackend.digestBlob'); const oldHash = await digest(old), newHash = await digest(recent);
  const oldAsset = 'users/account-a/surveys/s1/files/' + oldHash;
  state.vnotes = [{ id: 'n1', planId: 'p1', mime: 'audio/webm', cloudFile: oldHash, asset: oldAsset }];
  await h.idb.put('blobs', { id: 'audio_n1', sid: 's1', ref: 'n1', kind: 'audio', blob: old, sha256: oldHash, ts: 100 });
  await h.evaluate('Uploads').add('audio_n1', recent, 'audio', 'n1');
  assert.equal(state.vnotes[0].cloudFile, newHash);
  assert.equal(state.vnotes[0].asset, null);
  const historical = await h.evaluate('vnAudioBlob')({ id: 'n1', asset: oldAsset, cloudFile: oldHash });
  assert.equal(await historical.text(), 'audio vecchio');
  await h.idb.del('blobs', 'audio_n1');
  assert.equal((await h.idb.get('blobs', 'audio_n1')).retired, true);
  assert.equal(await (await h.cloud.getFileBlob('audio_n1', null, newHash)).text(), 'audio nuovo');
});

test('Un asset di un altro account non viene letto tramite il fallback della cache locale', async t => {
  const h = await configured({ install: true }); t.after(() => h.close()); await h.select();
  const blob = new Blob(['contenuto sintetico']); const hash = await h.evaluate('CloudBackend.digestBlob')(blob);
  await h.idb.put('blobs', { id: 'photo_ph1', blob, sha256: hash });
  await assert.rejects(h.cloud.getFileBlob('photo_ph1', 'users/account-b/surveys/s1/files/' + hash), /altro archivio/);
});

test('L’importazione del vecchio backup con allegati crea revisioni locali senza riusare asset Claude o chiavi API', async t => {
  const h = await configured({ install: true }); t.after(() => h.close()); await h.select();
  h.context.localStorage.setItem('ril_apiKey', JSON.stringify('PRIVATE-TEST-KEY-ONLY'));
  const backup = {
    app: 'rilievo-elettrico', v: 1,
    survey: { id: 'old-survey', name: 'Backup vecchio sintetico', created: 100, plans: [{ id: 'old-plan', name: 'Pianta', asset: 'claude-plan-id' }] },
    rooms: [], items: [], draws: [], vnotes: [],
    photos: [{ id: 'old-photo', planId: 'old-plan', asset: 'claude-photo-id', aiSt: 'queued' }],
    lib: { symbols: [], settings: { apiKey: 'PRIVATE-TEST-KEY-ONLY' } },
  };
  const imported = await h.evaluate('importSnapshot')(backup, async key => new Blob(['fixture ' + key], { type: 'image/png' }));
  assert.equal(imported, true);
  assert.equal(h.cloud.activities, 0);
  const project = await h.idb.get('cloud', 'old-survey');
  assert.ok(project?.snapshot);
  assert.equal(project.snapshot.photos[0].aiSt, 'none');
  assert.equal(project.snapshot.files.length, 2);
  assert.doesNotMatch(JSON.stringify(project), /claude-plan-id|claude-photo-id|PRIVATE-TEST-KEY-ONLY/);
  assert.equal(await (await h.cloud.getFileBlob('photo_old-photo')).text(), 'fixture photo_old-photo');
});

test('Se il blob non viene salvato, la memoria conserva il file e blocca il cambio account fino al ritentativo', async t => {
  const h = await configured({ install: true }); t.after(() => h.close()); await h.select();
  const state = h.evaluate('S'); state.sv = surveyRow('s1', 'Audio', [{ id: 'p1' }]).data;
  state.vnotes = [{ id: 'n1', planId: 'p1', mime: 'audio/webm' }];
  const blob = new Blob(['registrazione da conservare'], { type: 'audio/webm' });
  const original = h.cloud.atomic.bind(h.cloud);
  h.cloud.atomic = async (db, changes, guard) => {
    if (changes.some(change => change.store === 'blobs')) throw new DOMException('Quota simulata', 'QuotaExceededError');
    return original(db, changes, guard);
  };
  assert.equal(await h.evaluate('Uploads').add('audio_n1', blob, 'audio', 'n1'), false);
  h.sync.mark('plan:p1');
  assert.equal(await h.sync.drain(), false);
  assert.equal(await h.cloud.failedAssets.get('audio_n1').blob.text(), 'registrazione da conservare');
  assert.ok(h.cloud.localError);
  assert.equal(await h.idb.get('blobs', 'audio_n1'), undefined);
  h.cloud.atomic = original;
  await h.cloud.syncNow();
  assert.equal(h.cloud.failedAssets.size, 0);
  assert.equal(h.cloud.localError, '');
  assert.equal(await (await h.idb.get('blobs', 'audio_n1')).blob.text(), 'registrazione da conservare');
});

test('La navigazione non cambia sopralluogo mentre una foto o un import sono ancora in lavorazione', async t => {
  const h = await configured({ install: true }); t.after(() => h.close()); await h.select();
  h.evaluate('S').sv = surveyRow('s1', 'Operazione in corso').data;
  h.cloud.activities = 1;
  await h.evaluate('goHome')();
  assert.equal(h.evaluate('S').sv?.id, 's1');
});

test('L’avvio PWA senza SDK o account apre l’archivio locale senza richiedere il cloud', async t => {
  const h = await configured({ install: true, user: null, online: false }); t.after(() => h.close());
  h.account.auth = null; h.account.sdk = null;
  await seed(h.factory, 'rilievoEL', [surveyRow('offline-project', 'Lavoro locale')], [], 1);
  for (const name of ['initCanvas', 'initPanel', 'initViewer', 'initPhotoInputs', 'initVnInputs', 'openLibrary', 'openSettings', 'openComputo']) h.context[name] = () => {};
  await h.evaluate('boot')();
  await h.cloud.captureAll();
  assert.equal(h.cloud.uid, null);
  assert.equal(h.idb.db.name, 'rilievoEL');
  assert.equal(h.cloud.engine, null);
  assert.equal(h.evaluate('CAP').uid, null);
  assert.equal(h.evaluate('CAP').db, null);
  assert.equal(h.evaluate('S').surveys[0].id, 'offline-project');
});

test('Una versione remota attende la fine del gesto o della finestra di modifica prima di sostituire il progetto', async t => {
  const h = await configured(); t.after(() => h.close()); await h.select();
  await h.idb.put('docs', surveyRow('s1', 'Modifica in corso'));
  await h.idb.put('cloud', { id: 's1', version: 1, hash: 'old', base: { rev: 1, hash: 'old' } });
  const patch = { snapshot: null, deleted: true, hash: '', base: { rev: 2, deleted: true, hash: '' } };
  h.context.ptrs = new Map([[1, { x: 10, y: 20 }]]);
  assert.equal(await h.cloud.localCommit('s1', 1, patch), null);
  assert.ok(await h.idb.get('docs', 'data/users/local/s1'));
  h.context.ptrs.clear();
  const modal = h.context.document.querySelector('#modal'); modal.classList.remove('hide');
  assert.equal(await h.cloud.localCommit('s1', 1, patch), null);
  assert.equal((await h.idb.get('cloud', 's1')).version, 1);
  modal.classList.add('hide');
  assert.ok(await h.cloud.localCommit('s1', 1, patch));
  assert.equal(await h.idb.get('docs', 'data/users/local/s1'), undefined);
});

test('Un cambio di account durante il boot non apre il backend con l’identità precedente', async t => {
  const factory = new IDBFactory(), storage = new Map();
  await seed(factory, 'rilievoEL', [surveyRow('s1', 'Dati inizialmente locali')]);
  const h = await configured({ factory, storage, install: true }); t.after(() => h.close());
  const entered = deferred(), release = deferred();
  const migrate = h.cloud.migrateGuest.bind(h.cloud); let held = false;
  h.cloud.migrateGuest = async name => {
    if (!held) { held = true; entered.resolve(); await release.promise; }
    return migrate(name);
  };
  const opened = [];
  Object.defineProperty(h.account, 'app', { configurable: true, get() {
    opened.push(h.cloud.uid); return {};
  } });
  const preparing = h.cloud.prepare(); await entered.promise;
  h.emitAuth({ uid: 'account-b' }); release.resolve(); await preparing;
  await h.cloud.start();
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(opened, []);
  assert.equal(h.cloud.current(), false);
  assert.equal(h.events.reloads, 1);
  assert.equal(h.idb.db.name, 'rilievoEL-google-account-a');
  h.close();
  const next = await configured({ factory, storage, user: { uid: 'account-b' } }); t.after(() => next.close());
  await next.cloud.prepare();
  assert.equal(next.idb.db.name, 'rilievoEL-google-account-b');
  assert.equal((await next.idb.all('docs')).filter(row => row.data?.type === 'survey').length, 0);
});

test('Una cattura fallita protegge i documenti locali già salvati da una revisione remota', async t => {
  const h = await configured({ install: true }); t.after(() => h.close()); await h.select();
  await h.idb.put('docs', surveyRow('s1', 'Versione condivisa'));
  await h.cloud.capture(['s1']);
  const first = await h.idb.get('cloud', 's1');
  const clean = await h.cloud.localCommit('s1', first.version, { base: { rev: 1, hash: first.hash, deleted: false } });
  const remote = structuredClone(first.snapshot); remote.survey.name = 'Modifica di un altro dispositivo';
  const remoteHash = await h.evaluate('CloudSyncProtocol').hash(remote);
  const patch = { snapshot: remote, hash: remoteHash, deleted: false, base: { rev: 2, hash: remoteHash, deleted: false } };

  h.evaluate('S').sv = surveyRow('s1', 'Modifica locale da conservare').data;
  const makeSnapshot = h.cloud.makeSnapshot.bind(h.cloud);
  h.cloud.makeSnapshot = async () => { throw new Error('Lettura allegato interrotta simulata'); };
  h.sync.mark('meta');
  assert.equal(await h.sync.drain(), true, 'I documenti sono salvati anche se la cattura cloud deve essere ripetuta');
  assert.equal(h.sync.pending(), 0);
  assert.equal(h.cloud.captureWanted.has('s1'), true);
  assert.equal((await h.idb.get('cloud', 's1')).version, clean.version);
  assert.equal(await h.cloud.localCommit('s1', clean.version, patch), null);
  assert.equal((await h.idb.get('docs', 'data/users/local/s1')).data.name, 'Modifica locale da conservare');
  assert.equal((await h.idb.get('cloud', 's1')).base.rev, 1);

  h.cloud.makeSnapshot = makeSnapshot;
  assert.equal(await h.cloud.localCommit('s1', clean.version, patch), null, 'La cattura riuscita cambia la versione e invalida il vecchio CAS remoto');
  const saved = await h.idb.get('cloud', 's1');
  assert.equal(saved.snapshot.survey.name, 'Modifica locale da conservare');
  assert.equal(saved.base.rev, 1);
  assert.ok(saved.version > clean.version);
  assert.equal(h.cloud.captureWanted.has('s1'), false);
});

test('L’avvio autenticato usa il backend congelato e attende il server prima di dichiararsi sincronizzato', async t => {
  let notifyHeads; const opened = [];
  const backend = Object.freeze({
    watchHeads(next) { notifyHeads = next; next([], { fromCache: true }); return () => {}; },
    async getHead() { assert.fail('Nessun progetto deve richiedere una lettura remota'); },
    async readSnapshot() { assert.fail('Nessun progetto deve richiedere uno snapshot'); },
    async publish() { assert.fail('Nessun progetto deve essere pubblicato'); },
    close() {},
  });
  const h = await configured({ install: true, backend: Object.freeze({ open(options) { opened.push(options); return backend; } }) });
  t.after(() => { h.cloud.engine?.stop(); h.close(); });
  await h.cloud.prepare();
  await h.cloud.start();
  assert.equal(opened.length, 1);
  assert.equal(opened[0].uid, 'account-a');
  assert.equal(opened[0].isCurrent(), true);
  assert.equal(Object.isFrozen(backend), true);
  assert.equal(h.cloud.engine instanceof h.evaluate('CloudSyncEngine'), true);
  assert.equal(h.cloud.engine.started, true);
  assert.equal(h.cloud.engine.status().phase, 'idle');
  assert.equal(h.cloud.engine.status().pending, 0);
  assert.equal(Boolean(h.cloud.serverSeen), false);
  assert.equal(h.cloud.describe().style, 'grey');
  notifyHeads([], { fromCache: false });
  assert.equal(h.cloud.serverSeen, true);
  assert.equal(h.cloud.describe().style, 'ok');
  assert.equal(h.cloud.describe().text, 'Sincronizzato ✓');
  assert.equal(h.cloud.error, '');
  assert.equal(h.cloud.engine.status().error, null);
});
