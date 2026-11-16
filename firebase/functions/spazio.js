'use strict';
// Spazio occupato sul server da ogni account (archivio dei sopralluoghi in Storage, users/<uid>/...).
// I file non si cancellano mai (sono identificati dall'impronta del contenuto): il totale cresce soltanto,
// tranne quando l'account viene eliminato (si cancella tutto).
// Firestore (solo il server scrive; i dispositivi non leggono):
//   spazio/<uid>:                 { usati (byte), file, limite (byte, dal piano: 0 senza abbonamento), aggiornato }
//   spazio/<uid>/oggetti/<id>:    un documento per ogni file contato, così una notifica ripetuta non lo conta due volte
const crypto = require('crypto');

const GB = 1024 ** 3;
const PIANI_GB = { pro: 25, studio3: 100, studio10: 300 }; // come nell'app (01b_lic.js)
const MEMORIA_GB = { mem50: 50, mem200: 200, mem500: 500 };

// Limite in byte dai prodotti attivi dell'account ({ codice: {...} } come in acquisti.licenza)
function limiteDa(prodotti) {
  let piano = 0, extra = 0;
  for (const pid of Object.keys(prodotti || {})) {
    const m = /^sopralux_(pro|studio3|studio10)_(mese|anno)$/.exec(pid); if (m) piano = Math.max(piano, PIANI_GB[m[1]]);
    const k = /^sopralux_(mem50|mem200|mem500)$/.exec(pid); if (k) extra += MEMORIA_GB[k[1]];
  }
  return piano ? (piano + extra) * GB : 0; // la memoria in più vale solo insieme a un piano
}

const uidDi = nome => { const m = /^users\/([A-Za-z0-9_-]{1,128})\//.exec(nome || ''); return m ? m[1] : null; };
const idOggetto = nome => crypto.createHash('sha256').update(nome).digest('hex');

// Un file caricato: si somma una sola volta. Risultato: true se è stato contato adesso.
async function contaFile(db, nome, byte, adesso) {
  const uid = uidDi(nome); if (!uid) return false;
  const tot = db.collection('spazio').doc(uid), seg = tot.collection('oggetti').doc(idOggetto(nome));
  return db.runTransaction(async tx => {
    const [s, t] = [await tx.get(seg), await tx.get(tot)];
    if (s.exists) return false;
    const cur = t.exists ? t.data() : {};
    tx.set(seg, { byte: Number(byte) || 0 });
    tx.set(tot, { usati: (Number(cur.usati) || 0) + (Number(byte) || 0), file: (Number(cur.file) || 0) + 1, aggiornato: adesso() }, { merge: true });
    return true;
  });
}

async function scriviLimite(db, uid, prodotti, adesso) {
  const limite = limiteDa(prodotti);
  await db.collection('spazio').doc(uid).set({ limite, aggiornato: adesso() }, { merge: true });
  return limite;
}

async function leggi(db, uid) {
  const s = await db.collection('spazio').doc(uid).get(), d = s.exists ? s.data() : {};
  return { usati: Number(d.usati) || 0, file: Number(d.file) || 0, limite: Number(d.limite) || 0 };
}

module.exports = { GB, limiteDa, uidDi, idOggetto, contaFile, scriviLimite, leggi };
