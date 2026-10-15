(function() {
  // Datos maestros de propiedades inmobiliarias
const propertiesData = [
  {
    id: 1,
    title: "Penthouse Exclusivo con Vista Panorámica",
    type: "departamento",
    operation: "venta",
    price: 420000,
    currency: "USD",
    city: "madrid",
    address: "Paseo de la Castellana 140, Salamanca",
    bedrooms: 3,
    bathrooms: 3,
    area: 195,
    garage: true,
    pool: true,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: 2,
    title: "Villa Moderna con Jardín y Piscina Infinity",
    type: "casa",
    operation: "venta",
    price: 890000,
    currency: "USD",
    city: "barcelona",
    address: "Avinguda Diagonal 580, Sarrià",
    bedrooms: 5,
    bathrooms: 4,
    area: 360,
    garage: true,
    pool: true,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: 3,
    title: "Loft de Diseño Industrial en Zona Trendy",
    type: "departamento",
    operation: "alquiler",
    price: 1850,
    currency: "USD",
    city: "valencia",
    address: "Calle de Colón 45, Ciutat Vella",
    bedrooms: 1,
    bathrooms: 1,
    area: 82,
    garage: false,
    pool: false,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: 4,
    title: "Residencia Familiar de Lujo con Terraza",
    type: "casa",
    operation: "venta",
    price: 610000,
    currency: "USD",
    city: "madrid",
    address: "Calle Alfonso XII, Retiro",
    bedrooms: 4,
    bathrooms: 3,
    area: 240,
    garage: true,
    pool: false,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: 5,
    title: "Oficina Corporativa Prime con Domótica",
    type: "oficina",
    operation: "alquiler",
    price: 3400,
    currency: "USD",
    city: "barcelona",
    address: "Carrer de Balmes 220, Eixample",
    bedrooms: 0,
    bathrooms: 2,
    area: 160,
    garage: true,
    pool: false,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: 6,
    title: "Ático Dúplex Luminoso y Terraza Privada",
    type: "departamento",
    operation: "alquiler",
    price: 2500,
    currency: "USD",
    city: "madrid",
    address: "Calle de Serrano 88, Chamberí",
    bedrooms: 2,
    bathrooms: 2,
    area: 125,
    garage: true,
    pool: true,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    featured: false
  }
];

// Estado global de la aplicación
let favorites = new Set();
let currentFilter = {
  keyword: "",
  operation: "all",
  type: "all",
  maxPrice: 1000000,
  minBedrooms: "all",
  garageOnly: false,
  poolOnly: false
};

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
  renderProperties(propertiesData);
  setupEventListeners();
});

