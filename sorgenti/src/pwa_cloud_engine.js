/* ============ SINCRONIZZAZIONE PROGETTI: PROTOCOLLO E CONFLITTI ============ */
// Solo PWA. Nessuna dipendenza dal DOM: archivio locale e trasporto sono iniettati.
// La revisione comune, non l'orologio del dispositivo, distingue un aggiornamento
// in sequenza da due modifiche indipendenti dello stesso impianto.
const CloudSyncProtocol = {
  stringify(value) {
    const seen = new Set();
    const visit = (v, arrayItem = false) => {
      if (v === null) return 'null';
      if (typeof v === 'string' || typeof v === 'boolean') return JSON.stringify(v);
      if (typeof v === 'number') return Number.isFinite(v) ? JSON.stringify(v) : 'null';
      if (typeof v === 'bigint') throw new TypeError('BigInt non ammesso nello snapshot');
      if (typeof v !== 'object') return arrayItem ? 'null' : undefined;
      if (seen.has(v)) throw new TypeError('Snapshot circolare');
      seen.add(v);
      let out;
      if (Array.isArray(v)) out = '[' + Array.from(v, x => visit(x, true)).join(',') + ']';
      else {
        out = '{' + Object.keys(v).sort().map(k => {
          const x = visit(v[k]);
          return x === undefined ? null : JSON.stringify(k) + ':' + x;
        }).filter(x => x !== null).join(',') + '}';
      }
      seen.delete(v);
      return out;
    };
    const out = visit(value);
    if (out === undefined) throw new TypeError('Snapshot non serializzabile');
    return out;
  },

  clone(value) { return JSON.parse(this.stringify(value)); },

  async hash(value) {
    const bytes = new TextEncoder().encode(this.stringify(value));
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('');
  },

  same(a, b) {
    if (!a || !b) return !a && !b;
    const ad = !!(a.deleted ?? a.del), bd = !!(b.deleted ?? b.del);
    return ad === bd && (ad || !!(a.hash || a.snapshotHash) && (a.hash || a.snapshotHash) === (b.hash || b.snapshotHash));
  },

  base(head) {
    return head ? { rev: head.rev, hash: head.hash || head.snapshotHash || '', deleted: !!(head.deleted ?? head.del) } : null;
  },

  sameBase(a, b) {
    return (!a && !b) || !!a && !!b && a.rev === b.rev && this.same(a, b);
  },

  // Funzione pura usata anche nelle prove con due dispositivi.
  decide(local, remote) {
    if (!local) return remote ? 'pull' : 'none';
    if (!remote) {
      if (local.base && local.base.rev === 0 && local.deleted && local.base.deleted) return 'none';
      return local.base && local.base.rev > 0 ? 'conflict' : 'push';
    }
    if (this.same(local, remote)) return 'ack';
    if (!local.base) return 'conflict';
    // Un rollback o una riscrittura della medesima revisione non è una nuova
    // versione in sequenza: richiede una scelta esplicita.
    if (remote.rev < local.base.rev || remote.rev === local.base.rev && !this.same(remote, local.base)) return 'conflict';
    if (this.same(local, local.base)) return 'pull';
    if (this.same(remote, local.base)) return 'push';
    return 'conflict';
  },
};

class CloudSyncEngine {
  constructor(options) {
    if (!options || !options.local || !options.remote) throw new TypeError('Adapter di sincronizzazione mancanti');
    this.local = options.local;
    this.remote = options.remote;
    this.options = options;
    this.auto = options.auto !== false;
    this.retryMs = options.retryMs ?? 5000;
    this.active = true;
    this.started = false;
    this.generation = 1;
    this.queue = new Set();
    this.known = new Map();
    this.errors = new Map();
    this.timer = null;
    this.unsubscribe = null;
    this.running = false;
    this.syncPromise = null;
    this.tail = Promise.resolve();
    this.conflictCounter = 0;
    this.instanceId = Math.random().toString(36).slice(2);
  }

  _guard() {
    const generation = this.generation;
    return () => this.active && generation === this.generation && (!this.options.isCurrent || this.options.isCurrent());
  }

  _online() { return !this.options.isOnline || this.options.isOnline(); }

  _check(guard) {
    if (!guard()) throw Object.assign(new Error('Sessione cambiata'), { code: 'sync/cancelled' });
  }

  _serial(action) {
    const p = this.tail.then(action, action);
    this.tail = p.catch(() => {});
    return p;
  }

  _notify(name, ...args) {
    try { if (this.options[name]) this.options[name](...args); }
    catch (error) { console.warn('sync observer', error); }
  }

