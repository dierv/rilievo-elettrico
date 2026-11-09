'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');

const context = vm.createContext({ console, setTimeout, clearTimeout, TextEncoder, crypto: webcrypto });
vm.runInContext(fs.readFileSync(path.join(__dirname, '../sorgenti/src/pwa_cloud_engine.js'), 'utf8') + '\nthis.engineExports = { CloudSyncEngine, CloudSyncProtocol };', context);
const { CloudSyncEngine, CloudSyncProtocol: P } = context.engineExports;
const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
const survey = (name, files = []) => ({ app: 'sopralux-sync', schema: 1, id: 'plant', kind: 'survey', survey: { id: 'plant', name }, rooms: [], files });

class MemoryLocal {
  constructor(records = new Map()) { this.records = records; this.beforeCommit = null; this.commits = []; }
  async listIds() { return [...this.records.keys()]; }
  async read(id) { return clone(this.records.get(id) || null); }
  async edit(id, snapshot, { deleted = false, modifiedAt = Date.now() } = {}) {
    const old = this.records.get(id);
    const record = { ...(old || {}), id, version: (old && old.version || 0) + 1, snapshot: clone(snapshot), hash: deleted ? '' : await P.hash(snapshot), deleted, modifiedAt, base: old && old.base || null, conflict: old && old.conflict || null };
    this.records.set(id, record);
    return clone(record);
  }
  async commit(id, expectedVersion, patch, guard) {
    if (this.beforeCommit) { const fn = this.beforeCommit; this.beforeCommit = null; await fn(id, patch); }
    const old = this.records.get(id);
    if (!guard() || (old ? old.version : null) !== expectedVersion) return null;
    const next = { id, snapshot: null, hash: '', deleted: true, modifiedAt: 0, base: null, conflict: null, ...(old || {}), ...clone(patch), version: (old && old.version || 0) + 1 };
    this.records.set(id, next); this.commits.push({ id, patch: clone(patch) });
    return clone(next);
  }
}

class MemoryRemote {
  constructor() {
    this.heads = new Map(); this.snapshots = new Map(); this.listeners = new Set();
    this.publishes = []; this.beforePublish = null; this.beforeRead = null; this.beforeHead = null; this.offline = false; this.clock = 100;
  }
  watchHeads(callback) {
    this.listeners.add(callback); callback([...this.heads.values()].map(clone), { fromCache: false });
    return () => this.listeners.delete(callback);
  }
  emit() { for (const callback of this.listeners) callback([...this.heads.values()].map(clone), { fromCache: false }); }
  async getHead(id) {
    if (this.beforeHead) { const fn = this.beforeHead; this.beforeHead = null; await fn(id); }
    if (this.offline) throw Object.assign(new Error('offline'), { code: 'unavailable' });
    return clone(this.heads.get(id) || null);
  }
  async readSnapshot(head, guard) {
    if (this.beforeRead) { const fn = this.beforeRead; this.beforeRead = null; await fn(head); }
    if (guard && !guard()) throw Object.assign(new Error('cancelled'), { code: 'sync/cancelled' });
    if (this.offline) throw Object.assign(new Error('offline'), { code: 'unavailable' });
    return clone(this.snapshots.get(head.id + ':' + head.rev));
  }
  async publish(request) {
    const sent = clone({ ...request, guard: undefined });
    if (this.beforePublish) { const fn = this.beforePublish; this.beforePublish = null; await fn(request, sent); }
    if (request.guard && !request.guard()) throw Object.assign(new Error('cancelled'), { code: 'sync/cancelled' });
    if (this.offline) throw Object.assign(new Error('offline'), { code: 'unavailable' });
    const old = this.heads.get(request.sid);
    if ((old ? old.rev : 0) !== request.expectedRev) return { ok: false, head: clone(old || null) };
    const head = { id: request.sid, rev: request.expectedRev + 1, hash: request.deleted ? '' : request.hash, deleted: !!request.deleted, modifiedAt: ++this.clock, name: request.name, snapshotPath: 'private/' + request.sid + '/' + (request.expectedRev + 1) };
    this.heads.set(request.sid, head); this.snapshots.set(request.sid + ':' + head.rev, clone(request.snapshot)); this.publishes.push(sent); this.emit();
    return { ok: true, head: clone(head) };
  }
  async force(id, snapshot, deleted = false) {
    const old = this.heads.get(id);
    return this.publish({ sid: id, expectedRev: old ? old.rev : 0, snapshot, hash: deleted ? '' : await P.hash(snapshot), deleted, name: snapshot && snapshot.survey && snapshot.survey.name });
  }
}

