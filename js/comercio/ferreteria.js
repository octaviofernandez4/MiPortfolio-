// ===== Configuración =====
const WHATSAPP = '5491155555555'; // número del local, sin + ni espacios

const CATEGORIES = ['Todos', 'Construcción', 'Hierros', 'Maderas', 'Ferretería', 'Pinturas', 'Sanitarios', 'Electricidad'];

const PRODUCTS = [
  { id: 1, name: 'Cemento Portland 50 kg', cat: 'Construcción', unit: 'Bolsa', price: 9800 },
  { id: 2, name: 'Ladrillo común', cat: 'Construcción', unit: 'Unidad', price: 210 },
  { id: 3, name: 'Arena gruesa', cat: 'Construcción', unit: 'm³', price: 38000 },
  { id: 4, name: 'Cal hidratada 25 kg', cat: 'Construcción', unit: 'Bolsa', price: 5200 },
  { id: 5, name: 'Hierro aletado 8 mm × 12 m', cat: 'Hierros', unit: 'Barra', price: 7400 },
  { id: 6, name: 'Malla sima 15×15', cat: 'Hierros', unit: 'Panel', price: 42000 },
  { id: 7, name: 'Tirante pino 2"×4" × 3 m', cat: 'Maderas', unit: 'Unidad', price: 8900 },
  { id: 8, name: 'Fenólico 18 mm 1,22×2,44', cat: 'Maderas', unit: 'Placa', price: 46000 },
  { id: 9, name: 'Caja de tornillos autoperforantes', cat: 'Ferretería', unit: 'x100', price: 6300 },
  { id: 10, name: 'Amoladora angular 115 mm', cat: 'Ferretería', unit: 'Unidad', price: 68000 },
  { id: 11, name: 'Látex interior 20 L', cat: 'Pinturas', unit: 'Balde', price: 54000 },
  { id: 12, name: 'Membrana líquida 20 kg', cat: 'Pinturas', unit: 'Balde', price: 61000 },
  { id: 13, name: 'Caño PVC 110 mm × 4 m', cat: 'Sanitarios', unit: 'Unidad', price: 14500 },
  { id: 14, name: 'Grifería monocomando cocina', cat: 'Sanitarios', unit: 'Unidad', price: 72000 },
  { id: 15, name: 'Cable unipolar 2,5 mm', cat: 'Electricidad', unit: 'Rollo 100 m', price: 48000 },
  { id: 16, name: 'Térmica bipolar 20 A', cat: 'Electricidad', unit: 'Unidad', price: 11200 },
];

// Rendimientos aproximados por tipo de trabajo
const CALC = {
  pared: {
    hLabel: 'Alto (m)', extra: null,
    items: (m2) => [
      { id: 2, qty: Math.ceil(m2 * 60) },        // 60 ladrillos/m²
      { id: 1, qty: Math.ceil(m2 * 0.25) },      // cemento
      { id: 4, qty: Math.ceil(m2 * 0.35) },      // cal
      { id: 3, qty: +(m2 * 0.03).toFixed(2) },   // arena m³
    ],
  },
  contrapiso: {
    hLabel: 'Ancho (m)', extra: 'Espesor (cm)',
    items: (m2, cm) => {
      const m3 = m2 * (cm / 100);
      return [
        { id: 1, qty: Math.ceil(m3 * 3.5) },
        { id: 3, qty: +(m3 * 0.6).toFixed(2) },
        { id: 4, qty: Math.ceil(m3 * 2) },
      ];
    },
  },
  pintura: {
    hLabel: 'Alto (m)', extra: 'Manos',
    items: (m2, manos) => [{ id: 11, qty: Math.ceil((m2 * manos) / 10 / 20) }], // 10 m²/L, balde 20 L
  },
};

// ===== Estado =====
let cart = JSON.parse(localStorage.getItem('corralon-cart') || '[]');
let activeCat = 'Todos';

const $ = (s) => document.querySelector(s);
const money = (n) => '$' + Math.round(n).toLocaleString('es-AR');
const byId = (id) => PRODUCTS.find((p) => p.id === id);

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2000);
}

// ===== Catálogo =====
function renderTabs() {
  $('#tabs').innerHTML = CATEGORIES.map(
    (c) => `<button class="tab ${c === activeCat ? 'is-active' : ''}" data-cat="${c}">${c}</button>`
  ).join('');
}

function renderCatalog() {
  const list = activeCat === 'Todos' ? PRODUCTS : PRODUCTS.filter((p) => p.cat === activeCat);
  $('#catalog').innerHTML = list.map((p) => `
    <article class="card">
      <div class="placeholder"><span>foto · ${p.name.toLowerCase()}</span></div>
      <div class="card__body">
        <span class="card__cat">${p.cat}</span>
        <h4 class="card__name">${p.name}</h4>
        <span class="card__unit">${p.unit}</span>
        <div class="card__foot">
          <span class="card__price">${money(p.price)}</span>
          <button class="add-btn" data-add="${p.id}">+ Cotizar</button>
        </div>
      </div>
    </article>`).join('');
}

