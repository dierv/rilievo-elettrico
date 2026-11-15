#!/usr/bin/env python3
"""Penna e gomma: precisione come su carta.

- Il tratto salvato passa entro un quarto di pixel dai punti scritti (niente «punti collegati», niente ridisegno diverso al sollevamento).
- Sollevando la penna la pressione cala: lo spessore della fine del tratto non cambia (niente codina sottile).
- Nessun inchiostro previsto davanti alla punta.
- La gomma toglie esattamente quello che sta sotto il cerchio; i pezzi che restano non si spostano.

Uso: python3 test/t46_penna.py   (dopo npm ci in app/; usa le stesse funzioni di t45)
"""
import math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import t45_acquisti as T
from playwright.sync_api import sync_playwright

fails, done = [], 0
def check(ok, msg):
    global done; done += 1
    print(('   ✓ ' if ok else '   ✗ ') + msg)
    if not ok: fails.append(msg)

PTR = """(ev) => { const c = document.querySelector('#cv'), r = c.getBoundingClientRect(); c.setPointerCapture = c.releasePointerCapture = () => {}; // eventi finti: niente cattura del puntatore
  for (const [type, x, y, p] of ev) c.dispatchEvent(new PointerEvent(type, { pointerId: 7, pointerType: 'pen', isPrimary: true, clientX: r.left + x, clientY: r.top + y, pressure: p, buttons: type === 'pointerup' ? 0 : 1, bubbles: true, cancelable: true })); }"""

def handwriting(x0, y0):  # una riga «scritta a mano»: anelli piccoli e veloci, punti a 1-3 px
    pts = []
    for i in range(260):
        t = i / 259; a = t * 6 * math.pi
        pts.append((x0 + 240 * t + 9 * math.cos(a), y0 + 12 * math.sin(a) + 3 * math.sin(a * 0.37)))
    return pts

def pen_stroke(a, pts, lift=6):
    ev = [('pointerdown', pts[0][0], pts[0][1], 0.5)]
    for i, (x, y) in enumerate(pts[1:], 1):
        p = 0.5 if i < len(pts) - lift else max(0.05, 0.5 - 0.08 * (i - (len(pts) - lift - 1)))  # sollevando la penna la pressione cala
        ev.append(('pointermove', x, y, p))
    ev.append(('pointerup', pts[-1][0], pts[-1][1], 0))
    a.js(PTR, ev); a.pg.wait_for_timeout(200)

DIST = """([raw, si]) => { // distanza massima (px sullo schermo) fra i punti scritti e la curva disegnata del tratto si
  const st = S.draws.flatMap(d => d.strokes)[si]; const dense = strokeDense(st.pts.map(p => toS(p[0], p[1])), 0.2);
  const c = document.querySelector('#cv').getBoundingClientRect(); let worst = 0;
  for (const [x, y] of raw) { let b = 1e9; for (const q of dense) b = Math.min(b, Math.hypot(q[0] - x, q[1] - y)); worst = Math.max(worst, b); }
  return worst; }"""

def main():
    app = T.build('app', 'store'); png = T.plan_png(); sv = T.Server()
    with sync_playwright() as p:
        br = p.chromium.launch(executable_path=T.CHROME, headless=True, args=['--no-sandbox']) if T.CHROME else p.chromium.launch(headless=True)
        a = T.App(br, sv, app, 'android', {'products': [], 'owned': []})
        a.new_survey(png); a.tool('pen'); a.js("S.view.s = 2.5; S.view.tx = 0; S.view.ty = 0; redraw()"); a.pg.wait_for_timeout(200)
        print('1. Penna')
        raw = handwriting(120, 200); pen_stroke(a, raw)
        n = a.js("S.draws.flatMap(d => d.strokes).length")
        check(n == 1, f'un tratto salvato ({n})')
        worst = a.js(DIST, [[list(q) for q in raw], 0])
        check(worst < 0.35, f'il tratto salvato passa per i punti scritti (scarto massimo {worst:.2f} px)')
        tail = a.js("(() => { const st = S.draws.flatMap(d => d.strokes)[0]; return st.pts.slice(-3).map(p => p[2]); })()")
        check(min(tail) >= 0.45, f'sollevando la penna la fine del tratto non si assottiglia (pressioni finali {tail})')
        check(a.js("!S.tmp.snap && !S.tmp.stroke"), 'nessuna codina né inchiostro previsto dopo il sollevamento')
        npts = a.js("S.draws[0].strokes[0].pts.length")
        check(npts < len(raw), f'salvati meno punti di quelli scritti, senza cambiare la curva ({npts} su {len(raw)})')
        print('2. Gomma')
        a.js("window.__orig = strokeDense(S.draws[0].strokes[0].pts, 0.1 / S.view.s); S.pen.erase = true; S.pen.er = 24; renderPanel && renderPanel()")
        cx, cy = raw[130]
        a.js(PTR, [('pointerdown', cx, cy, 0.5), ('pointerup', cx, cy, 0)]); a.pg.wait_for_timeout(200)
        res = a.js("""([cx, cy, raw]) => { const [bx, by] = toB(cx, cy); const r = S.pen.er / 2 / S.view.s; const strokes = S.draws.flatMap(d => d.strokes);
          let inside = 0, edge = []; const moved = [];
          for (const st of strokes) { const rr = r + st.w / 2; const dense = strokeDense(st.pts, 0.2 / S.view.s);
            for (const q of dense) if (Math.hypot(q[0] - bx, q[1] - by) < rr - 0.3 / S.view.s) inside++;
            for (const e of [st.pts[0], st.pts[st.pts.length - 1]]) edge.push(Math.abs(Math.hypot(e[0] - bx, e[1] - by) - rr) * S.view.s);
            let worst = 0; for (const q of dense) { let b = 1e9; for (const o of window.__orig) b = Math.min(b, Math.hypot(o[0] - q[0], o[1] - q[1])); worst = Math.max(worst, b * S.view.s); } moved.push(worst); }
          return { n: strokes.length, inside, edge: edge.sort((a, b) => a - b).slice(0, 2), moved }; }""", [cx, cy, [list(q) for q in raw]])
        check(res['n'] == 2, f'la gomma divide il tratto in due pezzi ({res["n"]})')
        check(res['inside'] == 0, f'sotto il cerchio della gomma non resta inchiostro ({res["inside"]} punti)')
        check(all(e < 0.6 for e in res['edge']), f'il taglio è sul bordo del cerchio (scarto {[round(e, 2) for e in res["edge"]]} px)')
        check(all(m < 0.35 for m in res['moved']), f'i pezzi rimasti non si spostano (scarto massimo {[round(m, 2) for m in res["moved"]]} px)')
        check(not a.errs, f'nessun errore in console: {a.errs[:3]}')
        a.close(); br.close()
    print(f'\n{done - len(fails)}/{done} controlli riusciti' + (f', {len(fails)} problemi' if fails else ''))
    for f in fails: print(' -', f)
    sys.exit(1 if fails else 0)

if __name__ == '__main__':
    main()
