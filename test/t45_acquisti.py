#!/usr/bin/env python3
"""t45 – Piani e sblocchi: Base, sblocchi singoli, abbonamenti, acquisti degli store, modalità prova.

L'app nativa gira nel browser con un Capacitor finto (t45_capacitor_mock.js) che simula archivio e plugin degli acquisti.
Uso (dalla cartella principale del repo, dopo `npm ci` nella cartella app):
    python3 test/t45_acquisti.py
Servono: playwright per Python, Pillow, pypdf e Chrome (variabile CHROME per indicarne il percorso).
"""
import base64, functools, hashlib, http.server, io, json, os, socketserver, subprocess, sys, tempfile, threading, time, zipfile
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
from pypdf import PdfReader

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MOCK = open(os.path.join(REPO, 'test', 't45_capacitor_mock.js'), encoding='utf-8').read()
TMP = tempfile.mkdtemp(prefix='t45_')
CHROME = os.environ.get('CHROME') or next((c for c in ('/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser') if os.path.exists(c)), None)
PRE = 'sopralux_'
UNLOCKS = [('penne', 0.99), ('bussola', 0.99), ('misura', 0.99), ('audio', 0.99), ('dxf', 0.99), ('tavolafoto', 1.99), ('foto', 2.99), ('tutti', 6.99)]
SUBS = [('pro_mese', 14.99), ('pro_anno', 149.99), ('studio3_mese', 39.99), ('studio3_anno', 399.99), ('studio10_mese', 109.99), ('studio10_anno', 1099.99), ('mem50', 2.99), ('mem200', 9.99), ('mem500', 19.99)]
fails, done = [], 0


def check(cond, msg):
    global done
    done += 1
    if not cond:
        fails.append(msg); print('   ✗', msg)


def build(kind, channel=None):
    out = os.path.join(TMP, kind + ('_' + channel if channel else ''))
    env = dict(os.environ, TZ='Europe/Rome')
    if channel: env['APP_CHANNEL'] = channel
    if kind == 'app': subprocess.run(['sh', os.path.join(REPO, 'sorgenti', 'build_app.sh'), out], check=True, env=env, stdout=subprocess.DEVNULL)
    elif kind == 'pwa': subprocess.run(['sh', os.path.join(REPO, 'sorgenti', 'build_pwa.sh'), out], check=True, env=env, stdout=subprocess.DEVNULL)
    else:
        subprocess.run(['sh', os.path.join(REPO, 'sorgenti', 'build.sh')], check=True, env=env, stdout=subprocess.DEVNULL)
        os.makedirs(out, exist_ok=True); os.replace(os.path.join(REPO, 'sorgenti', 'index.html'), os.path.join(out, 'index.html'))
    return out


def price(v):  # come lo scrive lo store italiano: diverso dal prezzo di listino dell'app (€0,99), così si vede da dove arriva
    return f'{v:.2f} €'.replace('.', ',')


def products(platform, missing=()):
    out = []
    for pid, v in UNLOCKS:
        if pid in missing: continue
        if platform == 'ios': out.append({'identifier': PRE + pid, 'title': pid, 'price': v, 'priceString': price(v), 'introductoryPrice': None, 'introEligibility': 0, 'subscriptionGroupIdentifier': ''})
        else: out.append({'_type': 'inapp', 'identifier': PRE + pid, 'title': pid, 'price': v, 'priceString': price(v), 'offerToken': 'ot_' + pid})
    for pid, v in SUBS:
        if pid in missing: continue
        trial = {'price': 0, 'priceString': 'Gratis', 'numberOfPeriods': 1, 'subscriptionPeriod': {'numberOfUnits': 2, 'unit': 1}} if pid.startswith('pro_') else None
        if platform == 'ios':
            out.append({'identifier': PRE + pid, 'title': pid, 'price': v, 'priceString': price(v), 'introductoryPrice': trial, 'introEligibility': 2 if trial else 0, 'subscriptionGroupIdentifier': 'memoria' if pid.startswith('mem') else 'piani'})
        else:
            out.append({'_type': 'subs', 'planIdentifier': PRE + pid, 'identifier': 'base', 'offerId': None, 'offerToken': 'tb_' + pid, 'price': v, 'priceString': price(v), 'introductoryPrice': None})
            if trial: out.append({'_type': 'subs', 'planIdentifier': PRE + pid, 'identifier': 'base', 'offerId': 'prova14', 'offerToken': 'tt_' + pid, 'price': v, 'priceString': price(v), 'introductoryPrice': trial})
    return out


def owned(platform, *pids):
    out = []
    for i, pid in enumerate(pids):
        t = 'subs' if pid in dict(SUBS) else 'inapp'
        if platform == 'ios': out.append({'transactionId': str(2000001 + i), 'productIdentifier': PRE + pid, 'productType': t, 'isActive': True if t == 'subs' else None, 'subscriptionState': 'subscribed' if t == 'subs' else None, 'willCancel': None, 'jwsRepresentation': 'jws.' + PRE + pid})
        else: out.append({'transactionId': f'tok{i}', 'purchaseToken': f'tok{i}', 'productIdentifier': PRE + pid, 'productType': t, 'purchaseState': '1', 'isAcknowledged': True, 'willCancel': None})
    return out


def plan_png():
    im = Image.new('RGB', (1400, 900), 'white'); d = ImageDraw.Draw(im)
    d.rectangle([100, 100, 1300, 800], outline='black', width=6); d.line([700, 100, 700, 800], fill='black', width=4); d.line([100, 450, 700, 450], fill='black', width=4)
    p = os.path.join(TMP, 'pianta.png'); im.save(p); return p


class Server:
    def __init__(self):
        class H(http.server.SimpleHTTPRequestHandler):
            def log_message(self, *a): pass
        self.srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(H, directory=TMP))
        self.port = self.srv.server_address[1]
        threading.Thread(target=self.srv.serve_forever, daemon=True).start()

    def url(self, root): return f'http://127.0.0.1:{self.port}/{os.path.basename(root)}/index.html'


