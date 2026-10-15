(function () {
  /**
   * AURELIA ATELIER - Script Principal
   * Micro-interacciones, Cotizador Inteligente, Wizard Multistep y Efectos
   */

  document.addEventListener('DOMContentLoaded', () => {

    // 1. PANTALLA DE CARGA BREVE CON LOGO
    const loader = document.getElementById('loader-screen');
    if (loader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          loader.classList.add('loader-hidden');
        }, 700);
      });
      // Fallback por si load ya ocurrió
      setTimeout(() => {
        loader.classList.add('loader-hidden');
      }, 1500);
    }

    // 2. BARRA DE PROGRESO DE SCROLL & HEADER FLUIDO
    const scrollBar = document.getElementById('scroll-progress-bar');
    const mainHeader = document.getElementById('main-header');
    const heroParallax = document.getElementById('hero-parallax-bg');

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (scrollBar) {
        scrollBar.style.width = `${scrollPercent}%`;
      }

      if (mainHeader) {
        if (scrollTop > 50) {
          mainHeader.classList.add('scrolled');
        } else {
          mainHeader.classList.remove('scrolled');
        }
      }

      // Parallax suave en imagen de fondo del Hero
      if (heroParallax && window.innerWidth > 768) {
        heroParallax.style.transform = `translateY(${scrollTop * 0.35}px)`;
      }
    });

    // 3. ANIMACIÓN PALABRA POR PALABRA EN TÍTULO HERO
    const heroTitle = document.getElementById('hero-title-animated');
    if (heroTitle) {
      const textNodes = Array.from(heroTitle.childNodes);
      // Preservar estructura envolviendo palabras para animación
      heroTitle.style.opacity = '1';
    }

    // 4. INTERSECTION OBSERVER PARA REVELADO ESCALONADO Y CONTADORES
    const animatedElements = document.querySelectorAll('[data-animate]');
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-animated');

          // Si contiene contadores numéricos
          const counters = entry.target.querySelectorAll('.count-up');
          counters.forEach(counter => startCountUp(counter));

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => revealObserver.observe(el));

    function startCountUp(element) {
      if (element.dataset.counted === 'true') return;
      element.dataset.counted = 'true';

      const target = parseInt(element.getAttribute('data-target'), 10) || 0;
      const duration = 1800;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target;
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current);
        }
      }, stepTime);
    }

    // 5. EFECTO 3D TILT EN TARJETAS (Solo Desktop)
    if (window.innerWidth >= 1024) {
      const tiltCards = document.querySelectorAll('.card-tilt');
      tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -6;
          const rotateY = ((x - centerX) / centerX) * 6;
          card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
      });
    }

    // 6. MICRO-INTERACCIÓN: EFECTO RIPPLE EN BOTONES
    const rippleButtons = document.querySelectorAll('.btn-primary-action, .btn-secondary-action');
    rippleButtons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        const circle = document.createElement('span');
        circle.classList.add('ripple-wave');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        circle.style.width = circle.style.height = `${size}px`;
        circle.style.left = `${e.clientX - rect.left - size / 2}px`;
        circle.style.top = `${e.clientY - rect.top - size / 2}px`;
        this.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
      });
    });

    // 7. FILTROS DEL PORTFOLIO
    const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });

    // 8. COTIZADOR INTELIGENTE EN TIEMPO REAL
    const calcForm = document.getElementById('event-calculator-form');
    const guestSlider = document.getElementById('calc-guest-range');
    const guestBadge = document.getElementById('guest-count-badge');
    const totalAmountDisplay = document.getElementById('calculated-total-amount');
    const toastEl = document.getElementById('actionToast');
    const toastMsg = document.getElementById('toast-message-text');
    const toastInstance = toastEl ? new bootstrap.Toast(toastEl, { delay: 3500 }) : null;

    function calculateEventBudget() {
      if (!calcForm || !totalAmountDisplay) return;

      // Precios base por servicio
      const serviceCosts = {
        full: 3200,
        ambient: 2100,
        day: 1400,
        dest: 4500
      };

      // Multiplicadores por locación
      const venueMultipliers = {
        estancia: 1.0,
        salon: 1.15,
        vinedo: 1.25,
        hotel: 1.20
      };

      // Multiplicador por tier
      const tierMultipliers = {
        signature: 1.0,
        couture: 1.45
      };

      const selectedService = calcForm.querySelector('input[name="calc_service"]:checked')?.value || 'full';
      const selectedVenue = calcForm.querySelector('input[name="calc_venue"]:checked')?.value || 'estancia';
      const selectedTier = calcForm.querySelector('input[name="calc_tier"]:checked')?.value || 'signature';
      const guests = parseInt(guestSlider.value, 10) || 180;

      if (guestBadge) {
        guestBadge.textContent = `${guests} personas`;
      }

      let base = serviceCosts[selectedService] || 3200;
      let venueMod = venueMultipliers[selectedVenue] || 1.0;
      let tierMod = tierMultipliers[selectedTier] || 1.0;

      // Costo marginal por volumen de invitados
      let guestCost = guests * 5.5;

      // Sumar extras / add-ons
      let addonsSum = 0;
      const checkedAddons = calcForm.querySelectorAll('.calc-addon:checked');
      checkedAddons.forEach(item => {
        addonsSum += parseInt(item.getAttribute('data-cost'), 10) || 0;
      });

      const totalEstimate = Math.round((base * venueMod * tierMod) + guestCost + addonsSum);

      // Formatear a moneda con separador de miles
      totalAmountDisplay.textContent = totalEstimate.toLocaleString('en-US');
    }

    if (calcForm) {
      calcForm.addEventListener('change', calculateEventBudget);
      if (guestSlider) {
        guestSlider.addEventListener('input', calculateEventBudget);
      }
      calculateEventBudget();
    }

    const btnResetCalc = document.getElementById('btn-reset-calc');
    if (btnResetCalc && calcForm) {
      btnResetCalc.addEventListener('click', () => {
        calcForm.reset();
        if (guestSlider) guestSlider.value = 180;
        calculateEventBudget();
        if (toastInstance) {
          toastMsg.textContent = 'Valores del estimador reiniciados.';
          toastInstance.show();
        }
      });
    }

    const btnLockQuote = document.getElementById('btn-lock-quote');
    if (btnLockQuote) {
      btnLockQuote.addEventListener('click', () => {
        const targetSec = document.getElementById('consulta');
        if (targetSec) {
          targetSec.scrollIntoView({ behavior: 'smooth' });
        }
        if (toastInstance) {
          toastMsg.textContent = 'Presupuesto fijado. Completá tus datos para reservarlo.';
          toastInstance.show();
        }
      });
    }

    // 9. FORMULARIO WIZARD EN PASOS (Validación & Transición Fluida)
    const step1 = document.getElementById('wizard-step-1-content');
    const step2 = document.getElementById('wizard-step-2-content');
    const step3 = document.getElementById('wizard-step-3-content');
    const progressBar = document.getElementById('wizard-progress-bar');
    const node1 = document.getElementById('node-step-1');
    const node2 = document.getElementById('node-step-2');
    const node3 = document.getElementById('node-step-3');

    const btnNext1 = document.getElementById('btn-next-step-1');
    const btnNext2 = document.getElementById('btn-next-step-2');
    const btnPrev2 = document.getElementById('btn-prev-step-2');
    const btnPrev3 = document.getElementById('btn-prev-step-3');
    const bookingForm = document.getElementById('booking-appointment-form');

    function updateWizardState(step) {
      if (step === 1) {
        step1.classList.remove('d-none');
        step2.classList.add('d-none');
        step3.classList.add('d-none');
        progressBar.style.width = '33%';
        node1.classList.add('active');
        node2.classList.remove('active', 'completed');
        node3.classList.remove('active', 'completed');
      } else if (step === 2) {
        step1.classList.add('d-none');
        step2.classList.remove('d-none');
        step3.classList.add('d-none');
        progressBar.style.width = '66%';
        node1.classList.add('completed');
        node2.classList.add('active');
        node3.classList.remove('active', 'completed');
      } else if (step === 3) {
        step1.classList.add('d-none');
        step2.classList.add('d-none');
        step3.classList.remove('d-none');
        progressBar.style.width = '100%';
        node1.classList.add('completed');
        node2.classList.add('completed');
        node3.classList.add('active');
      }
    }

    if (btnNext1) {
      btnNext1.addEventListener('click', () => {
        const dateInput = document.getElementById('book-event-date');
        const cityInput = document.getElementById('book-event-city');
        let valid = true;

        if (!dateInput.value) {
          dateInput.classList.add('is-invalid');
          valid = false;
        } else {
          dateInput.classList.remove('is-invalid');
        }

        if (!cityInput.value.trim()) {
          cityInput.classList.add('is-invalid');
          valid = false;
        } else {
          cityInput.classList.remove('is-invalid');
        }

        if (valid) {
          updateWizardState(2);
        }
      });
    }

    if (btnNext2) {
      btnNext2.addEventListener('click', () => {
        const nameInput = document.getElementById('book-client-name');
        const phoneInput = document.getElementById('book-client-phone');
        const emailInput = document.getElementById('book-client-email');
        let valid = true;

        if (!nameInput.value.trim()) {
          nameInput.classList.add('is-invalid');
          valid = false;
        } else {
          nameInput.classList.remove('is-invalid');
        }

        if (!phoneInput.value.trim() || phoneInput.value.length < 6) {
          phoneInput.classList.add('is-invalid');
          valid = false;
        } else {
          phoneInput.classList.remove('is-invalid');
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value)) {
          emailInput.classList.add('is-invalid');
          valid = false;
        } else {
          emailInput.classList.remove('is-invalid');
        }

        if (valid) {
          updateWizardState(3);
        }
      });
    }

    if (btnPrev2) {
      btnPrev2.addEventListener('click', () => updateWizardState(1));
    }

    if (btnPrev3) {
      btnPrev3.addEventListener('click', () => updateWizardState(2));
    }

    // 10. ENVÍO Y CONFIRMACIÓN EN BOTTOM SHEET (Mobile Offcanvas de Bootstrap)
    const confirmationSheetEl = document.getElementById('confirmationBottomSheet');
    const confirmationSheet = confirmationSheetEl ? new bootstrap.Offcanvas(confirmationSheetEl) : null;

    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const names = document.getElementById('book-client-name')?.value || 'Pareja Estimada';
        const date = document.getElementById('book-event-date')?.value || 'A definir';
        const celebration = document.querySelector('input[name="book_type"]:checked')?.value || 'Boda';

        // Actualizar datos del modal / bottom sheet
        const sheetName = document.getElementById('sheet-summary-names');
        const sheetDate = document.getElementById('sheet-summary-date');
        const sheetType = document.getElementById('sheet-summary-type');

        if (sheetName) sheetName.textContent = names;
        if (sheetDate) sheetDate.textContent = date;
        if (sheetType) sheetType.textContent = celebration;

        if (confirmationSheet) {
          confirmationSheet.show();
        }

        // Notificación toast adicional
        if (toastInstance) {
          toastMsg.textContent = '¡Solicitud recibida! Te enviamos los detalles a tu email.';
          toastInstance.show();
        }

        // Reset wizard
        bookingForm.reset();
        updateWizardState(1);
      });
    }

    // 11. LINK ACTIVO SEGÚN SCROLL PARA MENÚ DESKTOP Y BOTTOM NAV MOBILE
    const sections = document.querySelectorAll('section[id]');
    const desktopLinks = document.querySelectorAll('.desktop-navigation .nav-anchor');
    const mobileLinks = document.querySelectorAll('.mobile-bottom-bar .bottom-bar-item');

    function highlightActiveNavigation() {
      const scrollPos = window.scrollY + 120;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          // Desktop
          desktopLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });

          // Mobile Bottom Nav
          mobileLinks.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-nav-target') === id) {
              item.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', highlightActiveNavigation);

  });
})();
