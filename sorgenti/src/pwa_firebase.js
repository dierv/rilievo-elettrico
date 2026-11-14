/* ============ ACCOUNT SOPRALUX: ACCESSO CON APPLE O CON GOOGLE ============ */
// Un solo account (uid Firebase) per browser, Android e iPad: si entra con Apple o con Google
// e dalla scheda «Account» si collega anche l'altro metodo. Gli acquisti e gli impianti
// seguono l'account, non il metodo con cui si entra.
// Nel browser l'accesso usa il popup di Firebase. Nell'app nativa il plugin
// FirebaseAuthentication apre le schermate di sistema (Apple, Google) e restituisce le
// credenziali, che entrano nell'SDK JavaScript (skipNativeAuth): l'account resta uno solo.
// pwa_cloud.js collega l'account a un archivio locale separato e alla sincronizzazione.
const AUTH_KINDS = Object.freeze({
  apple: Object.freeze({ id: 'apple.com', name: 'Apple' }),
  google: Object.freeze({ id: 'google.com', name: 'Google' }),
});
const AUTH_ICON = {
  apple: '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M16.37 12.73c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.71-3.19-1.73-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.11 8.79.73 1.06 1.6 2.25 2.75 2.21 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.67-2.14.84-1.23 1.19-2.42 1.21-2.48-.03-.01-2.32-.89-2.33-3.55zM14.18 6.27c.61-.74 1.02-1.76.91-2.78-.88.04-1.94.59-2.57 1.32-.56.65-1.06 1.69-.93 2.69.98.08 1.98-.5 2.59-1.23z"/></svg>',
  google: '<svg viewBox="0 0 48 48" width="16" height="16" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>',
};
const authKindOf = providerId => Object.keys(AUTH_KINDS).find(kind => AUTH_KINDS[kind].id === providerId) || null;

