// Plantilla de tienda de ropa (Stride District).
// La usan la plantilla completa y el recorte de la vitrina del Inicio:
// todo lo que busca en la página es opcional.
const IMG = "../../assets/img/vitrina/tienda/";
const $ = (id) => document.getElementById(id);

// Productos de "Novedades"
const products = [
  { name: "Air Jordan 1 Retro High OG", variant: "Shadow 2.0", price: 180, cat: "zapatillas", img: "p-jordan" },
  { name: "Adilette Slide", variant: "Negro", price: 70, cat: "zapatillas", img: "p-slide" },
  { name: "World Tour Hoodie", variant: "Verde", price: 110, cat: "buzos", img: "p-buzo-stussy" },
  { name: "New Balance X-90", variant: "Rosa", price: 150, cat: "zapatillas", img: "p-nb" },
  { name: "Essentials Hoodie", variant: "Negro", price: 90, cat: "buzos", img: "p-buzo-essentials" },
  { name: "Club Cap", variant: "Gris", price: 28, cat: "accesorios", img: "p-gorra" },
  { name: "Dunk Low Retro", variant: "Panda", price: 115, cat: "zapatillas", img: "p-dunk" },
  { name: "Graphic Tee Never Follow", variant: "Negro", price: 45, cat: "remeras", img: "p-remera-graphic" },
  { name: "Beanie District", variant: "Negro", price: 35, cat: "accesorios", img: "p-gorro" },
  { name: "Oversize Tee District", variant: "Blanco", price: 40, cat: "remeras", img: "p-remera-blanca" }
];
const CAT_TITLE = { all: "Novedades", zapatillas: "Zapatillas", buzos: "Buzos", remeras: "Remeras", accesorios: "Accesorios" };

const heartSvg = '<svg class="ic" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';

const grid = $("products");
const wish = new Set();
let cat = "all";
let query = "";

function renderProducts() {
  if (!grid) return;
  const list = products
    .map((p, i) => ({ ...p, i }))
    .filter((p) => (cat === "all" || p.cat === cat) && (!query || (p.name + " " + p.variant + " " + p.cat).toLowerCase().includes(query)));
  grid.innerHTML = list.length ? list.map((p) => `
    <article class="product reveal in" data-anim="up">
      <div class="p-top">
        <span class="tag-new">NUEVO</span>
        <button class="fav ${wish.has(p.i) ? "on" : ""}" data-i="${p.i}" aria-label="Agregar a favoritos">${heartSvg}</button>
      </div>
      <div class="p-img ph" style="background-image:url('${IMG + p.img}.webp')" role="img" aria-label="${p.name}"></div>
      <h3 class="p-name">${p.name}</h3>
      <p class="p-var">'${p.variant}'</p>
      <div class="p-bottom">
        <span class="p-price">$${p.price.toFixed(2)}</span>
        <button class="add" data-i="${p.i}" aria-label="Agregar al carrito">+</button>
      </div>
    </article>`).join("") : '<p class="no-results">No encontramos productos para tu búsqueda.</p>';
  grid.scrollTo({ left: 0 });
  const title = document.querySelector("#novedades .sec-title");
  if (title) title.textContent = query ? "Resultados" : CAT_TITLE[cat];
}
renderProducts();

// Contadores
let cart = 0;
const cartEl = $("cartCount");
const wishEl = $("wishCount");
const toastEl = $("toast");
let toastTimer;

function bump(el, value) {
  el.textContent = value;
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
}

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

grid && grid.addEventListener("click", (e) => {
  const fav = e.target.closest(".fav");
  const add = e.target.closest(".add");
  if (fav) {
    const i = +fav.dataset.i;
    wish.has(i) ? wish.delete(i) : wish.add(i);
    fav.classList.toggle("on");
    bump(wishEl, wish.size);
  }
  if (add) {
    cart++;
    bump(cartEl, cart);
    toast(`${products[add.dataset.i].name} agregado al carrito`);
  }
});

// Filtro por categoría (tarjetas, "Ver todo" y links del footer)
document.addEventListener("click", (e) => {
  const c = e.target.closest("[data-cat]");
  if (!c) return;
  e.preventDefault();
  cat = c.dataset.cat;
  query = "";
  const input = document.querySelector("#searchBar input");
  if (input) input.value = "";
  renderProducts();
  const sec = $("novedades");
  if (sec) sec.scrollIntoView({ behavior: "smooth" });
});

// Flechas de carruseles
document.querySelectorAll(".car-arrow").forEach((btn) => {
  btn.addEventListener("click", () => {
    const track = $(btn.dataset.target);
    const dir = btn.classList.contains("prev") ? -1 : 1;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (dir === 1 && track.scrollLeft >= maxScroll - 5) {
      track.scrollTo({ left: 0 });
    } else {
      track.scrollBy({ left: dir * track.clientWidth * 0.8 });
    }
  });
});

