// ===== Configuración =====
const WHATSAPP = "5491100000000";   // número del local (sin + ni espacios)
const FREE_SHIPPING = 15000;        // envío gratis desde este monto

// ===== Productos (editá esta lista) =====
// img: ruta a la foto (ej: "img/leche.jpg"). Si está vacía se muestra un placeholder.
const PRODUCTS = [
  { id: 1,  name: "Leche entera",        unit: "1 L",       cat: "Lácteos",    price: 1350, img: "" },
  { id: 2,  name: "Yogur natural",       unit: "500 g",     cat: "Lácteos",    price: 1800, img: "" },
  { id: 3,  name: "Queso cremoso",       unit: "500 g",     cat: "Lácteos",    price: 4900, old: 5600, img: "" },
  { id: 4,  name: "Manteca",             unit: "200 g",     cat: "Lácteos",    price: 2300, img: "" },
  { id: 5,  name: "Pan francés",         unit: "1 kg",      cat: "Panadería",  price: 2800, img: "" },
  { id: 6,  name: "Medialunas",          unit: "x 6",       cat: "Panadería",  price: 3200, img: "" },
  { id: 7,  name: "Manzanas rojas",      unit: "1 kg",      cat: "Frutas y verduras", price: 2100, img: "" },
  { id: 8,  name: "Bananas",             unit: "1 kg",      cat: "Frutas y verduras", price: 1900, old: 2400, img: "" },
  { id: 9,  name: "Tomates",             unit: "1 kg",      cat: "Frutas y verduras", price: 2600, img: "" },
  { id: 10, name: "Papas",               unit: "2 kg",      cat: "Frutas y verduras", price: 2200, img: "" },
  { id: 11, name: "Arroz largo fino",    unit: "1 kg",      cat: "Almacén",    price: 1700, img: "" },
  { id: 12, name: "Fideos spaghetti",    unit: "500 g",     cat: "Almacén",    price: 1200, img: "" },
  { id: 13, name: "Aceite de girasol",   unit: "1,5 L",     cat: "Almacén",    price: 3900, old: 4500, img: "" },
  { id: 14, name: "Yerba mate",          unit: "1 kg",      cat: "Almacén",    price: 5200, img: "" },
  { id: 15, name: "Agua mineral",        unit: "2 L",       cat: "Bebidas",    price: 1100, img: "" },
  { id: 16, name: "Gaseosa cola",        unit: "2,25 L",    cat: "Bebidas",    price: 3100, img: "" },
  { id: 17, name: "Jugo de naranja",     unit: "1 L",       cat: "Bebidas",    price: 2400, img: "" },
  { id: 18, name: "Detergente",          unit: "750 ml",    cat: "Limpieza",   price: 2700, img: "" },
  { id: 19, name: "Papel higiénico",     unit: "x 4",       cat: "Limpieza",   price: 3400, img: "" },
  { id: 20, name: "Lavandina",           unit: "1 L",       cat: "Limpieza",   price: 1500, img: "" },
];

// ===== Estado =====
let cart = JSON.parse(localStorage.getItem("mercadito-cart") || "{}"); // { id: cantidad }
let activeCat = "Todos";
let query = "";
let step = "cart"; // cart | checkout | done

// ===== Helpers =====
const $ = (s) => document.querySelector(s);
const money = (n) => "$" + n.toLocaleString("es-AR");
const colorClass = (id) => "c" + ((id % 4) + 1);
const findProduct = (id) => PRODUCTS.find((p) => p.id === Number(id));
const save = () => localStorage.setItem("mercadito-cart", JSON.stringify(cart));
const imgStyle = (p) => (p.img ? `style="background:url('${p.img}') center/cover"` : "");

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 1800);
}

