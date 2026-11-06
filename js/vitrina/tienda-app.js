// ===== Datos =====
const IMG = "../../assets/img/vitrina/tienda/";
const products = [
  { id: 1, name: "Air Jordan 1 Retro High OG", variant: "Shadow 2.0", price: 180, cat: "zapatillas", img: "p-jordan", sizes: ["39", "40", "41", "42", "43", "44", "45", "46"], isNew: true },
  { id: 2, name: "Adilette Slide", variant: "Negro", price: 70, cat: "zapatillas", img: "p-slide", sizes: ["38", "39", "40", "41", "42", "43", "44", "45"], isNew: true },
  { id: 3, name: "World Tour Hoodie", variant: "Verde", price: 110, cat: "buzos", img: "p-buzo-stussy", sizes: ["XS", "S", "M", "L", "XL", "XXL"], isNew: true },
  { id: 4, name: "New Balance X-90", variant: "Rosa", price: 150, cat: "zapatillas", img: "p-nb", sizes: ["39", "40", "41", "42", "43", "44", "45", "46"], isNew: true },
  { id: 5, name: "Essentials Hoodie", variant: "Negro", price: 90, cat: "buzos", img: "p-buzo-essentials", sizes: ["XS", "S", "M", "L", "XL", "XXL"], isNew: true },
  { id: 6, name: "Club Cap", variant: "Gris", price: 28, cat: "accesorios", img: "p-gorra", sizes: ["Única"], isNew: true },
  { id: 7, name: "Dunk Low Retro", variant: "Panda", price: 115, cat: "zapatillas", img: "p-dunk", sizes: ["39", "40", "41", "42", "43", "44", "45", "46"] },
  { id: 8, name: "Graphic Tee Never Follow", variant: "Negro", price: 45, cat: "remeras", img: "p-remera-graphic", sizes: ["S", "M", "L", "XL"] },
  { id: 9, name: "Beanie District", variant: "Negro", price: 35, cat: "accesorios", img: "p-gorro", sizes: ["Única"] },
  { id: 10, name: "Oversize Tee District", variant: "Blanco", price: 40, cat: "remeras", img: "p-remera-blanca", sizes: ["S", "M", "L", "XL"] }
];
const imgStyle = (p) => `style="background-image:url('${IMG}${p.img}.webp')"`;
const byId = (id) => products.find((p) => p.id === id);
const money = (n) => "$" + n.toFixed(2);
const haptic = () => navigator.vibrate && navigator.vibrate(8);

const HEART = '<svg class="ic" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
const MINUS = '<svg class="ic" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>';
const PLUS = '<svg class="ic" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
const TRASH = '<svg class="ic" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>';

// ===== Estado (se guarda en el dispositivo) =====
const load = (k) => { try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch (e) { return []; } };
let cart = load("sd_cart");
let favs = new Set(load("sd_favs"));
const save = () => {
  try {
    localStorage.setItem("sd_cart", JSON.stringify(cart));
    localStorage.setItem("sd_favs", JSON.stringify([...favs]));
  } catch (e) {}
};

// ===== Tarjetas de producto =====
function card(p, i) {
  return `<article class="product" data-id="${p.id}" style="--d:${(i * 0.04).toFixed(2)}s">
    ${p.isNew ? '<span class="p-new">NUEVO</span>' : ""}
    <button class="p-fav ${favs.has(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="Favorito">${HEART}</button>
    <div class="p-img ph" ${imgStyle(p)}></div>
    <h4 class="p-name">${p.name}</h4>
    <span class="p-var">${p.variant}</span>
    <span class="p-price">${money(p.price)}</span>
  </article>`;
}

// Inicio: novedades filtradas por chip
let homeCat = "all";
function renderHome() {
  const list = products.filter((p) => homeCat === "all" || p.cat === homeCat);
  document.getElementById("newList").innerHTML = list.map(card).join("");
}

// Buscar
let searchCat = "all";
const searchInput = document.getElementById("searchInput");
function renderSearch() {
  const q = searchInput.value.trim().toLowerCase();
  const list = products.filter((p) => {
    const catOk = searchCat === "all" || p.cat === searchCat || (searchCat === "ropa" && (p.cat === "buzos" || p.cat === "remeras"));
    const qOk = !q || (p.name + " " + p.variant + " " + p.cat).toLowerCase().includes(q);
    return catOk && qOk;
  });
  document.getElementById("searchGrid").innerHTML = list.map(card).join("");
  document.getElementById("resultCount").textContent = list.length + (list.length === 1 ? " producto" : " productos");
}

