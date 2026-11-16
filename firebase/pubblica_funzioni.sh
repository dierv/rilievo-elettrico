#!/bin/sh
# Pubblica le funzioni del server di SopraLux da Cloud Shell (progetto sopralux-64b29):
# aggiorna il codice dal repo, fa le prove degli acquisti e pubblica tutte le funzioni.
# Uso, in Cloud Shell:   sh ~/rilievo-elettrico/firebase/pubblica_funzioni.sh
# (la prima volta: git clone https://github.com/dierv/rilievo-elettrico)
set -eu
cd "$(dirname "$0")/.."
git pull -q
git log --oneline -1
cd firebase/functions
npm install --no-audit --no-fund -q
if ! npm test > /tmp/prove_acquisti.log 2>&1; then tail -40 /tmp/prove_acquisti.log; echo "PROVE NON RIUSCITE: niente pubblicazione"; exit 1; fi
grep -E "^# (pass|fail)" /tmp/prove_acquisti.log
cd ../..
firebase deploy --only functions --project sopralux-64b29 --non-interactive
