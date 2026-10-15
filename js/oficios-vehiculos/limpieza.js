/**
 * AURA Facility Care - Script de Interacciones y Lógica Operativa
 * Vanilla JS sin dependencias externas excepto Bootstrap 5 Bundle
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Pantalla de carga breve (Preloader)
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 400);
    });
    // Fallback de seguridad por si load ya disparó
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 1200);
  }

  // 2. Barra de progreso de scroll y Header que se encoge
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const headerMain = document.getElementById('headerMain');
  const heroBg = document.getElementById('heroBg');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    if (headerMain) {
      if (scrollTop > 50) {
        headerMain.classList.add('scrolled');
      } else {
        headerMain.classList.remove('scrolled');
      }
    }

    // Parallax suave en la imagen del hero (solo en pantallas grandes)
    if (heroBg && window.innerWidth >= 768) {
      heroBg.style.transform = `translateY(${scrollTop * 0.3}px)`;
    }
  });

  // 3. Efecto Ripple al hacer clic en botones
  const rippleButtons = document.querySelectorAll('.btn-ripple');
  rippleButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple-circle');

      const existingRipple = this.querySelector('.ripple-circle');
      if (existingRipple) {
        existingRipple.remove();
      }

      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });

  // 4. Inclinación 3D en tarjetas siguiendo el mouse (solo en desktop)
  if (window.innerWidth >= 1024) {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = (-y / rect.height) * 10;
        const rotateY = (x / rect.width) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  // 5. Contadores Numéricos Animados con IntersectionObserver
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach((counter) => {
          const target = +counter.getAttribute('data-target');
          let current = 0;
          const increment = target / 50;

          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.textContent = Math.ceil(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };
          updateCounter();
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats-row');
  if (heroStats) {
    countObserver.observe(heroStats);
  }

  // 6. Sincronización de Bottom Nav y Menú Desktop con Scroll Spy
  const sections = document.querySelectorAll('section[id]');
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
  const desktopNavLinks = document.querySelectorAll('.nav-link-custom');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      bottomNavItems.forEach((item) => {
        item.classList.toggle('active', item.getAttribute('data-target') === currentId);
      });
      desktopNavLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
    }
  });

  // 7. Cotizador Wizard Interactivo por Pasos
  const step1 = document.getElementById('wizardStep1');
  const step2 = document.getElementById('wizardStep2');
  const step3 = document.getElementById('wizardStep3');
  const progress = document.getElementById('wizardProgress');

  const ind1 = document.getElementById('stepIndicator1');
  const ind2 = document.getElementById('stepIndicator2');
  const ind3 = document.getElementById('stepIndicator3');

  const btnNext1 = document.getElementById('btnNext1');
  const btnNext2 = document.getElementById('btnNext2');
  const btnBack2 = document.getElementById('btnBack2');
  const btnBack3 = document.getElementById('btnBack3');

  const quoteOutput = document.getElementById('quotePriceOutput');

  function calculateQuote() {
    const selectedService = document.querySelector('input[name="cotizServicio"]:checked');
    const basePrice = selectedService ? parseFloat(selectedService.getAttribute('data-base')) : 150;

    const dimensionSelect = document.getElementById('cotizDimensiones');
    const dimensionMultiplier = dimensionSelect ? parseFloat(dimensionSelect.value) : 1;

    const selectedFrecuencia = document.querySelector('input[name="cotizFrecuencia"]:checked');
    const factorFrecuencia = selectedFrecuencia ? parseFloat(selectedFrecuencia.getAttribute('data-factor')) : 1;

    const finalCalculated = Math.round(basePrice * dimensionMultiplier * factorFrecuencia);
    if (quoteOutput) {
      quoteOutput.textContent = finalCalculated;
    }
  }

  if (btnNext1) {
    btnNext1.addEventListener('click', () => {
      step1.classList.remove('active');
      step2.classList.add('active');
      progress.style.width = '66.66%';
      ind1.classList.remove('active');
      ind2.classList.add('active');
    });
  }

  if (btnBack2) {
    btnBack2.addEventListener('click', () => {
      step2.classList.remove('active');
      step1.classList.add('active');
      progress.style.width = '33.33%';
      ind2.classList.remove('active');
      ind1.classList.add('active');
    });
  }

  if (btnNext2) {
    btnNext2.addEventListener('click', () => {
      calculateQuote();
      step2.classList.remove('active');
      step3.classList.add('active');
      progress.style.width = '100%';
      ind2.classList.remove('active');
      ind3.classList.add('active');
    });
  }

  if (btnBack3) {
    btnBack3.addEventListener('click', () => {
      step3.classList.remove('active');
      step2.classList.add('active');
      progress.style.width = '66.66%';
      ind3.classList.remove('active');
      ind2.classList.add('active');
    });
  }

  // Recalcular al cambiar opciones
  document.querySelectorAll('input[name="cotizServicio"], input[name="cotizFrecuencia"]').forEach((el) => {
    el.addEventListener('change', calculateQuote);
  });
  const dimSelect = document.getElementById('cotizDimensiones');
  if (dimSelect) dimSelect.addEventListener('change', calculateQuote);

  // Formulario Cotizador Envío
  const cotizadorForm = document.getElementById('cotizadorForm');
  cotizadorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('cotizNombre').value.trim();
    const email = document.getElementById('cotizEmail').value.trim();

    if (!nombre || !email) {
      showToast('Por favor completa los campos de contacto.', 'warning');
      return;
    }

    showToast(`¡Cotización generada con éxito! Enviada a ${email}`, 'success');
  });

  // 8. Formulario de Agenda con Bottom Sheet (Offcanvas)
  const agendaForm = document.getElementById('agendaForm');
  agendaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('agendaNombre').value.trim();
    const tel = document.getElementById('agendaTelefono').value.trim();
    const fecha = document.getElementById('agendaFecha').value;
    const turno = document.getElementById('agendaTurno').value;

    if (!nombre || !tel || !fecha || !turno) {
      showToast('Completá todos los campos requeridos para coordinar la visita.', 'warning');
      return;
    }

    // Llenar datos en el Bottom Sheet de confirmación
    const randomCode = 'VIS-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('sheetTurnoCodigo').textContent = randomCode;
    document.getElementById('sheetTurnoNombre').textContent = nombre;
    document.getElementById('sheetTurnoFecha').textContent = `${fecha} (${turno})`;

    const bsOffcanvas = new bootstrap.Offcanvas(document.getElementById('confirmationBottomSheet'));
    bsOffcanvas.show();

    agendaForm.reset();
  });

  // 9. Seguimiento de Órdenes
  const trackingForm = document.getElementById('trackingForm');
  const trackingResult = document.getElementById('trackingResult');
  const trackingCodeDisplay = document.getElementById('trackingCodeDisplay');

  trackingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputVal = document.getElementById('trackingInput').value.trim().toUpperCase();

    if (!inputVal) {
      showToast('Ingresá un código de orden válido.', 'warning');
      return;
    }

    trackingCodeDisplay.textContent = inputVal;
    trackingResult.style.display = 'block';
    trackingResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast(`Orden ${inputVal} localizada en sistema.`, 'success');
  });

  // 10. Recordatorio de Service Periódico
  const reminderForm = document.getElementById('reminderForm');
  reminderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('reminderEmail').value.trim();
    const whatsapp = document.getElementById('reminderWhatsapp').value.trim();
    const periodo = document.getElementById('reminderPeriodo').value;

    if (!email || !whatsapp) {
      showToast('Completá correo y WhatsApp para activar las notificaciones.', 'warning');
      return;
    }

    showToast(`Recordatorios ${periodo.toLowerCase()} activados para ${whatsapp}`, 'success');
    reminderForm.reset();
  });

  // 11. Helper de Notificaciones Toast de Bootstrap
  function showToast(message, type = 'info') {
    const toastEl = document.getElementById('statusToast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    if (!toastEl || !toastMessage) return;

    toastMessage.textContent = message;

    toastEl.classList.remove('bg-success', 'bg-warning', 'bg-primary', 'bg-danger');
    if (type === 'success') {
      toastEl.classList.add('bg-success');
      toastIcon.className = 'bi bi-check-circle-fill fs-5';
    } else if (type === 'warning') {
      toastEl.classList.add('bg-warning', 'text-dark');
      toastIcon.className = 'bi bi-exclamation-triangle-fill fs-5';
    } else {
      toastEl.classList.add('bg-primary');
      toastIcon.className = 'bi bi-info-circle-fill fs-5';
    }

    const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
    toast.show();
  }
});
