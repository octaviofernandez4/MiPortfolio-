(function () {
  /**
   * AURA MOTORS - SCRIPT.JS
   * Lógica interactiva para concesionaria:
   * - Filtro dinámico de stock
   * - Fichas detalladas con modal dinámico
   * - Tasador online interactivo
   * - Calculadora de presupuesto de mantenimiento
   * - Formulario de recordatorio con validación y Toast
   * - Formulario de turno con Modal de confirmación
   * - Animaciones con IntersectionObserver y contadores numéricos
   * - Navbar fija con cambio de estilo y navegación activa
   */

  document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initIntersectionAnimations();
    initContadores();
    initFiltroStock();
    initFichasVehiculos();
    initTasadorOnline();
    initCalculadoraPresupuesto();
    initFormularios();
    initNavSmoothScroll();
  });

  /* ==========================================================================
     1. NAVBAR SCROLL Y ACTIVE LINKS
     ========================================================================== */
  function initNavbarScroll() {
    const header = document.getElementById('mainHeader');
    if (!header) return;

    const checkScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  function initNavSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-enlace');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 140;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { passive: true });
  }

  /* ==========================================================================
     2. ANIMACIONES CON INTERSECTION OBSERVER
     ========================================================================== */
  function initIntersectionAnimations() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      document.querySelectorAll('.elemento-animado, .item-auto').forEach(el => {
        el.classList.add('animado-visible');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animado-visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.elemento-animado, .grilla-stock').forEach(el => {
      observer.observe(el);
    });
  }

  /* ==========================================================================
     3. CONTADORES NUMÉRICOS ANIMADOS
     ========================================================================== */
  function initContadores() {
    const contadores = document.querySelectorAll('.numero-contador');
    if (!contadores.length) return;

    const animarContador = (el) => {
      const objetivo = parseInt(el.getAttribute('data-contador'), 10);
      const duracion = 2000;
      const inicioTiempo = performance.now();

      const actualizar = (tiempoActual) => {
        const transcurrido = tiempoActual - inicioTiempo;
        const progreso = Math.min(transcurrido / duracion, 1);
        // Easing out cubic
        const valorActual = Math.floor((1 - Math.pow(1 - progreso, 3)) * objetivo);
        el.textContent = valorActual.toLocaleString('es-AR');

        if (progreso < 1) {
          requestAnimationFrame(actualizar);
        } else {
          el.textContent = objetivo.toLocaleString('es-AR');
        }
      };

      requestAnimationFrame(actualizar);
    };

    const observerContadores = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animarContador(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    contadores.forEach(c => observerContadores.observe(c));
  }

  /* ==========================================================================
     4. FILTRADO DINÁMICO DE STOCK
     ========================================================================== */
  function initFiltroStock() {
    const inputBusqueda = document.getElementById('filtroBusqueda');
    const selectCategoria = document.getElementById('filtroCategoria');
    const selectPrecio = document.getElementById('filtroPrecio');
    const btnRestablecer = document.getElementById('btnLimpiarFiltros');
    const items = document.querySelectorAll('#contenedorAutos .item-auto');
    const alertaSinResultados = document.getElementById('sinResultados');

    if (!items.length) return;

    const filtrar = () => {
      const query = inputBusqueda.value.toLowerCase().trim();
      const categoria = selectCategoria.value;
      const rangoPrecio = selectPrecio.value;

      let visibles = 0;

      items.forEach(item => {
        const itemCategoria = item.getAttribute('data-categoria');
        const itemPrecio = parseInt(item.getAttribute('data-precio'), 10);
        const itemTexto = item.getAttribute('data-texto').toLowerCase();

        // Criterio de búsqueda por texto
        const coincideTexto = !query || itemTexto.includes(query);

        // Criterio por categoría
        const coincideCategoria = categoria === 'todos' || itemCategoria === categoria;

        // Criterio por precio
        let coincidePrecio = true;
        if (rangoPrecio === 'hasta-30k') {
          coincidePrecio = itemPrecio <= 30000;
        } else if (rangoPrecio === '30k-55k') {
          coincidePrecio = itemPrecio > 30000 && itemPrecio <= 55000;
        } else if (rangoPrecio === 'mas-55k') {
          coincidePrecio = itemPrecio > 55000;
        }

        if (coincideTexto && coincideCategoria && coincidePrecio) {
          item.classList.remove('d-none');
          item.style.display = '';
          visibles++;
        } else {
          item.classList.add('d-none');
          item.style.display = 'none';
        }
      });

      if (alertaSinResultados) {
        if (visibles === 0) {
          alertaSinResultados.classList.remove('d-none');
        } else {
          alertaSinResultados.classList.add('d-none');
        }
      }
    };

    inputBusqueda.addEventListener('input', filtrar);
    selectCategoria.addEventListener('change', filtrar);
    selectPrecio.addEventListener('change', filtrar);

    if (btnRestablecer) {
      btnRestablecer.addEventListener('click', () => {
        inputBusqueda.value = '';
        selectCategoria.value = 'todos';
        selectPrecio.value = 'todos';
        filtrar();
      });
    }
  }

  /* ==========================================================================
     5. FICHA DETALLADA POR VEHÍCULO (MODAL)
     ========================================================================== */
  const DATOS_VEHICULOS = {
    'audi-q3': {
      titulo: 'Audi Q3 Sportback S Line 45 TFSI',
      categoria: 'SUV Premium Certificado',
      precio: 'USD 48,500',
      imagen: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80',
      specs: [
        { clave: 'Año de Fabricación', valor: '2023' },
        { clave: 'Kilometraje', valor: '14,200 km comprobables' },
        { clave: 'Motor / Potencia', valor: '2.0 TFSI 230 CV Turbo' },
        { clave: 'Transmisión', valor: 'Automática S-Tronic 7 Vel + Levas' },
        { clave: 'Tracción', valor: 'Integral permanente Quattro' },
        { clave: 'Seguridad', valor: '6 Airbags + Frenado autónomo + ADAS' },
        { clave: 'Equipamiento', valor: 'Cockpit digital, Audio Bang & Olufsen' }
      ]
    },
    'bmw-330i': {
      titulo: 'BMW Serie 3 330i M Sport Mild Hybrid',
      categoria: 'Sedán Ejecutivo Deportivo',
      precio: 'USD 58,900',
      imagen: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
      specs: [
        { clave: 'Año de Fabricación', valor: '2024 (Patentado)' },
        { clave: 'Kilometraje', valor: '6,800 km reales' },
        { clave: 'Motor / Potencia', valor: 'TwinPower Turbo 2.0 258 CV' },
        { clave: 'Transmisión', valor: 'Steptronic Sport 8 marchas' },
        { clave: 'Paquete', valor: 'M Sport (Frenos M, Llantas 19", Butacas)' },
        { clave: 'Tecnología', valor: 'BMW Curved Display con Live Cockpit' },
        { clave: 'Garantía Restante', valor: '3 años o 100.000 km BMW Oficial' }
      ]
    },
    'ford-ranger': {
      titulo: 'Ford Ranger V6 Limited+ 4WD AT10',
      categoria: 'Pick-Up Mediana 4x4',
      precio: 'USD 52,000',
      imagen: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
      specs: [
        { clave: 'Año de Fabricación', valor: '2023' },
        { clave: 'Kilometraje', valor: '21,500 km' },
        { clave: 'Motor', valor: 'Lion 3.0L V6 Turbodiésel 250 CV 600 Nm' },
        { clave: 'Caja', valor: 'Automática de 10 velocidades con E-Shifter' },
        { clave: 'Capacidad de Carga', valor: '1.000 kg útil / 3.500 kg remolque' },
        { clave: 'Pantalla / Conectividad', valor: 'Sync 4 vertical de 12 pulgadas' },
        { clave: 'Estado', valor: 'Service de 20k recién efectuado' }
      ]
    },
    'vw-taos': {
      titulo: 'Volkswagen Taos Highline 250 TSI',
      categoria: 'SUV Familiar 5 Plazas',
      precio: 'USD 28,500',
      imagen: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
      specs: [
        { clave: 'Año de Fabricación', valor: '2022' },
        { clave: 'Kilometraje', valor: '29,400 km' },
        { clave: 'Motor', valor: '1.4 TSI Turbo 150 CV 250 Nm' },
        { clave: 'Transmisión', valor: 'Automática Tiptronic 6 velocidades' },
        { clave: 'Confort', valor: 'Techo panorámico corredizo + Tapizado cuero' },
        { clave: 'Seguridad', valor: 'Control de crucero adaptativo (ACC)' },
        { clave: 'Titularidad', valor: 'Única mano, services oficiales' }
      ]
    },
    'toyota-yaris': {
      titulo: 'Toyota Yaris Hatchback GR-Sport',
      categoria: 'Hatchback Deportivo de Ciudad',
      precio: 'USD 27,900',
      imagen: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=80',
      specs: [
        { clave: 'Año de Fabricación', valor: '2023' },
        { clave: 'Kilometraje', valor: '11,800 km' },
        { clave: 'Motor', valor: '1.5 Dual VVT-i 107 CV' },
        { clave: 'Transmisión', valor: 'Automática CVT de 7 marchas preseteadas' },
        { clave: 'Suspensión', valor: 'Calibración Gazoo Racing Sport' },
        { clave: 'Equipamiento', valor: 'Llantas exclusivas 16", Ópticas Full LED' },
        { clave: 'Consumo Mixto', valor: '6.4 L / 100 km' }
      ]
    },
    'mercedes-c200': {
      titulo: 'Mercedes-Benz C200 Avantgarde AMG-Line',
      categoria: 'Sedán Ejecutivo de Alta Gama',
      precio: 'USD 64,000',
      imagen: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80',
      specs: [
        { clave: 'Año de Fabricación', valor: '2023' },
        { clave: 'Kilometraje', valor: '8,400 km' },
        { clave: 'Motor', valor: '2.0 Turbo Mild-Hybrid EQ Boost (204+20 CV)' },
        { clave: 'Transmisión', valor: '9G-Tronic (9 marchas con levas)' },
        { clave: 'Interior', valor: 'MBUX de 11.9" táctil con navegación 3D' },
        { clave: 'Iluminación', valor: 'Digital Light inteligente con proyección' },
        { clave: 'Origen', valor: 'Alemania - Garantía vigente' }
      ]
    }
  };

  function initFichasVehiculos() {
    const botonesFicha = document.querySelectorAll('.btn-ver-ficha');
    const modalElement = document.getElementById('modalFichaVehiculo');
    if (!modalElement) return;

    const modalBootstrap = new bootstrap.Modal(modalElement);
    const tituloEl = document.getElementById('modalFichaTitulo');
    const catEl = document.getElementById('modalFichaCategoria');
    const precioEl = document.getElementById('modalFichaPrecio');
    const imgEl = document.getElementById('modalFichaImg');
    const specsEl = document.getElementById('modalFichaSpecs');
    const btnInteres = document.getElementById('btnModalInteres');

    botonesFicha.forEach(btn => {
      btn.addEventListener('click', () => {
        const autoKey = btn.getAttribute('data-auto');
        const data = DATOS_VEHICULOS[autoKey];
        if (!data) return;

        tituloEl.textContent = data.titulo;
        catEl.textContent = data.categoria;
        precioEl.textContent = data.precio;
        imgEl.src = data.imagen;
        imgEl.alt = data.titulo;

        specsEl.innerHTML = '';
        data.specs.forEach(s => {
          const li = document.createElement('li');
          li.innerHTML = `<span>${s.clave}</span><strong>${s.valor}</strong>`;
          specsEl.appendChild(li);
        });

        if (btnInteres) {
          btnInteres.onclick = () => {
            modalBootstrap.hide();
            mostrarToast(`Interés registrado para: ${data.titulo}. Te contactaremos de inmediato.`);
          };
        }

        modalBootstrap.show();
      });
    });
  }

  /* ==========================================================================
     6. TASADOR ONLINE EXPRESS
     ========================================================================== */
  function initTasadorOnline() {
    const form = document.getElementById('formTasacion');
    const cajaResultado = document.getElementById('cajaResultadoTasacion');
    const montoResultado = document.getElementById('resultadoValorEstimado');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      const anio = parseInt(document.getElementById('tasacionAnio').value, 10) || 2021;
      const km = parseInt(document.getElementById('tasacionKilometros').value, 10) || 40000;
      const estado = document.getElementById('tasacionEstado').value;

      // Base de cálculo paramétrica
      let base = 25000;
      if (anio >= 2024) base = 38000;
      else if (anio >= 2022) base = 30000;
      else if (anio >= 2020) base = 23000;
      else base = 17000;

      // Ajuste por km
      if (km < 25000) base *= 1.1;
      else if (km > 70000) base *= 0.88;

      // Ajuste por estado
      if (estado === 'excelente') base *= 1.08;
      else if (estado === 'bueno') base *= 0.92;

      const min = Math.round((base * 0.95) / 100) * 100;
      const max = Math.round((base * 1.05) / 100) * 100;

      montoResultado.textContent = `USD ${min.toLocaleString('es-AR')} - USD ${max.toLocaleString('es-AR')}`;
      cajaResultado.classList.remove('d-none');
      cajaResultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      mostrarToast('Tasación preliminar calculada con éxito.');
    });
  }

  /* ==========================================================================
     7. CALCULADORA DE PRESUPUESTO POSTVENTA
     ========================================================================== */
  function initCalculadoraPresupuesto() {
    const selectSegmento = document.getElementById('calcSegmento');
    const selectServicio = document.getElementById('calcServicio');
    const checkboxes = document.querySelectorAll('.check-adicional');
    const displayTotal = document.getElementById('calcTotal');
    if (!selectSegmento || !selectServicio || !displayTotal) return;

    const preciosBase = {
      'compacto': 120,
      'suv': 160,
      'alta-gama': 240,
      'pickup': 210
    };

    const multiplicadorServicio = {
      'service-10k': 1.0,
      'service-50k': 1.8,
      'frenos': 1.25,
      'alineacion': 0.45,
      'diagnostico': 0.35
    };

    const calcular = () => {
      const segmento = selectSegmento.value;
      const servicio = selectServicio.value;
      const base = preciosBase[segmento] || 150;
      const mult = multiplicadorServicio[servicio] || 1;

      let subtotal = Math.round(base * mult);

      checkboxes.forEach(cb => {
        if (cb.checked) {
          subtotal += parseInt(cb.value, 10);
        }
      });

      displayTotal.textContent = `$${subtotal} USD`;
    };

    selectSegmento.addEventListener('change', calcular);
    selectServicio.addEventListener('change', calcular);
    checkboxes.forEach(cb => cb.addEventListener('change', calcular));
    calcular();
  }

  /* ==========================================================================
     8. FORMULARIOS: RECORDATORIO, TURNO ONLINE Y CONTACTO
     ========================================================================== */
  function initFormularios() {
    // Formulario Recordatorio de Service
    const formRecordatorio = document.getElementById('formRecordatorio');
    if (formRecordatorio) {
      formRecordatorio.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!formRecordatorio.checkValidity()) {
          e.stopPropagation();
          formRecordatorio.classList.add('was-validated');
          return;
        }
        mostrarToast('¡Recordatorio programado! Te avisaremos vía WhatsApp y correo.');
        formRecordatorio.reset();
        formRecordatorio.classList.remove('was-validated');
      });
    }

    // Formulario Turno Taller Modal
    const formTurno = document.getElementById('formTurnoModal');
    const modalTurnoEl = document.getElementById('modalTurno');
    const modalConfirmadoEl = document.getElementById('modalTurnoConfirmado');
    const textoDetalleTurno = document.getElementById('textoDetalleTurno');

    if (formTurno && modalTurnoEl && modalConfirmadoEl) {
      const bsModalTurno = bootstrap.Modal.getInstance(modalTurnoEl) || new bootstrap.Modal(modalTurnoEl);
      const bsModalConfirmado = new bootstrap.Modal(modalConfirmadoEl);

      formTurno.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!formTurno.checkValidity()) {
          e.stopPropagation();
          formTurno.classList.add('was-validated');
          return;
        }

        const nombre = document.getElementById('turnoNombre').value;
        const fecha = document.getElementById('turnoFecha').value;
        const hora = document.getElementById('turnoHorario').value;

        bsModalTurno.hide();
        textoDetalleTurno.textContent = `Turno reservado para ${nombre} el día ${fecha} a las ${hora} hs. Código de atención: #AR-${Math.floor(1000 + Math.random() * 9000)}`;
        bsModalConfirmado.show();

        formTurno.reset();
        formTurno.classList.remove('was-validated');
      });
    }

    // Formulario de Contacto Directo
    const formContacto = document.getElementById('formContactoDirecto');
    if (formContacto) {
      formContacto.addEventListener('submit', (e) => {
        e.preventDefault();
        mostrarToast('Gracias por tu mensaje. Un asesor te responderá a la brevedad.');
        formContacto.reset();
      });
    }
  }

  /* ==========================================================================
     9. HELPER: TOAST DE ÉXITO
     ========================================================================== */
  function mostrarToast(mensaje) {
    const toastEl = document.getElementById('toastExito');
    const toastMensaje = document.getElementById('toastMensaje');
    if (!toastEl || !toastMensaje) return;

    toastMensaje.textContent = mensaje;
    const toast = new bootstrap.Toast(toastEl, { delay: 4500 });
    toast.show();
  }
})();
