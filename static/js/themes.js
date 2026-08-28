(function () {
  const row = document.querySelector('.theme-strip-row');
  if (!row) return;
  const strip = row.querySelector('.theme-strip');
  const leftBtn = row.querySelector('[data-scroll="left"]');
  const rightBtn = row.querySelector('[data-scroll="right"]');
  const toggle = document.querySelector('[data-theme-toggle]');
  const btns = Array.from(strip.querySelectorAll('.theme-btn'));
  const modes = {};
  btns.forEach((button) => {
    modes[button.dataset.themeId] = button.dataset.mode;
  });

  function storageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {}
  }

  function modeOf(themeId) {
    return modes[themeId] || 'dark';
  }

  function defaultTheme(mode) {
    const button = btns.find((candidate) => candidate.dataset.mode === mode);
    return button ? button.dataset.themeId : 'gruvbox-dark';
  }

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'gruvbox-dark';
  }

  function setFavicon(accent) {
    const link = document.querySelector('link[rel="icon"]');
    if (!link || !accent) return;
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<text y="0.9em" font-size="90" fill="' + accent + '">✦</text></svg>';
    link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  function updateArrows() {
    const max = strip.scrollWidth - strip.clientWidth;
    leftBtn.hidden = strip.scrollLeft <= 1;
    rightBtn.hidden = strip.scrollLeft >= max - 1;
  }

  function syncUI() {
    const current = currentTheme();
    const mode = modeOf(current);
    document.documentElement.setAttribute('data-theme-mode', mode);
    const darkSyntax = document.getElementById('giallo-dark');
    const lightSyntax = document.getElementById('giallo-light');
    if (darkSyntax) darkSyntax.media = mode === 'dark' ? 'all' : 'not all';
    if (lightSyntax) lightSyntax.media = mode === 'light' ? 'all' : 'not all';
    btns.forEach((button) => {
      const active = button.dataset.themeId === current;
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      if (active) {
        setFavicon(button.dataset.accent);
        button.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
      }
    });
    if (toggle) {
      const label = mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('title', label);
    }
    requestAnimationFrame(updateArrows);
  }

  function applyTheme(themeId, persist) {
    document.documentElement.setAttribute('data-theme', themeId);
    const mode = modeOf(themeId);
    document.documentElement.setAttribute('data-theme-mode', mode);
    if (persist) {
      storageSet('theme', themeId);
      storageSet('theme-mode', mode);
      storageSet('theme-' + mode, themeId);
    }
    syncUI();
  }

  strip.addEventListener('click', (event) => {
    const button = event.target.closest('.theme-btn');
    if (button) applyTheme(button.dataset.themeId, true);
  });

  if (toggle) {
    toggle.addEventListener('click', () => {
      const target = modeOf(currentTheme()) === 'dark' ? 'light' : 'dark';
      let next = storageGet('theme-' + target);
      if (!next || modes[next] !== target) next = defaultTheme(target);
      applyTheme(next, true);
    });
  }

  leftBtn.addEventListener('click', () => strip.scrollBy({ left: -strip.clientWidth * 0.8, behavior: 'smooth' }));
  rightBtn.addEventListener('click', () => strip.scrollBy({ left: strip.clientWidth * 0.8, behavior: 'smooth' }));
  strip.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
  window.addEventListener('storage', (event) => {
    if (event.key === 'theme' && event.newValue) applyTheme(event.newValue, false);
  });

  syncUI();
  const current = currentTheme();
  storageSet('theme-mode', modeOf(current));
  storageSet('theme-' + modeOf(current), current);
})();
