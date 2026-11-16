#!/bin/sh
# Controllo rapido delle funzioni pubblicate (da Cloud Shell): devono rispondere e rifiutare le richieste senza accesso.
#   verificaAcquisti senza accesso -> {"error":{"message":"Entra nel tuo account SopraLux.","status":"UNAUTHENTICATED"}}
#   notificheApple senza firma     -> «non valida» 400
U=https://europe-west1-sopralux-64b29.cloudfunctions.net
curl -s -X POST -H 'Content-Type: application/json' -d '{"data":{}}' $U/verificaAcquisti; echo
curl -s -w ' %{http_code}' -X POST -H 'Content-Type: application/json' -d '{}' $U/notificheApple; echo
