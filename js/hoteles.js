/* Casona Lumbre — motor de reservas (demo, sin backend)
   Para producción: reemplazar getUnits() por una llamada a tu API de disponibilidad
   y processPayment() por la integración con tu pasarela (Mercado Pago, Stripe, etc). */

const ROOMS = [
  { id: 'patio',   name: 'Habitación Patio', price: 120, cap: 2, units: 4, size: '24 m²',
    desc: 'Cama queen, ventanal al patio de olivos y ducha de lluvia.', tags: ['Queen', 'Patio', 'Ducha de lluvia'], img: 'habitación patio' },
  { id: 'jardin',  name: 'Suite Jardín',     price: 180, cap: 3, units: 3, size: '36 m²',
    desc: 'Galería privada sobre el jardín, bañera exenta y chimenea a leña.', tags: ['King', 'Chimenea', 'Bañera'], img: 'suite jardín' },
  { id: 'terraza', name: 'Loft Terraza',     price: 260, cap: 4, units: 2, size: '52 m²',
    desc: 'Dos ambientes en planta alta con terraza propia mirando la cordillera.', tags: ['2 ambientes', 'Terraza', 'Vista Andes'], img: 'loft terraza' },
];

const MONTHS = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const DOW = ['lu','ma','mi','ju','vi','sá','do'];
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const state = {
  step: 1, checkin: null, checkout: null, guests: 2, roomId: null,
  method: 'card', calMonth: startOfMonth(new Date()), booked: {}, lastSync: Date.now(),
};

