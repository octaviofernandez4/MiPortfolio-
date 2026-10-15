// ===== Datos (reemplazá por tu API o JSON) =====
const products = [
  { id: 1, name: "Nova X12", cat: "Celulares", price: 899999, stock: 14, specs: { pantalla: "6,7\" OLED 120 Hz", procesador: "Octa-core 3,2 GHz", ram: 12, almacenamiento: 256, camara: 50, bateria: 5000, peso: 198, so: "Android 15" } },
  { id: 2, name: "Nova X12 Lite", cat: "Celulares", price: 549999, stock: 4, specs: { pantalla: "6,5\" AMOLED 90 Hz", procesador: "Octa-core 2,4 GHz", ram: 8, almacenamiento: 128, camara: 48, bateria: 4800, peso: 184, so: "Android 15" } },
  { id: 3, name: "Orbit Pro 15", cat: "Celulares", price: 1249999, stock: 7, specs: { pantalla: "6,8\" LTPO 120 Hz", procesador: "Octa-core 3,4 GHz", ram: 16, almacenamiento: 512, camara: 200, bateria: 5200, peso: 221, so: "Android 15" } },
  { id: 4, name: "Kite S4", cat: "Celulares", price: 329999, stock: 22, specs: { pantalla: "6,4\" LCD 90 Hz", procesador: "Octa-core 2,0 GHz", ram: 6, almacenamiento: 128, camara: 50, bateria: 5000, peso: 190, so: "Android 14" } },
  { id: 5, name: "Slate Tab 11", cat: "Tablets", price: 699999, stock: 9, specs: { pantalla: "11\" IPS 120 Hz", procesador: "Octa-core 2,8 GHz", ram: 8, almacenamiento: 256, camara: 13, bateria: 8000, peso: 480, so: "Android 15" } },
  { id: 6, name: "Slate Tab Mini", cat: "Tablets", price: 429999, stock: 0, specs: { pantalla: "8,7\" IPS 60 Hz", procesador: "Octa-core 2,2 GHz", ram: 4, almacenamiento: 64, camara: 8, bateria: 5100, peso: 340, so: "Android 14" } },
  { id: 7, name: "Pulse Watch 3", cat: "Wearables", price: 259999, stock: 12, specs: { pantalla: "1,4\" AMOLED", procesador: "Dual-core 1,2 GHz", ram: 2, almacenamiento: 16, camara: 0, bateria: 425, peso: 33, so: "WearOS 5" } },
  { id: 8, name: "Echo Buds Pro", cat: "Audio", price: 149999, stock: 3, specs: { pantalla: "—", procesador: "Chip de audio H2", ram: 0, almacenamiento: 0, camara: 0, bateria: 60, peso: 5, so: "—" } },
];

const specLabels = {
  pantalla: "Pantalla", procesador: "Procesador", ram: "RAM", almacenamiento: "Almacenamiento",
  camara: "Cámara principal", bateria: "Batería", peso: "Peso", so: "Sistema",
};
// Para el comparador: qué filas son numéricas y si "más" es mejor
const numericRules = { ram: "max", almacenamiento: "max", camara: "max", bateria: "max", peso: "min", price: "min" };
const units = { ram: " GB", almacenamiento: " GB", camara: " MP", bateria: " mAh", peso: " g" };

// ===== Helpers =====
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = n => "$" + n.toLocaleString("es-AR");
const fmt = (key, v) => (typeof v === "number" ? (v === 0 ? "—" : v.toLocaleString("es-AR") + (units[key] || "")) : v);
const stockInfo = n =>
  n === 0 ? { cls: "stock--out", txt: "Sin stock" } :
  n <= 5 ? { cls: "stock--low", txt: `Últimas ${n}` } :
  { cls: "stock--ok", txt: `${n} en stock` };

// ===== Estado =====
const state = { cat: "all", q: "", sort: "default", compare: [] };
const MAX_COMPARE = 3;

// ===== Catálogo =====
function getVisible() {
  let list = products.filter(p =>
    (state.cat === "all" || p.cat === state.cat) &&
    p.name.toLowerCase().includes(state.q.toLowerCase())
  );
  if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
  if (state.sort === "stock") list.sort((a, b) => b.stock - a.stock);
  return list;
}

