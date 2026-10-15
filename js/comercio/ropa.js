// ===== Configuración =====
const FREE_SHIP = 80000;
const SHIP_COST = 6500;
const SIZE_SETS = {
  ropa: ["XS", "S", "M", "L", "XL"],
  calzado: ["36", "37", "38", "39", "40", "41", "42", "43"],
  unico: ["Único"],
};

// ===== Productos (editá acá) =====
const PRODUCTS = [
  { id: 1, brand: "Bruma", name: "Vestido Midi Lino", cat: "mujer", sizes: "ropa", price: 68000, tag: "Nuevo",
    desc: "Lino lavado, escote en V y tiras regulables.",
    colors: [{ n: "Crudo", h: "#e6ddcb" }, { n: "Negro", h: "#232220" }, { n: "Terracota", h: "#b9694a" }], out: ["XL"] },
  { id: 2, brand: "Oficio", name: "Blazer Recto", cat: "mujer", sizes: "ropa", price: 112000, old: 134000,
    desc: "Sastrería en lana fría, forrería completa y botón único.",
    colors: [{ n: "Gris topo", h: "#6f6862" }, { n: "Negro", h: "#232220" }, { n: "Camel", h: "#b48a5e" }], out: ["XS"] },
  { id: 3, brand: "Norte", name: "Camisa Oxford", cat: "hombre", sizes: "ropa", price: 46000, tag: "Más vendido",
    desc: "Oxford de algodón 100%, cuello abotonado, calce regular.",
    colors: [{ n: "Celeste", h: "#a9bdd3" }, { n: "Blanco", h: "#f2f0ea" }, { n: "Rayado", h: "#8c9fb5" }], out: [] },
  { id: 4, brand: "Vértice", name: "Jean Recto Rígido", cat: "hombre", sizes: "ropa", price: 58000,
    desc: "Denim 13 oz sin elastano, tiro medio y pierna recta.",
    colors: [{ n: "Índigo", h: "#3a4a6b" }, { n: "Azul lavado", h: "#8aa0bb" }, { n: "Negro", h: "#2a2a2c" }], out: ["XS"] },
  { id: 5, brand: "Paso", name: "Zapatilla Urbana", cat: "calzado", sizes: "calzado", price: 89000, tag: "Nuevo",
    desc: "Capellada de cuero, suela de caucho vulcanizado.",
    colors: [{ n: "Blanco", h: "#f2f0ea" }, { n: "Negro", h: "#232220" }, { n: "Verde", h: "#3d4a3d" }], out: ["36", "43"] },
  { id: 6, brand: "Paso", name: "Bota Chelsea", cat: "calzado", sizes: "calzado", price: 124000, old: 145000,
    desc: "Cuero engrasado, elásticos laterales y suela track.",
    colors: [{ n: "Marrón", h: "#5b3b2a" }, { n: "Negro", h: "#232220" }], out: ["37", "42"] },
  { id: 7, brand: "Oficio", name: "Bolso Tote Cuero", cat: "accesorios", sizes: "unico", price: 96000,
    desc: "Cuero vacuno curtido vegetal, bolsillo interno con cierre.",
    colors: [{ n: "Suela", h: "#a26b3f" }, { n: "Negro", h: "#232220" }], out: [] },
  { id: 8, brand: "Norte", name: "Bufanda Lana", cat: "accesorios", sizes: "unico", price: 28000,
    desc: "Lana merino tejida, 180 × 30 cm.",
    colors: [{ n: "Gris melange", h: "#b5b3ae" }, { n: "Bordó", h: "#6e2e33" }, { n: "Crudo", h: "#e4dccb" }], out: [] },
];

// ===== Helpers =====
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = n => "$" + Math.round(n).toLocaleString("es-AR");
const findP = id => PRODUCTS.find(p => p.id === id);
const sizesOf = p => SIZE_SETS[p.sizes];

// ===== Estado =====
let cart = JSON.parse(localStorage.getItem("plaza_cart") || "[]");
const cardColor = {};
let filter = "all";
let modal = { id: null, color: 0, size: null, qty: 1 };
const saveCart = () => localStorage.setItem("plaza_cart", JSON.stringify(cart));

