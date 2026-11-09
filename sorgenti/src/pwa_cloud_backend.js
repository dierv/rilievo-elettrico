/* ============ FIREBASE: REVISIONI COMPLETE E FILE PRIVATI (solo PWA) ============ */
// La copia locale e la scelta dei conflitti appartengono al motore di sync.
// Qui si pubblica una revisione soltanto dopo aver salvato tutti i suoi file.
const CloudBackend = (() => {
  const MAX_FILE_BYTES = 20 * 1024 * 1024;
  const SCHEMA = 1;
  const ID_RE = /^[A-Za-z0-9_-]{1,128}$/;
  const HASH_RE = /^[a-f0-9]{64}$/;
  const PRIVATE_KEYS = new Set(['apikey', 'anthropickey', 'anthropicapikey', 'accesstoken', 'refreshtoken', 'idtoken', 'authorization', 'credential', 'credentials', 'password', 'asset', 'local', 'url', 'handle', 'directoryhandle', 'filehandle', '__proto__', 'constructor', 'prototype']);

  function fail(code, message) {
    const error = new Error(message);
    error.code = code;
    return error;
  }

  function identifier(value, label) {
    if (typeof value !== 'string' || !ID_RE.test(value) || /^__.*__$/.test(value)) throw fail('sync/invalid-id', label + ' non valido.');
    return value;
  }

  function hashValue(value) {
    if (typeof value !== 'string' || !HASH_RE.test(value)) throw fail('sync/invalid-hash', 'Impronta del file non valida.');
    return value;
  }

  // La normalizzazione mantiene l'ordine delle liste e ordina soltanto le chiavi.
  // Rifiuta oggetti del browser, valori non JSON e campi locali/riservati.
  function canonicalStringify(value) {
    let visited = 0;
    const ancestors = new Set();
    function visit(input, depth) {
      if (++visited > 1000000 || depth > 100) throw fail('sync/invalid-snapshot', 'Il sopralluogo supera la complessità supportata.');
      if (input === null || typeof input === 'boolean') return JSON.stringify(input);
      if (typeof input === 'string') {
        if (/^(?:blob:|file:|filesystem:|gs:)/i.test(input) || /firebasestorage\.googleapis\.com\/.*[?&]token=/i.test(input) || /\bsk-ant-[A-Za-z0-9_-]{12,}/.test(input)) {
          throw fail('sync/private-data', 'Un dato locale o una credenziale è presente nel sopralluogo da sincronizzare.');
        }
        return JSON.stringify(input);
      }
      if (typeof input === 'number' && Number.isFinite(input)) return JSON.stringify(input);
      if (!input || typeof input !== 'object' || ancestors.has(input)) throw fail('sync/invalid-snapshot', 'Il sopralluogo contiene un valore non salvabile.');
      ancestors.add(input);
      let output;
      if (Array.isArray(input)) {
        output = '[' + input.map(item => visit(item, depth + 1)).join(',') + ']';
      } else {
        if (Object.prototype.toString.call(input) !== '[object Object]') throw fail('sync/invalid-snapshot', 'Il sopralluogo contiene un oggetto locale non salvabile.');
        const fields = [];
        const descriptors = Object.getOwnPropertyDescriptors(input);
        for (const key of Object.keys(descriptors).sort()) {
          const field = descriptors[key];
          if (!field.enumerable) continue;
          if (field.get || field.set || PRIVATE_KEYS.has(key.toLowerCase().replace(/[-_]/g, '')) || ['__proto__', 'constructor', 'prototype'].includes(key)) {
            throw fail('sync/private-data', 'Il campo «' + key + '» deve restare su questo dispositivo.');
          }
          fields.push(JSON.stringify(key) + ':' + visit(field.value, depth + 1));
        }
        output = '{' + fields.join(',') + '}';
      }
      ancestors.delete(input);
      return output;
    }
    return visit(value, 0);
  }

  async function digestBlob(blob) {
    if (!blob || typeof blob.arrayBuffer !== 'function') throw fail('sync/invalid-file', 'File non disponibile.');
    if (!globalThis.crypto || !globalThis.crypto.subtle) throw fail('sync/crypto-unavailable', 'Apri Sopralux dal suo indirizzo HTTPS per sincronizzare.');
    const digest = await globalThis.crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function validateFile(file) {
    if (!file || typeof file !== 'object' || typeof file.id !== 'string' || !file.id.length || file.id.length > 256 || /[\u0000-\u001f]/.test(file.id)) {
      throw fail('sync/invalid-file', 'Identificativo del file non valido.');
    }
    hashValue(file.sha256);
    if (!Number.isSafeInteger(file.size) || file.size < 0 || file.size > MAX_FILE_BYTES) throw fail('sync/file-too-large', 'Un file supera il limite di 20 MiB per la sincronizzazione.');
    if (typeof file.type !== 'string' || file.type.length > 128 || /[\r\n]/.test(file.type)) throw fail('sync/invalid-file', 'Tipo del file non valido.');
    return file;
  }

  function validateSnapshot(snapshot, sid) {
    if (!snapshot || snapshot.app !== 'sopralux-sync' || snapshot.schema !== SCHEMA || snapshot.id !== sid || snapshot.kind !== (sid === '_sopralux_library' ? 'library' : 'survey')) {
      throw fail('sync/invalid-snapshot', 'La copia online del sopralluogo non è compatibile con questa versione.');
    }
    if (!Array.isArray(snapshot.files) || snapshot.files.length > 25000) throw fail('sync/invalid-snapshot', 'Elenco file non valido.');
    const ids = new Set();
    for (const file of snapshot.files) {
      validateFile(file);
      if (ids.has(file.id)) throw fail('sync/invalid-snapshot', 'Lo stesso identificativo file compare più volte.');
      ids.add(file.id);
    }
    if (snapshot.kind === 'survey') {
      if (!snapshot.survey || snapshot.survey.id !== sid || !['rooms', 'items', 'draws', 'vnotes', 'photos'].every(key => Array.isArray(snapshot[key]))) {
        throw fail('sync/invalid-snapshot', 'La copia del sopralluogo è incompleta.');
      }
    } else if (!snapshot.lib || !Array.isArray(snapshot.lib.symbols) || snapshot.files.length) {
      throw fail('sync/invalid-snapshot', 'La copia della legenda è incompleta.');
    }
  }

  function open(options) {
    const sdk = options.sdk || (typeof window !== 'undefined' && window.FB);
    if (!sdk || !sdk.getFirestore || !sdk.getStorage || !sdk.getMetadata) throw fail('sync/sdk-unavailable', 'Aggiorna Sopralux per attivare la sincronizzazione.');
    const uid = identifier(options.uid, 'Account');
    const deviceId = identifier(options.deviceId, 'Dispositivo');
    const auth = sdk.getAuth(options.app);
    const db = sdk.getFirestore(options.app);
    const storage = sdk.getStorage(options.app);
    // Un'interruzione di rete non tiene occupata la coda per i retry predefiniti.
    storage.maxUploadRetryTime = 45000;
    storage.maxOperationRetryTime = 30000;
    let active = true;
    const listeners = new Set();
    const verified = new Map();

    function check(guard, online) {
      if (!active || !auth.currentUser || auth.currentUser.uid !== uid || (options.isCurrent && options.isCurrent() === false) || (guard && guard() === false)) {
        throw fail('sync/session-ended', 'L’account è cambiato: la sincronizzazione precedente è stata interrotta.');
      }
      if (online && typeof navigator !== 'undefined' && navigator.onLine === false) throw fail('sync/offline', 'Offline: le modifiche restano in coda su questo dispositivo.');
    }

    function root(sid) { return 'users/' + uid + '/surveys/' + identifier(sid, 'Sopralluogo'); }
    function filePath(sid, file) { return root(sid) + '/files/' + hashValue(file.sha256); }
    function snapshotPath(sid, hash) { return root(sid) + '/snapshots/' + hashValue(hash) + '.json'; }
    function headRef(sid) { return sdk.doc(db, 'users', uid, 'surveys', identifier(sid, 'Sopralluogo')); }

    function parseHead(sid, data) {
      identifier(sid, 'Sopralluogo');
      if (!data || data.schema !== SCHEMA || !Number.isSafeInteger(data.rev) || data.rev < 1 || typeof data.del !== 'boolean' || data.kind !== (sid === '_sopralux_library' ? 'library' : 'survey') || typeof data.name !== 'string' || data.name.length > 200) {
        throw fail('sync/invalid-head', 'Il riferimento online del sopralluogo non è valido.');
      }
      identifier(data.dev, 'Dispositivo online');
      if (data.del) {
        if (data.hash !== '' || data.snapshotHash !== '' || data.snapshotPath !== '') throw fail('sync/invalid-head', 'La cancellazione online non è valida.');
      } else {
        hashValue(data.hash);
        hashValue(data.snapshotHash);
        if (data.snapshotPath !== snapshotPath(sid, data.snapshotHash)) throw fail('sync/invalid-head', 'La copia online indica un percorso non autorizzato.');
      }
      const modifiedAt = data.upd && typeof data.upd.toMillis === 'function' ? data.upd.toMillis() : null;
      if (modifiedAt !== null && (!Number.isFinite(modifiedAt) || modifiedAt < 0)) throw fail('sync/invalid-head', 'Data della revisione online non valida.');
      return { id: sid, rev: data.rev, hash: data.hash, deleted: data.del, modifiedAt, snapshotPath: data.snapshotPath, snapshotHash: data.snapshotHash, name: data.name, dev: data.dev, kind: data.kind, schema: SCHEMA };
    }

    async function getHead(sid, guard) {
      check(guard, true);
      const snapshot = await sdk.getDocFromServer(headRef(sid));
      check(guard);
      return snapshot.exists() ? parseHead(sid, snapshot.data()) : null;
    }

    function watchHeads(nextHeads, onError) {
      check();
      const unsubscribe = sdk.onSnapshot(sdk.collection(db, 'users', uid, 'surveys'), { includeMetadataChanges: true }, snapshot => {
        try {
          check();
          // Non consegnare una vista parziale con serverTimestamp ancora pendenti.
          if (snapshot.metadata && snapshot.metadata.hasPendingWrites) return;
          const heads = snapshot.docs.map(document => parseHead(document.id, document.data()));
          nextHeads(heads, { fromCache: !!(snapshot.metadata && snapshot.metadata.fromCache) });
        } catch (error) {
          if (active && error.code !== 'sync/session-ended' && onError) onError(error);
        }
      }, error => { if (active && onError) onError(error); });
      listeners.add(unsubscribe);
      return () => { listeners.delete(unsubscribe); unsubscribe(); };
    }

    function metadataMatches(metadata, size, hash) {
      return metadata && metadata.size === size && metadata.customMetadata && metadata.customMetadata.sha256 === hash;
    }

    async function hasObject(path, size, hash, guard) {
      check(guard, true);
      if (verified.has(path)) {
        if (verified.get(path) !== size) throw fail('sync/integrity', 'La dimensione del file non corrisponde alla sua impronta.');
        return true;
      }
      try {
        const metadata = await sdk.getMetadata(sdk.ref(storage, path));
        check(guard);
        if (!metadataMatches(metadata, size, hash)) throw fail('sync/integrity', 'La copia online di un file non corrisponde alla sua impronta.');
        verified.set(path, size);
        return true;
      } catch (error) {
        check(guard);
        if (error && error.code === 'storage/object-not-found') return false;
        throw error;
      }
    }

    async function createObject(path, blob, type, hash, guard) {
      check(guard, true);
      if (!blob || typeof blob.arrayBuffer !== 'function' || blob.size > MAX_FILE_BYTES) throw fail('sync/file-too-large', 'Un file supera il limite di 20 MiB per la sincronizzazione.');
      if (await hasObject(path, blob.size, hash, guard)) return;
      check(guard, true);
      try {
        await sdk.uploadBytes(sdk.ref(storage, path), blob, { contentType: type || 'application/octet-stream', cacheControl: 'private, max-age=0, no-store', customMetadata: { sha256: hash, schema: String(SCHEMA) } });
        check(guard);
        verified.set(path, blob.size);
      } catch (error) {
        check(guard);
        // Due dispositivi possono caricare lo stesso hash insieme: le regole
        // impediscono l'overwrite; accetta solo un oggetto già completo e uguale.
        try { if (await hasObject(path, blob.size, hash, guard)) return; } catch (inspectionError) {
          if (inspectionError && inspectionError.code === 'sync/session-ended') throw inspectionError;
        }
        throw error;
      }
    }

    async function putFile(sid, file, blob, guard) {
      validateFile(file);
      check(guard, true);
      const path = filePath(sid, file);
      if (await hasObject(path, file.size, file.sha256, guard)) return;
      if (!blob || blob.size !== file.size || await digestBlob(blob) !== file.sha256) throw fail('sync/missing-local-file', 'Manca la copia locale completa di un file: la revisione non è stata pubblicata.');
      check(guard, true);
      await createObject(path, blob, file.type, file.sha256, guard);
    }

    async function getFile(sid, file, guard) {
      validateFile(file);
      check(guard, true);
      const blob = await sdk.getBlob(sdk.ref(storage, filePath(sid, file)), MAX_FILE_BYTES);
      check(guard);
      if (blob.size !== file.size || await digestBlob(blob) !== file.sha256) throw fail('sync/integrity', 'Il file scaricato è incompleto o non corrisponde alla revisione.');
      check(guard);
      return file.type && blob.type !== file.type ? blob.slice(0, blob.size, file.type) : blob;
    }

    async function readSnapshot(head, guard) {
      check(guard, true);
      if (!head || !Number.isSafeInteger(head.rev) || head.rev < 1 || typeof head.deleted !== 'boolean') throw fail('sync/invalid-head', 'Revisione online non valida.');
      identifier(head.id, 'Sopralluogo');
      if (head.deleted) return null;
      hashValue(head.hash);
      hashValue(head.snapshotHash);
      if (head.snapshotPath !== snapshotPath(head.id, head.snapshotHash)) throw fail('sync/invalid-head', 'La copia online indica un percorso non autorizzato.');
      const blob = await sdk.getBlob(sdk.ref(storage, head.snapshotPath), MAX_FILE_BYTES);
      check(guard);
      if (await digestBlob(blob) !== head.snapshotHash) throw fail('sync/integrity', 'La copia online del sopralluogo è incompleta.');
      check(guard);
      let snapshot;
      try { snapshot = JSON.parse(await blob.text()); } catch (error) { throw fail('sync/invalid-snapshot', 'La copia online del sopralluogo non è leggibile.'); }
      check(guard);
      validateSnapshot(snapshot, head.id);
      const canonical = canonicalStringify(snapshot);
      if (await digestBlob(new Blob([canonical], { type: 'application/json' })) !== head.hash) throw fail('sync/integrity', 'Il contenuto del sopralluogo non corrisponde alla revisione online.');
      check(guard);
      return snapshot;
    }

    async function publish(request) {
      const sid = identifier(request.sid, 'Sopralluogo');
      const guard = request.guard;
      check(guard, true);
      if (!Number.isSafeInteger(request.expectedRev) || request.expectedRev < 0 || request.expectedRev >= Number.MAX_SAFE_INTEGER) throw fail('sync/invalid-revision', 'Revisione di partenza non valida.');
      const deleted = request.deleted === true;
      let blob, snapshotHash = '', hash = '', path = '';
      if (!deleted) {
        validateSnapshot(request.snapshot, sid);
        const serialized = canonicalStringify(request.snapshot);
        const preparedFiles = JSON.parse(serialized).files;
        blob = new Blob([serialized], { type: 'application/json' });
        if (blob.size > MAX_FILE_BYTES) throw fail('sync/file-too-large', 'Il sopralluogo supera il limite di 20 MiB per la copia dei dati.');
        snapshotHash = await digestBlob(blob);
        check(guard, true);
        hash = request.hash ? hashValue(request.hash) : snapshotHash;
        if (hash !== snapshotHash) throw fail('sync/invalid-hash', 'Il sopralluogo è cambiato durante la preparazione: riprova la sincronizzazione.');
        path = snapshotPath(sid, snapshotHash);
        for (const file of preparedFiles) {
          check(guard, true);
          if (await hasObject(filePath(sid, file), file.size, file.sha256, guard)) continue;
          const local = options.readLocalBlob ? await options.readLocalBlob(file, sid) : null;
          check(guard, true);
          await putFile(sid, file, local, guard);
        }
        await createObject(path, blob, 'application/json', snapshotHash, guard);
      }
      check(guard, true);
      const name = typeof request.name === 'string' ? request.name.slice(0, 200) : sid === '_sopralux_library' ? 'Legenda e impostazioni' : 'Sopralluogo';
      const data = { schema: SCHEMA, rev: request.expectedRev + 1, hash, snapshotHash, snapshotPath: path, name, del: deleted, dev: deviceId, kind: sid === '_sopralux_library' ? 'library' : 'survey' };
      const result = await sdk.runTransaction(db, async transaction => {
        check(guard, true);
        const reference = headRef(sid);
        const currentDocument = await transaction.get(reference);
        check(guard, true);
        const current = currentDocument.exists() ? parseHead(sid, currentDocument.data()) : null;
        if ((current ? current.rev : 0) !== request.expectedRev) return { ok: false, head: current };
        // Nessun upload o aggiornamento locale nella callback: Firebase può
        // rieseguirla se un altro dispositivo modifica la revisione.
        transaction.set(reference, { ...data, upd: sdk.serverTimestamp() });
        return { ok: true, head: parseHead(sid, data) };
      });
      check(guard);
      if (!result.ok) return result;
      // La transazione è già riuscita. Un errore di questa lettura aggiuntiva
      // non trasforma un commit riuscito in un invio fallito. Non attribuire
      // mai alla nostra copia una revisione successiva scritta da un altro.
      try {
        const confirmed = await getHead(sid, guard);
        if (confirmed && confirmed.rev === result.head.rev && confirmed.hash === result.head.hash && confirmed.deleted === result.head.deleted) result.head = confirmed;
      } catch (error) {
        check(guard);
      }
      return result;
    }

    check();
    return Object.freeze({
      uid, deviceId, watchHeads, getHead, readSnapshot, publish, putFile, getFile,
      close() { active = false; listeners.forEach(unsubscribe => unsubscribe()); listeners.clear(); verified.clear(); }
    });
  }

  return Object.freeze({ MAX_FILE_BYTES, SCHEMA, canonicalStringify, digestBlob, open });
})();
