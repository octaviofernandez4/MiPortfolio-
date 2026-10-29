/* =========================================================
   Cotizador · Andamio Code
   Editá precios y textos en la sección CONFIG.
   ========================================================= */

const CONFIG = {
  whatsapp: '5493813019932',
  urgencyPct: 25,            // recargo por "Lo antes posible"
  maint: { basico: 30, pro: 60 }, // US$/mes
};

const ICONS = {
  landing: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M8 14h8"/><path d="M8 17h5"/>',
  institucional: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  tienda: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  sistema: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
};

const SERVICES = [
  { id: 'landing', name: 'Landing Page', desc: 'Para emprendedores y campañas que necesitan vender un producto o captar consultas.', lo: 250, hi: 400, w: [2, 3] },
  { id: 'institucional', name: 'Web Institucional', desc: 'Hasta 5 secciones, dominio, hosting y correo, SEO + Google Maps.', lo: 450, hi: 700, w: [3, 4], popular: true },
  { id: 'tienda', name: 'Tienda Online', desc: 'Shopify o Tiendanube, Mercado Pago, envíos y stock.', lo: 700, hi: 1100, w: [4, 6] },
  { id: 'sistema', name: 'Sistema a Medida', desc: 'Turnos, stock, ventas o clientes. Panel con usuarios, permisos y backend propio.', lo: 1500, hi: 2500, w: [7, 9] },
];

const FEATURES = [
  { id: 'catalogo', name: 'Catálogo de productos o servicios', desc: 'Fichas con fotos, precios y categorías.', price: 200 },
  { id: 'pagos', name: 'Pagos online', desc: 'Mercado Pago, tarjetas y transferencias.', price: 250 },
  { id: 'panel', name: 'Panel de administración', desc: 'Cargás y editás contenido sin depender de nadie.', price: 300 },
  { id: 'chatbot', name: 'Chatbot con IA', desc: 'Responde consultas frecuentes las 24 hs.', price: 250 },
  { id: 'reservas', name: 'Reservas y turnos online', desc: 'Agenda con disponibilidad y recordatorios.', price: 300 },
  { id: 'usuarios', name: 'Usuarios y login', desc: 'Cuentas para clientes o tu equipo.', price: 200 },
  { id: 'cotizacion', name: 'Formulario de cotización / tasación', desc: 'Tus clientes piden presupuesto con todos los datos.', price: 150 },
  { id: 'idioma', name: 'Multi-idioma', desc: 'Tu sitio en español, inglés u otros idiomas.', price: 150 },
  { id: 'blog', name: 'Blog o novedades', desc: 'Publicá noticias y mejorá tu posicionamiento.', price: 100 },
  { id: 'seo', name: 'SEO avanzado', desc: 'Estrategia de palabras clave y optimización técnica.', price: 100 },
];

// Funcionalidades que vienen incluidas según el tipo de proyecto
const INCLUDED = { tienda: ['catalogo', 'pagos'], sistema: ['panel', 'usuarios'] };

const RUBROS = ['Comercio', 'Gastronomía', 'Salud', 'Concesionaria', 'Inmobiliaria', 'Profesional / estudio', 'Deportes', 'Servicios', 'Otro'];
const MODULES = ['Turnos', 'Stock', 'Ventas', 'Clientes', 'Facturación', 'Otro'];

const OPTS = {
  web: [['no', 'No'], ['renovar', 'Sí, pero quiero renovarla'], ['funciones', 'Sí, quiero sumarle funciones']],
  platform: [['shopify', 'Shopify'], ['tiendanube', 'Tiendanube'], ['instagram', 'Solo Instagram'], ['linktree', 'Linktree / link en bio'], ['recomienden', 'Me recomiendan']],
  products: [['50', 'Hasta 50'], ['200', '50–200'], ['200+', '+200']],
  sections: [['5', 'Hasta 5'], ['5+', 'Más de 5']],
  users: [['3', '1–3'], ['10', '4–10'], ['10+', 'Más de 10']],
  deadline: [['normal', 'Plazo normal'], ['urgente', `Lo antes posible (+${CONFIG.urgencyPct}%)`]],
  content: [['si', 'Sí, los tengo'], ['ayuda', 'Necesito ayuda (+US$ 80–150)']],
  domain: [['si', 'Sí'], ['gestion', 'No, quiero que lo gestionen']],
  maint: [['no', 'Sin mantenimiento'], ['basico', `Básico · US$ ${CONFIG.maint.basico}/mes`], ['pro', `Pro · US$ ${CONFIG.maint.pro}/mes`]],
};

