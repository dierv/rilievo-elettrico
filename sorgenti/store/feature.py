import asyncio, base64
from playwright.async_api import async_playwright
logo = open('/home/claude/rilievo-elettrico/sorgenti/logo/sopralux.svg').read().replace('<svg ', '<svg width="150" height="150" ', 1)
shot = base64.b64encode(open('/home/claude/store/shots/tab10_1_penna.png', 'rb').read()).decode()
html = f'''<html><body style="margin:0;width:1024px;height:500px;overflow:hidden;font-family:Inter,sans-serif;background:linear-gradient(135deg,#2d62f3,#1739ad);position:relative">
<div style="position:absolute;left:56px;top:96px;display:flex;flex-direction:column;gap:18px;color:#fff;width:430px">
{logo}
<div style="font-size:62px;font-weight:800;letter-spacing:-.02em;line-height:1">Sopra<span style="color:#fbbf24">Lux</span></div>
<div style="font-size:26px;line-height:1.25;opacity:.95">Rilievi elettrici sul tablet:<br>dalla pianta al computo</div></div>
<div style="position:absolute;left:500px;top:60px;width:620px;height:388px;border-radius:14px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.4);transform:rotate(-3deg)"><img src="data:image/png;base64,{shot}" style="width:100%;display:block"></div>
</body></html>'''
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1024, 'height': 500})
        await pg.set_content(html); await pg.wait_for_timeout(300); await pg.screenshot(path='/home/claude/store/finali/play_grafica_1024x500.png'); await b.close()
asyncio.run(main())
