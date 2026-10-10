// ===== Datos =====
const EVENTS = {
  bodas: {
    label: "Bodas",
    menus: [
      { id: "boda-clasico", name: "Clásico", tag: "Más pedido", price: 38500, desc: "Recepción, plato principal y mesa dulce.", items: ["Recepción de 8 bocados fríos y calientes", "Lomo al malbec con papas rústicas", "Mesa dulce y torta de bodas", "Fin de fiesta: pizzas a la parrilla"] },
      { id: "boda-estaciones", name: "Estaciones", tag: "Informal", price: 42000, desc: "Islas de cocina en vivo para circular.", items: ["Isla de quesos y fiambres", "Estación de pastas al momento", "Parrilla criolla en vivo", "Barra de postres individuales"] },
      { id: "boda-autor", name: "De autor", tag: "Premium", price: 56000, desc: "Menú de pasos emplatado por nuestro chef.", items: ["Entrada de trucha ahumada y cítricos", "Ojo de bife madurado, puré de coliflor", "Pre-postre y postre de autor", "Café de especialidad y petit fours"] },
    ],
  },
  corporativo: {
    label: "Corporativo",
    menus: [
      { id: "corp-coffee", name: "Coffee break", tag: "Media jornada", price: 9800, desc: "Para reuniones, capacitaciones y lanzamientos.", items: ["Café, té e infusiones", "Medialunas y budines caseros", "Fruta de estación", "Jugos naturales"] },
      { id: "corp-lunch", name: "Working lunch", tag: "Box individual", price: 16500, desc: "Almuerzo práctico, cada uno con su caja.", items: ["Ensalada o wrap a elección", "Plato caliente del día", "Postre y bebida", "Opciones veggie y sin TACC"] },
      { id: "corp-gala", name: "Cena de gala", tag: "Fin de año", price: 44000, desc: "Para eventos de empresa con mesas servidas.", items: ["Recepción con barra de tragos", "Entrada, principal y postre", "Mozos y maître incluidos", "Brindis con espumante"] },
    ],
  },
  cumples: {
    label: "Cumpleaños",
    menus: [
      { id: "cumple-finger", name: "Finger food", tag: "Para picar", price: 18500, desc: "Bocados variados durante toda la fiesta.", items: ["14 variedades de bocados", "Mini hamburguesas y empanadas", "Brochettes de fruta", "Torta personalizada"] },
      { id: "cumple-asado", name: "Asado completo", tag: "Al aire libre", price: 27000, desc: "Parrillero, ensaladas y postre.", items: ["Choripán y provoleta de entrada", "Vacío, entraña y pollo", "Ensaladas de estación", "Flan casero con dulce de leche"] },
      { id: "cumple-infantil", name: "Infantil", tag: "Chicos", price: 12500, desc: "Menú pensado para los más chicos.", items: ["Panchitos y mini pizzas", "Nuggets caseros al horno", "Golosinas y pochoclos", "Torta temática"] },
    ],
  },
  coctel: {
    label: "Cóctel",
    menus: [
      { id: "coctel-esencial", name: "Esencial", tag: "2 horas", price: 21000, desc: "Bocados de pie, ideal para inauguraciones.", items: ["10 bocados por persona", "Barra de vinos y cervezas", "Mozos de bandeja", "Un dulce de cierre"] },
      { id: "coctel-completo", name: "Completo", tag: "4 horas", price: 33500, desc: "Reemplaza una cena, con platos en cazuela.", items: ["18 bocados fríos y calientes", "3 cazuelitas calientes", "Barra de tragos de autor", "Mesa de postres"] },
    ],
  },
};

const EXTRAS = [
  { id: "bebidas", name: "Bebidas sin alcohol", note: "Libre durante el evento", perPerson: 3500 },
  { id: "barra", name: "Barra de tragos", note: "Bartender + insumos", perPerson: 7800 },
  { id: "vajilla", name: "Vajilla y mantelería", note: "Línea blanca completa", perPerson: 2900 },
  { id: "mozos", name: "Servicio de mozos", note: "1 cada 15 invitados", perPerson: 4200 },
  { id: "dulce", name: "Mesa dulce extra", note: "6 variedades", perPerson: 3200 },
  { id: "deco", name: "Ambientación", note: "Centros de mesa y luces", flat: 180000 },
];

