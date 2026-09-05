(function () {
  const bootLine = document.querySelector('.boot-line');
  if (bootLine) {
    const days = Math.floor((Date.now() - new Date(bootLine.dataset.launch)) / 864e5);
    bootLine.textContent = bootLine.textContent.replace(/uptime: \d+d/, 'uptime: ' + days + 'd');
  }

  (function titleBlink() {
    const base = document.title;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      let i = 0;
      const t = setInterval(function () {
        if (document.hidden) return;
        document.title = i % 2 === 0 ? base + ' ▊' : base;
        if (++i >= 6) {
          clearInterval(t);
          document.title = base;
        }
      }, 450);
    }
    document.addEventListener('visibilitychange', function () {
      document.title = document.hidden ? 'bye 👋' : base;
    });
  })();

  const seenPrefetch = new Set();
  document.addEventListener(
    'touchstart',
    function (event) {
      const link = event.target.closest && event.target.closest('a[href]');
      if (!link || link.download || (link.target && link.target !== '_self')) return;
      let url;
      try {
        url = new URL(link.href, location.href);
      } catch (_) {
        return;
      }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;
      if (seenPrefetch.has(url.href)) return;
      seenPrefetch.add(url.href);
      const prefetch = document.createElement('link');
      prefetch.rel = 'prefetch';
      prefetch.href = url.href;
      document.head.appendChild(prefetch);
    },
    { passive: true },
  );

  const glow = document.querySelector('.cursor-glow');
  if (!glow || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const style = document.documentElement.style;
  const coarse = window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches;

  if (coarse) {
    let x = 50;
    let y = 36;
    let targetX = 50;
    let targetY = 36;
    let moving = null;
    let hide = null;

    function paint() {
      moving = null;
      x += (targetX - x) * 0.07;
      y += (targetY - y) * 0.07;
      style.setProperty('--glow-x', x + 'vw');
      style.setProperty('--glow-y', y + 'vh');
      if (Math.abs(targetX - x) > 0.08 || Math.abs(targetY - y) > 0.08) {
        moving = requestAnimationFrame(paint);
      }
    }

    window.addEventListener(
      'scroll',
      function () {
        const max = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight;
        const t = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        targetX = 22 + t * 56;
        targetY = 26 + Math.sin(t * Math.PI) * 38;
        glow.style.opacity = '1';
        clearTimeout(hide);
        hide = setTimeout(function () {
          glow.style.opacity = '0';
        }, 1800);
        if (!moving) moving = requestAnimationFrame(paint);
      },
      { passive: true },
    );
    return;
  }

  let hide = null;
  let frame = null;
  document.addEventListener(
    'mousemove',
    function (event) {
      if (frame) return;
      frame = requestAnimationFrame(function () {
        frame = null;
        style.setProperty('--glow-x', event.clientX + 'px');
        style.setProperty('--glow-y', event.clientY + 'px');
        glow.style.opacity = '1';
      });
      clearTimeout(hide);
      hide = setTimeout(function () {
        glow.style.opacity = '0';
      }, 1800);
    },
    { passive: true },
  );
  document.documentElement.addEventListener('mouseleave', function () {
    clearTimeout(hide);
    glow.style.opacity = '0';
  });
})();
