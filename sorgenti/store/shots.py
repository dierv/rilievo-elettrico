# screenshot per gli store: app nativa simulata, pianta d'esempio inventata
import asyncio, json, sys, math
sys.path.insert(0, '/home/claude/store')
from hand import text, arrow, ring, line
from playwright.async_api import async_playwright
CAP = open('/home/claude/rilievo/test/capsim.js').read()
OUT = '/home/claude/store/shots'
import os; os.makedirs(OUT, exist_ok=True)
ROOMS = json.load(open('/home/claude/store/rooms.json'))
DONE = {'Soggiorno': True, 'Cucina': True, 'Bagno': True}
ITEMS = [
 ('0047_LUCE_SOFFITTO', 2.2, 6.6), ('0047_LUCE_SOFFITTO', 4.7, 6.6), ('0075a_BIPRESA', 0.45, 5.0), ('0075a_BIPRESA', 0.45, 7.9), ('0075a_BIPRESA', 3.0, 8.55),
 ('0075a_BIPRESA', 6.25, 7.6), ('0081_TV', 6.25, 6.9), ('0080_DATI', 6.25, 6.3), ('0039_DEVIATORE', 6.25, 5.1), ('0039_DEVIATORE', 0.45, 4.35),
 ('0047_LUCE_SOFFITTO', 2.3, 2.3), ('0076_SCHUKO', 1.0, 1.05), ('0076_SCHUKO', 2.0, 1.05), ('0076_SCHUKO', 3.1, 1.05), ('0074_16A_FM', 3.95, 1.05), ('0035_INTERRUTTORE', 4.25, 3.55),
 ('0047_LUCE_SOFFITTO', 9.1, 6.4), ('0039_DEVIATORE', 7.95, 5.05), ('0039_DEVIATORE', 11.55, 6.1), ('0075a_BIPRESA', 8.2, 8.55), ('0075a_BIPRESA', 10.6, 8.55), ('0081_TV', 11.55, 7.4),
 ('0047_LUCE_SOFFITTO', 10.0, 2.7), ('0075a_BIPRESA', 8.35, 1.6), ('0035_INTERRUTTORE', 8.35, 4.0), ('0080_DATI', 11.55, 3.9),
 ('0047_LUCE_SOFFITTO', 6.3, 1.5), ('0048_LUCE_PARETE', 5.4, 2.35), ('0073_10A_FM', 7.95, 1.8), ('0035_INTERRUTTORE', 7.6, 2.35),
 ('0047_LUCE_SOFFITTO', 7.3, 3.7), ('0003_QE2', 4.65, 3.35), ('0043a_PULSANTE', 6.2, 3.75),
]
RED, BLUE, GREEN = '#dc2626', '#2563eb', '#16a34a'
INK = [ # (colore, tratti in metri)
 (RED, text('QE 12 mod.', 2.35, 3.25, 0.2, 3)), (RED, ring(4.68, 3.36, 0.3, 0.3, 4)), (RED, arrow(3.95, 3.4, 4.35, 3.36, 14)),
 (RED, text('DA SPOSTARE', 1.0, 5.15, 0.24, 5)), (RED, arrow(0.95, 5.2, 0.6, 5.05, 6)),
 (BLUE, text('h 110', 6.55, 5.45, 0.2, 7, rot=0)),
 (RED, ring(10.6, 8.5, 0.32, 0.28, 8)), (RED, text('VERIFICARE ?', 8.7, 7.75, 0.22, 9)),
 (BLUE, text('3x2,5', 9.0, 3.3, 0.24, 10)), (GREEN, text('OK', 7.2, 0.95, 0.24, 11)),
 (BLUE, text('16A', 3.75, 1.45, 0.18, 12)), (BLUE, [line([(1.0, 1.4), (3.2, 1.4)], 13)]),
]
async def build(page):
    await page.click('#hNew'); await page.fill('#nN', 'Appartamento Via Garibaldi 12'); await page.click('#nOk'); await page.wait_for_timeout(300)
    await page.set_input_files('#fPlan', '/home/claude/store/appartamento_demo.dxf'); await page.wait_for_selector('#iGo', timeout=15000)
    await page.fill('#iNm', 'Piano primo – stato di fatto'); await page.click('#iGo')
    await page.wait_for_function("S.sv && curPlan() && S.planImg[curPlan().id]", timeout=20000); await page.wait_for_timeout(500)
    await page.evaluate("""(D)=>{ const P=curPlan(), d=P.dxf, T=([x,y])=>[(x-d.minX)*d.s,(d.maxY-y)*d.s];
      for (const [n,[x0,y0,x1,y1]] of Object.entries(D.rooms)) S.rooms.push({id:uid('r'),planId:P.id,name:n,kind:'',h:2.7,done:!!D.done[n],note:'',poly:[T([x0,y0]),T([x1,y0]),T([x1,y1]),T([x0,y1])]});
      for (const [c,x,y] of D.items) { const [px,py]=T([x,y]); S.items.push({id:uid('i'),planId:P.id,photoId:null,roomId:null,s:c,x:px,y:py,pts:null,d:null,src:'man',ok:true,lk:true,n:1,h:null,note:'',conf:1}); }
      const st=[]; for (const [col,strokes] of D.ink) for (const s of strokes) st.push({col, w:9, pts:s.map(([x,y,p])=>{const q=T([x,y]); return [q[0],q[1],p];})});
      S.draws.push({id:uid('d'),planId:P.id,strokes:st});
      roomGeometryChanged(P.id); Sync.mark('meta','plan:'+P.id); fitView(); renderPanel(); redraw(); }""", {'rooms': ROOMS, 'done': DONE, 'items': ITEMS, 'ink': INK})
    await page.evaluate("""(async()=>{ const r=await fetch('/test/foto.jpg').then(r=>r.blob()).catch(()=>null); })()""")

