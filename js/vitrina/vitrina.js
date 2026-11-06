/* Común a las vitrinas del Inicio (páginas que se muestran dentro de un iframe):
   - íconos inline (sin librerías externas)
   - avisa al Inicio el alto del contenido para que el iframe no tenga scroll
   - los links no navegan: es una vista previa
   - agrega "play" al hero cuando la vitrina entra en pantalla */
(function () {
  var ICONS = {
    "flame": '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    "menu": '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    "book-open": '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>'
  };
  document.querySelectorAll("i[data-icon]").forEach(function (i) {
    var p = ICONS[i.dataset.icon];
    if (!p) return;
    i.outerHTML = '<svg class="lucide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  });

  document.addEventListener("click", function (e) {
    if (e.target.closest("a")) e.preventDefault();
  });

  var send = function () {
    if (parent === window) return;
    parent.postMessage({ vitrina: location.pathname, h: Math.ceil(document.body.getBoundingClientRect().height) }, location.origin);
  };
  addEventListener("load", send);
  if ("ResizeObserver" in window) new ResizeObserver(send).observe(document.body);
  send();

  var hero = document.querySelector(".play-on");
  if (hero && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { hero.classList.add("play"); io.disconnect(); }
      });
    }, { threshold: 0.3 });
    io.observe(hero);
  } else if (hero) hero.classList.add("play");

  var rio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(function (el) { rio.observe(el); });
})();
