# Screenshot della schermata «Piani e sblocchi» (iPad 13", build per lo store) per la verifica degli acquisti in-app.
# Uso: python3 sorgenti/store/shots_acquisti.py  (servono playwright e npm ci in app/)
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'test'))
import t45_acquisti as T
from playwright.sync_api import sync_playwright
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'screenshot')
store = T.build('app', 'store'); sv = T.Server()
with sync_playwright() as p:
    br = p.chromium.launch(executable_path=T.CHROME, headless=True, args=['--no-sandbox']) if T.CHROME else p.chromium.launch(headless=True)
    ctx = br.new_context(viewport={'width': 1376, 'height': 1032}, device_scale_factor=2)
    pg = ctx.new_page()
    pg.add_init_script('window.__CAP = ' + T.json.dumps({'platform': 'ios', 'store': {'products': T.products('ios'), 'owned': [], 'env': 'Production'}}) + ';')
    pg.route('**/lib/capacitor.js', lambda r: r.fulfill(body=T.MOCK, content_type='application/javascript'))
    pg.goto(sv.url(store)); pg.wait_for_function("document.querySelector('#hList') && !/Avvio/.test(document.querySelector('#hList').textContent)", timeout=20000)
    pg.wait_for_timeout(500)
    pg.evaluate("Lic.open()"); pg.wait_for_selector('#licBox [data-buy]:not([disabled])'); pg.wait_for_timeout(600)
    pg.screenshot(path=f'{OUT}/iap_sblocchi.png')
    pg.evaluate("document.querySelector('#licBox .licg').scrollIntoView({block:'start'})"); pg.wait_for_timeout(400)
    pg.screenshot(path=f'{OUT}/iap_pro.png')
    print(pg.inner_text('#licBox')[:1500])
    br.close()