function createEngine(local, remote, options = {}) {
  return new CloudSyncEngine({ local, remote, auto: false, ...options });
}

async function pair() {
  const remote = new MemoryRemote(), a = new MemoryLocal(), b = new MemoryLocal();
  await a.edit('plant', survey('Base'), { modifiedAt: 1000 });
  const ea = createEngine(a, remote), eb = createEngine(b, remote);
  await ea.start(); await eb.start();
  return { remote, a, b, ea, eb };
}

async function diverged() {
  const p = await pair();
  await p.a.edit('plant', survey('Dal PC'));
  await p.b.edit('plant', survey('Dal tablet'));
  await p.ea.sync(); await p.eb.sync();
  return p;
}

test('JSON canonica: ordine chiavi stabile, liste ordinate, buchi e undefined compatibili con JSON', async () => {
  assert.equal(P.stringify({ b: 2, a: 1, absent: undefined }), '{"a":1,"b":2}');
  assert.equal(P.stringify([, undefined, NaN]), '[null,null,null]');
  assert.equal(await P.hash({ b: [1, 2], a: true }), await P.hash({ a: true, b: [1, 2] }));
  assert.notEqual(await P.hash([1, 2]), await P.hash([2, 1]));
  const circular = {}; circular.self = circular;
  assert.throws(() => P.stringify(circular), /circolare/);
});

test('due dispositivi ricevono gli aggiornamenti in sequenza anche con orologi locali sfasati', async () => {
  const { a, b, ea, eb, remote } = await pair();
  assert.equal((await b.read('plant')).snapshot.survey.name, 'Base');
  await a.edit('plant', survey('Seconda'), { modifiedAt: 9999999999999 });
  await ea.sync(); await eb.sync();
  await b.edit('plant', survey('Terza'), { modifiedAt: 1 });
  await eb.sync(); await ea.sync();
  assert.equal((await a.read('plant')).snapshot.survey.name, 'Terza');
  assert.equal((await b.read('plant')).snapshot.survey.name, 'Terza');
  assert.equal(remote.heads.get('plant').rev, 3);
  assert.equal(ea.status().conflicts + eb.status().conflicts, 0);
  assert.equal(ea.status().pending + eb.status().pending, 0);
  ea.stop(); eb.stop();
});

test('divergenza conserva entrambe le versioni e non riscrive quella online', async () => {
  const { b, eb, ea, remote } = await diverged();
  const state = await b.read('plant');
  assert.equal(state.snapshot.survey.name, 'Dal tablet');
  assert.equal(state.conflict.remote.snapshot.survey.name, 'Dal PC');
  assert.equal(state.conflict.local.snapshot.survey.name, 'Dal tablet');
  assert.equal(state.conflict.reason, 'diverged');
  assert.equal(remote.heads.get('plant').rev, 2);
  assert.equal(eb.status().conflicts, 1);
  await eb.sync();
  assert.equal((await b.read('plant')).conflict.token, state.conflict.token);
  assert.equal(remote.publishes.length, 2);
  ea.stop(); eb.stop();
});

test('tieni questa versione locale pubblica una nuova revisione e convergono entrambi', async () => {
  const { a, b, ea, eb, remote } = await diverged();
  const conflict = (await b.read('plant')).conflict;
  const result = await eb.resolve('plant', 'local', conflict.token);
  assert.equal(result.status, 'resolved');
  await ea.sync();
  assert.equal((await a.read('plant')).snapshot.survey.name, 'Dal tablet');
  assert.equal((await b.read('plant')).conflict, null);
  assert.equal(remote.heads.get('plant').rev, 3);
  ea.stop(); eb.stop();
});

test('tieni la versione online sostituisce solo la copia locale dopo la scelta', async () => {
  const { b, ea, eb, remote } = await diverged();
  const conflict = (await b.read('plant')).conflict;
  assert.equal((await eb.resolve('plant', 'remote', conflict.token)).status, 'resolved');
  assert.equal((await b.read('plant')).snapshot.survey.name, 'Dal PC');
  assert.equal((await b.read('plant')).conflict, null);
  assert.equal(remote.publishes.length, 2);
  ea.stop(); eb.stop();
});