const FirebaseAccount = {
  sdk: null, app: null, auth: null, provider: null, user: null,
  ready: false, started: false, busy: null, busyKind: null, error: '', unsubscribe: null,
  pending: null, nativePlugin: undefined, appleWeb: undefined, deleteReady: undefined, // appleWeb, deleteReady: solo per le prove

  init() {
    if (this.started) return;
    this.started = true;
    // App nativa senza il plugin di accesso (versione gratis di prova): niente account e niente rete.
    if (this.hidden()) return;
    try {
      const sdk = window.FB;
      if (!sdk) throw { code: 'sdk-unavailable' };
      this.sdk = sdk;
      this.app = sdk.getApps().find(app => app.name === 'sopralux') || sdk.initializeApp(FIREBASE_CONFIG, 'sopralux');
      this.auth = sdk.getAuth(this.app);
      this.auth.languageCode = 'it';
      this.provider = new sdk.GoogleAuthProvider();
      this.provider.setCustomParameters({ prompt: 'select_account' });
      // getAuth usa la persistenza del browser. Non si attende la rete per avviare
      // l'app: l'utente può subito lavorare sui sopralluoghi locali.
      this.unsubscribe = sdk.onAuthStateChanged(this.auth, user => {
        this.user = user;
        this.ready = true;
        this.error = '';
        this.refresh();
      }, error => {
        this.ready = false;
        this.error = 'Accesso non disponibile. Riapri l’app per riprovare.';
        this.refresh();
      });
    } catch (error) {
      this.auth = null;
      this.ready = false;
      this.error = this.message(error);
    }
    window.addEventListener('online', () => this.refresh());
    window.addEventListener('offline', () => this.refresh());
    this.refresh();
  },

  /* ---- piattaforma ---- */
  nativeApp() { try { return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()); } catch (e) { return false; } },
  native() {
    if (this.nativePlugin !== undefined) return this.nativePlugin;
    let plugin = null;
    try {
      const cap = window.Capacitor, reg = (window.capacitorExports && window.capacitorExports.registerPlugin) || (cap && cap.registerPlugin);
      if (this.nativeApp() && cap.isPluginAvailable && cap.isPluginAvailable('FirebaseAuthentication') && reg) plugin = reg('FirebaseAuthentication');
    } catch (e) { plugin = null; }
    this.nativePlugin = plugin;
    return plugin;
  },
  hidden() { return this.nativeApp() && !this.native(); },
  ios() { try { return this.nativeApp() && window.Capacitor.getPlatform() === 'ios'; } catch (e) { return false; } },
  // Apple: sull'iPad sempre. Nel browser e su Android solo quando in Firebase c'è anche il
  // Services ID di Apple (FIREBASE_APPLE_WEB). Su Android Apple serve solo per entrare:
  // il suo flusso apre già una sessione nativa, quindi non si può collegare a un account aperto.
  can(kind, linking = false) {
    if (kind === 'google') return true;
    if (kind !== 'apple') return false;
    if (this.ios()) return true;
    const web = this.appleWeb !== undefined ? !!this.appleWeb : typeof FIREBASE_APPLE_WEB !== 'undefined' && !!FIREBASE_APPLE_WEB;
    if (this.nativeApp()) return web && !linking;
    return web && !!(this.sdk && this.sdk.OAuthProvider);
  },
  canDelete() { return this.deleteReady !== undefined ? !!this.deleteReady : typeof FIREBASE_DELETE_READY !== 'undefined' && !!FIREBASE_DELETE_READY; },
  providers() {
    const user = (this.auth && this.auth.currentUser) || this.user;
    const kinds = ((user && user.providerData) || []).map(p => authKindOf(p && p.providerId)).filter(Boolean);
    return Object.keys(AUTH_KINDS).filter(kind => kinds.includes(kind));
  },

  message(error) {
    const code = error && error.code;
    const messages = {
      'sdk-unavailable': 'Accesso non disponibile. Riapri l’app quando hai una connessione.',
      'auth/popup-blocked': 'Il browser ha bloccato la finestra di accesso. Consenti i popup per questo sito e riprova. Se usi l’app installata, apri lo stesso indirizzo nel browser.',
      'auth/unauthorized-domain': 'Questo indirizzo non è ancora autorizzato: aggiungi ' + location.hostname + ' ai domini autorizzati di Firebase Authentication.',
      'auth/operation-not-allowed': 'Questo metodo di accesso non è ancora abilitato nel progetto Firebase di SopraLux.',
      'auth/configuration-not-found': 'Authentication non è ancora configurato nel progetto Firebase di SopraLux.',
      'auth/network-request-failed': 'Connessione non riuscita. Controlla la rete e riprova.',
      'auth/invalid-api-key': 'Configurazione Firebase non valida: verifica la configurazione dell’app SopraLux.',
      'auth/app-not-authorized': 'Questa app non è autorizzata ad accedere al progetto Firebase.',
      'auth/user-disabled': 'Questo account è stato disabilitato.',
      'auth/too-many-requests': 'Troppi tentativi di accesso. Attendi qualche minuto e riprova.',
      'auth/web-storage-unsupported': 'Il browser non permette di memorizzare l’accesso. Abilita i dati dei siti e riprova.',
      'auth/operation-not-supported-in-this-environment': 'Apri SopraLux dal suo indirizzo HTTPS in Chrome, Edge o Safari e riprova.',
      'auth/credential-already-in-use': 'Questo metodo di accesso appartiene già a un altro account SopraLux. Entra con quello se è l’account giusto; altrimenti eliminalo dalla sua scheda Account e poi collegalo qui.',
      'auth/email-already-in-use': 'Con questa email esiste già un altro account SopraLux.',
      'auth/provider-already-linked': 'Questo metodo è già collegato all’account.',
      'auth/no-such-provider': 'Questo metodo non è collegato all’account.',
      'auth/requires-recent-login': 'Per sicurezza conferma di nuovo l’accesso e riprova.',
      'auth/user-mismatch': 'Hai confermato con un account diverso da quello aperto: usa lo stesso account.',
      'auth/missing-credential': 'Accesso non completato. Riprova.',
      'auth/invalid-credential': 'Accesso non riuscito: le credenziali non sono valide. Riprova.',
      'auth/user-token-expired': 'L’accesso è scaduto: entra di nuovo.',
    };
    return messages[code] || 'Operazione sull’account non riuscita. Riapri l’app e riprova.';
  },
  cancelled(error) {
    const code = String((error && error.code) || ''), text = String((error && error.message) || '');
    return ['auth/popup-closed-by-user', 'auth/cancelled-popup-request', 'auth/user-cancelled'].includes(code)
      || /cancel|annull|12501|error 1001|16: /i.test(code + ' ' + text);
  },

  /* ---- credenziali ---- */
  webProvider(kind) {
    if (kind === 'google') return this.provider;
    const provider = new this.sdk.OAuthProvider('apple.com');
    provider.addScope('email'); provider.addScope('name');
    provider.setCustomParameters({ locale: 'it_IT' });
    return provider;
  },
  // Accesso con le schermate di sistema; con skipNativeAuth la sessione resta solo nell'SDK JavaScript.
  async nativeSignIn(kind, skipNativeAuth = true) {
    const plugin = this.native();
    const result = kind === 'apple'
      ? await plugin.signInWithApple({ skipNativeAuth, scopes: ['email', 'name'] })
      : await plugin.signInWithGoogle({ skipNativeAuth, scopes: ['email', 'profile'] });
    const raw = (result && result.credential) || {};
    if (!raw.idToken) throw { code: 'auth/missing-credential' };
    const credential = kind === 'apple'
      ? new this.sdk.OAuthProvider('apple.com').credential({ idToken: raw.idToken, rawNonce: raw.nonce })
      : this.sdk.GoogleAuthProvider.credential(raw.idToken, raw.accessToken || null);
    return { credential, result };
  },
  credentialFromError(kind, error) {
    try {
      const P = kind === 'apple' ? this.sdk.OAuthProvider : this.sdk.GoogleAuthProvider;
      return (P && P.credentialFromError && P.credentialFromError(error)) || null;
    } catch (e) { return null; }
  },

  // La conferma usa la finestra dell'app: se si era nella scheda Account, la si riapre dopo.
  async confirm(message, okLabel, danger = false) {
    const fromBox = !!document.querySelector('#acctBox');
    const ok = await askConfirm(message, okLabel, danger);
    if (fromBox && this.user) this.openAccount();
    return ok;
  },

  /* ---- entrare, collegare, uscire ---- */
  async signIn(kind = 'google') {
    if (this.busy || !this.auth || !this.ready || !AUTH_KINDS[kind]) return;
    const name = AUTH_KINDS[kind].name;
    if (!navigator.onLine) {
      this.error = `Per accedere con ${name} serve una connessione. Puoi continuare a usare i sopralluoghi locali.`;
      this.refresh();
      return;
    }
    this.busy = 'signin'; this.busyKind = kind; this.error = '';
    this.refresh();
    let credential = null;
    try {
      let result;
      if (this.native()) {
        ({ credential } = await this.nativeSignIn(kind));
        result = await this.sdk.signInWithCredential(this.auth, credential);
      } else {
        // Chiamata diretta dal click: nessuna attesa prima dell'apertura del popup,
        // per conservare l'attivazione dell'utente anche su Safari e tablet.
        result = await this.sdk.signInWithPopup(this.auth, this.webProvider(kind));
      }
      const linked = await this.linkPending(result, kind);
      toast(linked ? `Accesso effettuato. Ora puoi entrare anche con ${AUTH_KINDS[linked].name}.` : `Accesso con ${name} effettuato`);
    } catch (error) {
      if (error && error.code === 'auth/account-exists-with-different-credential') this.keepPending(kind, credential || this.credentialFromError(kind, error), error);
      else if (!this.cancelled(error)) {
        this.error = this.message(error);
        toast(this.error, true, 8000);
      }
    } finally {
      this.busy = null; this.busyKind = null;
      this.refresh();
    }
  },
  // La stessa email è già un account SopraLux entrato con l'altro metodo: si tiene la
  // credenziale e la si collega appena l'utente entra con il metodo già registrato.
  keepPending(kind, credential, error) {
    const other = kind === 'apple' ? 'google' : 'apple';
    this.pending = credential ? { kind, credential } : null;
    const email = error && error.customData && error.customData.email;
    this.error = `${email ? 'Con ' + email : 'Con questa email'} hai già un account SopraLux, creato con ${AUTH_KINDS[other].name}. Entra con ${AUTH_KINDS[other].name}`
      + (this.pending ? `: ${AUTH_KINDS[kind].name} verrà collegato allo stesso account.` : `, poi collega ${AUTH_KINDS[kind].name} dalla scheda Account.`);
    toast(this.error, true, 9000);
  },
  async linkPending(result, kind) {
    const pending = this.pending; this.pending = null;
    const user = result && result.user;
    if (!pending || !user || pending.kind === kind) return null;
    if (!this.auth.currentUser || this.auth.currentUser.uid !== user.uid) return null;
    try {
      await this.sdk.linkWithCredential(user, pending.credential);
      return pending.kind;
    } catch (error) {
      if (!this.cancelled(error)) { this.error = this.message(error); toast(this.error, true, 8000); }
      return null;
    }
  },
  async link(kind) {
    const user = this.auth && this.auth.currentUser;
    if (this.busy || !user || !AUTH_KINDS[kind] || !this.can(kind, true)) return;
    const name = AUTH_KINDS[kind].name;
    if (!navigator.onLine) { this.error = `Per collegare ${name} serve una connessione.`; this.refresh(); return; }
    this.busy = 'link'; this.busyKind = kind; this.error = '';
    this.refresh();
    try {
      if (this.native()) {
        const { credential } = await this.nativeSignIn(kind);
        await this.sdk.linkWithCredential(user, credential);
      } else await this.sdk.linkWithPopup(user, this.webProvider(kind));
      toast(`${name} collegato: ora puoi entrare anche con ${name}.`);
    } catch (error) {
      if (!this.cancelled(error)) { this.error = this.message(error); toast(this.error, true, 8000); }
    } finally {
      this.busy = null; this.busyKind = null;
      this.refresh();
    }
  },
  async unlink(kind) {
    const user = this.auth && this.auth.currentUser, have = this.providers();
    if (this.busy || !user || !have.includes(kind) || have.length < 2) return;
    const other = have.find(k => k !== kind);
    if (!await this.confirm(`Scollegare ${AUTH_KINDS[kind].name}? Potrai entrare solo con ${AUTH_KINDS[other].name}.`, 'Scollega')) return;
    this.busy = 'unlink'; this.busyKind = kind; this.error = '';
    this.refresh();
    try {
      await this.sdk.unlink(user, AUTH_KINDS[kind].id);
      toast(`${AUTH_KINDS[kind].name} scollegato.`);
    } catch (error) {
      this.error = this.message(error); toast(this.error, true, 8000);
    } finally {
      this.busy = null; this.busyKind = null;
      this.refresh();
    }
  },

  async signOut() {
    if (this.busy || !this.auth || !this.user) return;
    this.busy = 'signout'; this.error = ''; this.pending = null;
    this.refresh();
    try {
      await this.sdk.signOut(this.auth);
      // Nell'app nativa si chiude anche la sessione di sistema: al prossimo accesso Google chiede quale account usare.
      if (this.native()) this.native().signOut().catch(() => {});
      toast('Uscita dall’account effettuata');
    } catch (error) {
      this.error = this.message(error);
      toast(this.error, true, 8000);
    } finally {
      this.busy = null;
      this.refresh();
    }
  },

  // Eliminazione dell'account (Apple 5.1.1(v)). Firebase chiede un accesso recente: si conferma
  // l'identità e si elimina. Con Apple si revoca anche l'autorizzazione data a SopraLux.
  // I dati online si cancellano sul server quando l'account sparisce (functions: eliminaDatiAccount).
  async deleteAccount() {
    const user = this.auth && this.auth.currentUser;
    if (this.busy || !user || !this.canDelete()) return;
    if (!navigator.onLine) { toast('Per eliminare l’account serve una connessione.', true, 6000); return; }
    const have = this.providers();
    const kind = have.includes('apple') && this.can('apple') ? 'apple' : have.find(k => this.can(k));
    if (!kind) { toast('Da qui non si può confermare l’accesso con Apple: elimina l’account dall’app sull’iPad.', true, 8000); return; }
    const ok = await this.confirm('Eliminare l’account SopraLux? Si cancellano l’account e i dati salvati online. Se vuoi tenere i sopralluoghi, prima fai il backup completo. Un abbonamento attivo va disdetto dalle impostazioni dello store.', 'Elimina account', true);
    if (!ok) return;
    this.busy = 'delete'; this.busyKind = kind; this.error = '';
    this.refresh();
    try {
      const plugin = this.native();
      if (plugin) {
        // Accesso di sistema completo: serve la sessione nativa per revocare Apple ed eliminare con un accesso recente.
        const { result } = await this.nativeSignIn(kind, false);
        if (!result.user || result.user.uid !== user.uid) { await plugin.signOut().catch(() => {}); throw { code: 'auth/user-mismatch' }; }
        const code = result.credential && result.credential.authorizationCode;
        if (kind === 'apple' && code) await plugin.revokeAccessToken({ token: code }).catch(() => {});
        await plugin.deleteUser();
        await plugin.signOut().catch(() => {});
        await this.sdk.signOut(this.auth).catch(() => {});
      } else {
        const result = await this.sdk.reauthenticateWithPopup(user, this.webProvider(kind));
        if (kind === 'apple' && this.sdk.revokeAccessToken) {
          const token = this.sdk.OAuthProvider.credentialFromResult(result)?.accessToken;
          if (token) await this.sdk.revokeAccessToken(this.auth, token).catch(() => {});
        }
        await this.sdk.deleteUser(user);
      }
      if (typeof closeModal === 'function' && document.querySelector('#acctBox')) closeModal();
      toast('Account eliminato.');
    } catch (error) {
      if (!this.cancelled(error)) { this.error = this.message(error); toast(this.error, true, 8000); }
    } finally {
      this.busy = null; this.busyKind = null;
      this.refresh();
    }
  },

  /* ---- interfaccia ---- */
  signInButtonsHtml(disabled) {
    return ['apple', 'google'].filter(kind => this.can(kind)).map(kind => {
      const working = this.busy === 'signin' && this.busyKind === kind;
      return `<button class="sm authb ${kind}" id="${kind === 'google' ? 'fbSignIn' : 'fbSignInApple'}"${disabled ? ' disabled' : ''}>${AUTH_ICON[kind]}<span>${working ? 'Accesso…' : 'Accedi con ' + AUTH_KINDS[kind].name}</span></button>`;
    }).join('');
  },
  // Pulsanti della riga account (usati anche dal pannello della sincronizzazione in pwa_cloud.js).
  buttonsHtml(disabled = false) {
    const off = disabled || !!this.busy;
    if (this.user) return `<button class="sm" id="fbAccount"${off ? ' disabled' : ''}>Account</button><button class="sm" id="fbSignOut"${off ? ' disabled' : ''}>${this.busy === 'signout' ? 'Uscita…' : 'Esci'}</button>`;
    if (!this.auth) return '';
    if (!this.ready) return `<button class="sm pri" id="fbSignIn" disabled>${this.error ? 'Accesso non disponibile' : 'Preparazione accesso…'}</button>`;
    return this.signInButtonsHtml(off);
  },
  label() {
    if (!this.user) return 'Account SopraLux';
    const ways = this.providers().map(kind => AUTH_KINDS[kind].name).join(' e ');
    return (this.user.email || this.user.displayName || 'Account SopraLux') + (ways ? ' · ' + ways : '');
  },
  contentHtml() {
    const signed = !!this.user;
    return `<div class="row wrap" style="gap:10px"><div style="flex:1;min-width:160px;overflow-wrap:anywhere"><b>${esc(this.label())}</b>${signed && !navigator.onLine ? ' <span class="chip warn">Offline</span>' : ''}</div><div class="row wrap authbs">${this.buttonsHtml()}</div></div>
      <div class="small" style="margin-top:6px">${signed ? 'Accesso effettuato. ' : 'Con l’account ritrovi i tuoi acquisti su Android, iPad e browser. '}I sopralluoghi restano su questo dispositivo.</div>
      ${this.error ? `<div class="small" role="status" style="margin-top:6px;color:var(--bad)">${esc(this.error)}</div>` : ''}`;
  },

  html() {
    if (this.hidden()) return '';
    return `<div class="banner" id="pwaAccount" role="region" aria-label="Account">${this.contentHtml()}</div>`;
  },

  wireButtons() {
    const bind = (selector, fn) => { const el = document.querySelector(selector); if (el) el.onclick = fn; };
    bind('#fbSignIn', () => this.signIn('google'));
    bind('#fbSignInApple', () => this.signIn('apple'));
    bind('#fbSignOut', () => this.signOut());
    bind('#fbAccount', () => this.openAccount());
  },
  wire() { this.wireButtons(); },

  // Scheda «Account»: metodi di accesso collegati ed eliminazione dell'account.
  accountBoxHtml() {
    const user = (this.auth && this.auth.currentUser) || this.user;
    if (!user) return '<h3>Account SopraLux</h3><p>Nessun accesso.</p><div class="acts"><button class="pri" id="acClose">Chiudi</button></div>';
    const have = this.providers(), off = !!this.busy;
    const rows = Object.keys(AUTH_KINDS).map(kind => {
      const on = have.includes(kind), can = this.can(kind, true), working = this.busyKind === kind && (this.busy === 'link' || this.busy === 'unlink');
      const state = on ? 'Collegato' : can ? 'Non collegato' : 'Si collega dall’app sull’iPad';
      const button = on ? (have.length > 1 ? `<button class="sm" data-unlink="${kind}"${off ? ' disabled' : ''}>${working ? 'Attendi…' : 'Scollega'}</button>` : '')
        : can ? `<button class="sm pri" data-link="${kind}"${off ? ' disabled' : ''}>${working ? 'Attendi…' : 'Collega'}</button>` : '';
      return `<div class="row acrow"><span class="aci ${kind}">${AUTH_ICON[kind]}</span><div style="flex:1;min-width:0"><b>${AUTH_KINDS[kind].name}</b><div class="small mut">${state}</div></div>${button}</div>`;
    }).join('');
    return `<h3>Account SopraLux</h3>
      <div style="overflow-wrap:anywhere"><b>${esc(user.email || user.displayName || '')}</b></div>
      <label class="f">Metodi di accesso</label>${rows}
      <div class="small mut" style="margin-top:8px">Collega Apple e Google allo stesso account: entri con l’uno o con l’altro su Android, iPad e browser e ritrovi gli stessi acquisti e impianti.</div>
      ${this.error ? `<div class="small" role="status" style="margin-top:8px;color:var(--bad)">${esc(this.error)}</div>` : ''}
      ${this.canDelete() ? `<label class="f">Eliminare l’account</label>
      <div class="small mut">Cancella l’account e i dati salvati online. Gli abbonamenti si disdicono dalle impostazioni dello store.</div>` : ''}
      <div class="acts">${this.canDelete() ? `<button class="danger" id="acDel"${off ? ' disabled' : ''}>${this.busy === 'delete' ? 'Eliminazione…' : 'Elimina account'}</button>` : ''}<button class="pri" id="acClose">Chiudi</button></div>`;
  },
  openAccount() {
    if (!this.user) return;
    this.error = '';
    openModal(`<div id="acctBox">${this.accountBoxHtml()}</div>`);
    this.wireAccountBox();
  },
  wireAccountBox() {
    const box = document.querySelector('#acctBox'); if (!box) return;
    box.querySelectorAll('[data-link]').forEach(b => b.onclick = () => this.link(b.dataset.link));
    box.querySelectorAll('[data-unlink]').forEach(b => b.onclick = () => this.unlink(b.dataset.unlink));
    const del = box.querySelector('#acDel'); if (del) del.onclick = () => this.deleteAccount();
    const close = box.querySelector('#acClose'); if (close) close.onclick = () => closeModal();
  },

  refresh() {
    const panel = document.querySelector('#pwaAccount');
    if (panel) {
      // Aggiorna soltanto l'account: il listener non riapre la home mentre si lavora.
      panel.innerHTML = this.contentHtml();
      this.wire();
    }
    const box = document.querySelector('#acctBox');
    if (box) {
      if (!this.user && !this.busy) { if (typeof closeModal === 'function') closeModal(); return; }
      box.innerHTML = this.accountBoxHtml();
      this.wireAccountBox();
    }
  },
};
