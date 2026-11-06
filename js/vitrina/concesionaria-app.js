document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const device = $('.device'), app = $('#app');

  // ---------- Íconos (Lucide inline) ----------
  const ICONS = {
    'arrow-right':'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'chevron-left':'<path d="m15 18-6-6 6-6"/>',
    'chevron-right':'<path d="m9 18 6-6-6-6"/>',
    'play':'<polygon points="6 3 20 12 6 21 6 3"/>',
    'play-circle':'<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
    'zap':'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    'battery-charging':'<path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"/><path d="m11 7-3 5h4l-3 5"/><line x1="22" x2="22" y1="11" y2="13"/>',
    'atom':'<circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/>',
    'x':'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'home':'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    'car':'<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    'calendar':'<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    'user':'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'search':'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'heart':'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    'gauge':'<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
    'route':'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    'wind':'<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
    'timer':'<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
    'signal':'<path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/>',
    'wifi':'<path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" x2="12.01" y1="20" y2="20"/>',
    'battery':'<rect width="16" height="10" x="2" y="7" rx="2"/><line x1="22" x2="22" y1="11" y2="13"/><rect width="10" height="6" x="5" y="9" fill="currentColor" stroke="none"/>',
    'check':'<path d="M20 6 9 17l-5-5"/>'
  };
  const icon = n => `<svg class="ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const renderIcons = (root = document) => $$('i[data-icon]', root).forEach(i => i.outerHTML = icon(i.dataset.icon));

  // ---------- Datos ----------
  const MODELS = [
    { name:'Pure', tag:'Gran turismo', type:'grand', price:'$2.250.000', img:'../../assets/img/vitrina/auto-hilux.webp',
      desc:'La esencia del ZX-1. Equilibrio perfecto entre confort y rendimiento para el día a día.', specs:[['1.600','HP'],['560','Millas'],['2,1s','0–60']] },
    { name:'Performance', tag:'Pista', type:'track', price:'$2.650.000', img:'../../assets/img/vitrina/auto-corolla.webp',
      desc:'Aerodinámica activa y chasis afinado en pista. Nacido para el cronómetro.', specs:[['2.000','HP'],['520','Millas'],['1,85s','0–60']] },
    { name:'Signature', tag:'Gran turismo', type:'grand', price:'$3.250.000', img:'../../assets/img/vitrina/auto-208.webp',
      desc:'Edición numerada con interiores artesanales y personalización total.', specs:[['2.000','HP'],['540','Millas'],['1,9s','0–60']] }
  ];

  // ---------- Reloj ----------
  const clock = $('#clock');
  const tick = () => { const d = new Date(); clock.textContent = d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'); };
  tick(); setInterval(tick, 30000);

  // ---------- Haptic-like feedback ----------
  const haptic = () => navigator.vibrate && navigator.vibrate(8);

  // ---------- Dynamic Island notifications ----------
  const island = $('#island'), islandText = $('#islandText');
  let islandT;
  const notify = msg => {
    islandText.textContent = msg; island.classList.add('expand'); haptic();
    clearTimeout(islandT); islandT = setTimeout(() => island.classList.remove('expand'), 2600);
  };

  // ---------- Tabs ----------
  const screens = $$('.screen'), tabs = $$('#tabbar button');
  const goTab = name => {
    closeDetail();
    screens.forEach(s => s.classList.toggle('active', s.dataset.screen === name));
    tabs.forEach(t => t.classList.toggle('on', t.dataset.tab === name));
    device.classList.toggle('on-dark', name === 'tech');
    const scr = $(`[data-screen="${name}"] .scroll`); scr.scrollTop = 0;
    if (name === 'home') runCounters();
    if (name === 'tech') setRing(ringVal);
    haptic();
  };
  tabs.forEach(t => t.addEventListener('click', () => goTab(t.dataset.tab)));
  document.addEventListener('click', e => { const g = e.target.closest('[data-tab-go]'); if (g) goTab(g.dataset.tabGo); });

  // ---------- Hero carousel ----------
  const car = $('#heroCarousel'), cards = $$('.hero-card', car), dots = $$('#pager i');
  const io = new IntersectionObserver(es => es.forEach(e => {
    e.target.classList.toggle('in-view', e.isIntersecting);
    if (e.isIntersecting) { const i = cards.indexOf(e.target); dots.forEach((d, j) => d.classList.toggle('on', i === j)); }
  }), { root: car, threshold: 0.6 });
  cards.forEach(c => io.observe(c));
  let auto = setInterval(() => {
    const i = dots.findIndex(d => d.classList.contains('on'));
    car.scrollTo({ left: cards[(i + 1) % cards.length].offsetLeft - 20, behavior: 'smooth' });
  }, 5000);
  car.addEventListener('pointerdown', () => clearInterval(auto), { once: true });

  // ---------- Counters ----------
  const ease = t => 1 - Math.pow(1 - t, 3);
  const runCounters = () => $$('[data-count]').forEach(el => {
    const end = +el.dataset.count, dec = +el.dataset.decimals || 0, suf = el.dataset.suffix || '', t0 = performance.now();
    const step = now => {
      const p = Math.min(Math.max(0, now - t0) / 1600, 1);
      el.textContent = (end * ease(p)).toLocaleString('es-AR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  runCounters();

  // ---------- Models list + filter ----------
  const list = $('#modelList'), search = $('#search');
  let filter = 'all';
  const renderModels = () => {
    const q = search.value.trim().toLowerCase();
    const items = MODELS.map((m, i) => ({ ...m, i })).filter(m => (filter === 'all' || m.type === filter) && ('zx-1 ' + m.name).toLowerCase().includes(q));
    list.innerHTML = items.length ? items.map((m, k) => `
      <button class="model" data-open-model="${m.i}" style="--d:${k * .08}s">
        <div class="model-img" style="--img:url('${m.img}')"></div>
        <div class="model-info"><div><h3>ZX-1 <em>${m.name}</em></h3><p>${m.tag} · Desde ${m.price}</p></div><span class="chev"><i data-icon="chevron-right"></i></span></div>
      </button>`).join('') : '<p class="empty">Sin resultados</p>';
    renderIcons(list);
  };
  const seg = $('#seg'), segBtns = $$('button', seg), thumb = $('.seg-thumb', seg);
  segBtns.forEach((b, i) => b.addEventListener('click', () => {
    segBtns.forEach(x => x.classList.toggle('on', x === b));
    thumb.style.transform = `translateX(${i * 100}%)`;
    filter = b.dataset.filter; renderModels(); haptic();
  }));
  search.addEventListener('input', renderModels);

  // ---------- Detail (push navigation) ----------
  const detail = $('#detail'), dScroll = $('#detailScroll'), dHero = $('#detailHero'), dNav = $('#detailNav');
  let current = 0;
  const openDetail = i => {
    const m = MODELS[current = i];
    dHero.style.setProperty('--img', `url('${m.img}')`);
    $('#dTag').textContent = m.tag;
    $('#dTitle').textContent = 'ZX-1 ' + m.name;
    $('#detailNavTitle').textContent = 'ZX-1 ' + m.name;
    $('#dDesc').textContent = m.desc;
    $('#dPrice').textContent = m.price;
    $('#dSpecs').innerHTML = m.specs.map(s => `<div><strong>${s[0]}</strong><span>${s[1]}</span></div>`).join('');
    dScroll.scrollTop = 0; dNav.classList.remove('solid');
    detail.classList.add('open'); detail.setAttribute('aria-hidden', 'false');
    app.classList.add('pushed'); device.classList.remove('on-dark'); haptic();
  };
  function closeDetail() {
    if (!detail.classList.contains('open')) return;
    detail.classList.remove('open'); detail.setAttribute('aria-hidden', 'true');
    app.classList.remove('pushed');
    device.classList.toggle('on-dark', $('.screen.active').dataset.screen === 'tech');
  }
  document.addEventListener('click', e => { const o = e.target.closest('[data-open-model]'); if (o) openDetail(+o.dataset.openModel); });
  $('#backBtn').addEventListener('click', closeDetail);
  dScroll.addEventListener('scroll', () => {
    const y = dScroll.scrollTop;
    dNav.classList.toggle('solid', y > 300);
    dHero.style.transform = y < 0 ? `scale(${1 - y / 400})` : `translateY(${y * .4}px)`;
  }, { passive: true });

  // Swipe desde el borde para volver (gesto iOS)
  let sx = null;
  detail.addEventListener('touchstart', e => { const x = e.touches[0].clientX - detail.getBoundingClientRect().left; sx = x < 30 ? e.touches[0].clientX : null; }, { passive: true });
  detail.addEventListener('touchmove', e => { if (sx === null) return; const dx = Math.max(0, e.touches[0].clientX - sx); detail.style.transition = 'none'; detail.style.transform = `translateX(${dx}px)`; }, { passive: true });
  detail.addEventListener('touchend', e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx; detail.style.transition = ''; detail.style.transform = '';
    if (dx > 110) closeDetail(); sx = null;
  });

  $('#favBtn').addEventListener('click', e => {
    const b = e.currentTarget; b.classList.toggle('liked');
    b.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 350, easing: 'cubic-bezier(.32,.72,0,1)' });
    notify(b.classList.contains('liked') ? 'Guardado en favoritos' : 'Quitado de favoritos');
  });
  $$('.sw').forEach(s => s.addEventListener('click', () => {
    $$('.sw').forEach(x => x.classList.toggle('on', x === s));
    $('#swName').textContent = s.dataset.name; haptic();
  }));
  $('#reserveBtn').addEventListener('click', () => {
    $('#modelSelect').selectedIndex = current; goTab('reserve');
  });

  // ---------- Charging ring ----------
  const ring = $('#ringFg'), rVal = $('#ringVal'), rTime = $('#ringTime'), C = 540.35;
  let ringVal = 10, charging = false;
  function setRing(v) { ring.style.transition = 'stroke-dashoffset .8s cubic-bezier(.32,.72,0,1)'; ring.style.strokeDashoffset = C * (1 - v / 100); rVal.textContent = Math.round(v); }
  $('#chargeBtn').addEventListener('click', () => {
    if (charging) return; charging = true; ringVal = 10; ring.style.transition = 'none';
    const t0 = performance.now(), dur = 3200;
    const step = now => {
      const p = Math.min(Math.max(0, now - t0) / dur, 1), v = 10 + 70 * ease(p);
      ring.style.strokeDashoffset = C * (1 - v / 100); rVal.textContent = Math.round(v);
      rTime.textContent = p < 1 ? Math.ceil(12 * (1 - p)) + ' min restantes' : 'Carga al 80% · lista';
      if (p < 1) requestAnimationFrame(step); else { charging = false; ringVal = 80; notify('Carga completada · 80%'); }
    };
    requestAnimationFrame(step); haptic();
  });

  // ---------- Bottom sheet (film) ----------
  const sheet = $('#sheet'), back = $('#sheetBackdrop');
  const toggleSheet = o => { sheet.classList.toggle('open', o); back.classList.toggle('open', o); sheet.style.transform = ''; };
  $('#filmBtn').addEventListener('click', e => { e.stopPropagation(); toggleSheet(true); });
  $('#sheetClose').addEventListener('click', () => toggleSheet(false));
  back.addEventListener('click', () => toggleSheet(false));
  let sy = null;
  sheet.addEventListener('pointerdown', e => { if (e.target.closest('#sheetGallery')) return; sy = e.clientY; sheet.style.transition = 'none'; sheet.setPointerCapture(e.pointerId); });
  sheet.addEventListener('pointermove', e => { if (sy !== null) sheet.style.transform = `translateY(${Math.max(0, e.clientY - sy)}px)`; });
  sheet.addEventListener('pointerup', e => { if (sy === null) return; sheet.style.transition = ''; const dy = e.clientY - sy; sy = null; toggleSheet(dy < 100); });

  // ---------- Form ----------
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('input[required]', e.target).forEach(inp => {
      const bad = !inp.value.trim() || (inp.type === 'email' && !/^\S+@\S+\.\S+$/.test(inp.value));
      const row = inp.closest('.frow'); row.classList.remove('error'); void row.offsetWidth;
      if (bad) { row.classList.add('error'); ok = false; }
    });
    if (!ok) { navigator.vibrate && navigator.vibrate([20, 40, 20]); return; }
    e.target.reset(); notify('Consulta enviada ✓');
  });

  // ---------- Galería del sheet ----------
  const sg = $('#sheetGallery'), sgDots = $$('#sgDots i');
  sg.addEventListener('scroll', () => {
    const i = Math.round(sg.scrollLeft / sg.clientWidth);
    sgDots.forEach((d, k) => d.classList.toggle('on', k === i));
  }, { passive: true });

  renderModels();
  renderIcons();
});