// ===== Colección =====
function renderGrid() {
  const list = PRODUCTS.filter(p => filter === "all" || p.cat === filter);
  $("#productGrid").innerHTML = list.map(p => {
    const ci = cardColor[p.id] ?? 0, c = p.colors[ci];
    const tag = p.old ? `<span class="tag tag-solid">-${Math.round((1 - p.price / p.old) * 100)}%</span>`
              : p.tag ? `<span class="tag tag-neutral">${p.tag}</span>` : "";
    return `
    <article class="card-p">
      <div class="card-media" data-open="${p.id}">
        ${tag}
        <div class="grayscale"><div class="ph"><span>foto ${p.name.toLowerCase()} — ${c.n.toLowerCase()}</span></div></div>
        <div class="quick" onclick="event.stopPropagation()">
          <span class="quick-label">Agregar rápido — ${c.n}</span>
          ${sizesOf(p).map(s => `<button data-quick="${p.id}" data-size="${s}" ${p.out.includes(s) ? "disabled" : ""}>${s}</button>`).join("")}
        </div>
      </div>
      <div class="card-body-p">
        <span class="brand">${p.brand}</span>
        <div class="card-row">
          <span class="card-name" data-open="${p.id}">${p.name}</span>
          <span class="card-price">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ""}</span>
        </div>
        <div class="swatches">
          ${p.colors.map((col, i) => `<button class="sw ${i === ci ? "active" : ""}" style="background:${col.h}" title="${col.n}" aria-label="${col.n}" data-sw="${p.id}" data-i="${i}"></button>`).join("")}
        </div>
        <span class="card-meta-p">${c.n} · ${p.colors.length} colores</span>
      </div>
    </article>`;
  }).join("");
}

$("#productGrid").addEventListener("click", e => {
  const sw = e.target.closest("[data-sw]");
  if (sw) { cardColor[sw.dataset.sw] = +sw.dataset.i; renderGrid(); return; }
  const q = e.target.closest("[data-quick]");
  if (q) { const id = +q.dataset.quick; addToCart(id, cardColor[id] ?? 0, q.dataset.size, 1); return; }
  const o = e.target.closest("[data-open]");
  if (o) openModal(+o.dataset.open);
});

function setFilter(f) {
  filter = f;
  $$("#filters input").forEach(i => (i.checked = i.value === f));
  renderGrid();
}
$("#filters").addEventListener("change", e => setFilter(e.target.value));
$$(".cat").forEach(c => c.addEventListener("click", () => {
  setFilter(c.dataset.filter);
  window.scrollTo({ top: $("#coleccion").offsetTop - 60, behavior: "smooth" });
}));

// ===== Vista rápida =====
function openModal(id) {
  const p = findP(id);
  const sz = sizesOf(p);
  modal = { id, color: cardColor[id] ?? 0, size: sz.length === 1 ? sz[0] : null, qty: 1 };
  $("#modalBrand").textContent = p.brand;
  $("#modalName").textContent = p.name;
  $("#modalPrice").innerHTML = money(p.price) + (p.old ? `<s>${money(p.old)}</s>` : "");
  $("#modalDesc").textContent = p.desc;
  $("#modalHint").textContent = "";
  $("#modalSizeGuide").classList.toggle("hidden", p.sizes === "unico");
  renderModal();
  show("#modal");
}
function renderModal() {
  const p = findP(modal.id), c = p.colors[modal.color];
  $("#modalImg span").textContent = `foto ${p.name.toLowerCase()} — ${c.n.toLowerCase()}`;
  $("#modalColorName").textContent = c.n;
  $("#modalColors").innerHTML = p.colors.map((col, i) =>
    `<button class="sw ${i === modal.color ? "active" : ""}" style="background:${col.h}" title="${col.n}" aria-label="${col.n}" data-i="${i}"></button>`).join("");
  $("#modalSizes").innerHTML = sizesOf(p).map(s =>
    `<button class="size ${modal.size === s ? "active" : ""}" data-s="${s}" ${p.out.includes(s) ? "disabled title='Sin stock'" : ""}>${s}</button>`).join("");
  $("#qtyVal").textContent = modal.qty;
}
$("#modalColors").addEventListener("click", e => { const b = e.target.closest(".sw"); if (b) { modal.color = +b.dataset.i; renderModal(); } });
$("#modalSizes").addEventListener("click", e => {
  const b = e.target.closest(".size"); if (!b || b.disabled) return;
  modal.size = b.dataset.s; $("#modalHint").textContent = ""; renderModal();
});
$("#qtyMinus").onclick = () => { modal.qty = Math.max(1, modal.qty - 1); renderModal(); };
$("#qtyPlus").onclick = () => { modal.qty = Math.min(10, modal.qty + 1); renderModal(); };

