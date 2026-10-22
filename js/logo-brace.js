(function () {
    var logo = document.querySelector('a.logo');
    if (!logo) return;

    setTimeout(function () { logo.classList.add('is-loaded'); }, 1100);

    logo.addEventListener('mouseenter', function () {
        if (window.innerWidth < 768) return;
        if (!logo.classList.contains('is-loaded')) return;
        logo.classList.remove('is-replay');
        void logo.offsetWidth;
        logo.classList.add('is-replay');
    });

    logo.addEventListener('animationend', function (e) {
        if (e.target.classList && e.target.classList.contains('logo-mark__brace--2')) {
            logo.classList.remove('is-replay');
        }
    });
})();
