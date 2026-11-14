#!/bin/sh
# App nativa SopraLux (Android e iOS con Capacitor), versione gratis: tutto sul dispositivo, archivio in Documenti/SopraLux,
# niente account, sincronizzazione e service worker. Uso: sh build_app.sh [cartella di uscita]   (di solito ../app/www)
set -eu
cd "$(dirname "$0")"
OUT=${1:-../app/www}
V=$(date +%Y%m%d-%H%M%S)
REPO=$(cd .. && pwd)
mkdir -p "$OUT/lib"
{
echo '<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><title>SopraLux</title><meta name="theme-color" content="#1d4ed8"><style>'
cat src/style.css
echo '</style></head><body>'
cat src/body.html
echo '<script>'
echo "const PLATFORM = 'pwa'; const APP_VERSION = '$V';"
cat src/00_legenda.js src/01_core.js src/02_geom.js src/03_plan.js src/03b_photoplan.js src/04_view.js src/05_panels.js src/05b_quadro.js src/05c_fam.js src/05d_vnote.js src/05e_check.js src/05f_close.js src/05g_compass.js src/06_ai.js src/07_export.js src/pwa.js src/native.js src/08_home.js
echo '</script></body></html>'
} > "$OUT/index.html"
for L in pdf.min.js pdf.worker.min.js jszip.min.js dxf-parser.js; do
  if [ -d vendor/node_modules ]; then
    case $L in
      pdf.min.js|pdf.worker.min.js) cp "vendor/node_modules/pdfjs-dist/build/$L" "$OUT/lib/" ;;
      jszip.min.js) cp vendor/node_modules/jszip/dist/jszip.min.js "$OUT/lib/" ;;
      dxf-parser.js) cp vendor/node_modules/dxf-parser/dist/dxf-parser.js "$OUT/lib/" ;;
    esac
  else
    cp "$REPO/lib/$L" "$OUT/lib/$L"
  fi
done
echo "App $V -> $OUT"