// ===== Filtros =====
function renderFilters() {
  const cats = ["Todos", ...new Set(PRODUCTS.map((p) => p.cat))];
  $("#filters").innerHTML = cats
    .map((c) => `<button class="chip ${c === activeCat ? "active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
}

$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  activeCat = btn.dataset.cat;
  renderFilters();
  renderProducts();
});

$("#search").addEventListener("input", (e) => {
  query = e.target.value.trim().toLowerCase();
  renderProducts();
});

// ===== Catálogo =====
function renderProducts() {
  const list = PRODUCTS.filter(
    (p) => (activeCat === "Todos" || p.cat === activeCat) && p.name.toLowerCase().includes(query)
  );
  $("#emptyMsg").hidden = list.length > 0;
  $("#productGrid").innerHTML = list
    .map((p) => {
      const qty = cart[p.id] || 0;
      const control = qty
        ? `<div class="qty"><button data-dec="${p.id}">−</button><span>${qty}</span><button data-inc="${p.id}">+</button></div>`
        : `<button class="add-btn" data-inc="${p.id}" aria-label="Agregar ${p.name}">+</button>`;
      const off = p.old ? `<span class="card__badge">-${Math.round((1 - p.price / p.old) * 100)}%</span>` : "";
      return `
        <article class="card">
          <div class="card__img placeholder ${colorClass(p.id)}" ${imgStyle(p)}>${off}</div>
          <div class="card__body">
            <span class="card__cat">${p.cat}</span>
            <span class="card__name">${p.name}</span>
            <span class="card__unit">${p.unit}</span>
            <div class="card__foot">
              <span class="card__price">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ""}</span>
              ${control}
            </div>
          </div>
        </article>`;
    })
    .join("");
}

// ===== Carrito =====
function changeQty(id, delta) {
  const next = (cart[id] || 0) + delta;
  if (next <= 0) delete cart[id];
  else cart[id] = next;
  save();
  renderAll();
  if (delta > 0) {
    toast(`${findProduct(id).name} agregado`);
    const btn = $("#openCart");
    btn.classList.remove("bump");
    void btn.offsetWidth;
    btn.classList.add("bump");
  }
}

document.addEventListener("click", (e) => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  if (inc) changeQty(inc.dataset.inc, 1);
  if (dec) changeQty(dec.dataset.dec, -1);
});

function getTotals() {
  const subtotal = Object.entries(cart).reduce((sum, [id, q]) => sum + findProduct(id).price * q, 0);
  let shipping = Number($("#zoneSelect").value);
  if (subtotal >= FREE_SHIPPING) shipping = 0;
  if (subtotal === 0) shipping = 0;
  return { subtotal, shipping, total: subtotal + shipping };
}

function renderCart() {
  const ids = Object.keys(cart);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  $("#cartCount").textContent = count;
  $("#cartEmpty").hidden = ids.length > 0;

  $("#cartList").innerHTML = ids
    .map((id) => {
      const p = findProduct(id);
      return `
        <li class="cart-item">
          <div class="cart-item__img placeholder ${colorClass(p.id)}" ${imgStyle(p)}></div>
          <div>
            <div class="cart-item__name">${p.name}</div>
            <div class="cart-item__price">${money(p.price)} · ${p.unit}</div>
          </div>
          <div class="qty"><button data-dec="${p.id}">−</button><span>${cart[id]}</span><button data-inc="${p.id}">+</button></div>
        </li>`;
    })
    .join("");

  const { subtotal, shipping, total } = getTotals();
  $("#subtotal").textContent = money(subtotal);
  $("#shipping").textContent = shipping === 0 && subtotal > 0 ? "Gratis" : money(shipping);
  $("#total").textContent = money(total);

  const missing = FREE_SHIPPING - subtotal;
  $("#freeHint").textContent =
    subtotal > 0 && missing > 0 ? `Te faltan ${money(missing)} para tener envío gratis.` : "";

  $("#nextBtn").disabled = ids.length === 0;
}

function renderAll() {
  renderProducts();
  renderCart();
}

// ===== Drawer / pasos =====
function openCart() {
  $("#drawer").classList.add("open");
  $("#overlay").classList.add("open");
  $("#drawer").setAttribute("aria-hidden", "false");
}
function closeCart() {
  $("#drawer").classList.remove("open");
  $("#overlay").classList.remove("open");
  $("#drawer").setAttribute("aria-hidden", "true");
  if (step === "done") setStep("cart");
}

function setStep(s) {
  step = s;
  $("#stepCart").hidden = s !== "cart";
  $("#stepCheckout").hidden = s !== "checkout";
  $("#stepDone").hidden = s !== "done";
  $("#drawerFoot").hidden = s === "done";
  $("#backBtn").hidden = s !== "checkout";
  $("#drawerTitle").textContent = s === "checkout" ? "Datos de entrega" : s === "done" ? "Listo" : "Tu carrito";
  $("#nextBtn").textContent = s === "checkout" ? "Confirmar pedido" : "Continuar";
}

$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
$("#goShop").addEventListener("click", closeCart);
$("#backBtn").addEventListener("click", () => setStep("cart"));
$("#zoneSelect").addEventListener("change", renderCart);
$("#newOrder").addEventListener("click", () => { setStep("cart"); closeCart(); });
document.addEventListener("keydown", (e) => e.key === "Escape" && closeCart());

$("#nextBtn").addEventListener("click", () => {
  if (step === "cart") return setStep("checkout");
  const form = $("#stepCheckout");
  if (!form.reportValidity()) return;
  sendOrder(new FormData(form));
});

// ===== Envío del pedido por WhatsApp =====
function sendOrder(data) {
  const { subtotal, shipping, total } = getTotals();
  const items = Object.entries(cart)
    .map(([id, q]) => {
      const p = findProduct(id);
      return `• ${q} x ${p.name} (${p.unit}) — ${money(p.price * q)}`;
    })
    .join("\n");

  const msg =
    `*Nuevo pedido — Mercadito*\n\n${items}\n\n` +
    `Subtotal: ${money(subtotal)}\nEnvío: ${shipping ? money(shipping) : "Gratis"}\n*Total: ${money(total)}*\n\n` +
    `Nombre: ${data.get("nombre")}\nTeléfono: ${data.get("telefono")}\n` +
    `Dirección: ${data.get("direccion")}\nPago: ${data.get("pago")}` +
    (data.get("notas") ? `\nNotas: ${data.get("notas")}` : "");

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");

  cart = {};
  save();
  $("#stepCheckout").reset();
  renderAll();
  setStep("done");
}

// ===== Inicio =====
renderFilters();
renderAll();
setStep("cart");