// Renderizado de tarjetas de propiedades
function renderProperties(list) {
  const container = document.getElementById("propertiesGrid");
  const countEl = document.getElementById("propertiesCount");
  
  if (!container) return;

  if (countEl) {
    countEl.textContent = `${list.length} ${list.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`;
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">No encontramos resultados</h3>
        <p style="color: var(--text-muted); margin-bottom: 16px;">Prueba ajustando los filtros o el rango de precio para ver más opciones.</p>
        <button class="btn btn-secondary" onclick="resetFilters()">Limpiar Filtros</button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(prop => `
    <article class="property-card" data-id="${prop.id}">
      <div class="property-img-wrap">
        <img src="${prop.image}" alt="${prop.title}" loading="lazy">
        <span class="property-tag ${prop.operation}">${prop.operation.toUpperCase()}</span>
        <button class="property-favorite ${favorites.has(prop.id) ? 'active' : ''}" 
                onclick="toggleFavorite(${prop.id})" 
                aria-label="Guardar en favoritos" 
                title="Favorito">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${favorites.has(prop.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div class="property-body">
        <div class="property-price">
          ${formatCurrency(prop.price, prop.currency)}
          ${prop.operation === 'alquiler' ? '<span style="font-size: 14px; font-weight: 500; color: var(--text-muted)">/mes</span>' : ''}
        </div>
        <h3 class="property-title">${prop.title}</h3>
        <p class="property-location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          ${prop.address}
        </p>

        <div class="property-specs">
          ${prop.bedrooms > 0 ? `
            <div class="spec-item" title="Dormitorios">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 19h20M2 17h20M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10M9 9h6"></path>
              </svg>
              <span>${prop.bedrooms} Dorm.</span>
            </div>
          ` : ''}
          <div class="spec-item" title="Baños">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="10" rx="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>${prop.bathrooms} Baños</span>
          </div>
          <div class="spec-item" title="Superficie">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3h18v18H3z"></path>
            </svg>
            <span>${prop.area} m²</span>
          </div>
        </div>

        <div class="property-footer">
          <button class="btn btn-primary" onclick="openDirectLeadModal(${prop.id})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Consultar
          </button>
          <a href="https://wa.me/34600000000?text=${encodeURIComponent('Hola, me interesa la propiedad: ' + prop.title)}" target="_blank" class="btn btn-secondary" title="WhatsApp directo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 12a4 4 0 0 1-8 0"></path>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  `).join("");
}

// Lógica de Filtros
function applyFilters() {
  const keyword = document.getElementById("searchKeyword") ? document.getElementById("searchKeyword").value.toLowerCase().trim() : "";
  const operation = document.getElementById("filterOperation") ? document.getElementById("filterOperation").value : "all";
  const type = document.getElementById("filterType") ? document.getElementById("filterType").value : "all";
  const maxPrice = document.getElementById("filterPriceRange") ? parseInt(document.getElementById("filterPriceRange").value) : 1000000;
  const bedrooms = document.getElementById("filterBedrooms") ? document.getElementById("filterBedrooms").value : "all";
  const garageOnly = document.getElementById("checkGarage") ? document.getElementById("checkGarage").checked : false;
  const poolOnly = document.getElementById("checkPool") ? document.getElementById("checkPool").checked : false;

  const filtered = propertiesData.filter(item => {
    // Texto / Ciudad / Título
    const matchesKeyword = !keyword || 
      item.title.toLowerCase().includes(keyword) || 
      item.city.toLowerCase().includes(keyword) || 
      item.address.toLowerCase().includes(keyword);

    // Operación
    const matchesOp = (operation === "all") || (item.operation === operation);

    // Tipo
    const matchesType = (type === "all") || (item.type === type);

    // Precio
    const matchesPrice = item.price <= maxPrice;

    // Habitaciones
    const matchesBedrooms = (bedrooms === "all") || 
      (bedrooms === "4+" ? item.bedrooms >= 4 : item.bedrooms === parseInt(bedrooms));

    // Extras
    const matchesGarage = !garageOnly || item.garage;
    const matchesPool = !poolOnly || item.pool;

    return matchesKeyword && matchesOp && matchesType && matchesPrice && matchesBedrooms && matchesGarage && matchesPool;
  });

  renderProperties(filtered);
}

function resetFilters() {
  if (document.getElementById("searchKeyword")) document.getElementById("searchKeyword").value = "";
  if (document.getElementById("filterOperation")) document.getElementById("filterOperation").value = "all";
  if (document.getElementById("filterType")) document.getElementById("filterType").value = "all";
  if (document.getElementById("filterPriceRange")) {
    document.getElementById("filterPriceRange").value = 1000000;
    updatePriceLabel(1000000);
  }
  if (document.getElementById("filterBedrooms")) document.getElementById("filterBedrooms").value = "all";
  if (document.getElementById("checkGarage")) document.getElementById("checkGarage").checked = false;
  if (document.getElementById("checkPool")) document.getElementById("checkPool").checked = false;

  renderProperties(propertiesData);
}

function updatePriceLabel(value) {
  const label = document.getElementById("priceRangeValue");
  if (label) {
    label.textContent = `Hasta $${parseInt(value).toLocaleString('es-ES')} USD`;
  }
}

// Favoritos
function toggleFavorite(id) {
  if (favorites.has(id)) {
    favorites.delete(id);
  } else {
    favorites.add(id);
  }
  // Vuelve a pintar el estado del botón sin perder filtros
  applyFilters();
}

// Modal de Consulta Directa por Propiedad (Lead)
function openDirectLeadModal(propertyId) {
  const property = propertiesData.find(p => p.id === propertyId);
  if (!property) return;

  const modal = document.getElementById("leadModal");
  const modalPropertyTitle = document.getElementById("modalPropertyTitle");
  const modalPropertyIdInput = document.getElementById("modalPropertyId");

  if (modal && modalPropertyTitle && modalPropertyIdInput) {
    modalPropertyTitle.textContent = `${property.title} (${formatCurrency(property.price, property.currency)})`;
    modalPropertyIdInput.value = property.id;
    modal.classList.add("active");
  }
}

function closeDirectLeadModal() {
  const modal = document.getElementById("leadModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

// Manejadores de Formularios de Leads
function setupEventListeners() {
  // Búsqueda en vivo
  const searchInput = document.getElementById("searchKeyword");
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  // Desplegables
  const filterOp = document.getElementById("filterOperation");
  if (filterOp) filterOp.addEventListener("change", applyFilters);

  const filterType = document.getElementById("filterType");
  if (filterType) filterType.addEventListener("change", applyFilters);

  const filterBedrooms = document.getElementById("filterBedrooms");
  if (filterBedrooms) filterBedrooms.addEventListener("change", applyFilters);

  // Rango de precio
  const priceRange = document.getElementById("filterPriceRange");
  if (priceRange) {
    priceRange.addEventListener("input", (e) => {
      updatePriceLabel(e.target.value);
      applyFilters();
    });
  }

  // Checkboxes
  const checkGarage = document.getElementById("checkGarage");
  if (checkGarage) checkGarage.addEventListener("change", applyFilters);

  const checkPool = document.getElementById("checkPool");
  if (checkPool) checkPool.addEventListener("change", applyFilters);

  // Toggle filtros avanzados
  const toggleAdvBtn = document.getElementById("btnToggleAdvanced");
  const advPanel = document.getElementById("advancedPanel");
  if (toggleAdvBtn && advPanel) {
    toggleAdvBtn.addEventListener("click", () => {
      advPanel.classList.toggle("open");
      toggleAdvBtn.innerHTML = advPanel.classList.contains("open") 
        ? `<span>- Ocultar filtros avanzados</span>`
        : `<span>+ Más filtros (Habitaciones, Amenidades, Precio)</span>`;
    });
  }

  // Menú Responsive Móvil
  const mobileBtn = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navLinks");
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }

  // Formulario de Contacto Principal (Leads)
  const mainContactForm = document.getElementById("mainContactForm");
  if (mainContactForm) {
    mainContactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const alert = document.getElementById("contactFormAlert");
      if (alert) {
        alert.className = "form-alert success";
        alert.textContent = "¡Solicitud recibida! Un asesor de bienes raíces se comunicará contigo en menos de 15 minutos.";
        alert.style.display = "block";
      }
      mainContactForm.reset();
    });
  }

  // Formulario en Modal para Propiedad Específica
  const modalLeadForm = document.getElementById("modalLeadForm");
  if (modalLeadForm) {
    modalLeadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const modalAlert = document.getElementById("modalAlert");
      if (modalAlert) {
        modalAlert.className = "form-alert success";
        modalAlert.textContent = "¡Consulta enviada con éxito! Te contactaremos a la brevedad.";
        modalAlert.style.display = "block";
      }
      setTimeout(() => {
        closeDirectLeadModal();
        modalLeadForm.reset();
        if (modalAlert) modalAlert.style.display = "none";
      }, 2000);
    });
  }
}

// Utilidades
function formatCurrency(amount, currency = "USD") {
  return `$${amount.toLocaleString('es-ES')} ${currency}`;
}

})();