// Favoritos
function renderFavs() {
  const list = products.filter((p) => favs.has(p.id));
  document.getElementById("favGrid").innerHTML = list.map(card).join("");
  document.getElementById("favEmpty").classList.toggle("show", !list.length);
}

// Carrito
function renderCart() {
  const listEl = document.getElementById("cartList");
  const count = cart.reduce((a, c) => a + c.qty, 0);
  const sub = cart.reduce((a, c) => a + byId(c.id).price * c.qty, 0);
  const ship = sub >= 150 || sub === 0 ? 0 : 9.99;

  listEl.innerHTML = cart.map((c, i) => {
    const p = byId(c.id);
    return `<div class="cart-item" data-i="${i}">
      <div class="ci-img ph" ${imgStyle(p)}></div>
      <div class="ci-info"><b>${p.name}</b><small>${p.variant} · Talle ${c.size}</small><div class="p-price">${money(p.price * c.qty)}</div></div>
      <div class="stepper">
        <button data-step="-1" data-i="${i}" aria-label="Restar">${c.qty === 1 ? TRASH : MINUS}</button>
        <span>${c.qty}</span>
        <button data-step="1" data-i="${i}" aria-label="Sumar">${PLUS}</button>
      </div>
    </div>`;
  }).join("");

  const has = cart.length > 0;
  listEl.style.display = has ? "" : "none";
  document.getElementById("cartSummary").style.display = has ? "" : "none";
  document.getElementById("cartEmpty").classList.toggle("show", !has);
  document.getElementById("checkoutBar").classList.toggle("show", has && current === "cart");
  document.getElementById("cart").classList.toggle("has-items", has);
  document.getElementById("sumSub").textContent = money(sub);
  document.getElementById("sumShip").textContent = ship ? money(ship) : "Gratis";
  document.getElementById("sumTotal").textContent = money(sub + ship);
  document.getElementById("checkoutTotal").textContent = "· " + money(sub + ship);
  document.getElementById("shipNote").textContent = ship ? `Te faltan ${money(150 - sub)} para el envío gratis.` : "Tu pedido tiene envío gratis.";

  const badge = document.getElementById("cartBadge");
  badge.textContent = count;
  badge.classList.toggle("show", count > 0);
}

function bumpBadge() {
  const b = document.getElementById("cartBadge");
  b.classList.remove("bump");
  void b.offsetWidth;
  b.classList.add("bump");
}

function renderAll() { renderHome(); renderSearch(); renderFavs(); renderCart(); }

// ===== Navegación por pestañas =====
let current = "home";
function go(tab) {
  if (!document.getElementById(tab)) return;
  if (tab === current) {
    document.getElementById(tab).scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  haptic();
  document.getElementById(current).classList.remove("active");
  document.getElementById(tab).classList.add("active");
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("on", t.dataset.tab === tab));
  current = tab;
  if (tab === "favs") renderFavs();
  document.getElementById("checkoutBar").classList.toggle("show", tab === "cart" && cart.length > 0);
}
document.getElementById("tabbar").addEventListener("click", (e) => {
  const t = e.target.closest(".tab");
  if (t) go(t.dataset.tab);
});

// Título grande que colapsa al scrollear
document.querySelectorAll(".screen").forEach((s) => {
  const bar = s.querySelector(".navbar");
  s.addEventListener("scroll", () => bar.classList.toggle("compact", s.scrollTop > 36), { passive: true });
});