const MAINT_HINT = {
  basico: 'Actualizaciones, copias de seguridad y monitoreo del sitio.',
  pro: 'Todo lo del Básico, más cambios de contenido cada mes y soporte prioritario.',
};

const INIT = {
  type: 'institucional', rubro: null, web: null, platform: null, products: null, sections: null,
  modules: [], users: null, feats: [], deadline: null, content: null, domain: null, maint: null,
  refUrl: '', name: '', business: '', city: '', comment: '',
};

let state = structuredClone(INIT);

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fmt = n => Math.round(n).toLocaleString('es-AR');
const r10 = n => Math.round(n / 10) * 10;
const label = (key, val) => (OPTS[key].find(o => o[0] === val) || [])[1];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const svg = (paths, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ${extra}>${paths}</svg>`;

/* ---------- cálculo ---------- */
function calc() {
  const s = state;
  const svc = SERVICES.find(x => x.id === s.type);
  let lo = svc.lo, hi = svc.hi, wa = svc.w[0], wb = svc.w[1];
  const lines = [{ label: `${svc.name} · base`, val: `US$ ${fmt(lo)} – ${fmt(hi)}` }];
  const add = (lbl, l, h) => {
    lo += l; hi += h;
    lines.push({ label: lbl, val: l === h ? `+US$ ${fmt(l)}` : `+US$ ${fmt(l)} – ${fmt(h)}` });
  };

  if (s.type === 'tienda') {
    if (s.products === '200') add('Catálogo de 50–200 productos', 100, 150);
    if (s.products === '200+') { add('Catálogo de +200 productos', 250, 350); wa++; wb++; }
  }
  if (s.type === 'institucional' && s.sections === '5+') { add('Más de 5 secciones', 150, 250); wb++; }
  if (s.type === 'sistema') {
    const n = s.modules.length;
    if (n > 1) { add(`${n - 1} módulo${n > 2 ? 's' : ''} extra (${s.modules.join(', ')})`, (n - 1) * 250, (n - 1) * 400); wa += n - 1; wb += n - 1; }
    if (s.users === '10') add('4–10 usuarios', 100, 200);
    if (s.users === '10+') { add('Más de 10 usuarios', 250, 400); wb++; }
  }

  const inc = INCLUDED[s.type] || [];
  let nf = 0;
  FEATURES.forEach(f => {
    if (inc.includes(f.id)) lines.push({ label: f.name, val: 'Incluido', included: true });
    else if (s.feats.includes(f.id)) { add(f.name, f.price, f.price); nf++; }
  });
  wa += Math.floor(nf / 2); wb += Math.ceil(nf / 2);

  if (s.content === 'ayuda') { add('Ayuda con textos y fotos', 80, 150); wb++; }
  if (s.domain === 'gestion') add('Gestión de dominio y hosting (1er año)', 40, 60);

  if (s.deadline === 'urgente') {
    const pct = CONFIG.urgencyPct / 100, ul = r10(lo * pct), uh = r10(hi * pct);
    lo += ul; hi += uh;
    lines.push({ label: `Entrega prioritaria (+${CONFIG.urgencyPct}%)`, val: `+US$ ${fmt(ul)} – ${fmt(uh)}` });
    // Entrega prioritaria: una semana menos en cada extremo
    wa = Math.max(1, wa - 1);
    wb = Math.max(wa, wb - 1);
  }
  if (wb < wa) wb = wa;

  const monthly = s.maint && s.maint !== 'no' ? `US$ ${CONFIG.maint[s.maint]}/mes` : null;
  if (monthly) lines.push({ label: `Mantenimiento ${s.maint === 'pro' ? 'Pro' : 'Básico'}`, val: monthly });

  const weeksTxt = wa === wb ? `${wa} semana${wa > 1 ? 's' : ''}` : `${wa}–${wb} semanas`;
  return { svc, lo: r10(lo), hi: r10(hi), weeksTxt, lines, monthly };
}

function progress() {
  const s = state;
  const req = [s.type, s.rubro, s.web, s.deadline, s.content, s.domain, s.maint, s.name.trim(), s.business.trim(), s.city.trim()];
  if (s.type === 'tienda') req.push(s.platform, s.products);
  if (s.type === 'institucional') req.push(s.sections);
  if (s.type === 'sistema') req.push(s.modules.length ? 1 : null, s.users);
  return Math.round(req.filter(Boolean).length / req.length * 100);
}

function waText(c) {
  const s = state, out = [];
  out.push('¡Hola Andamio Code! Armé mi proyecto en el cotizador:', '');
  out.push(`*Proyecto:* ${c.svc.name}`);
  if (s.rubro) out.push(`*Rubro:* ${s.rubro}`);
  if (s.web) out.push(`*Web actual:* ${label('web', s.web)}`);
  if (s.type === 'tienda') {
    if (s.platform) out.push(`*Plataforma:* ${label('platform', s.platform)}`);
    if (s.products) out.push(`*Productos:* ${label('products', s.products)}`);
  }
  if (s.type === 'institucional' && s.sections) out.push(`*Secciones:* ${label('sections', s.sections)}`);
  if (s.type === 'sistema') {
    if (s.modules.length) out.push(`*Automatizar:* ${s.modules.join(', ')}`);
    if (s.users) out.push(`*Usuarios:* ${label('users', s.users)}`);
  }
  out.push('', '*Desglose:*');
  c.lines.forEach(l => out.push(`• ${l.label}: ${l.val}`));
  out.push('');
  out.push(`*Plazo:* ${s.deadline === 'urgente' ? 'Lo antes posible' : 'Plazo normal'}`);
  if (s.content) out.push(`*Textos y fotos:* ${s.content === 'si' ? 'Los tengo' : 'Necesito ayuda'}`);
  if (s.domain) out.push(`*Dominio y hosting:* ${s.domain === 'si' ? 'Ya tengo' : 'Que lo gestionen ustedes'}`);
  if (s.refUrl.trim()) out.push(`*Referencia:* ${s.refUrl.trim()}`);
  out.push('', `*Estimación:* US$ ${fmt(c.lo)} – ${fmt(c.hi)} · ${c.weeksTxt}`, '');
  if (s.name.trim()) out.push(`*Nombre:* ${s.name.trim()}`);
  if (s.business.trim()) out.push(`*Negocio:* ${s.business.trim()}`);
  if (s.city.trim()) out.push(`*Ciudad:* ${s.city.trim()}`);
  if (s.comment.trim()) out.push(`*Comentario:* ${s.comment.trim()}`);
  out.push('', '¿Coordinamos una charla de 15 minutos?');
  return out.join('\n');
}

/* ---------- render ---------- */
function renderServices() {
  $('#services').innerHTML = SERVICES.map(v => `
    <button type="button" class="svc ${state.type === v.id ? 'is-active' : ''}" data-svc="${v.id}" role="radio" aria-checked="${state.type === v.id}">
      <div class="svc-top">
        <div class="icon-box">${svg(ICONS[v.id])}</div>
        <div class="svc-right">
          ${v.popular ? '<span class="badge">MÁS ELEGIDO</span>' : ''}
          <span class="radio"></span>
        </div>
      </div>
      <div class="svc-body">
        <div class="svc-name">${v.name}</div>
        <div class="svc-desc">${v.desc}</div>
      </div>
      <div class="svc-foot"><span>Desde US$ ${fmt(v.lo)}</span><span class="mono">${v.w[0]}–${v.w[1]} sem.</span></div>
    </button>`).join('');
}

function pill(key, val, lbl, active, extraClass = '') {
  return `<button type="button" class="pill ${extraClass} ${active ? 'is-active' : ''}" data-key="${key}" data-val="${esc(val)}" aria-pressed="${active}">${lbl}</button>`;
}

function renderPills() {
  $$('[data-seg]').forEach(el => {
    const key = el.dataset.seg;
    el.innerHTML = OPTS[key].map(([v, l]) => pill(key, v, l, state[key] === v)).join('');
  });
  $('#rubros').innerHTML = RUBROS.map(r => pill('rubro', r, r, state.rubro === r, 'chip')).join('');
  $('#modules').innerHTML = MODULES.map(m => pill('modules', m, m, state.modules.includes(m), 'chip')).join('');
  ['tienda', 'institucional', 'sistema'].forEach(t => { $('#cond-' + t).hidden = state.type !== t; });
  const hint = $('#maint-hint');
  hint.hidden = !MAINT_HINT[state.maint];
  hint.textContent = MAINT_HINT[state.maint] || '';
}

function renderFeatures() {
  const inc = INCLUDED[state.type] || [];
  const check = svg('<path d="M20 6 9 17l-5-5"/>', 'stroke-width="3.2"');
  $('#features').innerHTML = FEATURES.map(f => {
    const included = inc.includes(f.id), sel = !included && state.feats.includes(f.id);
    return `
    <button type="button" class="feat ${included ? 'is-included' : ''} ${sel ? 'is-active' : ''}" data-feat="${f.id}" ${included ? 'aria-disabled="true"' : ''} aria-pressed="${included || sel}">
      <span class="check">${check}</span>
      <span class="feat-body"><span class="feat-name">${f.name}</span><span class="feat-desc">${f.desc}</span></span>
      <span class="feat-price">${included ? 'Incluido' : `+US$ ${fmt(f.price)}`}</span>
    </button>`;
  }).join('');
}

let shown = null, raf = 0, bumpT = 0;
function animatePrice(lo, hi) {
  const rangeEl = $('#range'), priceEl = $('#price');
  if (!shown) { shown = [lo, hi]; rangeEl.textContent = `${fmt(lo)} – ${fmt(hi)}`; return; }
  if (shown.target && shown.target[0] === lo && shown.target[1] === hi) return;
  const from = [shown[0], shown[1]], t0 = performance.now(), D = 450;
  shown.target = [lo, hi];
  cancelAnimationFrame(raf);
  const step = now => {
    const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3);
    shown[0] = from[0] + (lo - from[0]) * e;
    shown[1] = from[1] + (hi - from[1]) * e;
    rangeEl.textContent = `${fmt(r10(shown[0]))} – ${fmt(r10(shown[1]))}`;
    if (k < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  priceEl.classList.add('bump');
  clearTimeout(bumpT);
  bumpT = setTimeout(() => priceEl.classList.remove('bump'), 220);
}

function renderPanel() {
  const c = calc(), p = progress();
  $('#svc-name').textContent = c.svc.name;
  animatePrice(c.lo, c.hi);
  $('#weeks').textContent = c.weeksTxt;
  $('#m-weeks').textContent = `· ${c.weeksTxt}`;
  $('#monthly-row').hidden = !c.monthly;
  $('#monthly').textContent = c.monthly ? `+ ${c.monthly}` : '';
  $('#progress-txt').textContent = `${p}%`;
  $$('[data-progress]').forEach(b => { b.style.width = p + '%'; });
  $('#lines').innerHTML = c.lines.map(l =>
    `<div class="line ${l.included ? 'is-included' : ''}"><span>${esc(l.label)}</span><span>${esc(l.val)}</span></div>`).join('');
  $('#wa').href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(waText(c))}`;
}

