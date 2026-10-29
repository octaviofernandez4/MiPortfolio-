(function(){
  document.querySelectorAll('[data-ag-accordion]').forEach(function(acc){
    var items = acc.querySelectorAll('.ag-item');
    items.forEach(function(item){
      var btn = item.querySelector('.ag-btn');
      btn.addEventListener('click', function(){
        var open = !item.classList.contains('is-open');
        items.forEach(function(o){
          o.classList.remove('is-open');
          o.querySelector('.ag-btn').setAttribute('aria-expanded','false');
        });
        if(open){ item.classList.add('is-open'); btn.setAttribute('aria-expanded','true'); }
      });
    });
  });
})();
