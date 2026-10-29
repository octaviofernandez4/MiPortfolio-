/* Preguntas frecuentes dentro de un andamio (css/faq-andamio.css).
   Arma las piezas alrededor de cada pregunta/respuesta, el acordeón
   (una abierta a la vez) y la animación de armado al entrar en pantalla. */
(function () {
  var plus = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  function brace(side) {
    return '<svg class="faqa-brace faqa-bay faqa-bay--' + side + '" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="20" y1="0" x2="80" y2="100"/><line x1="80" y1="0" x2="20" y2="100"/></svg>';
  }
  function clamps(side) {
    return '<div class="faqa-clamps faqa-bay faqa-bay--' + side + '" aria-hidden="true"><span></span><span></span></div>';
  }

  document.querySelectorAll('[data-faqa]').forEach(function (root, r) {
    var items = Array.prototype.slice.call(root.querySelectorAll('.faqa-item'));
    var n = items.length;

    items.forEach(function (item, i) {
      var q = item.querySelector('.faqa-q');
      var a = item.querySelector('.faqa-a');
      var num = String(i + 1).padStart(2, '0');
      var id = 'faqa' + r + '-p' + num;

      // De abajo hacia arriba, como se arma un andamio
      item.style.setProperty('--d', (650 + (n - 1 - i) * 150) + 'ms');

      var btn = document.createElement('button');
      btn.className = 'faqa-btn';
      btn.type = 'button';
      btn.id = id + '-q';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', id);
      btn.innerHTML = '<span class="faqa-qtext"></span><span class="faqa-icon">' + plus + '</span>';
      btn.querySelector('.faqa-qtext').textContent = q.textContent;
      q.textContent = '';
      q.appendChild(btn);

      var panel = document.createElement('div');
      panel.className = 'faqa-panel';
      panel.id = id;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', btn.id);
      var inner = document.createElement('div');
      inner.appendChild(a);
      panel.appendChild(inner);

      var plank = document.createElement('div');
      plank.className = 'faqa-plank';
      plank.appendChild(q);
      plank.appendChild(panel);

      item.innerHTML = brace('l') + brace('r') + '<div class="faqa-ledger" aria-hidden="true"></div>' + clamps('l') + clamps('r');
      item.appendChild(plank);

      btn.addEventListener('click', function () {
        var open = !item.classList.contains('is-open');
        items.forEach(function (o) { setOpen(o, false); });
        if (open) setOpen(item, true);
      });
    });

    root.style.setProperty('--faqa-rail-d', (650 + n * 150) + 'ms');

    function setOpen(item, open) {
      item.classList.toggle('is-open', open);
      item.querySelector('.faqa-btn').setAttribute('aria-expanded', String(open));
    }

    // Se arma cuando aparece en pantalla (en celular, al abrir la pestaña "Preguntas")
    function build() { root.classList.add('is-built'); }
    if (!('IntersectionObserver' in window)) return build();
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { setTimeout(build, 150); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(root);
  });
})();
