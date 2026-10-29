/* =========================================================
   Botón flotante de WhatsApp con burbuja de aviso.
   Arma su propio HTML: en cada página alcanza con cargar
   css/wa-float.css y este script.
   ========================================================= */
(function () {
  var WHATSAPP = "5493813019932";
  var WA_PATH = "M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.3A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .8.8-2.95-.2-.3a8.2 8.2 0 1 1 6.9 3.78Zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.78.96-.14.17-.29.19-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.7 2.7 0 0 0-.85 2.02 4.7 4.7 0 0 0 1 2.5 10.8 10.8 0 0 0 4.13 3.65c1.54.66 2.14.72 2.91.6.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.17-.46-.28Z";

  function wa(msg) { return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg); }

  // Mensaje precargado según la página (PC y celular)
  var PAGE_MSGS = {
    "": "Hola, vi tu web y quiero cotizar un proyecto.",
    "index.html": "Hola, vi tu web y quiero cotizar un proyecto.",
    "aplicacion.html": "Hola, vi tu web y quiero cotizar un proyecto.",
    "proyectos.html": "Hola, vi tus proyectos y quiero algo similar para mi negocio.",
    "sobre-mi.html": "Hola, leí sobre Andamio Code y quiero hablar de un proyecto.",
    "contacto.html": "Hola, quiero cotizar un proyecto para mi negocio.",
    "busca-tu-proyecto.html": "Hola, estuve viendo los rubros y quiero algo para mi negocio.",
    "preguntas-frecuentes.html": "Hola, leí las preguntas frecuentes y tengo una consulta."
  };
  var DEFAULT_MSG = "Hola, vi tu web y quiero cotizar un proyecto.";

  function pageMessage() {
    if (document.body.dataset.waMsg) return document.body.dataset.waMsg;
    var file = location.pathname.split("/").pop().replace(/^app-/, "");
    return PAGE_MSGS[file] || DEFAULT_MSG;
  }

  var float = document.createElement("div");
  float.className = "wa-float";
  float.innerHTML =
    '<div class="wa-float__bubble" role="status">' +
      '<button class="wa-float__close" type="button" aria-label="Cerrar">×</button>' +
      "<strong>¿Tenés un proyecto?</strong>" +
      "<span>Escribinos y te respondemos en menos de 24 hs.</span>" +
    "</div>" +
    '<a class="wa-float__btn" href="' + wa(pageMessage()) + '" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="' + WA_PATH + '"/></svg>' +
      '<span class="wa-float__dot" aria-hidden="true"></span>' +
    "</a>";
  document.body.appendChild(float);

  var btn = float.querySelector(".wa-float__btn");
  var bubble = float.querySelector(".wa-float__bubble");
  var close = float.querySelector(".wa-float__close");

  var KEY = "andamio_wa_bubble_closed";
  var closed = false;
  try { closed = sessionStorage.getItem(KEY) === "1"; } catch (e) {}

  function markRead() {
    float.classList.remove("is-open");
    float.classList.add("is-read");
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
  }

  if (closed) float.classList.add("is-read");
  else setTimeout(function () { float.classList.add("is-open"); }, 4000);

  close.addEventListener("click", markRead);
  btn.addEventListener("click", markRead);
  bubble.addEventListener("click", function (e) { if (e.target !== close) btn.click(); });
})();
