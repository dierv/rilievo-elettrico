#!/bin/sh
# Applica firebase/cors.json al bucket di Storage e lo rilegge (da Cloud Shell, progetto sopralux-64b29).
# Serve per scaricare tavole e foto sincronizzate dalla PWA e dall'app degli store.
set -eu
cd "$(dirname "$0")/.."
gcloud storage buckets update gs://sopralux-64b29.firebasestorage.app --cors-file=firebase/cors.json
gcloud storage buckets describe gs://sopralux-64b29.firebasestorage.app --format="default(cors_config)"
