(function() {
  /**
 * ==========================================================================
 * PawCare & Vet - script.js
 * Funcionalidad interactiva: Turnos, Tienda & Carrito, Carnet de Vacunas
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de módulos
  initAppointments();
  initStore();
  initVaccineTracker();
  initToast();
});

/* ==========================================================================
   1. MÓDULO DE TURNOS MÉDICOS
   ========================================================================== */
function initAppointments() {
  const form = document.getElementById('appointmentForm');
  const dateInput = document.getElementById('appointmentDate');
  const timeSlotButtons = document.querySelectorAll('.time-slot');
  const modal = document.getElementById('appointmentModal');
  const closeModalBtn = document.getElementById('closeAppointmentModal');
  const summaryContainer = document.getElementById('modalSummary');

  // Configurar fecha mínima de reserva a partir de mañana
  if (dateInput) {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    dateInput.min = today.toISOString().split('T')[0];
    dateInput.value = today.toISOString().split('T')[0];
  }

  let selectedTime = '09:00';

  // Manejo de botones de horarios (chips)
  timeSlotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTime = btn.getAttribute('data-time');
    });
  });

  // Envío del Formulario de Turnos
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const petType = document.querySelector('input[name="petType"]:checked')?.value || 'Perro';
      const petName = document.getElementById('petName').value.trim();
      const ownerName = document.getElementById('ownerName').value.trim();
      const ownerPhone = document.getElementById('ownerPhone').value.trim();
      const service = document.getElementById('serviceType').value;
      const doctor = document.getElementById('doctorSelect').value;
      const date = document.getElementById('appointmentDate').value;

      // Resumen del turno en el modal
      summaryContainer.innerHTML = `
        <div class="flex justify-between py-1 border-b border-slate-200">
          <span class="text-slate-500">Paciente:</span>
          <span class="font-bold text-slate-800">${petName} (${petType})</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-200">
          <span class="text-slate-500">Tutor/a:</span>
          <span class="font-bold text-slate-800">${ownerName} - ${ownerPhone}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-200">
          <span class="text-slate-500">Servicio:</span>
          <span class="font-bold text-slate-800">${service}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-200">
          <span class="text-slate-500">Especialista:</span>
          <span class="font-bold text-slate-800">${doctor}</span>
        </div>
        <div class="flex justify-between py-1">
          <span class="text-slate-500">Fecha y Hora:</span>
          <span class="font-bold text-teal-700">${date} a las ${selectedTime} hs</span>
        </div>
      `;

      modal.classList.remove('hidden');
      form.reset();
      showToast('¡Turno reservado con éxito!', '📅');
    });
  }

  // Cerrar modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }
}

/* ==========================================================================
   2. MÓDULO DE TIENDA ONLINE Y CARRITO DE COMPRAS
   ========================================================================== */
const PRODUCTS = [
  {
    id: 1,
    name: "Royal Canin Mini Adult (7.5 kg)",
    category: "alimentos",
    price: 38500,
    oldPrice: 42000,
    tag: "Más Vendido",
    emoji: "🐕",
    desc: "Alimento balanceado premium para perros adultos de raza pequeña."
  },
  {
    id: 2,
    name: "Pro Plan Gato Sterilized (3 kg)",
    category: "alimentos",
    price: 24900,
    oldPrice: 28000,
    tag: "Oferta",
    emoji: "🐈",
    desc: "Nutrición especializada para gatos castrados con control de pH."
  },
  {
    id: 3,
    name: "Pipeta Antipulgas y Garrapatas",
    category: "farmacia",
    price: 9400,
    oldPrice: null,
    tag: "Salud",
    emoji: "🛡️",
    desc: "Protección integral mensual contra pulgas, garrapatas y mosquitos."
  },
  {
    id: 4,
    name: "Shampoo Hipoalergénico de Avena",
    category: "farmacia",
    price: 6800,
    oldPrice: 7900,
    tag: "Higiene",
    emoji: "🧴",
    desc: "Alivia comezón y cuida pieles atópicas o sensibles."
  },
  {
    id: 5,
    name: "Comedero Antivoracidad Interactivo",
    category: "accesorios",
    price: 8200,
    oldPrice: null,
    tag: "Nuevo",
    emoji: "🥣",
    desc: "Reduce la ansiedad y mejora la digestión de tu perro o gato."
  },
  {
    id: 6,
    name: "Cama Ortopédica Antiestrés (M)",
    category: "accesorios",
    price: 32000,
    oldPrice: 36500,
    tag: "Confort",
    emoji: "🛏️",
    desc: "Espuma viscoelástica con funda lavable e impermeable."
  },
  {
    id: 7,
    name: "Snacks Dentales Clean Breath (x28)",
    category: "alimentos",
    price: 5900,
    oldPrice: null,
    tag: "Premios",
    emoji: "🦴",
    desc: "Previene sarro y mantiene el aliento fresco."
  },
  {
    id: 8,
    name: "Correa Retráctil Ergonómica 5m",
    category: "accesorios",
    price: 14500,
    oldPrice: 16900,
    tag: "Paseo",
    emoji: "🦮",
    desc: "Cinta resistente con bloqueo de seguridad y mango suave."
  }
];