function renderGrid() {
  const list = getVisible();
  $("#empty").hidden = list.length > 0;
  $("#grid").innerHTML = list.map(p => {
    const s = stockInfo(p.stock);
    const checked = state.compare.includes(p.id);
    const short = p.cat === "Audio" ? `Batería ${p.specs.bateria} h` :
      `${p.specs.ram ? p.specs.ram + " GB RAM · " : ""}${p.specs.almacenamiento ? p.specs.almacenamiento + " GB" : ""}`;
    return `
      <article class="card ${checked ? "is-compared" : ""}" data-id="${p.id}">
        <div class="ph"><span>foto · ${p.name}</span></div>
        <div class="card__body">
          <div class="card__top">
            <span class="card__cat">${p.cat}</span>
            <span class="stock ${s.cls}" data-stock="${p.id}">${s.txt}</span>
          </div>
          <h3>${p.name}</h3>
          <p class="card__specs">${p.specs.pantalla !== "—" ? p.specs.pantalla + " · " : ""}${short}</p>
          <p class="card__price">${money(p.price)}<small>o 12 cuotas de ${money(Math.round(p.price / 12))}</small></p>
          <div class="card__actions">
            <button class="btn btn--ghost btn--sm" data-sheet="${p.id}">Ficha técnica</button>
          </div>
          <label class="compare-toggle">
            <input type="checkbox" data-compare="${p.id}" ${checked ? "checked" : ""}> Comparar
          </label>
        </div>
      </article>`;
  }).join("");
}

