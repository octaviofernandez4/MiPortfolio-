(function() {
  /**
 * LOGISTIX - SCRIPT.JS
 * Lógica interactiva vanilla: Wizard cotizador, tracking, turnos, animaciones y navegación móvil
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initScrollProgress();
  initHeaderScroll();
  initScrollAnimations();
  initCounters();
  initParallax();
  initTiltCards();
  initShippingCalculator();
  initTrackingSystem();
  initDispatchTurnForm();
  initSmoothScrollAndActiveNav();
});

/* 1. Preloader */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 450);
  });
  // Fallback si load ya ocurrió
  setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
    }
  }, 1200);
}

/* 2. Barra de Progreso de Scroll */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

/* 3. Header Fijo con Reducción al Scroll */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* 4. Animaciones de Entrada (IntersectionObserver) */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-item');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

/* 5. Contadores Numéricos Animados */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const duration = 1800;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target % 1 === 0 ? target : target.toFixed(1);
            clearInterval(timer);
          } else {
            el.textContent = target % 1 === 0 ? Math.floor(current) : current.toFixed(1);
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => countObserver.observe(counter));
}

/* 6. Parallax Suave en Hero */
function initParallax() {
  const heroBg = document.getElementById('hero-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll < window.innerHeight) {
      heroBg.style.transform = `scale(1.08) translateY(${scroll * 0.28}px)`;
    }
  }, { passive: true });
}

/* 7. Leve Inclinación 3D en Desktop */
function initTiltCards() {
  if (window.innerWidth < 992) return;
  const cards = document.querySelectorAll('.interactive-tilt');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateX = ((y - midY) / midY) * -5;
      const rotateY = ((x - midX) / midX) * 5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* 8. Cotizador / Wizard de Envíos */
function initShippingCalculator() {
  const nextBtns = document.querySelectorAll('.btn-wizard-next');
  const prevBtns = document.querySelectorAll('.btn-wizard-prev');
  const indicators = document.querySelectorAll('.step-indicator');
  const panes = document.querySelectorAll('.wizard-step-pane');
  const bookBtn = document.getElementById('btn-book-quote');

  function showStep(stepNumber) {
    panes.forEach(pane => pane.classList.remove('active'));
    indicators.forEach(ind => {
      const indStep = parseInt(ind.getAttribute('data-step'), 10);
      if (indStep <= stepNumber) {
        ind.classList.add('active');
      } else {
        ind.classList.remove('active');
      }
    });

    const targetPane = document.getElementById(`wizard-step-${stepNumber}`);
    if (targetPane) targetPane.classList.add('active');
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.getAttribute('data-next'), 10);

      // Si pasa a paso 3, calcular monto
      if (nextStep === 3) {
        calculateRate();
      }
      showStep(nextStep);
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const prevStep = parseInt(btn.getAttribute('data-prev'), 10);
      showStep(prevStep);
    });
  });

  function calculateRate() {
    const selectedVeh = document.querySelector('input[name="vehicle_type"]:checked');
    const basePrice = selectedVeh ? parseFloat(selectedVeh.getAttribute('data-base')) : 25;
    const distanceInput = document.getElementById('quote-distance');
    const weightInput = document.getElementById('quote-weight');
    const origin = document.getElementById('quote-origin').value || 'Origen';
    const dest = document.getElementById('quote-dest').value || 'Destino';

    const distance = parseFloat(distanceInput.value) || 100;
    const weight = parseFloat(weightInput.value) || 50;

    // Fórmula paramétrica de flete
    const total = (basePrice * 12) + (distance * 1.85) + (weight * 0.45);
    const totalDisplay = document.getElementById('calculated-total');
    const summaryText = document.getElementById('quote-summary-text');

    if (totalDisplay) {
      totalDisplay.textContent = total.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    if (summaryText) {
      summaryText.textContent = `Trayecto estimado: ${origin} a ${dest} (${distance} km, ${weight} kg). Seguro de transporte básico incluido.`;
    }
  }

  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      const totalDisplay = document.getElementById('calculated-total');
      const val = totalDisplay ? totalDisplay.textContent : '0.00';
      showToast(`¡Cotización reservada con éxito por $ ${val}! Un ejecutivo se contactará.`);
    });
  }
}

/* 9. Sistema de Tracking / Seguimiento */
function initTrackingSystem() {
  const form = document.getElementById('tracking-form');
  const input = document.getElementById('tracking-input');
  const codeTitle = document.getElementById('tr-code');

  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim().toUpperCase();
    if (!val) return;

    if (codeTitle) {
      codeTitle.textContent = `GUÍA #${val}`;
    }
    showToast(`Actualizando estado en vivo para guía ${val}...`);
  });
}

/* 10. Formulario de Turno de Despacho y Bottom Sheet */
function initDispatchTurnForm() {
  const form = document.getElementById('order-dispatch-form');
  if (!form) return;

  // Fecha mínima hoy
  const dateInput = document.getElementById('order-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const company = document.getElementById('order-company').value.trim();
    const date = document.getElementById('order-date').value;
    const time = document.getElementById('order-time').value;

    if (!company || !date || !time) {
      showToast('Por favor completá los campos obligatorios.');
      return;
    }

    // Actualizar datos en el Bottom Sheet
    const sheetCompany = document.getElementById('confirm-sheet-company');
    const sheetDetails = document.getElementById('confirm-sheet-details');
    const codeEl = document.getElementById('confirm-turn-code');

    if (sheetCompany) sheetCompany.textContent = company;
    if (sheetDetails) sheetDetails.textContent = `Turno confirmado para el ${date} en franja ${time}.`;
    if (codeEl) codeEl.textContent = `TRN-${Math.floor(10000 + Math.random() * 90000)}`;

    // Abrir Bottom Sheet / Offcanvas de Bootstrap
    const sheetElement = document.getElementById('orderConfirmSheet');
    if (sheetElement && window.bootstrap) {
      const bsOffcanvas = new bootstrap.Offcanvas(sheetElement);
      bsOffcanvas.show();
    } else {
      showToast('¡Turno solicitado con éxito!');
    }

    form.reset();
  });
}

/* 11. Navegación Suave y Link Activo */
function initSmoothScrollAndActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link-custom, .bottom-nav-item');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }, { passive: true });
}

/* Utilitario Toast */
function showToast(message) {
  const toastEl = document.getElementById('actionToast');
  const msgEl = document.getElementById('toast-message');
  if (!toastEl || !msgEl) return;

  msgEl.textContent = message;
  if (window.bootstrap) {
    const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
    toast.show();
  }
}

})();
