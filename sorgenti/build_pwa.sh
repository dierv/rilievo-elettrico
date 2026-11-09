#!/bin/sh
# Versione installabile sul tablet (PWA): archivio locale, AI via chiave API e accesso Google.
# Uso: sh build_pwa.sh [cartella di uscita]   (nel repository: sh build_pwa.sh ..  rigenera l'app pubblicata)
set -eu
cd "$(dirname "$0")"
OUT=${1:-dist/pwa}
V=$(date +%Y%m%d-%H%M%S)
PWA_REPO=$(cd .. && pwd)
if [ ! -f "$PWA_REPO/lib/firebase.js" ]; then
  echo 'Manca lib/firebase.js. Dalla cartella sorgenti/firebase eseguire: npm ci e npm run build.' >&2
  exit 1
fi
mkdir -p "$OUT/lib"
PWA_DEST=$(cd "$OUT" && pwd)
if [ "$PWA_DEST" != "$PWA_REPO" ]; then cp "$PWA_REPO/lib/firebase.js" "$OUT/lib/firebase.js"; fi
{
echo '<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><title>Rilievo elettrico</title><link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#1d4ed8"><link rel="icon" href="icon-192.png"><link rel="apple-touch-icon" href="icon-192.png"><style>'
cat src/style.css
echo '</style></head><body>'
cat src/body.html
echo '<script src="lib/firebase.js"></script>'
echo '<script>'
echo "const PLATFORM = 'pwa'; const APP_VERSION = '$V';"
cat src/00_legenda.js src/01_core.js src/02_geom.js src/03_plan.js src/03b_photoplan.js src/04_view.js src/05_panels.js src/05b_quadro.js src/05c_fam.js src/05d_vnote.js src/05e_check.js src/05f_close.js src/05g_compass.js src/06_ai.js src/07_export.js src/pwa.js src/pwa_firebase.js src/08_home.js
echo '</script></body></html>'
} > "$OUT/index.html"
if [ -d vendor/node_modules ]; then
  cp vendor/node_modules/pdfjs-dist/build/pdf.min.js vendor/node_modules/pdfjs-dist/build/pdf.worker.min.js vendor/node_modules/jszip/dist/jszip.min.js vendor/node_modules/dxf-parser/dist/dxf-parser.js "$OUT/lib/"
else
  for PWA_LIB in pdf.min.js pdf.worker.min.js jszip.min.js dxf-parser.js; do
    if [ ! -f "$OUT/lib/$PWA_LIB" ] && [ -f "$PWA_REPO/lib/$PWA_LIB" ]; then cp "$PWA_REPO/lib/$PWA_LIB" "$OUT/lib/$PWA_LIB"; fi
    if [ ! -f "$OUT/lib/$PWA_LIB" ]; then
      echo "Manca $OUT/lib/$PWA_LIB (pdf.js 3.11.174, jszip 3.10.1, dxf-parser 1.1.2)." >&2
      exit 1
    fi
  done
fi
cp pwa_static/manifest.webmanifest pwa_static/icon-192.png pwa_static/icon-512.png pwa_static/icon-maskable.png "$OUT/"
sed "s/__VERSION__/$V/" pwa_static/sw.js > "$OUT/sw.js"
echo "PWA $V -> $OUT"
