// Primary Inventory Datastore
const INITIAL_CATALOG = [
  {
    id: 'CER-01',
    title: 'Vaso Fósil C-01',
    category: 'Cerámica',
    price: 85.00,
    stock: 5,
    sku: 'CT-CER-01',
    desc: 'Gres chamotado cocido a alta temperatura (1280°C). Textura rugosa exterior inspirada en fósiles marinos y esmaltado interior vitrificado impermeable.',
    img: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80',
    tilt: '-rotate-2'
  },
  {
    id: 'LMP-02',
    title: 'Lámpara Umbra',
    category: 'Iluminación',
    price: 210.00,
    stock: 2,
    sku: 'CT-LMP-02',
    desc: 'Lámpara de sobremesa esculpida en base de hormigón aligerado con pantalla de latón envejecido a mano. Luz cálida difusa de 2200K.',
    img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    tilt: 'rotate-1'
  },
  {
    id: 'SIL-03',
    title: 'Butaca Tectónica',
    category: 'Mobiliario',
    price: 640.00,
    stock: 3,
    sku: 'CT-FUR-03',
    desc: 'Estructura en madera de nogal español con ensamble a media madera sin tornillería visible. Cojín de lino grueso teñido con tintes vegetales.',
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
    tilt: '-rotate-1'
  },
  {
    id: 'TEX-04',
    title: 'Tapiz Dunas Crudas',
    category: 'Textiles',
    price: 145.00,
    stock: 0,
    sku: 'CT-TEX-04',
    desc: 'Tejido manual en telar de alto lizo con lana de oveja merina no tratada y filamentos de yute. Medida 90x60cm lista para colgar.',
    img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80',
    tilt: 'rotate-2'
  },
  {
    id: 'ESC-05',
    title: 'Tótem Travertino',
    category: 'Textiles',
    price: 190.00,
    stock: 8,
    sku: 'CT-ART-05',
    desc: 'Bloque monolítico de travertino romano con cortes estriados y perforaciones pulidas al diamante. Peso aprox. 7.5 kg.',
    img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    tilt: '-rotate-3'
  },
  {
    id: 'CER-06',
    title: 'Jarra Ancestral Ocre',
    category: 'Cerámica',
    price: 95.00,
    stock: 1,
    sku: 'CT-CER-06',
    desc: 'Modelada en torno manual y bruñida con cantos rodados de río. Acabado ahumado con virutas de pino.',
    img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    tilt: 'rotate-2'
  },
  {
    id: 'LMP-07',
    title: 'Aplique Eclipse Piedra',
    category: 'Iluminación',
    price: 175.00,
    stock: 4,
    sku: 'CT-LMP-07',
    desc: 'Disco de alabastro traslúcido montado sobre pletina de acero patinado. Proyecta un halo orbital suave sobre el paramento.',
    img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
    tilt: '-rotate-2'
  },
  {
    id: 'FUR-08',
    title: 'Pedestal de Roble Quemado',
    category: 'Mobiliario',
    price: 320.00,
    stock: 2,
    sku: 'CT-FUR-08',
    desc: 'Tronco de roble macizo carbonizado según la técnica tradicional japonesa Shou Sugi Ban y sellado con ceras orgánicas.',
    img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
    tilt: 'rotate-1'
  }
];

// Reactive State
let products = JSON.parse(localStorage.getItem('tectonica_stock')) || INITIAL_CATALOG;
let cart = JSON.parse(localStorage.getItem('tectonica_cart')) || [];
let activeFilter = 'all';
let lastModifiedId = null;

function saveState() {
  localStorage.setItem('tectonica_stock', JSON.stringify(products));
  localStorage.setItem('tectonica_cart', JSON.stringify(cart));
}

// Render Stock Badge styling helper
function getStockBadge(qty) {
  if (qty === 0) {
    return `<span class="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800">● AGOTADO</span>`;
  } else if (qty <= 2) {
    return `<span class="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">▲ ÚLTIMAS ${qty} UNID.</span>`;
  }
  return `<span class="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">✓ EN STOCK (${qty})</span>`;
}