$('#tabs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-cat]');
  if (!b) return;
  activeCat = b.dataset.cat;
  renderTabs();
  renderCatalog();
});

$('#catalog').addEventListener('click', (e) => {
  const b = e.target.closest('[data-add]');
  if (!b) return;
  addToCart(+b.dataset.add, 1);
  toast('Agregado a la cotización');
});

// ===== Carrito / cotización =====
function addToCart(id, qty) {
  const item = cart.find((i) => i.id === id);
  if (item) item.qty = +(item.qty + qty).toFixed(2);
  else cart.push({ id, qty });
  saveCart();
}

function saveCart() {
  cart = cart.filter((i) => i.qty > 0);
  localStorage.setItem('corralon-cart', JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const list = $('#cartList');
  if (!cart.length) {
    list.innerHTML = '<li class="cart__empty">Todavía no agregaste materiales. Sumalos desde el catálogo o la calculadora.</li>';
  } else {
    list.innerHTML = cart.map((i) => {
      const p = byId(i.id);
      return `<li class="cart__item">
        <div>${p.name}<small>${money(p.price)} / ${p.unit}</small></div>
        <div class="qty">
          <button data-dec="${i.id}" aria-label="Restar">−</button>
          <span>${i.qty}</span>
          <button data-inc="${i.id}" aria-label="Sumar">+</button>
        </div>
        <span class="cart__price">${money(p.price * i.qty)}</span>
      </li>`;
    }).join('');
  }
  const total = cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
  $('#cartTotal').textContent = money(total);
  $('#quoteCount').textContent = cart.length;
}

$('#cartList').addEventListener('click', (e) => {
  const inc = e.target.closest('[data-inc]');
  const dec = e.target.closest('[data-dec]');
  if (inc) addToCart(+inc.dataset.inc, 1);
  if (dec) addToCart(+dec.dataset.dec, -1);
});

$('#clearCart').addEventListener('click', () => { cart = []; saveCart(); });

$('#sendQuote').addEventListener('click', () => {
  if (!cart.length) return toast('La cotización está vacía');
  const lines = cart.map((i) => `• ${i.qty} × ${byId(i.id).name}`).join('\n');
  const msg = `Hola! Quiero cotizar:\n${lines}\n\nTotal estimado: ${$('#cartTotal').textContent}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
});

// ===== Calculadora =====
function calcItems() {
  const type = CALC[$('#calcType').value];
  const m2 = (+$('#calcL').value || 0) * (+$('#calcH').value || 0);
  return { m2, items: type.items(m2, +$('#calcExtra').value || 0) };
}

function renderCalc() {
  const key = $('#calcType').value;
  const type = CALC[key];
  $('#calcHLabel').textContent = type.hLabel;
  $('#calcExtraWrap').style.display = type.extra ? '' : 'none';
  if (type.extra) $('#calcExtraLabel').textContent = type.extra;

  const { m2, items } = calcItems();
  $('#calcResult').innerHTML = `
    <p>Superficie: ${m2.toFixed(2)} m² · necesitás aprox.</p>
    <ul>${items.map((i) => {
      const p = byId(i.id);
      return `<li><span>${p.name}</span><strong>${i.qty} ${p.unit.toLowerCase()}</strong></li>`;
    }).join('')}</ul>`;
}

$('#calcType').addEventListener('change', () => {
  const k = $('#calcType').value;
  $('#calcExtra').value = k === 'pintura' ? 2 : 8;
  renderCalc();
});
['#calcL', '#calcH', '#calcExtra'].forEach((s) => $(s).addEventListener('input', renderCalc));

$('#calcAdd').addEventListener('click', () => {
  const { items } = calcItems();
  items.forEach((i) => i.qty > 0 && addToCart(i.id, i.qty));
  toast('Materiales sumados a la cotización');
});

// ===== Pedidos a medida =====
$('#orderForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  const medidas = [d.largo && `${d.largo} cm largo`, d.ancho && `${d.ancho} cm ancho`, d.espesor && `${d.espesor} mm espesor`].filter(Boolean).join(' × ');
  const msg = `Pedido a medida\nNombre: ${d.nombre}\nTel: ${d.tel}\nMaterial: ${d.material}\nMedidas: ${medidas}\nCantidad: ${d.cantidad}\nEntrega: ${d.entrega}\n${d.detalle ? 'Detalles: ' + d.detalle : ''}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
  $('#formMsg').textContent = '¡Gracias! Te respondemos con precio y plazo de entrega.';
  e.target.reset();
});

// ===== Menú mobile =====
$('#menuBtn').addEventListener('click', () => $('#nav').classList.toggle('open'));
$('#nav').addEventListener('click', (e) => e.target.tagName === 'A' && $('#nav').classList.remove('open'));

// Init
renderTabs();
renderCatalog();
renderCart();
renderCalc();
