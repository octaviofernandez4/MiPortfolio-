// ---------- Navegación ----------
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', () => nav.classList.toggle('is-open'));
document.querySelectorAll('#navLinks a').forEach(a =>
  a.addEventListener('click', () => nav.classList.remove('is-open'))
);
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 10);
}, { passive: true });

// ---------- Reloj "abierto ahora" ----------
const liveClock = document.getElementById('liveClock');
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  liveClock.textContent = `En vivo · ${hh}:${mm} · 128 trucks`;
}
updateClock();
setInterval(updateClock, 30000);

// ---------- Demo: menú + carrito ----------
const menu = [
  { id: 1, name: 'Choripán completo', price: 4500, available: true },
  { id: 2, name: 'Burger doble', price: 7200, available: true },
  { id: 3, name: 'Tacos al pastor (x3)', price: 6000, available: true },
  { id: 4, name: 'Papas rústicas', price: 3200, available: false },
  { id: 5, name: 'Limonada casera', price: 2500, available: true },
];
const cart = {};

const adminList = document.getElementById('adminList');
const clientList = document.getElementById('clientList');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const demoMsg = document.getElementById('demoMsg');

const money = n => '$' + n.toLocaleString('es-AR');

function renderDemo() {
  adminList.innerHTML = menu.map(item => `
    <li class="admin-item ${item.available ? '' : 'is-off'}" data-id="${item.id}">
      <span>${item.name}</span>
      <span class="toggle" aria-hidden="true"></span>
    </li>`).join('');

  clientList.innerHTML = menu.map(item => `
    <li class="client-item ${item.available ? '' : 'is-out'}">
      <span class="name">${item.name}</span>
      <span class="price">${item.available ? money(item.price) : 'Agotado'}</span>
      <span style="display:flex;align-items:center;gap:8px">
        <span class="qty">${cart[item.id] ? '×' + cart[item.id] : ''}</span>
        <button data-add="${item.id}" aria-label="Agregar ${item.name}">+</button>
      </span>
    </li>`).join('');

  let total = 0, count = 0;
  menu.forEach(item => {
    const q = cart[item.id] || 0;
    total += q * item.price;
    count += q;
  });
  cartTotal.textContent = money(total);
  cartCount.textContent = `Carrito: ${count}`;
  checkoutBtn.disabled = count === 0;
}

adminList.addEventListener('click', e => {
  const li = e.target.closest('.admin-item');
  if (!li) return;
  const item = menu.find(m => m.id === Number(li.dataset.id));
  item.available = !item.available;
  if (!item.available) delete cart[item.id];
  demoMsg.textContent = '';
  renderDemo();
});

clientList.addEventListener('click', e => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  const id = Number(btn.dataset.add);
  cart[id] = (cart[id] || 0) + 1;
  demoMsg.textContent = '';
  renderDemo();
});

checkoutBtn.addEventListener('click', () => {
  const num = Math.floor(200 + Math.random() * 100);
  Object.keys(cart).forEach(k => delete cart[k]);
  renderDemo();
  demoMsg.textContent = `✓ Pedido #${num} enviado · listo en ~12 min`;
});

renderDemo();

// ---------- Demo: mapa en vivo ----------
const truck = document.getElementById('mapTruck');
const eta = document.getElementById('eta');
const route = [
  { left: '10%', top: 'calc(55% - 4px)', d: 350 },
  { left: 'calc(30% - 4px)', top: 'calc(55% - 4px)', d: 260 },
  { left: 'calc(30% - 4px)', top: '20%', d: 170 },
  { left: '55%', top: 'calc(55% - 4px)', d: 90 },
  { left: '64%', top: '24%', d: 20 },
];
let step = 0;
setInterval(() => {
  step = (step + 1) % route.length;
  const p = route[step];
  truck.style.left = p.left;
  truck.style.top = p.top;
  eta.textContent = p.d < 50 ? '¡llegó!' : `a ${p.d} m`;
}, 2200);

// ---------- Precios: mensual / anual ----------
document.querySelectorAll('.switch__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.switch__btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const mode = btn.dataset.billing;
    document.querySelectorAll('[data-monthly]').forEach(el => {
      el.textContent = el.dataset[mode];
    });
  });
});

// ---------- FAQ: uno abierto a la vez ----------
const faqItems = document.querySelectorAll('.faq__item');
faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) faqItems.forEach(o => { if (o !== item) o.open = false; });
  });
});

// ---------- Formulario CTA ----------
const form = document.getElementById('ctaForm');
const ctaMsg = document.getElementById('ctaMsg');
form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('input').forEach(input => {
    const valid = input.checkValidity() && input.value.trim() !== '';
    input.classList.toggle('is-error', !valid);
    if (!valid) ok = false;
  });
  if (!ok) {
    ctaMsg.textContent = 'Completá el nombre de tu truck y un email válido.';
    return;
  }
  const name = form.truck.value.trim();
  ctaMsg.textContent = `¡Listo! Te mandamos el acceso para "${name}" a tu email.`;
  form.reset();
});

// ---------- Animación al hacer scroll ----------
const revealTargets = document.querySelectorAll('.section h2, .feature, .demo__panel, .step, .plan, .faq__item, .quote blockquote');
revealTargets.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => io.observe(el));

// ---------- Año footer ----------
document.getElementById('year').textContent = new Date().getFullYear();