// ===== Datos =====
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DAY_NAMES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const TYPE_LABEL = { yoga: "Yoga", reformer: "Reformer", mat: "Mat" };

// Plantilla semanal: [hora, nombre, tipo, profe, duración, cupo total, ocupados]
const WEEK = [
  [["07:30","Vinyasa al amanecer","yoga","Lucía M.",60,10,7],["09:00","Reformer Inicial","reformer","Tomás R.",50,8,8],["12:30","Mat Express","mat","Carla V.",45,10,4],["18:00","Reformer Intermedio","reformer","Tomás R.",50,8,6],["19:30","Hatha & Respiración","yoga","Lucía M.",75,10,9]],
  [["08:00","Mat Core","mat","Carla V.",50,10,5],["10:00","Yin Yoga","yoga","Sofía P.",60,10,3],["18:30","Reformer Full Body","reformer","Julián A.",50,8,7],["20:00","Power Vinyasa","yoga","Sofía P.",60,10,10]],
  [["07:30","Vinyasa al amanecer","yoga","Lucía M.",60,10,6],["09:00","Reformer Inicial","reformer","Tomás R.",50,8,5],["13:00","Mat Postural","mat","Carla V.",50,10,2],["18:00","Reformer Intermedio","reformer","Julián A.",50,8,8],["19:30","Hatha & Respiración","yoga","Lucía M.",75,10,7]],
  [["08:00","Mat Core","mat","Carla V.",50,10,6],["10:00","Yin Yoga","yoga","Sofía P.",60,10,4],["18:30","Reformer Full Body","reformer","Julián A.",50,8,6],["20:00","Power Vinyasa","yoga","Sofía P.",60,10,8]],
  [["07:30","Vinyasa al amanecer","yoga","Lucía M.",60,10,5],["09:00","Reformer Inicial","reformer","Tomás R.",50,8,7],["18:00","Reformer Avanzado","reformer","Tomás R.",50,8,4],["19:00","Yoga Restaurativo","yoga","Sofía P.",60,10,9]],
  [["09:00","Reformer Full Body","reformer","Julián A.",50,8,8],["10:30","Vinyasa Sábado","yoga","Lucía M.",75,10,6],["12:00","Mat & Movilidad","mat","Carla V.",60,10,3]]
];

const PLANS = [
  { id:"pack4", name:"Pack 4 clases", desc:"Para arrancar o venir una vez por semana.", monthly:24000, perks:["4 clases al mes","Todas las disciplinas","Reserva con 7 días de anticipación"] },
  { id:"pack8", name:"Pack 8 clases", desc:"El favorito: dos clases por semana para ver resultados.", monthly:42000, featured:true, perks:["8 clases al mes","Todas las disciplinas","Reserva con 14 días de anticipación","1 clase invitada por mes"] },
  { id:"free", name:"Libre", desc:"Sin límites. Para quienes hacen del estudio su segunda casa.", monthly:58000, perks:["Clases ilimitadas","Prioridad en lista de espera","Reserva con 14 días de anticipación","Congelamiento hasta 15 días"] }
];

// ===== Estado =====
const today = new Date();
let state = {
  day: Math.min(Math.max(today.getDay() - 1, 0), 5),
  filter: "all",
  billing: "monthly",
  bookings: JSON.parse(localStorage.getItem("nido_bookings") || "[]"),
  membership: JSON.parse(localStorage.getItem("nido_membership") || "null")
};

const $ = (s) => document.querySelector(s);
const money = (n) => "$" + n.toLocaleString("es-AR");
const save = () => {
  localStorage.setItem("nido_bookings", JSON.stringify(state.bookings));
  localStorage.setItem("nido_membership", JSON.stringify(state.membership));
};

