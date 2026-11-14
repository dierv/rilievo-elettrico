/* ============ SINCRONIZZAZIONE PWA: archivio privato per account ============ */
// Questo modulo è incluso soltanto nella PWA. Le capacità e i salvataggi Claude
// rimangono quelli originali. Anche offline il database resta legato all'account
// scelto all'avvio; cambiare account richiede un riavvio dopo il salvataggio locale.
const PwaCloud = {
  uid: null, dbName: null, prepared: false, started: false, switching: false,
  remote: null, engine: null, generation: 0, documentEpoch: 0, activities: 0,
  captureWanted: new Set(), captureTail: Promise.resolve(), statusValue: {}, planLoads: new Set(),
  error: '', localError: '', locked: false, applying: false, migrationNotice: '',
  json: value => JSON.parse(JSON.stringify(value)),
  current() { return !this.switching && !!this.uid && FirebaseAccount.user?.uid === this.uid; },
  setting(key, value) {
    localStorage.setItem('ril_' + key, JSON.stringify(value));
    if (JSON.stringify(KV.get(key)) !== JSON.stringify(value)) throw new Error('Impossibile memorizzare la configurazione locale.');
  },
  openDatabase(name) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, 2);
      request.onupgradeneeded = () => {
        const db = request.result;
        for (const [store, keyPath] of [['docs', 'path'], ['blobs', 'id'], ['cloud', 'id']]) {
          if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath });
        }
      };
      request.onsuccess = () => { request.result.onversionchange = () => request.result.close(); resolve(request.result); };
      request.onerror = () => reject(request.error || new Error('Archivio locale non disponibile.'));
      request.onblocked = () => reject(new Error('Chiudi le altre schede di Sopralux e riapri l’app.'));
    });
  },
  transaction(db, store, mode, fn) {
    return new Promise((resolve, reject) => {
      let tx;
      try {
        if (!db) throw new Error('Archivio locale non aperto.');
        tx = db.transaction(store, mode);
        const request = fn(tx.objectStore(store));
        tx.oncomplete = () => {
          if (db === IDB.db && store === 'docs' && mode === 'readwrite') this.documentEpoch++;
          resolve(request ? request.result : true);
        };
        tx.onerror = tx.onabort = () => reject(tx.error || new Error('Salvataggio locale non riuscito.'));
      } catch (error) { try { tx?.abort(); } catch (_) {} reject(error); }
    });
  },
  atomic(db, changes, guard = () => true) {
    return new Promise((resolve, reject) => {
      let tx;
      try {
        if (!guard()) return resolve(false);
        const stores = [...new Set(changes.map(change => change.store))];
        if (!stores.length) return resolve(true);
        tx = db.transaction(stores, 'readwrite');
        for (const change of changes) {
          const st = tx.objectStore(change.store);
          if (change.remove !== undefined) st.delete(change.remove); else st.put(change.value);
        }
        tx.oncomplete = () => { if (db === IDB.db && stores.includes('docs')) this.documentEpoch++; resolve(true); };
        tx.onerror = tx.onabort = () => reject(tx.error || new Error('Salvataggio locale non riuscito.'));
      } catch (error) { try { tx?.abort(); } catch (_) {} reject(error); }
    });
  },
  async prepare() {
    if (this.prepared) return;
    FirebaseAccount.init();
    let first = true;
    const initial = await new Promise(resolve => {
      const finish = user => { if (!first) return; first = false; clearTimeout(timer); resolve(user); };
      const timer = setTimeout(() => finish(null), 8000);
      if (!FirebaseAccount.auth || !FirebaseAccount.sdk) return finish(null);
      this.authUnsubscribe = FirebaseAccount.sdk.onAuthStateChanged(FirebaseAccount.auth, user => {
        if (first) finish(user);
        else if (this.prepared && (user?.uid || null) !== this.uid) this.accountChanged();
      }, () => finish(null));
    });
    this.uid = initial?.uid || null;
    let guestName = KV.get('cloudGuestDb', 'rilievoEL');
    if (!/^rilievoEL(?:-guest-[a-zA-Z0-9_-]+)?$/.test(guestName)) guestName = 'rilievoEL';
    if (this.uid) {
      this.dbName = 'rilievoEL-google-' + this.uid;
      IDB.db = await this.openDatabase(this.dbName);
      const pending = await IDB.get('docs', '__cloudMigrationPending');
      if (pending?.sourceName && pending.sourceName !== guestName) await this.migrateGuest(pending.sourceName);
      await this.migrateGuest(guestName);
    } else {
      let guest = await this.openDatabase(guestName);
      const claim = await this.transaction(guest, 'docs', 'readonly', st => st.get('__cloudMigration'));
      if (claim?.uid) {
        guest.close(); guestName = 'rilievoEL-guest-' + uid('g');
        this.setting('cloudGuestDb', guestName); guest = await this.openDatabase(guestName);
      }
      this.dbName = guestName; IDB.db = guest;
    }
    this.prepared = true;
  },
  async migrateGuest(sourceName) {
    if (sourceName === this.dbName) return;
    const source = await this.openDatabase(sourceName);
    try {
      const read = store => this.transaction(source, store, 'readonly', st => st.getAll());
      const claim = await this.transaction(source, 'docs', 'readonly', st => st.get('__cloudMigration'));
      if (claim?.uid && claim.uid !== this.uid) return;
      if (claim?.done) {
        if (KV.get('cloudGuestDb', 'rilievoEL') === sourceName) this.setting('cloudGuestDb', 'rilievoEL-guest-' + uid('g'));
        await IDB.del('docs', '__cloudMigrationPending'); return;
      }
      const docs = await read('docs');
      const projects = docs.filter(d => d.data?.type === 'survey' && d.path.startsWith('data/users/local/'));
      const library = docs.find(d => d.data?.type === 'lib');
      const defaultLibrary = library && CloudSyncProtocol.stringify(library.data.symbols) === CloudSyncProtocol.stringify(DEFAULT_SYMBOLS);
      if (!projects.length && (!library || defaultLibrary)) return;
      // The target journal survives a crash even when the signed-out guest pointer changes.
      await IDB.put('docs', { path: '__cloudMigrationPending', sourceName, uid: this.uid });
      const claimed = await new Promise((resolve, reject) => {
        const tx = source.transaction('docs', 'readwrite'); const st = tx.objectStore('docs');
        let accepted = false; const r = st.get('__cloudMigration');
        r.onsuccess = () => { if (!r.result?.uid || r.result.uid === this.uid) { accepted = true; st.put({ path: '__cloudMigration', uid: this.uid, done: !!r.result?.done }); } };
        tx.oncomplete = () => resolve(accepted); tx.onerror = tx.onabort = () => reject(tx.error || new Error('Associazione dei dati locali non riuscita.'));
      });
      if (!claimed) { await IDB.del('docs', '__cloudMigrationPending'); return; }
      const existing = await IDB.all('docs'); const blobs = await read('blobs'); const changes = [];
      for (const meta of projects) {
        const marker = '__imported:' + sourceName + ':' + meta.data.id;
        if (existing.some(d => d.path === marker)) continue;
        const root = 'data/users/local/' + meta.data.id;
        const rows = docs.filter(d => d.path === root || d.path.startsWith(root + '/'));
        const collision = existing.some(d => d.path === root);
        const ids = new Map();
        if (collision) {
          ids.set(meta.data.id, uid('s'));
          for (const p of meta.data.plans || []) ids.set(p.id, uid('pl'));
          for (const d of rows) {
            if (d.data?.type === 'photo') ids.set(d.data.id, uid('ph'));
            for (const p of d.data?.photos || []) if (!ids.has(p.id)) ids.set(p.id, uid('ph'));
            for (const n of d.data?.vnotes || []) ids.set(n.id, uid('n'));
          }
        }
        const remap = value => {
          if (typeof value === 'string') return ids.get(value) || value;
          if (Array.isArray(value)) return value.map(remap);
          if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, v]) => [ids.get(key) || key, remap(v)]));
          return value;
        };
        for (const row of rows) {
          const copy = { ...row, data: remap(row.data), path: row.path.split('/').map(p => ids.get(p) || p).join('/'), sid: ids.get(row.sid) || row.sid, dirty: true };
          if (collision && copy.data.type === 'survey') copy.data.name += ' (dal dispositivo)';
          changes.push({ store: 'docs', value: copy });
        }
        for (const blob of blobs.filter(b => b.sid === meta.data.id)) {
          const ref = ids.get(blob.ref) || blob.ref;
          const id = blob.id.startsWith('__file_') ? blob.id : blob.id.replace(blob.ref, ref);
          const logicalId = blob.logicalId ? blob.logicalId.replace(blob.ref, ref) : undefined;
          changes.push({ store: 'blobs', value: { ...blob, id, ...(logicalId ? { logicalId } : {}), ref, sid: ids.get(blob.sid) || blob.sid } });
        }
        changes.push({ store: 'docs', value: { path: marker, imported: Date.now() } });
      }
      if (library) {
        const old = existing.find(d => d.path === library.path);
        changes.push({ store: 'docs', value: old ? { path: '__importedLibrary:' + sourceName, data: library.data } : { ...library, dirty: true } });
      }
      const handle = docs.find(d => d.path === '__archivio');
      if (handle && !existing.some(d => d.path === '__archivio')) changes.push({ store: 'docs', value: handle });
      await this.atomic(IDB.db, changes);
      // Verify the commit before declaring the source migrated. The source is retained.
      for (const project of projects) {
        if (!await IDB.get('docs', '__imported:' + sourceName + ':' + project.data.id)) throw new Error('Importazione locale incompleta.');
      }
      await this.transaction(source, 'docs', 'readwrite', st => st.put({ path: '__cloudMigration', uid: this.uid, done: true }));
      if (KV.get('cloudGuestDb', 'rilievoEL') === sourceName) this.setting('cloudGuestDb', 'rilievoEL-guest-' + uid('g'));
      await IDB.del('docs', '__cloudMigrationPending');
      this.migrationNotice = projects.length ? `${projects.length} impianti locali associati a questo account.` : '';
    } finally { source.close(); }
  },
  normalized(value) {
    const excluded = new Set(['asset', 'local', '_url', '_force', 'apiKey', 'api_key', 'password', 'token', 'handle']);
    const visit = input => {
      if (Array.isArray(input)) return input.map(visit);
      if (input && typeof input === 'object') return Object.fromEntries(Object.entries(input).filter(([key, v]) => !excluded.has(key) && v !== undefined).map(([key, v]) => [key, visit(v)]));
      return input;
    };
    return visit(value);
  },
  async blobDescriptor(logicalId, object, kind, sid, before) {
    let record = await IDB.get('blobs', logicalId);
    const expected = object.cloudFile || (/\/files\/([a-f0-9]{64})$/.exec(object.asset || '') || [])[1];
    if (expected && (!record?.sha256 || record.sha256 !== expected)) record = await IDB.get('blobs', '__file_' + expected);
    if (!expected && before && record?.ts > before) record = null;
    if ((!record || !record.blob) && !expected) {
      const versions = (await IDB.all('blobs')).filter(b => b.logicalId === logicalId && b.sid === sid && (!before || b.ts <= before)).sort((a, b) => b.ts - a.ts);
      record = versions[0];
    }
    if (!record?.blob) throw Object.assign(new Error(`Allegato non disponibile su questo dispositivo: ${logicalId}. Apri l’impianto sul dispositivo che lo contiene e sincronizza.`), { code: 'sync/file-missing' });
    const sha256 = record.sha256 || await CloudBackend.digestBlob(record.blob);
    if (expected && sha256 !== expected) throw new Error('La versione locale di un allegato non corrisponde al progetto.');
    if (!record.sha256) { record.sha256 = sha256; await IDB.put('blobs', record); }
    if (!await IDB.get('blobs', '__file_' + sha256)) await IDB.put('blobs', { ...record, id: '__file_' + sha256, logicalId });
    object.cloudFile = sha256;
    return { id: logicalId + '.' + sha256, localId: logicalId, sha256, size: record.blob.size, type: record.blob.type || 'application/octet-stream', kind, ref: object.id };
  },
  async makeSnapshot(id) {
    if (id === '_sopralux_library') {
      const row = await IDB.get('docs', base() + '/lib');
      if (!row?.data) return null;
      return { app: 'sopralux-sync', schema: 1, id, kind: 'library', lib: this.normalized(row.data), files: [] };
    }
    const snap = await snapshotFromIDB(id); if (!snap) return null;
    const fileMap = new Map();
    const add = async (object, kind, before) => {
      const file = await this.blobDescriptor(kind + '_' + object.id, object, kind, id, before);
      fileMap.set(file.id, file);
    };
    for (const plan of snap.survey.plans || []) await add(plan, 'plan');
    for (const photo of snap.photos || []) await add(photo, 'photo');
    for (const note of snap.vnotes || []) if (note.mime) await add(note, 'audio');
    for (const closure of Object.values(snap.closure || {})) {
      for (const photo of closure.photos || []) await add(photo, 'photo', closure.at);
      for (const note of closure.vnotes || []) if (note.mime) await add(note, 'audio', closure.at);
    }
    const clean = this.normalized(snap); delete clean.v;
    for (const key of ['updated', 'dir', 'arch', 'archGen', 'lastBackup']) delete clean.survey[key];
    const byId = (a, b) => String(a.id) < String(b.id) ? -1 : String(a.id) > String(b.id) ? 1 : 0;
    for (const name of ['rooms', 'items', 'photos', 'draws', 'vnotes']) clean[name] = (clean[name] || []).sort(byId);
    return { ...clean, app: 'sopralux-sync', schema: 1, id, kind: 'survey', files: [...fileMap.values()].sort(byId) };
  },
  capture(ids) {
    for (const id of ids || []) if (id) this.captureWanted.add(id);
    const work = async () => {
      for (const id of [...this.captureWanted]) {
        try {
          if (this.uploadingSids?.get(id) || [...(this.failedAssets?.values() || [])].some(file => file.sid === id)) continue;
          const epoch = this.documentEpoch;
          const snapshot = await this.makeSnapshot(id);
          if (!snapshot) { this.captureWanted.delete(id); continue; }
          const hash = await CloudSyncProtocol.hash(snapshot);
          if (epoch !== this.documentEpoch) continue;
          const previous = await IDB.get('cloud', id);
          if (previous?.hash !== hash || previous?.deleted) {
            const row = await IDB.get('docs', id === '_sopralux_library' ? base() + '/lib' : base() + '/' + id);
            const state = { ...previous, id, version: (previous?.version || 0) + 1, snapshot, hash, deleted: false, modifiedAt: row?.data?.updated || row?.ts || Date.now(), name: id === '_sopralux_library' ? 'Libreria simboli' : snapshot.survey.name, base: previous?.base || null, conflict: previous?.conflict || null };
            if (epoch !== this.documentEpoch) continue;
            const saved = await this.updateState(id, current => ({ ...state, base: current?.base || null, conflict: current?.conflict || null }), () => epoch === this.documentEpoch);
            if (!saved) continue;
          }
          this.captureWanted.delete(id);
          if (this.engine && this.current()) this.engine.notifyLocal(id);
        } catch (error) { this.error = this.message(error); }
      }
      this.refresh();
    };
    this.captureTail = this.captureTail.catch(() => {}).then(work);
    return this.captureTail;
  },
  async captureAll() {
    const rows = await IDB.all('docs');
    return this.capture(rows.filter(d => d.data?.type === 'survey' || d.data?.type === 'lib').map(d => d.data.type === 'lib' ? '_sopralux_library' : d.data.id));
  },
  async readLocalBlob(file) {
    const primary = await IDB.get('blobs', file.localId || file.kind + '_' + file.ref);
    if (primary?.blob && (primary.sha256 || await CloudBackend.digestBlob(primary.blob)) === file.sha256) return primary.blob;
    return (await IDB.get('blobs', '__file_' + file.sha256))?.blob || null;
  },
  updateState(id, transform, guard = () => true) {
    return new Promise((resolve, reject) => {
      let tx; let next = null;
      try {
        tx = IDB.db.transaction(['cloud', 'docs'], 'readwrite');
        const store = tx.objectStore('cloud'), request = store.get(id);
        request.onsuccess = () => {
          try {
            if (!guard()) return;
            const current = request.result || null; const patch = transform(current);
            if (!patch) return;
            next = { ...patch, id, version: (current?.version || 0) + 1 };
            store.put(next);
          } catch (error) { tx.abort(); reject(error); }
        };
        tx.oncomplete = () => resolve(next);
        tx.onerror = tx.onabort = () => reject(tx.error || new Error('Salvataggio locale non riuscito.'));
      } catch (error) { try { tx?.abort(); } catch (_) {} reject(error); }
    });
  },
  remoteApplyBusy() {
    const modal = $('#modal'), active = document.activeElement;
    const temporary = S.tmp || {};
    return !!(this.activities || this.planLoads.size || this.failedAssets?.size || Sync.paused || Rec.active || Archive.busy
      || (typeof ptrs !== 'undefined' && ptrs.size) || (typeof gest !== 'undefined' && gest) || (typeof penBusy === 'function' && penBusy()) // si sta scrivendo con la penna: la versione online aspetta una pausa
      || (typeof pendingPose !== 'undefined' && pendingPose) || (typeof pendingVn !== 'undefined' && pendingVn)
      || ['poly', 'line', 'cal', 'stroke'].some(key => temporary[key]?.length) || temporary.cam || temporary.vn
      || (modal && !modal.classList.contains('hide'))
      || (active && (/^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName) || active.isContentEditable)));
  },
  async localCommit(id, expectedVersion, patch, guard = () => true) {
    const applies = Object.prototype.hasOwnProperty.call(patch, 'snapshot');
    if (!guard() || this.switching) return null;
    if (applies) {
      if (this.remoteApplyBusy()) return null;
      if (!await Sync.drain()) return null;
      await this.captureTail;
      if (this.captureWanted.has(id)) await this.capture([id]);
      if (this.captureWanted.has(id)) return null;
    }
    const files = [];
    if (applies && patch.snapshot) {
      for (const file of patch.snapshot.files || []) {
        let blob = await this.readLocalBlob(file);
        if (!blob) blob = await this.remote.getFile(id, file, guard);
        if (!guard()) return null;
        files.push({ ...file, blob });
      }
    }
    if (!guard() || (applies && (this.remoteApplyBusy() || Sync.pending() || this.captureWanted.has(id)))) return null;
    if (applies) { this.applying = true; this.lock(true); }
    try {
      const result = await new Promise((resolve, reject) => {
        const tx = IDB.db.transaction(['cloud', 'docs', 'blobs'], 'readwrite'); let next = null;
        const request = tx.objectStore('cloud').get(id);
        request.onsuccess = () => {
          const previous = request.result || null;
          if (!guard() || (previous?.version ?? null) !== expectedVersion || (applies && (Sync.pending() || this.remoteApplyBusy() || this.captureWanted.has(id)))) return;
          next = { ...(previous || { id }), ...patch, id, version: (previous?.version || 0) + 1 };
          if (applies) {
            const docs = tx.objectStore('docs'); const blobs = tx.objectStore('blobs');
            if (id === '_sopralux_library') {
              if (patch.snapshot) docs.put({ path: base() + '/lib', data: patch.snapshot.lib, dirty: false, ts: Date.now() });
            } else {
              const root = base() + '/' + id;
              let localMeta = {};
              const cursor = docs.openCursor();
              cursor.onsuccess = () => {
                const c = cursor.result;
                if (!c) { this.writeSnapshotTransaction(docs, blobs, id, patch, files, localMeta); return; }
                if (c.key === root) for (const key of ['dir', 'arch', 'archGen', 'lastBackup']) if (c.value.data?.[key] !== undefined) localMeta[key] = c.value.data[key];
                if (c.key === root || String(c.key).startsWith(root + '/')) c.delete();
                c.continue();
              };
            }
          }
          tx.objectStore('cloud').put(next);
        };
        tx.oncomplete = () => { if (applies && next) this.documentEpoch++; resolve(next); };
        tx.onerror = tx.onabort = () => reject(tx.error || new Error('Copia locale non salvata.'));
      });
      if (result && applies && guard()) await this.refreshApplied(id, result);
      return result;
    } finally { if (applies) { this.applying = false; this.lock(false); } }
  },
  writeSnapshotTransaction(docs, blobs, id, patch, files, localMeta = {}) {
    if (patch.deleted || !patch.snapshot) return;
    const s = this.json(patch.snapshot); const root = base() + '/' + id;
    const fileByHash = new Map(files.map(file => [file.sha256, file]));
    const attach = object => {
      const file = fileByHash.get(object.cloudFile); if (!file) return;
      object.asset = `users/${this.uid}/surveys/${id}/files/${file.sha256}`; object.local = false;
    };
    for (const plan of s.survey.plans || []) attach(plan);
    for (const photo of s.photos || []) attach(photo);
    for (const note of s.vnotes || []) if (note.mime) attach(note);
    for (const closure of Object.values(s.closure || {})) {
      for (const photo of closure.photos || []) attach(photo);
      for (const note of closure.vnotes || []) if (note.mime) attach(note);
    }
    const put = (path, data) => docs.put({ path, sid: id, data, dirty: false, ts: Date.now() });
    put(root, { type: 'survey', ...s.survey, ...localMeta, updated: patch.modifiedAt || Date.now(), stats: { plans: s.survey.plans.length, rooms: s.rooms.length, done: s.rooms.filter(r => r.done).length, items: s.items.filter(i => !i.hint).length, photos: s.photos.length } });
    for (const plan of s.survey.plans) put(root + '/plans/' + plan.id, { type: 'plan', id: plan.id, rooms: s.rooms.filter(r => r.planId === plan.id), items: s.items.filter(i => i.planId === plan.id && !i.photoId), draws: s.draws.filter(d => d.planId === plan.id), vnotes: s.vnotes.filter(n => n.planId === plan.id) });
    for (const photo of s.photos) put(root + '/photos/' + photo.id, { type: 'photo', ...photo, items: s.items.filter(i => i.photoId === photo.id) });
    for (const [key, closure] of Object.entries(s.closure)) put(root + '/closure/' + key, closure);
    for (const file of files) {
      const row = { id: '__file_' + file.sha256, logicalId: file.localId, blob: file.blob, sha256: file.sha256, sid: id, kind: file.kind, ref: file.ref, ts: patch.modifiedAt || Date.now() };
      blobs.put(row);
      // Only the live attachment receives the mutable local alias. Closure-only
      // versions remain accessible by their immutable digest.
      const live = file.kind === 'plan' ? s.survey.plans : file.kind === 'photo' ? s.photos : s.vnotes;
      if (live.some(object => object.id === file.ref && object.cloudFile === file.sha256)) blobs.put({ ...row, id: file.localId });
    }
  },
  async refreshApplied(id, state) {
    if (id === '_sopralux_library') { await loadLib(); if (S.sv) { renderPalette(); renderPanel(); redraw(); } }
    else {
      const wasOpen = S.sv?.id === id; const plan = S.planId;
      const view = { ...S.view }, selection = S.sel ? { ...S.sel } : null;
      const image = S.planImg[plan] || S.sv?.plans.find(p => p.id === plan);
      const dimensions = image ? { w: image.w, h: image.h } : null;
      for (const [key, url] of Uploads.localUrls) { URL.revokeObjectURL(url); Uploads.localUrls.delete(key); }
      for (const value of AudURL.values()) URL.revokeObjectURL(value.url);
      AudURL.clear(); await restoreLocalUrls();
      if (wasOpen) {
        if (state.deleted) { S.sv = null; S.planImg = {}; await loadSurveyList(); renderHome(); toast('Impianto eliminato sull’altro dispositivo.'); }
        else {
          await this.originalOpenSurvey(id);
          // showSurvey avvia il caricamento della prima tavola senza attenderlo.
          // Anche il suo fitView deve finire prima di ripristinare l'inquadratura.
          await Promise.all([...this.planLoads]);
          if (S.sv?.id === id && plan && S.sv.plans.some(p => p.id === plan)) {
            if (S.planId !== plan) await switchPlan(plan);
            const currentImage = S.planImg[plan] || S.sv.plans.find(p => p.id === plan);
            const sameDimensions = dimensions && currentImage && dimensions.w === currentImage.w && dimensions.h === currentImage.h;
            if (sameDimensions && view.s > 0 && ['s', 'tx', 'ty', 'r'].every(key => Number.isFinite(view[key]))) S.view = view;
            const objects = { room: S.rooms, item: S.items, photo: S.photos, draw: S.draws, vnote: S.vnotes };
            const exists = selection && (selection.t === 'ext' ? selection.id === plan
              : objects[selection.t]?.some(object => object.id === selection.id && object.planId === plan));
            S.sel = exists ? selection : null;
            renderPanel(); rotBtnUpdate(); rotPanelSync(); redraw();
          }
          toast('Impianto aggiornato dalla versione online.');
        }
      } else { await loadSurveyList(); if (!S.sv) renderHome(); }
    }
    this.refresh();
  },
  async start() {
    if (this.started || !this.prepared) return;
    this.started = true;
    await this.captureAll();
    if ((FirebaseAccount.user?.uid || null) !== this.uid) { this.accountChanged(); return; }
    if (!this.uid) { this.refresh(); return; }
    let deviceId = KV.get('cloudDeviceId');
    if (!deviceId) { deviceId = uid('device_'); this.setting('cloudDeviceId', deviceId); }
    const backend = CloudBackend.open({ app: FirebaseAccount.app, uid: this.uid, deviceId, isCurrent: () => this.current(), readLocalBlob: file => this.readLocalBlob(file) });
    this.remote = { ...backend, watchHeads: (next, onError) => backend.watchHeads((heads, metadata) => {
        if (!metadata?.fromCache) this.serverSeen = true;
        next(heads, metadata); this.refresh();
      }, onError) };
    this.local = { listIds: async () => (await IDB.all('cloud')).map(row => row.id), read: id => IDB.get('cloud', id).then(value => value || null), commit: (id, version, patch, guard) => this.localCommit(id, version, patch, guard) };
    this.engine = new CloudSyncEngine({ local: this.local, remote: this.remote, isCurrent: () => this.current(), isOnline: () => navigator.onLine, onState: state => { this.statusValue = state; if (!state.error && state.phase === 'idle' && !this.captureWanted.size) this.error = ''; this.refresh(); }, onError: error => { this.error = this.message(error); this.refresh(); } });
    await this.engine.start();
    window.addEventListener('online', () => this.syncNow());
    window.addEventListener('offline', () => this.refresh());
    document.addEventListener('visibilitychange', () => { if (!document.hidden && this.current()) this.syncNow(); });
  },
  async syncNow() {
    if (this.switching && !this.localError) return;
    this.error = '';
    for (const record of [...(this.failedAssets?.values() || [])]) await this.addBlob(record.id, record.blob, record.kind, record.ref, record.sid);
    if (!await Sync.drain()) return;
    await this.captureAll();
    if (this.switching) { await this.accountChanged(); return; }
    if (this.engine && this.current()) await this.engine.sync();
    this.refresh();
  },
  lock(value) {
    this.locked = value;
    for (const name of ['#home', '#sv', '#modal']) { const element = $(name); if (element) element.inert = value; }
  },
  activity(fn) {
    return async (...args) => {
      if (this.switching || this.locked) throw new Error('Cambio account o aggiornamento in corso.');
      this.activities++;
      try { return await fn(...args); }
      finally { this.activities--; if (!this.activities && !this.switching) { await this.captureAll(); this.engine?.sync(); } }
    };
  },
  async accountChanged() {
    if (this.switchWaiting) return;
    this.switchWaiting = true;
    this.switching = true; this.generation++;
    this.engine?.stop(); this.remote?.close();
    this.lock(true); this.refresh();
    clearTimeout(Archive.timer); AIQ.stop();
    try {
      // The old database stays selected until reload. Late async callbacks can
      // never write into another user's database.
      // FirebaseAccount.busy: l'accesso può ancora collegare un secondo metodo (Apple/Google) allo stesso account.
      while (this.activities || Archive.busy || Rec.active || Sync.paused || FirebaseAccount.busy) {
        if (Rec.active && Rec.mr?.state !== 'inactive') Rec.stop();
        await sleep(100);
      }
      if (!await Sync.drain()) throw new Error('Salva i dati locali prima di completare il cambio account.');
      await this.captureTail;
      location.reload();
    } catch (error) { this.localError = this.message(error); this.lock(false); this.refresh(); toast(this.localError, true, 10000); }
    finally { this.switchWaiting = false; }
  },
  message(error) {
    const code = error?.code || '';
    if (/permission-denied|unauthorized/.test(code)) return 'Il server non ha autorizzato la sincronizzazione. I dati restano salvati su questo dispositivo.';
    if (/failed-precondition|not-found/.test(code)) return 'Archivio cloud non ancora disponibile. I dati restano sul dispositivo.';
    if (/offline|unavailable|network/.test(code) || !navigator.onLine) return 'Offline: le modifiche restano in coda e partiranno al ritorno della rete.';
    return error?.message || 'Sincronizzazione non riuscita. I dati locali sono conservati.';
  },
  refresh() { if (this.prepared) { FirebaseAccount.refresh(); syncBadge(); } },
};

