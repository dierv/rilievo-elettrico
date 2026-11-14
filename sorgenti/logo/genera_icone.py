# Genera tutte le icone e le immagini di avvio di SopraLux dai file SVG di questa cartella.
# Uso (dalla cartella del repository): python3 sorgenti/logo/genera_icone.py
# Serve Python con Pillow e Playwright (Chromium) per disegnare gli SVG.
import asyncio, os, glob
from PIL import Image, ImageDraw
from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
RES = os.path.join(REPO, 'app/android/app/src/main/res')
IOS = os.path.join(REPO, 'app/ios/App/App/Assets.xcassets')
TMP = os.path.join(HERE, '.png'); os.makedirs(TMP, exist_ok=True)

async def render(names, size=1024):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': size, 'height': size})
        for n in names:
            svg = open(os.path.join(HERE, n + '.svg')).read().replace('<svg ', f'<svg width="{size}" height="{size}" ', 1)
            await pg.set_content(f'<html><body style="margin:0;background:transparent">{svg}</body></html>')
            await pg.screenshot(path=os.path.join(TMP, n + '.png'), omit_background=True, clip={'x': 0, 'y': 0, 'width': size, 'height': size})
        await b.close()

def img(n): return Image.open(os.path.join(TMP, n + '.png')).convert('RGBA')
def save(im, path, size=None, rgb=False):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if size: im = im.resize(size, Image.LANCZOS)
    if rgb: im = im.convert('RGB')
    im.save(path, optimize=True); print('  ', os.path.relpath(path, REPO), im.size)

def main():
    asyncio.run(render(['sopralux', 'sopralux-quadrata', 'sopralux-android-fg', 'sopralux-android-bg']))
    mark, sq, fg, bg = img('sopralux'), img('sopralux-quadrata'), img('sopralux-android-fg'), img('sopralux-android-bg')
    full = Image.alpha_composite(bg, fg) # quadrato pieno con il disegno nella zona sicura (icone «maskable» e tonde)
    # PWA
    save(mark, os.path.join(REPO, 'sorgenti/pwa_static/icon-192.png'), (192, 192))
    save(mark, os.path.join(REPO, 'sorgenti/pwa_static/icon-512.png'), (512, 512))
    save(full, os.path.join(REPO, 'sorgenti/pwa_static/icon-maskable.png'), (512, 512))
    # Android: icona classica, tonda e adattiva (primo piano + fondo)
    for d, s in {'mdpi': 48, 'hdpi': 72, 'xhdpi': 96, 'xxhdpi': 144, 'xxxhdpi': 192}.items():
        save(mark, f'{RES}/mipmap-{d}/ic_launcher.png', (s, s))
        r = full.resize((s, s), Image.LANCZOS); m = Image.new('L', (s * 4, s * 4), 0); ImageDraw.Draw(m).ellipse((0, 0, s * 4 - 1, s * 4 - 1), fill=255)
        r.putalpha(m.resize((s, s), Image.LANCZOS)); save(r, f'{RES}/mipmap-{d}/ic_launcher_round.png')
        a = int(s * 108 / 48)
        save(fg, f'{RES}/mipmap-{d}/ic_launcher_foreground.png', (a, a))
        save(bg, f'{RES}/mipmap-{d}/ic_launcher_background.png', (a, a), rgb=True)
    # immagini di avvio: fondo blu e il marchio al centro
    for f in glob.glob(f'{RES}/drawable*/splash.png') + glob.glob(f'{IOS}/Splash.imageset/*.png'):
        w, h = Image.open(f).size; im = bg.resize((w, h), Image.LANCZOS); k = int(min(w, h) * 0.42)
        im.alpha_composite(fg.resize((k, k), Image.LANCZOS), ((w - k) // 2, (h - k) // 2)); save(im, f, rgb=True)
    # iOS e store: quadrata piena senza trasparenza (gli angoli li arrotonda il sistema)
    save(sq, f'{IOS}/AppIcon.appiconset/AppIcon-512@2x.png', (1024, 1024), rgb=True)
    save(sq, os.path.join(REPO, 'sorgenti/store/icona-play-512.png'), (512, 512), rgb=True)
    save(sq, os.path.join(REPO, 'sorgenti/store/icona-1024.png'), (1024, 1024), rgb=True)

if __name__ == '__main__': main()
