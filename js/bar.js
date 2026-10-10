// ====== DATOS (editá acá tu carta, eventos y horarios) ======
const MENU = {
  "Cervezas": [
    { name: "Norte IPA", desc: "Cítrica y resinosa. Lúpulos Citra y Mosaic.", price: 5200, meta: ["6.5% ABV", "60 IBU"], tag: "Nueva" },
    { name: "Golden Ale", desc: "Liviana, dorada, para arrancar la noche.", price: 4500, meta: ["4.8% ABV", "18 IBU"] },
    { name: "Honey Beer", desc: "Con miel de la zona. Dulzor suave.", price: 4800, meta: ["5.5% ABV", "15 IBU"] },
    { name: "Stout de Café", desc: "Negra, cremosa, con café de especialidad.", price: 5400, meta: ["6.0% ABV", "35 IBU"] },
    { name: "Red Irish", desc: "Maltosa, notas a caramelo.", price: 4800, meta: ["5.2% ABV", "22 IBU"] },
    { name: "Hazy Doble IPA", desc: "Turbia, jugosa, sin amargor agresivo.", price: 5900, meta: ["8.0% ABV", "40 IBU"], out: true }
  ],
  "Tragos": [
    { name: "Fernet con cola", desc: "El clásico, bien cargado.", price: 5500 },
    { name: "Gin tonic de la casa", desc: "Gin local, pepino y pimienta rosa.", price: 6800, tag: "Top" },
    { name: "Negroni", desc: "Gin, Campari, vermut rosso.", price: 7200 },
    { name: "Michelada", desc: "Golden Ale, lima, salsa picante y sal.", price: 5800 }
  ],
  "Para picar": [
    { name: "Papas Barril", desc: "Con cheddar, panceta y verdeo. Para compartir.", price: 8900, tag: "Top" },
    { name: "Burger Norte", desc: "Doble smash, cheddar, cebolla caramelizada.", price: 11500 },
    { name: "Tabla de fiambres", desc: "Quesos y embutidos para 2–3 personas.", price: 14800 },
    { name: "Nachos veggies", desc: "Guacamole, pico de gallo, jalapeños. Sin TACC.", price: 8200, tag: "Sin TACC" },
    { name: "Alitas BBQ", desc: "10 unidades con dip de queso azul.", price: 9600 }
  ],
  "Sin alcohol": [
    { name: "IPA 0.0", desc: "Todo el lúpulo, nada de alcohol.", price: 4200 },
    { name: "Limonada de jengibre", desc: "Menta, jengibre y lima.", price: 3800 },
    { name: "Gaseosas", desc: "Línea Coca-Cola.", price: 2500 }
  ]
};

const EVENTS = [
  { offset: 2, title: "Trivia Cervecera", desc: "Equipos de hasta 6. El ganador se lleva un barril de 5 litros.", tag: "Quedan pocas mesas", hot: true, img: "foto trivia" },
  { offset: 4, title: "Rock en vivo", desc: "Banda tributo a los 90. Show desde las 23:00, sin cover.", tag: "Entrada libre", img: "foto banda en vivo" },
  { offset: 6, title: "Lanzamiento Doble IPA", desc: "Primera pinta de regalo para los primeros 50 reservados.", tag: "Edición limitada", hot: true, img: "foto lanzamiento" }
];

// 0 = domingo ... 6 = sábado. null = cerrado.
const HOURS = { 0: [18, 1], 1: null, 2: [19, 2], 3: [19, 2], 4: [19, 2], 5: [19, 4], 6: [19, 4] };
const SLOTS = ["20:00", "22:00", "00:00"];
const TABLES_PER_SLOT = 18;

// ====== HELPERS ======
const $ = (s, el = document) => el.querySelector(s);
const money = n => "$" + n.toLocaleString("es-AR");
const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); x.setHours(0, 0, 0, 0); return x; };
const today = addDays(new Date(), 0);

// ====== NAV ======
const nav = $("#nav");
$("#navToggle").addEventListener("click", () => nav.classList.toggle("is-open"));
document.querySelectorAll("#navLinks a").forEach(a => a.addEventListener("click", () => nav.classList.remove("is-open")));
window.addEventListener("scroll", () => nav.classList.toggle("is-scrolled", window.scrollY > 10), { passive: true });

