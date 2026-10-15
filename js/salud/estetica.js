const TREATMENTS = [
  { id: 1, cat: "facial", name: "Limpieza facial profunda", desc: "Extracción, exfoliación enzimática y máscara hidratante según tu tipo de piel.", min: 60, price: 18000 },
  { id: 2, cat: "facial", name: "Peeling químico suave", desc: "Renueva la textura y unifica el tono. Ideal en otoño e invierno.", min: 45, price: 22000 },
  { id: 3, cat: "masajes", name: "Masaje descontracturante", desc: "Trabajo profundo en espalda, cuello y hombros con aceites tibios.", min: 60, price: 20000 },
  { id: 4, cat: "masajes", name: "Piedras calientes", desc: "Basalto volcánico y maniobras lentas para soltar tensiones.", min: 75, price: 26000 },
  { id: 5, cat: "corporal", name: "Drenaje linfático", desc: "Técnica manual que reduce la retención de líquidos y desinflama.", min: 50, price: 19000 },
  { id: 6, cat: "corporal", name: "Exfoliación y envoltura", desc: "Sales marinas, arcilla verde y ducha. Piel suave por semanas.", min: 70, price: 24000 },
  { id: 7, cat: "manos", name: "Manicura semipermanente", desc: "Limado, cutículas y esmaltado que dura hasta tres semanas.", min: 45, price: 12000 },
  { id: 8, cat: "manos", name: "Spa de pies", desc: "Baño, exfoliación, hidratación profunda y esmaltado.", min: 60, price: 15000 }
];
const CAT_LABEL = { facial: "Facial", corporal: "Corporal", masajes: "Masajes", manos: "Manos y pies" };
const money = n => "$" + n.toLocaleString("es-AR");

/* Nav */
const nav = document.querySelector(".nav");
document.getElementById("navToggle").addEventListener("click", () => nav.classList.toggle("is-open"));
document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => nav.classList.remove("is-open")));
window.addEventListener("scroll", () => nav.classList.toggle("is-scrolled", window.scrollY > 10), { passive: true });

/* Catálogo */
const catalog = document.getElementById("catalog");
function renderCatalog(cat) {
  const list = cat === "todos" ? TREATMENTS : TREATMENTS.filter(t => t.cat === cat);
  catalog.innerHTML = list.map((t, i) => `
    <article class="card" style="animation-delay:${i * 60}ms">
      <div class="placeholder"><span>foto · ${t.name.toLowerCase()}</span></div>
      <div class="card-top"><h3>${t.name}</h3><span class="c-price">${money(t.price)}</span></div>
      <p>${t.desc}</p>
      <div class="card-foot"><span>${CAT_LABEL[t.cat]} · ${t.min} min</span><a href="#agenda" data-book="${t.id}">Reservar →</a></div>
    </article>`).join("");
}
document.getElementById("filters").addEventListener("click", e => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  document.querySelectorAll(".filter").forEach(b => b.classList.toggle("is-active", b === btn));
  renderCatalog(btn.dataset.cat);
});
catalog.addEventListener("click", e => {
  const link = e.target.closest("[data-book]");
  if (link) selectService(+link.dataset.book);
});
renderCatalog("todos");

/* Agenda demo */
const state = { service: null, day: null, slot: null };
const serviceList = document.getElementById("serviceList");
const daysEl = document.getElementById("days");
const slotsEl = document.getElementById("slots");
const toStep2 = document.getElementById("toStep2");
const toStep3 = document.getElementById("toStep3");
const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DAY_FULL = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const SLOTS = ["10:00", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "19:30"];

serviceList.innerHTML = TREATMENTS.slice(0, 5).map(t => `
  <button class="service" data-id="${t.id}">
    <span><strong>${t.name}</strong><small>${t.min} min</small></span>
    <span class="s-price">${money(t.price)}</span>
  </button>`).join("");

function selectService(id) {
  state.service = TREATMENTS.find(t => t.id === id);
  if (!serviceList.querySelector(`[data-id="${id}"]`)) {
    serviceList.insertAdjacentHTML("afterbegin", `<button class="service" data-id="${id}"><span><strong>${state.service.name}</strong><small>${state.service.min} min</small></span><span class="s-price">${money(state.service.price)}</span></button>`);
  }
  serviceList.querySelectorAll(".service").forEach(b => b.classList.toggle("is-selected", +b.dataset.id === id));
  toStep2.disabled = false;
  goTo(1);
}
serviceList.addEventListener("click", e => {
  const b = e.target.closest(".service");
  if (b) selectService(+b.dataset.id);
});

