const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
}, {
    threshold: 0.15
});
reveals.forEach(reveal => {
    revealObserver.observe(reveal);
});

// ------------------------------------------------------------
// Navegación mobile: hamburguesa con focus trap, cierre con
// Escape y bloqueo de scroll del body (a prueba de iOS Safari).
// ------------------------------------------------------------
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
    const navLinkItems = navLinks.querySelectorAll("a");
    let lockedScrollY = 0;

    function getFocusableNavItems() {
        return Array.from(navLinkItems).filter((el) => el.offsetParent !== null);
    }

    function handleNavKeydown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeNav();
            return;
        }
        if (e.key === 'Tab') {
            const focusable = getFocusableNavItems();
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    function openNav() {
        lockedScrollY = window.scrollY;
        hamburger.classList.add("active");
        navLinks.classList.add("active");
        document.body.classList.add("nav-open");
        document.body.style.top = `-${lockedScrollY}px`;
        hamburger.setAttribute('aria-expanded', 'true');
        document.addEventListener('keydown', handleNavKeydown);
        const focusable = getFocusableNavItems();
        if (focusable.length) focusable[0].focus();
    }

    function closeNav({ restoreFocus = true } = {}) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.classList.remove("nav-open");
        document.body.style.top = '';
        window.scrollTo(0, lockedScrollY);
        hamburger.setAttribute('aria-expanded', 'false');
        document.removeEventListener('keydown', handleNavKeydown);
        if (restoreFocus) hamburger.focus();
    }

    hamburger.addEventListener("click", () => {
        if (navLinks.classList.contains("active")) {
            closeNav({ restoreFocus: false });
        } else {
            openNav();
        }
    });

    hamburger.addEventListener("keydown", (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });

    navLinkItems.forEach(link => {
        link.addEventListener("click", () => {
            closeNav({ restoreFocus: false });
        });
    });
}

// ------------------------------------------------------------
// Descripciones de proyectos: resumen en mobile con "Ver más"
// ------------------------------------------------------------
document.querySelectorAll('.btn-more').forEach((btn) => {
    const target = document.getElementById(btn.getAttribute('aria-controls'));
    const label = btn.querySelector('.btn-more-label');
    if (!target) return;

    btn.addEventListener('click', () => {
        const expanded = target.classList.toggle('expanded');
        btn.classList.toggle('is-expanded', expanded);
        btn.setAttribute('aria-expanded', String(expanded));
        if (label) label.textContent = expanded ? 'Ver menos' : 'Ver más';
    });
});

// ------------------------------------------------------------
// Footer: acordeones en mobile (Servicios, Navegación, Contacto).
// Desde 768px los paneles quedan siempre abiertos y los triggers
// se sacan del orden de tabulación, ya que pasan a ser títulos.
// ------------------------------------------------------------
const footerTriggers = document.querySelectorAll('.footer-accordion-trigger');

if (footerTriggers.length) {
    document.documentElement.classList.add('js-footer-enhanced');
    const footerMq = window.matchMedia('(min-width: 768px)');

    const syncFooterAccordions = (e) => {
        footerTriggers.forEach((trigger) => {
            const panel = document.getElementById(trigger.getAttribute('aria-controls'));
            if (e.matches) {
                trigger.setAttribute('aria-expanded', 'true');
                trigger.setAttribute('tabindex', '-1');
                if (panel) panel.classList.add('expanded');
            } else {
                trigger.removeAttribute('tabindex');
                trigger.setAttribute('aria-expanded', String(panel ? panel.classList.contains('expanded') : false));
            }
        });
    };

    footerTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            if (footerMq.matches) return;
            const panel = document.getElementById(trigger.getAttribute('aria-controls'));
            if (!panel) return;
            const expanded = panel.classList.toggle('expanded');
            trigger.setAttribute('aria-expanded', String(expanded));
        });
    });

    syncFooterAccordions(footerMq);
    footerMq.addEventListener('change', syncFooterAccordions);
}