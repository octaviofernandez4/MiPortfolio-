(function() {
  /**
 * AGENCIA DE VIAJES & TURISMO - JAVASCRIPT (script.js)
 * Manejo interactivo del Catálogo con filtros, Cotizador dinámico y Reservas con Seña Online.
 */

// 1. Base de Datos de Paquetes
const PACKAGES_DATA = [
  {
    id: "pkg-cancun",
    title: "Cancún All Inclusive & Tulum",
    category: "playa",
    destination: "Cancún, México",
    duration: "7 Noches",
    basePrice: 1250,
    depositPct: 20, // 20% de seña
    discount: "15% OFF",
    rating: "4.9 (124)",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=700&q=80",
    description: "Vuelos incluidos, resort 5 estrellas frente al mar Caribe, buffet ilimitado y excursión a ruinas mayas.",
    inclusions: ["Vuelos", "All Inclusive", "Traslados", "Excursión Tulum"]
  },
  {
    id: "pkg-bariloche",
    title: "Bariloche Lagos & Aventura",
    category: "montana",
    destination: "Río Negro, Argentina",
    duration: "5 Noches",
    basePrice: 680,
    depositPct: 25,
    discount: "Cupos Limitados",
    rating: "4.8 (98)",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=700&q=80",
    description: "Cabaña de montaña con vista al Lago Nahuel Huapi, circuito chico, navegación y chocolates artesanales.",
    inclusions: ["Aéreos", "Desayuno", "Circuito Chico", "Seguro"]
  },
  {
    id: "pkg-madrid",
    title: "Madrid, Toledo & Barcelona",
    category: "europa",
    destination: "España",
    duration: "10 Noches",
    basePrice: 2100,
    depositPct: 15,
    discount: "20% OFF",
    rating: "5.0 (210)",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=700&q=80",
    description: "Recorrido clásico por la península ibérica en tren de alta velocidad AVE con guías expertos en español.",
    inclusions: ["Vuelos Directos", "Hoteles 4*", "Trenes AVE", "Tours Guiados"]
  },
  {
    id: "pkg-rio",
    title: "Río de Janeiro & Búzios",
    category: "playa",
    destination: "Brasil",
    duration: "6 Noches",
    basePrice: 850,
    depositPct: 20,
    discount: "Promo Verano",
    rating: "4.7 (88)",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=700&q=80",
    description: "Copacabana e Ipanema, ascenso al Cristo Redentor y 3 días de descanso exclusivo en playas de Búzios.",
    inclusions: ["Aéreos", "Pousada con Desayuno", "Paseo en Barco"]
  },
  {
    id: "pkg-cusco",
    title: "Cusco Mágico & Machu Picchu",
    category: "aventura",
    destination: "Perú",
    duration: "5 Noches",
    basePrice: 940,
    depositPct: 25,
    discount: "Top Elegido",
    rating: "4.9 (175)",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=700&q=80",
    description: "Tren panorámico Vistadome, Valle Sagrado, boleto circuito oficial Machu Picchu y traslados privados.",
    inclusions: ["Boleto Machu Picchu", "Tren Panorámico", "Hotel 3* Sup", "Guía Privado"]
  },
  {
    id: "pkg-roma",
    title: "Roma, Florencia & Venecia",
    category: "europa",
    destination: "Italia",
    duration: "8 Noches",
    basePrice: 1980,
    depositPct: 20,
    discount: "10% OFF",
    rating: "4.9 (150)",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=700&q=80",
    description: "Vivir el arte renacentista, paseos en góndola veneciana y visitas guiadas al Coliseo y Vaticano sin filas.",
    inclusions: ["Vuelos", "Hoteles céntricos", "Tickets Coliseo", "Góndola"]
  }
];

// Estado global de la aplicación
const AppState = {
  selectedPackage: PACKAGES_DATA[0],
  passengerCount: 2,
  includeInsurance: true,
  includeTransfers: true,
  includeExcursions: false,
  paymentMethod: "tarjeta",
  calculatedTotal: 0,
  calculatedDeposit: 0
};

// Inicialización cuando carga el DOM
document.addEventListener("DOMContentLoaded", () => {
  renderPackages("todos");
  setupFilters();
  setupCotizador();
  setupBookingForm();
  recalculateQuote();
});

// Renderizar tarjetas del catálogo
function renderPackages(category) {
  const container = document.getElementById("packages-container");
  if (!container) return;

  const filtered = category === "todos" 
    ? PACKAGES_DATA 
    : PACKAGES_DATA.filter(p => p.category === category);

  container.innerHTML = filtered.map(pkg => {
    const senaAmount = Math.round(pkg.basePrice * (pkg.depositPct / 100));
    return `
      <article class="package-card" data-id="${pkg.id}">
        <div class="card-media">
          <img src="${pkg.image}" alt="${pkg.title}" loading="lazy">
          <span class="tag-badge">📍 ${pkg.destination}</span>
          ${pkg.discount ? `<span class="discount-badge">${pkg.discount}</span>` : ''}
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span>⏱️ ${pkg.duration}</span>
            <span>⭐ ${pkg.rating}</span>
          </div>
          <h3 class="card-title">${pkg.title}</h3>
          <p class="card-description">${pkg.description}</p>
          <div class="card-inclusions">
            ${pkg.inclusions.map(inc => `<span class="inclusion-pill">✓ ${inc}</span>`).join('')}
          </div>
          <div class="card-footer">
            <div class="price-box">
              <span class="price-label">Precio Final por Persona</span>
              <div class="price-val">USD $${pkg.basePrice.toLocaleString()} <span>/pers.</span></div>
              <span class="deposit-notice">⚡ Reservá con seña del ${pkg.depositPct}% (USD $${senaAmount})</span>
            </div>
            <button class="btn-card-action" onclick="selectPackageForQuote('${pkg.id}')">
              Cotizar & Reservar
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// Configuración de botones de filtro
function setupFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-filter");
      renderPackages(category);
    });
  });
}

// Vincular botón de paquete a Cotizador
window.selectPackageForQuote = function(pkgId) {
  const found = PACKAGES_DATA.find(p => p.id === pkgId);
  if (!found) return;
  AppState.selectedPackage = found;

  const select = document.getElementById("quote-destination");
  if (select) {
    select.value = found.id;
  }
  recalculateQuote();

  // Scroll suave al cotizador
  const section = document.getElementById("cotizador");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }

  showToast(`Paquete "${found.title}" cargado en el cotizador`);
};

// Lógica de cálculo en el cotizador
function setupCotizador() {
  const selectDest = document.getElementById("quote-destination");
  const inputPass = document.getElementById("quote-passengers");
  const chkInsurance = document.getElementById("opt-insurance");
  const chkTransfers = document.getElementById("opt-transfers");
  const chkExcursions = document.getElementById("opt-excursions");

  // Poblar select
  if (selectDest) {
    selectDest.innerHTML = PACKAGES_DATA.map(p => 
      `<option value="${p.id}">${p.title} (USD $${p.basePrice})</option>`
    ).join("");

    selectDest.addEventListener("change", (e) => {
      const pkg = PACKAGES_DATA.find(p => p.id === e.target.value);
      if (pkg) {
        AppState.selectedPackage = pkg;
        recalculateQuote();
      }
    });
  }

  if (inputPass) {
    inputPass.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10) || 1;
      AppState.passengerCount = Math.max(1, Math.min(val, 15));
      recalculateQuote();
    });
  }

  if (chkInsurance) {
    chkInsurance.addEventListener("change", (e) => {
      AppState.includeInsurance = e.target.checked;
      recalculateQuote();
    });
  }

  if (chkTransfers) {
    chkTransfers.addEventListener("change", (e) => {
      AppState.includeTransfers = e.target.checked;
      recalculateQuote();
    });
  }

  if (chkExcursions) {
    chkExcursions.addEventListener("change", (e) => {
      AppState.includeExcursions = e.target.checked;
      recalculateQuote();
    });
  }
}

// Recalcular montos y seña en tiempo real
function recalculateQuote() {
  const pkg = AppState.selectedPackage;
  const count = AppState.passengerCount;

  // Costos adicionales fijos por persona
  const insurancePerPerson = AppState.includeInsurance ? 45 : 0;
  const transfersPerPerson = AppState.includeTransfers ? 35 : 0;
  const excursionsPerPerson = AppState.includeExcursions ? 80 : 0;

  const totalPerPerson = pkg.basePrice + insurancePerPerson + transfersPerPerson + excursionsPerPerson;
  const grandTotal = totalPerPerson * count;
  const depositPct = pkg.depositPct;
  const depositAmount = Math.round(grandTotal * (depositPct / 100));

  AppState.calculatedTotal = grandTotal;
  AppState.calculatedDeposit = depositAmount;

  // Actualizar DOM del resumen
  document.getElementById("summary-pkg-name").innerText = `${pkg.title} x ${count} pasajero(s)`;
  document.getElementById("summary-base-rate").innerText = `USD $${(pkg.basePrice * count).toLocaleString()}`;
  
  const extrasTotal = (insurancePerPerson + transfersPerPerson + excursionsPerPerson) * count;
  document.getElementById("summary-extras").innerText = extrasTotal > 0 ? `+ USD $${extrasTotal.toLocaleString()}` : "USD $0";
  
  document.getElementById("summary-grand-total").innerText = `USD $${grandTotal.toLocaleString()}`;
  document.getElementById("summary-deposit-pct").innerText = `${depositPct}%`;
  document.getElementById("summary-deposit-amount").innerText = `USD $${depositAmount.toLocaleString()}`;

  // Actualizar campo sincronizado en formulario de reservas
  const bookingPkgName = document.getElementById("booking-target-pkg");
  const bookingDepositView = document.getElementById("booking-sena-view");
  if (bookingPkgName) bookingPkgName.innerText = pkg.title;
  if (bookingDepositView) bookingDepositView.innerText = `USD $${depositAmount.toLocaleString()}`;
}

// Configuración de formulario de reserva y seña
function setupBookingForm() {
  const form = document.getElementById("booking-checkout-form");
  const payOptions = document.querySelectorAll(".payment-opt");

  payOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      payOptions.forEach(p => p.classList.remove("selected"));
      opt.classList.add("selected");
      AppState.paymentMethod = opt.getAttribute("data-method");
    });
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = document.getElementById("client-name").value.trim();
      const email = document.getElementById("client-email").value.trim();
      const phone = document.getElementById("client-phone").value.trim();
      const fecha = document.getElementById("client-date").value;

      if (!nombre || !email || !phone || !fecha) {
        showToast("Por favor completá todos los campos requeridos");
        return;
      }

      // Simulación de procesamiento de pago de seña
      const submitBtn = document.getElementById("btn-submit-booking");
      submitBtn.disabled = true;
      submitBtn.innerHTML = `⏳ Procesando Seña Online...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `🔒 Pagar Seña & Confirmar Reserva`;
        
        // Mostrar comprobante digital de seña
        showBookingSuccess({
          code: "TRV-" + Math.floor(100000 + Math.random() * 900000),
          client: nombre,
          email: email,
          package: AppState.selectedPackage.title,
          passengers: AppState.passengerCount,
          date: fecha,
          total: AppState.calculatedTotal,
          depositPaid: AppState.calculatedDeposit,
          remaining: AppState.calculatedTotal - AppState.calculatedDeposit,
          method: AppState.paymentMethod.toUpperCase()
        });

        showToast("¡Seña recibida con éxito! Reserva garantizada.");
      }, 1500);
    });
  }
}

