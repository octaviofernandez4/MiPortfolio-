(function(){
  // Nav
  const nav=document.getElementById('nav');
  addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>10),{passive:true});
  const burger=document.getElementById('burger'),mm=document.getElementById('mobileMenu');
  burger.addEventListener('click',()=>mm.classList.toggle('open'));
  mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mm.classList.remove('open')));

  // Floor plan
  const states=['libre','reservada','ocupada'];
  const tables=[
    {n:1,p:2,s:'ocupada',r:1},{n:2,p:4,s:'libre'},{n:3,p:4,s:'reservada'},{n:4,p:2,s:'ocupada',r:1},
    {n:5,p:6,s:'ocupada'},{n:6,p:2,s:'libre',r:1},{n:7,p:4,s:'ocupada'},{n:8,p:4,s:'reservada'},
    {n:9,p:2,s:'libre',r:1},{n:10,p:8,s:'ocupada'},{n:11,p:4,s:'libre'},{n:12,p:2,s:'ocupada',r:1}
  ];
  const floor=document.getElementById('floor');
  function counts(){
    const c={libre:0,reservada:0,ocupada:0};tables.forEach(t=>c[t.s]++);
    sLibre.textContent=c.libre;sRes.textContent=c.reservada;sOcu.textContent=c.ocupada;
  }
  tables.forEach(t=>{
    const el=document.createElement('div');
    el.className='table'+(t.r?' round':'');el.dataset.s=t.s;
    el.innerHTML='M'+t.n+'<small>'+t.p+' pax</small>';
    el.addEventListener('click',()=>{t.s=states[(states.indexOf(t.s)+1)%3];el.dataset.s=t.s;counts()});
    floor.appendChild(el);
  });
  counts();

  // Menu
  const menu={
    principales:[['Ojo de bife','$18.900'],['Risotto de hongos','$14.200'],['Pesca del día','$16.500']],
    entradas:[['Provoleta','$7.800'],['Empanadas (2)','$5.400'],['Burrata','$9.900']],
    postres:[['Flan casero','$4.900'],['Tiramisú','$6.200'],['Helado artesanal','$4.500']]
  };
  const list=document.getElementById('menuList');
  function renderMenu(c){list.innerHTML=menu[c].map(i=>'<div class="menu-item"><b>'+i[0]+'</b><em>'+i[1]+'</em></div>').join('')}
  document.querySelectorAll('#menuCats button').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('#menuCats button').forEach(x=>x.classList.remove('on'));
    b.classList.add('on');renderMenu(b.dataset.c);
  }));
  renderMenu('principales');

  // Slots
  const slots=['20:00','20:30','21:00','21:30','22:00','22:30'],full=['21:00','21:30'];
  const sw=document.getElementById('slots'),msg=document.getElementById('slotMsg');
  slots.forEach(h=>{
    const s=document.createElement('div');s.className='slot'+(full.includes(h)?' full':'');s.textContent=h;
    s.addEventListener('click',()=>{
      if(full.includes(h)){msg.textContent='Sin lugar · te sumamos a la lista de espera';return}
      sw.querySelectorAll('.slot').forEach(x=>x.classList.remove('on'));s.classList.add('on');
      msg.textContent='✓ Reserva confirmada para las '+h;
    });
    sw.appendChild(s);
  });

  // Billing
  document.querySelectorAll('#billing button').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('#billing button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
    document.querySelectorAll('.price span').forEach(p=>p.textContent=p.dataset[b.dataset.b]);
  }));

  // FAQ
  document.querySelectorAll('.faq-item').forEach(it=>{
    const a=it.querySelector('.faq-a');
    it.querySelector('.faq-q').addEventListener('click',()=>{
      const open=it.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(x=>{x.classList.remove('open');x.querySelector('.faq-a').style.maxHeight=0});
      if(!open){it.classList.add('open');a.style.maxHeight=a.scrollHeight+'px'}
    });
  });

  // Form
  document.getElementById('ctaForm').addEventListener('submit',e=>{
    e.preventDefault();
    const f=e.target,m=document.getElementById('formMsg');
    if(!f.local.value.trim()){m.textContent='Contanos el nombre de tu restaurante.';return}
    if(!/^\S+@\S+\.\S+$/.test(f.email.value)){m.textContent='Revisá el email.';return}
    m.textContent='¡Listo! Te enviamos el acceso a '+f.email.value;f.reset();
  });

  // Reveal
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
})();