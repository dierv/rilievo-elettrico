const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createHash, webcrypto } = require('node:crypto');

const source = fs.readFileSync(path.join(__dirname, '../sorgenti/src/pwa_cloud_backend.js'), 'utf8');

function harness(options = {}) {
  const context = vm.createContext({ Blob, console, crypto: webcrypto, Uint8Array, navigator: { onLine: true } });
  const backend = vm.runInContext(source + '\nCloudBackend;', context);
  const docs = new Map();
  const objects = new Map();
  const events = [];
  const auth = { currentUser: { uid: 'alice' } };
  const hooks = {};
  const snapshot = (id, value) => ({ id, exists: () => value !== undefined, data: () => value });
  let observer, unsubscribeCount = 0, transactionCount = 0;
  const sdk = {
    getAuth: () => auth,
    getFirestore: () => ({}),
    getStorage: () => ({}),
    doc: (_, ...parts) => parts.join('/'),
    collection: (_, ...parts) => parts.join('/'),
    ref: (_, location) => location,
    serverTimestamp: () => ({ serverTimestamp: true }),
    getDocFromServer: async location => {
      if (hooks.beforeRead) await hooks.beforeRead(location);
      return snapshot(location.split('/').pop(), docs.get(location));
    },
    onSnapshot: (_, metadata, next, error) => {
      observer = { next, error };
      return () => { unsubscribeCount++; };
    },
    getMetadata: async location => {
      const object = objects.get(location);
      if (!object) throw Object.assign(new Error('missing'), { code: 'storage/object-not-found' });
      return { size: object.blob.size, customMetadata: object.metadata.customMetadata };
    },
    uploadBytes: async (location, blob, metadata) => {
      events.push({ type: 'upload', location });
      if (hooks.beforeUpload) await hooks.beforeUpload(location, blob, metadata);
      if (objects.has(location)) throw Object.assign(new Error('immutable'), { code: 'storage/unauthorized' });
      objects.set(location, { blob, metadata });
      if (hooks.afterUpload) await hooks.afterUpload(location);
      return { metadata };
    },
    getBlob: async location => {
      events.push({ type: 'download', location });
      if (!objects.has(location)) throw Object.assign(new Error('missing'), { code: 'storage/object-not-found' });
      return objects.get(location).blob;
    },
    runTransaction: async (_, callback) => {
      for (let attempt = 0; attempt < 3; attempt++) {
        transactionCount++;
        const writes = [];
        const result = await callback({
          get: async location => { events.push({ type: 'transaction-read' }); return snapshot(location.split('/').pop(), docs.get(location)); },
          set: (location, value) => writes.push({ location, value })
        });
        if (hooks.retry && await hooks.retry(attempt, writes)) continue;
        for (const write of writes) {
          docs.set(write.location, { ...write.value, upd: { toMillis: () => 1700000000000 } });
          events.push({ type: 'commit', location: write.location });
        }
        return result;
      }
      throw new Error('retry limit');
    }
  };
  const blobs = new Map();
  const remote = backend.open({ app: {}, sdk, uid: 'alice', deviceId: 'device-a', isCurrent: options.isCurrent, readLocalBlob: async file => blobs.get(file.id) });
  const hash = value => createHash('sha256').update(backend.canonicalStringify(value)).digest('hex');
  async function file(id, contents, type = 'image/jpeg') {
    const blob = new Blob([contents], { type });
    const descriptor = { id, sha256: await backend.digestBlob(blob), size: blob.size, type, kind: 'photo', ref: id };
    blobs.set(id, blob);
    return descriptor;
  }
  function project(files = []) {
    return { app: 'sopralux-sync', schema: 1, id: 'survey1', kind: 'survey', survey: { id: 'survey1', name: 'Prova', plans: [] }, rooms: [], items: [], draws: [], vnotes: [], photos: [], closure: {}, files };
  }
  function publish(value, expectedRev = 0, extras = {}) {
    return remote.publish({ sid: value.id, expectedRev, snapshot: value, name: value.survey?.name || 'Legenda', hash: hash(value), ...extras });
  }
  return { context, backend, remote, docs, objects, events, auth, hooks, blobs, hash, file, project, publish, get observer() { return observer; }, get unsubscribeCount() { return unsubscribeCount; }, get transactionCount() { return transactionCount; } };
}