  status() {
    const conflicts = [...this.known].filter(([, s]) => s.conflict).map(([id]) => id);
    const pending = new Set([...this.queue, ...[...this.known].filter(([, s]) => s.pending && !s.conflict).map(([id]) => id)]);
    conflicts.forEach(id => pending.delete(id));
    const error = this.errors.size ? this.errors.values().next().value : null;
    return {
      active: this.active, busy: this.running, online: this._online(),
      pending: pending.size, conflicts: conflicts.length,
      pendingIds: [...pending], conflictIds: conflicts, error,
      phase: !this.active ? 'stopped' : !this._online() ? 'offline' : this.running ? 'syncing' : error ? 'error' : conflicts.length ? 'conflict' : pending.size ? 'pending' : 'idle',
    };
  }

  _emit() { this._notify('onState', this.status()); }

  _remember(id, state) {
    if (!state) this.known.delete(id);
    else this.known.set(id, {
      conflict: !!state.conflict,
      pending: !state.base || !CloudSyncProtocol.same(state, state.base),
    });
  }

  _schedule(delay = 80) {
    if (!this.active || !this.auto || this.timer !== null || !this.queue.size) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      this.sync([]).catch(error => this._report(error, ''));
    }, delay);
  }

  _report(error, id) {
    if (!this.active || error && error.code === 'sync/cancelled') return;
    this.errors.set(id, error);
    this._notify('onError', error, id);
    this._emit();
  }

  _retryable(error) {
    const code = String(error && error.code || '');
    // File mancanti o non integri richiedono un intervento locale: ripetere un
    // download/upload ogni cinque secondi non può ripararli. La coda resta
    // persistente e un nuovo salvataggio o «Sincronizza ora» può riprovare.
    return !/permission-denied|unauthorized|unauthenticated|invalid|integrity|hash-mismatch|quota|too-large|missing-(?:local-)?file|file-missing|private-data|sdk-unavailable|crypto-unavailable|corrupt|session-ended|unimplemented|failed-precondition/.test(code);
  }

  async start() {
    if (!this.active) throw new Error('Crea un nuovo motore dopo stop()');
    if (this.started) return this.syncPromise || this.status();
    this.started = true;
    const guard = this._guard();
    this.unsubscribe = this.remote.watchHeads((heads, metadata) => {
      if (!guard()) return;
      this.errors.delete('');
      // Anche una lista in cache può segnalare lavoro da recuperare, ma non è
      // mai usata per sovrascrivere dati: getHead rilegge sempre dal server.
      for (const head of heads || []) if (head && (head.id || head.sid)) this.queue.add(head.id || head.sid);
      this._emit();
      this._schedule(metadata && metadata.fromCache ? this.retryMs : 80);
    }, error => { if (guard()) this._report(error, ''); });
    return this.sync();
  }

  notifyLocal(id) {
    if (!this.active || !id) return;
    this.queue.add(id);
    const old = this.known.get(id);
    this.known.set(id, { pending: true, conflict: !!(old && old.conflict) });
    this._emit();
    this._schedule();
  }

  sync(ids) {
    if (!this.active) return Promise.resolve(this.status());
    if (ids) for (const id of ids) this.queue.add(id);
    // Le modifiche sopravvivono alla chiusura perché snapshot e base sono
    // persistenti. La scansione ricostruisce la coda senza affidarsi a timer.
    const scan = ids === undefined;
    if (this.syncPromise) {
      if (scan) this.rescan = true;
      return this.syncPromise;
    }
    const guard = this._guard();
    this.syncPromise = this._serial(async () => {
      this._check(guard);
      if (scan || this.rescan) {
        this.rescan = false;
        for (const id of await this.local.listIds()) this.queue.add(id);
      }
      this._check(guard);
      if (!this._online()) {
        for (const id of this.queue) this._remember(id, await this._read(id, guard));
        this._emit(); return this.status();
      }
      this.running = true; this._emit();
      let retry = false;
      // Un numero limitato di passaggi evita che modifiche continue o un server
      // irraggiungibile tengano occupata la pagina indefinitamente.
      for (let pass = 0; pass < 8 && this.queue.size && guard(); pass++) {
        const batch = [...this.queue]; this.queue.clear();
        const failed = new Set();
        for (const id of batch) {
          if (!guard()) break;
          try {
            const result = await this._process(id, guard);
            this.errors.delete(id);
            if (result.retry) { failed.add(id); retry = true; }
          } catch (error) {
            if (!guard() || error && error.code === 'sync/cancelled') break;
            failed.add(id); retry = retry || this._retryable(error);
            this._report(error, id);
          }
        }
        for (const id of failed) this.queue.add(id);
        if (failed.size) break;
      }
      if (this.queue.size && (retry || !this.errors.size)) this._schedule(retry ? this.retryMs : 80);
      return this.status();
    }).catch(error => {
      if (error && error.code === 'sync/cancelled') return this.status();
      this._report(error, '');
      throw error;
    }).finally(() => {
      this.running = false;
      this.syncPromise = null;
      this._emit();
      if (this.rescan && this.active) this.sync().catch(error => this._report(error, ''));
    }).then(() => this.status());
    return this.syncPromise;
  }

  _head(raw, id) {
    if (!raw) return null;
    const head = CloudSyncProtocol.clone(raw);
    head.id = head.id || head.sid || id;
    head.deleted = !!(head.deleted ?? head.del);
    head.hash = head.hash || head.snapshotHash || '';
    head.modifiedAt = Number(head.modifiedAt) || 0;
    if (head.id !== id || !Number.isSafeInteger(head.rev) || head.rev < 1 || !head.deleted && !head.hash) {
      throw Object.assign(new Error('Revisione online non valida'), { code: 'sync/invalid-head' });
    }
    return head;
  }

  _name(state) {
    return state && (state.name || state.snapshot && state.snapshot.survey && state.snapshot.survey.name || state.snapshot && state.snapshot.kind === 'library' && 'Libreria simboli') || '';
  }

  async _read(id, guard) {
    const state = await this.local.read(id);
    this._check(guard);
    if (!state) return null;
    if (state.version === null || state.version === undefined || !state.deleted && !state.hash) {
      throw Object.assign(new Error('Versione locale non valida'), { code: 'sync/invalid-local' });
    }
    // L'adapter può restituire riferimenti alla propria cache: il trasporto non
    // deve vedere un oggetto cambiare mentre sta caricando una revisione.
    const copy = CloudSyncProtocol.clone(state);
    copy.id = id; copy.deleted = !!copy.deleted;
    return copy;
  }

  async _commit(id, version, patch, guard) {
    this._check(guard);
    const saved = await this.local.commit(id, version, patch, guard);
    this._check(guard);
    if (saved) this._remember(id, saved);
    return saved;
  }

  async _process(id, guard) {
    for (let attempt = 0; attempt < 4; attempt++) {
      const local = await this._read(id, guard);
      const remote = this._head(await this.remote.getHead(id), id);
      this._check(guard); this._remember(id, local);
      const decision = CloudSyncProtocol.decide(local, remote);
      if (decision === 'none') return {};
      if (decision === 'ack') {
        const base = CloudSyncProtocol.base(remote);
        if (!local.conflict && CloudSyncProtocol.sameBase(local.base, base)) return {};
        if (await this._commit(id, local.version, { base, conflict: null }, guard)) return {};
      } else if (decision === 'pull') {
        if (await this._pull(id, local, remote, guard)) return {};
      } else if (decision === 'push') {
        if (await this._push(id, local, remote, guard)) return {};
      } else {
        if (await this._conflict(id, local, remote, guard)) return {};
      }
    }
    return { retry: true };
  }

  async _pull(id, local, remote, guard, knownSnapshot) {
    const snapshot = remote && !remote.deleted
      ? knownSnapshot === undefined ? await this.remote.readSnapshot(remote, guard) : knownSnapshot
      : null;
    this._check(guard);
    const saved = await this._commit(id, local ? local.version : null, {
      snapshot: snapshot === null ? null : CloudSyncProtocol.clone(snapshot),
      hash: remote ? remote.hash : '', deleted: !remote || remote.deleted,
      modifiedAt: remote ? remote.modifiedAt : Date.now(),
      base: remote ? CloudSyncProtocol.base(remote) : { rev: 0, hash: '', deleted: true },
      conflict: null,
    }, guard);
    if (!saved) return false;
    this._notify('onApplied', id, saved);
    return true;
  }

  async _push(id, local, remote, guard) {
    this._check(guard);
    const result = await this.remote.publish({
      sid: id, expectedRev: remote ? remote.rev : 0,
      snapshot: local.deleted ? null : CloudSyncProtocol.clone(local.snapshot),
      hash: local.hash, deleted: local.deleted, modifiedAt: local.modifiedAt || 0,
      name: this._name(local), guard,
    });
    this._check(guard);
    if (!result || typeof result.ok !== 'boolean') throw Object.assign(new Error('Risposta di pubblicazione non valida'), { code: 'sync/invalid-ack' });
    if (!result.ok) return false;
    const head = this._head(result.head, id);
    if (!head || head.rev !== (remote ? remote.rev : 0) + 1 || !CloudSyncProtocol.same(head, local)) {
      throw Object.assign(new Error('Conferma di pubblicazione incoerente'), { code: 'sync/invalid-ack' });
    }
    await this._ackPublication(id, local, head, guard);
    return true;
  }

  async _ackPublication(id, sent, head, guard) {
    const base = CloudSyncProtocol.base(head);
    if (await this._commit(id, sent.version, { base, conflict: null }, guard)) return;
    // L'utente ha continuato a lavorare durante l'upload. Quella nuova modifica
    // discende dalla versione appena inviata: aggiorniamo soltanto la base.
    for (let attempt = 0; attempt < 3; attempt++) {
      const current = await this._read(id, guard);
      if (!current) break;
      if (CloudSyncProtocol.sameBase(current.base, base)) break;
      if (!CloudSyncProtocol.sameBase(current.base, sent.base)) break;
      if (await this._commit(id, current.version, { base }, guard)) break;
    }
    this.queue.add(id);
  }

  _matchesConflict(conflict, local, remote) {
    const stored = conflict && conflict.remote && conflict.remote.head;
    return !!conflict && CloudSyncProtocol.same(conflict.local, local)
      && ((!stored && !remote) || !!stored && !!remote && stored.rev === remote.rev && CloudSyncProtocol.same(stored, remote));
  }

  async _conflict(id, local, remote, guard) {
    if (this._matchesConflict(local.conflict, local, remote)) {
      this._notify('onConflict', id, local.conflict);
      return true;
    }
    const snapshot = remote && !remote.deleted ? await this.remote.readSnapshot(remote, guard) : null;
    this._check(guard);
    const conflict = {
      token: this.instanceId + ':' + (++this.conflictCounter), id,
      reason: !remote ? 'remote-missing' : !local.base ? 'no-common-base' : remote.rev <= local.base.rev ? 'remote-rewritten' : 'diverged',
      createdAt: Date.now(),
      local: { hash: local.hash || '', deleted: local.deleted, modifiedAt: local.modifiedAt || 0, name: this._name(local), snapshot: local.deleted ? null : CloudSyncProtocol.clone(local.snapshot) },
      remote: { head: remote, hash: remote ? remote.hash : '', deleted: !remote || remote.deleted, modifiedAt: remote ? remote.modifiedAt : 0, name: remote && remote.name || '', snapshot },
    };
    const saved = await this._commit(id, local.version, { conflict }, guard);
    if (!saved) return false;
    this._notify('onConflict', id, conflict);
    return true;
  }

  async listConflicts() {
    const guard = this._guard(), result = [];
    for (const id of await this.local.listIds()) {
      const state = await this._read(id, guard);
      this._remember(id, state);
      if (state && state.conflict) result.push({ id, ...state.conflict });
    }
    this._emit();
    return result;
  }

  resolve(id, choice, token) {
    if (choice !== 'local' && choice !== 'remote') return Promise.reject(new TypeError('Scelta del conflitto non valida'));
    const guard = this._guard();
    return this._serial(async () => {
      this._check(guard);
      const local = await this._read(id, guard), conflict = local && local.conflict;
      if (!conflict || !token || token !== conflict.token) return { status: 'stale', id };
      const remote = this._head(await this.remote.getHead(id), id);
      this._check(guard);
      if (!this._matchesConflict(conflict, local, remote)) {
        await this._process(id, guard);
        return { status: 'stale', id };
      }
      const saved = choice === 'local'
        ? await this._push(id, local, remote, guard)
        : await this._pull(id, local, remote, guard, conflict.remote.snapshot);
      if (!saved) {
        await this._process(id, guard);
        return { status: 'stale', id };
      }
      this.errors.delete(id);
      this._schedule();
      return { status: 'resolved', id, choice };
    }).catch(error => {
      if (!guard() || error && error.code === 'sync/cancelled') return { status: 'cancelled', id };
      this.queue.add(id); this._report(error, id);
      throw error;
    }).finally(() => this._emit());
  }

  stop() {
    if (!this.active) return;
    this.active = false; this.generation++;
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
    if (this.unsubscribe) { try { this.unsubscribe(); } catch (error) { console.warn('sync unsubscribe', error); } }
    this.unsubscribe = null;
    this._emit();
  }
}
