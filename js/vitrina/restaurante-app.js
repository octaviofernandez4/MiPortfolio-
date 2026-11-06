const IMG = id => `../../assets/img/vitrina/app/${id.split("-")[0]}.webp`;
const MENU = {
  entradas: [
    { n: "Burrata ahumada", d: "Tomates confitados, pesto de albahaca y pan de masa madre.", p: 9800, i: "1546069901-ba9599a7e63c" },
    { n: "Empanadas de osobuco", d: "Cocción de 12 h, masa casera y llajua.", p: 7200, i: "1529692236671-f1f6cf9683ba" },
    { n: "Provoleta a la brasa", d: "Orégano fresco, miel picante y nueces.", p: 8500, i: "1540189549336-e6e99c3679fe" }
  ],
  principales: [
    { n: "Hamburguesa Ámbar", d: "Doble medallón, cheddar añejo y cebolla caramelizada.", p: 13800, i: "1568901346375-23c9450c58cd", hot: 1 },
    { n: "Brochetas a la brasa", d: "Cordero marinado, chimichurri ahumado y papas rústicas.", p: 15900, i: "1555939594-58d7cb561ad1", hot: 1 },
    { n: "Pizza de masa madre", d: "48 h de fermentación, fior di latte y albahaca.", p: 14200, i: "1565299624946-b28f40a0ae38", hot: 1 },
    { n: "Plato del chef", d: "Selección del día con producto de estación.", p: 18900, i: "1504674900247-0877df9cc836", hot: 1 }
  ],
  postres: [
    { n: "Volcán de chocolate", d: "Corazón líquido y helado de dulce de leche.", p: 7600, i: "1476224203421-9ac39bcb3327" },
    { n: "Flan de la abuela", d: "Dulce de leche casero y crema batida.", p: 5900, i: "1540189549336-e6e99c3679fe" }
  ],
  bebidas: [
    { n: "Malbec reserva", d: "Copa · Valle de Uco, Mendoza.", p: 5200, i: "1414235077428-338989a2e8c0" },
    { n: "Negroni de la casa", d: "Gin, campari y vermut infusionado.", p: 6900, i: "1517248135467-4c7edcad34c4" }
  ]
};
const ALL = Object.values(MENU).flat();
const money = n => "$" + n.toLocaleString("es-AR");
const $ = s => document.querySelector(s);
const icons = () => lucide.createIcons();
const vibrate = () => navigator.vibrate && navigator.vibrate(10);

let cart = [];
let currentCat = "entradas";

/* Reloj + saludo */
const tickClock = () => {
  const d = new Date();
  $("#clock").textContent = d.toLocaleTimeString("es-AR", { hour: "numeric", minute: "2-digit", hour12: false });
  const h = d.getHours();
  $("#greet").textContent = h < 12 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches";
};
tickClock(); setInterval(tickClock, 30000);

/* Navegación por pestañas */
function goTab(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === id));
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("on", t.dataset.tab === id));
  vibrate();
}
document.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => goTab(b.dataset.tab)));

/* Título grande que colapsa al hacer scroll */
document.querySelectorAll(".screen").forEach(screen => {
  const scroller = screen.querySelector(".scroll");
  const bar = screen.querySelector(".topbar");
  scroller.addEventListener("scroll", () => bar.classList.toggle("solid", scroller.scrollTop > 50), { passive: true });
});

/* Carrusel */
const carousel = $("#carousel");
const pageDots = document.querySelectorAll("#pageDots span");
carousel.addEventListener("scroll", () => {
  const i = Math.round(carousel.scrollLeft / carousel.clientWidth);
  pageDots.forEach((d, k) => d.classList.toggle("on", k === i));
}, { passive: true });
let autoIdx = 0;
setInterval(() => {
  if (!$("#home").classList.contains("active")) return;
  autoIdx = (Math.round(carousel.scrollLeft / carousel.clientWidth) + 1) % pageDots.length;
  carousel.scrollTo({ left: autoIdx * (carousel.clientWidth + 12), behavior: "smooth" });
}, 5000);

/* Destacados */
const renderFeatured = (list = ALL.filter(x => x.hot)) => {
  $("#featured").innerHTML = list.map(x => `
    <button class="f-card press" data-dish="${x.n}">
      <div class="ph"><img src="${IMG(x.i)}" alt="${x.n}"></div>
      <div class="t"><b>${x.n}</b><span>${money(x.p)}</span></div>
    </button>`).join("") || `<p style="color:var(--muted);padding:8px 0">Sin resultados</p>`;
};
renderFeatured();
$("#searchInput").addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  renderFeatured(q ? ALL.filter(x => x.n.toLowerCase().includes(q)) : undefined);
});

