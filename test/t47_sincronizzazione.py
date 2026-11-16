#!/usr/bin/env python3
"""t47 – Sincronizzazione nell'app degli store: archivio sul server solo con il Pro, passaggio fra due dispositivi.

L'app nativa gira nel browser con il Capacitor finto (t45_capacitor_mock.js, con il plugin dell'accesso) e un Firebase finto
(t47_fake_firebase.js: account già aperto, Firestore e Storage in memoria). Il «server» di un dispositivo si passa all'altro.
Uso (dalla cartella principale del repo, dopo `npm ci` nella cartella app):
    python3 test/t47_sincronizzazione.py
"""
import json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import t45_acquisti as T
from playwright.sync_api import sync_playwright

FAKE_FB = open(os.path.join(T.REPO, 'test', 't47_fake_firebase.js'), encoding='utf-8').read()
check = T.check


class Dev(T.App):
    """Un dispositivo: app nativa con account aperto (user) e il server indicato."""
    def __init__(self, browser, server, root, platform, store, user, srv=None, fn=None):
        self.ctx = browser.new_context(viewport={'width': 1180, 'height': 820})
        self.pg = self.ctx.new_page(); self.errs = []
        self.pg.on('pageerror', lambda e: self.errs.append('errore pagina: ' + str(e)))
        self.pg.on('console', lambda m: self.errs.append('console: ' + m.text) if m.type == 'error' and 'favicon' not in m.text and 'Failed to load resource' not in m.text else None)
        self.pg.add_init_script('window.__CAP = ' + json.dumps({'platform': platform, 'store': store, 'auth': True}) + '; window.__FB = ' + json.dumps({'user': user, 'server': srv}) + ';')
        self.pg.route('**/lib/capacitor.js', lambda r: r.fulfill(body=T.MOCK, content_type='application/javascript'))
        self.pg.route('**/lib/firebase.js', lambda r: r.fulfill(body=FAKE_FB, content_type='application/javascript'))
        self.pg.route(T.FN, lambda r: r.fulfill(status=200, headers={'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type, authorization'}, content_type='application/json', body=json.dumps({'result': fn or {'prodotti': {}, 'altroAccount': 0}})))
        self.pg.goto(server.url(root)); self.pg.wait_for_function("document.querySelector('#hList') && !/Avvio/.test(document.querySelector('#hList').textContent)", timeout=20000)
        self.pg.wait_for_timeout(600)

    def server(self): return self.js("JSON.stringify(window.__srv)")
    def heads(self): return self.js("Object.keys(window.__srv.docs).filter(p => /\\/surveys\\//.test(p) && !/_sopralux_library/.test(p)).length")
    def status(self): return self.js("PwaCloud.describe().text")

    def wait_synced(self, ms=20000):
        t = time.time() + ms / 1000
        while time.time() < t:
            if 'Sincronizzato' in (self.status() or ''): return True
            self.pg.wait_for_timeout(250)
        return False