function weekDates() {
  const monday = new Date(today);
  const diff = today.getDay() === 0 ? -6 : 1 - today.getDay();
  monday.setDate(today.getDate() + diff);
  return DAYS.map((_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
}

const classId = (dayIdx, c) => `${dayIdx}-${c[0]}`;
const isBooked = (id) => state.bookings.some((b) => b.id === id);

// ===== Render: días =====
function renderDays() {
  const dates = weekDates();
  $("#days").innerHTML = DAYS.map((d, i) => `
    <button class="day ${i === state.day ? "active" : ""}" data-day="${i}" role="tab">
      <small>${d}</small><b>${dates[i].getDate()}</b>
    </button>`).join("");
}

// ===== Render: clases =====
function renderSchedule() {
  const list = WEEK[state.day].filter((c) => state.filter === "all" || c[2] === state.filter);
  if (!list.length) {
    $("#schedule").innerHTML = `<div class="empty">No hay clases de ${TYPE_LABEL[state.filter]} este día. Probá con otro.</div>`;
    return;
  }
  $("#schedule").innerHTML = list.map((c) => {
    const [time, name, type, teacher, dur, total, taken] = c;
    const id = classId(state.day, c);
    const booked = isBooked(id);
    const used = taken + (booked ? 1 : 0);
    const left = total - used;
    const full = left <= 0 && !booked;
    let btn;
    if (booked) btn = `<button class="btn btn-booked btn-sm" data-cancel="${id}">Reservado ✓</button>`;
    else if (full) btn = `<button class="btn btn-sm" disabled>Completo</button>`;
    else btn = `<button class="btn btn-dark btn-sm" data-book="${id}">Reservar</button>`;
    return `
      <div class="class-row" data-type="${type}">
        <div class="class-time">${time}<small>${dur} min</small></div>
        <div class="class-name"><strong>${name}</strong><span class="disc-tag">${TYPE_LABEL[type]}</span></div>
        <div class="class-teacher">con ${teacher}</div>
        <div class="spots-wrap">
          <div class="spots ${left <= 2 && left > 0 ? "low" : ""}">${full ? "Sin cupos" : left === 1 ? "Queda 1 lugar" : `Quedan ${left} de ${total}`}</div>
          <div class="spots-bar"><i style="width:${(used / total) * 100}%"></i></div>
        </div>
        ${btn}
      </div>`;
  }).join("");
}

// ===== Render: planes =====
function planPrice(p) {
  return state.billing === "monthly" ? p.monthly : Math.round((p.monthly * 3 * 0.85) / 100) * 100;
}
function renderPlans() {
  $("#plans").innerHTML = PLANS.map((p) => {
    const price = planPrice(p);
    const active = state.membership && state.membership.id === p.id;
    return `
      <article class="plan ${p.featured ? "featured" : ""}">
        <div class="plan-top"><h3>${p.name}</h3>${p.featured ? '<span class="plan-badge">Más elegido</span>' : ""}</div>
        <p class="plan-desc">${p.desc}</p>
        <div class="plan-price">${money(price)} <small>/ ${state.billing === "monthly" ? "mes" : "trimestre"}</small></div>
        <div class="plan-sub">${state.billing === "quarterly" ? `Equivale a ${money(Math.round(price / 3))} por mes` : ""}</div>
        <ul>${p.perks.map((x) => `<li>${x}</li>`).join("")}</ul>
        ${active
          ? `<button class="btn btn-ghost btn-block" disabled>Tu plan actual</button>`
          : `<button class="btn btn-dark btn-block" data-plan="${p.id}">Contratar y pagar</button>`}
      </article>`;
  }).join("");
}

function renderFab() {
  const n = state.bookings.length;
  $("#myBookingsBtn").hidden = n === 0;
  $("#bookingCount").textContent = n;
}

function renderAll() { renderDays(); renderSchedule(); renderPlans(); renderFab(); }

// ===== Modal =====
function openModal(html) {
  $("#modalBody").innerHTML = html;
  $("#modal").classList.add("open");
  $("#modal").setAttribute("aria-hidden", "false");
}
function closeModal() {
  $("#modal").classList.remove("open");
  $("#modal").setAttribute("aria-hidden", "true");
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 2600);
}

function findClass(id) {
  const [d, time] = id.split("-");
  const c = WEEK[+d].find((x) => x[0] === time);
  return { dayIdx: +d, c };
}

// Reserva
function openBooking(id) {
  const { dayIdx, c } = findClass(id);
  const date = weekDates()[dayIdx];
  const hasPlan = !!state.membership;
  openModal(`
    <p class="eyebrow">Reservar clase</p>
    <h3>${c[1]}</h3>
    <p class="muted">${DAY_NAMES[dayIdx]} ${date.getDate()}/${date.getMonth() + 1} · ${c[0]} hs · con ${c[3]}</p>
    <div class="summary">
      <div><span>Duración</span><span>${c[4]} min</span></div>
      <div><span>Cupos disponibles</span><span>${c[5] - c[6]} de ${c[5]}</span></div>
      <div class="total"><span>Se descuenta de</span><span>${hasPlan ? state.membership.name : "Clase de prueba (sin cargo)"}</span></div>
    </div>
    <form id="bookForm">
      ${hasPlan ? "" : `
        <label>Nombre y apellido<input required name="name" placeholder="Ana García"></label>
        <label>Email<input required type="email" name="email" placeholder="ana@email.com"></label>`}
      <button class="btn btn-dark btn-block" type="submit">Confirmar reserva</button>
    </form>`);
  $("#bookForm").addEventListener("submit", (e) => {
    e.preventDefault();
    state.bookings.push({ id, name: c[1], day: DAY_NAMES[dayIdx], time: c[0] });
    save(); renderSchedule(); renderFab();
    openModal(`
      <div class="success">
        <div class="success-dot">✓</div>
        <h3>¡Lugar reservado!</h3>
        <p class="muted">${c[1]} · ${DAY_NAMES[dayIdx]} ${c[0]} hs. Te enviamos la confirmación por email.</p>
        ${hasPlan ? "" : `<a href="#membresias" class="btn btn-ghost btn-block" data-close>Ver membresías</a>`}
      </div>`);
  });
}

function cancelBooking(id) {
  state.bookings = state.bookings.filter((b) => b.id !== id);
  save(); renderSchedule(); renderFab();
  toast("Reserva cancelada. Tu lugar quedó libre.");
}

function openMyBookings() {
  if (!state.bookings.length) return closeModal();
  openModal(`
    <p class="eyebrow">Mis reservas</p>
    <h3>Esta semana</h3>
    <p class="muted">${state.membership ? `Plan activo: ${state.membership.name}` : "Sin membresía activa"}</p>
    <div class="booking-list">
      ${state.bookings.map((b) => `
        <div class="booking-item">
          <div><strong>${b.name}</strong><small>${b.day} · ${b.time} hs</small></div>
          <button class="link-btn" data-cancel-modal="${b.id}">Cancelar</button>
        </div>`).join("")}
    </div>`);
}

// Pago de membresía
function openCheckout(planId) {
  const p = PLANS.find((x) => x.id === planId);
  const price = planPrice(p);
  const period = state.billing === "monthly" ? "Mensual" : "Trimestral";
  openModal(`
    <p class="eyebrow">Pago de membresía</p>
    <h3>${p.name}</h3>
    <p class="muted">Renovación automática · cancelás cuando quieras</p>
    <div class="summary">
      <div><span>Período</span><span>${period}</span></div>
      ${state.billing === "quarterly" ? `<div><span>Descuento</span><span>−15%</span></div>` : ""}
      <div class="total"><span>Total hoy</span><span>${money(price)}</span></div>
    </div>
    <form id="payForm">
      <div class="pay-methods" id="payMethods">
        <button type="button" class="active" data-method="card">Tarjeta</button>
        <button type="button" data-method="transfer">Transferencia</button>
      </div>
      <div id="cardFields">
        <form-fields style="display:flex;flex-direction:column;gap:14px">
          <label>Email<input required type="email" name="email" placeholder="ana@email.com"></label>
          <label>Número de tarjeta<input required name="card" inputmode="numeric" placeholder="1234 5678 9012 3456" maxlength="19"></label>
          <div class="form-row">
            <label>Vencimiento<input required name="exp" placeholder="MM/AA" maxlength="5"></label>
            <label>CVV<input required name="cvv" inputmode="numeric" placeholder="123" maxlength="4"></label>
          </div>
          <label>Nombre en la tarjeta<input required name="holder" placeholder="ANA GARCIA"></label>
        </form-fields>
      </div>
      <button class="btn btn-dark btn-block" type="submit" id="payBtn">Pagar ${money(price)}</button>
      <p class="secure">Pago encriptado · SSL 256 bits</p>
    </form>`);

  const cardFields = $("#cardFields");
  const cardHTML = cardFields.innerHTML;
  $("#payMethods").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    document.querySelectorAll("#payMethods button").forEach((x) => x.classList.toggle("active", x === b));
    cardFields.innerHTML = b.dataset.method === "card" ? cardHTML : `
      <div class="summary" style="margin:0">
        <div><span>Alias</span><span>nido.estudio.yoga</span></div>
        <div><span>CBU</span><span>0000003100012345678901</span></div>
        <div><span>Titular</span><span>Nido Estudio SRL</span></div>
      </div>
      <label style="margin-top:14px">Email para el comprobante<input required type="email" name="email" placeholder="ana@email.com"></label>`;
    bindCardMasks();
  });
  bindCardMasks();

  $("#payForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = $("#payBtn");
    btn.disabled = true; btn.textContent = "Procesando pago…";
    setTimeout(() => {
      state.membership = { id: p.id, name: p.name, billing: state.billing };
      save(); renderPlans();
      openModal(`
        <div class="success">
          <div class="success-dot">✓</div>
          <h3>¡Bienvenida a Nido!</h3>
          <p class="muted">Tu plan ${p.name} (${period.toLowerCase()}) está activo. Ya podés reservar tus clases.</p>
          <a href="#calendario" class="btn btn-dark btn-block" data-close>Ir al calendario</a>
        </div>`);
    }, 1400);
  });
}