class App:
    """Una pagina dell'app con il Capacitor finto."""
    def __init__(self, browser, server, root, platform='android', store=None, storage=None, native=True):
        self.ctx = browser.new_context(viewport={'width': 1180, 'height': 820})
        self.pg = self.ctx.new_page(); self.errs = []
        self.pg.on('pageerror', lambda e: self.errs.append('errore pagina: ' + str(e)))
        self.pg.on('console', lambda m: self.errs.append('console: ' + m.text) if m.type == 'error' and 'favicon' not in m.text and 'Failed to load resource' not in m.text else None)
        init = 'window.__CAP = ' + json.dumps({'platform': platform if native else 'web', 'store': store}) + ';'
        if storage: init += ''.join(f'try{{localStorage.setItem({json.dumps(k)}, {json.dumps(json.dumps(v))});}}catch(e){{}}' for k, v in storage.items())
        self.pg.add_init_script(init)
        if native: self.pg.route('**/lib/capacitor.js', lambda r: r.fulfill(body=MOCK, content_type='application/javascript'))
        self.pg.goto(server.url(root)); self.pg.wait_for_function("document.querySelector('#hList') && !/Avvio/.test(document.querySelector('#hList').textContent)", timeout=20000)
        self.pg.wait_for_timeout(400)

    def js(self, code, *a): return self.pg.evaluate(code, *a)
    def close(self): self.ctx.close()
    def lic_open(self): return self.pg.locator('#licBox').count() > 0
    def close_modal(self): self.js("closeModal()")

    def new_survey(self, file=None, name='Prova'):
        pg = self.pg
        pg.click('#hNew'); pg.fill('#nN', name); pg.click('#nOk'); pg.wait_for_selector('#npFile', timeout=5000)
        if not file: self.close_modal(); return
        with pg.expect_file_chooser() as fc: pg.click('#npFile')
        fc.value.set_files(file)
        pg.wait_for_function("document.querySelector('#rcSkip') || document.querySelector('#iGo') || document.querySelector('#qIn') || (S.sv && S.sv.plans.length)", timeout=20000)
        if pg.locator('#rcSkip').count(): pg.click('#rcSkip')  # raddrizzamento della foto: «Usa così com'è»
        if pg.locator('#iGo').count(): pg.click('#iGo')  # importazione del DXF
        pg.wait_for_function("document.querySelector('#qIn') || (S.sv && S.sv.plans.length)", timeout=20000)
        if pg.locator('#qIn').count(): pg.click('#modal [data-a="1"]')
        pg.wait_for_function("S.sv && S.sv.plans.length && S.planImg[S.planId]", timeout=20000); pg.wait_for_timeout(300)

    def tool(self, t): self.pg.click(f'#tools [data-t="{t}"]'); self.pg.wait_for_timeout(120)
    def locked_tools(self): return self.js("[...document.querySelectorAll('#tools .tbtn.lk')].map(b => b.dataset.t)")

    def stroke(self, pts):
        box = self.pg.locator('#cv').bounding_box(); m = self.pg.mouse
        m.move(box['x'] + pts[0][0], box['y'] + pts[0][1]); m.down()
        for x, y in pts[1:]: m.move(box['x'] + x, box['y'] + y, steps=4)
        m.up(); self.pg.wait_for_timeout(150)

    def buy(self, pid):
        self.pg.click(f'#licBox [data-buy="{PRE + pid}"]'); self.pg.wait_for_timeout(500)

    def last_call(self, name): return self.js("(n => { const c = window.__calls.filter(x => x[0] === n); return c.length ? c[c.length - 1][1] || true : null; })", name)
    def exported(self): return self.js("[...window.__fs.keys()].filter(k => /esportazioni/.test(k))")
    def file_b64(self, path): return self.js("p => window.__fs.get(p)", path)


def t_base(br, sv, prova, png):
    print('1. Piano Base: solo penna, il resto con il lucchetto')
    a = App(br, sv, prova, 'android', {'products': products('android'), 'owned': []})
    check(a.js("Lic.on && Lic.plan() === 'base'"), 'la build dell\'app parte con il piano Base')
    check('Piano Base' in a.pg.inner_text('#hBanner'), 'la prima schermata mostra il piano Base')
    check(a.js("document.querySelector('#hLib').classList.contains('hide')"), 'il tasto Simboli è nascosto nella Base')
    a.new_survey(png)
    check(a.js("S.tool") == 'sel', 'dopo l\'importazione resta la freccia (niente calibrazione della scala nella Base)')
    check(not a.lic_open(), 'importare una tavola non apre «Piani e sblocchi»')
    check(sorted(a.locked_tools()) == sorted(['room', 'box', 'photo', 'sym', 'vnote', 'meas', 'cal']), f'strumenti con il lucchetto: {a.locked_tools()}')
    for t, f in [('room', 'Stanze'), ('photo', 'Foto sulla pianta'), ('sym', 'Simboli e legenda'), ('vnote', 'Note audio'), ('meas', 'Misura e scala'), ('cal', 'Misura e scala'), ('box', 'Stanze')]:
        a.tool(t)
        check(a.lic_open() and f in a.pg.inner_text('#licBox .banner.info') and a.js("S.tool") == 'sel', f'lo strumento {t} apre «Piani e sblocchi» su «{f}» e non si attiva')
        a.close_modal()
    # penna: tre colori e tratto medio
    a.tool('pen')
    check(a.js("S.tool") == 'pen' and not a.lic_open(), 'la penna è libera')
    check(a.js("[...document.querySelectorAll('#palette [data-pc]')].map(b => b.classList.contains('lk'))") == [False, False, False, True, True, True], 'penna: nero, rosso e blu liberi, gli altri colori con il lucchetto')
    check(a.js("[...document.querySelectorAll('#palette [data-pw]')].map(b => b.classList.contains('lk'))") == [True, False, True], 'penna: solo il tratto medio è libero')
    a.pg.click('#palette [data-pc="#16a34a"]'); a.pg.wait_for_timeout(100)
    check(a.lic_open() and 'Penne in più' in a.pg.inner_text('#licBox .banner.info') and a.js("S.pen.col") == '#dc2626', 'un colore bloccato apre «Penne in più» e non cambia il colore')
    a.close_modal()
    a.pg.click('#palette [data-pcx]'); a.pg.wait_for_timeout(100)
    check(a.lic_open(), '«Altro colore» è bloccato nella Base'); a.close_modal()
    a.pg.click('#palette [data-pc="#2563eb"]'); a.stroke([(300, 300), (380, 340), (460, 300)])
    check(a.js("S.draws.length === 1 && S.draws[0].strokes[0].col === '#2563eb'"), 'nella Base si scrive con la penna (blu)')
    a.pg.click('#palette [data-pe]'); check(a.js("S.pen.erase") is True, 'la gomma è libera')
    a.pg.click('#palette [data-pf]'); a.js("select(null)")
    # guida e pannello
    guide = a.pg.inner_text('#panel')
    check('Penna' in guide and 'Stanza:' not in guide and 'Piani e sblocchi' in guide, 'la guida del pannello parla della penna e non delle funzioni bloccate')
    check(a.pg.locator('#palette:not(.hide) .pchip').count() == 0, 'la barra dei simboli più usati non compare nella Base')
    # rotazione: a mano sì, «Segui» no
    a.pg.click('#zRot'); a.pg.click('#rotPanel [data-r="90"]')
    check(abs(a.js("S.view.r") - 1.5708) < 0.01, 'la rotazione a mano della pianta è libera')
    a.pg.click('#rotPanel [data-r="follow"]'); a.pg.wait_for_timeout(100)
    check(a.lic_open() and 'Bussola' in a.pg.inner_text('#licBox .banner.info') and not a.js("Compass.on"), '«Segui come sono girato» apre «Bussola»')
    a.close_modal(); a.pg.click('#rotPanel [data-r="0"]'); a.pg.click('#rotPanel [data-r="x"]')
    # menu e libreria
    a.pg.click('#bMenu'); check(a.pg.locator('#modal [data-m="lic"]').count() == 1, 'nel menu c\'è «Piani e sblocchi»')
    a.pg.click('#modal [data-m="lib"]'); a.pg.wait_for_timeout(100)
    check(a.lic_open() and a.pg.locator('#libL').count() == 0, 'la libreria dei simboli è negli abbonamenti'); a.close_modal()
    # esportazione: tavola e backup
    check(a.pg.inner_text('#bComputo').strip() == 'Esporta', 'il tasto in alto si chiama «Esporta» nella Base')
    a.pg.click('#bComputo')
    check(a.pg.locator('#xPng').count() == 1 and a.pg.locator('#xPdf').count() == 1 and a.pg.locator('#xFull').count() == 1 and a.pg.locator('#xZip').count() == 0, 'Esporta (Base): tavola in immagine e PDF, backup; niente ZIP con DXF e CSV')
    a.pg.click('#xPng'); a.pg.wait_for_selector('#nsNo', timeout=15000); a.pg.click('#nsNo')
    f = [k for k in a.exported() if k.endswith('.png')]
    check(len(f) == 1, f'la tavola esportata in PNG è nell\'archivio: {a.exported()}')
    if f:
        im = Image.open(io.BytesIO(base64.b64decode(a.file_b64(f[0])))).convert('RGB')
        check(im.size == (1400, 900), f'PNG della tavola alla grandezza della pianta: {im.size}')
        x0, y0, x1, y1 = a.js("(() => { const p = S.draws[0].strokes[0].pts; const xs = p.map(q => q[0]), ys = p.map(q => q[1]); return [Math.min(...xs) - 6, Math.min(...ys) - 6, Math.max(...xs) + 6, Math.max(...ys) + 6]; })()")
        blue = sum(1 for px in im.crop((int(x0), int(y0), int(x1), int(y1))).get_flattened_data() if px[2] > 180 and px[0] < 90)
        check(blue > 50, f'nel PNG c\'è il tratto blu della penna ({blue} punti)')
    a.pg.click('#bComputo'); a.pg.click('#xPdf'); a.pg.wait_for_selector('#nsNo', timeout=15000); a.pg.click('#nsNo')
    f = [k for k in a.exported() if k.endswith('.pdf')]
    check(len(f) == 1, 'la tavola esportata in PDF è nell\'archivio')
    if f:
        raw = base64.b64decode(a.file_b64(f[0])); open(os.path.join(TMP, 'tavola.pdf'), 'wb').write(raw)
        r = PdfReader(io.BytesIO(raw)); pgs = r.pages
        check(len(pgs) == 1 and abs(float(pgs[0].mediabox.width) - 1190.55) < 0.1 and abs(float(pgs[0].mediabox.height) - 841.89) < 0.1, 'PDF: una pagina A3 orizzontale')
        imgs = list(pgs[0].images)
        check(len(imgs) == 1 and Image.open(io.BytesIO(imgs[0].data)).size == (1400, 900), 'PDF: dentro c\'è l\'immagine della tavola')
        q = subprocess.run(['qpdf', '--check', os.path.join(TMP, 'tavola.pdf')], capture_output=True, text=True) if subprocess.run(['which', 'qpdf'], capture_output=True).returncode == 0 else None
        if q: check(q.returncode == 0, 'PDF valido per qpdf: ' + (q.stdout + q.stderr)[-200:])
    a.pg.click('#bComputo'); a.pg.click('#xFull'); a.pg.wait_for_selector('#nsNo', timeout=20000); a.pg.click('#nsNo')
    check(any(k.endswith('.zip') for k in a.exported()), 'il backup completo è gratis')
    a.pg.click('#bComputo'); a.pg.click('#xLic'); check(a.lic_open() and 'Computo' in a.pg.inner_text('#licBox .banner.info'), 'dalla schermata Esporta si arriva a «Piani e sblocchi»'); a.close_modal()
    check(not a.errs, f'nessun errore in console: {a.errs[:3]}')
    a.close()