// ===== Ficha técnica (modal) =====
function openSheet(id) {
  const p = products.find(x => x.id === id);
  const s = stockInfo(p.stock);
  const inCompare = state.compare.includes(id);
  $("#modalBody").innerHTML = `
    <div class="sheet">
      <div class="ph"><span>foto · ${p.name}</span></div>
      <div>
        <span class="card__cat">${p.cat}</span>
        <h3>${p.name}</h3>
        <span class="stock ${s.cls}" data-stock="${p.id}">${s.txt}</span>
        <p class="sheet__price">${money(p.price)}</p>
        <table class="specs">
          ${Object.entries(p.specs).map(([k, v]) => `<tr><th>${specLabels[k]}</th><td>${fmt(k, v)}</td></tr>`).join("")}
        </table>
        <div class="sheet__actions">
          <a class="btn btn--primary" href="#contacto" data-close>${p.stock ? "Consultar compra" : "Avisarme cuando ingrese"}</a>
          <button class="btn btn--ghost" data-modal-compare="${p.id}">${inCompare ? "Quitar del comparador" : "Agregar al comparador"}</button>
        </div>
      </div>
    </div>`;
  $("#modal").classList.add("is-open");
  $("#modal").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeSheet() {
  $("#modal").classList.remove("is-open");
  $("#modal").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// ===== Comparador =====
function toggleCompare(id) {
  const i = state.compare.indexOf(id);
  if (i > -1) state.compare.splice(i, 1);
  else {
    if (state.compare.length >= MAX_COMPARE) { alert(`Podés comparar hasta ${MAX_COMPARE} equipos.`); return false; }
    state.compare.push(id);
  }
  renderGrid(); renderTray(); renderCompare();
  return true;
}

function renderTray() {
  const items = state.compare.map(id => products.find(p => p.id === id));
  $("#tray").classList.toggle("is-open", items.length > 0);
  $("#trayCount").textContent = items.length;
  $("#trayItems").innerHTML = items.map(p =>
    `<span class="tray__pill">${p.name}<button data-remove="${p.id}" aria-label="Quitar">✕</button></span>`).join("");
}

function renderCompare() {
  const items = state.compare.map(id => products.find(p => p.id === id));
  const area = $("#compareArea");
  if (!items.length) {
    area.innerHTML = `<div class="compare-empty">Todavía no elegiste equipos para comparar.<br><a href="#catalogo" class="btn btn--ghost btn--sm">Ir al catálogo</a></div>`;
    return;
  }
  const best = key => {
    if (!numericRules[key] || items.length < 2) return null;
    const vals = items.map(p => (key === "price" ? p.price : p.specs[key])).filter(v => v > 0);
    if (!vals.length) return null;
    return numericRules[key] === "max" ? Math.max(...vals) : Math.min(...vals);
  };
  const rows = [["price", "Precio"], ["stock", "Stock"], ...Object.entries(specLabels)];
  area.innerHTML = `
    <div class="table-wrap">
      <table class="ctable">
        <thead><tr><th></th>${items.map(p => `
          <th><div class="ph"><span>foto</span></div><h3>${p.name}</h3>
          <button class="remove" data-remove="${p.id}">Quitar ✕</button></th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map(([key, label]) => {
            const b = best(key);
            return `<tr><th>${label}</th>${items.map(p => {
              if (key === "stock") { const s = stockInfo(p.stock); return `<td><span class="stock ${s.cls}" data-stock="${p.id}">${s.txt}</span></td>`; }
              const v = key === "price" ? p.price : p.specs[key];
              const txt = key === "price" ? money(v) : fmt(key, v);
              return `<td class="${b !== null && v === b ? "best" : ""}">${txt}</td>`;
            }).join("")}</tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>`;
}

// ===== Stock en tiempo real (simulado) =====
// Para producción: reemplazá simulateStock() por un fetch/WebSocket a tu backend
function renderLive() {
  const top = products.filter(p => p.cat === "Celulares" || p.cat === "Tablets").slice(0, 5);
  $("#liveList").innerHTML = top.map(p => {
    const s = stockInfo(p.stock);
    return `<li><span>${p.name}</span><span class="stock ${s.cls}" data-stock="${p.id}">${s.txt}</span></li>`;
  }).join("");
}

function updateStockBadges(id) {
  const p = products.find(x => x.id === id);
  const s = stockInfo(p.stock);
  $$(`[data-stock="${id}"]`).forEach(el => {
    el.className = `stock ${s.cls}`;
    el.textContent = s.txt;
    el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
  });
}

let lastUpdate = Date.now();
function simulateStock() {
  const p = products[Math.floor(Math.random() * products.length)];
  const delta = Math.random() < 0.7 ? -1 : Math.ceil(Math.random() * 4); // ventas más frecuentes que reposiciones
  p.stock = Math.max(0, p.stock + delta);
  updateStockBadges(p.id);
  lastUpdate = Date.now();
}
setInterval(simulateStock, 3500);
setInterval(() => {
  const sec = Math.round((Date.now() - lastUpdate) / 1000);
  $("#liveTime").textContent = sec < 2 ? "actualizado ahora" : `hace ${sec} s`;
}, 1000);

// ===== Eventos =====
$("#filters").addEventListener("click", e => {
  const btn = e.target.closest(".chip"); if (!btn) return;
  $$(".chip").forEach(c => c.classList.toggle("is-active", c === btn));
  state.cat = btn.dataset.cat; renderGrid();
});
$("#search").addEventListener("input", e => { state.q = e.target.value; renderGrid(); });
$("#sort").addEventListener("change", e => { state.sort = e.target.value; renderGrid(); });

document.addEventListener("click", e => {
  const sheet = e.target.closest("[data-sheet]");
  if (sheet) return openSheet(+sheet.dataset.sheet);

  const rm = e.target.closest("[data-remove]");
  if (rm) return toggleCompare(+rm.dataset.remove);

  const mc = e.target.closest("[data-modal-compare]");
  if (mc) { const id = +mc.dataset.modalCompare; if (toggleCompare(id)) openSheet(id); return; }

  if (e.target.closest("[data-close]")) closeSheet();
});
document.addEventListener("change", e => {
  if (e.target.matches("[data-compare]")) {
    const ok = toggleCompare(+e.target.dataset.compare);
    if (!ok) e.target.checked = false;
  }
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });

$("#trayClear").addEventListener("click", () => { state.compare = []; renderGrid(); renderTray(); renderCompare(); });

$("#contactForm").addEventListener("submit", e => {
  e.preventDefault(); $("#formOk").hidden = false; e.target.reset();
});

// ===== Init =====
renderGrid(); renderLive(); renderTray(); renderCompare();
