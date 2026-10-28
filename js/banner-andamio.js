// Banner de Inicio: andamio que se arma nivel por nivel y ticker de servicios.
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var pane = document.getElementById('ab-scaffold');
  var stack = document.getElementById('ab-stack');
  var lvlEl = document.getElementById('ab-lvl');
  if (!pane || !stack) return;
  var count = 0, timer = null, busy = false;

  // Un nivel del isotipo: 3 parantes, 1 travesaño, 2 riostras (viewBox 96×36)
  function el(tag, attrs){ var e=document.createElementNS(NS,tag); for(var k in attrs) e.setAttribute(k,attrs[k]); return e; }
  function makeLevel(animate){
    var s = el('svg',{viewBox:'0 0 96 36','class':'ab__lv'+(animate?'':' static'),preserveAspectRatio:'none'});
    [0,42,84].forEach(function(x,i){
      var r = el('rect',{x:x,y:0,width:12,height:36,fill:'#f3f2f2','class':'up'});
      r.style.animationDelay = (i*0.08)+'s'; s.appendChild(r);
    });
    var ld = el('rect',{x:0,y:0,width:96,height:8,fill:'#f3f2f2','class':'ld'});
    ld.style.animationDelay = '.35s'; s.appendChild(ld);
    ['M12 36L42 8V16L20 36Z','M54 36L84 8V16L62 36Z'].forEach(function(d,i){
      var p = el('path',{d:d,fill:'#201e1d','class':'br'});
      p.style.animationDelay = (0.7 + i*0.15)+'s'; s.insertBefore(p, s.firstChild);
    });
    return s;
  }
  function levelH(){ var f = stack.firstElementChild; return f ? f.getBoundingClientRect().height : 0; }
  function setCount(){ lvlEl.textContent = String(count).padStart(2,'0'); }

  function addLevel(animate){
    stack.appendChild(makeLevel(animate)); count++; setCount();
  }
  function climb(){
    if (busy) return; busy = true;
    addLevel(true);
    setTimeout(function(){
      var h = levelH();
      if (stack.getBoundingClientRect().height > pane.clientHeight - h*0.4){
        stack.classList.add('shift');
        stack.style.transform = 'translateY('+h+'px)';
        setTimeout(function(){
          stack.classList.remove('shift');
          stack.removeChild(stack.firstElementChild);
          stack.style.transform = '';
          busy = false;
        }, 950);
      } else busy = false;
    }, 1200);
  }

  function build(){
    clearInterval(timer); stack.innerHTML = ''; stack.style.transform=''; count = 0; busy = false;
    if (reduce){
      do { addLevel(false); } while (stack.getBoundingClientRect().height < pane.clientHeight - levelH());
      return;
    }
    // arranque: arma los primeros niveles en cadena, luego sigue subiendo
    var first = 0;
    (function boot(){
      climb(); first++;
      var full = stack.getBoundingClientRect().height + levelH() > pane.clientHeight;
      if (first < 8 && !full) setTimeout(boot, 1250);
      else timer = setInterval(climb, 2600);
    })();
  }
  setTimeout(build, reduce ? 0 : 700);
  var rw; addEventListener('resize', function(){ clearTimeout(rw); rw = setTimeout(build, 300); });

  // Ticker de servicios
  var words = ['páginas web','landing pages','apps móviles','software a medida','sistemas internos'];
  var w = document.getElementById('ab-word'), k = 0;
  if (!reduce) setInterval(function(){
    w.style.transform = 'translateY(-110%)';
    setTimeout(function(){
      k = (k+1) % words.length;
      w.style.transition = 'none'; w.textContent = words[k]; w.style.transform = 'translateY(110%)';
      w.offsetHeight; w.style.transition = ''; w.style.transform = 'translateY(0)';
    }, 500);
  }, 2400);
})();
