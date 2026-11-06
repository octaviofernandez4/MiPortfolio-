/* Vitrina del Inicio — demo de restaurante: título por palabras y slider del hero */
(function () {
  // Título del hero: animación palabra por palabra
  var title = document.getElementById("heroTitle");
  title.innerHTML = title.textContent.trim().split(" ")
    .map(function (w, i) { return '<span class="word"><span style="animation-delay:' + (0.1 + i * 0.08) + 's">' + w + "</span></span>"; })
    .join(" ");

  // Slider del hero
  var slides = document.querySelectorAll(".hero-slide");
  var caption = document.getElementById("slideCaption");
  var dotsWrap = document.getElementById("dots");
  var captions = [
    "Nuestra hamburguesa de la casa: brioche artesanal, cheddar añejo y cebolla caramelizada.",
    "Un salón cálido para cenas largas, aniversarios y encuentros con amigos.",
    "Carnes a la brasa de quebracho, cocinadas lentamente frente a vos."
  ];
  var current = 0, timer;
  slides.forEach(function (_, i) {
    var b = document.createElement("button");
    b.setAttribute("aria-label", "Foto " + (i + 1));
    b.addEventListener("click", function () { goTo(i); });
    dotsWrap.appendChild(b);
  });
  var dots = dotsWrap.querySelectorAll("button");
  function goTo(i) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (i + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
    caption.style.opacity = 0;
    setTimeout(function () { caption.textContent = captions[current]; caption.style.opacity = 1; }, 300);
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, 6000);
  }
  document.getElementById("prevSlide").addEventListener("click", function () { goTo(current - 1); });
  document.getElementById("nextSlide").addEventListener("click", function () { goTo(current + 1); });
  dots[0].classList.add("active");
  timer = setInterval(function () { goTo(current + 1); }, 6000);
})();
