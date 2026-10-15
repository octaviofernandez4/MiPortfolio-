// ===== Datos de la grilla (editá libremente) =====
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DAY_INDEX = [1, 2, 3, 4, 5, 6]; // getDay(): 1 = lunes

const CLASSES = [
  { day: 0, time: "07:00", dur: 50, name: "Cross Training", type: "fuerza", coach: "Lucía Ferreyra", cap: 16, taken: 11 },
  { day: 0, time: "09:00", dur: 45, name: "Movilidad", type: "movilidad", coach: "Diego Paz", cap: 14, taken: 5 },
  { day: 0, time: "18:30", dur: 45, name: "Spinning", type: "cardio", coach: "Sofía Acosta", cap: 20, taken: 20 },
  { day: 0, time: "20:00", dur: 60, name: "Fuerza Base", type: "fuerza", coach: "Martín Ríos", cap: 12, taken: 8 },
  { day: 1, time: "07:00", dur: 40, name: "HIIT", type: "cardio", coach: "Lucía Ferreyra", cap: 18, taken: 9 },
  { day: 1, time: "12:30", dur: 50, name: "Yoga Flow", type: "movilidad", coach: "Diego Paz", cap: 14, taken: 12 },
  { day: 1, time: "19:00", dur: 60, name: "Box", type: "cardio", coach: "Martín Ríos", cap: 16, taken: 7 },
  { day: 2, time: "07:00", dur: 50, name: "Cross Training", type: "fuerza", coach: "Lucía Ferreyra", cap: 16, taken: 14 },
  { day: 2, time: "18:30", dur: 45, name: "Spinning", type: "cardio", coach: "Sofía Acosta", cap: 20, taken: 13 },
  { day: 2, time: "20:00", dur: 60, name: "Fuerza Base", type: "fuerza", coach: "Martín Ríos", cap: 12, taken: 4 },
  { day: 3, time: "08:00", dur: 45, name: "Movilidad", type: "movilidad", coach: "Diego Paz", cap: 14, taken: 3 },
  { day: 3, time: "19:00", dur: 40, name: "HIIT", type: "cardio", coach: "Lucía Ferreyra", cap: 18, taken: 17 },
  { day: 3, time: "20:15", dur: 60, name: "Powerlifting", type: "fuerza", coach: "Martín Ríos", cap: 10, taken: 6 },
  { day: 4, time: "07:00", dur: 50, name: "Cross Training", type: "fuerza", coach: "Lucía Ferreyra", cap: 16, taken: 10 },
  { day: 4, time: "18:00", dur: 45, name: "Spinning", type: "cardio", coach: "Sofía Acosta", cap: 20, taken: 16 },
  { day: 5, time: "10:00", dur: 60, name: "WOD en equipo", type: "fuerza", coach: "Lucía Ferreyra", cap: 24, taken: 15 },
  { day: 5, time: "11:30", dur: 50, name: "Yoga Flow", type: "movilidad", coach: "Diego Paz", cap: 14, taken: 6 },
].map((c, i) => ({ ...c, id: "c" + i }));

const STORE_KEY = "forja_turnos";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

let state = {
  day: todayTab(),
  type: "all",
  turnos: JSON.parse(localStorage.getItem(STORE_KEY) || "[]"),
  pending: null,
};

function todayTab() {
  const d = new Date().getDay(); // 0 domingo
  return d === 0 ? 0 : d - 1;
}

// Próxima fecha real de un día de la semana
function nextDate(dayTab, time) {
  const now = new Date();
  const target = DAY_INDEX[dayTab];
  const date = new Date(now);
  let diff = (target - now.getDay() + 7) % 7;
  const [h, m] = time.split(":").map(Number);
  date.setHours(h, m, 0, 0);
  if (diff === 0 && date < now) diff = 7;
  date.setDate(now.getDate() + diff);
  return date;
}

