document.addEventListener('DOMContentLoaded', () => {
  // 1. Menú Hamburguesa Móvil
  const botonMenu = document.querySelector('.menu-hamburguesa');
  const navegacion = document.querySelector('.navegacion');
  const enlacesNav = document.querySelectorAll('.enlace-navegacion');

  if (botonMenu && navegacion) {
    botonMenu.addEventListener('click', () => {
      const estaAbierto = navegacion.classList.toggle('abierta');
      botonMenu.classList.toggle('activo');
      botonMenu.setAttribute('aria-expanded', String(estaAbierto));
    });

    enlacesNav.forEach(enlace => {
      enlace.addEventListener('click', () => {
        navegacion.classList.remove('abierta');
        botonMenu.classList.remove('activo');
        botonMenu.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Conmutador de Precios (Mensual / Anual)
  const conmutador = document.getElementById('conmutador-precios');
  const montos = document.querySelectorAll('.monto');

  if (conmutador) {
    conmutador.addEventListener('click', () => {
      const esAnual = conmutador.classList.toggle('activo');
      conmutador.setAttribute('aria-checked', String(esAnual));

      montos.forEach(monto => {
        const valorMensual = monto.getAttribute('data-mensual');
        const valorAnual = monto.getAttribute('data-anual');
        monto.textContent = esAnual ? valorAnual : valorMensual;
      });
    });
  }

  // 3. Acordeón de Preguntas Frecuentes (FAQ)
  const botonesAcordeon = document.querySelectorAll('.boton-acordeon');

  botonesAcordeon.forEach(boton => {
    boton.addEventListener('click', () => {
      const item = boton.closest('.item-acordeon');
      const panel = item ? item.querySelector('.panel-acordeon') : null;
      if (!item || !panel) return;

      const estaAbierto = item.classList.contains('abierto');

      // Cerrar otros acordeones abiertos
      document.querySelectorAll('.item-acordeon').forEach(otroItem => {
        if (otroItem !== item) {
          otroItem.classList.remove('abierto');
          const otroBoton = otroItem.querySelector('.boton-acordeon');
          const otroPanel = otroItem.querySelector('.panel-acordeon');
          if (otroBoton) otroBoton.setAttribute('aria-expanded', 'false');
          if (otroPanel) otroPanel.style.maxHeight = null;
        }
      });

      // Alternar el actual
      if (estaAbierto) {
        item.classList.remove('abierto');
        boton.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('abierto');
        boton.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // 4. Validación de Formulario de Registro
  const formulario = document.getElementById('formulario-registro');
  const mensajeFormulario = document.getElementById('mensaje-formulario');

  if (formulario && mensajeFormulario) {
    formulario.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputNombre = document.getElementById('nombre-creador');
      const inputEmail = document.getElementById('email-creador');
      const inputAcademia = document.getElementById('academia-nombre');

      const nombre = inputNombre ? inputNombre.value.trim() : '';
      const email = inputEmail ? inputEmail.value.trim() : '';
      const academia = inputAcademia ? inputAcademia.value.trim() : '';

      // Validación simple de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nombre || !email || !academia) {
        mostrarMensaje('Por favor completá todos los campos para continuar.', 'error');
        return;
      }

      if (!emailRegex.test(email)) {
        mostrarMensaje('Por favor ingresá un correo electrónico válido.', 'error');
        return;
      }

      mostrarMensaje(`¡Excelente ${nombre}! Creando tu academia "${academia}"...`, 'exito');
      formulario.reset();

      setTimeout(() => {
        mostrarMensaje('Te enviamos un enlace de acceso inicial a tu correo.', 'exito');
      }, 2000);
    });
  }

  function mostrarMensaje(texto, tipo) {
    if (!mensajeFormulario) return;
    mensajeFormulario.textContent = texto;
    mensajeFormulario.className = `mensaje-formulario ${tipo}`;
  }
});