function bindCardMasks() {
  const card = document.querySelector('input[name="card"]');
  const exp = document.querySelector('input[name="exp"]');
  if (card) card.addEventListener("input", () => {
    card.value = card.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  });
  if (exp) exp.addEventListener("input", () => {
    let v = exp.value.replace(/\D/g, "").slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    exp.value = v;
  });
}

// ===== Eventos =====
document.addEventListener("click", (e) => {
  const t = e.target;
  const day = t.closest("[data-day]");
  if (day) { state.day = +day.dataset.day; renderDays(); renderSchedule(); return; }

  const f = t.closest("[data-filter]");
  if (f) {
    state.filter = f.dataset.filter;
    document.querySelectorAll("#filters .chip").forEach((c) => c.classList.toggle("active", c === f));
    renderSchedule(); return;
  }

  const bill = t.closest("[data-billing]");
  if (bill) {
    state.billing = bill.dataset.billing;
    document.querySelectorAll("#billingToggle button").forEach((b) => b.classList.toggle("active", b === bill));
    renderPlans(); return;
  }

  const book = t.closest("[data-book]");
  if (book) return openBooking(book.dataset.book);

  const cancel = t.closest("[data-cancel]");
  if (cancel) return cancelBooking(cancel.dataset.cancel);

  const cancelM = t.closest("[data-cancel-modal]");
  if (cancelM) { cancelBooking(cancelM.dataset.cancelModal); return openMyBookings(); }

  const plan = t.closest("[data-plan]");
  if (plan) return openCheckout(plan.dataset.plan);

  if (t.closest("#myBookingsBtn")) return openMyBookings();
  if (t.closest("[data-close]")) closeModal();
});

document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

renderAll();
