document.querySelectorAll('.project-visual').forEach((visual) => {
    const track = visual.querySelector('.carousel-track');
    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const prevBtn = visual.querySelector('.carousel-prev');
    const nextBtn = visual.querySelector('.carousel-next');

    if (slides.length <= 1) {
        visual.classList.add('single-slide');
        return;
    }

    let index = 0;

    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'carousel-dots';
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Foto ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });
    visual.appendChild(dotsWrap);
    const dots = dotsWrap.querySelectorAll('.carousel-dot');

    function goTo(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, di) => dot.classList.toggle('active', di === index));
    }

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));
});