def t_buy_android(br, sv, prova, png):
    print('2. Android: prezzi dallo store, acquisto di uno sblocco e del Pro')
    a = App(br, sv, prova, 'android', {'products': products('android'), 'owned': []})
    a.new_survey(png)
    a.tool('meas'); a.pg.wait_for_function("document.querySelector('#licBox [data-buy]:not([disabled])')", timeout=5000)
    txt = a.pg.inner_text('#licBox')
    check('0,99 €' in txt and '14,99 €' in txt and '1099,99 €' in txt, 'i prezzi mostrati sono quelli dello store')
    check('14 giorni di prova gratuita' in txt, 'il Pro mostra la prova gratuita che lo store offre')
    check(a.pg.locator('#licBox .licr.foc').count() == 1 and 'Misura' in a.pg.inner_text('#licBox .licr.foc'), 'la riga dello sblocco richiesto è evidenziata')
    a.js("window.__store.buy = 'cancel'"); a.buy('misura')
    check(not a.js("Lic.can('misura')") and 'non riuscito' not in a.pg.inner_text('#toast') and a.last_call('purchaseProduct') is not None, 'acquisto annullato: niente sblocco e nessun messaggio di errore')
    a.js("window.__store.buy = 'ok'"); a.buy('misura')
    c = a.last_call('purchaseProduct')
    check(c and c['productIdentifier'] == PRE + 'misura' and c['productType'] == 'inapp', f'acquisto dello sblocco passato allo store: {c}')
    check(a.js("Lic.can('misura') && !Lic.can('foto') && Lic.plan() === 'base'"), 'dopo l\'acquisto Misura è attiva, il resto no')
    check('✓ Attivo' in a.pg.inner_text('#licBox [data-row="misura"]') and a.pg.locator('#licBox .licr.foc').count() == 0, 'nella schermata lo sblocco comprato è «Attivo»')
    a.close_modal()
    check(sorted(a.locked_tools()) == sorted(['room', 'box', 'photo', 'sym', 'vnote']), f'Misura e Scala hanno perso il lucchetto: {a.locked_tools()}')
    a.tool('meas'); check(a.js("S.tool") == 'meas', 'lo strumento Misura ora si apre'); a.tool('sel')
    check(a.js("JSON.parse(localStorage.getItem('ril_ui_licStore')).ids") == [PRE + 'misura'], 'l\'acquisto è ricordato sul dispositivo')
    # tutti gli sblocchi
    a.js("Lic.open()"); a.pg.wait_for_selector('#licBox [data-buy]:not([disabled])'); a.buy('tutti')
    check(a.js("['penne','bussola','misura','audio','dxf','tavolafoto','foto'].every(f => Lic.can(f)) && !Lic.can('stanze') && !Lic.can('computo')"), '«Tutti gli sblocchi» accende i sette sblocchi ma non le funzioni degli abbonamenti')
    check(a.pg.locator('#licBox .licl .chip.ok').count() >= 7, 'gli sblocchi risultano compresi o attivi')
    # Pro con la prova gratuita
    a.buy('pro_mese'); c = a.last_call('purchaseProduct')
    check(c and c['productIdentifier'] == PRE + 'pro_mese' and c['productType'] == 'subs' and c.get('planIdentifier') == 'base' and c.get('offerToken') == 'tt_pro_mese', f'Pro mensile: piano base e offerta di prova passati a Google Play: {c}')
    check(a.js("Lic.plan() === 'pro' && Lic.can('stanze') && Lic.can('simboli') && Lic.can('computo') && Lic.can('ai') && Lic.memGb() === 25"), 'con il Pro tutto è attivo, archivio 25 GB')
    check('Il tuo piano' in a.pg.inner_text('#licBox .licc.cur'), 'la scheda Pro è segnata come «Il tuo piano»')
    check(a.pg.locator('#licBox [data-a="manage"]').count() == 1, 'con un abbonamento compare «Gestisci abbonamento»')
    # cambio piano su Android: spiegazione, nessun secondo acquisto
    n = a.js("window.__calls.filter(x => x[0] === 'purchaseProduct').length")
    a.pg.click(f'#licBox [data-buy="{PRE}studio3_mese"]'); a.pg.wait_for_timeout(200)
    check('disdici' in a.pg.inner_text('#modal') and a.js("window.__calls.filter(x => x[0] === 'purchaseProduct').length") == n, 'Android: con un abbonamento attivo il cambio di piano viene spiegato, senza un secondo acquisto')
    a.pg.click('#modal [data-a="0"]'); a.pg.wait_for_timeout(100); a.close_modal()
    check(a.locked_tools() == [], 'con il Pro nessuno strumento ha il lucchetto')
    check(a.pg.inner_text('#bComputo').strip() == 'Computo / Esporta', 'il tasto in alto torna «Computo / Esporta»')
    a.pg.click('#bComputo'); check(a.pg.locator('#xZip').count() == 1 and a.pg.locator('#xPng').count() == 1, 'Computo completo con ZIP e con la tavola in immagine/PDF')
    a.pg.click('#xZip'); a.pg.wait_for_selector('#nsNo', timeout=30000); a.pg.click('#nsNo')
    z = [k for k in a.exported() if k.endswith('.zip')]
    names = zipfile.ZipFile(io.BytesIO(base64.b64decode(a.file_b64(z[0])))).namelist() if z else []
    check(any(n.startswith('pianta/') and n.endswith('_rilievo.png') for n in names) and any(n.endswith('.dxf') for n in names), f'il pacchetto ZIP del Pro contiene la pianta annotata e il DXF: {names[:6]}')
    a.close_modal()
    a.tool('room'); check(a.js("S.tool") == 'room', 'con il Pro lo strumento Stanza si apre'); a.tool('sel')
    a.js("goHome()"); a.pg.wait_for_selector('#licHome'); a.pg.wait_for_timeout(300)
    check('Piano Pro' in a.pg.inner_text('#hBanner') and not a.js("document.querySelector('#hLib').classList.contains('hide')"), 'prima schermata: Piano Pro e tasto Simboli')
    check(not a.errs, f'nessun errore in console: {a.errs[:3]}')
    a.close()


