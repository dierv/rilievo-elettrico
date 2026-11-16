#!/bin/sh
# Pubblica le regole di Firestore e Storage (da Cloud Shell). La prima volta Firebase chiede di dare a Storage
# il permesso di leggere Firestore (regole che usano firestore.get): rispondere sì.
set -eu
cd "$(dirname "$0")/.."
git pull -q
firebase deploy --only firestore:rules,storage --project sopralux-64b29
