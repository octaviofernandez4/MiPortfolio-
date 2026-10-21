(function () {
    if (window.innerWidth < 768) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var GRID = 40;
    var OFFSET = 20; // la grilla del patrón de fondo está corrida medio cuadro (centrada en 20,20 del tile)
    var LIFETIME = 1000; // ms desde que aparece hasta que se apaga
    var MAX_SEGMENTS = 300;
    var seen = new Map();
    var order = [];

    function cellOrigin(c) {
        return OFFSET + Math.floor((c - OFFSET) / GRID) * GRID;
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
        el.className = 'andamio-brace';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.innerHTML =
            '<svg viewBox="0 0 40 40" width="40" height="40">' +
            '<line x1="4" y1="36" x2="36" y2="4" style="stroke:var(--color-accent); stroke-width:2.5; stroke-linecap:round;"/>' +
            '</svg>';
        document.body.appendChild(el);
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

    document.addEventListener('mousemove', function (e) {
        addSegment(cellOrigin(e.pageX), cellOrigin(e.pageY));
    });
})();
