const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { createHash } = require('node:crypto');

const sdkRequire = createRequire(path.join(__dirname, '../sorgenti/firebase/package.json'));
const enabled = !!(process.env.FIRESTORE_EMULATOR_HOST && process.env.FIREBASE_STORAGE_EMULATOR_HOST);

test('regole Firestore e Storage: isolamento account, revisioni e immutabilità', { skip: !enabled, timeout: 180000 }, async t => {
  const { initializeTestEnvironment, assertSucceeds, assertFails } = sdkRequire('@firebase/rules-unit-testing');
  const { doc, collection, getDoc, getDocs, setDoc, deleteDoc, serverTimestamp, Timestamp } = sdkRequire('firebase/firestore');
  const { ref, uploadBytes, getBytes, updateMetadata, deleteObject } = sdkRequire('firebase/storage');
  const environment = await initializeTestEnvironment({
    projectId: 'demo-sopralux-sync',
    firestore: { rules: fs.readFileSync(path.join(__dirname, '../firebase/firestore.rules'), 'utf8') },
    storage: { rules: fs.readFileSync(path.join(__dirname, '../firebase/storage.rules'), 'utf8') }
  });
  const alice = environment.authenticatedContext('alice');
  const bob = environment.authenticatedContext('bob');
  const guest = environment.unauthenticatedContext();
  const bytes = Buffer.from('synthetic-file-bytes');
  const hash = createHash('sha256').update(bytes).digest('hex');
  const headPath = 'users/alice/surveys/survey1';
  const head = (extra = {}) => ({ schema: 1, rev: 1, hash, snapshotHash: hash, snapshotPath: headPath + '/snapshots/' + hash + '.json', name: 'Test sintetico', del: false, dev: 'device-a', kind: 'survey', upd: serverTimestamp(), ...extra });
  const filePath = headPath + '/files/' + hash;
  const metadata = { contentType: 'image/jpeg', customMetadata: { sha256: hash, schema: '1' } };
  try {
    await t.test('solo proprietario autenticato legge e scrive head e elenco', async () => {
      await assertSucceeds(setDoc(doc(alice.firestore(), headPath), head()));
      await assertSucceeds(getDoc(doc(alice.firestore(), headPath)));
      await assertSucceeds(getDocs(collection(alice.firestore(), 'users/alice/surveys')));
      await assertFails(getDoc(doc(bob.firestore(), headPath)));
      await assertFails(getDoc(doc(guest.firestore(), headPath)));
      await assertFails(getDocs(collection(bob.firestore(), 'users/alice/surveys')));
      await assertFails(setDoc(doc(bob.firestore(), headPath), head({ rev: 2 })));
      await assertFails(setDoc(doc(guest.firestore(), 'users/alice/surveys/new1'), head({ snapshotPath: 'users/alice/surveys/new1/snapshots/' + hash + '.json' })));
    });

    await t.test('head rifiuta revisione vecchia, salti, campi arbitrari, data client e percorsi esterni', async () => {
      await assertFails(setDoc(doc(alice.firestore(), headPath), head()));
      await assertFails(setDoc(doc(alice.firestore(), headPath), head({ rev: 3 })));
      await assertFails(setDoc(doc(alice.firestore(), headPath), head({ rev: 2, apiKey: 'must-stay-local' })));
      await assertFails(setDoc(doc(alice.firestore(), headPath), head({ rev: 2, upd: Timestamp.fromMillis(123) })));
      await assertFails(setDoc(doc(alice.firestore(), headPath), head({ rev: 2, snapshotPath: 'users/bob/surveys/survey1/snapshots/' + hash + '.json' })));
      await assertFails(setDoc(doc(alice.firestore(), headPath), head({ rev: 2, dev: '../other' })));
      await assertFails(setDoc(doc(alice.firestore(), 'unexpected/path'), { hello: 'world' }));
    });

    await t.test('cancellazione ammessa solo come nuova revisione tombstone', async () => {
      await assertSucceeds(setDoc(doc(alice.firestore(), headPath), head({ rev: 2, del: true, hash: '', snapshotHash: '', snapshotPath: '' })));
      await assertFails(deleteDoc(doc(alice.firestore(), headPath)));
      await assertFails(setDoc(doc(alice.firestore(), headPath), head({ rev: 3, del: true })));
    });

    await t.test('legenda usa solo l’identificativo e il tipo riservati', async () => {
      const location = 'users/alice/surveys/_sopralux_library';
      await assertFails(setDoc(doc(alice.firestore(), location), head({ snapshotPath: location + '/snapshots/' + hash + '.json' })));
      await assertSucceeds(setDoc(doc(alice.firestore(), location), head({ kind: 'library', snapshotPath: location + '/snapshots/' + hash + '.json' })));
    });

    await t.test('solo proprietario autenticato carica e scarica i binari', async () => {
      await assertSucceeds(uploadBytes(ref(alice.storage(), filePath), bytes, metadata));
      await assertSucceeds(getBytes(ref(alice.storage(), filePath)));
      await assertFails(getBytes(ref(bob.storage(), filePath)));
      await assertFails(getBytes(ref(guest.storage(), filePath)));
      await assertFails(uploadBytes(ref(bob.storage(), headPath + '/files/' + 'b'.repeat(64)), bytes, { ...metadata, customMetadata: { sha256: 'b'.repeat(64), schema: '1' } }));
      await assertFails(uploadBytes(ref(guest.storage(), headPath + '/files/' + 'c'.repeat(64)), bytes, { ...metadata, customMetadata: { sha256: 'c'.repeat(64), schema: '1' } }));
    });

    await t.test('file già creati non sono sovrascrivibili, modificabili o cancellabili', async () => {
      await assertFails(uploadBytes(ref(alice.storage(), filePath), bytes, metadata));
      await assertFails(updateMetadata(ref(alice.storage(), filePath), { contentType: 'application/pdf' }));
      await assertFails(deleteObject(ref(alice.storage(), filePath)));
    });

    await t.test('Storage rifiuta path impropri, metadata errati e oltre 20 MiB', async () => {
      const invalidHash = 'd'.repeat(64);
      await assertFails(uploadBytes(ref(alice.storage(), headPath + '/files/not-a-hash'), bytes, metadata));
      await assertFails(uploadBytes(ref(alice.storage(), headPath + '/files/' + invalidHash), bytes, metadata));
      await assertFails(uploadBytes(ref(alice.storage(), 'public/file'), bytes, metadata));
      await assertFails(uploadBytes(ref(alice.storage(), headPath + '/files/' + invalidHash), new Uint8Array(20 * 1024 * 1024 + 1), { contentType: 'application/octet-stream', customMetadata: { sha256: invalidHash, schema: '1' } }));
    });

    await t.test('snapshot privati accettano solo JSON con nome coerente e restano immutabili', async () => {
      const jsonPath = headPath + '/snapshots/' + hash + '.json';
      await assertFails(uploadBytes(ref(alice.storage(), jsonPath), bytes, metadata));
      await assertSucceeds(uploadBytes(ref(alice.storage(), jsonPath), bytes, { ...metadata, contentType: 'application/json' }));
      await assertSucceeds(getBytes(ref(alice.storage(), jsonPath)));
      await assertFails(getBytes(ref(bob.storage(), jsonPath)));
      await assertFails(uploadBytes(ref(alice.storage(), jsonPath), bytes, { ...metadata, contentType: 'application/json' }));
    });
  } finally {
    await environment.cleanup();
  }
});