function modalAdd() {
  if (!modal.size) {
    $("#modalHint").textContent = "Elegí un talle para continuar.";
    const r = $("#modalSizes"); r.classList.remove("shake"); void r.offsetWidth; r.classList.add("shake");
    return false;
  }
  addToCart(modal.id, modal.color, modal.size, modal.qty);
  return true;
}
$("#modalAdd").onclick = () => { if (modalAdd()) hideAll(); };
$("#modalBuyNow").onclick = () => { if (modalAdd()) { hide("#modal"); openCart("checkout"); } };
$("#modalSizeGuide").onclick = () => {
  const p = findP(modal.id);
  setGuide(p.sizes === "calzado" ? "calzado" : "ropa");
  hideAll();
};
$("#closeModal").onclick = hideAll;

// ===== Carrito =====
function addToCart(id, color, size, qty) {
  const key = `${id}-${color}-${size}`;
  const item = cart.find(i => i.key === key);
  if (item) item.qty = Math.min(10, item.qty + qty);
  else cart.push({ key, id, color, size, qty });
  saveCart(); renderCart();
  const p = findP(id);
  toast(`Agregado: ${p.name} — ${p.colors[color].n} — ${size}`);
  const cc = $("#cartCount"); cc.classList.remove("bump"); void cc.offsetWidth; cc.classList.add("bump");
}
const subtotal = () => cart.reduce((s, i) => s + findP(i.id).price * i.qty, 0);

function renderCart() {
  cart = cart.filter(i => findP(i.id));
  $("#cartCount").textContent = cart.reduce((s, i) => s + i.qty, 0);
  const sub = subtotal();
  $("#cartList").innerHTML = cart.map(i => {
    const p = findP(i.id), c = p.colors[i.color];
    return `<li class="cart-item">
      <div class="grayscale"><div class="ph"></div></div>
      <div>
        <div class="ci-brand">${p.brand}</div>
        <div class="ci-name">${p.name}</div>
        <div class="ci-var">${c.n} · Talle ${i.size}</div>
        <div class="qty-sm"><button data-dec="${i.key}" aria-label="Restar">−</button><span>${i.qty}</span><button data-inc="${i.key}" aria-label="Sumar">+</button></div>
      </div>
      <div class="ci-right">${money(p.price * i.qty)}<button class="ci-remove" data-rm="${i.key}">Quitar</button></div>
    </li>`;
  }).join("");
  const empty = !cart.length;
  $("#cartEmpty").classList.toggle("hidden", !empty);
  $("#cartFoot").classList.toggle("hidden", empty);
  $("#cartList").classList.toggle("hidden", empty);
  $("#subtotal").textContent = money(sub);
  const left = FREE_SHIP - sub;
  $("#shipMsg").innerHTML = left > 0 ? `Te faltan <strong>${money(left)}</strong> para el envío gratis` : `<strong>Tenés envío gratis</strong>`;
  $("#shipFill").style.width = Math.min(100, (sub / FREE_SHIP) * 100) + "%";
  renderSummary();
}
$("#cartList").addEventListener("click", e => {
  const t = e.target, k = t.dataset.inc || t.dataset.dec || t.dataset.rm;
  if (!k) return;
  const item = cart.find(i => i.key === k);
  if (t.dataset.inc) item.qty = Math.min(10, item.qty + 1);
  if (t.dataset.dec) item.qty--;
  if (t.dataset.rm || item.qty < 1) cart = cart.filter(i => i.key !== k);
  saveCart(); renderCart();
});

