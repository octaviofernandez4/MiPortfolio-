// Página 404: andamio que se arma nivel por nivel (como el del Inicio),
// se tambalea y se derrumba con física simple (gravedad, rebotes y polvo).
// Al pasar por "Reconstruir mi andamio" se vuelve a armar; al salir, se cae.
(function () {
    // Ruta que no existe
    var p = location.pathname;
    if (p && p !== '/' && !/^\/404(\.html)?$/.test(p)) {
        document.getElementById('nf-path-value').textContent = decodeURIComponent(p);
        document.getElementById('nf-path').hidden = false;
    }

    var svg = document.getElementById('nf-scene');
    var btn = document.getElementById('nf-btn');
    if (!svg) return;

    var NS = 'http://www.w3.org/2000/svg';
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var css = getComputedStyle(document.documentElement);
    var LIGHT = css.getPropertyValue('--color-text').trim() || '#f0ebe3';
    var RED = css.getPropertyValue('--color-accent').trim() || '#f2462a';
    var DUST = css.getPropertyValue('--color-text-muted').trim() || '#a59f96';

    // Escena (unidades del viewBox 320×250): 5 niveles del isotipo (96×36) sobre el piso
    var W = 320, GROUND = 232, LEVELS = 5, LW = 96, LH = 36, X0 = (W - LW) / 2;
    var G = 0.32;

    var ground = document.createElementNS(NS, 'line');
    ground.setAttribute('class', 'nf__ground');
    ground.setAttribute('x1', 8); ground.setAttribute('x2', W - 8);
    ground.setAttribute('y1', GROUND + 1); ground.setAttribute('y2', GROUND + 1);
    svg.appendChild(ground);

    var layer = document.createElementNS(NS, 'g');
    var dustLayer = document.createElementNS(NS, 'g');
    svg.appendChild(layer);
    svg.appendChild(dustLayer);

    // ---------- piezas ----------
    var pieces = [];

    function addPiece(pts, fill, level, kind) {
        // pts: vértices absolutos (posición armada); se guardan relativos al centroide
        var cx = 0, cy = 0;
        pts.forEach(function (v) { cx += v[0]; cy += v[1]; });
        cx /= pts.length; cy /= pts.length;
        var local = pts.map(function (v) { return [v[0] - cx, v[1] - cy]; });
        var node = document.createElementNS(NS, 'polygon');
        node.setAttribute('points', local.map(function (v) { return v[0].toFixed(2) + ',' + v[1].toFixed(2); }).join(' '));
        node.setAttribute('fill', fill);
        layer.appendChild(node);
        pieces.push({
            node: node, local: local, level: level, kind: kind,
            hx: cx, hy: cy, x: cx, y: cy, a: 0, vx: 0, vy: 0, va: 0,
            op: 1, free: false, hit: false
        });
    }

    function rect(x, y, w, h) { return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }

    for (var i = 0; i < LEVELS; i++) {
        var top = GROUND - LH * (i + 1);
        // riostras primero (quedan detrás)
        addPiece([[X0 + 12, top + 36], [X0 + 42, top + 8], [X0 + 42, top + 16], [X0 + 20, top + 36]], RED, i, 'brace');
        addPiece([[X0 + 54, top + 36], [X0 + 84, top + 8], [X0 + 84, top + 16], [X0 + 62, top + 36]], RED, i, 'brace');
        [0, 42, 84].forEach(function (x) { addPiece(rect(X0 + x, top, 12, 36), LIGHT, i, 'post'); });
        addPiece(rect(X0, top, LW, 8), LIGHT, i, 'ledger');
    }

    function draw() {
        pieces.forEach(function (q) {
            q.node.setAttribute('transform', 'translate(' + q.x.toFixed(2) + ' ' + q.y.toFixed(2) + ') rotate(' + (q.a * 57.2958).toFixed(2) + ')');
            q.node.setAttribute('opacity', q.op.toFixed(3));
        });
    }

    function verts(q) {
        var c = Math.cos(q.a), s = Math.sin(q.a);
        return q.local.map(function (v) { return [q.x + v[0] * c - v[1] * s, q.y + v[0] * s + v[1] * c]; });
    }

    // ---------- polvo ----------
    var dust = [];
    function puff(x, y, power) {
        var n = Math.min(6, 2 + Math.round(power));
        for (var k = 0; k < n; k++) {
            var c = document.createElementNS(NS, 'circle');
            c.setAttribute('fill', DUST);
            dustLayer.appendChild(c);
            dust.push({ node: c, x: x, y: y - 2, vx: (Math.random() - 0.5) * 2.4, vy: -Math.random() * 1.2, r: 1.5 + Math.random() * 2, life: 1 });
        }
    }
    function stepDust() {
        for (var k = dust.length - 1; k >= 0; k--) {
            var d = dust[k];
            d.x += d.vx; d.y += d.vy; d.vx *= 0.94; d.vy *= 0.94; d.r += 0.12; d.life -= 0.025;
            if (d.life <= 0) { dustLayer.removeChild(d.node); dust.splice(k, 1); continue; }
            d.node.setAttribute('cx', d.x.toFixed(1)); d.node.setAttribute('cy', d.y.toFixed(1));
            d.node.setAttribute('r', d.r.toFixed(1)); d.node.setAttribute('opacity', (d.life * 0.45).toFixed(3));
        }
    }

    // ---------- física ----------
    // El "piso" es un perfil de alturas cada 2 unidades: arranca plano y, cada vez
    // que una pieza se queda quieta, su borde de arriba pasa a ser piso. Así las que
    // caen después se apoyan encima y queda una pila de escombros.
    var BIN = 2, heights = [];
    function resetFloor() { heights = []; for (var b = 0; b <= W / BIN; b++) heights.push(GROUND); }
    function floorAt(x) { var b = Math.round(x / BIN); return heights[Math.max(0, Math.min(heights.length - 1, b))]; }
    // el borde de arriba de la pieza acostada pasa a ser piso (columna por columna)
    function stamp(q) {
        var v = verts(q);
        for (var e = 0; e < v.length; e++) {
            var p1 = v[e], p2 = v[(e + 1) % v.length];
            var steps = Math.max(1, Math.ceil(Math.abs(p2[0] - p1[0]) / BIN) * 2);
            for (var s = 0; s <= steps; s++) {
                var x = p1[0] + (p2[0] - p1[0]) * s / steps, y = p1[1] + (p2[1] - p1[1]) * s / steps;
                var b = Math.round(x / BIN);
                if (b >= 0 && b < heights.length && y < heights[b]) heights[b] = y;
            }
        }
    }
    resetFloor();

    function physicsStep() {
        var moving = false;
        pieces.forEach(function (q) {
            if (!q.free || q.asleep) return;
            q.vy += G;
            q.x += q.vx; q.y += q.vy; q.a += q.va;
            q.va *= 0.995;

            // vértice que más se mete en el piso (o en la pila)
            var v = verts(q), pen = 0, contact = null, minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
            v.forEach(function (pt) {
                var d = pt[1] - floorAt(pt[0]);
                if (d > pen) { pen = d; contact = pt; }
                if (pt[0] < minX) minX = pt[0];
                if (pt[0] > maxX) maxX = pt[0];
                if (pt[1] < minY) minY = pt[1];
                if (pt[1] > maxY) maxY = pt[1];
            });

            if (contact) {
                q.y -= pen;
                var impact = q.vy;
                if (impact > 2.2 && !q.hit) puff(contact[0], floorAt(contact[0]), impact);
                if (impact > 2.2) q.hit = true;
                if (q.vy > 0) q.vy = -q.vy * 0.25;
                if (Math.abs(q.vy) < 0.6) q.vy = 0;
                q.vx *= 0.6;
                // ¿apoyada sobre un lado (dos vértices tocando) o sobre una punta?
                var second = 0;
                v.forEach(function (pt) { if (pt !== contact) second = Math.max(second, pt[1] + pen - floorAt(pt[0])); });
                var onSide = second > -1.4;
                var standing = (maxY - minY) > (maxX - minX) * 1.2;
                if (onSide && standing) {
                    q.va += (q.va >= 0 ? 1 : -1) * 0.006;       // parante en pie: se vuelca
                } else if (onSide) {
                    q.va *= 0.5;                                 // acostada: se queda quieta
                } else {
                    q.va = (q.va + (q.x - contact[0]) * 0.0016) * 0.9;   // sobre una punta: el peso la vuelca
                }
                // quieta un rato: se "duerme" y pasa a formar parte del piso
                var lying = (maxY - minY) < (maxX - minX) * 0.55;   // casi horizontal
                if (onSide && lying && Math.abs(q.vx) < 0.12 && Math.abs(q.vy) < 0.12 && Math.abs(q.va) < 0.004) {
                    q.still = (q.still || 0) + 1;
                    if (q.still > 18) { q.asleep = true; q.vx = q.vy = q.va = 0; stamp(q); return; }
                } else q.still = 0;
            }
            if (minX < 6) { q.x += 6 - minX; q.vx = Math.abs(q.vx) * 0.4; }
            if (maxX > W - 6) { q.x -= maxX - (W - 6); q.vx = -Math.abs(q.vx) * 0.4; }

            moving = true;
        });
        return moving || dust.length > 0;
    }

    // ---------- secuencia ----------
    var raf = 0, mode = 'idle', t0 = 0, dir = 1, rest = 0;
    function now() { return performance.now(); }
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    // Construcción: cada pieza baja a su lugar, nivel por nivel (como en el Inicio)
    function startBuild(fromCurrent) {
        cancelAnimationFrame(raf);
        mode = 'build'; t0 = now();
        pieces.forEach(function (q, idx) {
            q.free = false; q.hit = false; q.asleep = false; q.still = 0;
            q.sx = fromCurrent ? q.x : q.hx;
            q.sy = fromCurrent ? q.y : q.hy - 26;
            q.sa = fromCurrent ? q.a : 0;
            q.so = fromCurrent ? q.op : 0;
            q.delay = fromCurrent ? (pieces.length - idx) * 12 : q.level * 260 + (idx % 6) * 45;
            q.dur = fromCurrent ? 520 : 420;
        });
        raf = requestAnimationFrame(loop);
    }

    // Tambaleo: todo el andamio gira sobre su base, cada vez más
    var PIVOT_X = W / 2;
    function placeLeaning(angle) {
        var c = Math.cos(angle), s = Math.sin(angle);
        pieces.forEach(function (q) {
            var dx = q.hx - PIVOT_X, dy = q.hy - GROUND;
            q.x = PIVOT_X + dx * c - dy * s;
            q.y = GROUND + dx * s + dy * c;
            q.a = angle;
        });
    }

    function startWobble() { mode = 'wobble'; t0 = now(); dir = Math.random() < 0.5 ? -1 : 1; }

    // Derrumbe: se sueltan las piezas desde arriba; las riostras saltan primero
    function startCollapse(angle) {
        mode = 'collapse'; t0 = now(); rest = 0; resetFloor();
        pieces.forEach(function (q) {
            var height = GROUND - q.hy;                 // 0..180: más alto, sale más lejos
            q.vx = dir * (0.25 + height * 0.008) + (Math.random() - 0.5) * 0.6;
            q.vy = -Math.random() * 0.9;
            q.va = (Math.random() - 0.5) * 0.12 + dir * 0.02;
            if (q.kind === 'brace') { q.vx += (Math.random() - 0.5) * 2.2; q.vy -= 1.4; q.va *= 2.2; }
            q.release = (LEVELS - 1 - q.level) * 70 + (q.kind === 'brace' ? 0 : 40) + Math.random() * 40;
        });
    }

    function loop() {
        var t = now() - t0;

        if (mode === 'build') {
            var done = true;
            pieces.forEach(function (q) {
                var k = Math.min(1, Math.max(0, (t - q.delay) / q.dur));
                if (k < 1) done = false;
                var e = easeOut(k);
                q.x = q.sx + (q.hx - q.sx) * e;
                q.y = q.sy + (q.hy - q.sy) * e;
                q.a = q.sa + (0 - q.sa) * e;
                q.op = q.so + (1 - q.so) * e;
            });
            draw();
            if (done) { mode = 'built'; if (!holding) setTimeout(function () { if (mode === 'built' && !holding) { startWobble(); raf = requestAnimationFrame(loop); } }, 900); return; }
        }

        else if (mode === 'wobble') {
            var T = 1500;
            var k2 = Math.min(1, t / T);
            var angle = Math.sin(t / 1000 * 15) * 0.05 * easeInOut(k2) + dir * 0.18 * Math.pow(k2, 3);
            placeLeaning(angle);
            draw();
            if (k2 >= 1) { startCollapse(angle); }
        }

        else if (mode === 'collapse') {
            pieces.forEach(function (q) { if (!q.free && t >= q.release) q.free = true; });
            // las piezas que todavía no se soltaron siguen inclinándose con el bloque
            var lean = dir * (0.18 + t / 1000 * 0.9);
            var c = Math.cos(lean), s = Math.sin(lean);
            pieces.forEach(function (q) {
                if (q.free) return;
                var dx = q.hx - PIVOT_X, dy = q.hy - GROUND;
                q.x = PIVOT_X + dx * c - dy * s; q.y = GROUND + dx * s + dy * c; q.a = lean;
            });
            var moving = physicsStep();
            stepDust();
            draw();
            rest = moving ? 0 : rest + 1;
            // quieto: listo. Si a los 6 s sigue (equipo lento), termina la caída de golpe
            // en vez de dejar piezas en el aire, y corta (no gasta batería)
            if (rest > 30) { mode = 'down'; return; }
            if (t > 6000) {
                pieces.forEach(function (q) { q.free = true; });
                dust.forEach(function (d) { dustLayer.removeChild(d.node); }); dust = [];
                for (var n = 0; n < 900 && physicsStep(); n++) {}
                draw(); mode = 'down'; return;
            }
        }

        raf = requestAnimationFrame(loop);
    }

    // Movimiento reducido: se muestra directo el andamio ya derrumbado
    function collapsedStatic() {
        dir = 1; placeLeaning(0); startCollapse(0);
        pieces.forEach(function (q) { q.free = true; });
        for (var n = 0; n < 900; n++) physicsStep();
        dust.forEach(function (d) { dustLayer.removeChild(d.node); }); dust = [];
        draw(); mode = 'down';
    }

    // Reconstruir al pasar por el botón; al salir, se vuelve a caer
    var holding = false;
    function rebuild() { holding = true; if (reduce) return; if (mode !== 'build' && mode !== 'built') startBuild(true); }
    function release() {
        holding = false; if (reduce) return;
        setTimeout(function () {
            if (holding) return;
            if (mode === 'built') { startWobble(); raf = requestAnimationFrame(loop); }
        }, 250);
    }
    if (btn) {
        btn.addEventListener('mouseenter', rebuild);
        btn.addEventListener('focus', rebuild);
        btn.addEventListener('mouseleave', release);
        btn.addEventListener('blur', release);
    }

    if (reduce) collapsedStatic();
    else { pieces.forEach(function (q) { q.op = 0; }); draw(); setTimeout(function () { startBuild(false); }, 300); }
})();
