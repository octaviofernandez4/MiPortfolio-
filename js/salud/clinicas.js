// ===== Menú mobile =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

// Borde del nav al hacer scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 10), { passive: true });

// ===== Agenda demo interactiva =====
const agenda = {
  'Martes 14': [
    { t: '09:00', who: 'Sofía Ramírez', s: 'busy' },
    { t: '09:30', who: 'Juan Pérez', s: 'pending' },
    { t: '10:00', s: 'free' },
    { t: '10:30', who: 'Martín Gómez', s: 'busy' },
    { t: '11:00', s: 'free' },
  ],
  'Miércoles 15': [
    { t: '09:00', s: 'free' },
    { t: '09:30', who: 'Ana López', s: 'busy' },
    { t: '10:00', who: 'Carlos Díaz', s: 'busy' },
    { t: '10:30', s: 'free' },
    { t: '11:00', who: 'Lucía Torres', s: 'pending' },
  ],
  'Jueves 16': [
    { t: '09:00', who: 'Pedro Ruiz', s: 'busy' },
    { t: '09:30', s: 'free' },
    { t: '10:00', s: 'free' },
    { t: '10:30', who: 'Valentina Sosa', s: 'pending' },
    { t: '11:00', who: 'Diego Martín', s: 'busy' },
  ],
};
const labels = { busy: 'Confirmado', pending: 'Por confirmar', free: 'Libre' };
const nuevos = ['Camila Herrera', 'Tomás Acosta', 'Julieta Ríos', 'Federico Paz', 'Mariana Vega'];
let currentDay = 'Martes 14';
const slotsEl = document.getElementById('slots');

function renderSlots(newIndex) {
  slotsEl.innerHTML = '';
  agenda[currentDay].forEach((slot, i) => {
    const li = document.createElement('li');
    li.className = `slot slot--${slot.s}${i === newIndex ? ' slot--new' : ''}`;
    li.innerHTML = `
      <span class="slot__time">${slot.t}</span>
      <span class="slot__who">${slot.who || 'Disponible'}</span>
      <span class="slot__state">${labels[slot.s]}</span>`;
    if (slot.s === 'free') {
      li.tabIndex = 0;
      li.setAttribute('role', 'button');
      const book = () => {
        slot.s = 'pending';
        slot.who = nuevos[Math.floor(Math.random() * nuevos.length)];
        renderSlots(i);
      };
      li.addEventListener('click', book);
      li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); book(); } });
    }
    slotsEl.appendChild(li);
  });
}

document.querySelectorAll('#mockDays button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#mockDays button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentDay = btn.dataset.day;
    document.getElementById('mockDate').textContent = currentDay;
    renderSlots();
  });
});
renderSlots();

// ===== Toggle de precios mensual / anual =====
document.querySelectorAll('.billing__opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.billing__opt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const mode = btn.dataset.billing;
    document.querySelectorAll('.price').forEach(p => { p.textContent = p.dataset[mode]; });
  });
});

// ===== FAQ acordeón =====
document.querySelectorAll('.faq__q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      q.setAttribute('aria-expanded', 'true');
    }
  });
});

// ===== Formulario =====
const form = document.getElementById('demoForm');
const msg = document.getElementById('formMsg');
form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const ok = field.type === 'email'
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())
      : field.value.trim() !== '';
    field.classList.toggle('invalid', !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    msg.textContent = 'Revisá los campos marcados.';
    msg.className = 'form__msg err';
    return;
  }
  // Acá conectás tu backend / servicio de formularios (fetch)
  const nombre = form.nombre.value.trim().split(' ')[0];
  msg.textContent = `¡Gracias, ${nombre}! Te escribimos en menos de 24 h.`;
  msg.className = 'form__msg ok';
  form.reset();
});
form.querySelectorAll('input, select').forEach(f => f.addEventListener('input', () => f.classList.remove('invalid')));

// ===== Animación de entrada al hacer scroll =====
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();