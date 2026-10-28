// Banner de Inicio (celular): telón de entrada, andamio que se arma (tocá para sumar un nivel) y marquesina.
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var app = document.getElementById('aba');
  var intro = document.getElementById('aba-intro');
  var pane = document.getElementById('aba-pane');
  var stack = document.getElementById('aba-stack');
  var lvlEl = document.getElementById('aba-lvl');
  var track = document.getElementById('aba-track');
  if (!app || !pane || !stack) return;
  // Aire libre arriba del andamio, en pisos: el último piso siempre se ve completo
  var TOP_GAP = 1.2;
  var count = 0, timer = null, busy = false;

  // Marquesina continua: duplicar contenido
  track.innerHTML += track.innerHTML;

  // ---- Nivel del isotipo (viewBox 96×36) ----
  function el(tag, attrs){ var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function makeLevel(animate){
    var s = el('svg', {viewBox:'0 0 96 36', 'class':'aba__lv' + (animate ? '' : ' static'), preserveAspectRatio:'none'});
    ['M12 36L42 8V16L20 36Z','M54 36L84 8V16L62 36Z'].forEach(function(d, i){
      var p = el('path', {d:d, fill:'#201e1d', 'class':'br'});
      p.style.animationDelay = (0.6 + i * 0.12) + 's'; s.appendChild(p);
    });
    [0,42,84].forEach(function(x, i){
      var r = el('rect', {x:x, y:0, width:12, height:36, fill:'#f3f2f2', 'class':'up'});
      r.style.animationDelay = (i * 0.07) + 's'; s.appendChild(r);
    });
    var ld = el('rect', {x:0, y:0, width:96, height:8, fill:'#f3f2f2', 'class':'ld'});
    ld.style.animationDelay = '.3s'; s.appendChild(ld);
    return s;
  }
  function levelH(){ var f = stack.firstElementChild; return f ? f.getBoundingClientRect().height : 0; }

  // Contador con giro vertical
  function setCount(){
    var txt = String(count).padStart(2, '0');
    if (reduce || !lvlEl.animate){ lvlEl.textContent = txt; return; }
    lvlEl.animate([{transform:'none'},{transform:'translateY(-100%)'}], {duration:180, easing:'ease-in', fill:'forwards'});
    setTimeout(function(){
      lvlEl.textContent = txt;
      lvlEl.animate([{transform:'translateY(100%)'},{transform:'none'}], {duration:260, easing:'cubic-bezier(.2,.8,.2,1)', fill:'forwards'});
    }, 180);
  }

  function addLevel(animate){ stack.appendChild(makeLevel(animate)); count++; setCount(); }

  function climb(){
    if (busy) return false;
    busy = true;
    addLevel(true);
    setTimeout(function(){
      stack.classList.remove('bump'); void stack.offsetWidth; stack.classList.add('bump');
      if (navigator.vibrate) navigator.vibrate(8);
    }, 650);
    setTimeout(function(){
      var h = levelH();
      if (stack.getBoundingClientRect().height > pane.clientHeight - h * TOP_GAP){
        stack.classList.add('shift');
        stack.style.transform = 'translateY(' + h + 'px)';
        setTimeout(function(){
          stack.classList.remove('shift');
          stack.removeChild(stack.firstElementChild);
          stack.style.transform = '';
          busy = false;
        }, 820);
      } else busy = false;
    }, 1000);
    return true;
  }

  function autoplay(){ clearInterval(timer); timer = setInterval(climb, 2800); }

  function build(){
    clearInterval(timer); stack.innerHTML = ''; stack.style.transform = ''; count = 0; busy = false;
    if (reduce){
      do { addLevel(false); } while (stack.getBoundingClientRect().height < pane.clientHeight - levelH() * (TOP_GAP + 1));
      return;
    }
    var n = 0;
    (function boot(){
      climb(); n++;
      var full = stack.getBoundingClientRect().height + levelH() * (TOP_GAP + 1) > pane.clientHeight;
      if (n < 6 && !full) setTimeout(boot, 1050);
      else autoplay();
    })();
  }

  // Tocar el andamio suma un nivel
  pane.addEventListener('pointerdown', function(e){
    if (reduce) return;
    var r = pane.getBoundingClientRect();
    var t = document.createElement('span');
    t.className = 'aba__tap';
    t.style.left = (e.clientX - r.left) + 'px';
    t.style.top = (e.clientY - r.top) + 'px';
    pane.appendChild(t);
    setTimeout(function(){ t.remove(); }, 650);
    if (climb()) autoplay();
  });

  // ---- Secuencia de entrada ----
  function start(){
    app.classList.add('ready');
    setTimeout(build, reduce ? 0 : 450);
  }
  if (reduce){ start(); }
  else {
    setTimeout(function(){
      intro.classList.add('out');
      setTimeout(start, 250);
      setTimeout(function(){ intro.remove(); }, 1000);
    }, 1550);
  }

  var rw, lastW = innerWidth;
  addEventListener('resize', function(){
    if (innerWidth === lastW) return; // ignorar cambios de alto por barra del navegador
    lastW = innerWidth;
    clearTimeout(rw); rw = setTimeout(build, 300);
  });
})();