def t_states(br, sv, prova, png):
    print('3. Stati: acquisto già fatto, in attesa, prodotti mancanti, store non raggiungibile, scadenza')
    a = App(br, sv, prova, 'android', {'products': products('android', missing=('foto', 'studio10_mese')), 'owned': owned('android', 'penne')})
    a.pg.wait_for_function("Lic.can('penne')", timeout=5000)
    check(a.js("Lic.can('penne') && !Lic.can('misura')"), 'all\'avvio l\'app legge dallo store quello che è già comprato')
    a.js("Lic.open()"); a.pg.wait_for_selector('#licBox [data-buy]:not([disabled])')
    check(a.js(f"document.querySelector('#licBox [data-buy=\"{PRE}foto\"]').disabled && document.querySelector('#licBox [data-buy=\"{PRE}studio10_mese\"]').disabled && !document.querySelector('#licBox [data-buy=\"{PRE}misura\"]').disabled"), 'un prodotto che lo store non ha ancora non si può comprare')
    a.js("window.__store.buy = 'owned'"); a.buy('audio')
    check(a.js("Lic.can('audio')") and 'già tuo' in a.pg.inner_text('#toast'), 'acquisto già fatto in passato: viene attivato')
    a.js("window.__store.buy = 'pending'"); a.buy('bussola')
    check(not a.js("Lic.can('bussola')") and 'attesa' in a.pg.inner_text('#toast'), 'pagamento in attesa: nessuno sblocco, messaggio chiaro')
    # ripristina acquisti
    a.js("window.__store.restorable = [window.__tx('sopralux_dxf', 'inapp')]"); a.pg.click('#licBox [data-a="restore"]'); a.pg.wait_for_timeout(500)
    check(a.js("Lic.can('dxf')") and a.last_call('restorePurchases') and 'ripristinati' in a.pg.inner_text('#toast'), '«Ripristina acquisti» recupera gli acquisti dell\'account dello store')
    a.close_modal(); a.close()
    # store non raggiungibile: vale l'ultimo stato noto
    a = App(br, sv, prova, 'android', {'products': products('android'), 'owned': [], 'failOwned': True, 'failProducts': True}, storage={'ril_ui_licStore': {'ids': [PRE + 'pro_anno'], 't': 1}})
    check(a.js("Lic.plan() === 'pro'"), 'senza rete resta valido l\'ultimo stato letto dallo store')
    a.js("Lic.open()"); a.pg.wait_for_timeout(500)
    check('non ci sono ancora' in a.pg.inner_text('#licBox') and a.pg.locator('#licBox [data-buy]:not([disabled])').count() == 0, 'senza prezzi dallo store i tasti di acquisto sono spenti e la schermata lo dice')
    check('Dettaglio: inapp: store non raggiungibile' in a.pg.inner_text('#licBox'), 'la schermata mostra il motivo che dà lo store')
    a.close_modal(); a.close()
    # nessun prodotto: la schermata dice che cosa ha risposto Google Play
    a = App(br, sv, prova, 'android', {'products': [], 'owned': []})
    a.js("Lic.open()"); a.pg.wait_for_timeout(600); t = a.pg.inner_text('#licBox')
    check('inapp: Product not found' in t and 'subs: Product not found' in t and 'billing: sì' in t and 'paese: IT' in t, f'nessun prodotto: si vede la risposta di Google Play ({t[t.find("Dettaglio"):][:120]})')
    a.close_modal(); a.close()
    # errore negli abbonamenti: gli sblocchi restano comprabili
    a = App(br, sv, prova, 'android', {'products': products('android'), 'owned': [], 'failSubs': True})
    a.js("Lic.open()"); a.pg.wait_for_selector('#licBox [data-buy]:not([disabled])')
    check(not a.js(f"document.querySelector('#licBox [data-buy=\"{PRE}misura\"]').disabled") and a.js(f"document.querySelector('#licBox [data-buy=\"{PRE}pro_mese\"]').disabled"), 'se gli abbonamenti non rispondono, gli sblocchi si comprano lo stesso')
    a.close_modal(); a.close()
    # abbonamento scaduto mentre l'app è aperta
    a = App(br, sv, prova, 'android', {'products': products('android'), 'owned': owned('android', 'pro_mese', 'misura')})
    a.pg.wait_for_function("Lic.plan() === 'pro'", timeout=5000); a.new_survey(png)
    a.tool('room'); a.stroke([(300, 300)]); a.stroke([(500, 300)]); a.stroke([(500, 450)]); a.stroke([(300, 300)]); a.pg.wait_for_timeout(300)
    if a.pg.locator('#modal:not(.hide) [data-a="1"]').count(): a.pg.click('#modal [data-a="1"]')
    a.pg.wait_for_timeout(300); n_rooms = a.js("S.rooms.length")
    check(n_rooms == 1, f'con il Pro si disegna una stanza ({n_rooms})')
    a.tool('room')
    a.js("window.__store.owned = window.__store.owned.filter(t => t.productIdentifier !== 'sopralux_pro_mese'); window.__listeners.transactionUpdated.forEach(f => f({}))"); a.pg.wait_for_timeout(500)
    check(a.js("Lic.plan() === 'base' && S.tool === 'sel'"), 'abbonamento scaduto: si torna alla Base e lo strumento bloccato si chiude')
    check(a.js("S.rooms.length") == n_rooms and a.js("Lic.can('misura')"), 'i dati restano (la stanza c\'è ancora) e lo sblocco comprato resta')
    check(sorted(a.locked_tools()) == sorted(['room', 'box', 'photo', 'sym', 'vnote']), f'tornano i lucchetti degli abbonamenti: {a.locked_tools()}')
    a.pg.click('#bComputo'); check(a.pg.locator('#xFull').count() == 1 and a.pg.locator('#xZip').count() == 0, 'scaduto: il backup resta, il pacchetto ZIP no'); a.close_modal()
    check(not a.errs, f'nessun errore in console: {a.errs[:3]}')
    a.close()