/* Menú con control segmentado */
const segBtns = document.querySelectorAll("#segmented button");
function setCat(cat) {
  currentCat = cat;
  const idx = [...segBtns].findIndex(b => b.dataset.cat === cat);
  segBtns.forEach((b, i) => b.classList.toggle("on", i === idx));
  $("#segThumb").style.transform = `translateX(${idx * 100}%)`;
  $("#menuList").innerHTML = MENU[cat].map((x, i) => `
    <div class="item" style="animation-delay:${i * 60}ms" data-dish="${x.n}">
      <div class="ph"><img src="${IMG(x.i)}" alt="${x.n}"></div>
      <div class="t"><b>${x.n}</b><p>${x.d}</p><span class="price">${money(x.p)}</span></div>
      <button class="add press" data-add="${x.n}" aria-label="Agregar"><i data-lucide="plus"></i></button>
    </div>`).join("");
  icons();
}
segBtns.forEach(b => b.addEventListener("click", () => { setCat(b.dataset.cat); vibrate(); }));
document.querySelectorAll("[data-go]").forEach(c => c.addEventListener("click", () => { setCat(c.dataset.go); goTab("menu"); }));
setCat("entradas");

/* Delegación: abrir detalle / agregar */
document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) { e.stopPropagation(); addToCart(add.dataset.add, 1); return; }
  const dish = e.target.closest("[data-dish]");
  if (dish) openDish(dish.dataset.dish);
});

/* Hoja inferior (sheet) */
const sheet = $("#sheet"), backdrop = $("#backdrop");
function openSheet(html) {
  $("#sheetContent").innerHTML = html;
  icons();
  sheet.scrollTop = 0;
  sheet.classList.add("show"); backdrop.classList.add("show");
}
function closeSheet() { sheet.classList.remove("show"); backdrop.classList.remove("show"); }
backdrop.addEventListener("click", closeSheet);

// Arrastrar hacia abajo para cerrar
let startY = null;
sheet.addEventListener("pointerdown", e => { if (sheet.scrollTop <= 0) { startY = e.clientY; sheet.style.transition = "none"; } });
window.addEventListener("pointermove", e => {
  if (startY === null) return;
  const dy = Math.max(0, e.clientY - startY);
  sheet.style.transform = `translateY(${dy}px)`;
});
window.addEventListener("pointerup", e => {
  if (startY === null) return;
  const dy = e.clientY - startY;
  sheet.style.transition = ""; sheet.style.transform = "";
  startY = null;
  if (dy > 120) closeSheet();
});

function openDish(name) {
  const x = ALL.find(d => d.n === name);
  let qty = 1;
  openSheet(`
    <div class="sheet-img"><img src="${IMG(x.i)}" alt="${x.n}"></div>
    <div class="sheet-body">
      <h2>${x.n}</h2>
      <p>${x.d} Preparado al momento con ingredientes de estación.</p>
      <div class="sheet-foot">
        <div class="stepper"><button class="press" id="sMinus"><i data-lucide="minus"></i></button><b id="sQty">1</b><button class="press" id="sPlus"><i data-lucide="plus"></i></button></div>
        <button class="btn-main press" id="sAdd">Agregar · <span id="sTotal">${money(x.p)}</span></button>
      </div>
    </div>`);
  const upd = () => { $("#sQty").textContent = qty; $("#sTotal").textContent = money(x.p * qty); };
  $("#sMinus").onclick = () => { qty = Math.max(1, qty - 1); upd(); vibrate(); };
  $("#sPlus").onclick = () => { qty = Math.min(20, qty + 1); upd(); vibrate(); };
  $("#sAdd").onclick = () => { addToCart(x.n, qty); closeSheet(); };
}