const STEPS = [
  { key: "recibido", label: "Pedido recibido", note: "Recibimos tu solicitud." },
  { key: "confirmado", label: "Confirmado", note: "Fecha reservada y seña acreditada." },
  { key: "preparacion", label: "En preparación", note: "Compramos insumos y armamos el equipo." },
  { key: "camino", label: "En camino", note: "El equipo sale hacia el salón." },
  { key: "servido", label: "Servido", note: "¡Que lo disfruten!" },
];

const STORAGE_KEY = "mesalarga_orders";
const fmt = (n) => "$" + Math.round(n).toLocaleString("es-AR");
const $ = (id) => document.getElementById(id);

// ===== Pedidos (localStorage) =====
function getOrders() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveOrders(orders) { localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); }

const DEMO_ORDER = {
  code: "ML-2048", menu: "Bodas · Estaciones", guests: 140,
  date: "2026-11-21", total: 6880000, step: 2,
};

// ===== Catálogo =====
let currentEvent = "bodas";

function renderTabs() {
  $("eventTabs").innerHTML = Object.entries(EVENTS).map(([key, ev]) =>
    `<button class="tab" role="tab" data-event="${key}" aria-selected="${key === currentEvent}">${ev.label}</button>`
  ).join("");
}

function renderMenus() {
  const ev = EVENTS[currentEvent];
  $("menuGrid").innerHTML = ev.menus.map((m, i) => `
    <article class="menu-card" style="animation-delay:${i * 70}ms">
      <div class="ph"><span>foto — menú ${m.name.toLowerCase()}</span></div>
      <div class="menu-card__body">
        <div class="menu-card__top">
          <h3>${m.name}</h3>
          <span class="menu-card__tag">${m.tag}</span>
        </div>
        <p class="menu-card__desc">${m.desc}</p>
        <ul>${m.items.map((it) => `<li>${it}</li>`).join("")}</ul>
        <div class="menu-card__foot">
          <span class="price">${fmt(m.price)} <small>/ persona</small></span>
          <button class="btn btn--dark btn--sm" data-quote="${m.id}">Cotizar</button>
        </div>
      </div>
    </article>`).join("");
}

$("eventTabs").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-event]");
  if (!btn) return;
  currentEvent = btn.dataset.event;
  renderTabs();
  renderMenus();
});

$("menuGrid").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-quote]");
  if (!btn) return;
  $("qEvent").value = currentEvent;
  fillMenuSelect();
  $("qMenu").value = btn.dataset.quote;
  updateQuote();
  window.scrollTo({ top: $("cotizar").getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
});

// ===== Cotizador =====
function fillEventSelect() {
  $("qEvent").innerHTML = Object.entries(EVENTS).map(([k, ev]) => `<option value="${k}">${ev.label}</option>`).join("");
}
function fillMenuSelect() {
  const ev = EVENTS[$("qEvent").value];
  $("qMenu").innerHTML = ev.menus.map((m) => `<option value="${m.id}">${m.name} — ${fmt(m.price)} p/p</option>`).join("");
}
function renderExtras() {
  $("qExtras").innerHTML = EXTRAS.map((x) => `
    <label class="extra">
      <input type="checkbox" value="${x.id}">
      <span><strong>${x.name}</strong><small>${x.note} · ${x.flat ? fmt(x.flat) + " fijo" : fmt(x.perPerson) + " p/p"}</small></span>
    </label>`).join("");
}

function currentMenu() {
  return EVENTS[$("qEvent").value].menus.find((m) => m.id === $("qMenu").value);
}

function calcQuote() {
  const menu = currentMenu();
  const guests = +$("qGuests").value;
  const zone = +$("qZone").value;
  const lines = [{ label: `${guests} cubiertos × ${fmt(menu.price)}`, value: menu.price * guests }];

  document.querySelectorAll("#qExtras input:checked").forEach((cb) => {
    const x = EXTRAS.find((e) => e.id === cb.value);
    lines.push({ label: x.name, value: x.flat ? x.flat : x.perPerson * guests });
  });
  if (zone) lines.push({ label: "Traslado", value: zone });

  let total = lines.reduce((s, l) => s + l.value, 0);
  if (guests >= 200) {
    const disc = total * 0.08;
    lines.push({ label: "Descuento +200 invitados (8%)", value: -disc });
    total -= disc;
  }
  return { menu, guests, lines, total };
}