def t_ios(br, sv, prova, png):
    print('4. iPad: prodotti e acquisti di StoreKit, cambio di piano, ambiente di prova')
    a = App(br, sv, prova, 'ios', {'products': products('ios'), 'owned': [], 'env': 'Sandbox'})
    check(a.js("Lic.sandbox === null && !Lic.testOk()"), 'iPad: all\'avvio l\'app non interroga lo store sull\'ambiente (nessuna richiesta di accesso)')
    a.js("Lic.open()"); a.pg.wait_for_selector('#licBox [data-buy]:not([disabled])'); a.pg.wait_for_function("Lic.sandbox === true")
    check(a.js("Lic.testOk()") and a.pg.locator('#licBox [data-sim]').count() == 14, 'TestFlight (ambiente di prova di Apple): aprendo «Piani e sblocchi» compare l\'interruttore di prova')
    check(a.js("JSON.parse(localStorage.getItem('ril_ui_licSb'))") is True, 'iPad: l\'ambiente di prova viene ricordato per il prossimo avvio')
    c = a.last_call('getProducts')
    check(len(c['productIdentifiers']) == 17, f'iPad: una sola richiesta con tutti i 17 prodotti ({len(c["productIdentifiers"])})')
    check('14 giorni di prova gratuita' in a.pg.inner_text('#licBox') and 'Condizioni d\'uso' in a.pg.inner_text('#licBox') and 'Privacy' in a.pg.inner_text('#licBox'), 'iPad: prova gratuita, condizioni d\'uso e privacy nella schermata degli abbonamenti')
    a.buy('pro_anno'); c = a.last_call('purchaseProduct')
    check(c and c['productIdentifier'] == PRE + 'pro_anno' and 'planIdentifier' not in c, f'iPad: acquisto del Pro annuale: {c}')
    check(a.js("Lic.plan() === 'pro'"), 'iPad: Pro attivo dopo l\'acquisto')
    a.buy('studio3_mese')
    check(a.js("Lic.plan() === 'studio3' && Lic.memGb() === 100") and a.js("window.__store.owned.length") == 1, 'iPad: il passaggio a Studio 3 lo gestisce l\'App Store (un solo abbonamento attivo)')
    a.buy('mem200'); check(a.js("Lic.memGb() === 300"), 'iPad: +200 GB si somma all\'archivio del piano')
    a.close_modal(); a.close()
    # prodotto revocato o scaduto secondo StoreKit
    o = owned('ios', 'pro_mese', 'foto'); o[0]['isActive'] = False; o[0]['subscriptionState'] = 'expired'; o[1]['revocationDate'] = '2026-11-01T10:00:00Z'
    a = App(br, sv, prova, 'ios', {'products': products('ios'), 'owned': o, 'env': 'Sandbox'}); a.pg.wait_for_timeout(300)
    check(a.js("Lic.plan() === 'base' && !Lic.can('foto')"), 'iPad: abbonamento scaduto e acquisto rimborsato non contano')
    a.close()
    # build di prova finita per errore nell'App Store: niente acquisti simulati
    a = App(br, sv, prova, 'ios', {'products': products('ios'), 'owned': [], 'env': 'Production'}, storage={'ril_ui_licSim': [PRE + 'pro_mese']})
    check(a.js("!Lic.testOk() && Lic.plan() === 'base'"), 'iPad fuori dall\'ambiente di prova: gli acquisti simulati non valgono nemmeno nella build di prova')
    a.js("Lic.open()"); a.pg.wait_for_selector('#licBox [data-buy]:not([disabled])'); a.pg.wait_for_function("Lic.sandbox === false")
    check(a.pg.locator('#licBox [data-sim]').count() == 0 and not a.js("Lic.testOk()"), 'iPad fuori dall\'ambiente di prova: nessun tasto «Prova»')
    a.close_modal(); a.close()
    # iPad di un tester passato dalla build di TestFlight a quella dell'App Store: la prova si spegne al primo controllo
    a = App(br, sv, prova, 'ios', {'products': products('ios'), 'owned': [], 'env': 'Production'}, storage={'ril_ui_licSim': [PRE + 'pro_mese'], 'ril_ui_licSb': True})
    a.js("Lic.open()"); a.pg.wait_for_function("Lic.sandbox === false"); a.pg.wait_for_timeout(200)
    check(a.js("!Lic.testOk() && Lic.plan() === 'base' && JSON.parse(localStorage.getItem('ril_ui_licSb')) === false"), 'iPad: un ambiente di prova ricordato non vale più appena lo store dice «App Store»')
    a.close_modal(); check(not a.errs, f'nessun errore in console: {a.errs[:3]}'); a.close()


def t_test_mode(br, sv, prova, store_build, png):
    print('5. Interruttore di prova: solo nelle build di prova')
    a = App(br, sv, prova, 'android', {'products': [], 'owned': []})
    a.new_survey(png); a.js("Lic.open()"); a.pg.wait_for_timeout(400)
    check('App di prova' in a.pg.inner_text('#licBox') and a.pg.locator('#licBox [data-sim]').count() == 14, f'build di prova nella Base: un tasto «Prova» per sblocchi e piani, 14 ({a.pg.locator("#licBox [data-sim]").count()}); la memoria solo con un piano')
    a.pg.click(f'#licBox [data-sim="{PRE}foto"]'); a.pg.wait_for_timeout(200)
    check(a.js("Lic.can('foto') && !Lic.can('misura')"), 'prova di «Foto sulla pianta»: solo quella funzione si accende')
    a.pg.click(f'#licBox [data-sim="{PRE}studio3_anno"]'); a.pg.wait_for_timeout(200)
    check(a.js("Lic.plan() === 'studio3' && Lic.can('stanze')"), 'prova di Studio 3: tutto attivo')
    a.pg.click(f'#licBox [data-sim="{PRE}pro_mese"]'); a.pg.wait_for_timeout(200)
    check(a.js("Lic.plan() === 'pro' && Lic.simIds.length === 2"), 'un piano in prova alla volta: il Pro prende il posto di Studio 3')
    check(a.pg.locator('#licBox [data-row^="mem"] [data-sim]').count() == 3, 'con un piano attivo si possono provare anche i pacchetti di memoria')
    a.pg.click(f'#licBox [data-sim="{PRE}mem50"]'); a.pg.wait_for_timeout(200); check(a.js("Lic.memGb() === 75"), 'prova di +50 GB con il Pro: 75 GB')
    a.close_modal(); check(a.locked_tools() == [], 'con il Pro in prova nessun lucchetto')
    a.pg.reload(); a.pg.wait_for_function("document.querySelector('#licHome')", timeout=20000)
    check(a.js("Lic.plan() === 'pro'") and 'prova' in a.pg.inner_text('#licHome'), 'la prova resta dopo aver riaperto l\'app ed è segnalata nella prima schermata')
    a.js("Lic.open()"); a.pg.wait_for_timeout(300); a.pg.click('#licBox [data-a="simClear"]'); a.pg.wait_for_timeout(200)
    check(a.js("Lic.plan() === 'base' && !Lic.can('foto') && Lic.simIds.length === 0"), '«Azzera le prove» riporta alla Base')
    a.close_modal(); check(not a.errs, f'nessun errore in console: {a.errs[:3]}'); a.close()
    # build per lo store: nessuna prova, anche se sul dispositivo ne erano rimaste
    a = App(br, sv, store_build, 'android', {'products': products('android'), 'owned': []}, storage={'ril_ui_licSim': [PRE + 'pro_mese', PRE + 'tutti']})
    check(a.js("Lic.channel === 'store' && !Lic.testOk() && Lic.plan() === 'base' && !Lic.can('penne')"), 'build per lo store: gli acquisti simulati rimasti sul dispositivo non valgono')
    check('build di prova' not in a.pg.inner_text('#hBanner'), 'build per lo store: nessuna scritta «build di prova»')
    a.js("Lic.open()"); a.pg.wait_for_selector('#licBox [data-buy]:not([disabled])')
    check(a.pg.locator('#licBox [data-sim]').count() == 0 and 'App di prova' not in a.pg.inner_text('#licBox'), 'build per lo store: nessun tasto «Prova»')
    check(a.pg.locator(f'#licBox [data-buy="{PRE}studio3_mese"]').count() == 0 and a.pg.locator(f'#licBox [data-buy="{PRE}mem50"]').count() == 0 and a.pg.locator(f'#licBox [data-buy="{PRE}pro_mese"]').count() == 1, 'build per lo store: Studio e memoria non in vendita, Pro e sblocchi in vendita')
    box = a.pg.inner_text('#licBox')
    check('Studio 3' not in box and 'Memoria in più' not in box and 'in arrivo' not in box.lower(), 'build per lo store: niente piani o memoria «in arrivo» nella schermata')
    a.close_modal(); check(not a.errs, f'nessun errore in console: {a.errs[:3]}'); a.close()


