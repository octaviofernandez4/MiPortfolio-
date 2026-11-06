/* Muestra la barra "Regresar" solo si la plantilla se abrió sola (no dentro del iframe de la vitrina) */
(function () {
  var sola = true;
  try { sola = window.top === window; } catch (e) { sola = false; }
  if (sola) document.documentElement.classList.add("con-regresar");
})();