function updateQuote() {
  $("qGuestsOut").textContent = $("qGuests").value;
  const q = calcQuote();
  $("sMenu").textContent = `${EVENTS[$("qEvent").value].label} · ${q.menu.name}`;
  $("sLines").innerHTML = q.lines.map((l) => `<li><span>${l.label}</span><span>${l.value < 0 ? "−" + fmt(-l.value) : fmt(l.value)}</span></li>`).join("");
  $("sTotal").textContent = fmt(q.total);
  $("sPerPerson").textContent = `${fmt(q.total / q.guests)} por invitado`;
}

$("qEvent").addEventListener("change", () => { fillMenuSelect(); updateQuote(); });
["qMenu", "qZone"].forEach((id) => $(id).addEventListener("change", updateQuote));
$("qGuests").addEventListener("input", updateQuote);
$("qExtras").addEventListener("change", updateQuote);

$("quoteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const required = ["qDate", "qName", "qEmail"];
  let ok = true;
  required.forEach((id) => {
    const el = $(id);
    const valid = el.value.trim() && el.checkValidity();
    el.classList.toggle("invalid", !valid);
    if (!valid) ok = false;
  });
  if (!ok) { $("formError").textContent = "Completá fecha, nombre y un email válido."; return; }
  $("formError").textContent = "";

  const q = calcQuote();
  const code = "ML-" + Math.floor(1000 + Math.random() * 9000);
  const orders = getOrders();
  orders[code] = {
    code, menu: `${EVENTS[$("qEvent").value].label} · ${q.menu.name}`,
    guests: q.guests, date: $("qDate").value, total: q.total, step: 0,
  };
  saveOrders(orders);

  showToast(`Pedido enviado. Tu código es <b>${code}</b>`);
  $("trackInput").value = code;
  showOrder(code);
});

// ===== Seguimiento =====
function findOrder(code) {
  code = code.trim().toUpperCase();
  if (code === DEMO_ORDER.code) return DEMO_ORDER;
  return getOrders()[code];
}

function showOrder(code) {
  const order = findOrder(code);
  if (!order) {
    $("trackPanel").hidden = true;
    $("trackError").textContent = "No encontramos ese código. Revisá el email de confirmación.";
    return;
  }
  $("trackError").textContent = "";
  $("tCode").textContent = order.code;
  $("tStatus").textContent = STEPS[order.step].label;
  $("tMenu").textContent = order.menu;
  $("tGuests").textContent = order.guests;
  $("tDate").textContent = new Date(order.date + "T12:00").toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
  $("tTotal").textContent = fmt(order.total);
  $("tTimeline").innerHTML = STEPS.map((s, i) => {
    const cls = i < order.step ? "done" : i === order.step ? "current" : "";
    return `<li class="${cls}"><span class="dot">${i < order.step ? "✓" : ""}</span><span><strong>${s.label}</strong><small>${s.note}</small></span></li>`;
  }).join("");
  const panel = $("trackPanel");
  panel.hidden = false;
  panel.style.animation = "none"; void panel.offsetWidth; panel.style.animation = "";
}

$("trackForm").addEventListener("submit", (e) => { e.preventDefault(); showOrder($("trackInput").value); });
$("demoCode").addEventListener("click", () => { $("trackInput").value = DEMO_ORDER.code; showOrder(DEMO_ORDER.code); });

// ===== UI general =====
let toastTimer;
function showToast(html) {
  const t = $("toast");
  t.innerHTML = html;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 4000);
}

$("navToggle").addEventListener("click", () => $("navLinks").classList.toggle("open"));
$("navLinks").addEventListener("click", (e) => { if (e.target.tagName === "A") $("navLinks").classList.remove("open"); });

// ===== Init =====
const minDate = new Date(Date.now() + 7 * 864e5).toISOString().split("T")[0];
$("qDate").min = minDate;
$("year").textContent = new Date().getFullYear();

renderTabs();
renderMenus();
fillEventSelect();
fillMenuSelect();
renderExtras();
updateQuote();