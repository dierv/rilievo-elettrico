/* ---- rotazione della pianta e bussola: la pianta si gira come sei girato tu ---- */
const screenUpAngle = () => Math.atan2(-Math.cos(vr()), -Math.sin(vr())); // direzione (in pianta) di "davanti a te" = su sullo schermo
const Compass = {
  on: false, heading: null, h0: null, r0: 0, status: 'off', last: 0, bound: false, perm: null, timer: null,
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
    }
    this.on = true; this.h0 = null; this.r0 = vr(); this.status = 'waiting'; rotBtnUpdate(); renderRotPanel(); updateHint();
    clearTimeout(this.timer); this.timer = setTimeout(() => { if (this.on && this.heading == null) { this.status = 'noData'; renderRotPanel(); } }, 2500);
    return true;
  },
  stop() { this.on = false; this.status = 'off'; clearTimeout(this.timer); rotBtnUpdate(); renderRotPanel(); updateHint(); },
  headingOf(e) { // gradi in senso orario dal nord, già corretti per l'orientamento dello schermo
    let h = null;
    if (e.webkitCompassHeading != null && !isNaN(e.webkitCompassHeading)) h = e.webkitCompassHeading; // iPhone / iPad
    else if (e.absolute !== false && e.alpha != null) h = (360 - e.alpha) % 360; // Android (alpha antiorario)
    else return null;
    const so = (screen.orientation && screen.orientation.angle) || window.orientation || 0;
    return ((h + so) % 360 + 360) % 360;
  },
  onEvent(e) {
    const h = this.headingOf(e); if (h == null) return;
    if (e.type === 'deviceorientation' && this.absSeen && e.webkitCompassHeading == null) return; // su Android preferisco l'evento assoluto
    if (e.type === 'deviceorientationabsolute') this.absSeen = true;
    // filtro: media circolare leggera per togliere il tremolio
    if (this.heading == null) this.heading = h; else { let d = h - this.heading; while (d > 180) d -= 360; while (d < -180) d += 360; this.heading = (this.heading + d * 0.35 + 360) % 360; }
    if (!this.on) return;
    if (this.h0 == null) { this.h0 = this.heading; this.r0 = vr(); this.status = 'on'; renderRotPanel(); return; }
    let d = this.heading - this.h0; while (d > 180) d -= 360; while (d < -180) d += 360;
    const target = this.r0 - d * Math.PI / 180; // mi giro a destra → la pianta gira a sinistra, davanti a me resta in alto
    if (Math.abs(target - vr()) > 0.6 * Math.PI / 180 && Date.now() - this.last > 50) { this.last = Date.now(); setViewRot(target); }
  },
};
const ROT_STATUS = { off: 'spenta', waiting: 'in attesa della bussola…', on: 'attiva: la pianta segue come sei girato', noSensor: 'nessuna bussola su questo dispositivo', denied: 'permesso ai sensori negato: riattivalo nelle impostazioni del browser', noData: 'la bussola non manda dati' + (PLATFORM === 'claude' ? ' (dentro Claude i sensori possono essere bloccati: usa l\'app installata sul tablet)' : ' (muovi il dispositivo a otto per calibrarla, oppure controlla che i sensori di movimento siano permessi al browser)') };
function rotBtnUpdate() { const i = $('#zRotIco'); if (i) i.style.transform = `rotate(${vr() * 180 / Math.PI}deg)`; const b = $('#zRot'); if (b) b.classList.toggle('on', !!(vr() || Compass.on)); }
function toggleRotPanel() { const p = $('#rotPanel'); if (p.classList.contains('hide')) { p.classList.remove('hide'); renderRotPanel(); } else p.classList.add('hide'); }
function renderRotPanel() {
  const p = $('#rotPanel'); if (!p || p.classList.contains('hide')) return;
  const deg = Math.round(vr() * 180 / Math.PI);
  p.innerHTML = `<div class="row" style="align-items:center"><b style="flex:1">Rotazione pianta</b><span class="mut small">${deg}°</span><button class="sm ghost" data-r="x" style="flex:none">✕</button></div>
    <input type="range" min="-180" max="180" step="1" value="${deg}" data-r="slider" ${Compass.on ? 'disabled' : ''}>
    <div class="row" style="gap:6px;margin-top:4px"><button class="sm" data-r="-90" ${Compass.on ? 'disabled' : ''}>⟲ 90°</button><button class="sm" data-r="0" ${Compass.on ? 'disabled' : ''}>Dritta</button><button class="sm" data-r="90" ${Compass.on ? 'disabled' : ''}>⟳ 90°</button></div>
    <div class="mut small" style="margin-top:6px">Gira la pianta finché corrisponde a come sei messo tu (anche con due dita, torcendo). Poi attiva la bussola: quando ti giri, la pianta gira con te e il cono della foto parte verso dove guardi.</div>
    <button class="${Compass.on ? 'pri' : ''}" style="width:100%;margin-top:8px" data-r="follow">${Compass.on ? '◉ Segui bussola: attiva (tocca per spegnere)' : '○ Segui bussola'}</button>
    <div class="small ${['denied', 'noSensor', 'noData'].includes(Compass.status) ? 'warn' : 'mut'}" style="margin-top:4px">Bussola: ${ROT_STATUS[Compass.status] || Compass.status}${Compass.heading != null ? ` • ${Math.round(Compass.heading)}°` : ''}</div>`;
  p.querySelector('[data-r=slider]').oninput = e => setViewRot(+e.target.value * Math.PI / 180);
  p.querySelectorAll('button[data-r]').forEach(b => b.onclick = async () => {
    const v = b.dataset.r;
    if (v === 'x') { p.classList.add('hide'); return; }
    if (v === 'follow') { if (Compass.on) Compass.stop(); else { if (!await Compass.start()) renderRotPanel(); } return; }
    if (v === '0') setViewRot(0); else setViewRot(vr() + (+v) * Math.PI / 180);
    renderRotPanel();
  });
}