def t_pro_two_devices(br, sv, root, png):
    print('1. Pro: il sopralluogo fatto sul tablet arriva sull\'iPad')
    a = Dev(br, sv, root, 'android', {'products': T.products('android'), 'owned': T.owned('android', 'pro_anno')}, 'anna')
    a.pg.wait_for_function("Lic.plan() === 'pro' && !!PwaCloud.engine", timeout=8000)
    check(a.js("PwaCloud.uid") == 'anna' and a.js("PwaCloud.allowed()"), 'tablet con il Pro e account aperto: archivio sul server attivo')
    a.new_survey(png, 'Prova sincronizzazione')
    if a.js("S.tool") == 'cal': a.js("setTool('sel')")
    a.tool('pen'); a.stroke([(300, 300), (420, 340), (520, 300)]); a.js("setTool('sel')")
    a.js("Sync.flush && Sync.flush()"); a.js("goHome()"); a.pg.wait_for_timeout(500)
    check(a.wait_synced(), f'tablet: «Sincronizzato» ({a.status()})')
    check(a.heads() == 1 and a.js("window.__srv.uploads") >= 2, f'sul server: il sopralluogo e i suoi file ({a.heads()} sopralluoghi, {a.js("window.__srv.uploads")} file)')
    check('Sincronizzato' in a.pg.inner_text('#pwaAccount'), 'scheda dell\'account nella prima schermata: stato della sincronizzazione')
    srv = a.server(); check(not a.errs, f'tablet: nessun errore in console: {a.errs[:3]}')
    b = Dev(br, sv, root, 'ios', {'products': T.products('ios'), 'owned': T.owned('ios', 'pro_mese'), 'env': 'Sandbox'}, 'anna', srv)
    b.pg.wait_for_function("/Prova sincronizzazione/.test(document.querySelector('#hList').textContent)", timeout=20000)
    check(True, 'iPad: il sopralluogo compare nell\'elenco')
    b.pg.click('#hList .scard'); b.pg.wait_for_function("S.sv && S.sv.plans.length && S.planImg[S.planId]", timeout=20000)
    check(b.js("S.draws.reduce((n, d) => n + d.strokes.length, 0)") == 1, 'iPad: la tavola si scarica e la scritta a penna c\'è')
    check(not b.errs, f'iPad: nessun errore in console: {b.errs[:3]}')
    # il Pro finisce sul tablet: niente più scambi con il server, i dati restano
    a.js("window.__store.owned = []; window.__listeners.transactionUpdated.forEach(f => f({}))"); a.pg.wait_for_timeout(600)
    check(a.js("Lic.plan() === 'base' && !PwaCloud.engine"), 'Pro finito: la sincronizzazione si ferma')
    check('compresi nel Pro' in a.status() and 'Prova sincronizzazione' in a.pg.inner_text('#hList'), f'i sopralluoghi restano sul dispositivo e lo stato lo dice ({a.status()})')
    a.close(); b.close()


def t_base(br, sv, root, png):
    print('2. Base con l\'account aperto: niente server finché non arriva il Pro')
    c = Dev(br, sv, root, 'android', {'products': T.products('android'), 'owned': []}, 'bruno')
    check(c.js("PwaCloud.uid") == 'bruno' and not c.js("!!PwaCloud.engine"), 'Base: account aperto ma nessun collegamento al server')
    check('compresi nel Pro' in c.pg.inner_text('#pwaAccount') and c.pg.locator('#pwaAccount #fbPro').count() == 1, 'la scheda dell\'account dice che il server è nel Pro e porta a «Piani e sblocchi»')
    c.new_survey(png, 'Solo sul tablet'); c.js("Sync.flush && Sync.flush()"); c.js("goHome()"); c.pg.wait_for_timeout(800)
    check(c.heads() == 0 and c.js("window.__srv.uploads") == 0, 'Base: niente va sul server')
    c.pg.click('#pwaAccount #fbPro'); c.pg.wait_for_selector('#licBox [data-buy]:not([disabled])')
    c.buy('pro_mese'); c.close_modal()
    c.pg.wait_for_function("!!PwaCloud.engine", timeout=8000)
    check(c.wait_synced() and c.heads() == 1, f'comprato il Pro: il sopralluogo già fatto va sul server ({c.heads()})')
    check(not c.errs, f'nessun errore in console: {c.errs[:3]}'); c.close()


def t_guest(br, sv, root, png):
    print('3. Senza account: tutto come prima')
    d = Dev(br, sv, root, 'ios', {'products': T.products('ios'), 'owned': T.owned('ios', 'pro_anno'), 'env': 'Sandbox'}, None)
    check(not d.js("PwaCloud.uid") and not d.js("!!PwaCloud.engine"), 'senza accesso: nessun collegamento al server, anche con il Pro')
    d.new_survey(png, 'Senza account'); d.js("goHome()"); d.pg.wait_for_timeout(400)
    check('Senza account' in d.pg.inner_text('#hList') and d.heads() == 0, 'il sopralluogo resta sul dispositivo')
    check(not d.errs, f'nessun errore in console: {d.errs[:3]}'); d.close()


