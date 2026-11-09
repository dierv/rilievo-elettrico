import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const entry = fileURLToPath(new URL('./fb-entry.js', import.meta.url));
const outfile = fileURLToPath(new URL('../../lib/firebase.js', import.meta.url));

await mkdir(dirname(outfile), { recursive: true });
await build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  format: 'iife',
  globalName: 'FB',
  platform: 'browser',
  target: ['es2020'],
  minify: true,
  charset: 'utf8',
  legalComments: 'inline',
  banner: { js: '/* Sopralux: Firebase 13.2.0, app + auth. Rigenerare con npm ci e npm run build in sorgenti/firebase. */' },
  logLevel: 'info'
});
