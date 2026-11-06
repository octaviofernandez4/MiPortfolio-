/* Vitrina del Inicio: cada demo (iframe) avisa el alto de su contenido
   y acá se lo ponemos al iframe, así se ve entera sin scroll interno. */
(function () {
  var frames = document.querySelectorAll(".vitrina__frame");
  if (!frames.length) return;

  addEventListener("message", function (e) {
    if (e.origin !== location.origin || !e.data || !e.data.vitrina) return;
    frames.forEach(function (f) {
      if (f.contentWindow === e.source && e.data.h > 0) f.style.height = e.data.h + "px";
    });
  });
})();
