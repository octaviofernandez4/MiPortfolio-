(function(){
  var root = document.querySelector('[data-agm]');
  if(!root) return;

  // Pestañas
  var tabs = root.querySelectorAll('.agm-tab');
  function show(id){
    tabs.forEach(function(t){
      var on = t.getAttribute('data-agm-tab') === id;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    root.querySelectorAll('.agm-view').forEach(function(v){
      var on = v.id === 'agm-view-' + id;
      v.hidden = !on;
      v.classList.toggle('is-active', on);
    });
    // Si el bloque ya quedó arriba de la pantalla, volvemos a su inicio (no al tope de la página)
    if (root.getBoundingClientRect().top < 0) root.scrollIntoView({ behavior: 'smooth' });
  }
  root.querySelectorAll('[data-agm-tab]').forEach(function(b){
    b.addEventListener('click', function(){ show(b.getAttribute('data-agm-tab')); });
  });
  root.querySelector('.agm-tabs').addEventListener('keydown', function(e){
    if(e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var next = document.activeElement.getAttribute('data-agm-tab') === 'g' ? 'f' : 'g';
    show(next);
    root.querySelector('#agm-tab-' + next).focus();
  });
  // El acordeón de preguntas (dentro del andamio) lo arma js/faq-andamio.js
})();