function render() {
  renderServices();
  renderPills();
  renderFeatures();
  renderPanel();
}

function syncInputs() {
  ['refUrl', 'name', 'business', 'city', 'comment'].forEach(k => { $('#' + k).value = state[k]; });
}

/* ---------- eventos ---------- */
document.addEventListener('click', e => {
  const svc = e.target.closest('[data-svc]');
  if (svc) { state.type = svc.dataset.svc; return render(); }

  const p = e.target.closest('.pill');
  if (p) {
    const { key, val } = p.dataset;
    if (key === 'modules') {
      state.modules = state.modules.includes(val) ? state.modules.filter(x => x !== val) : [...state.modules, val];
    } else {
      state[key] = val;
    }
    return render();
  }

  const f = e.target.closest('[data-feat]');
  if (f) {
    const id = f.dataset.feat;
    if ((INCLUDED[state.type] || []).includes(id)) return;
    state.feats = state.feats.includes(id) ? state.feats.filter(x => x !== id) : [...state.feats, id];
    return render();
  }
});

['refUrl', 'name', 'business', 'city', 'comment'].forEach(k => {
  $('#' + k).addEventListener('input', e => { state[k] = e.target.value; renderPanel(); });
});

$('#reset').addEventListener('click', () => {
  state = structuredClone(INIT);
  syncInputs();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

$('#sheet-btn').addEventListener('click', () => {
  const panel = $('#panel'), open = panel.classList.toggle('open');
  $('#sheet-btn').textContent = open ? 'Cerrar ↓' : 'Desglose ↑';
  $('#sheet-btn').setAttribute('aria-expanded', open);
});

$('#info-btn').addEventListener('click', () => {
  const panel = $('#panel'), open = panel.classList.toggle('info-open');
  $('#info-btn').textContent = open ? 'Menos info ↑' : 'Más info ↓';
  $('#info-btn').setAttribute('aria-expanded', open);
});

render();