HIDE = "document.querySelector('#toast').classList.add('hide'); const h=document.querySelector('#hint'); if(h) h.style.display='none'; document.querySelectorAll('#panel .banner.warn').forEach(e=>e.remove()); 0"
async def shot(page, name):
    await page.wait_for_timeout(500); await page.evaluate(HIDE); await page.wait_for_timeout(100)
    await page.screenshot(path=f'{OUT}/{name}.png')
async def scenes(page, tag, portrait=False):
    await build(page)
    if portrait: await page.evaluate("UIP.set('pnMin',false); 0")
    # 1 penna
    await page.evaluate("document.querySelector('#pwrap').classList.contains('min') || document.querySelector('#pnTog').click(); setTool('pen'); fitView(); redraw(); 0")
    await shot(page, f'{tag}_1_penna')
    # 2 stanza selezionata col pannello
    await page.evaluate("document.querySelector('#pwrap').classList.contains('min') && document.querySelector('#pnTog').click(); setTool('sel'); 0"); await page.wait_for_timeout(200)
    await page.evaluate("fitView(); select('room', S.rooms.find(r=>r.name==='Camera').id); 0")
    await shot(page, f'{tag}_2_stanze')
    # 3 simboli
    await page.evaluate("S.sel=null; setTool('sym'); fitView(); redraw(); 0")
    await shot(page, f'{tag}_3_simboli')
    # 4 computo
    await page.evaluate("setTool('sel'); openComputo(); 0"); await page.wait_for_timeout(800)
    await shot(page, f'{tag}_4_computo')
    await page.evaluate("closeModal(); 0")
    # 5 tema scuro e DXF nero
    await page.evaluate("UIP.set('theme','dark'); UIP.set('dxfBg','k'); applyTheme(); (async()=>{ await loadPlanImage(curPlan().id,true); setTool('pen'); fitView(); redraw(); })(); 0"); await page.wait_for_timeout(800)
    await shot(page, f'{tag}_5_scuro')
    await page.evaluate("UIP.set('theme','light'); UIP.set('dxfBg','w'); applyTheme(); 0")
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for W, H, dpr, tag in [(1376, 1032, 2, 'ipad13'), (1280, 800, 2, 'tab10'), (540, 960, 2, 'phone')]:
            ctx = await b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=dpr, has_touch=True)
            page = await ctx.new_page(); logs = []; page.on('pageerror', lambda e: logs.append(str(e)))
            await page.route('https://**/*', lambda r: r.abort()); await page.add_init_script(CAP)
            await page.goto('http://127.0.0.1:8767/index.html'); await page.wait_for_function("!document.querySelector('#hList').textContent.includes('Avvio')", timeout=15000)
            await scenes(page, tag, W < H)
            print(tag, logs[:3])
            await ctx.close()
        await b.close()
asyncio.run(main())
