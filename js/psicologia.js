document.documentElement.classList.add('js');

// Menú mobile
const header = document.querySelector('.header');
const burger = document.querySelector('.burger');
burger.addEventListener('click', () => {
  const open = header.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.mobile-nav a').forEach(a =>
  a.addEventListener('click', () => {
    header.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  })
);
window.addEventListener('resize', () => {
  if (window.innerWidth > 860) header.classList.remove('is-open');
});

// Toggle precios mensual / anual
const toggleBtns = document.querySelectorAll('.toggle__btn');
const prices = document.querySelectorAll('.price');
const notes = document.querySelectorAll('.billing-note');
toggleBtns.forEach(btn => btn.addEventListener('click', () => {
  const mode = btn.dataset.billing;
  toggleBtns.forEach(b => b.classList.toggle('is-active', b === btn));
  prices.forEach(p => {
    p.classList.add('is-changing');
    setTimeout(() => {
      p.textContent = '$' + p.dataset[mode];
      p.classList.remove('is-changing');
    }, 200);
  });
  notes.forEach(n => n.textContent = mode === 'annual' ? 'Facturado anualmente' : 'Facturado mes a mes');
}));

// Animaciones al scrollear
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