// Hero rotativo: cambia frase y foto
const slides = [
  ["Hecho para el", "movimiento", "hero-modelos", "app-hero-1"],
  ["Nacido en la", "calle", "hero-zapatilla", "app-hero-2"],
  ["Pisá con", "actitud", "hero-buzo", "app-hero-3"]
];
let slide = 0;
const heroTitle = $("heroTitle");
const heroIdx = $("heroIdx");
const heroBg = document.querySelector(".hero-bg");
// en celular usa las fotos verticales
const heroPic = (s) => s[matchMedia("(max-width: 600px)").matches ? 3 : 2];
slides.forEach((s) => { new Image().src = IMG + heroPic(s) + ".webp"; });
setInterval(() => {
  slide = (slide + 1) % slides.length;
  heroTitle.classList.add("fade");
  heroBg.classList.add("swap");
  setTimeout(() => {
    heroTitle.innerHTML = `<span class="white">${slides[slide][0]}</span><span class="orange">${slides[slide][1]}</span>`;
    heroBg.style.backgroundImage = `url('${IMG + heroPic(slides[slide])}.webp')`;
    heroIdx.textContent = String(slide + 1).padStart(2, "0");
    heroTitle.classList.remove("fade");
    heroBg.classList.remove("swap");
    runPager();
  }, 400);
}, 5000);

const pagerLine = document.querySelector(".hero-pager i");
function runPager() {
  pagerLine.classList.remove("run");
  void pagerLine.offsetWidth;
  pagerLine.classList.add("run");
}
setTimeout(runPager, 1400);

// Menú móvil y buscador (filtra las novedades mientras escribís)
$("burger").addEventListener("click", () => $("nav").classList.toggle("open"));
document.querySelectorAll("#nav a").forEach((a) =>
  a.addEventListener("click", () => $("nav").classList.remove("open"))
);
const searchBar = $("searchBar");
const searchInput = searchBar.querySelector("input");
$("searchBtn").addEventListener("click", () => {
  searchBar.classList.toggle("open");
  if (searchBar.classList.contains("open")) searchInput.focus();
});
searchInput.addEventListener("input", () => {
  query = searchInput.value.trim().toLowerCase();
  cat = "all";
  renderProducts();
});
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); $("novedades") && $("novedades").scrollIntoView({ behavior: "smooth" }); }
});

// Newsletter
const newsletter = $("newsletter");
newsletter && newsletter.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = e.target.querySelector("input");
  const msg = $("formMsg");
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
  input.classList.toggle("error", !ok);
  msg.style.color = ok ? "#d4ff3a" : "#ff6b6b";
  msg.textContent = ok ? "¡Listo! Ya sos parte del District." : "Ingresá un email válido.";
  if (ok) input.value = "";
});

if ($("year")) $("year").textContent = new Date().getFullYear();

// ===== Animaciones =====
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Marquesina de marcas (duplica el contenido para loop infinito)
const brands = document.querySelector(".brands");
if (brands) brands.innerHTML = '<div class="brands-track">' + brands.innerHTML + brands.innerHTML + "</div>";

// Revelado al scrollear: [contenedor observado, hijos animados, tipo, escalonado]
const groups = [
  [".sec-head", null, "up", 0],
  [".cat-grid", ".cat-card", "zoom-in", .1],
  [".promo-inner", ":scope > *", "zoom-out", .12],
  [".culture-text", null, "left", 0],
  ["#gallery", ".g-item", "zoom-in", .08],
  [".reviews", ".reviews-title, .review", "up", .12],
  [".brands", null, "up", 0],
  [".footer-grid", ".f-col", "up", .1]
];
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    en.target._kids.forEach((k) => k.classList.add("in"));
    io.unobserve(en.target);
  });
}, { threshold: 0.15 });

groups.forEach(([sel, kids, anim, step]) => {
  document.querySelectorAll(sel).forEach((box) => {
    const items = kids ? [...box.querySelectorAll(kids)] : [box];
    items.forEach((el, i) => {
      el.classList.add("reveal");
      el.dataset.anim = anim;
      el.style.setProperty("--d", (i * step).toFixed(2) + "s");
    });
    box._kids = items;
    io.observe(box);
  });
});

// Barra de progreso, header compacto y parallax del hero
const progress = document.createElement("div");
progress.className = "progress";
document.body.prepend(progress);
const header = $("header");
let ticking = false;
addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    header.classList.toggle("scrolled", y > 40);
    if (!reduce && y < innerHeight) heroBg.style.translate = "0 " + y * 0.35 + "px";
    ticking = false;
  });
}, { passive: true });

// Inclinación 3D de productos
if (grid && !reduce && matchMedia("(hover: hover)").matches) {
  grid.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".product");
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.setProperty("--ry", x * 14 + "deg");
    card.style.setProperty("--rx", -y * 14 + "deg");
  });
  grid.addEventListener("mouseout", (e) => {
    const card = e.target.closest(".product");
    if (card && !card.contains(e.relatedTarget)) {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    }
  });
}
