(function() {
  /**
 * ATELIER ÉPURE — INTERACCIÓN Y DINAMISMO CON JAVASCRIPT
 * Gestión de catálogo, filtros dinámicos, ordenación,
 * drawer de ficha de producto, drawer de carrito y favoritos.
 */

// BASE DE DATOS DE PRODUCTOS DE ALTA JOYERÍA
const PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Brazalete Aura Travertino',
    category: 'brazaletes',
    categoryLabel: 'Brazalete Oro 18k',
    price: 1450,
    badge: 'Pieza Icónica',
    image: 'https://images.unsplash.com/photo-1611591475879-1f488df67825?auto=format&fit=crop&w=1000&q=80',
    description: 'Oro macizo cepillado de 18 quilates con perfil orgánico ondulado. Inspirado en las formaciones minerales del Mediterráneo.',
    metals: ['Oro Amarillo 18k', 'Oro Blanco 18k', 'Oro Rosa 18k'],
    sizes: ['S (15-16 cm)', 'M (17-18 cm)', 'L (19-20 cm)', 'A Medida'],
    details: 'Oro 100% Fairmined reciclado. Peso aproximado: 24.5 gramos. Acabado satinado mate con cantos pulidos a espejo.',
    cert: 'GIA Individual & RJC Chain of Custody'
  },
  {
    id: 'prod-2',
    title: 'Feuille Orgánica con Diamantes',
    category: 'collares',
    categoryLabel: 'Colgante & Cadena',
    price: 890,
    badge: 'Edición Botánica',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
    description: 'Colgante de oro amarillo 18k con 6 diamantes naturales talla brillante en micropavé sutil. Cadena veneciana regulable.',
    metals: ['Oro Amarillo 18k', 'Oro Rosa 18k'],
    sizes: ['45 cm', '50 cm', '60 cm'],
    details: 'Diamantes naturales de origen ético Kimberley Process, color G+, pureza VS1. Peso total en diamantes: 0.18 ct.',
    cert: 'Dossier Gemológico Atelier Épure'
  },
  {
    id: 'prod-3',
    title: 'Sello Esmeralda Muzo Ancestral',
    category: 'anillos',
    categoryLabel: 'Anillo Sello Botánico',
    price: 1980,
    badge: 'Pieza Única',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
    description: 'Oro 18k cincelado a mano engastando esmeralda colombiana sin tratar de 1.2 quilates en talla oval cabujón.',
    metals: ['Oro Amarillo 18k', 'Oro Envejecido'],
    sizes: ['Talla 12', 'Talla 14', 'Talla 16', 'Talla 18'],
    details: 'Esmeralda de minas Muzo con aceite de cedro tradicional. Grabado botánico barroco realizado con buril.',
    cert: 'Certificado GIA Gemológico Completo'
  },
  {
    id: 'prod-4',
    title: 'Lumière Perla Barroca',
    category: 'pendientes',
    categoryLabel: 'Pendientes Orgánicos',
    price: 520,
    badge: 'Novedad',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
    description: 'Perlas de agua dulce singulares suspendidas en hilo arquitectónico de oro 18k. Par asimétrico que celebra la irregularidad natural.',
    metals: ['Oro Amarillo 18k', 'Oro Blanco 18k'],
    sizes: ['Única'],
    details: 'Perlas barrocas seleccionadas a mano de 14mm de lustre grado AAA. Cierre de presión reforzado.',
    cert: 'Garantía de Autenticidad de Gemas Orgánicas'
  }
];

// ESTADO DE LA APLICACIÓN
let activeCategory = 'all';
let activeSort = 'featured';
let favorites = new Set();
let cart = [];
let currentProduct = null;

// ELEMENTOS DEL DOM
const productsGrid = document.getElementById('productsGrid');
const filterPills = document.getElementById('filterPills');
const sortSelect = document.getElementById('sortSelect');
const grid2Btn = document.getElementById('grid2Btn');
const grid3Btn = document.getElementById('grid3Btn');
const searchInput = document.getElementById('searchInput');

// Drawers & Notificaciones
const productDrawerBackdrop = document.getElementById('productDrawerBackdrop');
const drawerBody = document.getElementById('drawerBody');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');

const cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartNavBtn = document.getElementById('cartNavBtn');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartSubtotalAmount = document.getElementById('cartSubtotalAmount');
const cartCount = document.getElementById('cartCount');
const cartHeaderCount = document.getElementById('cartHeaderCount');
const favsCount = document.getElementById('favsCount');
const toastNotification = document.getElementById('toastNotification');
const toastMsg = document.getElementById('toastMsg');

