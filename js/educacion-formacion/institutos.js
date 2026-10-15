document.addEventListener('DOMContentLoaded', () => {
  // Navegación móvil hamburguesa
  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      const activo = mainNav.classList.toggle('activo');
      menuBtn.classList.toggle('activo');
      menuBtn.setAttribute('aria-expanded', activo);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('activo');
        menuBtn.classList.remove('activo');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Acordeón FAQ para comunicación con familias
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-pregunta');
    const resp = item.querySelector('.faq-respuesta');

    if (btn && resp) {
      btn.addEventListener('click', () => {
        const estaAbierto = item.classList.contains('abierto');

        // Cierre de otros elementos para efecto acordeón limpio
        faqItems.forEach(otro => {
          if (otro !== item) {
            otro.classList.remove('abierto');
            const otroBtn = otro.querySelector('.faq-pregunta');
            const otroResp = otro.querySelector('.faq-respuesta');
            if (otroBtn) otroBtn.setAttribute('aria-expanded', 'false');
            if (otroResp) otroResp.style.maxHeight = null;
          }
        });

        if (estaAbierto) {
          item.classList.remove('abierto');
          btn.setAttribute('aria-expanded', 'false');
          resp.style.maxHeight = null;
        } else {
          item.classList.add('abierto');
          btn.setAttribute('aria-expanded', 'true');
          resp.style.maxHeight = resp.scrollHeight + 'px';
        }
      });
    }
  });

  // Validación y envío del formulario de inscripciones
  const form = document.getElementById('inscripcionForm');
  const feedback = document.getElementById('formFeedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let esValido = true;
      const camposRequeridos = form.querySelectorAll('[required]');

      camposRequeridos.forEach(campo => {
        const grupo = campo.closest('.form-group');
        let validoCampo = true;

        if (campo.tagName.toLowerCase() === 'select') {
          if (!campo.value) validoCampo = false;
        } else if (campo.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(campo.value.trim())) validoCampo = false;
        } else {
          if (!campo.value.trim()) validoCampo = false;
        }

        if (!validoCampo) {
          esValido = false;
          if (grupo) grupo.classList.add('invalido');
        } else {
          if (grupo) grupo.classList.remove('invalido');
        }
      });

      if (esValido && feedback) {
        feedback.textContent = '¡Gracias por comunicarte con nosotros! Hemos recibido tu solicitud. Nuestro equipo de admisiones se pondrá en contacto dentro de las próximas 24 horas.';
        feedback.className = 'form-feedback exito';
        form.reset();

        setTimeout(() => {
          feedback.style.display = 'none';
          feedback.className = 'form-feedback';
        }, 8000);
      }
    });

    // Limpieza de error en tiempo real al escribir
    form.querySelectorAll('.form-input, .form-select').forEach(elem => {
      elem.addEventListener('input', () => {
        const grupo = elem.closest('.form-group');
        if (grupo) grupo.classList.remove('invalido');
      });
      elem.addEventListener('change', () => {
        const grupo = elem.closest('.form-group');
        if (grupo) grupo.classList.remove('invalido');
      });
    });
  }
});