// ===== Clicks globales =====
document.getElementById("device").addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]");
  if (fav) {
    e.stopPropagation();
    toggleFav(+fav.dataset.fav);
    return;
  }
  const prod = e.target.closest(".product");
  if (prod) return openProduct(+prod.dataset.id);

  const goto = e.target.closest("[data-goto]");
  if (goto) return go(goto.dataset.goto);

  const cat = e.target.closest("[data-search]");
  if (cat) {
    const map = { zapatillas: "zapatillas", buzos: "ropa", remeras: "ropa", accesorios: "accesorios" };
    setSeg(map[cat.dataset.search]);
    searchInput.value = cat.dataset.search === "buzos" || cat.dataset.search === "remeras" ? cat.dataset.search.slice(0, -1) : "";
    renderSearch();
    return go("search");
  }

  const step = e.target.closest("[data-step]");
  if (step) {
    haptic();
    const i = +step.dataset.i;
    cart[i].qty += +step.dataset.step;
    if (cart[i].qty <= 0) {
      const row = step.closest(".cart-item");
      row.classList.add("removing");
      setTimeout(() => { cart.splice(i, 1); save(); renderCart(); }, 300);
      return;
    }
    save();
    renderCart();
  }
});

function toggleFav(id) {
  haptic();
  if (favs.has(id)) favs.delete(id);
  else { favs.add(id); notify("Guardado en favoritos", byId(id).name); }
  save();
  document.querySelectorAll(`[data-fav="${id}"]`).forEach((b) => b.classList.toggle("on", favs.has(id)));
  if (current === "favs") renderFavs();
}

// Chips de inicio
document.getElementById("chips").addEventListener("click", (e) => {
  const c = e.target.closest(".chip");
  if (!c) return;
  haptic();
  document.querySelectorAll(".chip").forEach((x) => x.classList.toggle("on", x === c));
  homeCat = c.dataset.cat;
  renderHome();
  document.getElementById("newList").scrollTo({ left: 0 });
});

// Control segmentado
const segOpts = [...document.querySelectorAll(".seg-opt")];
function setSeg(cat) {
  searchCat = cat;
  const i = segOpts.findIndex((o) => o.dataset.cat === cat);
  segOpts.forEach((o, j) => o.classList.toggle("on", j === i));
  document.getElementById("segThumb").style.translate = i * 100 + "% 0";
}
document.getElementById("seg").addEventListener("click", (e) => {
  const o = e.target.closest(".seg-opt");
  if (!o) return;
  haptic();
  setSeg(o.dataset.cat);
  renderSearch();
});

// Buscador
const searchRow = document.querySelector(".search-row");
searchInput.addEventListener("focus", () => searchRow.classList.add("focus"));
searchInput.addEventListener("blur", () => !searchInput.value && searchRow.classList.remove("focus"));
searchInput.addEventListener("input", renderSearch);
document.getElementById("searchCancel").addEventListener("click", () => {
  searchInput.value = "";
  searchInput.blur();
  searchRow.classList.remove("focus");
  renderSearch();
});

// ===== Hoja de producto =====
const device = document.getElementById("device");
const sheetWrap = document.getElementById("sheetWrap");
const sheet = document.getElementById("sheet");
const sheetBody = document.getElementById("sheetBody");
let selSize = null;

function openSheet(html) {
  sheetBody.innerHTML = html;
  sheetBody.scrollTop = 0;
  sheetWrap.classList.add("open");
  device.classList.add("sheet-open");
}
function closeSheet() {
  sheetWrap.classList.remove("open");
  device.classList.remove("sheet-open");
  sheet.style.translate = "";
}
document.getElementById("backdrop").addEventListener("click", closeSheet);

function openProduct(id) {
  haptic();
  const p = byId(id);
  selSize = p.sizes.length === 1 ? p.sizes[0] : null;
  openSheet(`
    <div class="sd-img ph" ${imgStyle(p)}></div>
    <div class="sd-top">
      <div><h2>${p.name}</h2><p>${p.variant}</p></div>
      <span class="sd-price">${money(p.price)}</span>
    </div>
    <div class="sd-label"><span>Talle</span></div>
    <div class="sizes" id="sizes">
      ${p.sizes.map((s) => `<button class="size ${s === selSize ? "on" : ""}" data-size="${s}">${s}</button>`).join("")}
    </div>
    <p class="sd-desc">100% original. Envío gratis desde $150 y cambios sin costo dentro de los 14 días.</p>
    <div class="sd-actions">
      <button class="sd-fav ${favs.has(id) ? "on" : ""}" data-fav="${id}" aria-label="Favorito">${HEART}</button>
      <button class="btn-primary tap" id="addBtn" data-add="${id}">Agregar al carrito</button>
    </div>`);
}

