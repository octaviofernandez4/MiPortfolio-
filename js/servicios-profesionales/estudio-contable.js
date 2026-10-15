(function() {
  /**
 * ESTUDIO CONTABLE - JAVASCRIPT LOGIC (app.js)
 * Manejo interactivo de:
 * 1. Menú mobile y modo oscuro
 * 2. Portal de Clientes (Login simulado, tabs de comprobantes, descargas y logout)
 * 3. Carga de Documentación (Drag & Drop, queue de archivos, progreso y confirmación con código de ticket)
 * 4. Reserva de Turnos por pasos (Modalidad, fechas dinámicas, selección de slots y voucher de turno)
 * 5. Acordeón interactivo de preguntas frecuentes
 */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------
     1. NAVEGACIÓN Y CONFIGURACIÓN BÁSICA
     ------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const navLinks = document.querySelectorAll('.nav-item-link');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });

    // Cerrar al clickear cualquier link en mobile
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }

  // Toggle de modo oscuro
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      themeToggleBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-regular fa-moon"></i>';
      mostrarToast(isDark ? 'Modo oscuro activado' : 'Modo claro activado');
    });
  }

  /* -------------------------------------------------------------
     2. PORTAL DE CLIENTES (LOGIN / DASHBOARD / TABS)
     ------------------------------------------------------------- */
  const portalLoginForm = document.getElementById('portalLoginForm');
  const portalLoginView = document.getElementById('portalLoginView');
  const portalDashboardView = document.getElementById('portalDashboardView');
  const cuitInput = document.getElementById('cuitInput');
  const dashCompanyName = document.getElementById('dashCompanyName');
  const logoutBtn = document.getElementById('logoutBtn');
  const btnVerVep = document.getElementById('btnVerVep');

  if (portalLoginForm) {
    portalLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cuitVal = cuitInput.value.trim() || '30-71458921-4';

      // Simular login
      portalLoginView.classList.add('hidden');
      portalDashboardView.classList.remove('hidden');

      if (dashCompanyName) {
        dashCompanyName.textContent = cuitVal.includes('20-') || cuitVal.includes('27-') 
          ? 'Lic. Juan Manuel Gutiérrez' 
          : 'Innovar Soluciones S.R.L.';
      }

      mostrarToast('Sesión iniciada con éxito en el portal');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      portalDashboardView.classList.add('hidden');
      portalLoginView.classList.remove('hidden');
      portalLoginForm.reset();
      mostrarToast('Sesión finalizada correctamente');
    });
  }

  if (btnVerVep) {
    btnVerVep.addEventListener('click', () => {
      simularDescarga('VEP_IVA_Octubre2026_Pendiente.pdf');
    });
  }

  // Tabs internas del dashboard del portal
  const dashTabs = document.querySelectorAll('.dash-tab');
  const tabContents = document.querySelectorAll('.dash-tab-content');

  dashTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dashTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  /* -------------------------------------------------------------
     3. CARGA DE DOCUMENTACIÓN (DRAG & DROP + ENVÍO)
     ------------------------------------------------------------- */
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const queuedFilesBox = document.getElementById('queuedFilesBox');
  const fileItemsList = document.getElementById('fileItemsList');
  const fileCountSpan = document.getElementById('fileCount');
  const docsUploadForm = document.getElementById('docsUploadForm');
  const uploadProgressWrapper = document.getElementById('uploadProgressWrapper');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressPercent = document.getElementById('progressPercent');
  const uploadSuccessBanner = document.getElementById('uploadSuccessBanner');
  const uploadTicketCode = document.getElementById('uploadTicketCode');
  const btnUploadMore = document.getElementById('btnUploadMore');

  let fileQueue = [];

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-active');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-active');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-active');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        agregarArchivosACola(e.dataTransfer.files);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        agregarArchivosACola(fileInput.files);
      }
    });
  }

  function agregarArchivosACola(files) {
    for (let i = 0; i < files.length; i++) {
      fileQueue.push(files[i]);
    }
    renderizarColaArchivos();
  }

  function renderizarColaArchivos() {
    if (!fileItemsList || !queuedFilesBox || !fileCountSpan) return;

    if (fileQueue.length === 0) {
      queuedFilesBox.style.display = 'none';
      return;
    }

    queuedFilesBox.style.display = 'block';
    fileCountSpan.textContent = fileQueue.length;
    fileItemsList.innerHTML = '';

    fileQueue.forEach((file, index) => {
      const li = document.createElement('li');
      li.className = 'queued-file-row';
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);

      li.innerHTML = `
        <div class="file-meta-name">
          <i class="fa-solid fa-file-invoice"></i>
          <span><strong>${file.name}</strong> (${sizeMb > 0 ? sizeMb + ' MB' : (file.size / 1024).toFixed(0) + ' KB'})</span>
        </div>
        <button type="button" class="remove-file-btn" data-index="${index}" title="Quitar archivo">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;

      fileItemsList.appendChild(li);
    });

    // Listener para eliminar de la cola
    const removeBtns = fileItemsList.querySelectorAll('.remove-file-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        fileQueue.splice(idx, 1);
        renderizarColaArchivos();
      });
    });
  }

  // Envío del formulario de carga
  if (docsUploadForm) {
    docsUploadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (fileQueue.length === 0) {
        alert('Por favor adjuntá o seleccioná al menos un archivo para enviar.');
        return;
      }

      // Simular progreso de subida con animación
      uploadProgressWrapper.style.display = 'block';
      let progress = 0;
      progressBarFill.style.width = '0%';
      progressPercent.textContent = '0%';

      const interval = setInterval(() => {
        progress += 15;
        if (progress > 100) progress = 100;

        progressBarFill.style.width = `${progress}%`;
        progressPercent.textContent = `${progress}%`;

        if (progress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            uploadProgressWrapper.style.display = 'none';
            docsUploadForm.style.display = 'none';
            uploadSuccessBanner.classList.remove('hidden');

            // Generar número de comprobante único
            const randTicket = Math.floor(1000 + Math.random() * 9000);
            if (uploadTicketCode) {
              uploadTicketCode.textContent = `#EST-${randTicket}`;
            }

            mostrarToast(`Carga confirmada. Ticket #EST-${randTicket}`);
          }, 400);
        }
      }, 120);
    });
  }

  if (btnUploadMore) {
    btnUploadMore.addEventListener('click', () => {
      uploadSuccessBanner.classList.add('hidden');
      docsUploadForm.style.display = 'block';
      fileQueue = [];
      renderizarColaArchivos();
      docsUploadForm.reset();
    });
  }

  /* -------------------------------------------------------------
     4. GESTIÓN DE TURNOS DE CONSULTA (STEPPER Y CALENDARIO)
     ------------------------------------------------------------- */
  const step1 = document.getElementById('bookingStep1');
  const step2 = document.getElementById('bookingStep2');
  const step3 = document.getElementById('bookingStep3');
  const bookingConfirmedView = document.getElementById('bookingConfirmedView');

  const pill1 = document.getElementById('stepPill1');
  const pill2 = document.getElementById('stepPill2');
  const pill3 = document.getElementById('stepPill3');

  const goStep2 = document.getElementById('goStep2');
  const backStep1 = document.getElementById('backStep1');
  const goStep3 = document.getElementById('goStep3');
  const backStep2 = document.getElementById('backStep2');

  const bookingForm = document.getElementById('bookingForm');
  const bookingDate = document.getElementById('bookingDate');
  const consultationArea = document.getElementById('consultationArea');
  const timeSlots = document.querySelectorAll('.time-slot');
  const selectedTimeInput = document.getElementById('selectedTime');

  // Inicializar fecha mínima en el calendario (a partir de mañana)
  if (bookingDate) {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    bookingDate.min = `${yyyy}-${mm}-${dd}`;
    bookingDate.value = `${yyyy}-${mm}-${dd}`;
  }

  // Manejo de opción de modalidad (tarjetas interactivas)
  const choiceCards = document.querySelectorAll('.choice-card');
  choiceCards.forEach(card => {
    card.addEventListener('click', () => {
      choiceCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Selección de slot de horario
  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('active'));
      slot.classList.add('active');
      if (selectedTimeInput) {
        selectedTimeInput.value = slot.getAttribute('data-time');
      }
    });
  });

  // Paso 1 -> Paso 2
  if (goStep2) {
    goStep2.addEventListener('click', () => {
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
      pill1.classList.remove('active');
      pill2.classList.add('active');
    });
  }

  // Paso 2 -> Paso 1
  if (backStep1) {
    backStep1.addEventListener('click', () => {
      step2.classList.add('hidden');
      step1.classList.remove('hidden');
      pill2.classList.remove('active');
      pill1.classList.add('active');
    });
  }

  // Paso 2 -> Paso 3 (Actualizar resumen)
  if (goStep3) {
    goStep3.addEventListener('click', () => {
      const selectedModalidad = document.querySelector('input[name="modalidad"]:checked')?.value || 'Online por Google Meet';
      const fechaVal = bookingDate.value;
      const horaVal = selectedTimeInput.value || '15:30 hs';
      const areaVal = consultationArea.value;

      document.getElementById('sumModalidad').textContent = selectedModalidad;
      document.getElementById('sumFechaHora').textContent = `${fechaVal} a las ${horaVal}`;
      document.getElementById('sumArea').textContent = areaVal;

      step2.classList.add('hidden');
      step3.classList.remove('hidden');
      pill2.classList.remove('active');
      pill3.classList.add('active');
    });
  }

  // Paso 3 -> Paso 2
  if (backStep2) {
    backStep2.addEventListener('click', () => {
      step3.classList.add('hidden');
      step2.classList.remove('hidden');
      pill3.classList.remove('active');
      pill2.classList.add('active');
    });
  }

  // Confirmación final del turno
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('bookerName').value;
      const email = document.getElementById('bookerEmail').value;
      const phone = document.getElementById('bookerPhone').value;
      const mod = document.getElementById('sumModalidad').textContent;
      const fechaHora = document.getElementById('sumFechaHora').textContent;
      const area = document.getElementById('sumArea').textContent;

      // Renderizar comprobante/voucher
      const receiptContainer = document.getElementById('ticketReceiptBody');
      if (receiptContainer) {
        receiptContainer.innerHTML = `
          <div><strong>Titular:</strong> ${name}</div>
          <div><strong>Email:</strong> ${email} | <strong>Tel:</strong> ${phone}</div>
          <div><strong>Especialidad:</strong> ${area}</div>
          <div><strong>Fecha y Horario:</strong> ${fechaHora}</div>
          <div><strong>Modalidad:</strong> ${mod}</div>
          <div><strong>Estado:</strong> <span style="color:#16a34a; font-weight:700;">CONFIRMADO ✓</span></div>
        `;
      }

      bookingForm.classList.add('hidden');
      bookingConfirmedView.classList.remove('hidden');
      pill3.classList.remove('active');

      mostrarToast('Turno agendado. Revisa tu casilla de email.');
    });
  }

  // Reset para agendar otro turno
  const btnResetBooking = document.getElementById('btnResetBooking');
  if (btnResetBooking) {
    btnResetBooking.addEventListener('click', () => {
      bookingConfirmedView.classList.add('hidden');
      bookingForm.classList.remove('hidden');
      bookingForm.reset();
      step3.classList.add('hidden');
      step2.classList.add('hidden');
      step1.classList.remove('hidden');
      pill1.classList.add('active');
      pill2.classList.remove('active');
      pill3.classList.remove('active');
    });
  }

  // Botón simular añadir a Google Calendar
  const btnAddToCalendar = document.getElementById('btnAddToCalendar');
  if (btnAddToCalendar) {
    btnAddToCalendar.addEventListener('click', () => {
      mostrarToast('Sincronizando con Google Calendar...');
      window.open('https://calendar.google.com/calendar/r/eventedit', '_blank');
    });
  }

  /* -------------------------------------------------------------
     5. FAQ ACCORDION INTERACTIVO
     ------------------------------------------------------------- */
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentItem = btn.parentElement;
      const isOpen = parentItem.classList.contains('open');

      // Cerrar otros
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));

      if (!isOpen) {
        parentItem.classList.add('open');
      }
    });
  });

});

/* -------------------------------------------------------------
   FUNCIONES AUXILIARES GLOBALES
   ------------------------------------------------------------- */
function simularDescarga(nombreArchivo) {
  mostrarToast(`Descargando ${nombreArchivo}...`);
  // Feedback visual de descarga
  setTimeout(() => {
    mostrarToast(`Archivo ${nombreArchivo} descargado correctamente.`);
  }, 900);
}

function mostrarToast(mensaje) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = mensaje;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
})();
