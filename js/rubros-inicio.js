/* =========================================================
   Busca tu proyecto (versión Inicio): chips de rubro, 3 cards
   del rubro elegido y link al buscador completo.
   ========================================================= */
(function () {
  var grid = document.getElementById("btpGrid");
  var chipsBox = document.getElementById("btpChips");
  if (!grid || !chipsBox) return;

  var WHATSAPP = "5493813019932";
  var IMG = "./assets/img/";
  var WA_PATH = "M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.3A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .8.8-2.95-.2-.3a8.2 8.2 0 1 1 6.9 3.78Zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.78.96-.14.17-.29.19-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.7 2.7 0 0 0-.85 2.02 4.7 4.7 0 0 0 1 2.5 10.8 10.8 0 0 0 4.13 3.65c1.54.66 2.14.72 2.91.6.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.17-.46-.28Z";
  var SHOWN = 3;

  function wa(msg) { return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg); }

  /* ---------- Datos de rubros (mismo contenido que busca-tu-proyecto.html) ----------
     caso: si existe un proyecto real, el mensaje dice "vi el proyecto X" */
  var CATS = {
    gas: "Gastronomía y Ocio", sal: "Salud y Bienestar", com: "Comercio y Retail",
    pro: "Servicios Profesionales", edu: "Educación y Formación",
    ofi: "Oficios y Vehículos", ent: "Entretenimiento y Eventos"
  };

  var RUBROS = [
    { cat: "ofi", t: "concesionarias de autos", d: "Stock filtrable, tasación online y ficha detallada por vehículo.", tags: ["Stock filtrable", "Tasación online", "Fichas"], img: "elgarage-home.webp", url: "/pages/oficios-vehiculos/concesionaria-auto.html", caso: "El Garage", demo: "https://elgarageautomovilesyb.com/", k: "auto autos usados agencia" },
    { cat: "ent", t: "complejos de pádel y canchas", d: "Reservas de turnos, pagos con Mercado Pago, torneos y panel para el dueño.", tags: ["Reservas", "Mercado Pago", "Torneos"], img: "padeltime-home.webp", url: "/pages/proyectos.html", caso: "PadelTime", demo: "https://padel-time-roan.vercel.app/", k: "padel futbol tenis canchas deporte club" },
    { cat: "gas", t: "restaurantes", d: "Menú digital, reservas online y gestión de mesas en un solo sistema.", tags: ["Menú QR", "Reservas", "Delivery"], img: "Restaurante.webp", url: "/pages/gastronomia/restaurante.html", k: "comida resto parrilla" },
    { cat: "sal", t: "gimnasios y centros de entrenamiento", d: "Reserva de clases, planes de membresía y seguimiento de turnos.", tags: ["Clases", "Membresías", "Turnos"], img: "gimnasio.webp", url: "/pages/salud/gimnasio.html", k: "gym crossfit fitness" },
    { cat: "com", t: "tiendas de ropa y moda", d: "Tienda online con talles, variantes de color y checkout rápido.", tags: ["E-commerce", "Variantes", "Checkout"], img: "ropa.webp", url: "/pages/comercio/ropa.html", k: "indumentaria boutique shop" },
    { cat: "pro", t: "inmobiliarias y bienes raíces", d: "Catálogo de propiedades, filtros avanzados y contacto directo por consulta.", tags: ["Propiedades", "Filtros", "Leads"], img: "inmobiliaria.webp", url: "/pages/servicios-profesionales/inmobiliarias.html", k: "casas alquiler venta" },
    { cat: "sal", t: "clínicas y consultorios médicos", d: "Turnos online, ficha de pacientes y recordatorios por WhatsApp o email.", tags: ["Turnos", "Pacientes", "Avisos"], img: "consultorio.webp", url: "/pages/salud/clinicas.html", k: "medico doctor salud" },
    { cat: "ofi", t: "talleres mecánicos y lubricentros", d: "Turnos online, presupuesto de reparaciones y recordatorios de service.", tags: ["Turnos", "Presupuestos", "Service"], img: "talleres%20mecanicos.webp", url: "/pages/oficios-vehiculos/talleres-lubricentros.html", k: "mecanico taller auto" },

    { cat: "gas", t: "cafeterías y pastelerías", d: "Catálogo de productos, pedidos para retirar y presencia online cuidada.", tags: ["Catálogo", "Pedidos", "Instagram Shop"], img: "pasteleria.webp", url: "/pages/gastronomia/cafeteria.html", k: "cafe panaderia" },
    { cat: "gas", t: "bares y cervecerías", d: "Carta digital, eventos y reservas de mesas para noches con buena rotación.", tags: ["Carta digital", "Eventos", "Reservas"], img: "Bar.webp", url: "/pages/gastronomia/bar.html", k: "cerveza pub" },
    { cat: "gas", t: "food trucks y comida rápida", d: "Pedidos online, ubicación en vivo y menú siempre actualizado.", tags: ["Pedidos", "Ubicación", "Menú"], img: "comida-rapida.webp", url: "/pages/gastronomia/comida-rapida.html", k: "hamburgueseria pizzeria rotiseria" },
    { cat: "gas", t: "hoteles y alojamientos boutique", d: "Motor de reservas propio, disponibilidad en tiempo real y pasarela de pagos.", tags: ["Reservas", "Pagos", "Multilenguaje"], img: "hoteles.webp", url: "/pages/gastronomia/hoteles.html", k: "hotel hostel cabañas" },
    { cat: "gas", t: "servicios de catering", d: "Catálogo de menús por evento, cotizador online y seguimiento de pedidos.", tags: ["Cotizador", "Menús", "Seguimiento"], img: "Catering.webp", url: "/pages/gastronomia/catering.html", k: "eventos comida" },
    { cat: "sal", t: "centros de estética y spas", d: "Agenda online, catálogo de tratamientos y recordatorios automáticos.", tags: ["Agenda", "Catálogo", "Recordatorios"], img: "estetica.webp", url: "/pages/salud/estetica.html", k: "belleza peluqueria uñas barberia" },
    { cat: "sal", t: "estudios de yoga y pilates", d: "Calendario de clases, cupos limitados y pagos de membresía online.", tags: ["Calendario", "Cupos", "Pagos"], img: "yoga.webp", url: "/pages/salud/yoga.html", k: "pilates meditacion" },
    { cat: "sal", t: "psicólogos y terapeutas", d: "Agenda de sesiones, videollamada integrada y recordatorios automáticos.", tags: ["Agenda", "Videollamada", "Recordatorios"], img: "psicologia.webp", url: "/pages/salud/psicologia.html", k: "terapia psicologia" },
    { cat: "sal", t: "nutricionistas", d: "Turnos online, seguimiento de planes y portal privado para pacientes.", tags: ["Turnos", "Portal", "Seguimiento"], img: "nutricionista.webp", url: "/pages/salud/nutricionista.html", k: "dieta nutricion" },
    { cat: "sal", t: "clínicas odontológicas", d: "Turnos online, historial clínico digital y recordatorios de control.", tags: ["Turnos", "Historial", "Recordatorios"], img: "odontologia.webp", url: "/pages/salud/odontologia.html", k: "dentista odontologo" },
    { cat: "com", t: "negocios de tecnología y celulares", d: "Catálogo con fichas técnicas, comparador y stock en tiempo real.", tags: ["Catálogo", "Comparador", "Stock"], img: "celulares.webp", url: "/pages/comercio/tecnologia-celulares.html", k: "celular electronica computacion" },
    { cat: "com", t: "supermercados y minimarkets", d: "Catálogo online, pedidos con delivery y carrito de compra simple.", tags: ["Catálogo", "Delivery", "Carrito"], img: "supermercado.webp", url: "/pages/comercio/supermercado.html", k: "almacen kiosco despensa" },
    { cat: "com", t: "ferreterías y corralones", d: "Catálogo por categorías, cotizador de materiales y pedidos a medida.", tags: ["Catálogo", "Cotizador", "Pedidos"], img: "corralon.webp", url: "/pages/comercio/ferreteria.html", k: "materiales construccion" },
    { cat: "com", t: "tiendas de decoración y hogar", d: "Tienda online con galería de productos y gestión de stock simple.", tags: ["E-commerce", "Galería", "Stock"], img: "hogar.webp", url: "/pages/comercio/decoracion-hogar.html", k: "muebles deco bazar" },
    { cat: "com", t: "joyerías y accesorios", d: "Catálogo premium, fichas de producto detalladas y pagos seguros.", tags: ["Catálogo premium", "Fichas", "Pagos"], img: "joyeria-card.webp", url: "/pages/comercio/joyerias.html", k: "joyas relojes bijou" },
    { cat: "com", t: "pet shops y veterinarias", d: "Turnos para consultas, tienda online y recordatorios de vacunación.", tags: ["Turnos", "Tienda", "Vacunas"], img: "veterinaria.webp", url: "/pages/comercio/veterinarias.html", k: "mascotas perros gatos veterinario" },
    { cat: "pro", t: "estudios de abogados", d: "Sitio institucional, consulta online y gestión de casos para el equipo.", tags: ["Institucional", "Consultas", "Casos"], img: "juridico.webp", url: "/pages/servicios-profesionales/estudio-juridico.html", k: "abogado juridico legal" },
    { cat: "pro", t: "estudios contables", d: "Portal de clientes, carga de documentación y turnos de consulta.", tags: ["Portal", "Documentación", "Turnos"], img: "contable.webp", url: "/pages/servicios-profesionales/estudio-contable.html", k: "contador impuestos" },
    { cat: "pro", t: "arquitectos y constructoras", d: "Portfolio de obras, cotizador de proyectos y formulario de consulta.", tags: ["Portfolio", "Cotizador", "Consultas"], img: "arquitectura%20card.webp", url: "/pages/servicios-profesionales/arquitecto.html", k: "arquitectura construccion obras" },
    { cat: "pro", t: "agencias de viaje y turismo", d: "Catálogo de paquetes, cotizador y reservas con seña online.", tags: ["Paquetes", "Cotizador", "Reservas"], img: "turismo.webp", url: "/pages/servicios-profesionales/turismo.html", k: "viajes turismo" },
    { cat: "pro", t: "consultoras de recursos humanos", d: "Portal de búsquedas laborales, postulación online y panel de candidatos.", tags: ["Empleos", "Postulación", "Candidatos"], img: "recursos%20humanos.webp", url: "/pages/servicios-profesionales/recursos-humanos.html", k: "rrhh empleo trabajo" },
    { cat: "edu", t: "academias de idiomas", d: "Inscripción online, niveles y horarios, y portal de alumnos.", tags: ["Inscripción", "Horarios", "Alumnos"], img: "idiomas.webp", url: "/pages/educacion-formacion/academia-idioma.html", k: "ingles idiomas" },
    { cat: "edu", t: "colegios e institutos", d: "Sitio institucional, inscripciones y comunicación con familias.", tags: ["Institucional", "Inscripciones", "Familias"], img: "colegios.webp", url: "/pages/educacion-formacion/institutos.html", k: "escuela colegio" },
    { cat: "edu", t: "academias de manejo", d: "Reserva de clases prácticas, turnos de examen y pagos online.", tags: ["Clases", "Exámenes", "Pagos"], img: "manejo.webp", url: "/pages/educacion-formacion/academia-manejo.html", k: "conducir autoescuela" },
    { cat: "edu", t: "creadores de cursos online", d: "Plataforma de cursos, pagos y acceso a contenido por membresía.", tags: ["Cursos", "Pagos", "Membresías"], img: "creador-cursos.webp", url: "/pages/educacion-formacion/creadores-cursos.html", k: "cursos coach capacitacion" },
    { cat: "ofi", t: "empresas de limpieza y mantenimiento", d: "Cotizador de servicios, agenda de visitas y seguimiento de órdenes.", tags: ["Cotizador", "Agenda", "Órdenes"], img: "limpieza%20y%20mantenimiento.webp", url: "/pages/oficios-vehiculos/limpieza.html", k: "limpieza mantenimiento" },
    { cat: "ofi", t: "empresas de logística y fletes", d: "Cotizador de envíos, seguimiento en vivo y gestión de pedidos.", tags: ["Envíos", "Seguimiento", "Pedidos"], img: "logistica%20y%20fletes.webp", url: "/pages/oficios-vehiculos/logistica-flete.html", k: "fletes mudanzas transporte" },
    { cat: "ofi", t: "servicios de seguridad", d: "Sitio institucional, cotizador de planes y formulario de contacto directo.", tags: ["Institucional", "Cotizador", "Contacto"], img: "seguridad.webp", url: "/pages/oficios-vehiculos/servicio-seguridad.html", k: "seguridad alarmas vigilancia" },
    { cat: "ent", t: "organizadores de eventos y bodas", d: "Portfolio de eventos, cotizador y formulario de consulta por fecha.", tags: ["Portfolio", "Cotizador", "Fechas"], img: "eventos%20bodas.webp", url: "/pages/entretenimiento-eventos/organizadores-eventos.html", k: "casamientos fiestas salon" }
  ];

  function msgFor(r) {
    return r.caso
      ? "Hola, vi el proyecto " + r.caso + " y quiero algo similar para mi negocio."
      : "Hola, vi la solución para " + r.t + " y quiero algo similar para mi negocio.";
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var waIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="' + WA_PATH + '"/></svg>';

  function card(r, i) {
    var verHref = r.demo || r.url;
    var verLabel = r.caso ? "Ver " + r.caso + " en vivo →" : "Ver ejemplo →";
    return '<article class="rubro" style="animation-delay:' + i * 60 + 'ms">' +
      '<div class="rubro__media">' +
        (r.caso ? '<span class="rubro__case">Caso real · ' + esc(r.caso) + "</span>" : "") +
        '<img src="' + IMG + r.img + '" alt="Proyecto para ' + esc(r.t) + '" loading="lazy">' +
        '<span class="rubro__cat">' + CATS[r.cat] + "</span>" +
      "</div>" +
      '<div class="rubro__body">' +
        '<h3 class="rubro__title">Para ' + esc(r.t) + "</h3>" +
        '<p class="rubro__desc">' + esc(r.d) + "</p>" +
        '<div class="rubro__tags">' + r.tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>" +
        '<div class="rubro__actions">' +
          '<a class="btn" href="' + wa(msgFor(r)) + '" target="_blank" rel="noopener">Quiero esto para mi negocio ' + waIcon + "</a>" +
          '<a class="rubro__ver" href="' + verHref + '"' + (r.demo ? ' target="_blank" rel="noopener"' : "") + ">" + verLabel + "</a>" +
        "</div>" +
      "</div>" +
    "</article>";
  }

  function render(cat) {
    var list = cat === "all" ? RUBROS : RUBROS.filter(function (r) { return r.cat === cat; });
    grid.innerHTML = list.slice(0, SHOWN).map(card).join("");
  }

  // Sin chip "Todos": al cargar se muestran las 3 cards por defecto y ningún rubro marcado
  var chips = Object.keys(CATS).map(function (k) { return [k, CATS[k]]; });
  chipsBox.innerHTML = chips.map(function (c) {
    return '<button class="chip" type="button" role="tab" data-cat="' + c[0] + '" aria-selected="false">' + c[1] + "</button>";
  }).join("");

  chipsBox.addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    chipsBox.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-selected", c === b); });
    render(b.dataset.cat);
  });

  render("all");
})();
