// ------------------------------------------------------------
// Preguntas frecuentes: acordeón accesible + categorías que
// filtran (solo se ve la categoría elegida) + deep-link por #hash.
// ------------------------------------------------------------
(function () {
    const items = Array.from(document.querySelectorAll('.faq-item'));
    const groups = Array.from(document.querySelectorAll('.faq-group'));
    const catLinks = Array.from(document.querySelectorAll('.faq-cats a'));
    if (!items.length) return;

    // ---------- Acordeón ----------
    function setOpen(item, open) {
        const trigger = item.querySelector('.faq-trigger');
        const panel = item.querySelector('.faq-panel');
        item.classList.toggle('open', open);
        trigger.setAttribute('aria-expanded', String(open));
        panel.setAttribute('aria-hidden', String(!open));
    }

    function toggle(item) {
        const willOpen = !item.classList.contains('open');
        // Un solo panel abierto a la vez
        items.forEach((other) => { if (other !== item) setOpen(other, false); });
        setOpen(item, willOpen);
        if (willOpen && item.id) history.replaceState(null, '', '#' + item.id);
    }

    items.forEach((item) => {
        const trigger = item.querySelector('.faq-trigger');
        trigger.addEventListener('click', () => toggle(item));
        trigger.addEventListener('keydown', (e) => {
            const visible = items.filter((i) => !i.hidden && !i.closest('.faq-group').hidden);
            const idx = visible.indexOf(item);
            let next = null;
            if (e.key === 'ArrowDown') next = visible[idx + 1] || visible[0];
            if (e.key === 'ArrowUp') next = visible[idx - 1] || visible[visible.length - 1];
            if (e.key === 'Home') next = visible[0];
            if (e.key === 'End') next = visible[visible.length - 1];
            if (next) {
                e.preventDefault();
                next.querySelector('.faq-trigger').focus();
            }
        });
    });

    // ---------- Categorías: filtran (una sola visible a la vez) ----------
    function selectCategory(id, options) {
        options = options || {};
        groups.forEach((group) => { group.hidden = group.id !== id; });
        catLinks.forEach((link) => {
            const active = link.getAttribute('href') === '#' + id;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
        });
        if (!options.keepHash) history.replaceState(null, '', '#' + id);
        if (options.scroll && window.innerWidth < 768) {
            const cats = document.querySelector('.faq-cats');
            if (cats) cats.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    catLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').slice(1);
            selectCategory(id, { scroll: true });
        });
    });

    // ---------- Deep-link: #pregunta abre su categoría y el panel ----------
    function openFromHash() {
        const id = decodeURIComponent(location.hash.slice(1));
        if (!id) {
            if (groups[0]) selectCategory(groups[0].id, { keepHash: true });
            return;
        }
        const item = document.getElementById(id);
        if (item && item.classList.contains('faq-item')) {
            const group = item.closest('.faq-group');
            if (group) selectCategory(group.id, { keepHash: true });
            items.forEach((other) => setOpen(other, other === item));
            item.querySelector('.faq-trigger').focus({ preventScroll: true });
            return;
        }
        const group = document.getElementById(id);
        if (group && group.classList.contains('faq-group')) {
            selectCategory(id, { keepHash: true });
            return;
        }
        if (groups[0]) selectCategory(groups[0].id, { keepHash: true });
    }

    window.addEventListener('hashchange', openFromHash);
    openFromHash();
})();