// Mostrar tarjeta de confirmación de reserva
function showBookingSuccess(data) {
  const formWrapper = document.getElementById("booking-form-wrapper");
  const successBox = document.getElementById("booking-success-box");

  if (formWrapper) formWrapper.style.display = "none";
  if (successBox) {
    successBox.style.display = "block";
    successBox.innerHTML = `
      <div class="success-icon">✓</div>
      <h3 style="font-size: 1.5rem; color: #166534; font-weight: 800; margin-bottom: 6px;">¡Reserva y Seña Confirmadas!</h3>
      <p style="color: #475569; font-size: 0.92rem;">Hemos enviado el comprobante oficial y los detalles del viaje a tu correo electrónico.</p>
      
      <div class="receipt-card">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px;">
          <strong>Código de Reserva:</strong>
          <span style="font-family: monospace; font-weight: 800; color: #0284c7;">${data.code}</span>
        </div>
        <p><strong>Titular:</strong> ${data.client}</p>
        <p><strong>Destino:</strong> ${data.package}</p>
        <p><strong>Pasajeros:</strong> ${data.passengers} personas</p>
        <p><strong>Fecha Estimada:</strong> ${data.date}</p>
        <p><strong>Método de Pago Seña:</strong> ${data.method}</p>
        <hr style="margin: 10px 0; border: none; border-top: 1px solid #e2e8f0;">
        <div style="display: flex; justify-content: space-between; color: #15803d; font-weight: 800; font-size: 1.05rem;">
          <span>Seña Abonada Online:</span>
          <span>USD $${data.depositPaid.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; color: #64748b; font-size: 0.85rem; margin-top: 4px;">
          <span>Saldo restante a pagar antes de viajar:</span>
          <span>USD $${data.remaining.toLocaleString()}</span>
        </div>
      </div>

      <button class="btn btn-primary" onclick="resetBookingFlow()" style="margin-top: 12px;">
        Hacer otra reserva o consulta
      </button>
    `;
    successBox.scrollIntoView({ behavior: "smooth" });
  }
}

// Resetear formulario para nueva consulta
window.resetBookingFlow = function() {
  const formWrapper = document.getElementById("booking-form-wrapper");
  const successBox = document.getElementById("booking-success-box");
  const form = document.getElementById("booking-checkout-form");
  if (form) form.reset();
  if (successBox) successBox.style.display = "none";
  if (formWrapper) formWrapper.style.display = "block";
};

// Mensaje Toast temporal
function showToast(msg) {
  let toast = document.getElementById("app-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = "toast-msg";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✈️</span> ${msg}`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

})();
