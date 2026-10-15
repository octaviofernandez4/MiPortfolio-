(function () {
  /*
   * LINGUOCAREERS & ACADEMY - script.js
   * Filtro de búsqueda en tiempo real sobre las tarjetas de ofertas laborales.
   */

  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('job-search-input');
    if (!searchInput) return;

    const cards = document.querySelectorAll('#busquedas .job-card');

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(query) ? 'flex' : 'none';
      });
    });
  });
})();