/* ---------- Fechas ---------- */
function startOfDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function key(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function fmt(d, long) { return d ? d.toLocaleDateString('es-AR', long ? { weekday: 'short', day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short' }) : 'Elegir fecha'; }
function nightsList() {
  if (!state.checkin || !state.checkout) return [];
  const out = []; for (let d = state.checkin; d < state.checkout; d = addDays(d, 1)) out.push(d); return out;
}
const TODAY = startOfDay(new Date());

/* ---------- Disponibilidad (simulada, determinística) ---------- */
function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function getUnits(room, d) {
  const k = key(d), h = hash(room.id + k) % 100;
  const weekend = d.getDay() === 5 || d.getDay() === 6;
  let base = h < (weekend ? 30 : 14) ? 0 : h < (weekend ? 50 : 30) ? 1 : room.units;
  return Math.max(0, base - (state.booked[room.id + k] || 0));
}
function dayStatus(d) {
  const total = ROOMS.reduce((a, r) => a + getUnits(r, d), 0);
  return total === 0 ? 'full' : total <= 2 ? 'low' : 'free';
}
function nightPrice(room, d) { return Math.round(room.price * ((d.getDay() === 5 || d.getDay() === 6) ? 1.15 : 1)); }
function roomQuote(room) {
  const n = nightsList();
  const units = n.length ? Math.min(...n.map(d => getUnits(room, d))) : getUnits(room, TODAY);
  const total = n.reduce((a, d) => a + nightPrice(room, d), 0);
  return { units, total, nights: n.length };
}
const money = v => 'USD ' + v.toLocaleString('es-AR');

/* ---------- Habitaciones (landing) ---------- */
function renderRoomCards() {
  $('#roomGrid').innerHTML = ROOMS.map(r => {
    const u = roomQuote(r).units;
    const cls = u === 0 ? 'none' : u === 1 ? 'low' : '';
    const label = u === 0 ? 'Sin disponibilidad hoy' : u === 1 ? 'Queda 1 para esta noche' : `${u} disponibles esta noche`;
    return `<article class="room-card">
      <div class="ph"><span>foto · ${r.img}</span></div>
      <div class="room-meta"><h3>${r.name}</h3><span class="room-price">desde <strong>${money(r.price)}</strong></span></div>
      <p>${r.desc}</p>
      <div class="room-tags"><span class="tag">${r.size}</span><span class="tag">Hasta ${r.cap}</span>${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <div class="room-foot"><span class="avail ${cls}">${label}</span><button class="link-btn" data-book-room="${r.id}">Reservar</button></div>
    </article>`;
  }).join('');
}

/* ---------- Calendario ---------- */
function renderCalendar() {
  const months = [state.calMonth, new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() + 1, 1)];
  const maxDate = addDays(TODAY, 365);
  $('#calendar').innerHTML = months.map(m => {
    const offset = (m.getDay() + 6) % 7;
    const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    let cells = DOW.map(d => `<span class="cal-dow">${d}</span>`).join('');
    cells += '<span></span>'.repeat(offset);
    for (let i = 1; i <= days; i++) {
      const d = new Date(m.getFullYear(), m.getMonth(), i);
      const past = d < TODAY || d > maxDate;
      const st = past ? '' : dayStatus(d);
      const c = ['day'];
      if (!past) c.push(st);
      const t = d.getTime();
      const ci = state.checkin && state.checkin.getTime(), co = state.checkout && state.checkout.getTime();
      if (t === ci) c.push('start', co ? '' : 'solo');
      if (t === co) c.push('end');
      if (ci && co && t > ci && t < co) c.push('in-range');
      const blocked = past || (st === 'full' && !(ci && !co && t > ci));
      cells += `<button class="${c.join(' ')}" data-date="${key(d)}" ${blocked ? 'disabled' : ''} aria-label="${fmt(d, true)}">${i}</button>`;
    }
    return `<div class="cal-month"><h4>${MONTHS[m.getMonth()]} ${m.getFullYear()}</h4><div class="cal-grid">${cells}</div></div>`;
  }).join('');
  $('#calPrev').disabled = state.calMonth <= startOfMonth(TODAY);
}

function pickDate(d) {
  if (!state.checkin || state.checkout || d <= state.checkin) {
    state.checkin = d; state.checkout = null;
  } else {
    state.checkout = d;
  }
  state.roomId = null;
  syncQuickBar(); renderCalendar(); renderFoot();
}

/* ---------- Paso 2 ---------- */
function renderRoomPick() {
  $('#roomPick').innerHTML = ROOMS.map(r => {
    const q = roomQuote(r);
    const fits = r.cap >= state.guests;
    const ok = q.units > 0 && fits;
    const label = !fits ? `Capacidad máxima: ${r.cap}` : q.units === 0 ? 'Sin disponibilidad en estas fechas' : q.units === 1 ? 'Queda 1 habitación' : `${q.units} disponibles`;
    const cls = !ok ? 'none' : q.units === 1 ? 'low' : '';
    return `<button class="pick ${state.roomId === r.id ? 'selected' : ''}" data-pick="${r.id}" ${ok ? '' : 'disabled'}>
      <div class="ph"><span>${r.img}</span></div>
      <div><h4>${r.name}</h4><p>${r.size} · hasta ${r.cap} · ${r.tags.slice(0, 2).join(' · ')}</p><span class="avail ${cls}">${label}</span></div>
      <div class="pick-price"><strong>${money(q.total)}</strong><span>${q.nights} noche${q.nights > 1 ? 's' : ''}</span></div>
    </button>`;
  }).join('');
}

/* ---------- Paso 3 ---------- */
function totals() {
  const r = ROOMS.find(x => x.id === state.roomId);
  if (!r) return null;
  const q = roomQuote(r);
  const taxes = Math.round(q.total * 0.21);
  return { r, ...q, taxes, grand: q.total + taxes };
}
function renderSummary() {
  const t = totals(); if (!t) return;
  $('#summary').innerHTML = `
    <div class="ph"><span>${t.r.img}</span></div>
    <h4>${t.r.name}</h4>
    <p class="dates">${fmt(state.checkin, true)} → ${fmt(state.checkout, true)} · ${state.guests} huésped${state.guests > 1 ? 'es' : ''}</p>
    <div class="sum-line"><span>${t.nights} noche${t.nights > 1 ? 's' : ''}</span><span>${money(t.total)}</span></div>
    <div class="sum-line"><span>Impuestos (21%)</span><span>${money(t.taxes)}</span></div>
    <div class="sum-line"><span>Desayuno</span><span>Incluido</span></div>
    <div class="sum-line total"><span>Total</span><span>${money(t.grand)}</span></div>`;
}

function validatePay() {
  const f = $('#payForm'); let ok = true;
  const check = (name, test) => {
    const el = f.elements[name]; const valid = test(el.value.trim());
    el.closest('.field').classList.toggle('invalid', !valid); if (!valid) ok = false;
  };
  check('name', v => v.length > 2);
  check('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  check('phone', v => v.replace(/\D/g, '').length >= 8);
  if (state.method === 'card') {
    check('card', v => v.replace(/\D/g, '').length >= 15);
    check('exp', v => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v));
    check('cvv', v => /^\d{3,4}$/.test(v));
  }
  if (!ok) { const first = $('.field.invalid input', f); first && first.focus(); }
  return ok;
}

function processPayment() {
  // Acá iría la integración real con la pasarela de pagos.
  return new Promise(res => setTimeout(() => res({ ok: true, code: 'CL-' + Math.random().toString(36).slice(2, 8).toUpperCase() }), 1600));
}

/* ---------- Paso 4 ---------- */
function renderConfirm(code) {
  const t = totals(); const f = $('#payForm');
  const pending = state.method === 'transfer';
  $('#confirm').innerHTML = `
    <div class="confirm-mark">✓</div>
    <h3>${pending ? 'Reserva bloqueada' : '¡Reserva confirmada!'}</h3>
    <p>${pending ? 'Te enviamos los datos para transferir' : 'Te enviamos la confirmación'} a <strong>${f.elements.email.value}</strong>.</p>
    <div class="confirm-code">${code}</div>
    <dl>
      <dt>Habitación</dt><dd>${t.r.name}</dd>
      <dt>Llegada</dt><dd>${fmt(state.checkin, true)} · 15:00</dd>
      <dt>Salida</dt><dd>${fmt(state.checkout, true)} · 11:00</dd>
      <dt>Huéspedes</dt><dd>${state.guests}</dd>
      <dt>Total</dt><dd>${money(t.grand)}</dd>
    </dl>`;
}

/* ---------- Navegación del modal ---------- */
const TITLES = { 1: 'Elegí tus fechas', 2: 'Elegí tu habitación', 3: 'Datos y pago', 4: 'Todo listo' };
function goTo(step) {
  state.step = step;
  $$('.step-pane').forEach(p => p.classList.toggle('active', +p.dataset.pane === step));
  $$('#steps li').forEach(li => { const s = +li.dataset.step; li.classList.toggle('active', s === step); li.classList.toggle('done', s < step); });
  $('#bkTitle').textContent = TITLES[step];
  if (step === 1) renderCalendar();
  if (step === 2) renderRoomPick();
  if (step === 3) renderSummary();
  $('.bk-body').scrollTop = 0;
  renderFoot();
}
function renderFoot() {
  const next = $('#btnNext'), back = $('#btnBack'), info = $('#footInfo');
  back.style.visibility = state.step > 1 && state.step < 4 ? 'visible' : 'hidden';
  const n = nightsList().length;
  if (state.step === 1) {
    info.innerHTML = !state.checkin ? 'Seleccioná la fecha de llegada' : !state.checkout ? 'Ahora elegí la salida'
      : `<strong>${n} noche${n > 1 ? 's' : ''}</strong> · ${fmt(state.checkin)} → ${fmt(state.checkout)}`;
    next.textContent = 'Ver habitaciones'; next.disabled = !state.checkout;
  } else if (state.step === 2) {
    const t = totals();
    info.innerHTML = t ? `<strong>${money(t.total)}</strong> · ${t.r.name}` : `${n} noche${n > 1 ? 's' : ''} · ${state.guests} huésped${state.guests > 1 ? 'es' : ''}`;
    next.textContent = 'Continuar'; next.disabled = !t;
  } else if (state.step === 3) {
    const t = totals();
    info.innerHTML = `Total <strong>${money(t.grand)}</strong>`;
    next.textContent = state.method === 'mp' ? 'Pagar con Mercado Pago' : state.method === 'transfer' ? 'Bloquear reserva' : `Pagar ${money(t.grand)}`;
    next.disabled = false;
  } else {
    info.textContent = ''; next.textContent = 'Cerrar'; next.disabled = false;
  }
}

async function onNext() {
  if (state.step === 1) return goTo(2);
  if (state.step === 2) return goTo(3);
  if (state.step === 3) {
    if (!validatePay()) return;
    const t = totals();
    if (t.units === 0) { toast('Esa habitación se acaba de ocupar. Elegí otra.'); return goTo(2); }
    const btn = $('#btnNext'); btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Procesando…';
    const res = await processPayment();
    nightsList().forEach(d => { const k = state.roomId + key(d); state.booked[k] = (state.booked[k] || 0) + 1; });
    renderConfirm(res.code); renderRoomCards();
    return goTo(4);
  }
  closeBooking(); resetBooking();
}

function openBooking(roomId) {
  if (roomId) state.roomId = roomId;
  $('#booking').classList.add('open'); $('#booking').setAttribute('aria-hidden', 'false');
  document.body.classList.add('locked');
  goTo(state.checkout && roomId ? 2 : state.step === 4 ? 1 : Math.min(state.step, state.checkout ? state.step : 1));
}
function closeBooking() {
  $('#booking').classList.remove('open'); $('#booking').setAttribute('aria-hidden', 'true');
  document.body.classList.remove('locked');
}
function resetBooking() {
  Object.assign(state, { step: 1, checkin: null, checkout: null, roomId: null });
  $('#payForm').reset(); $('#cardBrand').textContent = ''; syncQuickBar();
}

function syncQuickBar() {
  $('#qbIn').textContent = fmt(state.checkin);
  $('#qbOut').textContent = fmt(state.checkout);
  $('#qbGuests').value = String(state.guests);
  $('#gCount').textContent = state.guests;
  $('#gMinus').disabled = state.guests <= 1;
  $('#gPlus').disabled = state.guests >= 4;
}

/* ---------- Tiempo real (simulado) ---------- */
function liveTick() {
  const s = Math.round((Date.now() - state.lastSync) / 1000);
  $$('[data-live-ago]').forEach(el => el.textContent = s < 3 ? 'actualizado recién' : `actualizado hace ${s} s`);
}
function simulateRemoteBooking() {
  const r = ROOMS[Math.floor(Math.random() * ROOMS.length)];
  const d = addDays(TODAY, 1 + Math.floor(Math.random() * 45));
  if (getUnits(r, d) === 0) return;
  const k = r.id + key(d); state.booked[k] = (state.booked[k] || 0) + 1;
  state.lastSync = Date.now();
  toast(`Se acaba de reservar ${r.name} para el ${fmt(d)}`);
  if (state.step === 1 && $('#booking').classList.contains('open')) {
    renderCalendar();
    const cell = $(`.day[data-date="${key(d)}"]`); cell && cell.classList.add('flash');
  }
  if (state.step === 2) { renderRoomPick(); renderFoot(); }
  renderRoomCards();
}
let toastT;
function toast(msg) {
  const t = $('#toast'); t.innerHTML = `<span class="live-dot"></span>${msg}`; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 4200);
}

/* ---------- Eventos ---------- */
document.addEventListener('click', e => {
  const open = e.target.closest('[data-open-booking]');
  if (open) { e.preventDefault(); return openBooking(); }
  const book = e.target.closest('[data-book-room]');
  if (book) return openBooking(book.dataset.bookRoom);
  if (e.target.closest('[data-close]')) return closeBooking();
  const day = e.target.closest('.day');
  if (day && !day.disabled) { const [y, m, d] = day.dataset.date.split('-').map(Number); return pickDate(new Date(y, m - 1, d)); }
  const pick = e.target.closest('[data-pick]');
  if (pick && !pick.disabled) { state.roomId = pick.dataset.pick; renderRoomPick(); renderFoot(); return; }
  const tab = e.target.closest('.pay-tab');
  if (tab) {
    state.method = tab.dataset.method;
    $$('.pay-tab').forEach(t => t.classList.toggle('active', t === tab));
    $$('.pay-method').forEach(p => p.hidden = p.dataset.methodPane !== state.method);
    renderFoot();
  }
});

$('#quickBook').addEventListener('submit', e => { e.preventDefault(); openBooking(); });
$('#qbGuests').addEventListener('change', e => { state.guests = +e.target.value; syncQuickBar(); });
$('#gMinus').addEventListener('click', () => { state.guests = Math.max(1, state.guests - 1); state.roomId = null; syncQuickBar(); });
$('#gPlus').addEventListener('click', () => { state.guests = Math.min(4, state.guests + 1); state.roomId = null; syncQuickBar(); });
$('#calPrev').addEventListener('click', () => { state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() - 1, 1); renderCalendar(); });
$('#calNext').addEventListener('click', () => { state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() + 1, 1); renderCalendar(); });
$('#btnNext').addEventListener('click', onNext);
$('#btnBack').addEventListener('click', () => goTo(state.step - 1));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#booking').classList.contains('open')) closeBooking(); });

const pf = $('#payForm');
pf.addEventListener('submit', e => { e.preventDefault(); onNext(); });
pf.elements.card.addEventListener('input', e => {
  const v = e.target.value.replace(/\D/g, '').slice(0, 16);
  e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
  $('#cardBrand').textContent = /^4/.test(v) ? 'VISA' : /^5[1-5]/.test(v) ? 'MASTERCARD' : /^3[47]/.test(v) ? 'AMEX' : '';
});
pf.elements.exp.addEventListener('input', e => {
  const v = e.target.value.replace(/\D/g, '').slice(0, 4);
  e.target.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v;
});
pf.elements.cvv.addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, ''); });
pf.addEventListener('input', e => e.target.closest('.field')?.classList.remove('invalid'));

window.addEventListener('scroll', () => $('#nav').classList.toggle('scrolled', scrollY > 10), { passive: true });

/* ---------- Init ---------- */
renderRoomCards();
syncQuickBar();
renderFoot();
setInterval(liveTick, 1000);
setInterval(() => { state.lastSync = Date.now(); }, 15000);
setInterval(simulateRemoteBooking, 22000);