// ====== ESTADO ABIERTO / CERRADO ======
(function openStatus() {
  const el = $("#openStatus");
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;
  const d = now.getDay();
  const yest = HOURS[(d + 6) % 7];
  const tod = HOURS[d];
  let open = false, closeAt = null;
  if (yest && yest[1] < yest[0] && h < yest[1]) { open = true; closeAt = yest[1]; }
  else if (tod && h >= tod[0]) { open = true; closeAt = tod[1]; }
  const fmt = n => String(n).padStart(2, "0") + ":00";
  if (open) { el.classList.add("is-open"); el.lastChild.textContent = `Abierto ahora · cierra ${fmt(closeAt)}`; }
  else if (tod && h < tod[0]) el.lastChild.textContent = `Cerrado · abre hoy ${fmt(tod[0])}`;
  else el.lastChild.textContent = "Cerrado · volvemos mañana";
  const rows = document.querySelectorAll(".hours tr");
  const map = { 1: 0, 2: 1, 3: 1, 4: 1, 5: 2, 6: 2, 0: 3 };
  rows[map[d]]?.classList.add("is-today");
})();

// ====== TICKER ======
(function ticker() {
  const names = MENU["Cervezas"].filter(b => !b.out).map(b => `${b.name} ${b.meta[0]}`);
  const items = [...names, "Happy hour 19–21", ...names, "Happy hour 19–21"];
  $("#tickerTrack").innerHTML = items.map(t => `<span>${t}</span>`).join("");
})();

// ====== CARTA ======
let activeCat = Object.keys(MENU)[0];
const tabs = $("#menuTabs"), list = $("#menuList"), search = $("#menuSearch"), empty = $("#menuEmpty");

tabs.innerHTML = Object.keys(MENU).map(c => `<button class="tab" role="tab" data-cat="${c}">${c}</button>`).join("");
tabs.addEventListener("click", e => {
  const b = e.target.closest(".tab"); if (!b) return;
  activeCat = b.dataset.cat; search.value = ""; renderMenu();
});
search.addEventListener("input", renderMenu);

function renderMenu() {
  const q = search.value.trim().toLowerCase();
  tabs.querySelectorAll(".tab").forEach(t => t.classList.toggle("is-active", !q && t.dataset.cat === activeCat));
  const items = q
    ? Object.values(MENU).flat().filter(i => (i.name + i.desc + (i.tag || "")).toLowerCase().includes(q))
    : MENU[activeCat];
  empty.hidden = items.length > 0;
  list.innerHTML = items.map((i, n) => `
    <li class="item ${i.out ? "is-out" : ""}" style="animation-delay:${n * 30}ms">
      <span class="item__name">${i.name}${i.tag ? `<span class="badge">${i.tag}</span>` : ""}${i.out ? `<span class="badge badge--out">Agotada</span>` : ""}</span>
      <span class="item__price">${money(i.price)}</span>
      <span class="item__desc">${i.desc}</span>
      ${i.meta ? `<span class="item__meta">${i.meta.map(m => `<span>${m}</span>`).join("")}</span>` : ""}
    </li>`).join("");
}
renderMenu();

// ====== EVENTOS ======
const eventDates = EVENTS.map(e => ({ ...e, date: addDays(today, e.offset) }));
$("#eventsList").innerHTML = eventDates.map((e, i) => `
  <article class="event">
    <div class="ph ph--event"><span>${e.img}</span></div>
    <div class="event__body">
      <div class="event__date"><strong>${String(e.date.getDate()).padStart(2, "0")}</strong>${DAYS[e.date.getDay()]} · ${MONTHS[e.date.getMonth()]} · 22:00</div>
      <h3>${e.title}</h3>
      <p>${e.desc}</p>
      <div class="event__foot">
        <span class="event__tag ${e.hot ? "is-hot" : ""}">${e.tag}</span>
        <button class="btn btn--primary btn--sm" data-event="${i}">Reservar</button>
      </div>
    </div>
  </article>`).join("");

$("#eventsList").addEventListener("click", e => {
  const b = e.target.closest("[data-event]"); if (!b) return;
  const ev = eventDates[b.dataset.event];
  const idx = dates.findIndex(d => d.getTime() === ev.date.getTime());
  if (idx > -1 && !isClosed(dates[idx])) { state.day = idx; state.slot = 1; renderDays(); renderSlots(); updateSummary(); }
  window.scrollTo({ top: $("#reservas").offsetTop - 68, behavior: "smooth" });
});

// ====== RESERVAS ======
const dates = Array.from({ length: 14 }, (_, i) => addDays(today, i)).slice(0, 7);
const isClosed = d => HOURS[d.getDay()] === null;
const state = { day: dates.findIndex(d => !isClosed(d)), slot: null, people: 2 };

