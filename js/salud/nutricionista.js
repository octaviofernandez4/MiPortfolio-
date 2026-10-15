// Nav: sombra al scrollear + menú mobile
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');

window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 8);
});

navToggle.addEventListener('click', () => nav.classList.toggle('is-open'));
document.querySelectorAll('#navLinks a').forEach(link =>
  link.addEventListener('click', () => nav.classList.remove('is-open'))
);

// Animación de entrada al hacer scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Demo de reserva: selección de día y horario
function selectable(containerId, itemSelector) {
  const container = document.getElementById(containerId);
  container.addEventListener('click', e => {
    const item = e.target.closest(itemSelector);
    if (!item || item.disabled) return;
    container.querySelectorAll(itemSelector).forEach(i => i.classList.remove('is-selected'));
    item.classList.add('is-selected');
  });
}
selectable('bookingDays', '.day');
selectable('bookingSlots', '.slot');

// Precios: mensual / anual
document.querySelectorAll('.billing__opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.billing__opt').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const period = btn.dataset.billing;
    document.querySelectorAll('.price__value').forEach(v => {
      v.textContent = v.dataset[period];
    });
  });
});

// FAQ: solo una pregunta abierta a la vez
const faqItems = document.querySelectorAll('.faq__item');
faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) faqItems.forEach(other => { if (other !== item) other.open = false; });
  });
});

// Formulario CTA
document.getElementById('ctaForm').addEventListener('submit', e => {
  e.preventDefault();
  e.target.hidden = true;
  document.getElementById('ctaMsg').hidden = false;
});

document.getElementById('year').textContent = new Date().getFullYear();