def t_quota(br, sv, root, png):
    print('4. Spazio sul server: oltre il limite le nuove foto restano sul dispositivo, con più memoria ripartono')
    G = 1024 ** 3
    e = Dev(br, sv, root, 'android', {'products': T.products('android'), 'owned': T.owned('android', 'pro_mese')}, 'carla', fn={'prodotti': {}, 'altroAccount': 0, 'spazio': {'usati': 25 * G - 1000, 'limite': 25 * G}})
    e.pg.wait_for_function("!!PwaCloud.engine && Lic.acc && Lic.acc.spazio && Lic.acc.spazio.usati > 0", timeout=8000)
    check('Archivio sul server: 25,0 GB di 25,0 GB' in e.pg.inner_text('#pwaAccount'), f'la scheda dell\'account mostra lo spazio usato ({e.pg.inner_text("#pwaAccount")[-80:]})')
    e.new_survey(png, 'Archivio pieno'); e.js("Sync.flush && Sync.flush()"); e.js("goHome()"); e.pg.wait_for_timeout(1500)
    check(e.heads() == 0 and e.js("window.__srv.uploads") == 0, f'archivio pieno: la tavola non va sul server ({e.js("window.__srv.uploads")} file)')
    check('Archivio sul server pieno' in e.status() and 'Archivio pieno' in e.pg.inner_text('#hList'), f'lo stato lo dice e il sopralluogo resta sul dispositivo ({e.status()})')
    e.js("window.__store.owned.push(window.__tx('sopralux_mem50', 'subs')); window.__listeners.transactionUpdated.forEach(f => f({}))")
    e.pg.wait_for_function("Lic.memGb() === 75", timeout=5000)
    check(e.wait_synced() and e.heads() == 1, f'con +50 GB l\'invio riparte da solo ({e.heads()} sopralluoghi, {e.status()})')
    check(not e.errs, f'nessun errore in console: {e.errs[:3]}'); e.close()


def t_web(br, sv, png):
    print('5. Versione web: spazio usato e limite dal server; senza Studio a vita niente server')
    G = 1024 ** 3
    pwa = T.build('pwa')
    w = Dev(br, sv, pwa, 'web', None, 'dierv', fn={'prodotti': {}, 'altroAccount': 0, 'spazio': {'usati': 379 * 1024 ** 2, 'limite': 300 * G}})
    w.pg.wait_for_function("PwaCloud.space && !!PwaCloud.engine", timeout=8000)
    check('Archivio sul server: 379 MB di 300,0 GB' in w.pg.inner_text('#pwaAccount'), f'web: la scheda dell\'account mostra lo spazio ({w.pg.inner_text("#pwaAccount")[-90:]})')
    w.new_survey(png, 'Dal web'); w.js("Sync.flush && Sync.flush()"); w.js("goHome()"); w.pg.wait_for_timeout(500)
    check(w.wait_synced() and w.heads() == 1, f'web con lo Studio a vita: sincronizza ({w.status()})')
    check(not w.errs, f'web: nessun errore in console: {w.errs[:3]}'); w.close()
    x = Dev(br, sv, pwa, 'web', None, 'ignoto', fn={'prodotti': {}, 'altroAccount': 0, 'spazio': {'usati': 0, 'limite': 0}})
    x.pg.wait_for_function("PwaCloud.space && !PwaCloud.engine", timeout=8000)
    check('non è attivo per questo account' in x.status() and 'Archivio sul server:' not in x.pg.inner_text('#pwaAccount'), f'web senza Studio a vita: lo stato lo dice, nessuna sincronizzazione ({x.status()})')
    check(not x.errs, f'web: nessun errore in console: {x.errs[:3]}'); x.close()


def main():
    if not os.path.exists(os.path.join(T.REPO, 'app', 'node_modules', '@capacitor', 'core')): sys.exit('Prima eseguire npm ci nella cartella app')
    root = T.build('app', 'store'); png = T.plan_png(); sv = T.Server()
    with sync_playwright() as p:
        br = p.chromium.launch(executable_path=T.CHROME, headless=True, args=['--no-sandbox']) if T.CHROME else p.chromium.launch(headless=True)
        only = sys.argv[1:]
        for k, fn in [('1', lambda: t_pro_two_devices(br, sv, root, png)), ('2', lambda: t_base(br, sv, root, png)), ('3', lambda: t_guest(br, sv, root, png)), ('4', lambda: t_quota(br, sv, root, png)), ('5', lambda: t_web(br, sv, png))]:
            if only and k not in only: continue
            try: fn()
            except Exception as e:
                T.fails.append(f'prova {k} interrotta: {type(e).__name__}: {str(e)[:300]}'); print('   ✗ interrotta:', type(e).__name__, str(e)[:300])
        br.close()
    print(f'\n{T.done - len([f for f in T.fails if "interrotta" not in f])}/{T.done} controlli riusciti' + (f', {len(T.fails)} problemi' if T.fails else ''))
    for f in T.fails: print(' -', f)
    sys.exit(1 if T.fails else 0)


if __name__ == '__main__':
    main()