// ==========================================================
// RENDERIZADO DEL CATÁLOGO
// ==========================================================
function renderProducts() {
  let filtered = [...PRODUCTS];

  // Filtro de categoría
  if (activeCategory !== 'all') {
    filtered = filtered.filter(p => p.category === activeCategory);
  }

  // Filtro de búsqueda
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.categoryLabel.toLowerCase().includes(query)
    );
  }

  // Ordenación
  if (activeSort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (filtered.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 0; color: var(--color-muted-gray);">
        <p style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 8px;">No se encontraron piezas</p>
        <p style="font-size: 0.8rem;">Pruebe con otra búsqueda o seleccione otra categoría del catálogo.</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = filtered.map(product => {
    const isFav = favorites.has(product.id);
    return `
      <article class="product-card" data-id="${product.id}">
        <div class="card-media-wrapper">
          <img src="${product.image}" alt="${product.title}" class="card-img" loading="lazy">
          <span class="badge-overlay">${product.badge}</span>
          <button class="fav-btn ${isFav ? 'is-favorite' : ''}" data-fav-id="${product.id}" aria-label="Añadir a favoritos">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button class="quick-view-btn" data-view-id="${product.id}">VER FICHA DETALLADA</button>
        </div>
        <div class="card-info">
          <span class="card-category">${product.categoryLabel}</span>
          <h3 class="card-title" data-view-id="${product.id}">${product.title}</h3>
          <span class="card-price">$${product.price.toLocaleString('en-US')}</span>
          <p class="card-desc">${product.description}</p>
        </div>
      </article>
    `;
  }).join('');

  attachCardEvents();
}

function attachCardEvents() {
  // Click en Ver Ficha Detallada
  document.querySelectorAll('[data-view-id]').forEach(el => {
    el.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-view-id');
      openProductDrawer(id);
    });
  });

  // Toggle Favoritos
  document.querySelectorAll('[data-fav-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-fav-id');
      if (favorites.has(id)) {
        favorites.delete(id);
        showToast('Pieza eliminada de favoritos');
      } else {
        favorites.add(id);
        showToast('Pieza guardada en sus favoritos');
      }
      favsCount.textContent = favorites.size;
      renderProducts();
    });
  });
}

// ==========================================================
// DRAWER: FICHA DE PRODUCTO DETALLADA
// ==========================================================
function openProductDrawer(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  currentProduct = {
    ...product,
    selectedMetal: product.metals[0],
    selectedSize: product.sizes[0]
  };

  drawerBody.innerHTML = `
    <div class="drawer-gallery-main">
      <img src="${product.image}" alt="${product.title}" id="drawerMainImg">
    </div>

    <div class="drawer-details-header">
      <span class="drawer-meta-sub">${product.categoryLabel} &bull; ${product.badge}</span>
      <h2 class="drawer-title">${product.title}</h2>
      <div class="drawer-price">$${product.price.toLocaleString('en-US')}</div>
      <p class="drawer-desc">${product.description}</p>
    </div>

    <!-- Selector de Metal -->
    <div class="option-group">
      <div class="option-label">
        <span>SELECCIÓN DE METAL</span>
        <strong id="activeMetalLabel">${currentProduct.selectedMetal}</strong>
      </div>
      <div class="metal-options">
        ${product.metals.map((metal, idx) => `
          <button class="metal-btn ${idx === 0 ? 'active' : ''}" data-metal="${metal}">${metal}</button>
        `).join('')}
      </div>
    </div>

    <!-- Selector de Medida -->
    <div class="option-group">
      <div class="option-label">
        <span>MEDIDA / TALLA</span>
        <span class="size-guide-btn" onclick="alert('Guía de tallas: Para conocer su talla exacta de anillo o contorno de muñeca, nuestro servicio de conserjería le envía un anillero de cortesía en 24h.')">GUÍA DE MEDIDAS</span>
      </div>
      <div class="size-options">
        ${product.sizes.map((size, idx) => `
          <button class="size-btn ${idx === 0 ? 'active' : ''}" data-size="${size}">${size}</button>
        `).join('')}
      </div>
    </div>

    <!-- Botón Añadir a la Cesta -->
    <button class="btn btn-primary btn-block" id="addToCartBtn" style="margin-top: 24px; padding: 18px;">
      AÑADIR A LA CESTA &bull; $${product.price.toLocaleString('en-US')}
    </button>

    <!-- Acordeón informativo -->
    <div class="accordion">
      <div class="accordion-item open">
        <button class="accordion-header">
          <span>ESPECIFICACIONES &amp; PUREZA</span>
          <span class="accordion-icon">&minus;</span>
        </button>
        <div class="accordion-content">
          ${product.details}
        </div>
      </div>
      <div class="accordion-item">
        <button class="accordion-header">
          <span>CERTIFICACIÓN &amp; GARANTÍA</span>
          <span class="accordion-icon">+</span>
        </button>
        <div class="accordion-content">
          ${product.cert}. Todas las creaciones Atelier Épure disponen de garantía vitalicia sobre el engaste y limpieza anual de cortesía en taller.
        </div>
      </div>
      <div class="accordion-item">
        <button class="accordion-header">
          <span>ENVÍO ASEGURADO &amp; DEVOLUCIÓN</span>
          <span class="accordion-icon">+</span>
        </button>
        <div class="accordion-content">
          Entrega blindada puerta a puerta con mensajería de seguridad en 24-48 horas hábiles. Dispone de 30 días para cambio o reembolso íntegro.
        </div>
      </div>
    </div>
  `;

  // Listeners dentro del drawer
  initDrawerInteractions();

  // Abrir Drawer
  productDrawerBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductDrawer() {
  productDrawerBackdrop.classList.remove('active');
  document.body.style.overflow = '';
}

function initDrawerInteractions() {
  // Selector de Metal
  document.querySelectorAll('.metal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.metal-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const metal = btn.getAttribute('data-metal');
      currentProduct.selectedMetal = metal;
      document.getElementById('activeMetalLabel').textContent = metal;
    });
  });

  // Selector de Talla
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentProduct.selectedSize = btn.getAttribute('data-size');
    });
  });

  // Acordeón
  document.querySelectorAll('.accordion-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const item = hdr.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-icon').innerHTML = '+';
      });
      if (!isOpen) {
        item.classList.add('open');
        hdr.querySelector('.accordion-icon').innerHTML = '&minus;';
      }
    });
  });

  // Añadir a Cesta
  const addBtn = document.getElementById('addToCartBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addToCart(currentProduct);
      closeProductDrawer();
      openCartDrawer();
    });
  }
}