def t_unlocks(br, sv, prova, png):
    print('6. Sblocchi uno per uno: DXF, tavola da foto, bussola, penne, foto, note audio')
    dxf = os.path.join(REPO, 'sorgenti', 'store', 'appartamento_demo.dxf')
    a = App(br, sv, prova, 'android', {'products': [], 'owned': []}, storage={'ril_ui_dxfBg': 'k'})
    a.new_survey(dxf)
    check(a.js("planIsDxf(curPlan()) && !document.querySelector('#zCol').classList.contains('hide') && document.querySelector('#zCol').classList.contains('lk') && !!document.querySelector('#zCol svg.lki')"), 'tavola DXF nella Base: interruttore «colori» con il lucchetto')
    check(a.js("dxfBg()") == 'w' and not a.js("S.planImg[S.planId].dark"), 'Base: lo sfondo nero scelto prima non vale (resta bianco)')
    a.pg.click('#zCol'); a.pg.wait_for_timeout(100)
    check(a.lic_open() and 'Colori del DXF' in a.pg.inner_text('#licBox .banner.info') and not a.js("dxfColOn(curPlan())"), 'l\'interruttore «colori» apre «Colori del DXF»')
    a.pg.click(f'#licBox [data-sim="{PRE}dxf"]'); a.pg.wait_for_timeout(600); a.close_modal()
    check(a.js("dxfBg()") == 'k' and a.js("S.planImg[S.planId].dark") is True, 'con lo sblocco torna lo sfondo nero scelto')
    check(a.js("!document.querySelector('#zCol').classList.contains('lk') && !document.querySelector('#zCol svg.lki')"), 'con lo sblocco il lucchetto sull\'interruttore «colori» sparisce')
    a.pg.click('#zCol'); a.pg.wait_for_timeout(500)
    check(not a.lic_open() and a.js("dxfColOn(curPlan())") is True, 'con lo sblocco l\'interruttore accende i colori del DXF')
    # tavola da foto
    a.pg.click('#bAddPlan'); a.pg.wait_for_selector('#npCam'); a.js("window.__cam = 0; document.querySelector('#fPlanCam').addEventListener('click', e => { window.__cam++; e.preventDefault(); })")
    a.pg.click('#npCam'); a.pg.wait_for_timeout(100)
    check(a.lic_open() and 'Tavola da foto' in a.pg.inner_text('#licBox .banner.info') and a.js("window.__cam") == 0, '«Fotografa il disegno» apre «Tavola da foto»')
    a.pg.click(f'#licBox [data-sim="{PRE}tavolafoto"]'); a.pg.wait_for_timeout(200); a.close_modal()
    a.pg.click('#bAddPlan'); a.pg.wait_for_selector('#npCam'); a.pg.click('#npCam'); a.pg.wait_for_timeout(100)
    check(a.js("window.__cam") == 1 and not a.lic_open(), 'con lo sblocco si apre la fotocamera')
    with a.pg.expect_file_chooser() as fc: a.pg.click('#bAddPlan'); a.pg.click('#npFile')
    fc.value.set_files(png); a.pg.wait_for_selector('#rcSkip', timeout=15000)
    check(a.pg.locator('#rcScale').count() == 1, 'con «Tavola da foto» un\'immagine da file si può raddrizzare e mettere in scala'); a.js("document.querySelector('#rcCanc').click()")
    # bussola
    a.js("Lic.sim('sopralux_bussola')"); a.pg.click('#zRot'); a.pg.wait_for_timeout(100)
    check(a.pg.locator('#rotPanel [data-r="follow"] .lki').count() == 0, 'con lo sblocco «Segui» non ha più il lucchetto')
    a.pg.click('#rotPanel [data-r="follow"]'); a.pg.wait_for_timeout(200); check(not a.lic_open(), 'con «Bussola» «Segui» non apre la schermata dei piani')
    a.js("Compass.stop(); document.querySelector('#rotPanel').classList.add('hide')")
    # penne
    a.js("Lic.sim('sopralux_penne')"); a.tool('pen')
    check(a.pg.locator('#palette .lk').count() == 0, 'con «Penne in più» nessun colore o spessore ha il lucchetto')
    a.pg.click('#palette [data-pc="#16a34a"]'); a.pg.click('#palette [data-pw="6"]'); check(a.js("S.pen.col === '#16a34a' && S.pen.w === 6"), 'verde e tratto spesso si scelgono')
    a.js("Lic.sim('sopralux_penne')"); a.pg.wait_for_timeout(100)
    check(a.js("S.pen.col === '#dc2626' && S.pen.w === 3"), 'tolto lo sblocco la penna torna a un colore e a uno spessore della Base'); a.pg.click('#palette [data-pf]')
    # foto e note audio
    a.js("Lic.sim('sopralux_foto'); Lic.sim('sopralux_audio')"); a.pg.wait_for_timeout(100)
    check(sorted(a.locked_tools()) == sorted(['room', 'box', 'sym', 'meas', 'cal']), f'Foto e Nota audio senza lucchetto: {a.locked_tools()}')
    a.tool('photo'); check(a.js("S.tool") == 'photo', 'lo strumento Foto si apre'); a.tool('vnote'); check(a.js("S.tool") == 'vnote', 'lo strumento Nota audio si apre'); a.tool('sel')
    check('cono della direzione' in a.pg.inner_text('#panel') and 'L\'AI mette i simboli' not in a.pg.inner_text('#panel'), 'la guida descrive la foto senza l\'AI')
    check(not a.errs, f'nessun errore in console: {a.errs[:3]}'); a.close()


def t_other_builds(br, sv, pwa, claude, png):
    print('7. PWA e versione in Claude: nessun blocco')
    for name, root in (('PWA', pwa), ('Claude', claude)):
        a = App(br, sv, root, native=False)
        check(a.js("!Lic.on && Lic.can('stanze') && Lic.can('penne') && canAI !== undefined"), f'{name}: tutto aperto')
        check(a.pg.locator('#licHome').count() == 0 and not a.js("document.querySelector('#hLib').classList.contains('hide')"), f'{name}: nessuna riga dei piani, tasto Simboli presente')
        a.new_survey(png)
        check(a.locked_tools() == [] and a.pg.inner_text('#bComputo').strip() == 'Computo / Esporta', f'{name}: nessun lucchetto sugli strumenti')
        check(a.js("S.tool") == 'cal', f'{name}: dopo l\'importazione parte la calibrazione della scala, come prima')
        a.tool('pen'); check(a.pg.locator('#palette .lk').count() == 0, f'{name}: tutti i colori della penna'); a.pg.click('#palette [data-pf]')
        a.pg.click('#bMenu'); check(a.pg.locator('#modal [data-m="lic"]').count() == 0, f'{name}: nel menu non c\'è «Piani e sblocchi»'); a.close_modal()
        a.pg.click('#bComputo'); check(a.pg.locator('#xZip').count() == 1 and a.pg.locator('#xPdf').count() == 1, f'{name}: computo completo, con in più la tavola in PDF'); a.close_modal()
        guide = a.pg.inner_text('#panel'); check('Stanza:' in guide and 'Segui come sono girato' in guide and 'Piani e sblocchi' not in guide, f'{name}: guida completa nel pannello')
        check(not a.errs, f'{name}: nessun errore in console: {a.errs[:3]}'); a.close()