let cart = [];

function initStore() {
  const grid = document.getElementById('productGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cartBtn = document.getElementById('cartBtn');
  const cartModal = document.getElementById('cartModal');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // Render inicial de productos
  renderProducts('todos');

  // Filtros de categoría
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-teal-600', 'text-white', 'border-teal-600');
        b.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
      });
      btn.classList.add('active', 'bg-teal-600', 'text-white', 'border-teal-600');
      btn.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');

      const cat = btn.getAttribute('data-category');
      renderProducts(cat);
    });
  });

  // Apertura y Cierre del Carrito
  const toggleCart = (show) => {
    if (show) {
      cartModal.classList.remove('hidden');
      updateCartDrawer();
    } else {
      cartModal.classList.add('hidden');
    }
  };

  if (cartBtn) cartBtn.addEventListener('click', () => toggleCart(true));
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
  if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('El carrito está vacío', '⚠️');
        return;
      }
      const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      alert(`¡Gracias por tu compra! Procesando pedido por $${total.toLocaleString('es-AR')}. Nos comunicaremos por WhatsApp para coordinar el envío express.`);
      cart = [];
      updateCartBadge();
      updateCartDrawer();
      toggleCart(false);
      showToast('¡Pedido completado con éxito!', '🎉');
    });
  }
}

function renderProducts(category) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const filtered = category === 'todos' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === category);

  grid.innerHTML = filtered.map(p => `
    <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div class="relative bg-slate-50 rounded-xl p-8 text-center text-5xl mb-4 group-hover:scale-105 transition-transform">
          <span>${p.emoji}</span>
          ${p.tag ? `<span class="absolute top-2 right-2 bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">${p.tag}</span>` : ''}
        </div>
        <h4 class="font-bold text-slate-900 text-base leading-snug">${p.name}</h4>
        <p class="text-xs text-slate-500 mt-1 line-clamp-2">${p.desc}</p>
      </div>

      <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span class="text-lg font-extrabold text-slate-900">$${p.price.toLocaleString('es-AR')}</span>
          ${p.oldPrice ? `<span class="text-xs text-slate-400 line-through block">$${p.oldPrice.toLocaleString('es-AR')}</span>` : ''}
        </div>
        <button onclick="addToCart(${p.id})" class="bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-xl shadow-sm hover:shadow transition-colors" title="Agregar al carrito">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>
    </div>
  `).join('');
}

window.addToCart = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartBadge();
  showToast(`Agregaste: ${product.name}`, '🛒');
};

function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  if (badge) badge.innerText = totalItems;
}

function updateCartDrawer() {
  const container = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');
  const countHeader = document.getElementById('cartDrawerCount');

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  if (countHeader) countHeader.innerText = `${totalItems} artículos`;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <span class="text-4xl block mb-2">🛒</span>
        <p class="text-sm font-medium">El carrito está vacío</p>
        <p class="text-xs mt-1">Explorá la tienda y agregá productos para tu mascota.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.innerText = '$0';
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart.map(item => {
    subtotal += item.price * item.quantity;
    return `
      <div class="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <span class="text-2xl">${item.emoji}</span>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-slate-800 truncate">${item.name}</p>
          <p class="text-[11px] text-teal-700 font-semibold">$${item.price.toLocaleString('es-AR')}</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="changeQuantity(${item.id}, -1)" class="w-6 h-6 rounded-md bg-white border border-slate-200 text-xs font-bold flex items-center justify-center hover:bg-slate-100">-</button>
          <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
          <button onclick="changeQuantity(${item.id}, 1)" class="w-6 h-6 rounded-md bg-white border border-slate-200 text-xs font-bold flex items-center justify-center hover:bg-slate-100">+</button>
        </div>
      </div>
    `;
  }).join('');

  if (subtotalEl) subtotalEl.innerText = `$${subtotal.toLocaleString('es-AR')}`;
}