Object.assign(PwaCloud, {
  describe() {
    const state = this.statusValue || {};
    const pending = (state.pending || 0) + this.captureWanted.size + Sync.pending();
    if (this.switching) return { text: this.localError || 'Salvo i dati prima del cambio account…', style: this.localError ? 'bad' : 'grey' };
    if (this.localError || Sync.err) return { text: this.localError || Sync.err, style: 'bad' };
    if (!this.uid) return { text: 'Salvato su questo dispositivo. Accedi per ritrovare gli impianti sugli altri dispositivi.', style: 'grey' };
    if (state.conflicts) return { text: `${state.conflicts} impianti da decidere`, style: 'warn' };
    if (!navigator.onLine) return { text: `Offline: modifiche in coda (${pending})`, style: 'warn' };
    if (this.error || state.error) return { text: this.error || this.message(state.error), style: 'bad' };
    if (!this.engine || !this.serverSeen || state.phase === 'syncing' || pending || Sync.busy || this.activities) return { text: 'Sincronizzazione in corso…', style: 'grey' };
    return { text: 'Sincronizzato ✓', style: 'ok' };
  },
  accountHtml() {
    const account = FirebaseAccount, signed = !!account.user;
    const label = account.label();
    const status = this.describe(); const disabled = account.busy || this.switching;
    // Accesso con Apple o Google e scheda Account: pwa_firebase.js
    const button = account.buttonsHtml(!!disabled);
    return `<div class="row wrap" style="gap:10px"><b style="flex:1;min-width:160px;overflow-wrap:anywhere">${esc(label)}</b><div class="row wrap authbs">${button}</div></div>
      <div class="small" role="status" style="margin-top:8px"><span class="chip ${status.style}">${esc(status.text)}</span></div>
      ${signed || this.localError ? `<div class="row wrap" style="gap:8px;margin-top:9px"><button class="sm" id="fbSyncNow"${this.switching && !this.localError ? ' disabled' : ''}>${this.localError ? 'Riprova salvataggio' : 'Sincronizza ora'}</button>${this.statusValue.conflicts ? `<button class="sm pri" id="fbConflicts">Da decidere (${this.statusValue.conflicts})</button>` : ''}</div>` : ''}
      ${this.migrationNotice ? `<div class="small mut" style="margin-top:6px">${esc(this.migrationNotice)}</div>` : ''}
      ${account.error ? `<div class="small" style="color:var(--bad);margin-top:6px">${esc(account.error)}</div>` : ''}`;
  },
  wireAccount() {
    const bind = (id, fn) => { const el = $('#' + id); if (el) el.onclick = fn; };
    FirebaseAccount.wireButtons();
    bind('fbSyncNow', () => this.syncNow().catch(error => { this.error = this.message(error); this.refresh(); }));
    bind('fbConflicts', () => this.showConflicts());
  },
  async showConflicts() {
    if (!this.engine) return;
    if (!await Sync.drain()) return;
    await this.captureAll();
    const conflicts = await this.engine.listConflicts();
    const summary = (value, remote) => {
      const snap = value?.snapshot, head = value?.head;
      const deleted = value?.deleted || head?.deleted || !snap;
      const at = value?.modifiedAt || head?.modifiedAt;
      const when = at ? new Date(at).toLocaleString('it-IT') : 'Data non disponibile';
      return `<div style="flex:1;min-width:220px;border:1px solid var(--line,#d1d5db);border-radius:10px;padding:14px"><b>${remote ? 'Versione online' : 'Questo dispositivo'}</b>
        <div class="mut small" style="margin:7px 0">${esc(when)}</div>
        ${deleted ? '<div>Impianto eliminato</div>' : snap.kind === 'library' ? `<div>${snap.lib?.symbols?.length || 0} simboli e impostazioni</div>` : `<div>${esc(snap.survey?.name || '')}</div><div class="mut small">${esc(snap.survey?.client || '')}</div><div class="small" style="margin-top:8px">${snap.survey?.plans?.length || 0} tavole · ${snap.rooms?.length || 0} locali · ${snap.items?.length || 0} elementi · ${snap.photos?.length || 0} foto · ${snap.vnotes?.length || 0} note</div>`}
        <button class="${remote ? '' : 'pri'}" data-side="${remote ? 'remote' : 'local'}" style="margin-top:12px">${deleted ? 'Conferma eliminazione' : remote ? 'Tieni versione online' : 'Tieni versione del dispositivo'}</button></div>`;
    };
    const body = openModal(`<h3>Versioni da decidere</h3><div class="mut small">Questi impianti sono stati modificati indipendentemente. Scegli quale progetto completo conservare; fino alla scelta entrambe le versioni restano disponibili.</div>
      ${conflicts.length ? conflicts.map((c, i) => `<section data-conflict="${i}" style="margin-top:20px"><h4>${esc(c.local?.name || c.local?.snapshot?.survey?.name || c.remote?.head?.name || 'Libreria simboli')}</h4><div class="row wrap" style="align-items:stretch;gap:10px">${summary(c.local, false)}${summary(c.remote, true)}</div></section>`).join('') : '<p>Nessun conflitto da risolvere.</p>'}
      <div class="acts"><button id="cloudConflictClose">Chiudi</button></div>`, true);
    body.querySelector('#cloudConflictClose').onclick = closeModal;
    body.querySelectorAll('[data-side]').forEach(button => button.onclick = async () => {
      const conflict = conflicts[Number(button.closest('[data-conflict]').dataset.conflict)];
      for (const b of body.querySelectorAll('[data-side]')) b.disabled = true;
      try {
        closeModal();
        const result = await this.engine.resolve(conflict.id, button.dataset.side, conflict.token);
        if (result.status === 'stale') toast('È arrivata un’altra modifica: confronta le versioni aggiornate.', true, 6000);
        else if (result.status === 'resolved') toast('Versione scelta salvata.');
        await this.showConflicts();
      } catch (error) { this.error = this.message(error); toast(this.error, true, 8000); for (const b of body.querySelectorAll('[data-side]')) b.disabled = false; }
    });
  },
  async savePwa() {
    if (Sync.paused) { Sync.again = true; return false; }
    if ([...(this.failedAssets?.values() || [])].some(file => file.sid === S.sv?.id)) return false;
    if (Sync._flight) { Sync.again = true; return Sync._flight; }
    clearTimeout(Sync.timer);
    Sync._flight = (async () => {
      Sync.busy = true; Sync.again = false;
      const keys = [...Sync.dirty], deletions = [...Sync.dels]; Sync.dirty.clear(); Sync.dels.clear();
      const sid = S.sv?.id || null, changes = [], saved = [], projects = new Set();
      try {
        // Clone before the first await: navigation and later edits cannot change
        // the data belonging to this save operation.
        for (const key of keys) {
          const path = pathFor(key), raw = buildDoc(key); if (!path || !raw) continue;
          const data = this.json(raw), js = JSON.stringify(data);
          if (Sync.last.get(path) === js) continue;
          changes.push({ store: 'docs', value: { path, sid: key === 'lib' ? null : sid, data, dirty: true, ts: Date.now() } });
          saved.push([path, js]); projects.add(key === 'lib' ? '_sopralux_library' : sid);
        }
        for (const path of deletions) { changes.push({ store: 'docs', remove: path }); const rest = path.slice((base() + '/').length).split('/')[0]; if (rest) projects.add(rest === 'lib' ? '_sopralux_library' : rest); }
        await this.atomic(IDB.db, changes);
        for (const [path, js] of saved) Sync.last.set(path, js);
        for (const path of deletions) Sync.last.delete(path);
        Sync.err = null; if (!this.failedAssets?.size) this.localError = '';
        await this.capture(projects);
        return true;
      } catch (error) {
        keys.forEach(key => Sync.dirty.add(key)); deletions.forEach(path => Sync.dels.add(path));
        Sync.err = 'Salvataggio locale non riuscito'; this.localError = this.message(error);
        toast('Il dispositivo non ha salvato le modifiche. Lascia aperta l’app e libera spazio prima di continuare.', true, 10000);
        return false;
      } finally {
        Sync.busy = false;
        if (Sync.again || Sync.pending()) Sync.schedule(Sync.err ? 15000 : 300);
        syncBadge();
      }
    })();
    try { return await Sync._flight; } finally { Sync._flight = null; }
  },
  async deleteProject(id) {
    const project = S.surveys.find(s => s.id === id); if (!project) return;
    if (!await askConfirm(`Eliminare «${project.name}»${this.uid ? ' anche dagli altri dispositivi di questo account' : ' da questo dispositivo'}?`, 'Elimina', true)) return;
    if (!await Sync.drain()) return;
    if (this.activities) { toast('Attendi il completamento dell’operazione in corso.', true); return; }
    const root = base() + '/' + id;
    await new Promise((resolve, reject) => {
      const tx = IDB.db.transaction(['docs', 'cloud'], 'readwrite');
      const cloud = tx.objectStore('cloud'), docs = tx.objectStore('docs'); const get = cloud.get(id);
      get.onsuccess = () => {
        const state = get.result;
        cloud.put({ ...state, id, version: (state?.version || 0) + 1, name: project.name, snapshot: null, hash: '', deleted: true, modifiedAt: Date.now(), base: state?.base || null, conflict: state?.conflict || null });
        const cursor = docs.openCursor(); cursor.onsuccess = () => { const row = cursor.result; if (!row) return; if (row.key === root || String(row.key).startsWith(root + '/')) row.delete(); row.continue(); };
      };
      tx.oncomplete = () => { this.documentEpoch++; resolve(); };
      tx.onerror = tx.onabort = () => reject(tx.error || new Error('Eliminazione locale non salvata.'));
    });
    this.captureWanted.delete(id);
    for (const key of Sync.last.keys()) if (key === root || key.startsWith(root + '/')) Sync.last.delete(key);
    if (S.sv?.id === id) S.sv = null;
    await loadSurveyList(); renderHome(); this.engine?.notifyLocal(id);
  },
  async addBlob(id, blob, kind, ref, projectId = S.sv?.id || null) {
    const sid = projectId, startedAt = Date.now();
    this.uploadingSids ||= new Map(); this.uploadingSids.set(sid, (this.uploadingSids.get(sid) || 0) + 1);
    this.activities++;
    try {
      const previous = await IDB.get('blobs', id);
      const sha256 = await CloudBackend.digestBlob(blob);
      const record = { id, logicalId: id, blob, kind, ref, sid, ts: startedAt, sha256 };
      const changes = [{ store: 'blobs', value: record }, { store: 'blobs', value: { ...record, id: '__file_' + sha256 } }];
      if (previous?.blob) {
        const oldHash = previous.sha256 || await CloudBackend.digestBlob(previous.blob);
        changes.push({ store: 'blobs', value: { ...previous, id: '__file_' + oldHash, sha256: oldHash, logicalId: id } });
      }
      await this.atomic(IDB.db, changes);
      this.failedAssets?.delete(id); if (!this.failedAssets?.size) this.localError = '';
      const oldUrl = Uploads.localUrls.get(id); if (oldUrl) URL.revokeObjectURL(oldUrl);
      Uploads.localUrls.set(id, URL.createObjectURL(blob));
      Uploads.localUrls.set('__file_' + sha256, URL.createObjectURL(blob));
      if (S.sv?.id === sid) {
        const object = kind === 'plan' ? planOf(ref) : kind === 'photo' ? photoById(ref) : vnoteById(ref);
        if (object) { object.cloudFile = sha256; object.asset = null; object.local = true; Sync.mark(kind === 'plan' ? 'meta' : kind === 'photo' ? 'photo:' + ref : 'plan:' + object.planId); }
      } else {
        const rows = await IDB.all('docs');
        for (const row of rows.filter(d => d.sid === sid && d.data)) {
          const objects = kind === 'plan' && row.data.type === 'survey' ? row.data.plans || [] : kind === 'photo' && row.data.type === 'photo' ? [row.data] : kind === 'audio' && row.data.type === 'plan' ? row.data.vnotes || [] : [];
          const object = objects.find(o => o.id === ref);
          if (object) { object.cloudFile = sha256; object.asset = null; object.local = true; row.dirty = true; await IDB.put('docs', row); }
        }
      }
    } catch (error) {
      this.failedAssets ||= new Map(); this.failedAssets.set(id, { id, blob, kind, ref, sid });
      this.localError = 'Allegato non salvato sul dispositivo: libera spazio e premi «Riprova salvataggio». Lascia aperta l’app.';
      this.captureWanted.add(sid); this.refresh(); toast(this.localError, true, 10000);
      return false;
    } finally {
      this.activities--; this.uploadingSids.set(sid, Math.max(0, (this.uploadingSids.get(sid) || 1) - 1));
      if (sid) await this.capture([sid]);
    }
  },
  async getFileBlob(localId, asset, expectedHash) {
    const match = /^users\/([^/]+)\/surveys\/([^/]+)\/files\/([a-f0-9]{64})$/.exec(asset || '');
    if (asset && (!match || match[1] !== this.uid)) throw new Error('Allegato di un altro archivio: importa il backup completo con i file.');
    const expected = expectedHash || match?.[3];
    let row = await IDB.get('blobs', localId);
    if (expected && row?.sha256 !== expected) row = await IDB.get('blobs', '__file_' + expected);
    if (row?.blob) return row.blob;
    if (match && this.remote && this.current()) {
      const state = await IDB.get('cloud', match[2]);
      const file = state?.snapshot?.files.find(f => f.sha256 === expected);
      if (file) {
        const blob = await this.remote.getFile(match[2], file, () => this.current());
        await IDB.put('blobs', { id: '__file_' + expected, blob, sha256: expected, logicalId: localId, sid: match[2], kind: file.kind, ref: file.ref, ts: Date.now() });
        return blob;
      }
    }
    throw new Error('Allegato non disponibile offline. Sincronizza l’impianto con una connessione attiva.');
  },
  install() {
    if (this.installed) return; this.installed = true;
    IDB.open = async () => {
      try { await this.prepare(); return true; }
      catch (error) { this.localError = this.message(error); const list = $('#hList'); if (list) list.innerHTML = `<div class="banner warn">${esc(this.localError)}<br>Chiudi e riapri l’app per riprovare. Le copie originali sono conservate.</div>`; throw error; }
    };
    IDB.tx = (store, mode, fn) => this.transaction(IDB.db, store, mode, fn);
    const originalDel = IDB.del.bind(IDB);
    IDB.del = async (store, key) => {
      if (store !== 'blobs') return originalDel(store, key);
      const row = await IDB.get('blobs', key); if (!row) return true;
      // Keep attachment versions referenced by a closure, a conflict or an
      // unacknowledged offline revision. Cleanup is deliberately separate.
      return IDB.put('blobs', { ...row, retired: true });
    };
    Sync.flush = () => this.savePwa();
    Sync.drain = async () => {
      if (Sync.paused || this.failedAssets?.size) return false;
      if (Sync._flight && !await Sync._flight) return false;
      for (let i = 0; i < 5 && Sync.pending(); i++) if (!await Sync.flush()) return false;
      return !Sync.pending() && !Sync.err;
    };
    Uploads.add = (...args) => this.addBlob(...args);
    Uploads.resume = () => this.start().catch(error => { this.error = this.message(error); this.refresh(); });
    Uploads.pump = () => this.engine?.sync();
    Uploads.count = () => this.activities;
    getBlob = (id, asset) => this.getFileBlob(id, asset);
    blobUrl = (id, asset) => {
      const hash = /\/files\/([a-f0-9]{64})$/.exec(asset || '')?.[1];
      return Uploads.localUrls.get(hash ? '__file_' + hash : id) || null;
    };
    vnAudioBlob = n => this.getFileBlob('audio_' + n.id, n.asset, n.cloudFile);
    const originalRestore = restoreLocalUrls;
    restoreLocalUrls = async () => { await originalRestore(); };
    const originalSwitchPlan = switchPlan;
    switchPlan = (...args) => {
      const loading = originalSwitchPlan(...args);
      this.planLoads.add(loading);
      const finished = () => this.planLoads.delete(loading);
      loading.then(finished, finished);
      return loading;
    };
    this.originalOpenSurvey = openSurvey;
    openSurvey = async id => {
      if (this.activities || this.failedAssets?.size) { toast('Attendi il salvataggio dei file prima di cambiare impianto.', true); return; }
      if (this.switching || this.locked || !await Sync.drain()) return;
      this.activities++;
      try { return await this.originalOpenSurvey(id); }
      finally { this.activities--; }
    };
    goHome = async () => {
      if (this.activities || this.failedAssets?.size) { toast('Attendi il salvataggio dei file prima di cambiare impianto.', true); return; }
      if (this.switching || this.locked || !await Sync.drain()) return;
      S.sv = null; S.planImg = {}; AIQ.stop(); await loadSurveyList(); renderHome();
    };
    deleteSurvey = id => this.deleteProject(id).catch(error => { this.localError = this.message(error); toast(this.localError, true); });
    for (const [name, fn] of Object.entries({ importSnapshot, importPlanFile, addPhotos, runAI, readQuadroDet, withClosureData, photoPlanFlow })) {
      const wrapped = this.activity(fn);
      if (name === 'importSnapshot') importSnapshot = wrapped;
      if (name === 'importPlanFile') importPlanFile = wrapped;
      if (name === 'addPhotos') addPhotos = wrapped;
      if (name === 'runAI') runAI = wrapped;
      if (name === 'readQuadroDet') readQuadroDet = wrapped;
      if (name === 'withClosureData') withClosureData = wrapped;
      if (name === 'photoPlanFlow') photoPlanFlow = wrapped;
    }
    const originalRecorderStart = Rec.start.bind(Rec);
    Rec.start = this.activity(originalRecorderStart);
    const originalArchiveSync = Archive.sync.bind(Archive), originalArchiveAll = Archive.syncAll.bind(Archive);
    Archive.sync = async () => { if (!this.switching) return originalArchiveSync(); };
    Archive.syncAll = async () => {
      if (this.switching) return;
      this.activities++;
      try { return await originalArchiveAll(); } finally { this.activities--; }
    };
    const signIn = FirebaseAccount.signIn, signOut = FirebaseAccount.signOut, deleteAccount = FirebaseAccount.deleteAccount;
    const mayChange = () => {
      if (this.switching || this.activities || Rec.active || Sync.paused || Archive.busy) { toast('Attendi la fine dell’operazione in corso prima di cambiare account.', true, 6000); return false; }
      if (this.localError || Sync.err) { toast('Prima di cambiare account, completa il salvataggio sul dispositivo.', true, 6000); return false; }
      return true;
    };
    FirebaseAccount.signIn = function (...args) { if (mayChange()) return signIn.apply(this, args); };
    FirebaseAccount.signOut = function (...args) { if (mayChange()) return signOut.apply(this, args); };
    if (deleteAccount) FirebaseAccount.deleteAccount = function (...args) { if (mayChange()) return deleteAccount.apply(this, args); };
    FirebaseAccount.contentHtml = () => this.accountHtml();
    FirebaseAccount.wire = () => this.wireAccount();
    pwaBadge = button => {
      const status = this.describe(); button.className = 'chip ' + status.style;
      button.textContent = status.text; button.onclick = this.localError ? () => this.syncNow() : this.statusValue.conflicts ? () => this.showConflicts() : null;
    };
    window.addEventListener('online', () => { if (this.prepared && !this.switching) this.syncNow().catch(error => { this.error = this.message(error); this.refresh(); }); });
  },
});

PwaCloud.install();