test('migrazione senza base comune: due copie diverse richiedono scelta, anche con date diverse', async () => {
  const remote = new MemoryRemote(), local = new MemoryLocal();
  await remote.force('plant', survey('Già online'));
  await local.edit('plant', survey('Copia del vecchio tablet'), { modifiedAt: Number.MAX_SAFE_INTEGER });
  const engine = createEngine(local, remote);
  await engine.start();
  assert.equal((await local.read('plant')).conflict.reason, 'no-common-base');
  assert.equal(remote.publishes.length, 1);
  engine.stop();
});

test('migrazione con copie identiche riconosce la base senza riscrivere il server', async () => {
  const remote = new MemoryRemote(), local = new MemoryLocal();
  await remote.force('plant', survey('Uguale'));
  await local.edit('plant', survey('Uguale'));
  const engine = createEngine(local, remote);
  await engine.start();
  assert.equal((await local.read('plant')).base.rev, 1);
  assert.equal(remote.publishes.length, 1);
  assert.equal(engine.status().conflicts, 0);
  engine.stop();
});

test('coda offline ricostruita dai dati persistenti dopo arresto e riavvio', async () => {
  const { a, ea, eb, remote } = await pair();
  ea.stop(); eb.stop();
  await a.edit('plant', survey('Modificata offline'));
  let online = false;
  const off = createEngine(new MemoryLocal(a.records), remote, { isOnline: () => online });
  await off.start();
  assert.equal(off.status().pending, 1);
  assert.equal(remote.heads.get('plant').rev, 1);
  off.stop(); online = true;
  const restarted = createEngine(new MemoryLocal(a.records), remote, { isOnline: () => online });
  await restarted.start();
  assert.equal(remote.heads.get('plant').rev, 2);
  assert.equal(remote.snapshots.get('plant:2').survey.name, 'Modificata offline');
  assert.equal(restarted.status().pending, 0);
  restarted.stop();
});

test('errore rete mantiene snapshot e coda, poi il nuovo tentativo converge', async () => {
  const { a, ea, eb, remote } = await pair();
  await a.edit('plant', survey('In attesa'));
  remote.offline = true; await ea.sync();
  assert.equal(ea.status().pending, 1);
  assert.equal((await a.read('plant')).base.rev, 1);
  remote.offline = false; await ea.sync(); await eb.sync();
  assert.equal(ea.status().error, null);
  assert.equal(remote.heads.get('plant').rev, 2);
  ea.stop(); eb.stop();
});

test('allegato mancante conserva la coda senza retry automatici e riparte quando viene recuperato', async () => {
  const local = new MemoryLocal(), remote = new MemoryRemote();
  await local.edit('plant', survey('Con allegato da recuperare'));
  const publish = remote.publish.bind(remote);
  remote.publish = async () => { throw Object.assign(new Error('Manca il file locale'), { code: 'sync/missing-local-file' }); };
  const engine = createEngine(local, remote, { auto: true });
  // Il sync esplicito non attiva il listener, quindi l'unico eventuale timer
  // rappresenta davvero il retry dell'upload fallito.
  await engine.sync();
  assert.equal(engine.status().error.code, 'sync/missing-local-file');
  assert.equal(engine.status().pending, 1);
  assert.equal((await local.read('plant')).base, null);
  assert.equal(engine.timer, null);
  assert.equal(remote.publishes.length, 0);
  remote.publish = publish;
  await engine.sync();
  assert.equal(engine.status().pending, 0);
  assert.equal(engine.status().error, null);
  assert.equal(remote.snapshots.get('plant:1').survey.name, 'Con allegato da recuperare');
  engine.stop();
});

test('cancellazione contro modifica diventa conflitto e non cancella i dati online', async () => {
  const { a, b, ea, eb, remote } = await pair();
  await a.edit('plant', survey('Modificata sul PC'));
  await b.edit('plant', null, { deleted: true });
  await ea.sync(); await eb.sync();
  const state = await b.read('plant');
  assert.equal(state.deleted, true);
  assert.equal(state.conflict.local.deleted, true);
  assert.equal(state.conflict.remote.snapshot.survey.name, 'Modificata sul PC');
  assert.equal(remote.heads.get('plant').deleted, false);
  assert.equal((await eb.resolve('plant', 'remote', state.conflict.token)).status, 'resolved');
  assert.equal((await b.read('plant')).deleted, false);
  ea.stop(); eb.stop();
});

test('cancellazione in sequenza si propaga come tombstone e non risorge dopo riavvio', async () => {
  const { a, b, ea, eb, remote } = await pair();
  await a.edit('plant', null, { deleted: true });
  await ea.sync(); await eb.sync();
  assert.equal((await b.read('plant')).deleted, true);
  assert.equal(remote.heads.get('plant').deleted, true);
  eb.stop();
  const restarted = createEngine(new MemoryLocal(b.records), remote);
  await restarted.start();
  assert.equal(remote.heads.get('plant').rev, 2);
  restarted.stop(); ea.stop();
});

