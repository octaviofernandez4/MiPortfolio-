// Servicios: links de WhatsApp por card, luz que sigue al cursor y entrada escalonada.
(function () {
  var WHATSAPP = "5493813019932";

  function waLink(msg) {
    return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
  }

  var cards = document.querySelectorAll(".svc");

  cards.forEach(function (card) {
    var servicio = card.dataset.servicio;
    var cta = card.querySelector(".svc__cta");
    if (cta) {
      cta.href = waLink("¡Hola! Me interesa el servicio de " + servicio + ". ¿Me pasás más info?");
      cta.target = "_blank";
      cta.rel = "noopener";
    }

    // luz que sigue al cursor
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  var libre = document.querySelector("[data-servicio-libre]");
  if (libre) {
    libre.href = waLink("¡Hola! Tengo un proyecto y no sé qué servicio me conviene. ¿Lo vemos?");
    libre.target = "_blank";
    libre.rel = "noopener";
  }

  // aparición escalonada al hacer scroll
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var below = Array.prototype.filter.call(cards, function (c) {
      return c.getBoundingClientRect().top > vh * 0.9;
    });
    below.forEach(function (c) { c.classList.add("is-hidden"); });
    setTimeout(function () {
      cards.forEach(function (c) { c.classList.remove("is-hidden"); });
    }, 2500);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = Array.prototype.indexOf.call(cards, en.target);
        setTimeout(function () {
          en.target.classList.remove("is-hidden");
          en.target.classList.add("is-in");
          setTimeout(function () { en.target.classList.remove("is-in"); }, 700);
        }, i * 110);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    below.forEach(function (c) { io.observe(c); });
  }
})();
