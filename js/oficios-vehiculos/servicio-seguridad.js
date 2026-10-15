(() => {
  "use strict";

  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esMobile = () => window.matchMedia("(max-width: 767.98px)").matches;
  const formatoPesos = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

  const $ = (selector, contexto = document) => contexto.querySelector(selector);
  const $$ = (selector, contexto = document) => Array.from(contexto.querySelectorAll(selector));

  document.body.classList.add("cargando");

  function ocultarCarga() {
    const pantalla = $("#pantallaCarga");
    if (!pantalla) return;
    pantalla.classList.add("oculta");
    document.body.classList.remove("cargando");
    iniciarHero();
    setTimeout(() => pantalla.remove(), 700);
  }

  const inicioCarga = performance.now();
  function alCargar() {
    const espera = Math.max(0, (reducirMovimiento ? 0 : 900) - (performance.now() - inicioCarga));
    setTimeout(ocultarCarga, espera);
  }

  if (document.readyState === "complete") {
    alCargar();
  } else {
    window.addEventListener("load", alCargar, { once: true });
  }

  function iniciarHero() {
    const hero = $(".hero");
    const titulo = $("#heroTitulo");
    if (!hero || !titulo) return;
    $$(".palabra", titulo).forEach((palabra, i) => {
      palabra.style.transitionDelay = `${0.15 + i * 0.12}s`;
    });
    requestAnimationFrame(() => {
      titulo.classList.add("animado");
      hero.classList.add("listo");
    });
  }

  const barraProgreso = $("#barraProgreso");
  const header = $("#headerPrincipal");
  const heroFondo = $("#heroFondo");
  let scrollPendiente = false;

  function actualizarScroll() {
    const y = window.scrollY;
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    if (barraProgreso) barraProgreso.style.transform = `scaleX(${alto > 0 ? y / alto : 0})`;
    if (header) header.classList.toggle("scrolleado", y > 40);
    if (heroFondo && !reducirMovimiento && y < window.innerHeight * 1.2) {
      heroFondo.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
    }
    scrollPendiente = false;
  }

  window.addEventListener("scroll", () => {
    if (!scrollPendiente) {
      scrollPendiente = true;
      requestAnimationFrame(actualizarScroll);
    }
  }, { passive: true });
  actualizarScroll();

  $$("[data-escalonado]").forEach((grupo) => {
    $$("[data-anim]", grupo).forEach((hijo, i) => {
      hijo.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  const animados = $$("[data-anim]");
  if (reducirMovimiento || !("IntersectionObserver" in window)) {
    animados.forEach((el) => el.classList.add("visible"));
  } else {
    const observadorAnim = new IntersectionObserver((entradas, obs) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        const el = entrada.target;
        el.classList.add("visible");
        el.addEventListener("transitionend", () => { el.style.transitionDelay = ""; }, { once: true });
        obs.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    animados.forEach((el) => observadorAnim.observe(el));
  }

  function animarContador(el) {
    const objetivo = Number(el.dataset.objetivo) || 0;
    if (reducirMovimiento) {
      el.textContent = formatoPesos.format(objetivo);
      return;
    }
    const duracion = 1800;
    const inicio = performance.now();
    const paso = (ahora) => {
      const progreso = Math.min((ahora - inicio) / duracion, 1);
      const suavizado = 1 - Math.pow(1 - progreso, 3);
      el.textContent = formatoPesos.format(Math.round(objetivo * suavizado));
      if (progreso < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  const contadores = $$(".contador");
  if ("IntersectionObserver" in window) {
    const observadorContadores = new IntersectionObserver((entradas, obs) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          animarContador(entrada.target);
          obs.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.6 });
    contadores.forEach((c) => observadorContadores.observe(c));
  } else {
    contadores.forEach(animarContador);
  }

  document.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".btn-ripple");
    if (!boton || reducirMovimiento) return;
    const rect = boton.getBoundingClientRect();
    const tamano = Math.max(rect.width, rect.height);
    const onda = document.createElement("span");
    onda.className = "ripple";
    onda.style.width = onda.style.height = `${tamano}px`;
    onda.style.left = `${evento.clientX - rect.left - tamano / 2}px`;
    onda.style.top = `${evento.clientY - rect.top - tamano / 2}px`;
    boton.appendChild(onda);
    onda.addEventListener("animationend", () => onda.remove());
  });

  const puedeInclinar = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
  $$(".tarjeta-3d").forEach((tarjeta) => {
    tarjeta.addEventListener("mousemove", (e) => {
      if (!puedeInclinar.matches || reducirMovimiento) return;
      const rect = tarjeta.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tarjeta.classList.add("inclinando");
      tarjeta.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateY(-8px)`;
    });
    tarjeta.addEventListener("mouseleave", () => {
      tarjeta.classList.remove("inclinando");
      tarjeta.style.transform = "";
    });
  });

  const linksMenu = $$(".menu-links .nav-link");
  const itemsBottom = $$(".bottom-nav-item");
  const menuColapsable = $("#menuPrincipal");

  function marcarActivo(idSeccion, grupoBottom) {
    linksMenu.forEach((link) => link.classList.toggle("activo", link.getAttribute("href") === `#${idSeccion}`));
    itemsBottom.forEach((item) => item.classList.toggle("activo", item.dataset.destino === grupoBottom));
  }

  const secciones = $$("main section[id]");
  if ("IntersectionObserver" in window) {
    const observadorSecciones = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          const seccion = entrada.target;
          marcarActivo(seccion.id, seccion.dataset.seccion || "inicio");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secciones.forEach((s) => observadorSecciones.observe(s));
  }

  $$('a[href^="#"]').forEach((enlace) => {
    enlace.addEventListener("click", (e) => {
      const id = enlace.getAttribute("href");
      if (id.length < 2) return;
      const destino = $(id);
      if (!destino) return;
      e.preventDefault();
      const offset = esMobile() ? 64 : 80;
      const top = destino.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: reducirMovimiento ? "auto" : "smooth" });
      if (menuColapsable && menuColapsable.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(menuColapsable).hide();
      }
    });
  });

  const toastEl = $("#toastExito");
  const toast = toastEl ? bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4500 }) : null;

  function mostrarToast(titulo, mensaje) {
    if (!toast) return;
    $("#toastTitulo").textContent = titulo;
    $("#toastMensaje").textContent = mensaje;
    toast.show();
  }

  const formCotizador = $("#formCotizador");
  const rangoPuestos = $("#rangoPuestos");
  const valorPuestos = $("#valorPuestos");
  const resumenTotal = $("#resumenTotal");
  const resumenPlan = $("#resumenPlan");
  const resumenDetalle = $("#resumenDetalle");
  const resumenPrecio = $(".resumen-precio");
  let ultimaCotizacion = null;

  function calcularCotizacion() {
    if (!formCotizador) return;
    const servicio = $('input[name="servicio"]:checked', formCotizador);
    const propiedad = $('input[name="propiedad"]:checked', formCotizador);
    const cobertura = $('input[name="cobertura"]:checked', formCotizador);
    const puestos = Number(rangoPuestos.value);
    const conApp = $("#extraApp").checked;
    const conMovil = $("#extraMovil").checked;

    const base = Number(servicio.dataset.precio);
    let total = base * Number(propiedad.dataset.factor) * Number(cobertura.dataset.factor);
    total *= 1 + (puestos - 1) * 0.85;
    if (conApp) total += 18000;
    if (conMovil) total += 95000;
    total = Math.round(total / 1000) * 1000;

    const nombrePlan = total < 150000 ? "Plan Esencial" : total < 1500000 ? "Plan Profesional" : total < 4000000 ? "Plan Empresa" : "Plan Corporativo";

    valorPuestos.textContent = puestos;
    resumenTotal.textContent = formatoPesos.format(total);
    resumenPlan.textContent = nombrePlan;

    const detalle = [
      ["bi-shield-check", servicio.dataset.nombre],
      ["bi-building", propiedad.dataset.nombre],
      ["bi-clock", `Cobertura ${cobertura.dataset.nombre}`],
      ["bi-grid-3x3-gap", `${puestos} ${puestos === 1 ? "puesto / zona" : "puestos / zonas"}`]
    ];
    if (conApp) detalle.push(["bi-phone", "App con cámaras en vivo"]);
    if (conMovil) detalle.push(["bi-car-front", "Patrulla móvil de apoyo"]);

    resumenDetalle.replaceChildren(...detalle.map(([icono, texto]) => {
      const li = document.createElement("li");
      const i = document.createElement("i");
      i.className = `bi ${icono}`;
      li.append(i, document.createTextNode(texto));
      return li;
    }));

    resumenPrecio.classList.remove("actualizado");
    void resumenPrecio.offsetWidth;
    resumenPrecio.classList.add("actualizado");

    ultimaCotizacion = { servicio: servicio.value, plan: nombrePlan, total };
  }

  if (formCotizador) {
    formCotizador.addEventListener("input", calcularCotizacion);
    formCotizador.addEventListener("change", calcularCotizacion);
    calcularCotizacion();
  }

  const mapaServicioTurno = {
    vigilancia: "Vigilancia física",
    alarmas: "Alarmas y monitoreo",
    cctv: "Cámaras CCTV",
    acceso: "Control de acceso"
  };

  const btnSolicitarPlan = $("#btnSolicitarPlan");
  if (btnSolicitarPlan) {
    btnSolicitarPlan.addEventListener("click", () => {
      if (!ultimaCotizacion) return;
      const valor = mapaServicioTurno[ultimaCotizacion.servicio];
      const opcion = $(`input[name="turnoServicio"][value="${valor}"]`);
      if (opcion) opcion.checked = true;
      const notas = $("#turnoNotas");
      if (notas && !notas.value) {
        notas.value = `Me interesa el ${ultimaCotizacion.plan} cotizado en $${formatoPesos.format(ultimaCotizacion.total)}/mes.`;
      }
    });
  }

  const formTurno = $("#formTurno");
  const pasos = $$(".wizard-paso", formTurno);
  const indicadores = $$(".wizard-indicador");
  const barraWizard = $("#wizardBarra");
  const btnAnterior = $("#wizardAnterior");
  const btnSiguiente = $("#wizardSiguiente");
  const btnEnviar = $("#wizardEnviar");
  const campoFecha = $("#turnoFecha");
  let pasoActual = 1;

  if (campoFecha) {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    campoFecha.min = manana.toISOString().split("T")[0];
  }

  function validarPaso(numero) {
    const paso = pasos[numero - 1];
    let valido = true;

    const gruposRadio = new Set($$('input[type="radio"]', paso).map((r) => r.name));
    gruposRadio.forEach((nombre) => {
      const marcado = $(`input[name="${nombre}"]:checked`, paso);
      const error = $(`[data-error="${nombre}"]`, paso);
      if (error) error.classList.toggle("visible", !marcado);
      if (!marcado) valido = false;
    });

    const campos = $$(".campo", paso);
    campos.forEach((campo) => {
      if (campo.type === "date" && campo.value && campo.value < campo.min) {
        campo.setCustomValidity("fecha");
      } else {
        campo.setCustomValidity("");
      }
      if (!campo.checkValidity()) valido = false;
    });

    paso.classList.add("was-validated");
    if (!valido) {
      const primero = $(".campo:invalid", paso);
      if (primero) primero.focus();
    }
    return valido;
  }

  function irAPaso(numero, haciaAtras = false) {
    pasoActual = numero;
    pasos.forEach((paso, i) => {
      paso.classList.toggle("activo", i === numero - 1);
      paso.classList.toggle("atras", haciaAtras);
    });
    indicadores.forEach((ind, i) => {
      ind.classList.toggle("activo", i === numero - 1);
      ind.classList.toggle("completo", i < numero - 1);
    });
    const porcentaje = Math.round((numero / pasos.length) * 100);
    barraWizard.style.width = `${porcentaje}%`;
    barraWizard.parentElement.setAttribute("aria-valuenow", porcentaje);
    btnAnterior.disabled = numero === 1;
    btnSiguiente.classList.toggle("d-none", numero === pasos.length);
    btnEnviar.classList.toggle("d-none", numero !== pasos.length);

    const contenedor = $(".wizard-contenedor");
    if (contenedor && contenedor.getBoundingClientRect().top < 0) {
      window.scrollTo({ top: contenedor.getBoundingClientRect().top + window.scrollY - 90, behavior: reducirMovimiento ? "auto" : "smooth" });
    }
  }

  if (formTurno) {
    $$('input[type="radio"]', formTurno).forEach((radio) => {
      radio.addEventListener("change", () => {
        const error = $(`[data-error="${radio.name}"]`, formTurno);
        if (error) error.classList.remove("visible");
      });
    });

    btnSiguiente.addEventListener("click", () => {
      if (validarPaso(pasoActual)) irAPaso(pasoActual + 1);
    });

    btnAnterior.addEventListener("click", () => {
      if (pasoActual > 1) irAPaso(pasoActual - 1, true);
    });

    formTurno.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validarPaso(pasoActual)) return;
      abrirConfirmacion();
    });
  }

  const modalTurno = $("#modalTurno") ? bootstrap.Modal.getOrCreateInstance($("#modalTurno")) : null;
  const hojaTurno = $("#hojaTurno") ? bootstrap.Offcanvas.getOrCreateInstance($("#hojaTurno")) : null;

  function formatearFecha(valor) {
    const [anio, mes, dia] = valor.split("-").map(Number);
    return new Date(anio, mes - 1, dia).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  }

  function abrirConfirmacion() {
    const datos = [
      ["Servicio", $('input[name="turnoServicio"]:checked').value, false],
      ["Nombre", $("#turnoNombre").value.trim(), false],
      ["Teléfono", $("#turnoTelefono").value.trim(), true],
      ["Dirección", $("#turnoDireccion").value.trim(), false],
      ["Fecha", formatearFecha(campoFecha.value), false],
      ["Horario", `${$('input[name="turnoHorario"]:checked').value} h`, true]
    ];

    $$("[data-resumen-turno]").forEach((lista) => {
      lista.replaceChildren(...datos.map(([etiqueta, valor, numerico]) => {
        const fila = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = etiqueta;
        dd.textContent = valor;
        if (numerico) dd.className = "numero";
        fila.append(dt, dd);
        return fila;
      }));
    });

    if (esMobile()) {
      hojaTurno.show();
    } else {
      modalTurno.show();
    }
  }

  $$("[data-confirmar-turno]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const nombre = $("#turnoNombre").value.trim().split(" ")[0];
      modalTurno.hide();
      hojaTurno.hide();
      formTurno.reset();
      pasos.forEach((p) => p.classList.remove("was-validated"));
      irAPaso(1, true);
      mostrarToast("¡Visita agendada!", `Gracias ${nombre}, un asesor te llamará para confirmar el horario.`);
    });
  });

  const formContacto = $("#formContacto");
  if (formContacto) {
    formContacto.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!formContacto.checkValidity()) {
        formContacto.classList.add("was-validated");
        const primero = $(":invalid", formContacto);
        if (primero) primero.focus();
        return;
      }
      const nombre = $("#contactoNombre").value.trim().split(" ")[0];
      formContacto.reset();
      formContacto.classList.remove("was-validated");
      mostrarToast("¡Mensaje enviado!", `Gracias ${nombre}, te respondemos en menos de 2 horas hábiles.`);
    });
  }
})();