// ==========================================================
// CESTA DE COMPRA INTERACTIVA
// ==========================================================
function addToCart(product) {
  const existingIndex = cart.findIndex(item => 
    item.id === product.id && 
    item.metal === product.selectedMetal && 
    item.size === product.selectedSize
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      metal: product.selectedMetal,
      size: product.selectedSize,
      quantity: 1
    });
  }

  updateCartState();
  showToast(`"${product.title}" añadido a la cesta`);
}

function updateCartState() {
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  cartCount.textContent = totalCount;
  cartHeaderCount.textContent = totalCount;
  cartSubtotalAmount.textContent = `$${totalAmount.toLocaleString('en-US')}`;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        <p style="font-family: var(--font-serif); font-size: 1.2rem; margin-bottom: 6px;">Su cesta está vacía</p>
        <p style="font-size: 0.75rem;">Explore nuestras piezas de autor y seleccione su escultura preferida.</p>
      </div>
    `;
  } else {
    cartItemsContainer.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.title}</h4>
          <p class="cart-item-meta">${item.metal} &bull; ${item.size}</p>
          <div class="cart-item-bottom">
            <div class="qty-control">
              <button class="qty-btn" onclick="changeQty(${index}, -1)">&minus;</button>
              <span class="qty-num">${item.quantity}</span>
              <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
            </div>
            <strong style="font-size: 0.85rem;">$${(item.price * item.quantity).toLocaleString('en-US')}</strong>
          </div>
        </div>
      </div>
    `).join('');
  }
}

window.changeQty = function(index, delta) {
  if (!cart[index]) return;
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartState();
};

function openCartDrawer() {
  cartDrawerBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  cartDrawerBackdrop.classList.remove('active');
  document.body.style.overflow = '';
}

// ==========================================================
// TOAST NOTIFICACIÓN
// ==========================================================
function showToast(message) {
  toastMsg.textContent = message;
  toastNotification.classList.add('show');
  setTimeout(() => {
    toastNotification.classList.remove('show');
  }, 2800);
}

// ==========================================================
// INICIALIZACIÓN DE EVENTOS GENERALES
// ==========================================================
function initApp() {
  renderProducts();
  updateCartState();

  // Filtros de categoría
  filterPills.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => {
      filterPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderProducts();
    });
  });

  // Selector de orden
  sortSelect.addEventListener('change', (e) => {
    activeSort = e.target.value;
    renderProducts();
  });

  // Búsqueda en tiempo real
  searchInput.addEventListener('input', () => {
    renderProducts();
  });

  // Alternador de cuadrícula
  grid2Btn.addEventListener('click', () => {
    grid2Btn.classList.add('active');
    grid3Btn.classList.remove('active');
    productsGrid.classList.remove('grid-3');
    productsGrid.classList.add('grid-2');
  });

  grid3Btn.addEventListener('click', () => {
    grid3Btn.classList.add('active');
    grid2Btn.classList.remove('active');
    productsGrid.classList.remove('grid-2');
    productsGrid.classList.add('grid-3');
  });

  // Cierre de drawers
  closeDrawerBtn.addEventListener('click', closeProductDrawer);
  productDrawerBackdrop.addEventListener('click', (e) => {
    if (e.target === productDrawerBackdrop) closeProductDrawer();
  });

  closeCartBtn.addEventListener('click', closeCartDrawer);
  cartNavBtn.addEventListener('click', openCartDrawer);
  cartDrawerBackdrop.addEventListener('click', (e) => {
    if (e.target === cartDrawerBackdrop) closeCartDrawer();
  });

  // Botón checkout
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Su cesta se encuentra vacía.');
      return;
    }
    alert('Conectando con la pasarela bancaria segura con tokenización SSL 256-bit y protocolo de custodia...');
  });

  // Menú móvil (despliega los links de navegación en pantallas chicas)
  const menuBtn = document.getElementById('menuBtn');
  const mainHeader = document.getElementById('mainHeader');
  if (menuBtn && mainHeader) {
    menuBtn.addEventListener('click', () => {
      mainHeader.classList.toggle('nav-open');
    });
    mainHeader.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => mainHeader.classList.remove('nav-open'));
    });
  }
}

// Iniciar aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', initApp);
})();