// Render Product Cards Grid
function renderProducts() {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';

  const filtered = activeFilter === 'all'
    ? products
    : products.filter(p => p.category === activeFilter);

  filtered.forEach((p, index) => {
    const isOutOfStock = p.stock === 0;

    const card = document.createElement('div');
    card.className = `polaroid-card fade-up-in p-4 pb-6 flex flex-col justify-between shadow-polaroid rounded-sm ${p.tilt}`;
    card.style.animationDelay = `${index * 0.06}s`;
    card.setAttribute('data-purpose', 'product-card');

    card.innerHTML = `
      <div>
        <!-- Polaroid Image Container -->
        <div class="relative aspect-square overflow-hidden bg-stone-200 border border-stone-300 cursor-pointer group" onclick="quickViewProduct('${p.id}')">
          <img src="${p.img}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span class="px-3 py-1.5 bg-stone-900/90 text-stone-100 font-mono text-xs uppercase tracking-wider rounded">Detalles Rápidos</span>
          </div>
          <span class="absolute top-2 left-2 bg-stone-950/80 backdrop-blur-xs text-stone-300 text-[10px] font-mono px-2 py-0.5 border border-stone-700 uppercase">
            ${p.sku}
          </span>
        </div>

        <!-- Content Area -->
        <div class="mt-4">
          <div class="flex items-center justify-between text-[11px] font-mono text-stone-500 uppercase">
            <span>${p.category}</span>
            <span class="font-bold text-stone-800 text-sm">€${p.price.toFixed(2)}</span>
          </div>

          <h3 class="text-base font-extrabold text-stone-900 font-['Syne'] mt-1 truncate" title="${p.title}">
            ${p.title}
          </h3>

          <div class="mt-2.5">
            ${getStockBadge(p.stock)}
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-5 pt-3 border-t border-stone-200 flex gap-2">
        <button
          onclick="addToCart('${p.id}')"
          ${isOutOfStock ? 'disabled' : ''}
          class="w-full py-2.5 px-3 rounded text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
            isOutOfStock
              ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
              : 'bg-stone-900 hover:bg-black text-stone-100 shadow'
          }">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>${isOutOfStock ? 'Sin existencias' : 'Añadir'}</span>
        </button>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Render Inventory Table in Live Stock Module
function renderStockTable() {
  const tbody = document.getElementById('stock-table-body');
  tbody.innerHTML = '';

  products.forEach((p, index) => {
    const isLow = p.stock > 0 && p.stock <= 2;
    const isOut = p.stock === 0;

    const row = document.createElement('tr');
    const baseClass = isOut ? 'bg-red-950/20' : (isLow ? 'bg-amber-950/20' : 'hover:bg-stone-800/40');
    row.className = `fade-up-in ${baseClass} ${p.id === lastModifiedId ? 'row-flash' : ''}`;
    row.style.animationDelay = `${index * 0.04}s`;

    row.innerHTML = `
      <td class="py-3 px-4">
        <div class="flex items-center gap-3">
          <img src="${p.img}" class="w-9 h-9 object-cover rounded border border-stone-700" alt="${p.title}">
          <div>
            <span class="font-bold text-stone-200 block text-xs">${p.title}</span>
            <span class="text-[10px] text-stone-400 font-mono">${p.sku}</span>
          </div>
        </div>
      </td>
      <td class="py-3 px-4 text-stone-300">${p.category}</td>
      <td class="py-3 px-4 font-bold text-stone-200">€${p.price.toFixed(2)}</td>
      <td class="py-3 px-4 text-center">
        <span class="inline-block px-2 py-0.5 rounded font-bold text-xs ${isOut ? 'text-red-400 bg-red-950/60' : (isLow ? 'text-amber-400 bg-amber-950/60' : 'text-stone-200 bg-stone-800')}">
          ${p.stock}
        </span>
      </td>
      <td class="py-3 px-4">
        ${getStockBadge(p.stock)}
      </td>
      <td class="py-3 px-4 text-right">
        <div class="inline-flex items-center gap-1">
          <button
            onclick="modifyStock('${p.id}', -1)"
            ${p.stock === 0 ? 'disabled' : ''}
            class="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 border border-stone-700 text-stone-200 flex items-center justify-center font-bold text-xs transition">
            -
          </button>
          <button
            onclick="modifyStock('${p.id}', 1)"
            class="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 flex items-center justify-center font-bold text-xs transition">
            +
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// Modify stock handler with real-time UI synchronization
window.modifyStock = function(productId, delta) {
  const item = products.find(p => p.id === productId);
  if (!item) return;

  const nextVal = item.stock + delta;
  if (nextVal < 0) return;

  item.stock = nextVal;
  lastModifiedId = productId;
  saveState();
  renderStockTable();
  renderProducts();
};

// Filter selector event bindings
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('bg-stone-100', 'text-stone-900', 'shadow');
      b.classList.add('bg-stone-800', 'text-stone-300', 'border', 'border-stone-600');
    });

    btn.classList.add('bg-stone-100', 'text-stone-900', 'shadow');
    btn.classList.remove('bg-stone-800', 'text-stone-300', 'border', 'border-stone-600');

    activeFilter = btn.getAttribute('data-category');
    renderProducts();
  });
});