const fmtDate = (d) =>
  d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state.turnos));
  $("#turnosCount").textContent = state.turnos.length;
}

const isBooked = (id) => state.turnos.some((t) => t.classId === id);

// ===== Render días =====
function renderDays() {
  $("#days").innerHTML = DAYS.map((d, i) => {
    const date = nextDate(i, "23:59");
    return `<button class="day ${i === state.day ? "is-active" : ""}" data-day="${i}" role="tab">
      <small>${d}</small><strong>${String(date.getDate()).padStart(2, "0")}</strong>
    </button>`;
  }).join("");
}

// ===== Render grilla =====
function renderSchedule() {
  const list = CLASSES.filter(
    (c) => c.day === state.day && (state.type === "all" || c.type === state.type)
  );
  if (!list.length) {
    $("#schedule").innerHTML = `<div class="empty">No hay clases de este tipo para este día.</div>`;
    return;
  }
  $("#schedule").innerHTML = list
    .map((c, i) => {
      const booked = isBooked(c.id);
      const taken = c.taken + (booked ? 1 : 0);
      const left = Math.max(c.cap - taken, 0);
      const full = left === 0 && !booked;
      const pct = Math.min((taken / c.cap) * 100, 100);
      const label = booked ? "Reservado ✓" : full ? "Completo" : "Reservar";
      return `<article class="slot ${booked ? "is-booked" : ""}" style="animation-delay:${i * 40}ms">
        <div class="slot__time">${c.time}<small>${c.dur} min</small></div>
        <div><div class="slot__name">${c.name}</div><span class="slot__type">${c.type}</span></div>
        <div class="slot__coach">${c.coach}</div>
        <div class="slot__cap">${full ? "Sin cupos" : left + " lugares libres"}
          <div class="bar ${full ? "is-full" : ""}"><i style="width:${pct}%"></i></div>
        </div>
        <button class="btn ${booked ? "" : "btn--lime"}" data-book="${c.id}" ${full ? "disabled" : ""}>${label}</button>
      </article>`;
    })
    .join("");
}

// ===== Próxima clase (hero) =====
function renderNext() {
  const now = new Date();
  const upcoming = CLASSES.map((c) => ({ c, d: nextDate(c.day, c.time) }))
    .filter((x) => x.d > now)
    .sort((a, b) => a.d - b.d)[0];
  if (upcoming) {
    const { c, d } = upcoming;
    const sameDay = d.toDateString() === now.toDateString();
    $("#nextClass").textContent = `${c.name} · ${sameDay ? "hoy" : DAYS[c.day]} ${c.time}`;
  }
}

// ===== Mis turnos =====
function renderTurnos() {
  const list = [...state.turnos].sort((a, b) => new Date(a.date) - new Date(b.date));
  $("#turnosList").innerHTML = list.length
    ? list
        .map(
          (t) => `<li class="turno">
        <strong>${t.name}</strong>
        <small>${fmtDate(new Date(t.date))} · ${t.time}</small>
        <small>con ${t.coach}</small>
        <button data-cancel="${t.classId}">Cancelar</button>
      </li>`
        )
        .join("")
    : `<li class="empty">Todavía no reservaste ninguna clase.<br><br><a href="#clases" data-close class="btn btn--lime">Ver grilla</a></li>`;
}

// ===== Modal / Drawer =====
function open(el) { el.classList.add("is-open"); el.setAttribute("aria-hidden", "false"); }
function close(el) { el.classList.remove("is-open"); el.setAttribute("aria-hidden", "true"); }