const days = [];
for (let d = new Date(), n = 0; days.length < 6; n++) {
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n + 1);
  if (day.getDay() !== 0) days.push(day);
}
daysEl.innerHTML = days.map((d, i) => `<button class="day" data-i="${i}"><small>${DAY_NAMES[d.getDay()]}</small><strong>${d.getDate()}</strong></button>`).join("");

function renderSlots() {
  if (state.day === null) { slotsEl.innerHTML = ""; return; }
  slotsEl.innerHTML = SLOTS.map((s, i) => {
    const busy = (i * 7 + state.day * 3) % 5 === 0;
    return `<button class="slot${state.slot === s ? " is-selected" : ""}" data-s="${s}" ${busy ? "disabled" : ""}>${s}</button>`;
  }).join("");
}
daysEl.addEventListener("click", e => {
  const b = e.target.closest(".day");
  if (!b) return;
  state.day = +b.dataset.i; state.slot = null;
  daysEl.querySelectorAll(".day").forEach(x => x.classList.toggle("is-selected", x === b));
  toStep3.disabled = true;
  renderSlots();
});
slotsEl.addEventListener("click", e => {
  const b = e.target.closest(".slot");
  if (!b || b.disabled) return;
  state.slot = b.dataset.s;
  renderSlots();
  toStep3.disabled = false;
});

function goTo(step) {
  document.querySelectorAll(".booking-panel").forEach(p => p.classList.toggle("is-active", +p.dataset.panel === step));
  document.querySelectorAll(".step").forEach(s => {
    const n = +s.dataset.step;
    s.classList.toggle("is-active", n === step);
    s.classList.toggle("is-done", n < step);
  });
}
toStep2.addEventListener("click", () => {
  document.getElementById("chosenService").textContent = state.service.name;
  goTo(2);
});
toStep3.addEventListener("click", () => {
  const d = days[state.day];
  const label = `${DAY_FULL[d.getDay()]} ${d.getDate()} a las ${state.slot}`;
  document.getElementById("confirmDetail").textContent = `${state.service.name} · ${label} · ${state.service.min} min`;
  document.getElementById("reminderPreview").textContent = `“Hola 🌿 Le recordamos su ${state.service.name.toLowerCase()} el ${label}. ¿Confirma?”`;
  goTo(3);
});
document.querySelectorAll("[data-back]").forEach(b => b.addEventListener("click", () => goTo(+b.dataset.back)));
document.getElementById("restart").addEventListener("click", () => {
  Object.assign(state, { service: null, day: null, slot: null });
  serviceList.querySelectorAll(".service").forEach(b => b.classList.remove("is-selected"));
  daysEl.querySelectorAll(".day").forEach(b => b.classList.remove("is-selected"));
  renderSlots();
  toStep2.disabled = true; toStep3.disabled = true;
  goTo(1);
});

/* Precios */
const prices = document.querySelectorAll(".price");
function renderPrices(period) {
  prices.forEach(p => p.textContent = money(+(period === "anual" ? p.dataset.a : p.dataset.m)));
}
document.getElementById("billing").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  document.querySelectorAll("#billing button").forEach(x => x.classList.toggle("is-active", x === b));
  renderPrices(b.dataset.period);
});
renderPrices("mensual");

/* FAQ: uno abierto a la vez */
document.querySelectorAll(".faq details").forEach(d => d.addEventListener("toggle", () => {
  if (d.open) document.querySelectorAll(".faq details").forEach(o => o !== d && (o.open = false));
}));

/* CTA */
document.getElementById("ctaForm").addEventListener("submit", e => {
  e.preventDefault();
  e.target.reset();
  document.getElementById("ctaNote").textContent = "¡Listo! Le enviamos un email para activar su cuenta.";
});

/* Reveal + chat animado */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in");
    if (en.target.id === "chat") {
      [...en.target.children].forEach((el, i) => setTimeout(() => el.classList.add("is-visible"), 300 + i * 700));
    }
    io.unobserve(en.target);
  });
}, { threshold: 0.2 });
document.querySelectorAll(".section-head, .feature, .quote, .plan, .agenda-copy, .booking").forEach(el => { el.classList.add("reveal"); io.observe(el); });
io.observe(document.getElementById("chat"));
