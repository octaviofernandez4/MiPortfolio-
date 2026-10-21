// Cambio de tema claro/oscuro. Cargar en <head> SIN defer para evitar parpadeo.
(function () {
  var KEY = 'octavio-theme';
  var saved = localStorage.getItem(KEY);
  var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', saved || system);

  window.toggleTheme = function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(KEY, next);
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', next === 'dark');
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    var current = document.documentElement.getAttribute('data-theme');
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', current === 'dark');
      b.addEventListener('click', window.toggleTheme);
    });
  });
})();
