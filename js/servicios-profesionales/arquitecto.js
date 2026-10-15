// --- 1. PORTFOLIO FILTERING LOGIC ---
const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => {
      b.classList.remove('bg-primary', 'text-on-primary');
      b.classList.add('bg-surface', 'text-on-surface');
    });
    btn.classList.add('bg-primary', 'text-on-primary');
    btn.classList.remove('bg-surface', 'text-on-surface');

    const filter = btn.getAttribute('data-filter');
    portfolioItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// --- 2. MODAL LOGIC ---
const modal = document.getElementById('project-modal');
let currentProjectTitle = '';

function openModal(title, loc, area, year, scope, desc) {
  currentProjectTitle = title;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-loc').textContent = loc;
  document.getElementById('modal-area').textContent = area;
  document.getElementById('modal-year').textContent = year;
  document.getElementById('modal-scope').textContent = scope;
  document.getElementById('modal-desc').textContent = desc;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

function quoteThisProject() {
  closeModal();
  const cotizadorSection = document.getElementById('cotizador');
  if (cotizadorSection) {
    cotizadorSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// --- 3. DYNAMIC COST CALCULATOR LOGIC ---
let calcBaseRate = 1200;
let calcTypeName = 'Vivienda Unifamiliar';
let calcFinishMultiplier = 1.25;

const typeButtons = document.querySelectorAll('.calc-type-btn');
typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    typeButtons.forEach(b => {
      b.classList.remove('bg-primary', 'text-on-primary');
      b.classList.add('bg-surface', 'text-on-surface');
      const spanDesc = b.querySelector('.font-label-md');
      if (spanDesc) spanDesc.classList.add('text-outline');
    });
    btn.classList.add('bg-primary', 'text-on-primary');
    btn.classList.remove('bg-surface', 'text-on-surface');
    const spanActive = btn.querySelector('.font-label-md');
    if (spanActive) spanActive.classList.remove('text-outline');

    calcBaseRate = parseFloat(btn.getAttribute('data-rate'));
    calcTypeName = btn.getAttribute('data-label');
    document.getElementById('summary-type').textContent = calcTypeName;
    recalculateTotal();
  });
});

const surfaceSlider = document.getElementById('calc-surface-slider');
const surfaceValDisplay = document.getElementById('calc-surface-val');
const summarySurfaceDisplay = document.getElementById('summary-surface');

surfaceSlider.addEventListener('input', (e) => {
  const val = e.target.value;
  surfaceValDisplay.textContent = val;
  summarySurfaceDisplay.textContent = `${val} m²`;
  recalculateTotal();
});

const finishButtons = document.querySelectorAll('.calc-finish-btn');
finishButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    finishButtons.forEach(b => {
      b.classList.remove('bg-primary', 'text-on-primary');
      b.classList.add('bg-surface', 'text-on-surface');
      const bSub = b.querySelector('.font-body-sm');
      if (bSub) bSub.classList.add('text-on-surface-variant');
      b.querySelector('.font-label-sm')?.classList.remove('text-secondary-fixed');
      b.querySelector('.font-label-sm')?.classList.add('text-secondary');
    });
    btn.classList.add('bg-primary', 'text-on-primary');
    btn.classList.remove('bg-surface', 'text-on-surface');
    const btnSub = btn.querySelector('.font-body-sm');
    if (btnSub) btnSub.classList.remove('text-on-surface-variant');
    btn.querySelector('.font-label-sm')?.classList.add('text-secondary-fixed');
    btn.querySelector('.font-label-sm')?.classList.remove('text-secondary');

    calcFinishMultiplier = parseFloat(btn.getAttribute('data-mult'));
    recalculateTotal();
  });
});

const optTurnkey = document.getElementById('calc-opt-turnkey');
const optLeed = document.getElementById('calc-opt-leed');
const optVr = document.getElementById('calc-opt-vr');

[optTurnkey, optLeed, optVr].forEach(chk => {
  chk.addEventListener('change', recalculateTotal);
});

function recalculateTotal() {
  const area = parseFloat(surfaceSlider.value);
  const effectiveSqmRate = calcBaseRate * calcFinishMultiplier;
  let addOns = 0;
  if (optTurnkey.checked) addOns += 14000;
  if (optLeed.checked) addOns += 9500;
  if (optVr.checked) addOns += 3200;

  const totalEstimate = Math.round((area * effectiveSqmRate) + addOns);

  // Animate or render Total
  document.getElementById('calc-total-display').textContent = totalEstimate.toLocaleString('en-US');
  document.getElementById('summary-sqm-rate').textContent = `$${Math.round(effectiveSqmRate).toLocaleString('en-US')} USD / m²`;

  // Duration calculation based on area
  let durationText = '8 a 10 Meses';
  if (area > 200 && area <= 400) durationText = '12 a 15 Meses';
  else if (area > 400 && area <= 700) durationText = '16 a 20 Meses';
  else if (area > 700) durationText = '22 a 28 Meses';
  document.getElementById('summary-duration').textContent = durationText;

  // Update Contact input sync
  const budgetInput = document.getElementById('contact-budget');
  if (budgetInput) {
    budgetInput.value = `$${totalEstimate.toLocaleString('en-US')} USD (${calcTypeName} ${area} m²)`;
  }
}

function transferEstimateToContact() {
  recalculateTotal();
  const contactSection = document.getElementById('contacto');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('contact-message').focus();
  }
}

// --- 4. CONTACT FORM SUBMISSION & FEEDBACK ---
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> <span>Procesando...</span>`;
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = `<span>Enviado Correctamente</span> <span class="material-symbols-outlined text-[18px]">done</span>`;
    btn.classList.remove('bg-primary');
    btn.classList.add('bg-secondary');

    const toast = document.getElementById('contact-toast');
    toast.classList.remove('hidden');
    toast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 900);
}

// Initial Calculation Run
recalculateTotal();
