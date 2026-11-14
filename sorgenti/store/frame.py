# screenshot con titolo per gli store (stessa misura dell'originale)
import asyncio, base64, os
from playwright.async_api import async_playwright
D = '/home/claude/store/shots'; O = '/home/claude/store/finali'; os.makedirs(O, exist_ok=True)
CAP = {
 '1_penna': ('Scrivi a mano sulla pianta', 'Come sulla carta: penna, colori e gomma. Il palmo non lascia segni.'),
 '2_stanze': ('Ogni locale, il suo stato', 'Stanze a colori: vedi subito cosa manca e cosa è già rilevato.'),
 '3_simboli': ('I simboli della tua legenda', 'Prese, comandi, luci e quadri con un tocco, dove servono.'),
 '4_computo': ('Dal sopralluogo al computo', 'Esporta DXF per AutoCAD, CSV per Excel e uno ZIP con foto e note.'),
 '5_scuro': ('Tema scuro, DXF su fondo nero', 'Riposa gli occhi in interni e di sera, come in AutoCAD.'),
}
SIZES = {'ipad13': (2752, 2064), 'tab10': (2560, 1600), 'phone': (1080, 1920)}
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for tag, (W, H) in SIZES.items():
            pg = await b.new_page(viewport={'width': W, 'height': H})
            for k, (t, s) in CAP.items():
                img = base64.b64encode(open(f'{D}/{tag}_{k}.png', 'rb').read()).decode()
                ph = H > W; fs = W * (0.062 if ph else 0.036); ss = fs * 0.5; top = H * (0.16 if ph else 0.155)
                html = f'''<html><body style="margin:0;width:{W}px;height:{H}px;overflow:hidden;font-family:Inter,sans-serif;background:linear-gradient(160deg,#2d62f3,#1739ad)">
                <div style="position:absolute;left:0;right:0;top:{H*0.035}px;text-align:center;color:#fff"><div style="font-size:{fs}px;font-weight:800;letter-spacing:-.01em">{t}</div><div style="font-size:{ss}px;opacity:.9;margin-top:{ss*0.35}px">{s}</div></div>
                <div style="position:absolute;left:50%;top:{top}px;transform:translateX(-50%);width:{min(W*(0.86 if not ph else 0.84),(H-top-H*0.035)*W/H)}px;border-radius:{W*0.012}px;overflow:hidden;box-shadow:0 {W*0.006}px {W*0.03}px rgba(0,0,0,.35);background:#fff">
                <img src="data:image/png;base64,{img}" style="display:block;width:100%"></div></body></html>'''
                await pg.set_content(html); await pg.wait_for_timeout(200)
                await pg.screenshot(path=f'{O}/{tag}_{k}.png')
            await pg.close()
        await b.close()
asyncio.run(main())