// Disponibilidad simulada (reemplazar por tu backend)
function availability(dayIdx, slotIdx) {
  const d = dates[dayIdx];
  const seed = (d.getDate() * 7 + slotIdx * 13) % 19;
  const weekend = [5, 6].includes(d.getDay());
  const hasEvent = eventDates.some(e => e.date.getTime() === d.getTime());
  let left = TABLES_PER_SLOT - seed - (weekend ? 6 : 0) - (hasEvent ? 5 : 0) - (slotIdx === 1 ? 3 : 0);
  if (dayIdx === 0) left -= 4;
  return Math.max(0, left);
}

function renderDays() {
  $("#daysList").innerHTML = dates.map((d, i) => {
    const ev = eventDates.some(e => e.date.getTime() === d.getTime());
    return `<button type="button" class="day ${i === state.day ? "is-active" : ""} ${ev ? "has-event" : ""}" data-day="${i}" ${isClosed(d) ? "disabled" : ""} title="${ev ? "Noche con evento" : ""}">
      <small>${i === 0 ? "Hoy" : DAYS[d.getDay()]}</small><strong>${d.getDate()}</strong>
    </button>`;
  }).join("");
}

function renderSlots() {
  $("#slotsList").innerHTML = SLOTS.map((s, i) => {
    const left = availability(state.day, i);
    const label = left === 0 ? "Completo" : left <= 4 ? `Quedan ${left}` : `${left} mesas`;
    if (left === 0 && state.slot === i) state.slot = null;
    return `<button type="button" class="slot ${state.slot === i ? "is-active" : ""}" data-slot="${i}" ${left === 0 ? "disabled" : ""}>
      <strong>${s}</strong><small class="${left > 0 && left <= 4 ? "is-low" : ""}">${label}</small>
    </button>`;
  }).join("");
}

function updateSummary() {
  const d = dates[state.day];
  $("#summaryText").textContent = state.slot === null
    ? "Elegí un turno"
    : `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} · ${SLOTS[state.slot]} · ${state.people} ${state.people === 1 ? "persona" : "personas"}`;
}

$("#daysList").addEventListener("click", e => {
  const b = e.target.closest("[data-day]"); if (!b || b.disabled) return;
  state.day = +b.dataset.day; renderDays(); renderSlots(); updateSummary();
});
$("#slotsList").addEventListener("click", e => {
  const b = e.target.closest("[data-slot]"); if (!b || b.disabled) return;
  state.slot = +b.dataset.slot; renderSlots(); updateSummary(); $("#formError").hidden = true;
});
document.querySelectorAll("[data-step]").forEach(b => b.addEventListener("click", () => {
  state.people = Math.min(10, Math.max(1, state.people + +b.dataset.step));
  $("#peopleOut").textContent = state.people; updateSummary();
}));

$("#reserveForm").addEventListener("submit", e => {
  e.preventDefault();
  const err = $("#formError");
  const name = $("#name"), phone = $("#phone");
  [name, phone].forEach(i => i.classList.remove("is-invalid"));
  let msg = "";
  if (state.slot === null) msg = "Elegí un turno.";
  else if (name.value.trim().length < 2) { msg = "Ingresá tu nombre."; name.classList.add("is-invalid"); }
  else if (phone.value.replace(/\D/g, "").length < 8) { msg = "Ingresá un teléfono válido."; phone.classList.add("is-invalid"); }
  if (msg) { err.textContent = msg; err.hidden = false; return; }
  err.hidden = true;

  const d = dates[state.day];
  const rows = [
    ["Nombre", name.value.trim()],
    ["Fecha", `${DAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`],
    ["Turno", `${SLOTS[state.slot]} hs`],
    ["Personas", state.people],
    ["Zona", $("#zone").value],
    ["Código", "BN-" + Math.random().toString(36).slice(2, 7).toUpperCase()]
  ];
  $("#ticket").innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
  $("#modal").hidden = false;
  // Acá podés enviar los datos a tu backend / WhatsApp / Google Sheets
  console.log("Reserva:", Object.fromEntries(rows));
});

function closeModal() {
  $("#modal").hidden = true;
  $("#reserveForm").reset();
  state.slot = null; state.people = 2; $("#peopleOut").textContent = 2;
  renderSlots(); updateSummary();
}
$("#modalClose").addEventListener("click", closeModal);
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#modal").hidden) closeModal(); });

renderDays(); renderSlots(); updateSummary();