(function() {
  /* script.js - Academia de Manejo AutoDrive
     Lógica JavaScript 100% pura y desacoplada
  */

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Manejo de Pestañas (Tabs: Clases Prácticas, Turnos Examen, Pagos Online)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });

    // 2. Selección de Chips (Días y Horarios)
    function setupChipSelection(containerSelector) {
      const containers = document.querySelectorAll(containerSelector);
      containers.forEach(container => {
        const chips = container.querySelectorAll('.chip-btn');
        chips.forEach(chip => {
          chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
          });
        });
      });
    }
    setupChipSelection('.chips-grid');

    // 3. Selección de Tarjetas de Planes de Pago
    const planCards = document.querySelectorAll('.plan-card');
    planCards.forEach(card => {
      card.addEventListener('click', () => {
        planCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
        }
      });
    });

    // 4. Selección de Método de Pago
    const payMethods = document.querySelectorAll('.pay-method-btn');
    payMethods.forEach(method => {
      method.addEventListener('click', () => {
        payMethods.forEach(m => m.classList.remove('selected'));
        method.classList.add('selected');
      });
    });

    // 5. Modal de Confirmación y Resumen Interactivo
    const modal = document.getElementById('confirmationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalDetails = document.getElementById('modalDetails');
    const closeModalBtn = document.getElementById('closeModalBtn');

    function openConfirmationModal(title, desc, details) {
      if (!modal) return;
      modalTitle.textContent = title;
      modalDesc.textContent = desc;

      let detailsHtml = '';
      for (const [key, val] of Object.entries(details)) {
        detailsHtml += `
          <div class="modal-summary-row">
            <span class="summary-label">${key}:</span>
            <span class="summary-value">${val}</span>
          </div>
        `;
      }
      modalDetails.innerHTML = detailsHtml;
      modal.classList.add('open');
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    }

    // 6. Manejo de Envío de Formularios
    // Formulario 1: Clases Prácticas
    const formClases = document.getElementById('formClases');
    if (formClases) {
      formClases.addEventListener('submit', (e) => {
        e.preventDefault();
        const tipo = document.getElementById('claseTipo').value;
        const instructor = document.getElementById('claseInstructor').value;
        const fechaChip = formClases.querySelector('.chip-btn.selected');
        const fecha = fechaChip ? fechaChip.textContent.trim() : 'Próxima disponible';
        const telefono = document.getElementById('claseTelefono').value;

        openConfirmationModal(
          '¡Clase Práctica Reservada!',
          'Tu instructor te estará esperando con el vehículo de doble comando verificado.',
          {
            'Servicio': 'Clase Práctica',
            'Modalidad': tipo,
            'Instructor': instructor,
            'Turno': fecha,
            'Contacto': telefono,
            'Estado': 'Confirmado ✓'
          }
        );
      });
    }

    // Formulario 2: Turnos de Examen
    const formExamen = document.getElementById('formExamen');
    if (formExamen) {
      formExamen.addEventListener('submit', (e) => {
        e.preventDefault();
        const sede = document.getElementById('examenSede').value;
        const categoria = document.getElementById('examenCategoria').value;
        const autoIncluido = document.getElementById('autoAcademia').checked ? 'Sí (Doble Comando)' : 'No';
        const chipFecha = formExamen.querySelector('.chip-btn.selected');
        const fecha = chipFecha ? chipFecha.textContent.trim() : 'A coordinar';

        openConfirmationModal(
          '¡Turno de Examen Agendado!',
          'Gestionamos tu turno oficial y coordinamos el acompañamiento para el examen práctico.',
          {
            'Trámite': 'Examen de Conductor',
            'Sede Oficial': sede,
            'Categoría': categoria,
            'Auto de Escuela': autoIncluido,
            'Fecha Examen': fecha,
            'Recordatorio': 'Enviado por SMS y WhatsApp'
          }
        );
      });
    }

    // Formulario 3: Pagos Online
    const formPagos = document.getElementById('formPagos');
    if (formPagos) {
      formPagos.addEventListener('submit', (e) => {
        e.preventDefault();
        const planActivo = document.querySelector('.plan-card.active h4');
        const planPrecio = document.querySelector('.plan-card.active .plan-price');
        const metodoActivo = document.querySelector('.pay-method-btn.selected span:last-child');

        openConfirmationModal(
          '¡Pago Procesado con Éxito!',
          'El comprobante y cupón de clases han sido emitidos a tu correo electrónico.',
          {
            'Plan Adquirido': planActivo ? planActivo.textContent : 'Pack Clases',
            'Total Abonado': planPrecio ? planPrecio.textContent : '$24.000',
            'Medio de Pago': metodoActivo ? metodoActivo.textContent : 'Tarjeta',
            'Código Reserva': '#AD-' + Math.floor(100000 + Math.random() * 900000),
            'Estado': 'Acreditado ✓'
          }
        );
      });
    }

    // 7. Navegación directa al Hub de reservas
    const btnBottom = document.getElementById('btnBottomCta');
    const btnHeader = document.getElementById('btnAgendarHeader');

    function scrollToHub() {
      const bookingSection = document.getElementById('hub-reservas');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (btnBottom) btnBottom.addEventListener('click', scrollToHub);
    if (btnHeader) btnHeader.addEventListener('click', scrollToHub);
  });
})();
