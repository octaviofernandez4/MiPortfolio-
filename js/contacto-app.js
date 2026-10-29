(function(){
  var WA = '5493813019932';
  var MAIL = 'octaviofernandez40999@gmail.com';
  // EmailJS (emailjs.com): el botón "Enviar" manda el mensaje directo al mail
  var EMAILJS_PUBLIC_KEY = 'u2RCygT3q9PjYjmjG';
  var EMAILJS_SERVICE_ID = 'service_8uvfg17';
  var EMAILJS_TEMPLATE_ID = 'template_1sgdiu4';
  var root = document.querySelector('[data-cta]');
  var form = document.getElementById('ca-form');
  if(!root || !form) return;
  if(window.emailjs) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  var toast = root.querySelector('.ca-toast'), tTimer;
  function notify(msg){
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(tTimer); tTimer = setTimeout(function(){ toast.classList.remove('is-on'); }, 1800);
  }

  root.querySelectorAll('[data-ca-copy]').forEach(function(btn){
    btn.addEventListener('click', function(){
      if(!navigator.clipboard) return;
      navigator.clipboard.writeText(btn.getAttribute('data-ca-copy')).then(function(){
        btn.classList.add('is-done'); notify('Email copiado');
        setTimeout(function(){ btn.classList.remove('is-done'); }, 1800);
      });
    });
  });

  var fields = {
    nombre: { el: form.nombre, ok: function(v){ return v.trim().length > 1; } },
    email:  { el: form.email,  ok: function(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); } },
    mensaje:{ el: form.mensaje,ok: function(v){ return v.trim().length > 4; } }
  };
  function check(k){
    var f = fields[k], valid = f.ok(f.el.value);
    f.el.closest('.ca-field').classList.toggle('is-invalid', !valid);
    f.el.setAttribute('aria-invalid', valid ? 'false' : 'true');
    if(!valid) f.el.setAttribute('aria-describedby', 'ca-' + k + '-err'); else f.el.removeAttribute('aria-describedby');
    return valid;
  }
  Object.keys(fields).forEach(function(k){
    fields[k].el.addEventListener('blur', function(){ if(fields[k].el.value) check(k); });
    fields[k].el.addEventListener('input', function(){
      if(fields[k].el.closest('.ca-field').classList.contains('is-invalid')) check(k);
    });
  });
  // "Siguiente" en el teclado salta al próximo campo
  ['nombre','negocio','email'].forEach(function(n, i, arr){
    form[n].addEventListener('keydown', function(e){
      if(e.key === 'Enter'){ e.preventDefault(); (arr[i+1] ? form[arr[i+1]] : form.mensaje).focus(); }
    });
  });
  function validate(){
    var first = null;
    Object.keys(fields).forEach(function(k){ if(!check(k) && !first) first = fields[k].el; });
    if(first){ first.focus(); notify('Revisá los campos marcados'); }
    return !first;
  }
  function buildText(){
    var d = new FormData(form);
    return [
      'Hola, soy ' + d.get('nombre').trim() + (d.get('negocio') ? ' (' + d.get('negocio').trim() + ')' : '') + '.',
      'Necesito: ' + d.get('servicio') + '.',
      '',
      d.get('mensaje').trim(),
      '',
      'Mi email: ' + d.get('email').trim()
    ].join('\n');
  }

  // Con al menos un carácter en el mensaje, los dos botones se cambian por "Enviar"
  var status = document.getElementById('ca-form-status');
  var sendBtn = form.querySelector('[data-ca-send]');
  var sendText = sendBtn.querySelector('.ca-send-text');
  function hasMsg(){ return form.mensaje.value.trim().length > 0; }
  function syncButtons(){ form.classList.toggle('has-msg', hasMsg()); }
  form.mensaje.addEventListener('input', function(){
    syncButtons();
    status.textContent = ''; status.className = 'ca-form-status';
  });
  syncButtons();

  function sendEmail(){
    if(!validate()) return;
    if(!window.emailjs){
      status.textContent = 'No pudimos conectar para enviar. Probá de nuevo o escribinos por WhatsApp.';
      status.className = 'ca-form-status is-error';
      return;
    }
    var d = new FormData(form);
    var negocio = (d.get('negocio') || '').trim();
    sendBtn.disabled = true; sendText.textContent = 'Enviando...';
    status.textContent = ''; status.className = 'ca-form-status';
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      name: d.get('nombre').trim(),
      email: d.get('email').trim(),
      message: 'Necesito: ' + d.get('servicio') + (negocio ? '\nNegocio: ' + negocio : '') + '\n\n' + d.get('mensaje').trim()
    }).then(function(){
      status.textContent = '¡Mensaje enviado! Te respondemos en menos de 24 horas.';
      status.className = 'ca-form-status is-ok';
      notify('Mensaje enviado');
      form.reset();
      syncButtons();
    }).catch(function(){
      status.textContent = 'Hubo un error al enviar. Probá de nuevo o escribinos por WhatsApp.';
      status.className = 'ca-form-status is-error';
    }).finally(function(){
      sendBtn.disabled = false; sendText.textContent = 'Enviar';
    });
  }
  sendBtn.addEventListener('click', sendEmail);

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(hasMsg()){ sendEmail(); return; }
    if(!validate()) return;
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(buildText()), '_blank', 'noopener');
  });
  form.querySelector('[data-ca-mail]').addEventListener('click', function(){
    if(!validate()) return;
    var d = new FormData(form);
    var subject = 'Consulta web: ' + d.get('servicio') + ' — ' + d.get('nombre').trim();
    window.location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(buildText());
  });
})();
