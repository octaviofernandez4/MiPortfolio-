document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('nav-abierto');
    });

    const links = mainNav.querySelectorAll('.nav-enlace, .nav-cta');
    links.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('nav-abierto');
      });
    });
  }

  const formTurno = document.getElementById('formTurno');
  const resultadoTurno = document.getElementById('resultadoTurno');

  if (formTurno && resultadoTurno) {
    formTurno.addEventListener('submit', (e) => {
      e.preventDefault();
      const servicio = document.getElementById('tipoServicio').value;
      const patente = document.getElementById('patenteAuto').value.toUpperCase();
      const fecha = document.getElementById('fechaTurno').value;
      const hora = document.getElementById('horaTurno').value;

      resultadoTurno.className = 'resultado-mensaje resultado-exito visible';
      resultadoTurno.textContent = `¡Turno solicitado con éxito! Patente: ${patente} | Fecha: ${fecha} a las ${hora} hs. Se ha enviado una confirmación a tu WhatsApp.`;
      formTurno.reset();
    });
  }

  const formPresupuesto = document.getElementById('formPresupuesto');
  const subtotalRepuestosEl = document.getElementById('subtotalRepuestos');
  const subtotalManoObraEl = document.getElementById('subtotalManoObra');
  const totalPresupuestoEl = document.getElementById('totalPresupuesto');
  const horasInput = document.getElementById('horasManoObra');
  const btnGenerarPresupuesto = document.getElementById('btnGenerarPresupuesto');
  const mensajePresupuesto = document.getElementById('mensajePresupuesto');
  const checkboxes = document.querySelectorAll('.check-item');
  const PRECIO_HORA_MANO_OBRA = 7000;

  function actualizarPresupuesto() {
    let subtotalRepuestos = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) {
        subtotalRepuestos += parseInt(cb.value, 10);
      }
    });

    const horas = parseInt(horasInput.value, 10) || 0;
    const subtotalManoObra = horas * PRECIO_HORA_MANO_OBRA;
    const total = subtotalRepuestos + subtotalManoObra;

    if (subtotalRepuestosEl) subtotalRepuestosEl.textContent = `$${subtotalRepuestos.toLocaleString('es-AR')}`;
    if (subtotalManoObraEl) subtotalManoObraEl.textContent = `$${subtotalManoObra.toLocaleString('es-AR')}`;
    if (totalPresupuestoEl) totalPresupuestoEl.textContent = `$${total.toLocaleString('es-AR')}`;
  }

  checkboxes.forEach(cb => cb.addEventListener('change', actualizarPresupuesto));
  if (horasInput) horasInput.addEventListener('input', actualizarPresupuesto);

  if (btnGenerarPresupuesto && mensajePresupuesto) {
    btnGenerarPresupuesto.addEventListener('click', () => {
      const total = totalPresupuestoEl ? totalPresupuestoEl.textContent : '$0';
      mensajePresupuesto.className = 'resultado-mensaje resultado-exito visible';
      mensajePresupuesto.textContent = `Presupuesto digital preparado (${total}). Listo para ser enviado al cliente con botón de aprobación por WhatsApp.`;
    });
  }

  const formContacto = document.getElementById('formContacto');
  const resultadoContacto = document.getElementById('resultadoContacto');

  if (formContacto && resultadoContacto) {
    formContacto.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('nombreContacto').value;
      const taller = document.getElementById('nombreTaller').value;

      resultadoContacto.className = 'resultado-mensaje resultado-exito visible';
      resultadoContacto.textContent = `¡Muchas gracias ${nombre}! Nos contactaremos a la brevedad para configurar la demo gratuita para ${taller}.`;
      formContacto.reset();
    });
  }
});