def t_work(br, sv, prova, pwa, png):
    print('8. Lavoro completo con il Pro (app) e nella versione installabile: stanza, simbolo, misura, controllo, ZIP')
    for name, root, native in (('app con Pro', prova, True), ('PWA', pwa, False)):
        a = App(br, sv, root, 'android', {'products': products('android'), 'owned': owned('android', 'pro_anno')} if native else None, native=native)
        if native: a.pg.wait_for_function("Lic.plan() === 'pro'", timeout=5000)
        a.new_survey(png)
        if a.js("S.tool") == 'cal':  # calibrazione della scala: due punti e la distanza
            a.stroke([(200, 300)]); a.stroke([(600, 300)]); a.pg.wait_for_selector('#qIn', timeout=5000); a.pg.fill('#qIn', '8'); a.pg.click('#modal [data-a="1"]'); a.pg.wait_for_timeout(300)
        check(a.js("!!curPlan().ppm"), f'{name}: scala della tavola impostata')
        a.tool('room'); [a.stroke([p]) for p in [(250, 250), (450, 250), (450, 400), (250, 400), (250, 250)]]; a.pg.wait_for_timeout(300)
        if a.pg.locator('#modal:not(.hide) #qIn').count(): a.pg.click('#modal [data-a="1"]')
        if a.pg.locator('#modal:not(.hide) [data-a="1"]').count(): a.pg.click('#modal [data-a="1"]')
        a.pg.wait_for_timeout(300); check(a.js("S.rooms.length") == 1, f'{name}: stanza disegnata ({a.js("S.rooms.length")})')
        a.js("select(null)"); a.tool('sym'); a.stroke([(330, 320)]); a.pg.wait_for_timeout(300)
        check(a.js("S.items.length") == 1 and a.js("S.items[0].roomId === S.rooms[0].id"), f'{name}: simbolo messo nella stanza ({a.js("S.items.length")})')
        a.js("select(null); setTool('sel')"); a.tool('meas'); a.stroke([(250, 250)]); a.stroke([(450, 250)]); a.pg.wait_for_timeout(200)
        check('Lunghezza' in a.pg.inner_text('#panel'), f'{name}: misura fra due punti'); a.js("setTool('sel')")
        a.js("document.querySelector('#panel [data-act=\"genCheck\"]').click()"); a.pg.wait_for_timeout(300)
        check(a.pg.locator('#modal:not(.hide)').count() == 1 and not a.lic_open(), f'{name}: il controllo generale si apre'); a.close_modal()
        a.pg.click('#bComputo')
        if native:
            a.pg.click('#xZip'); a.pg.wait_for_selector('#nsNo', timeout=30000); a.pg.click('#nsNo')
            raw = base64.b64decode(a.file_b64([k for k in a.exported() if k.endswith('.zip')][0]))
        else:
            with a.pg.expect_download(timeout=30000) as dl: a.pg.click('#xZip')
            raw = open(dl.value.path(), 'rb').read()
        z = zipfile.ZipFile(io.BytesIO(raw)); names = z.namelist()
        check(any(n.endswith('.dxf') for n in names) and any(n.endswith('_rilievo.png') for n in names) and any(n.endswith('.csv') for n in names), f'{name}: ZIP con DXF, CSV e pianta annotata: {names[:8]}')
        pngs = [n for n in names if n.endswith('_rilievo.png')]
        if pngs: check(Image.open(io.BytesIO(z.read(pngs[0]))).size[0] > 1400, f'{name}: la pianta annotata ha la legenda a destra')
        a.close_modal(); check(not a.errs, f'{name}: nessun errore in console: {a.errs[:3]}'); a.close()


FN = 'https://europe-west1-sopralux-64b29.cloudfunctions.net/verificaAcquisti'


def gettone(uid):  # appAccountToken: stessa formula dell'app e del server (firebase/functions/acquisti.js)
    h = hashlib.sha256(('sopralux:' + uid).encode()).hexdigest()
    return f"{h[0:8]}-{h[8:12]}-5{h[13:16]}-{((int(h[16], 16) & 3) | 8):x}{h[17:20]}-{h[20:32]}"


class FakeFn:
    """La funzione verificaAcquisti finta: registra le chiamate e risponde con answer (dict) o con un codice di errore."""
    def __init__(self, a, answer):
        self.calls, self.answer = [], answer
        a.pg.route(FN, self.handle)

    def handle(self, route):
        req, hdr = route.request, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type, authorization', 'Access-Control-Allow-Methods': 'POST, OPTIONS'}
        if req.method == 'OPTIONS': return route.fulfill(status=204, headers=hdr)
        self.calls.append({'auth': req.headers.get('authorization'), 'data': json.loads(req.post_data or '{}').get('data')})
        if isinstance(self.answer, int): return route.fulfill(status=self.answer, headers=hdr, content_type='application/json', body=json.dumps({'error': {'status': 'INTERNAL', 'message': 'INTERNAL'}}))
        route.fulfill(status=200, headers=hdr, content_type='application/json', body=json.dumps({'result': self.answer}))

    def wait(self, a, n, ms=5000):
        t = time.time() + ms / 1000
        while len(self.calls) < n and time.time() < t: a.pg.wait_for_timeout(100)
        return len(self.calls) >= n


def login(a, uid):  # accesso all'account SopraLux simulato (nell'app vera lo fa FirebaseAccount con Apple o Google)
    a.js("""uid => { FirebaseAccount.hidden = () => false; FirebaseAccount.ready = true;
        FirebaseAccount.auth = { currentUser: uid ? { uid, getIdToken: async () => 'tok-' + uid } : null }; FirebaseAccount.user = FirebaseAccount.auth.currentUser; Lic.onAccount(); }""", uid)


