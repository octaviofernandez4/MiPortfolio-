(function() {
  /**
 * ESTUDIO JURÍDICO - LÓGICA JAVASCRIPT
 * Control de navegación, formulario de consulta online y sistema de gestión de casos
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Menú Hamburguesa Responsivo
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 2. Base de datos simulada para Gestión de Casos
  let casesData = [
    { id: "CAS-1042", client: "Roberto Gómez", matter: "Laboral - Despido", lawyer: "Dra. Valenzuela", status: "active", date: "2025-05-10" },
    { id: "CAS-1043", client: "Inversiones del Plata S.A.", matter: "Comercial - Fusión", lawyer: "Dr. Benítez", status: "pending", date: "2025-05-12" },
    { id: "CAS-1044", client: "Mariana Silva", matter: "Civil - Sucesión", lawyer: "Dr. Benítez", status: "active", date: "2025-05-14" },
    { id: "CAS-1045", client: "Carlos Mendoza", matter: "Penal - Querella", lawyer: "Dra. Valenzuela", status: "closed", date: "2025-04-20" }
  ];

  const caseTableBody = document.getElementById('caseTableBody');
  const searchCaseInput = document.getElementById('searchCase');
  const filterStatusSelect = document.getElementById('filterStatus');
  const totalCountEl = document.getElementById('totalCasesCount');

  // Renderizador de filas de casos
  function renderCases(cases) {
    if (!caseTableBody) return;
    caseTableBody.innerHTML = '';

    if (cases.length === 0) {
      caseTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:#64748b;">No se encontraron expedientes con los criterios seleccionados.</td></tr>`;
      if (totalCountEl) totalCountEl.textContent = "0";
      return;
    }

    cases.forEach(item => {
      const tr = document.createElement('tr');
      const statusClass = item.status === 'active' ? 'badge-active' : (item.status === 'pending' ? 'badge-pending' : 'badge-closed');
      const statusLabel = item.status === 'active' ? 'En Trámite' : (item.status === 'pending' ? 'En Espera' : 'Cerrado');

      tr.innerHTML = `
        <td><strong>${item.id}</strong></td>
        <td>${item.client}</td>
        <td>${item.matter}</td>
        <td>${item.lawyer}</td>
        <td><span class="badge ${statusClass}">${statusLabel}</span></td>
        <td>
          <button class="action-btn" onclick="toggleCaseStatus('${item.id}')">Cambiar Estado</button>
          <button class="action-btn action-btn-danger" onclick="deleteCase('${item.id}')">Eliminar</button>
        </td>
      `;
      caseTableBody.appendChild(tr);
    });

    if (totalCountEl) totalCountEl.textContent = cases.length.toString();
  }

  // Filtrado y búsqueda
  function applyFilters() {
    const query = searchCaseInput ? searchCaseInput.value.toLowerCase().trim() : '';
    const status = filterStatusSelect ? filterStatusSelect.value : 'all';

    const filtered = casesData.filter(item => {
      const matchesQuery = item.client.toLowerCase().includes(query) ||
                           item.id.toLowerCase().includes(query) ||
                           item.matter.toLowerCase().includes(query) ||
                           item.lawyer.toLowerCase().includes(query);
      const matchesStatus = (status === 'all' || item.status === status);
      return matchesQuery && matchesStatus;
    });

    renderCases(filtered);
  }

  if (searchCaseInput) searchCaseInput.addEventListener('input', applyFilters);
  if (filterStatusSelect) filterStatusSelect.addEventListener('change', applyFilters);

  // Funciones globales para las acciones en tabla
  window.toggleCaseStatus = function(caseId) {
    const target = casesData.find(c => c.id === caseId);
    if (target) {
      if (target.status === 'active') target.status = 'pending';
      else if (target.status === 'pending') target.status = 'closed';
      else target.status = 'active';
      applyFilters();
    }
  };

  window.deleteCase = function(caseId) {
    if (confirm(`¿Confirma que desea archivar/eliminar el caso ${caseId}?`)) {
      casesData = casesData.filter(c => c.id !== caseId);
      applyFilters();
    }
  };

  // Formulario para Crear Nuevo Caso
  const newCaseForm = document.getElementById('newCaseForm');
  if (newCaseForm) {
    newCaseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const client = document.getElementById('newClientName').value.trim();
      const matter = document.getElementById('newMatter').value.trim();
      const lawyer = document.getElementById('newLawyer').value;

      if (!client || !matter) return;

      const newId = `CAS-${Math.floor(1000 + Math.random() * 9000)}`;
      casesData.unshift({
        id: newId,
        client: client,
        matter: matter,
        lawyer: lawyer,
        status: "active",
        date: new Date().toISOString().split('T')[0]
      });

      newCaseForm.reset();
      applyFilters();
      alert(`Caso ${newId} registrado con éxito en el sistema.`);
    });
  }

  // 3. Formulario de Consulta Online para Clientes
  const onlineConsultationForm = document.getElementById('onlineConsultationForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (onlineConsultationForm) {
    onlineConsultationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const matterType = document.getElementById('matterType').value;
      const message = document.getElementById('clientMessage').value.trim();

      if (!name || !email || !message) {
        alert('Por favor complete todos los campos obligatorios.');
        return;
      }

      // Auto-ingreso del caso al panel interno de gestión
      const generatedId = `CAS-${Math.floor(1000 + Math.random() * 9000)}`;
      casesData.unshift({
        id: generatedId,
        client: name,
        matter: `Consulta Online: ${matterType}`,
        lawyer: "Por Asignar",
        status: "pending",
        date: new Date().toISOString().split('T')[0]
      });

      // Feedback visual
      if (formSuccessAlert) {
        formSuccessAlert.style.display = 'block';
        formSuccessAlert.innerHTML = `<strong>¡Consulta enviada con éxito!</strong> Se ha generado el expediente preliminar <strong>#${generatedId}</strong>. Nuestro equipo le contactará en menos de 24 horas.`;
      }

      onlineConsultationForm.reset();
      applyFilters();

      // Scroll suave hacia la confirmación
      formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Carga inicial
  applyFilters();
});

})();