window.changeQuantity = function(productId, delta) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
  }
  updateCartBadge();
  updateCartDrawer();
};

/* ==========================================================================
   3. MÓDULO DE RECORDATORIOS Y CARNET DE VACUNACIÓN
   ========================================================================== */
const DEFAULT_VACCINES = [
  {
    pet: "Milo (Perro)",
    vaccine: "Antirrábica Anual",
    lastDate: "2024-04-12",
    nextDate: "2025-04-12",
    status: "Al día",
    statusClass: "badge-aldia"
  },
  {
    pet: "Milo (Perro)",
    vaccine: "Séxtuple Canina",
    lastDate: "2024-05-20",
    nextDate: "2025-05-20",
    status: "Próxima a vencer",
    statusClass: "badge-proximo"
  },
  {
    pet: "Luna (Gata)",
    vaccine: "Triple Felina",
    lastDate: "2024-03-01",
    nextDate: "2025-03-01",
    status: "Vencida",
    statusClass: "badge-vencido"
  },
  {
    pet: "Luna (Gata)",
    vaccine: "Pipeta Desparasitaria",
    lastDate: "2025-02-15",
    nextDate: "2025-03-15",
    status: "Al día",
    statusClass: "badge-aldia"
  }
];

function initVaccineTracker() {
  const listContainer = document.getElementById('vaccineList');
  const reminderForm = document.getElementById('reminderForm');

  renderVaccineList();

  if (reminderForm) {
    reminderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const petName = document.getElementById('remPetName').value.trim();
      const vaccineType = document.getElementById('remVaccineType').value;
      const appDate = document.getElementById('remDate').value;
      const phone = document.getElementById('remPhone').value.trim();

      // Calcular fecha estimada de próxima dosis (1 año para vacunas anuales, 1 mes para pipeta)
      const d = new Date(appDate);
      if (vaccineType.includes('Pipeta') || vaccineType.includes('Desparasitación')) {
        d.setMonth(d.getMonth() + 1);
      } else {
        d.setFullYear(d.getFullYear() + 1);
      }
      const nextDateStr = d.toISOString().split('T')[0];

      DEFAULT_VACCINES.unshift({
        pet: petName,
        vaccine: vaccineType,
        lastDate: appDate,
        nextDate: nextDateStr,
        status: "Al día",
        statusClass: "badge-aldia"
      });

      renderVaccineList();
      reminderForm.reset();
      showToast(`¡Recordatorio programado para ${petName}!`, '🔔');
    });
  }
}

function renderVaccineList() {
  const container = document.getElementById('vaccineList');
  if (!container) return;

  container.innerHTML = DEFAULT_VACCINES.map(v => `
    <div class="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2">
          <span class="font-extrabold text-slate-800 text-sm">${v.vaccine}</span>
          <span class="badge-status ${v.statusClass}">${v.status}</span>
        </div>
        <p class="text-xs text-slate-500 mt-1">Mascota: <strong class="text-slate-700">${v.pet}</strong> | Aplicada: ${v.lastDate}</p>
      </div>
      <div class="text-right">
        <span class="text-[11px] text-slate-400 block font-medium">Próxima dosis:</span>
        <span class="text-xs font-bold text-teal-800">${v.nextDate}</span>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   4. SISTEMA DE TOAST (NOTIFICACIONES DINÁMICAS)
   ========================================================================== */
let toastTimeout;

function initToast() {
  // Inicialización básica
}

function showToast(message, icon = '✅') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  const iconEl = document.getElementById('toastIcon');

  if (!toast) return;

  clearTimeout(toastTimeout);
  msgEl.innerText = message;
  iconEl.innerText = icon;

  toast.classList.add('show-toast');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show-toast');
  }, 3200);
}

})();