def t_account(br, sv, prova, png):
    print('9. Acquisti sull\'account SopraLux: verifica sul server, altro dispositivo, uscita, scadenza')
    fut = int(time.time() * 1000) + 30 * 86400000
    # iPad: transazioni firmate al server, prodotti dell'account sommati a quelli dello store
    a = App(br, sv, prova, 'ios', {'products': products('ios'), 'owned': owned('ios', 'dxf'), 'env': 'Sandbox'})
    fn = FakeFn(a, {'prodotti': {PRE + 'misura': {'scade': None, 'store': 'google', 'prova': False}}, 'altroAccount': 0})
    a.pg.wait_for_timeout(300)
    check(not fn.calls and not a.js("Lic.can('misura')"), 'senza accesso all\'account nessuna chiamata al server')
    login(a, 'anna'); fn.wait(a, 1); a.pg.wait_for_function("Lic.can('misura')", timeout=5000)
    c = fn.calls[-1] if fn.calls else {}
    check(c.get('auth') == 'Bearer tok-anna' and c.get('data') == {'apple': ['jws.' + PRE + 'dxf'], 'google': []}, f'iPad: al server vanno il gettone dell\'account e le transazioni firmate da Apple: {c}')
    check(a.js("Lic.can('dxf') && Lic.can('misura') && !Lic.can('foto')"), 'iPad: lo sblocco comprato sull\'altro dispositivo vale anche qui')
    check(a.js("JSON.parse(localStorage.getItem('ril_ui_licAcc')).uid") == 'anna', 'la risposta del server resta sul dispositivo (anche senza rete)')
    a.js("Lic.open()"); a.pg.wait_for_selector('#licBox [data-buy]:not([disabled])')
    check('legati al tuo account SopraLux' in a.pg.inner_text('#licBox'), 'la schermata dice che gli acquisti seguono l\'account')
    n = len(fn.calls); a.buy('foto'); c = a.last_call('purchaseProduct'); fn.wait(a, n + 1)
    check(c and c.get('appAccountToken') == gettone('anna'), f'iPad: l\'acquisto porta il gettone dell\'account (appAccountToken): {c and c.get("appAccountToken")}')
    check(fn.calls and 'jws.' + PRE + 'foto' in fn.calls[-1]['data']['apple'], 'dopo l\'acquisto la nuova transazione va subito al server')
    fn.answer = {'prodotti': {PRE + 'misura': {'scade': None}}, 'altroAccount': 1}; n = len(fn.calls)
    a.js("Lic.syncAccount(true)"); fn.wait(a, n + 1); a.pg.wait_for_timeout(200)
    check('appartiene a un altro account SopraLux' in a.pg.inner_text('#licBox'), 'acquisto di questo ID Apple già legato a un altro account: la schermata lo dice')
    login(a, None); a.pg.wait_for_timeout(200)
    check(a.js("!Lic.can('misura') && Lic.can('dxf') && Lic.can('foto') && localStorage.getItem('ril_ui_licAcc') === 'null'"), 'uscita dall\'account: restano solo gli acquisti dello store di questo dispositivo')
    check('Entra nel tuo account SopraLux' in a.pg.inner_text('#licBox'), 'senza accesso la schermata invita a entrare nell\'account')
    a.close_modal(); check(not a.errs, f'nessun errore in console: {a.errs[:3]}'); a.close()
    # Android: abbonamento dell'account (comprato su iPad), ultimo stato noto all'avvio, cambio di account
    cache = {'uid': 'bruno', 'prodotti': {PRE + 'pro_mese': {'scade': fut, 'store': 'apple', 'prova': True}}, 'altro': 0, 't': 1}
    a = App(br, sv, prova, 'android', {'products': products('android'), 'owned': []}, storage={'ril_ui_licAcc': cache})
    fn = FakeFn(a, {'prodotti': {PRE + 'pro_mese': {'scade': fut, 'store': 'apple', 'prova': True}}, 'altroAccount': 0})
    check(a.js("Lic.plan() === 'pro'"), 'all\'avvio vale l\'ultimo stato dell\'account, prima che il server risponda')
    login(a, 'bruno'); fn.wait(a, 1); a.pg.wait_for_timeout(200)
    check(fn.calls and fn.calls[-1]['data'] == {'apple': [], 'google': []} and a.js("Lic.plan() === 'pro' && Lic.can('stanze')"), f'Android: il Pro comprato su iPad vale anche qui ({fn.calls[-1]["data"] if fn.calls else None})')
    a.js("Lic.open()"); a.pg.wait_for_selector('#licBox [data-buy]:not([disabled])')
    a.pg.click(f'#licBox [data-buy="{PRE}pro_anno"]'); a.pg.wait_for_timeout(300)
    check('già l\'abbonamento Pro' in a.pg.inner_text('#modal'), 'comprare un secondo abbonamento: prima un avviso')
    a.pg.click('#modal [data-a="0"]'); a.pg.wait_for_timeout(300)
    check(a.last_call('purchaseProduct') is None and a.lic_open(), 'avviso annullato: nessun acquisto, si torna a «Piani e sblocchi»')
    a.close_modal()
    fn.answer = {'prodotti': {}, 'altroAccount': 0}; login(a, 'carla'); fn.wait(a, 2); a.pg.wait_for_timeout(200)
    check(a.js("Lic.plan() === 'base'"), 'cambio di account: gli acquisti del vecchio account non valgono più')
    check(not a.errs, f'nessun errore in console: {a.errs[:3]}'); a.close()
    # Android: i token di Google Play vanno al server, l'acquisto porta il gettone dell'account
    a = App(br, sv, prova, 'android', {'products': products('android'), 'owned': owned('android', 'dxf', 'mem50')})
    fn = FakeFn(a, {'prodotti': {}, 'altroAccount': 0})
    login(a, 'dario'); fn.wait(a, 1); a.pg.wait_for_timeout(200)
    g = fn.calls[-1]['data'].get('google') if fn.calls else None
    check(g == [{'token': 'tok0', 'pid': PRE + 'dxf', 'tipo': 'inapp'}, {'token': 'tok1', 'pid': PRE + 'mem50', 'tipo': 'subs'}] and fn.calls[-1]['data'].get('apple') == [], f'Android: al server vanno i token di Google Play con prodotto e tipo: {g}')
    a.js("Lic.open()"); a.pg.wait_for_selector('#licBox [data-buy]:not([disabled])')
    n = len(fn.calls); a.buy('foto'); c = a.last_call('purchaseProduct'); fn.wait(a, n + 1)
    check(c and c.get('appAccountToken') == gettone('dario'), f'Android: l\'acquisto porta il gettone dell\'account (obfuscatedAccountId): {c and c.get("appAccountToken")}')
    check(fn.calls and any(x['pid'] == PRE + 'foto' for x in fn.calls[-1]['data'].get('google', [])), 'Android: dopo l\'acquisto il nuovo token va subito al server')
    a.close_modal(); check(not a.errs, f'nessun errore in console: {a.errs[:3]}'); a.close()
    # abbonamento scaduto nell'ultimo stato noto; server che non risponde
    old = dict(cache, prodotti={PRE + 'pro_mese': {'scade': 1000, 'store': 'apple'}, PRE + 'misura': {'scade': None}})
    a = App(br, sv, prova, 'android', {'products': products('android'), 'owned': []}, storage={'ril_ui_licAcc': old})
    fn = FakeFn(a, 500)
    check(a.js("Lic.plan() === 'base' && Lic.can('misura')"), 'abbonamento dell\'account scaduto: non conta, lo sblocco sì')
    login(a, 'bruno'); fn.wait(a, 1); a.pg.wait_for_timeout(300)
    check(a.js("Lic.can('misura')"), 'server non raggiungibile: resta l\'ultimo stato noto')
    check(not [e for e in a.errs if 'verificaAcquisti' not in e and 'CORS' not in e], f'nessun errore in console: {a.errs[:3]}'); a.close()


def main():
    if not os.path.exists(os.path.join(REPO, 'app', 'node_modules', '@capacitor', 'core')): sys.exit('Prima eseguire npm ci nella cartella app')
    prova, store_build, pwa, claude = build('app', 'prova'), build('app', 'store'), build('pwa'), build('claude')
    png = plan_png(); sv = Server()
    with sync_playwright() as p:
        br = p.chromium.launch(executable_path=CHROME, headless=True, args=['--no-sandbox']) if CHROME else p.chromium.launch(headless=True)
        only = sys.argv[1:]
        tests = [('1', lambda: t_base(br, sv, prova, png)), ('2', lambda: t_buy_android(br, sv, prova, png)), ('3', lambda: t_states(br, sv, prova, png)), ('4', lambda: t_ios(br, sv, prova, png)),
                 ('5', lambda: t_test_mode(br, sv, prova, store_build, png)), ('6', lambda: t_unlocks(br, sv, prova, png)), ('7', lambda: t_other_builds(br, sv, pwa, claude, png)), ('8', lambda: t_work(br, sv, prova, pwa, png)),
                 ('9', lambda: t_account(br, sv, prova, png))]
        for k, fn in tests:
            if only and k not in only: continue
            try: fn()
            except Exception as e:
                fails.append(f'prova {k} interrotta: {type(e).__name__}: {str(e)[:300]}'); print('   ✗ interrotta:', type(e).__name__, str(e)[:300])
        br.close()
    print(f'\n{done - len([f for f in fails if "interrotta" not in f])}/{done} controlli riusciti' + (f', {len(fails)} problemi' if fails else ''))
    for f in fails: print(' -', f)
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
