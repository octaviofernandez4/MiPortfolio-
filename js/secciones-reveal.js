(function () {
    function countUp(el) {
        var target = +el.dataset.count;
        var suffix = el.dataset.suffix || '';
        var start = performance.now();
        var dur = 1400;
        function tick(now) {
            var p = Math.min((now - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function typeText(el) {
        var text = el.dataset.text;
        var i = 0;
        el.textContent = '';
        var id = setInterval(function () {
            el.textContent = text.slice(0, ++i);
            if (i >= text.length) clearInterval(id);
        }, 90);
    }

    document.querySelectorAll('.sec-type').forEach(function (el) {
        el.textContent = el.dataset.text;
    });

    document.querySelectorAll('[data-count]').forEach(function (el) {
        var io = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    countUp(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        io.observe(el);
    });

    document.querySelectorAll('.sec-panel').forEach(function (panel) {
        var io = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.sec-type').forEach(typeText);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        io.observe(panel);
    });
})();
