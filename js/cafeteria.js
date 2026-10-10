const MENU = {
  cafe: [
    ['Espresso', 'Blend de la casa, notas a chocolate y avellana.', '$2.400'],
    ['Flat white', 'Doble ristretto con leche texturizada.', '$3.600'],
    ['Filtrado V60', 'Origen único que cambia cada mes.', '$3.900'],
    ['Cortado en jarrito', 'Clásico de barrio, bien caliente.', '$2.900'],
    ['Chai latte', 'Especias infusionadas en casa.', '$3.800'],
    ['Café frío', 'Cold brew de 18 horas, con o sin leche.', '$3.700'],
  ],
  pasteleria: [
    ['Medialuna de manteca', 'Hojaldrada, con almíbar liviano.', '$1.200'],
    ['Budín de limón', 'Receta de la abuela, glaseado ácido.', '$2.800'],
    ['Torta de frutos rojos', 'Bizcochuelo, crema y fruta de estación.', '$5.200'],
    ['Alfajor de maicena', 'Dulce de leche y coco rallado.', '$1.900'],
    ['Cookie de chocolate', 'Chocolate semiamargo y sal marina.', '$2.300'],
    ['Lemon pie', 'Merengue italiano flameado.', '$4.900'],
  ],
  salado: [
    ['Tostado de campo', 'Pan de masa madre, jamón y queso.', '$5.600'],
    ['Avocado toast', 'Palta, huevo poché y semillas.', '$7.200'],
    ['Chipá', 'Recién horneado, porción de seis.', '$2.900'],
    ['Scon de queso', 'Con manteca y hierbas.', '$1.800'],
  ],
};

const SHOW_PRICES = true;

const list = document.getElementById('menu-list');
const tabs = document.querySelectorAll('.tab');

function renderMenu(key) {
  list.innerHTML = MENU[key].map(([name, desc, price]) => `
    <div class="item">
      <div class="item__row">
        <span class="item__name">${name}</span>
        <span class="item__dots"></span>
        ${SHOW_PRICES ? `<span class="item__price">${price}</span>` : ''}
      </div>
      <span class="item__desc">${desc}</span>
    </div>`).join('');
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    renderMenu(tab.dataset.tab);
  });
});

renderMenu('pasteleria');
document.getElementById('year').textContent = new Date().getFullYear();