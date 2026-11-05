/* ---- rotazione della pianta e bussola: la pianta si gira come sei girato tu ---- */
const screenUpAngle = () => Math.atan2(-Math.cos(vr()), -Math.sin(vr())); // direzione (in pianta) di "davanti a te" = su sullo schermo
const D2R = Math.PI / 180;
const wrap180 = d => { while (d > 180) d -= 360; while (d < -180) d += 360; return d; };
const Compass = {
  // Segue la rotazione del tablet, non il nord: usa di preferenza il giroscopio (evento "relativo", stabile anche vicino a ferro e magneti),
  // la bussola magnetica solo se il tablet non ha il giroscopio. Il riferimento è il momento in cui si attiva (o l'ultima correzione a mano).
  on: false, status: 'off', bound: false, perm: null, timer: null, hold: false, raf: 0, target: null,
  src: null, rel: null, abs: null, yaw: null, heading: null, h0: null, r0: 0,
  avail() { return typeof DeviceOrientationEvent !== 'undefined' && ('ondeviceorientationabsolute' in window || 'ondeviceorientation' in window); },
  async start() { // da chiamare dentro un tocco dell'utente (iPhone chiede il permesso)
    if (!this.avail()) { this.status = 'noSensor'; return false; }
    if (typeof DeviceOrientationEvent.requestPermission === 'function' && this.perm !== 'granted') {
      try { this.perm = await DeviceOrientationEvent.requestPermission(); } catch (e) { this.perm = 'denied'; }
      if (this.perm !== 'granted') { this.status = 'denied'; return false; }
    }
    if (!this.bound) {
      this.bound = true; const h = e => this.onEvent(e);
      if ('ondeviceorientationabsolute' in window) window.addEventListener('deviceorientationabsolute', h, true);
      window.addEventListener('deviceorientation', h, true);
      document.addEventListener('visibilitychange', () => { // al ritorno in primo piano il giroscopio può ripartire da un altro zero: riparto da com'è la pianta adesso
        if (document.hidden) this.hold = true; else { this.rel = this.abs = null; this.src = null; this.yaw = null; this.h0 = null; this.hold = false; }
      });
    }
    this.on = true; this.hold = false; this.h0 = null; this.r0 = vr(); this.status = 'waiting'; rotBtnUpdate(); renderRotPanel(); updateHint();
    clearTimeout(this.timer); this.timer = setTimeout(() => { if (this.on && this.yaw == null) { this.status = 'noData'; renderRotPanel(); } }, 2500);
    return true;
  },
  stop() { this.on = false; this.status = 'off'; clearTimeout(this.timer); if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0; rotBtnUpdate(); renderRotPanel(); updateHint(); },
  anchor() { // da qui in poi: la pianta com'è adesso corrisponde a come sono girato adesso (riferimento per entrambe le sorgenti, filtro azzerato sull'ultimo dato così da fermo non si muove)
    const t = this.src && this[this.src]; if (!t) { this.h0 = null; return; }
    this.h0 = {}; for (const k of ['rel', 'abs']) { const q = this[k]; if (q) { q.yaw = ((q.raw + q.off) % 360 + 360) % 360; this.h0[k] = q.yaw; } }
    this.yaw = t.yaw; this.r0 = vr();
  },
  // direzione "davanti a te" ricavata dalla matrice di rotazione (alfa, beta, gamma), valida col tablet piatto, inclinato o in verticale:
  // in verticale è l'asse della fotocamera (dietro lo schermo), da piatto è "verso l'alto dello schermo"; in mezzo si fondono senza salti.
  yawOf(e) {
    if (e.alpha == null || e.beta == null || e.gamma == null) {
      return e.webkitCompassHeading != null && !isNaN(e.webkitCompassHeading) ? { yaw: e.webkitCompassHeading, kind: 'abs' } : null;
    }
    const a = e.alpha * D2R, b = e.beta * D2R, g = e.gamma * D2R;
    const cA = Math.cos(a), sA = Math.sin(a), cB = Math.cos(b), sB = Math.sin(b), cG = Math.cos(g), sG = Math.sin(g);
    const so = ((screen.orientation && screen.orientation.angle) || window.orientation || 0) * D2R; const cS = Math.cos(so), sS = Math.sin(so);
    // R = Rz(a)·Rx(b)·Ry(g); colonne x e y del dispositivo (proiezione est/nord), poi "alto dello schermo" = -sin(so)·x + cos(so)·y
    const xx = cA * cG - sA * sB * sG, xy = sA * cG + cA * sB * sG, yx = -sA * cB, yy = cA * cB;
    const ux = -sS * xx + cS * yx, uy = -sS * xy + cS * yy;
    const zx = -(cA * sG + sA * sB * cG), zy = -(sA * sG - cA * sB * cG); // asse -z: dove guarda la fotocamera posteriore
    const mu = Math.hypot(ux, uy), mz = Math.hypot(zx, zy); const wu = mu ** 3, wz = mz ** 3; // pesi ∝ (proiezione)^4: in verticale conta solo la fotocamera, da piatto solo lo schermo
    const vx = ux * wu + zx * wz, vy = uy * wu + zy * wz;
    if (Math.hypot(vx, vy) < 0.02) return null; // tablet inclinato in avanti di 45°: direzione indecidibile, tengo l'ultima
    const kind = e.absolute === true || e.type === 'deviceorientationabsolute' ? 'abs' : 'rel';
    return { yaw: ((Math.atan2(vx, vy) / D2R) % 360 + 360) % 360, kind }; // gradi in senso orario (dal nord se assoluto, da un riferimento qualsiasi se relativo)
  },
  track(kind, raw) { // filtro leggero e continuità: un salto impossibile (ri-azzeramento del sensore) non deve far girare la pianta
    const now = performance.now(); let t = this[kind];
    if (!t) { t = this[kind] = { raw, off: 0, yaw: raw, span: 0, t: now }; if (this.h0 && this.h0[kind] == null) this.h0[kind] = raw; return t; } // sorgente comparsa dopo il riferimento: parte da qui
    let d = wrap180(raw - t.raw); const dt = now - t.t; t.raw = raw; t.t = now;
    if (Math.abs(d) > 60 && dt < 150) { t.off -= d; d = 0; } // più di 400°/s: non è una rotazione vera
    t.span += Math.abs(d);
    t.yaw = (t.yaw + wrap180(raw + t.off - t.yaw) * 0.5 + 360) % 360;
    return t;
  },
  pick() { // giroscopio se c'è e si muove, altrimenti bussola magnetica
    const rel = this.rel, abs = this.abs; let s = this.src;
    if (rel && (s == null || s === 'abs') && !(abs && abs.span > 25 && rel.span < 2)) s = 'rel';
    if (s === 'rel' && abs && abs.span > 25 && rel.span < 2) s = 'abs'; // il tablet non ha il giroscopio: l'alfa relativo resta fermo
    if (s == null && abs) s = 'abs';
    if (s !== this.src) { this.src = s; if (this.h0 && this.h0[s] == null) this.h0 = null; renderRotPanel(); } // cambio sorgente: continuo dal suo riferimento, se non c'è lo riprendo
    return this.src ? this[this.src] : null;
  },
  onEvent(e) {
    const r = this.yawOf(e); if (!r) return;
    this.track(r.kind, r.yaw); const t = this.pick(); if (!t) return;
    this.yaw = t.yaw; this.heading = this.src === 'abs' ? t.yaw : null;
    if (!this.on || this.hold) return;
    if (this.h0 == null || this.h0[this.src] == null || this.status !== 'on') { if (this.h0 == null || this.h0[this.src] == null) this.anchor(); this.status = 'on'; renderRotPanel(); return; }
    this.target = this.r0 - wrap180(this.yaw - this.h0[this.src]) * D2R; // mi giro a destra → la pianta gira a sinistra, davanti a me resta in alto
    if (Math.abs(this.target - vr()) > 0.3 * D2R && !this.raf) this.raf = requestAnimationFrame(() => { this.raf = 0; if (this.on && !this.hold && this.target != null) setViewRot(this.target); });
  },
};
const ROT_STATUS = { off: 'spenta', waiting: 'in attesa dei sensori…', on: 'attiva: la pianta segue come sei girato', noSensor: 'nessun sensore di orientamento su questo dispositivo', denied: 'permesso ai sensori negato: riattivalo nelle impostazioni del browser', noData: 'i sensori non mandano dati' + (PLATFORM === 'claude' ? ' (dentro Claude possono essere bloccati: usa l\'app installata sul tablet)' : ' (controlla che i sensori di movimento siano permessi al browser)') };
function rotBtnUpdate() { const i = $('#zRotIco'); if (i) i.style.transform = `rotate(${vr() * 180 / Math.PI}deg)`; const b = $('#zRot'); if (b) b.classList.toggle('on', !!(vr() || Compass.on)); }
function toggleRotPanel() { const p = $('#rotPanel'); if (p.classList.contains('hide')) { p.classList.remove('hide'); renderRotPanel(); } else p.classList.add('hide'); }
function renderRotPanel() {
  const p = $('#rotPanel'); if (!p || p.classList.contains('hide')) return;
  const deg = Math.round(vr() * 180 / Math.PI);
  const src = Compass.on && Compass.status === 'on' ? (Compass.src === 'rel' ? ' • giroscopio' : ' • bussola magnetica (meno precisa vicino a ferro e magneti)') : '';
  p.innerHTML = `<div class="row" style="align-items:center"><b style="flex:1">Rotazione pianta</b><span class="mut small" data-deg>${deg}°</span><button class="sm ghost" data-r="x" style="flex:none">✕</button></div>
    <input type="range" min="-180" max="180" step="1" value="${deg}" data-r="slider">
    <div class="row" style="gap:6px;margin-top:4px"><button class="sm" data-r="-90">⟲ 90°</button><button class="sm" data-r="0">Dritta</button><button class="sm" data-r="90">⟳ 90°</button></div>
    <div class="mut small" style="margin-top:6px">${Compass.on ? 'Se la pianta si sfasa, raddrizzala col cursore, i tasti o torcendo con due dita: da lì riparte a seguirti.' : 'Gira la pianta finché corrisponde a come sei messo tu (anche con due dita, torcendo). Poi attiva «Segui»: quando ti giri, la pianta gira con te e il cono della foto parte verso dove guardi.'}</div>
    <button class="${Compass.on ? 'pri' : ''}" style="width:100%;margin-top:8px" data-r="follow">${Compass.on ? '◉ Segui come sono girato: attivo (tocca per spegnere)' : '○ Segui come sono girato'}</button>
    <div class="small ${['denied', 'noSensor', 'noData'].includes(Compass.status) ? 'warn' : 'mut'}" style="margin-top:4px">Sensori: ${ROT_STATUS[Compass.status] || Compass.status}${src}</div>`;
  p.querySelector('[data-r=slider]').oninput = e => { setViewRot(+e.target.value * Math.PI / 180); Compass.anchor(); };
  p.querySelectorAll('button[data-r]').forEach(b => b.onclick = async () => {
    const v = b.dataset.r;
    if (v === 'x') { p.classList.add('hide'); return; }
    if (v === 'follow') { if (Compass.on) Compass.stop(); else { if (!await Compass.start()) renderRotPanel(); } return; }
    if (v === '0') setViewRot(0); else setViewRot(vr() + (+v) * Math.PI / 180);
    Compass.anchor(); renderRotPanel();
  });
}