// Reset stock to initial seed data
document.getElementById('reset-stock-btn').addEventListener('click', () => {
  if (confirm('¿Restaurar inventario a los valores de diseño iniciales?')) {
    products = JSON.parse(JSON.stringify(INITIAL_CATALOG));
    saveState();
    renderStockTable();
    renderProducts();
  }
});

// Initialize displays
renderProducts();
renderStockTable();

// ===== Cart, Checkout Drawer & QuickView Modal =====
const cartDrawer = document.getElementById('cart-drawer');
const cartPanel = document.getElementById('cart-panel');
const cartCounter = document.getElementById('cart-counter-badge');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartTotalEl = document.getElementById('cart-total');

function openCart() {
  cartDrawer.classList.remove('opacity-0', 'pointer-events-none');
  cartPanel.classList.remove('translate-x-full');
  updateCartUI();
}

function closeCart() {
  cartPanel.classList.add('translate-x-full');
  cartDrawer.classList.add('opacity-0', 'pointer-events-none');
}

function bumpCartBadge() {
  cartCounter.classList.remove('bump');
  void cartCounter.offsetWidth;
  cartCounter.classList.add('bump');
}

document.getElementById('cart-trigger-btn').addEventListener('click', openCart);
document.getElementById('close-cart-btn').addEventListener('click', closeCart);
document.getElementById('cart-backdrop').addEventListener('click', closeCart);

// Scroll to Stock Table when clicking Top Header Stock button
document.getElementById('toggle-stock-drawer').addEventListener('click', () => {
  const el = document.getElementById('inventario');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
});

window.addToCart = function(productId) {
  const product = products.find(p => p.id === productId);
  if (!product || product.stock <= 0) return;

  const existing = cart.find(item => item.id === productId);
  const currentCartQty = existing ? existing.quantity : 0;

  if (currentCartQty >= product.stock) {
    alert(`Solo disponemos de ${product.stock} unidades de "${product.title}" en el atelier.`);
    return;
  }

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      img: product.img,
      quantity: 1
    });
  }

  saveState();
  updateCartUI();
  bumpCartBadge();
  openCart();
};