test('progetto eliminato offline prima del primo invio pubblica una tombstone', async () => {
  const local = new MemoryLocal(), remote = new MemoryRemote();
  await local.edit('plant', survey('Nuovo')); await local.edit('plant', null, { deleted: true });
  const engine = createEngine(local, remote); await engine.start();
  assert.equal(remote.heads.get('plant').deleted, true);
  assert.equal(remote.heads.get('plant').rev, 1);
  engine.stop();
});

test('modifica durante upload: avanza la base inviata ma conserva e invia la modifica più recente', async () => {
  const { a, ea, eb, remote } = await pair();
  await a.edit('plant', survey('Invio in corso'));
  remote.beforePublish = async (_request, captured) => {
    assert.equal(captured.snapshot.survey.name, 'Invio in corso');
    await a.edit('plant', survey('Ancora più recente'));
  };
  await ea.sync();
  assert.equal(remote.snapshots.get('plant:2').survey.name, 'Invio in corso');
  assert.equal(remote.snapshots.get('plant:3').survey.name, 'Ancora più recente');
  assert.equal((await a.read('plant')).snapshot.survey.name, 'Ancora più recente');
  assert.equal((await a.read('plant')).conflict, null);
  assert.equal((await a.read('plant')).base.rev, 3);
  ea.stop(); eb.stop();
});

test('modifica locale durante download remoto impedisce di applicare la vecchia lettura locale', async () => {
  const { a, b, ea, eb, remote } = await pair();
  await a.edit('plant', survey('Online aggiornata')); await ea.sync();
  remote.beforeRead = async () => b.edit('plant', survey('Nuova modifica mentre scarico'));
  await eb.sync();
  const state = await b.read('plant');
  assert.equal(state.snapshot.survey.name, 'Nuova modifica mentre scarico');
  assert.equal(state.conflict.remote.snapshot.survey.name, 'Online aggiornata');
  assert.equal(remote.heads.get('plant').rev, 2);
  ea.stop(); eb.stop();
});

test('sostituire un audio con lo stesso id ma digest diverso è una modifica reale', async () => {
  const { a, b, ea, eb } = await pair();
  await a.edit('plant', survey('Base', [{ id: 'audio_note1', sha256: 'a'.repeat(64) }]));
  await ea.sync(); await eb.sync();
  await b.edit('plant', survey('Base', [{ id: 'audio_note1', sha256: 'b'.repeat(64) }]));
  await eb.sync(); await ea.sync();
  assert.equal((await a.read('plant')).snapshot.files[0].sha256, 'b'.repeat(64));
  assert.equal(ea.status().conflicts, 0);
  ea.stop(); eb.stop();
});

test('scelta obsoleta se la versione online cambia mentre il dialogo è aperto', async () => {
  const { b, ea, eb, remote } = await diverged();
  const token = (await b.read('plant')).conflict.token;
  await remote.force('plant', survey('Online ulteriormente modificata'));
  const count = remote.publishes.length;
  const result = await eb.resolve('plant', 'local', token);
  assert.equal(result.status, 'stale');
  assert.equal(remote.publishes.length, count);
  const state = await b.read('plant');
  assert.notEqual(state.conflict.token, token);
  assert.equal(state.conflict.remote.snapshot.survey.name, 'Online ulteriormente modificata');
  assert.equal(state.snapshot.survey.name, 'Dal tablet');
  ea.stop(); eb.stop();
});

test('scelta obsoleta se la copia locale cambia mentre il dialogo è aperto', async () => {
  const { b, ea, eb, remote } = await diverged();
  const token = (await b.read('plant')).conflict.token;
  await b.edit('plant', survey('Locale ulteriormente modificata'));
  const result = await eb.resolve('plant', 'remote', token);
  assert.equal(result.status, 'stale');
  assert.equal((await b.read('plant')).snapshot.survey.name, 'Locale ulteriormente modificata');
  assert.notEqual((await b.read('plant')).conflict.token, token);
  assert.equal(remote.heads.get('plant').rev, 2);
  ea.stop(); eb.stop();
});

