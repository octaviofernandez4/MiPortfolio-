(function () {
    const input = document.getElementById('rubro-search-input');
    const searchBtn = document.getElementById('rubro-search-btn');
    const pillsWrap = document.getElementById('rubro-filters');
    const groups = document.querySelectorAll('.rubro-group');
    const emptyMsg = document.getElementById('rubro-search-empty');
    const countEl = document.getElementById('rubro-count');

    if (!input || !pillsWrap || !groups.length) return;

    function normalize(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '');
    }

    groups.forEach((group) => {
        const catClass = [...group.classList].find((c) => c.startsWith('cat-'));
        const catName = group.querySelector('.rubro-group-header h3').textContent;
        group.querySelectorAll('.rubro-card').forEach((card) => {
            const title = card.querySelector('h3').textContent;
            const tags = [...card.querySelectorAll('.tag')].map((t) => t.textContent).join(' ');
            card.dataset.search = normalize(title + ' ' + tags + ' ' + catName);
            card.dataset.cat = catClass;
        });
    });

    let currentCat = 'all';

    function applyFilters() {
        const query = normalize(input.value.trim());
        let totalVisible = 0;

        groups.forEach((group) => {
            const groupCat = [...group.classList].find((c) => c.startsWith('cat-'));
            const catMatches = currentCat === 'all' || groupCat === currentCat;
            let groupVisible = 0;

            group.querySelectorAll('.rubro-card').forEach((card) => {
                const textMatches = query === '' || card.dataset.search.includes(query);
                const visible = catMatches && textMatches;
                card.hidden = !visible;
                if (visible) groupVisible++;
            });

            group.hidden = groupVisible === 0;
            totalVisible += groupVisible;
        });

        if (emptyMsg) emptyMsg.hidden = totalVisible !== 0;
        if (countEl) countEl.textContent = totalVisible;
    }

    input.addEventListener('input', applyFilters);

    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            applyFilters();
        });
    }

    pillsWrap.addEventListener('click', (e) => {
        const pill = e.target.closest('.rubro-pill');
        if (!pill) return;
        pillsWrap.querySelectorAll('.rubro-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        currentCat = pill.dataset.cat;
        applyFilters();
    });
})();