test('pubblica solo dopo file e snapshot completi; rilegge copia e file verificandoli', async () => {
  const h = harness();
  const file = await h.file('photo1', 'jpeg-bytes');
  const value = h.project([file]);
  const result = await h.publish(value, 0, { modifiedAt: 9999999999999 });
  assert.equal(result.ok, true);
  assert.equal(result.head.rev, 1);
  assert.equal(result.head.modifiedAt, 1700000000000);
  assert.deepEqual(h.events.map(event => event.type), ['upload', 'upload', 'transaction-read', 'commit']);
  assert.match(h.events[0].location, /\/files\/[a-f0-9]{64}$/);
  assert.equal(JSON.stringify(await h.remote.readSnapshot(result.head)), h.backend.canonicalStringify(value));
  assert.equal(await (await h.remote.getFile('survey1', file)).text(), 'jpeg-bytes');
});

test('riutilizza file immutabili già online anche se il blob locale manca', async () => {
  const h = harness();
  const file = await h.file('photo1', 'same-bytes');
  await h.publish(h.project([file]));
  h.blobs.clear();
  const changed = h.project([file]); changed.survey.name = 'Aggiornato';
  await h.publish(changed, 1);
  assert.equal(h.events.filter(event => event.type === 'upload' && event.location.includes('/files/')).length, 1);
});

test('blob mancante o cambiato non pubblica una revisione incompleta', async () => {
  const h = harness();
  const file = await h.file('photo1', 'required');
  h.blobs.delete('photo1');
  await assert.rejects(h.publish(h.project([file])), { code: 'sync/missing-local-file' });
  h.blobs.set('photo1', new Blob(['different']));
  await assert.rejects(h.publish(h.project([file])), { code: 'sync/missing-local-file' });
  assert.equal(h.docs.size, 0);
});

test('CAS divergente mantiene head e file della versione online', async () => {
  const h = harness();
  const oldFile = await h.file('note1', 'audio-original');
  const initial = await h.publish(h.project([oldFile]));
  const nextFile = await h.file('note1', 'audio-modified');
  const result = await h.publish(h.project([nextFile]), 0);
  assert.equal(result.ok, false);
  assert.equal(result.head.hash, initial.head.hash);
  assert.equal(h.docs.get('users/alice/surveys/survey1').rev, 1);
  assert.equal(await (await h.remote.getFile('survey1', oldFile)).text(), 'audio-original');
  assert.notEqual(oldFile.sha256, nextFile.sha256);
});

test('retry della transazione non ripete upload e rileva la nuova revisione', async () => {
  const h = harness();
  const initial = await h.publish(h.project());
  const next = h.project(); next.survey.name = 'Mio cambiamento';
  const uploadsBefore = h.events.filter(event => event.type === 'upload').length;
  h.hooks.retry = async attempt => {
    if (attempt !== 0) return false;
    const current = h.docs.get('users/alice/surveys/survey1');
    h.docs.set('users/alice/surveys/survey1', { ...current, rev: 2, dev: 'device-b' });
    return true;
  };
  const result = await h.publish(next, initial.head.rev);
  assert.equal(result.ok, false);
  assert.equal(result.head.rev, 2);
  assert.equal(h.events.filter(event => event.type === 'upload').length - uploadsBefore, 1);
});

test('chiavi API, riferimenti locali, URL temporanei e handle non entrano negli snapshot', async () => {
  const h = harness();
  for (const extra of [{ apiKey: 'secret' }, { asset: 'other/path' }, { local: 'idb-key' }, { _url: 'blob:anything' }, { value: 'blob:anything' }, { handle: {} }, { value: new Blob(['x']) }]) {
    const value = h.project(); Object.assign(value.survey, extra);
    await assert.rejects(async () => h.remote.publish({ sid: 'survey1', expectedRev: 0, snapshot: value }), error => ['sync/private-data', 'sync/invalid-snapshot'].includes(error.code));
  }
  assert.equal(h.objects.size, 0);
  assert.equal(h.docs.size, 0);
});

test('rifiuta percorsi snapshot di un altro account prima del download', async () => {
  const h = harness();
  const { head } = await h.publish(h.project());
  h.events.length = 0;
  await assert.rejects(h.remote.readSnapshot({ ...head, snapshotPath: head.snapshotPath.replace('/alice/', '/bob/') }), { code: 'sync/invalid-head' });
  assert.equal(h.events.length, 0);
});

test('rifiuta bytes scaricati alterati e metadata incongruenti', async () => {
  const h = harness();
  const file = await h.file('photo1', 'original');
  const { head } = await h.publish(h.project([file]));
  const binaryPath = 'users/alice/surveys/survey1/files/' + file.sha256;
  h.objects.get(binaryPath).blob = new Blob(['altered!']);
  await assert.rejects(h.remote.getFile('survey1', file), { code: 'sync/integrity' });
  h.objects.get(head.snapshotPath).blob = new Blob(['{}']);
  await assert.rejects(h.remote.readSnapshot(head), { code: 'sync/integrity' });
  await assert.rejects(h.remote.putFile('survey1', { ...file, size: file.size + 1 }, new Blob(['original!'])), { code: 'sync/integrity' });
});

