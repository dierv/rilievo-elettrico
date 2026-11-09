/* ============ FIREBASE: ACCESSO GOOGLE (solo PWA) ============ */
// Primo passo: l'identità Google resta separata dall'archivio locale.
// CAP.uid, CAP.db e CAP.assets restano invariati fino all'introduzione della
// sincronizzazione con migrazione e isolamento dei dati per account.
const FirebaseAccount = {
  sdk: null, app: null, auth: null, provider: null, user: null,
  ready: false, started: false, busy: null, error: '', unsubscribe: null,

  init() {
    if (this.started) return;
    this.started = true;
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
        this.error = 'Accesso Google non disponibile. Riapri l’app per riprovare.';
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

  message(error) {
    const code = error && error.code;
    const messages = {
      'sdk-unavailable': 'Accesso Google non disponibile. Riapri l’app quando hai una connessione.',
      'auth/popup-blocked': 'Il browser ha bloccato la finestra di accesso. Consenti i popup per questo sito e riprova. Se usi l’app installata, apri lo stesso indirizzo nel browser.',
      'auth/unauthorized-domain': 'Questo indirizzo non è ancora autorizzato: aggiungi ' + location.hostname + ' ai domini autorizzati di Firebase Authentication.',
      'auth/operation-not-allowed': 'L’accesso Google non è ancora abilitato nel progetto Firebase di Sopralux.',
      'auth/configuration-not-found': 'Authentication non è ancora configurato nel progetto Firebase di Sopralux.',
      'auth/network-request-failed': 'Connessione non riuscita. Controlla la rete e riprova.',
      'auth/invalid-api-key': 'Configurazione Firebase non valida: verifica la configurazione dell’app Sopralux.',
      'auth/app-not-authorized': 'Questa app non è autorizzata ad accedere al progetto Firebase.',
      'auth/user-disabled': 'Questo account è stato disabilitato.',
      'auth/too-many-requests': 'Troppi tentativi di accesso. Attendi qualche minuto e riprova.',
      'auth/web-storage-unsupported': 'Il browser non permette di memorizzare l’accesso. Abilita i dati dei siti e riprova.',
      'auth/operation-not-supported-in-this-environment': 'Apri Sopralux dal suo indirizzo HTTPS in Chrome, Edge o Safari e riprova.',
    };
    return messages[code] || 'Operazione sull’account non riuscita. Riapri l’app e riprova.';
  },

  async signIn() {
    if (this.busy || !this.auth || !this.ready) return;
    if (!navigator.onLine) {
      this.error = 'Per accedere con Google serve una connessione. Puoi continuare a usare i sopralluoghi locali.';
      this.refresh();
      return;
    }
    this.busy = 'signin'; this.error = '';
    this.refresh();
    try {
      // Chiamata diretta dal click: nessuna attesa prima dell'apertura del popup,
      // per conservare l'attivazione dell'utente anche su Safari e tablet.
      await this.sdk.signInWithPopup(this.auth, this.provider);
      toast('Accesso Google effettuato');
    } catch (error) {
      if (!['auth/popup-closed-by-user', 'auth/cancelled-popup-request'].includes(error && error.code)) {
        this.error = this.message(error);
        toast(this.error, true, 8000);
      }
    } finally {
      this.busy = null;
      this.refresh();
    }
  },

  async signOut() {
    if (this.busy || !this.auth || !this.user) return;
    this.busy = 'signout'; this.error = '';
    this.refresh();
    try {
      await this.sdk.signOut(this.auth);
      toast('Uscita dall’account Google effettuata');
    } catch (error) {
      this.error = this.message(error);
      toast(this.error, true, 8000);
    } finally {
      this.busy = null;
      this.refresh();
    }
  },

  contentHtml() {
    const signed = !!this.user;
    const label = signed ? (this.user.email || this.user.displayName || 'Account Google collegato') : 'Account Google';
    const button = signed
      ? `<button class="sm" id="fbSignOut"${this.busy ? ' disabled' : ''}>${this.busy === 'signout' ? 'Uscita…' : 'Esci'}</button>`
      : this.auth
        ? `<button class="sm pri" id="fbSignIn"${!this.ready || this.busy ? ' disabled' : ''}>${this.busy === 'signin' ? 'Accesso…' : this.ready ? 'Accedi con Google' : this.error ? 'Accesso non disponibile' : 'Preparazione accesso…'}</button>`
        : '';
    return `<div class="row wrap" style="gap:10px"><div style="flex:1;min-width:160px;overflow-wrap:anywhere"><b>${esc(label)}</b>${signed && !navigator.onLine ? ' <span class="chip warn">Offline</span>' : ''}</div>${button}</div>
      <div class="small" style="margin-top:6px">${signed ? 'Accesso effettuato. ' : ''}I sopralluoghi restano su questo dispositivo. La sincronizzazione tra dispositivi non è ancora attiva.</div>
      ${this.error ? `<div class="small" role="status" style="margin-top:6px;color:var(--bad)">${esc(this.error)}</div>` : ''}`;
  },

  html() {
    return `<div class="banner" id="pwaAccount" role="region" aria-label="Account Google">${this.contentHtml()}</div>`;
  },

  wire() {
    const signIn = document.querySelector('#fbSignIn');
    const signOut = document.querySelector('#fbSignOut');
    if (signIn) signIn.onclick = () => this.signIn();
    if (signOut) signOut.onclick = () => this.signOut();
  },

  refresh() {
    const panel = document.querySelector('#pwaAccount');
    if (!panel) return;
    // Aggiorna soltanto l'account: il listener non riapre la home mentre si lavora.
    panel.innerHTML = this.contentHtml();
    this.wire();
  },
};