function openBooking(id) {
  const c = CLASSES.find((x) => x.id === id);
  if (!c) return;
  if (isBooked(id)) { renderTurnos(); open($("#turnosDrawer")); return; }
  state.pending = c;
  const d = nextDate(c.day, c.time);
  $("#bookTitle").textContent = c.name;
  $("#bookMeta").textContent = `${fmtDate(d)} · ${c.time} · ${c.coach}`;
  const saved = JSON.parse(localStorage.getItem("forja_user") || "{}");
  const f = $("#bookForm");
  f.nombre.value = saved.nombre || "";
  f.email.value = saved.email || "";
  f.tel.value = saved.tel || "";
  open($("#bookModal"));
  setTimeout(() => (saved.nombre ? f.querySelector("button[type=submit]") : f.nombre).focus(), 250);
}

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("is-show"), 2600);
}

// ===== Eventos =====
$("#days").addEventListener("click", (e) => {
  const b = e.target.closest("[data-day]");
  if (!b) return;
  state.day = Number(b.dataset.day);
  renderDays();
  renderSchedule();
});

$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest("[data-type]");
  if (!b) return;
  state.type = b.dataset.type;
  $$(".chip", $("#filters")).forEach((c) => c.classList.toggle("is-active", c === b));
  renderSchedule();
});

$("#schedule").addEventListener("click", (e) => {
  const b = e.target.closest("[data-book]");
  if (b && !b.disabled) openBooking(b.dataset.book);
});

$("#bookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;
  const c = state.pending;
  if (!c) return;
  const user = { nombre: f.nombre.value.trim(), email: f.email.value.trim(), tel: f.tel.value.trim() };
  localStorage.setItem("forja_user", JSON.stringify(user));
  state.turnos.push({
    classId: c.id, name: c.name, coach: c.coach, time: c.time,
    date: nextDate(c.day, c.time).toISOString(), ...user,
  });
  save();
  close($("#bookModal"));
  renderSchedule();
  toast(`¡Listo ${user.nombre.split(" ")[0]}! Reservaste ${c.name} a las ${c.time}`);
  state.pending = null;
});

$("#turnosList").addEventListener("click", (e) => {
  const b = e.target.closest("[data-cancel]");
  if (b) {
    state.turnos = state.turnos.filter((t) => t.classId !== b.dataset.cancel);
    save();
    renderTurnos();
    renderSchedule();
    toast("Turno cancelado");
  }
  if (e.target.closest("[data-close]")) close($("#turnosDrawer"));
});

$("#openTurnos").addEventListener("click", () => { renderTurnos(); open($("#turnosDrawer")); });

$$("[data-close]").forEach((el) =>
  el.addEventListener("click", () => { close($("#bookModal")); close($("#turnosDrawer")); })
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { close($("#bookModal")); close($("#turnosDrawer")); }
});

// Planes: mensual / anual
$("#billingToggle").addEventListener("click", (e) => {
  const b = e.target.closest("[data-billing]");
  if (!b) return;
  const anual = b.dataset.billing === "anual";
  $$("#billingToggle button").forEach((x) => x.classList.toggle("is-active", x === b));
  $$(".plan .amount").forEach((el) => {
    const base = Number(el.dataset.price);
    const v = anual ? Math.round((base * 0.8) / 100) * 100 : base;
    el.textContent = v.toLocaleString("es-AR");
  });
  $$(".plan .per").forEach((el) => (el.textContent = anual ? "/mes · pago anual" : "/mes"));
});

$$("[data-plan]").forEach((b) =>
  b.addEventListener("click", () => {
    const msg = encodeURIComponent(`Hola! Quiero info del plan ${b.dataset.plan} de FORJA.`);
    window.open(`https://wa.me/5491100000000?text=${msg}`, "_blank");
  })
);

// Nav: sombra al scrollear + menú mobile
window.addEventListener("scroll", () => $("#nav").classList.toggle("is-scrolled", scrollY > 10), { passive: true });
$("#burger").addEventListener("click", () => $("#navLinks").classList.toggle("is-open"));
$$("#navLinks a").forEach((a) => a.addEventListener("click", () => $("#navLinks").classList.remove("is-open")));

// Init
renderDays();
renderSchedule();
renderNext();
save();
