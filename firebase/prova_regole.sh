#!/bin/sh
# Prova delle regole di Firestore e Storage negli emulatori (da Cloud Shell, che ha Java e rete).
# Uso: sh ~/rilievo-elettrico/firebase/prova_regole.sh
set -eu
cd "$(dirname "$0")/.."
git pull -q
(cd sorgenti/firebase && npm ci --no-audit --no-fund -q > /dev/null 2>&1)
firebase emulators:exec --only firestore,storage --project demo-sopralux-sync "node --test --test-reporter=tap test/cloud_rules.test.cjs" > /tmp/prova_regole.log 2>&1 || true
grep -E "^# (pass|fail|skipped)|^not ok" /tmp/prova_regole.log || tail -30 /tmp/prova_regole.log
