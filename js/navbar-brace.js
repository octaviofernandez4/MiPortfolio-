(function () {
    if (window.innerWidth < 768) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    var GRID = 48; // mismo tamaño del tile de fondo reticula-rojo
    var LIFETIME = 1000;
    var MAX_SEGMENTS = 120;
    var seen = new Map();
    var order = [];

    var layer = document.createElement('div');
    layer.className = 'navbar-brace-layer';
    navbar.prepend(layer);

    function cellOrigin(c) {
        return Math.floor(c / GRID) * GRID;
    }

    function removeSegment(key) {
        var el = seen.get(key);
        if (!el) return;
        seen.delete(key);
        var idx = order.indexOf(key);
        if (idx !== -1) order.splice(idx, 1);
        el.classList.remove('in');
        el.addEventListener('transitionend', function handler() {
            el.removeEventListener('transitionend', handler);
            el.remove();
        });
    }

    function addSegment(x, y) {
        var key = x + ',' + y;
        if (seen.has(key)) return;

        var el = document.createElement('div');
        el.className = 'navbar-brace';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.innerHTML =
            '<svg viewBox="0 0 48 48" width="48" height="48">' +
            '<line x1="5" y1="43" x2="43" y2="5" style="stroke:#201e1d; stroke-width:3; stroke-linecap:round;"/>' +
            '</svg>';
        layer.appendChild(el);
        requestAnimationFrame(function () {
            el.classList.add('in');
        });

        seen.set(key, el);
        order.push(key);
        if (order.length > MAX_SEGMENTS) {
            removeSegment(order[0]);
        }

        setTimeout(function () {
            removeSegment(key);
        }, LIFETIME);
    }

    navbar.addEventListener('mousemove', function (e) {
        var rect = navbar.getBoundingClientRect();
        addSegment(cellOrigin(e.clientX - rect.left), cellOrigin(e.clientY - rect.top));
    });

    navbar.addEventListener('mouseleave', function () {
        order.slice().forEach(removeSegment);
    });
})();
