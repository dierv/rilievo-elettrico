#!/bin/sh
# Versione installabile sul tablet (PWA): stessi sorgenti dell'app in Claude, con archivio locale e AI via chiave API.
# Uso: sh build_pwa.sh [cartella di uscita]   (nel repository: sh build_pwa.sh ..  rigenera l'app pubblicata)
cd "$(dirname "$0")"
OUT=${1:-dist/pwa}
V=$(date +%Y%m%d-%H%M%S)
mkdir -p "$OUT/lib"
{
echo '<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><title>Rilievo elettrico</title><link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#1d4ed8"><link rel="icon" href="icon-192.png"><link rel="apple-touch-icon" href="icon-192.png"><style>'
cat src/style.css
echo '</style></head><body>'
cat src/body.html
echo '<script>'
echo "const PLATFORM = 'pwa'; const APP_VERSION = '$V';"
cat src/00_legenda.js src/01_core.js src/02_geom.js src/03_plan.js src/04_view.js src/05_panels.js src/05b_quadro.js src/05c_fam.js src/05d_vnote.js src/05e_check.js src/05f_close.js src/05g_compass.js src/06_ai.js src/07_export.js src/pwa.js src/08_home.js
echo '</script></body></html>'
} > "$OUT/index.html"
if [ -d vendor/node_modules ]; then
  cp vendor/node_modules/pdfjs-dist/build/pdf.min.js vendor/node_modules/pdfjs-dist/build/pdf.worker.min.js vendor/node_modules/jszip/dist/jszip.min.js vendor/node_modules/dxf-parser/dist/dxf-parser.js "$OUT/lib/"
elif [ ! -f "$OUT/lib/pdf.min.js" ]; then echo "Mancano le librerie in $OUT/lib (pdf.js 3.11.174, jszip 3.10.1, dxf-parser 1.1.2)"; fi
cp pwa_static/manifest.webmanifest pwa_static/icon-192.png pwa_static/icon-512.png pwa_static/icon-maskable.png "$OUT/"
sed "s/__VERSION__/$V/" pwa_static/sw.js > "$OUT/sw.js"
echo "PWA $V -> $OUT"