test('CAS fallita durante tieni locale aggiorna il conflitto e non sovrascrive la nuova revisione', async () => {
  const { b, ea, eb, remote } = await diverged();
  const token = (await b.read('plant')).conflict.token;
  remote.beforePublish = async () => remote.force('plant', survey('Terzo dispositivo'));
  const result = await eb.resolve('plant', 'local', token);
  assert.equal(result.status, 'stale');
  assert.equal(remote.heads.get('plant').rev, 3);
  assert.equal(remote.snapshots.get('plant:3').survey.name, 'Terzo dispositivo');
  assert.equal((await b.read('plant')).conflict.remote.snapshot.survey.name, 'Terzo dispositivo');
  ea.stop(); eb.stop();
});

test('CAS locale fallita durante tieni online conserva la nuova modifica locale', async () => {
  const { b, ea, eb } = await diverged();
  const token = (await b.read('plant')).conflict.token;
  b.beforeCommit = async () => b.edit('plant', survey('Modifica durante applicazione'));
  const result = await eb.resolve('plant', 'remote', token);
  assert.equal(result.status, 'stale');
  assert.equal((await b.read('plant')).snapshot.survey.name, 'Modifica durante applicazione');
  assert.equal((await b.read('plant')).conflict.local.snapshot.survey.name, 'Modifica durante applicazione');
  ea.stop(); eb.stop();
});

test('cambio account durante pubblicazione annulla il lavoro ancora non inviato', async () => {
  const local = new MemoryLocal(), remote = new MemoryRemote();
  await local.edit('plant', survey('Privato account A'));
  const engine = createEngine(local, remote);
  remote.beforePublish = async () => engine.stop();
  await engine.start();
  assert.equal(remote.publishes.length, 0);
  assert.equal((await local.read('plant')).base, null);
  assert.equal(engine.status().active, false);
});

test('cambio account durante applicazione controlla il guard alla scrittura atomica finale', async () => {
  const local = new MemoryLocal(), remote = new MemoryRemote();
  await remote.force('plant', survey('Privato A'));
  let current = true;
  const engine = createEngine(local, remote, { isCurrent: () => current });
  local.beforeCommit = async () => { current = false; };
  await engine.start();
  assert.equal(await local.read('plant'), null);
  assert.equal(local.commits.length, 0);
  engine.stop();
});

test('sparizione inattesa del documento online non provoca resurrezione automatica', async () => {
  const { a, ea, eb, remote } = await pair();
  remote.heads.delete('plant');
  await ea.sync();
  const state = await a.read('plant');
  assert.equal(state.conflict.reason, 'remote-missing');
  assert.equal(remote.publishes.length, 1);
  assert.equal((await ea.resolve('plant', 'remote', state.conflict.token)).status, 'resolved');
  await ea.sync();
  assert.equal((await a.read('plant')).deleted, true);
  assert.equal(remote.heads.has('plant'), false);
  ea.stop(); eb.stop();
});

test('riavvio offline conserva l’indicazione dei conflitti e le due versioni', async () => {
  const { b, ea, eb, remote } = await diverged();
  const token = (await b.read('plant')).conflict.token;
  eb.stop(); ea.stop();
  const restarted = createEngine(new MemoryLocal(b.records), remote, { isOnline: () => false });
  await restarted.start();
  assert.equal(restarted.status().conflicts, 1);
  const conflicts = await restarted.listConflicts();
  assert.equal(conflicts[0].token, token);
  assert.equal(conflicts[0].remote.snapshot.survey.name, 'Dal PC');
  restarted.stop();
});

test('revisione remota retrocessa richiede scelta invece di applicare una copia più vecchia', async () => {
  const { a, ea, eb, remote } = await pair();
  await a.edit('plant', survey('Rev 2')); await ea.sync();
  const old = { ...remote.heads.get('plant'), rev: 1, hash: await P.hash(survey('Rollback')) };
  remote.heads.set('plant', old); remote.snapshots.set('plant:1', survey('Rollback'));
  await ea.sync();
  assert.equal((await a.read('plant')).snapshot.survey.name, 'Rev 2');
  assert.equal((await a.read('plant')).conflict.reason, 'remote-rewritten');
  ea.stop(); eb.stop();
});

test('head non valida non modifica né locale né remoto', async () => {
  const local = new MemoryLocal(), remote = new MemoryRemote();
  await local.edit('plant', survey('Locale'));
  remote.heads.set('plant', { id: 'plant', rev: 1, deleted: false });
  const engine = createEngine(local, remote);
  await engine.start();
  assert.equal(engine.status().error.code, 'sync/invalid-head');
  assert.equal(local.commits.length, 0);
  assert.equal(remote.publishes.length, 0);
  engine.stop();
});