/* Carrito */
function addToCart(name, qty) {
  const found = cart.find(c => c.n === name);
  found ? found.q += qty : cart.push({ n: name, q: qty });
  updateBadge(true);
  renderCart();
  toast(`${name} agregado`);
  vibrate();
}
function updateBadge(pop) {
  const count = cart.reduce((a, c) => a + c.q, 0);
  const b = $("#badge");
  b.textContent = count;
  b.classList.toggle("show", count > 0);
  if (pop) { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); }
}
function renderCart() {
  const body = $("#cartBody");
  if (!cart.length) {
    body.innerHTML = `<div class="empty"><div class="empty-ic"><i data-lucide="shopping-bag"></i></div><h3>Tu pedido está vacío</h3><p>Explorá el menú y agregá tus platos favoritos.</p><button class="btn-main press" data-tab-go="menu">Ver menú</button></div>`;
  } else {
    const sub = cart.reduce((a, c) => a + ALL.find(d => d.n === c.n).p * c.q, 0);
    const fee = 1500;
    body.innerHTML = `<div class="list">${cart.map((c, i) => {
      const x = ALL.find(d => d.n === c.n);
      return `<div class="item" style="animation-delay:${i * 50}ms">
        <div class="ph"><img src="${IMG(x.i)}" alt="${x.n}"></div>
        <div class="t"><b>${x.n}</b><span class="price">${money(x.p * c.q)}</span></div>
        <div class="stepper"><button class="press" data-dec="${i}"><i data-lucide="${c.q === 1 ? "trash-2" : "minus"}"></i></button><b>${c.q}</b><button class="press" data-inc="${i}"><i data-lucide="plus"></i></button></div>
      </div>`;
    }).join("")}</div>
    <div class="summary">
      <div><span>Subtotal</span><span>${money(sub)}</span></div>
      <div><span>Servicio</span><span>${money(fee)}</span></div>
      <div class="total"><span>Total</span><span>${money(sub + fee)}</span></div>
    </div>
    <button class="btn-main press" id="checkout"><i data-lucide="credit-card"></i> Realizar pedido</button>`;
  }
  icons();
}
$("#cartBody").addEventListener("click", e => {
  const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]");
  if (inc) cart[inc.dataset.inc].q++;
  if (dec) { const i = +dec.dataset.dec; cart[i].q--; if (cart[i].q <= 0) cart.splice(i, 1); }
  if (inc || dec) { vibrate(); updateBadge(false); renderCart(); return; }
  if (e.target.closest("[data-tab-go]")) goTab("menu");
  if (e.target.closest("#checkout")) {
    openSheet(`<div class="success"><div class="check"><i data-lucide="check"></i></div><h2>¡Pedido confirmado!</h2><p>Estará listo en aproximadamente 25 minutos. Te avisamos cuando salga de la cocina.</p><button class="btn-main press" id="okBtn">Listo</button></div>`);
    $("#okBtn").onclick = closeSheet;
    cart = []; updateBadge(false); renderCart();
  }
});
renderCart();

/* Reservas */
const days = [...Array(10)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });
let selDate = 0, selTime = null, guests = 2;
$("#dates").innerHTML = days.map((d, i) => `
  <button class="date press ${i === 0 ? "on" : ""}" data-date="${i}">
    <small>${i === 0 ? "Hoy" : d.toLocaleDateString("es-AR", { weekday: "short" }).replace(".", "")}</small><b>${d.getDate()}</b>
  </button>`).join("");
$("#dates").addEventListener("click", e => {
  const b = e.target.closest("[data-date]"); if (!b) return;
  selDate = +b.dataset.date;
  document.querySelectorAll(".date").forEach(x => x.classList.toggle("on", x === b));
  vibrate();
});
const TIMES = ["12:30", "13:00", "13:30", "14:00", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];
const FULL = ["13:30", "21:00"];
$("#times").innerHTML = TIMES.map(t => `<button class="time press" data-time="${t}" ${FULL.includes(t) ? "disabled" : ""}>${t}</button>`).join("");
$("#times").addEventListener("click", e => {
  const b = e.target.closest("[data-time]"); if (!b || b.disabled) return;
  selTime = b.dataset.time;
  document.querySelectorAll(".time").forEach(x => x.classList.toggle("on", x === b));
  vibrate();
});
$("#gMinus").onclick = () => { guests = Math.max(1, guests - 1); $("#guests").textContent = guests; vibrate(); };
$("#gPlus").onclick = () => { guests = Math.min(12, guests + 1); $("#guests").textContent = guests; vibrate(); };

$("#confirmRes").addEventListener("click", () => {
  const name = $("#rName"), phone = $("#rPhone");
  let ok = true;
  [name, phone].forEach(inp => {
    const row = inp.closest(".row");
    row.classList.remove("err");
    if (!inp.value.trim()) { void row.offsetWidth; row.classList.add("err"); ok = false; }
  });
  if (!selTime) { toast("Elegí un horario"); ok = false; }
  if (!ok) { navigator.vibrate && navigator.vibrate([20, 40, 20]); return; }
  const d = days[selDate].toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  openSheet(`<div class="success"><div class="check"><i data-lucide="check"></i></div><h2>¡Mesa reservada!</h2><p>${name.value.trim().split(" ")[0]}, te esperamos el <b>${d}</b> a las <b>${selTime}</b> · ${guests} ${guests === 1 ? "persona" : "personas"}${$("#rSpecial").checked ? " · ocasión especial 🎉".replace(" 🎉", "") : ""}.</p><button class="btn-main press" id="okBtn">Listo</button></div>`);
  $("#okBtn").onclick = closeSheet;
  name.value = ""; phone.value = "";
});

/* Toast */
let toastTimer;
function toast(text) {
  $("#toastText").textContent = text;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 1800);
}

icons();
