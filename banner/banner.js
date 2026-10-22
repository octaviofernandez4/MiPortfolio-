// Banner CTA — arma el link de WhatsApp con mensaje y anima la entrada
(function () {
  var PHONE = "5493813019932";
  var MESSAGE = "Hola Octavio, tengo un proyecto y me gustaría charlarlo.";

  function init() {
    document.querySelectorAll(".of-banner").forEach(function (banner) {
      var btn = banner.querySelector(".of-banner__btn");
      if (btn) {
        btn.href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(MESSAGE);
        btn.target = "_blank";
        btn.rel = "noopener";
      }
      if (!("IntersectionObserver" in window)) return;
      banner.classList.add("is-hidden");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { banner.classList.remove("is-hidden"); io.disconnect(); }
        });
      }, { threshold: 0.25 });
      io.observe(banner);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