sheetBody.addEventListener("click", (e) => {
  const s = e.target.closest(".size");
  if (s) {
    haptic();
    selSize = s.dataset.size;
    sheetBody.querySelectorAll(".size").forEach((x) => x.classList.toggle("on", x === s));
    return;
  }
  const fav = e.target.closest("[data-fav]");
  if (fav) return toggleFav(+fav.dataset.fav);

  const add = e.target.closest("[data-add]");
  if (add) {
    if (!selSize) {
      const sz = document.getElementById("sizes");
      sz.classList.remove("shake");
      void sz.offsetWidth;
      sz.classList.add("shake");
      navigator.vibrate && navigator.vibrate([10, 40, 10]);
      return;
    }
    const id = +add.dataset.add;
    const found = cart.find((c) => c.id === id && c.size === selSize);
    found ? found.qty++ : cart.push({ id, size: selSize, qty: 1 });
    save();
    renderCart();
    bumpBadge();
    closeSheet();
    notify("Agregado al carrito", byId(id).name + " · Talle " + selSize);
    return;
  }
  if (e.target.closest("[data-close]")) closeSheet();
  if (e.target.closest("[data-done]")) { closeSheet(); go("home"); }
});

// Arrastrar la hoja hacia abajo para cerrar
let dragY = null, dragDelta = 0;
sheet.addEventListener("pointerdown", (e) => {
  if (sheetBody.scrollTop > 0 && !e.target.closest(".grabber")) return;
  dragY = e.clientY;
  dragDelta = 0;
});
addEventListener("pointermove", (e) => {
  if (dragY === null) return;
  dragDelta = Math.max(0, e.clientY - dragY);
  if (dragDelta > 4) {
    sheet.classList.add("dragging");
    sheet.style.translate = "0 " + dragDelta + "px";
  }
});
addEventListener("pointerup", () => {
  if (dragY === null) return;
  sheet.classList.remove("dragging");
  if (dragDelta > 120) closeSheet();
  else sheet.style.translate = "";
  dragY = null;
});

// Checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {
  haptic();
  const total = document.getElementById("sumTotal").textContent;
  cart = [];
  save();
  renderCart();
  openSheet(`
    <div class="confirm">
      <div class="check"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
      <h2>¡Pedido confirmado!</h2>
      <p>Pagaste ${total}. Te avisamos cuando tu pedido salga en camino.</p>
      <button class="btn-primary block tap" data-done>Seguir comprando</button>
    </div>`);
});

// ===== Notificación =====
const banner = document.getElementById("banner");
let bannerTimer;
function notify(title, text) {
  document.getElementById("bannerTitle").textContent = title;
  document.getElementById("bannerText").textContent = text;
  banner.classList.add("show");
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => banner.classList.remove("show"), 2600);
}
banner.addEventListener("click", () => banner.classList.remove("show"));
document.getElementById("bellBtn").addEventListener("click", () => notify("Nuevo drop este viernes", "Jordan 1 'Shadow 2.0' llega a las 10:00"));

// Newsletter
document.getElementById("newsSwitch").addEventListener("change", (e) => {
  haptic();
  if (e.target.checked) notify("Newsletter activado", "Vas a recibir lanzamientos y ofertas exclusivas.");
});

// ===== Carrusel hero =====
const heroCar = document.getElementById("heroCar");
const dots = [...document.querySelectorAll("#heroDots i")];
let heroIdx = 0;
heroCar.addEventListener("scroll", () => {
  const i = Math.round(heroCar.scrollLeft / heroCar.clientWidth);
  if (i !== heroIdx) {
    heroIdx = i;
    dots.forEach((d, j) => d.classList.toggle("on", j === i));
  }
}, { passive: true });
setInterval(() => {
  if (current !== "home" || sheetWrap.classList.contains("open")) return;
  const next = (heroIdx + 1) % dots.length;
  heroCar.scrollTo({ left: next * (heroCar.clientWidth + 12), behavior: "smooth" });
}, 4500);

// ===== Reloj y saludo =====
function tick() {
  const d = new Date();
  document.getElementById("clock").textContent = d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
  const h = d.getHours();
  document.getElementById("greeting").textContent = h < 12 ? "Buen día" : h < 20 ? "Buenas tardes" : "Buenas noches";
}
tick();
setInterval(tick, 30000);

renderAll();
