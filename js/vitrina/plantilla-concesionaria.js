document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  // Íconos Lucide inline (sin dependencias externas)
  const ICONS = {
    'arrow-right':'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-up-right':'<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    'play':'<polygon points="6 3 20 12 6 21 6 3"/>',
    'play-circle':'<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
    'zap':'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    'battery-charging':'<path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"/><path d="m11 7-3 5h4l-3 5"/><line x1="22" x2="22" y1="11" y2="13"/>',
    'atom':'<circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/>',
    'x':'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'percent':'<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
    'calendar':'<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    'clock':'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'check-circle-2':'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    'instagram':'<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    'youtube':'<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    'twitter':'<path d="M4 4l16 16"/><path d="M20 4 4 20"/>',
    'linkedin':'<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>'
  };
  $$('i[data-lucide]').forEach(i => {
    const p = ICONS[i.dataset.lucide]; if (!p) return;
    i.outerHTML = '<svg class="lucide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  });

  // Nav: estado al scrollear + menú móvil
  const nav = $('#nav'), burger = $('#burger'), links = $('#navLinks');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  burger.addEventListener('click', () => { burger.classList.toggle('open'); links.classList.toggle('open'); });
  $$('a', links).forEach(a => a.addEventListener('click', () => { burger.classList.remove('open'); links.classList.remove('open'); }));

  // Hero slider automático
  const slides = $$('.hero-slide'), dots = $$('#heroDots button');
  let cur = 0, timer;
  const go = i => {
    slides[cur].classList.remove('active'); dots[cur].classList.remove('active');
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add('active');
    void dots[cur].offsetWidth; dots[cur].classList.add('active');
    clearTimeout(timer); timer = setTimeout(() => go(cur + 1), 6000);
  };
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  if (slides.length) timer = setTimeout(() => go(1), 6000);

  // Reveal al entrar en pantalla (con escalonado)
  $$('.cards .reveal, .stats .reveal').forEach((el, i) => el.style.setProperty('--d', (i % 4) * 0.12 + 's'));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  $$('.reveal').forEach(el => io.observe(el));

  // Contadores animados
  const ease = t => 1 - Math.pow(1 - t, 3);
  const count = el => {
    const end = parseFloat(el.dataset.count), dec = +el.dataset.decimals || 0;
    const suf = el.dataset.suffix || '', unit = el.dataset.unit ? `<small>${el.dataset.unit}</small>` : '';
    const t0 = performance.now(), dur = 2000;
    const step = now => {
      const p = Math.min(Math.max(0, now - t0) / dur, 1), v = end * ease(p);
      el.innerHTML = v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf + unit;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); }
  }), { threshold: 0.6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  // Batería: carga animada + tilt con el mouse
  const battery = $('#battery');
  if (battery) {
  const bImg = $('.battery-img'), cVal = $('#chargeVal'), cBar = $('#chargeBar');
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (!e.isIntersecting) return; o.disconnect();
    const t0 = performance.now();
    const step = now => {
      const p = Math.min(Math.max(0, now - t0) / 2600, 1), v = Math.round(80 * ease(p));
      cVal.textContent = v; cBar.style.width = v + '%';
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: 0.5 }).observe(battery);
  battery.addEventListener('mousemove', e => {
    const r = battery.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    bImg.style.transform = `scale(1.08) translate(${x * -20}px, ${y * -14}px)`;
  });
  battery.addEventListener('mouseleave', () => bImg.style.transform = '');
  }

  // Parallax en imágenes
  const pars = $$('.parallax');
  const parallax = () => pars.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
    el.style.backgroundPosition = `center ${50 + p * 25}%`;
  });
  addEventListener('scroll', () => requestAnimationFrame(parallax), { passive: true }); parallax();

  // Modal del film
  const modal = $('#modal');
  if (modal) {
  const toggleModal = o => { modal.classList.toggle('open', o); modal.setAttribute('aria-hidden', !o); };
  $('#filmBtn').addEventListener('click', () => toggleModal(true));
  $('#modalClose').addEventListener('click', () => toggleModal(false));
  modal.addEventListener('click', e => e.target === modal && toggleModal(false));
  addEventListener('keydown', e => e.key === 'Escape' && toggleModal(false));

  }

  // Formulario con validación
  const form = $('#form'), toast = $('#toast');
  if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('input[required]', form).forEach(inp => {
      const bad = !inp.value.trim() || (inp.type === 'email' && !/^\S+@\S+\.\S+$/.test(inp.value));
      inp.parentElement.classList.toggle('error', bad); if (bad) ok = false;
    });
    if (!ok) return;
    form.reset();
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  });
  $$('input', form).forEach(i => i.addEventListener('input', () => i.parentElement.classList.remove('error')));
  }

  // Cursor personalizado
  const cur$ = $('#cursor');
  if (cur$ && matchMedia('(hover:hover)').matches) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur$.style.opacity = 1; });
    (function loop() { cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2; cur$.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
    $$('a, button, .car-card').forEach(el => {
      el.addEventListener('mouseenter', () => cur$.classList.add('big'));
      el.addEventListener('mouseleave', () => cur$.classList.remove('big'));
    });
  }

  // Galería de fotos del modal (antes era un cartel de "insertá tu video")
  const gSlides = $$('.mg-slide'), gCount = $('#galCount');
  if (gSlides.length) {
  let g = 0;
  const showG = i => {
    gSlides[g].classList.remove('active');
    g = (i + gSlides.length) % gSlides.length;
    gSlides[g].classList.add('active');
    gCount.textContent = String(g + 1).padStart(2, '0') + ' / ' + String(gSlides.length).padStart(2, '0');
  };
  $('#galPrev').addEventListener('click', () => showG(g - 1));
  $('#galNext').addEventListener('click', () => showG(g + 1));
  addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'ArrowRight') showG(g + 1);
    if (e.key === 'ArrowLeft') showG(g - 1);
  });
  }
});
