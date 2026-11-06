/* Vitrina del Inicio — demo de concesionaria: autos escalonados y parallax de la foto del interior.
   El iframe no scrollea, así que el parallax sigue el scroll del Inicio. */
(function () {
  document.querySelectorAll(".cards .reveal").forEach(function (el, i) {
    el.style.setProperty("--d", (i % 4) * 0.12 + "s");
  });

  var pars = document.querySelectorAll(".parallax");
  var host;
  try { host = window.frameElement && parent; } catch (e) { host = null; }
  if (!host || !pars.length) return;

  var parallax = function () {
    var top = window.frameElement.getBoundingClientRect().top;
    var vh = host.innerHeight;
    pars.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var y = top + r.top;
      if (y + r.height < 0 || y > vh) return;
      var p = (y + r.height / 2 - vh / 2) / vh;
      el.style.backgroundPosition = "center " + (50 + p * 25) + "%";
    });
  };
  host.addEventListener("scroll", function () { requestAnimationFrame(parallax); }, { passive: true });
  parallax();
})();
