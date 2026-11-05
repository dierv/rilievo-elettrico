#!/bin/sh
cd "$(dirname "$0")"
{
echo '<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><title>Rilievo elettrico</title><style>'
cat src/style.css
echo '</style></head><body>'
cat src/body.html
echo '<script>'
echo "const PLATFORM = 'claude';"
cat src/00_legenda.js src/01_core.js src/02_geom.js src/03_plan.js src/04_view.js src/05_panels.js src/05b_quadro.js src/05c_fam.js src/05d_vnote.js src/05e_check.js src/05f_close.js src/05g_compass.js src/06_ai.js src/07_export.js src/08_home.js
echo '</script></body></html>'
} > index.html
