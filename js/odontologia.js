document.addEventListener('DOMContentLoaded', () => {
  // Nav: fondo al scrollear
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menú mobile
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const setMenu = (open) => {
    links.classList.toggle('is-open', open);
    nav.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('is-open')));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => { if (window.innerWidth > 820) setMenu(false); });

  // Animaciones al scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = [...entry.target.parentElement.children].filter(el => el.classList.contains('reveal'));
          entry.target.style.transitionDelay = `${Math.min(siblings.indexOf(entry.target), 5) * 80}ms`;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // Toggle precios mensual / anual
  const opts = document.querySelectorAll('.billing__opt');
  opts.forEach(btn => btn.addEventListener('click', () => {
    const period = btn.dataset.period;
    opts.forEach(o => o.classList.toggle('is-active', o === btn));
    document.querySelectorAll('.price').forEach(p => {
      p.textContent = p.dataset[period];
      p.classList.remove('is-changing');
      void p.offsetWidth;
      p.classList.add('is-changing');
    });
    document.querySelectorAll('.plan__note').forEach(n => {
      n.textContent = period === 'yearly' ? n.dataset.noteYearly : n.dataset.noteMonthly;
    });
  }));

  // Formulario con validación
  const form = document.getElementById('bookingForm');
  const success = document.getElementById('formSuccess');
  const fecha = form.fecha;
  const today = new Date().toISOString().split('T')[0];
  fecha.min = today;

  const rules = {
    nombre: v => v.trim().length >= 3 || 'Ingrese su nombre y apellido.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Ingrese un email válido.',
    telefono: v => v.replace(/\D/g, '').length >= 8 || 'Ingrese un teléfono válido (mín. 8 dígitos).',
    tratamiento: v => v !== '' || 'Seleccione el motivo de consulta.',
    fecha: v => {
      if (!v) return 'Seleccione una fecha.';
      if (v < today) return 'La fecha no puede ser anterior a hoy.';
      if (new Date(v + 'T00:00').getDay() === 0) return 'Los domingos la clínica permanece cerrada.';
      return true;
    },
    acepto: (v, el) => el.checked || 'Debe aceptar para continuar.'
  };

  const validate = (name) => {
    const el = form[name];
    const field = el.closest('.field');
    const result = rules[name](el.value, el);
    const ok = result === true;
    field.classList.toggle('has-error', !ok);
    field.querySelector('.error').textContent = ok ? '' : result;
    return ok;
  };

  Object.keys(rules).forEach(name => {
    const el = form[name];
    const evt = el.type === 'checkbox' || el.tagName === 'SELECT' || el.type === 'date' ? 'change' : 'blur';
    el.addEventListener(evt, () => validate(name));
    el.addEventListener('input', () => { if (el.closest('.field').classList.contains('has-error')) validate(name); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(rules).map(validate);
    if (results.every(Boolean)) {
      success.hidden = false;
      form.querySelector('button[type="submit"]').disabled = true;
      form.querySelector('button[type="submit"]').textContent = 'Solicitud enviada';
      // Aquí puede conectar su backend, por ejemplo:
      // fetch('/api/turnos', { method: 'POST', body: new FormData(form) });
    } else {
      form.querySelector('.has-error input, .has-error select')?.focus();
    }
  });
});
