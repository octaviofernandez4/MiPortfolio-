(function() {
  /**
   * TALENTUM HR - Portal de Búsquedas, Postulaciones y Panel de Candidatos
   * script.js (Lógica independiente, modular y totalmente funcional)
   */

  document.addEventListener('DOMContentLoaded', () => {
    // Estado de la aplicación
    const state = {
      activeTab: 'jobs',
      jobs: [
        {
          id: 'job-1',
          title: 'Líder Técnico Fullstack (React / Node)',
          company: 'Fintech Internacional',
          location: 'Remoto (Argentina/Latam)',
          modality: 'Remoto',
          type: 'Full-time',
          area: 'Tecnología',
          salary: 'USD 3.800 - 4.500',
          desc: 'Buscamos un Tech Lead con +5 años liderando equipos ágiles, arquitectura cloud y microservicios escalables.'
        },
        {
          id: 'job-2',
          title: 'Gerente de Compensaciones y Beneficios',
          company: 'Grupo Retail Multinacional',
          location: 'Buenos Aires, CABA',
          modality: 'Híbrido',
          type: 'Full-time',
          area: 'Recursos Humanos',
          salary: '$2.800.000 ARS',
          desc: 'Diseño e implementación de estructuras salariales competitivas, bandas de incentivos y encuestas salariales.'
        },
        {
          id: 'job-3',
          title: 'Product Designer Senior (UI/UX)',
          company: 'Agencia Digital Global',
          location: 'Córdoba / Remoto',
          modality: 'Remoto',
          type: 'Full-time',
          area: 'Diseño',
          salary: 'USD 2.500 - 3.200',
          desc: 'Especialista en Design Systems con Figma, prototipado de alta fidelidad, user research y testing continuo.'
        },
        {
          id: 'job-4',
          title: 'Especialista en Adquisición de Talento Tech',
          company: 'Consultora HumanCapital',
          location: 'Montevideo / Híbrido',
          modality: 'Híbrido',
          type: 'Full-time',
          area: 'Recursos Humanos',
          salary: 'USD 1.800 + Comisiones',
          desc: 'Hunting especializado en perfiles DevOps, Data Science y desarrolladores Senior para clientes en USA.'
        },
        {
          id: 'job-5',
          title: 'Analista de Operaciones & Logística',
          company: 'Operador Logístico Federal',
          location: 'Rosario, Santa Fe',
          modality: 'Presencial',
          type: 'Full-time',
          area: 'Operaciones',
          salary: '$1.400.000 ARS',
          desc: 'Optimización de cadenas de suministro, supervisión de inventario físico y reporting con Power BI.'
        },
        {
          id: 'job-6',
          title: 'Data Engineer (Python / Snowflake / AWS)',
          company: 'Insurtech Innovadora',
          location: 'Remoto',
          modality: 'Remoto',
          type: 'Full-time',
          area: 'Tecnología',
          salary: 'USD 3.200 - 4.000',
          desc: 'Diseño de pipelines ETL en tiempo real, modelado dimensional y gobierno de lagos de datos.'
        }
      ],
      candidates: [
        {
          id: 'c-1',
          name: 'Camila Rodriguez',
          email: 'camila.rodriguez@email.com',
          phone: '+54 9 11 4455-6677',
          role: 'Líder Técnico Fullstack (React / Node)',
          experience: '7 años de experiencia',
          status: 'Entrevista',
          date: '2025-02-18',
          cv: 'CV_Camila_Rodriguez.pdf'
        },
        {
          id: 'c-2',
          name: 'Matías Fernandez',
          email: 'matias.f@email.com',
          phone: '+54 9 351 987-6543',
          role: 'Product Designer Senior (UI/UX)',
          experience: '5 años en SaaS B2B',
          status: 'En Revisión',
          date: '2025-02-19',
          cv: 'CV_Matias_UX.pdf'
        },
        {
          id: 'c-3',
          name: 'Valeria Benítez',
          email: 'valeria.benitez@email.com',
          phone: '+598 99 123-456',
          role: 'Gerente de Compensaciones y Beneficios',
          experience: '9 años liderando RRHH',
          status: 'Finalista',
          date: '2025-02-15',
          cv: 'CV_Valeria_HR.pdf'
        },
        {
          id: 'c-4',
          name: 'Nicolás Gomez',
          email: 'nicolas.gomez@email.com',
          phone: '+54 9 341 555-1122',
          role: 'Data Engineer (Python / Snowflake / AWS)',
          experience: '4 años en Big Data',
          status: 'Contratado',
          date: '2025-02-10',
          cv: 'CV_Nicolas_Gomez.pdf'
        }
      ]
    };

    // Referencias al DOM
    const elements = {
      tabButtons: document.querySelectorAll('.tab-btn'),
      sections: {
        jobs: document.getElementById('section-jobs'),
        apply: document.getElementById('section-apply'),
        candidates: document.getElementById('section-candidates')
      },
      navLinks: document.querySelectorAll('.nav-link'),
      mobileToggle: document.getElementById('mobileToggle'),
      mainNavLinks: document.getElementById('mainNavLinks'),
      jobsContainer: document.getElementById('jobsContainer'),
      jobSearchInput: document.getElementById('jobSearchInput'),
      areaFilter: document.getElementById('areaFilter'),
      modalityFilter: document.getElementById('modalityFilter'),
      btnResetFilters: document.getElementById('btnResetFilters'),
      applyForm: document.getElementById('applyForm'),
      targetJobSelect: document.getElementById('targetJobSelect'),
      candidatesTableBody: document.getElementById('candidatesTableBody'),
      statusFilterCandidate: document.getElementById('statusFilterCandidate'),
      toast: document.getElementById('toast'),
      fileInput: document.getElementById('cvFile'),
      filePreview: document.getElementById('filePreview'),
      fileDropArea: document.getElementById('fileDropArea'),
      statTotal: document.getElementById('statTotal'),
      statRevision: document.getElementById('statRevision'),
      statEntrevista: document.getElementById('statEntrevista'),
      statContratados: document.getElementById('statContratados')
    };

    // ==========================================
    // Navegación por pestañas & Secciones
    // ==========================================
    function switchTab(tabId) {
      state.activeTab = tabId;

      // Actualizar botones de pestaña
      elements.tabButtons.forEach(btn => {
        if (btn.dataset.tab === tabId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Actualizar enlaces del header
      elements.navLinks.forEach(link => {
        if (link.dataset.tab === tabId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Mostrar/ocultar secciones suaves
      Object.keys(elements.sections).forEach(key => {
        if (elements.sections[key]) {
          if (key === tabId) {
            elements.sections[key].style.display = 'block';
          } else {
            elements.sections[key].style.display = 'none';
          }
        }
      });

      // Si pasamos a postulación, refrescar el select de empleos
      if (tabId === 'apply') {
        populateJobsSelect();
      }

      // Si pasamos al panel, actualizar tabla y métricas
      if (tabId === 'candidates') {
        renderCandidates();
        updateCandidateStats();
      }

      // Scroll suave a la sección
      const targetSection = elements.sections[tabId];
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 120,
          behavior: 'smooth'
        });
      }
    }

    // Eventos de tabs
    elements.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (link.dataset.tab) {
          switchTab(link.dataset.tab);
          if (elements.mainNavLinks.classList.contains('open')) {
            elements.mainNavLinks.classList.remove('open');
          }
        }
      });
    });

    // Toggle menú responsive
    if (elements.mobileToggle) {
      elements.mobileToggle.addEventListener('click', () => {
        elements.mainNavLinks.classList.toggle('open');
      });
    }

    // ==========================================
    // Portal de Empleos (Render & Filtros)
    // ==========================================
    function renderJobs(filteredJobs = state.jobs) {
      if (!elements.jobsContainer) return;
      elements.jobsContainer.innerHTML = '';

      if (filteredJobs.length === 0) {
        elements.jobsContainer.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; background: #fff; border-radius: 12px; border: 1px dashed #cbd5e1;">
            <p style="font-size: 1.1rem; font-weight: 600; color: #64748b;">No se encontraron búsquedas laborales con los filtros seleccionados.</p>
            <button id="btnResetInline" class="btn-primary" style="margin-top: 1rem;">Ver todas las búsquedas</button>
          </div>
        `;
        const resetBtn = document.getElementById('btnResetInline');
        if (resetBtn) resetBtn.addEventListener('click', resetJobFilters);
        return;
      }

      filteredJobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-card';

        const badgeClass = job.modality === 'Remoto' ? 'badge-remote' : (job.modality === 'Híbrido' ? 'badge-hybrid' : 'badge-presential');

        card.innerHTML = `
          <div>
            <div class="job-header">
              <div>
                <span class="job-company">${job.company}</span>
                <h3 class="job-role">${job.title}</h3>
              </div>
              <span class="badge-tag ${badgeClass}">${job.modality}</span>
            </div>

            <div class="job-meta">
              <span class="job-meta-item">📍 ${job.location}</span>
              <span class="job-meta-item">💼 ${job.area}</span>
              <span class="job-meta-item">⏱️ ${job.type}</span>
            </div>

            <p class="job-desc">${job.desc}</p>
          </div>

          <div class="job-footer">
            <div class="job-salary">${job.salary}</div>
            <button class="btn-primary btn-apply-job" data-job-id="${job.id}" data-job-title="${job.title}">
              Postularme
            </button>
          </div>
        `;

        elements.jobsContainer.appendChild(card);
      });

      // Asignar clicks a los botones "Postularme"
      document.querySelectorAll('.btn-apply-job').forEach(btn => {
        btn.addEventListener('click', () => {
          const jobTitle = btn.dataset.jobTitle;
          switchTab('apply');
          if (elements.targetJobSelect) {
            elements.targetJobSelect.value = jobTitle;
          }
          showToast(`Puesto seleccionado: ${jobTitle}`, 'info');
        });
      });
    }

    function filterJobs() {
      const query = elements.jobSearchInput.value.toLowerCase().trim();
      const area = elements.areaFilter.value;
      const modality = elements.modalityFilter.value;

      const filtered = state.jobs.filter(job => {
        const matchesQuery = job.title.toLowerCase().includes(query) ||
                             job.company.toLowerCase().includes(query) ||
                             job.desc.toLowerCase().includes(query);
        const matchesArea = area === '' || job.area === area;
        const matchesModality = modality === '' || job.modality === modality;

        return matchesQuery && matchesArea && matchesModality;
      });

      renderJobs(filtered);
    }

    function resetJobFilters() {
      elements.jobSearchInput.value = '';
      elements.areaFilter.value = '';
      elements.modalityFilter.value = '';
      renderJobs(state.jobs);
    }

    if (elements.jobSearchInput) elements.jobSearchInput.addEventListener('input', filterJobs);
    if (elements.areaFilter) elements.areaFilter.addEventListener('change', filterJobs);
    if (elements.modalityFilter) elements.modalityFilter.addEventListener('change', filterJobs);
    if (elements.btnResetFilters) elements.btnResetFilters.addEventListener('click', resetJobFilters);

    // ==========================================
    // Postulación Online (Formulario interactivo)
    // ==========================================
    function populateJobsSelect() {
      if (!elements.targetJobSelect) return;
      const currentVal = elements.targetJobSelect.value;
      elements.targetJobSelect.innerHTML = '<option value="">-- Selecciona una búsqueda activa --</option>';

      state.jobs.forEach(job => {
        const option = document.createElement('option');
        option.value = job.title;
        option.textContent = `${job.title} (${job.company})`;
        elements.targetJobSelect.appendChild(option);
      });

      if (currentVal) {
        elements.targetJobSelect.value = currentVal;
      }
    }

    // Manejo de drag and drop para el CV
    if (elements.fileDropArea && elements.fileInput) {
      elements.fileDropArea.addEventListener('click', () => elements.fileInput.click());

      elements.fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          elements.filePreview.textContent = `📄 Archivo seleccionado: ${e.target.files[0].name}`;
        }
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        elements.fileDropArea.addEventListener(eventName, (e) => {
          e.preventDefault();
          elements.fileDropArea.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        elements.fileDropArea.addEventListener(eventName, (e) => {
          e.preventDefault();
          elements.fileDropArea.classList.remove('dragover');
        });
      });

      elements.fileDropArea.addEventListener('drop', (e) => {
        if (e.dataTransfer.files.length > 0) {
          elements.fileInput.files = e.dataTransfer.files;
          elements.filePreview.textContent = `📄 Archivo cargado: ${e.dataTransfer.files[0].name}`;
        }
      });
    }

    // Envío del Formulario
    if (elements.applyForm) {
      elements.applyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.getElementById('candidateName').value.trim();
        const email = document.getElementById('candidateEmail').value.trim();
        const phone = document.getElementById('candidatePhone').value.trim();
        const targetJob = elements.targetJobSelect.value;
        const experience = document.getElementById('candidateExp').value.trim();
        const fileName = elements.fileInput.files.length > 0 ? elements.fileInput.files[0].name : 'CV_Candidato.pdf';

        if (!fullName || !email || !targetJob) {
          showToast('Por favor completa los campos obligatorios.', 'info');
          return;
        }

        // Crear nuevo candidato
        const newCandidate = {
          id: 'c-' + Date.now(),
          name: fullName,
          email: email,
          phone: phone || 'No informado',
          role: targetJob,
          experience: experience || 'Sin especificar',
          status: 'En Revisión',
          date: new Date().toISOString().split('T')[0],
          cv: fileName
        };

        // Agregar a la lista de candidatos
        state.candidates.unshift(newCandidate);

        // Limpiar formulario
        elements.applyForm.reset();
        if (elements.filePreview) elements.filePreview.textContent = '';

        showToast(`¡Postulación enviada exitosamente para ${fullName}!`, 'success');

        // Redirigir al panel de candidatos tras 1 segundo para mostrar el resultado
        setTimeout(() => {
          switchTab('candidates');
        }, 1000);
      });
    }

    // ==========================================
    // Panel de Candidatos (Gestor de Selección)
    // ==========================================
    function getInitials(name) {
      return name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }

    function getStatusClass(status) {
      switch (status) {
        case 'En Revisión': return 'status-revision';
        case 'Entrevista': return 'status-entrevista';
        case 'Finalista': return 'status-finalista';
        case 'Contratado': return 'status-contratado';
        case 'Descartado': return 'status-descartado';
        default: return 'status-revision';
      }
    }

    function renderCandidates(filterStatus = '') {
      if (!elements.candidatesTableBody) return;
      elements.candidatesTableBody.innerHTML = '';

      const list = filterStatus ? state.candidates.filter(c => c.status === filterStatus) : state.candidates;

      if (list.length === 0) {
        elements.candidatesTableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 2rem; color: #64748b;">
              No hay candidatos registrados en esta categoría.
            </td>
          </tr>
        `;
        return;
      }

      list.forEach(candidate => {
        const row = document.createElement('tr');
        const initials = getInitials(candidate.name);

        row.innerHTML = `
          <td>
            <div class="candidate-profile">
              <div class="avatar-circle">${initials}</div>
              <div>
                <div class="candidate-name">${candidate.name}</div>
                <div class="candidate-email">${candidate.email}</div>
              </div>
            </div>
          </td>
          <td>
            <div style="font-weight: 600; font-size: 0.85rem;">${candidate.role}</div>
            <div style="font-size: 0.75rem; color: #64748b;">${candidate.experience}</div>
          </td>
          <td>
            <span style="font-size: 0.85rem;">${candidate.date}</span>
          </td>
          <td>
            <select class="select-field status-changer" data-id="${candidate.id}" style="padding: 0.3rem 0.5rem; font-size: 0.8rem; font-weight: 600;">
              <option value="En Revisión" ${candidate.status === 'En Revisión' ? 'selected' : ''}>En Revisión</option>
              <option value="Entrevista" ${candidate.status === 'Entrevista' ? 'selected' : ''}>Entrevista</option>
              <option value="Finalista" ${candidate.status === 'Finalista' ? 'selected' : ''}>Finalista</option>
              <option value="Contratado" ${candidate.status === 'Contratado' ? 'selected' : ''}>Contratado</option>
              <option value="Descartado" ${candidate.status === 'Descartado' ? 'selected' : ''}>Descartado</option>
            </select>
          </td>
          <td>
            <span class="status-badge ${getStatusClass(candidate.status)}">${candidate.status}</span>
          </td>
          <td>
            <div class="action-buttons">
              <button class="btn-icon btn-download" title="Descargar CV" data-cv="${candidate.cv}">📥 CV</button>
              <button class="btn-icon delete btn-delete-candidate" title="Eliminar candidato" data-id="${candidate.id}">🗑️</button>
            </div>
          </td>
        `;

        elements.candidatesTableBody.appendChild(row);
      });

      // Eventos de cambio de estado
      document.querySelectorAll('.status-changer').forEach(select => {
        select.addEventListener('change', (e) => {
          const id = e.target.dataset.id;
          const newStatus = e.target.value;
          const candidate = state.candidates.find(c => c.id === id);
          if (candidate) {
            candidate.status = newStatus;
            renderCandidates(elements.statusFilterCandidate ? elements.statusFilterCandidate.value : '');
            updateCandidateStats();
            showToast(`Estado de ${candidate.name} actualizado a "${newStatus}"`, 'info');
          }
        });
      });

      // Eventos de descarga simulada de CV
      document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', () => {
          showToast(`Descargando ${btn.dataset.cv}...`, 'info');
        });
      });

      // Evento de eliminación
      document.querySelectorAll('.btn-delete-candidate').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          state.candidates = state.candidates.filter(c => c.id !== id);
          renderCandidates(elements.statusFilterCandidate ? elements.statusFilterCandidate.value : '');
          updateCandidateStats();
          showToast('Candidato removido del panel.', 'info');
        });
      });
    }

    function updateCandidateStats() {
      const total = state.candidates.length;
      const revision = state.candidates.filter(c => c.status === 'En Revisión').length;
      const entrevista = state.candidates.filter(c => c.status === 'Entrevista').length;
      const contratados = state.candidates.filter(c => c.status === 'Contratado').length;

      if (elements.statTotal) elements.statTotal.textContent = total;
      if (elements.statRevision) elements.statRevision.textContent = revision;
      if (elements.statEntrevista) elements.statEntrevista.textContent = entrevista;
      if (elements.statContratados) elements.statContratados.textContent = contratados;
    }

    if (elements.statusFilterCandidate) {
      elements.statusFilterCandidate.addEventListener('change', (e) => {
        renderCandidates(e.target.value);
      });
    }

    // ==========================================
    // Notificación Toast
    // ==========================================
    let toastTimer;
    function showToast(message, type = 'info') {
      if (!elements.toast) return;
      clearTimeout(toastTimer);

      elements.toast.textContent = message;
      elements.toast.className = `toast show ${type}`;

      toastTimer = setTimeout(() => {
        elements.toast.classList.remove('show');
      }, 3500);
    }

    // Inicialización de la aplicación
    renderJobs();
    populateJobsSelect();
    renderCandidates();
    updateCandidateStats();
  });
})();
