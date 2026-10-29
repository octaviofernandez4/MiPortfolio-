(function(){
  var WA = '5493813019932';
  var MAIL = 'andamiocode40999@gmail.com';
  // EmailJS (emailjs.com): el botón "Enviar" manda el mensaje directo al mail
  var EMAILJS_PUBLIC_KEY = 'u2RCygT3q9PjYjmjG';
  var EMAILJS_SERVICE_ID = 'service_8uvfg17';
  var EMAILJS_TEMPLATE_ID = 'template_1sgdiu4';
  var form = document.getElementById('ct-form');
  if(!form) return;
  if(window.emailjs) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  // Copiar email
  document.querySelectorAll('[data-ct-copy]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var txt = btn.querySelector('.ct-copy-text');
      navigator.clipboard && navigator.clipboard.writeText(btn.getAttribute('data-ct-copy')).then(function(){
        btn.classList.add('is-done'); if(txt) txt.textContent = 'Copiado';
        setTimeout(function(){ btn.classList.remove('is-done'); if(txt) txt.textContent = 'Copiar'; }, 1800);
      });
    });
  });

  var fields = {
    nombre: { el: form.nombre, ok: function(v){ return v.trim().length > 1; } },
    email:  { el: form.email,  ok: function(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); } },
    mensaje:{ el: form.mensaje,ok: function(v){ return v.trim().length > 4; } }
  };
  function check(key){
    var f = fields[key], valid = f.ok(f.el.value);
    f.el.closest('.ct-field').classList.toggle('is-invalid', !valid);
    f.el.setAttribute('aria-invalid', valid ? 'false' : 'true');
    if(!valid) f.el.setAttribute('aria-describedby', 'ct-' + key + '-err'); else f.el.removeAttribute('aria-describedby');
    return valid;
  }
  Object.keys(fields).forEach(function(k){
    fields[k].el.addEventListener('blur', function(){ if(fields[k].el.value) check(k); });
    fields[k].el.addEventListener('input', function(){
      if(fields[k].el.closest('.ct-field').classList.contains('is-invalid')) check(k);
    });
  });
  function validate(){
    var first = null;
    Object.keys(fields).forEach(function(k){ if(!check(k) && !first) first = fields[k].el; });
    if(first) first.focus();
    return !first;
  }
  function buildText(){
    var d = new FormData(form);
    var lines = [
      'Hola, soy ' + d.get('nombre').trim() + (d.get('negocio') ? ' (' + d.get('negocio').trim() + ')' : '') + '.',
      'Necesito: ' + d.get('servicio') + '.',
      '',
      d.get('mensaje').trim(),
      '',
      'Mi email: ' + d.get('email').trim()
    ];
    return lines.join('\n');
  }

  // Con al menos un carácter en el mensaje, los dos botones se cambian por "Enviar"
  var status = document.getElementById('ct-form-status');
  var sendBtn = form.querySelector('[data-ct-send]');
  var sendText = sendBtn.querySelector('.ct-send-text');
  function hasMsg(){ return form.mensaje.value.trim().length > 0; }
  function syncButtons(){ form.classList.toggle('has-msg', hasMsg()); }
  form.mensaje.addEventListener('input', function(){
    syncButtons();
    status.textContent = ''; status.className = 'ct-form-status';
  });
  syncButtons();

  function sendEmail(){
    if(!validate()) return;
    if(!window.emailjs){
      status.textContent = 'No pudimos conectar para enviar. Probá de nuevo o escribinos por WhatsApp.';
      status.className = 'ct-form-status is-error';
      return;
    }
    var d = new FormData(form);
    var negocio = (d.get('negocio') || '').trim();
    sendBtn.disabled = true; sendText.textContent = 'Enviando...';
    status.textContent = ''; status.className = 'ct-form-status';
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      name: d.get('nombre').trim(),
      email: d.get('email').trim(),
      message: 'Necesito: ' + d.get('servicio') + (negocio ? '\nNegocio: ' + negocio : '') + '\n\n' + d.get('mensaje').trim()
    }).then(function(){
      status.textContent = '¡Mensaje enviado! Te respondemos en menos de 24 horas.';
      status.className = 'ct-form-status is-ok';
      form.reset();
      syncButtons();
    }).catch(function(){
      status.textContent = 'Hubo un error al enviar. Probá de nuevo o escribinos por WhatsApp.';
      status.className = 'ct-form-status is-error';
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
  form.querySelector('[data-ct-mail]').addEventListener('click', function(){
    if(!validate()) return;
    var d = new FormData(form);
    var subject = 'Consulta web: ' + d.get('servicio') + ' — ' + d.get('nombre').trim();
    window.location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(buildText());
  });
})();