test('cambio account durante upload impedisce la pubblicazione head', async () => {
  const h = harness();
  h.hooks.afterUpload = async () => { h.auth.currentUser = { uid: 'bob' }; };
  await assert.rejects(h.publish(h.project()), { code: 'sync/session-ended' });
  assert.equal(h.docs.size, 0);
});

test('guard viene ricontrollata anche dentro la transazione', async () => {
  const h = harness();
  let calls = 0;
  const guard = () => { calls++; return !h.events.some(event => event.type === 'transaction-read'); };
  await assert.rejects(h.publish(h.project(), 0, { guard }), { code: 'sync/session-ended' });
  assert.ok(calls > 3);
  assert.equal(h.docs.size, 0);
});

test('una revisione più nuova dopo il commit non viene attribuita al nostro snapshot', async () => {
  const h = harness();
  h.hooks.beforeRead = async location => {
    const current = h.docs.get(location);
    h.docs.set(location, { ...current, rev: current.rev + 1, dev: 'device-b' });
  };
  const result = await h.publish(h.project());
  assert.equal(result.ok, true);
  assert.equal(result.head.rev, 1);
  assert.equal(result.head.modifiedAt, null);
  assert.equal(h.docs.get('users/alice/surveys/survey1').rev, 2);
});

test('errore di lettura dopo commit non fa risultare fallito il salvataggio riuscito', async () => {
  const h = harness();
  h.hooks.beforeRead = async () => { throw new Error('network interrupted'); };
  const result = await h.publish(h.project());
  assert.equal(result.ok, true);
  assert.equal(result.head.rev, 1);
});

test('cancellazione usa una revisione tombstone senza eliminare file o snapshot', async () => {
  const h = harness();
  const initial = await h.publish(h.project());
  const objectsBefore = h.objects.size;
  const result = await h.remote.publish({ sid: 'survey1', expectedRev: 1, deleted: true, name: 'Prova' });
  assert.equal(result.ok, true);
  assert.equal(result.head.rev, 2);
  assert.equal(result.head.deleted, true);
  assert.equal(result.head.snapshotPath, '');
  assert.equal(h.objects.size, objectsBefore);
  assert.ok(h.objects.has(initial.head.snapshotPath));
});

test('close ferma listener e richieste; offline non avvia scritture', async () => {
  const h = harness();
  h.remote.watchHeads(() => {}, () => {});
  h.remote.close();
  assert.equal(h.unsubscribeCount, 1);
  await assert.rejects(h.remote.getHead('survey1'), { code: 'sync/session-ended' });
  const offline = harness(); offline.context.navigator.onLine = false;
  await assert.rejects(offline.publish(offline.project()), { code: 'sync/offline' });
  assert.equal(offline.events.length, 0);
});

test('snapshot pendenti non vengono consegnati come elenco remoto completo', async () => {
  const h = harness();
  const delivered = [];
  h.remote.watchHeads((heads, metadata) => delivered.push({ heads, metadata }), error => { throw error; });
  h.observer.next({ metadata: { hasPendingWrites: true }, docs: [] });
  assert.equal(delivered.length, 0);
  h.observer.next({ metadata: { hasPendingWrites: false, fromCache: true }, docs: [] });
  assert.equal(delivered.length, 1);
  assert.equal(delivered[0].metadata.fromCache, true);
});

test('limite file e hash semantico errato falliscono prima di upload', async () => {
  const h = harness();
  const file = await h.file('photo1', 'x'); file.size = h.backend.MAX_FILE_BYTES + 1;
  await assert.rejects(h.remote.publish({ sid: 'survey1', expectedRev: 0, snapshot: h.project([file]) }), { code: 'sync/file-too-large' });
  await assert.rejects(h.publish(h.project(), 0, { hash: '0'.repeat(64) }), { code: 'sync/invalid-hash' });
  assert.equal(h.objects.size, 0);
});

test('JSON canonica coincide con il protocollo del motore, anche per chiavi numeriche', () => {
  const h = harness();
  const engineSource = fs.readFileSync(path.join(__dirname, '../sorgenti/src/pwa_cloud_engine.js'), 'utf8');
  const protocol = vm.runInContext(engineSource + '\nCloudSyncProtocol;', vm.createContext({ console }));
  const value = h.project();
  value.survey.numericKeys = { 2: 'secondo', 10: 'decimo', 1: 'primo' };
  value.survey.text = 'Cucina – già verificata 🚪';
  value.items = [{ n: -0, a: 1e21, b: 0.00000001, pts: [[0, 1], [2, 3]] }];
  assert.equal(h.backend.canonicalStringify(value), protocol.stringify(value));
});