window.changeCartQty = function(productId, delta) {
  const cartItem = cart.find(i => i.id === productId);
  const product = products.find(p => p.id === productId);
  if (!cartItem) return;

  if (delta > 0 && product && cartItem.quantity >= product.stock) {
    alert('Límite de stock alcanzado para esta pieza.');
    return;
  }

  cartItem.quantity += delta;
  if (cartItem.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveState();
  updateCartUI();
  bumpCartBadge();
};

function updateCartUI() {
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCounter.innerText = totalCount;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="h-64 flex flex-col items-center justify-center text-stone-500 text-center">
        <svg class="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p class="text-sm font-mono">Su bolsa de diseño está vacía.</p>
        <a href="#catalogo" onclick="closeCart()" class="mt-4 text-xs font-bold text-amber-400 uppercase tracking-widest underline">Explorar Objetos</a>
      </div>
    `;
    cartSubtotalEl.innerText = '€0.00';
    cartTotalEl.innerText = '€0.00';
    return;
  }

  let subtotal = 0;
  cartItemsContainer.innerHTML = '';

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const el = document.createElement('div');
    el.className = 'flex gap-3 bg-stone-900/60 p-3 rounded-lg border border-stone-800 items-center justify-between';
    el.innerHTML = `
      <img src="${item.img}" alt="${item.title}" class="w-14 h-14 object-cover rounded border border-stone-700">
      <div class="flex-1 min-w-0 pr-2">
        <h4 class="text-xs font-bold font-['Syne'] text-white truncate">${item.title}</h4>
        <span class="text-xs font-mono text-stone-400">€${item.price.toFixed(2)} c/u</span>
        <div class="flex items-center gap-2 mt-2">
          <button onclick="changeCartQty('${item.id}', -1)" class="w-5 h-5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center text-xs font-mono">-</button>
          <span class="font-mono text-xs text-white">${item.quantity}</span>
          <button onclick="changeCartQty('${item.id}', 1)" class="w-5 h-5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center text-xs font-mono">+</button>
        </div>
      </div>
      <div class="text-right font-mono text-xs font-bold text-amber-300">
        €${itemTotal.toFixed(2)}
      </div>
    `;
    cartItemsContainer.appendChild(el);
  });

  cartSubtotalEl.innerText = `€${subtotal.toFixed(2)}`;
  cartTotalEl.innerText = `€${subtotal.toFixed(2)}`;
}

document.getElementById('clear-cart-btn').addEventListener('click', () => {
  if (cart.length > 0 && confirm('¿Desea vaciar los artículos seleccionados?')) {
    cart = [];
    saveState();
    updateCartUI();
  }
});

document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Añada al menos una pieza antes de tramitar el pedido.');
    return;
  }

  // Reduce stocks when checking out
  cart.forEach(cItem => {
    const prod = products.find(p => p.id === cItem.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - cItem.quantity);
    }
  });

  alert('¡Adquisición procesada con éxito! Recibirá los certificados de autenticidad y seguimiento de transporte en su correo.');
  cart = [];
  saveState();
  updateCartUI();
  renderStockTable();
  renderProducts();
  closeCart();
});

// Quick View Modal Logic
const modal = document.getElementById('product-modal');
window.quickViewProduct = function(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  document.getElementById('modal-img').src = prod.img;
  document.getElementById('modal-img').alt = prod.title;
  document.getElementById('modal-title').innerText = prod.title;
  document.getElementById('modal-category').innerText = prod.category;
  document.getElementById('modal-sku').innerText = `CÓDIGO DE ARCHIVO: ${prod.sku}`;
  document.getElementById('modal-description').innerText = prod.desc;
  document.getElementById('modal-price').innerText = `€${prod.price.toFixed(2)}`;

  const stockBadge = document.getElementById('modal-stock-badge');
  if (prod.stock === 0) {
    stockBadge.className = 'font-mono text-xs px-2 py-0.5 rounded font-bold bg-red-950 text-red-300';
    stockBadge.innerText = 'AGOTADO EN TALLER';
  } else {
    stockBadge.className = 'font-mono text-xs px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300';
    stockBadge.innerText = `${prod.stock} DISPONIBLES`;
  }

  const addBtn = document.getElementById('modal-add-btn');
  addBtn.disabled = prod.stock === 0;
  addBtn.onclick = () => {
    addToCart(prod.id);
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

document.getElementById('close-modal-btn').addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
});

// Initialize Cart badge counter
updateCartUI();

// ===== Revelado de secciones al hacer scroll =====
const revealTargets = document.querySelectorAll(
  '[data-purpose="workshop-info"], [data-purpose="inventory-module"], [data-purpose="site-footer"]'
);
revealTargets.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealObserver.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('in-view'));
}
