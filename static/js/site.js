(function () {
  const bootLine = document.querySelector('.boot-line');
  if (bootLine) {
    const days = Math.floor((Date.now() - new Date(bootLine.dataset.launch)) / 864e5);
    bootLine.textContent = bootLine.textContent.replace(/uptime: \d+d/, 'uptime: ' + days + 'd');
  }

  const glow = document.querySelector('.cursor-glow');
  if (!glow || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let hide = null;
  let frame = null;
  document.addEventListener(
    'mousemove',
    function (event) {
      if (frame) return;
      frame = requestAnimationFrame(function () {
        frame = null;
        const style = document.documentElement.style;
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