// ===== Checkout =====
function renderSummary() {
  const sub = subtotal();
  const ship = sub >= FREE_SHIP || sub === 0 ? 0 : SHIP_COST;
  const pay = $("#viewCheckout").querySelector("input[name=pay]:checked")?.value;
  const disc = pay === "transfer" ? sub * 0.1 : 0;
  $("#sumSub").textContent = money(sub);
  $("#sumShip").textContent = ship ? money(ship) : "Gratis";
  $("#sumDiscRow").classList.toggle("hidden", !disc);
  $("#sumDisc").textContent = "−" + money(disc);
  $("#sumTotal").textContent = money(sub + ship - disc);
}
$("#viewCheckout").addEventListener("change", renderSummary);

function setView(v) {
  $("#viewCart").classList.toggle("hidden", v !== "cart");
  $("#viewCheckout").classList.toggle("hidden", v !== "checkout");
  $("#viewSuccess").classList.toggle("hidden", v !== "success");
  $$(".step").forEach(s => s.classList.toggle("active", s.dataset.step === v || (v === "success" && s.dataset.step === "checkout")));
}
function openCart(view = "cart") {
  if (view === "checkout" && !cart.length) view = "cart";
  setView(view); show("#drawer");
}
$("#openCart").onclick = () => openCart();
$("#closeCart").onclick = hideAll;
$("#toCheckout").onclick = () => setView("checkout");
$("#backToCart").onclick = () => setView("cart");
$("#emptyLink").onclick = hideAll;
$("#viewCheckout").addEventListener("submit", e => {
  e.preventDefault();
  $("#orderId").textContent = "#PZ-" + Math.floor(10000 + Math.random() * 90000);
  cart = []; saveCart(); renderCart();
  e.target.reset(); renderSummary();
  setView("success");
});
$("#keepShopping").onclick = () => { hideAll(); setView("cart"); };

// ===== Overlay / toast =====
function show(sel) { $(sel).classList.add("show"); $("#overlay").classList.add("show"); }
function hide(sel) { $(sel).classList.remove("show"); }
function hideAll() { hide("#modal"); hide("#drawer"); $("#overlay").classList.remove("show"); }
$("#overlay").onclick = hideAll;
document.addEventListener("keydown", e => { if (e.key === "Escape") hideAll(); });
let toastT;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2200);
}

// ===== Guía de talles =====
function setGuide(g) {
  $$("#guideTabs input").forEach(i => (i.checked = i.value === g));
  $("#fitRopa").classList.toggle("hidden", g !== "ropa");
  $("#fitCalzado").classList.toggle("hidden", g !== "calzado");
  $("#tableRopa").classList.toggle("hidden", g !== "ropa");
  $("#tableCalzado").classList.toggle("hidden", g !== "calzado");
}
$("#guideTabs").addEventListener("change", e => setGuide(e.target.value));

const highlight = (table, idx) => $$(`#${table} tbody tr`).forEach((tr, i) => tr.classList.toggle("hl", i === idx));

$("#fitBtn").onclick = () => {
  const h = +$("#fitHeight").value, c = +$("#fitChest").value;
  if (!h && !c) { $("#fitResult").textContent = "Ingresá al menos una medida."; return; }
  const chestMax = [86, 92, 98, 104, 999], heightMax = [162, 168, 174, 180, 999];
  const idx = Math.max(c ? chestMax.findIndex(m => c <= m) : 0, h ? heightMax.findIndex(m => h <= m) : 0);
  $("#fitResult").innerHTML = `Tu talle: <strong>${SIZE_SETS.ropa[idx]}</strong>`;
  highlight("tableRopa", idx);
};
$("#fitFootBtn").onclick = () => {
  const f = +$("#fitFoot").value;
  if (!f) { $("#fitFootResult").textContent = "Ingresá el largo de tu pie."; return; }
  const lens = [23.5, 24.2, 24.8, 25.5, 26.2, 26.8, 27.5, 28.2];
  let idx = lens.findIndex(l => f <= l); if (idx < 0) idx = lens.length - 1;
  $("#fitFootResult").innerHTML = `Tu número: <strong>${SIZE_SETS.calzado[idx]}</strong>`;
  highlight("tableCalzado", idx);
};

// ===== Init =====
renderGrid();
renderCart();
