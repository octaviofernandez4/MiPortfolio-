document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // Título del hero: animación palabra por palabra
  const title = document.getElementById("heroTitle");
  title.innerHTML = title.textContent.trim().split(" ")
    .map((w, i) => `<span class="word"><span style="animation-delay:${0.1 + i * 0.08}s">${w}</span></span>`)
    .join(" ");

  // Nav: fondo al hacer scroll + botón volver arriba + link activo
  const nav = document.getElementById("nav");
  const toTop = document.getElementById("toTop");
  const links = document.querySelectorAll(".nav-links a");
  const sections = [...links].map(a => document.querySelector(a.getAttribute("href")));
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 600);
    sections.forEach((s, i) => {
      if (s && y + 200 >= s.offsetTop && y + 200 < s.offsetTop + s.offsetHeight) {
        links.forEach(l => l.classList.remove("active"));
        links[i].classList.add("active");
      }
    });
    document.querySelectorAll(".parallax").forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      img.style.transform = `translateY(${(r.top - innerHeight / 2) * -img.dataset.speed}px)`;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Menú móvil
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");
  const setBurger = open => {
    navLinks.classList.toggle("open", open);
    burger.innerHTML = `<i data-lucide="${open ? "x" : "menu"}"></i>`;
    lucide.createIcons();
  };
  burger.addEventListener("click", () => setBurger(!navLinks.classList.contains("open")));
  links.forEach(l => l.addEventListener("click", () => setBurger(false)));

  // Slider del hero
  const slides = document.querySelectorAll(".hero-slide");
  const caption = document.getElementById("slideCaption");
  const dotsWrap = document.getElementById("dots");
  const captions = [
    "Nuestra hamburguesa de la casa: brioche artesanal, cheddar añejo y cebolla caramelizada.",
    "Un salón cálido para cenas largas, aniversarios y encuentros con amigos.",
    "Carnes a la brasa de quebracho, cocinadas lentamente frente a vos."
  ];
  let current = 0, timer;
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Slide ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
  });
  const dots = dotsWrap.querySelectorAll("button");
  function goTo(i) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (i + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
    caption.style.opacity = 0;
    setTimeout(() => { caption.textContent = captions[current]; caption.style.opacity = 1; }, 300);
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 6000);
  }
  document.getElementById("prevSlide").addEventListener("click", () => goTo(current - 1));
  document.getElementById("nextSlide").addEventListener("click", () => goTo(current + 1));
  dots[0].classList.add("active");
  timer = setInterval(() => goTo(current + 1), 6000);

  // Contadores
  const animateCounter = el => {
    const target = parseFloat(el.dataset.target);
    const dec = parseInt(el.dataset.decimals || 0);
    const start = performance.now(), dur = 1800;
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // Revelado al hacer scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      e.target.querySelectorAll(".counter").forEach(animateCounter);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // Menú con pestañas
  const menuData = {
    entradas: [
      ["Burrata ahumada", "Tomates confitados, pesto de albahaca y pan de masa madre.", "$9.800"],
      ["Empanadas de osobuco", "Cocción de 12 h, masa casera y llajua.", "$7.200"],
      ["Provoleta a la brasa", "Orégano fresco, miel picante y nueces.", "$8.500"],
      ["Tartar de res", "Yema curada, alcaparras y papas soufflé.", "$11.400"]
    ],
    principales: [
      ["Ojo de bife 400 g", "Madurado 21 días, chimichurri y papas rústicas.", "$24.900"],
      ["Risotto de hongos", "Hongos de pino, parmesano 24 meses y trufa.", "$16.700"],
      ["Pesca del día", "Manteca de limón, hinojo asado y alcaparras.", "$19.300"],
      ["Hamburguesa Ámbar", "Doble medallón, cheddar añejo y cebolla caramelizada.", "$13.800"]
    ],
    postres: [
      ["Volcán de chocolate", "Corazón líquido y helado de dulce de leche.", "$7.600"],
      ["Flan de la abuela", "Dulce de leche casero y crema batida.", "$5.900"],
      ["Tiramisú", "Café de especialidad y mascarpone.", "$6.800"],
      ["Frutos rojos", "Crumble de almendras y sorbete de limón.", "$6.400"]
    ],
    bebidas: [
      ["Malbec reserva", "Copa · Valle de Uco, Mendoza.", "$5.200"],
      ["Negroni de la casa", "Gin, campari y vermut infusionado.", "$6.900"],
      ["Limonada de jengibre", "Menta, jengibre y miel.", "$3.800"],
      ["Cerveza artesanal", "IPA o Honey, pinta.", "$4.500"]
    ]
  };
  const menuList = document.getElementById("menuList");
  const renderMenu = cat => {
    menuList.innerHTML = menuData[cat].map((d, i) => `
      <div class="menu-item" style="animation-delay:${i * 0.08}s">
        <div><h4>${d[0]}<span class="p">${d[2]}</span></h4><p>${d[1]}</p></div>
      </div>`).join("");
  };
  document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderMenu(tab.dataset.cat);
  }));
  renderMenu("entradas");

  // Reservas
  let guests = 2;
  const guestsEl = document.getElementById("guests");
  document.getElementById("minus").addEventListener("click", () => { guests = Math.max(1, guests - 1); guestsEl.textContent = guests; });
  document.getElementById("plus").addEventListener("click", () => { guests = Math.min(12, guests + 1); guestsEl.textContent = guests; });
  const dateInput = document.getElementById("date");
  dateInput.min = new Date().toISOString().split("T")[0];

  const form = document.getElementById("reserveForm");
  const msg = document.getElementById("formMsg");
  form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll("[required]").forEach(f => {
      f.classList.remove("error");
      if (!f.value.trim()) { void f.offsetWidth; f.classList.add("error"); ok = false; }
    });
    if (!ok) { msg.textContent = "Completá todos los campos, por favor."; return; }
    const name = document.getElementById("name").value.trim().split(" ")[0];
    msg.textContent = `¡Gracias, ${name}! Reservamos para ${guests} ${guests === 1 ? "persona" : "personas"} el ${dateInput.value} a las ${document.getElementById("time").value}.`;
    form.reset();
    guests = 2; guestsEl.textContent = guests;
  });
});
