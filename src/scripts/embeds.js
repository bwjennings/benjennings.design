// Lazy-load heavy embeds (e.g., Figma) only when near viewport
// Usage: add data-src with the real URL and optionally data-unload="true" to unload when offscreen.
// Example:
// <iframe data-embed="figma" data-src="https://embed.figma.com/design/..." loading="lazy" title="..."></iframe>

(function () {
  const selector = 'iframe[data-embed][data-src]';
  const iframes = Array.from(document.querySelectorAll(selector));
  if (!iframes.length) return;

  // Respect user preferences for reduced data usage
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = !!(conn && conn.saveData);

  // How far ahead to start loading when scrolling
  const ROOT_MARGIN = '1500px 0px';
  // How many to preload eagerly while idle (0 when Save-Data)
  const MAX_EAGER = saveData ? 0 : 2;

  function loadFrame(el, eager = false) {
    if (el.getAttribute('src')) return;
    if (eager) el.setAttribute('loading', 'eager');
    el.setAttribute('src', el.getAttribute('data-src'));
  }

  // IntersectionObserver: loads just-in-time when near viewport (works in Safari too)
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const el = entry.target;
      if (entry.isIntersecting) {
        loadFrame(el);
      } else if (el.dataset.unload === 'true') {
        // Optionally unload when offscreen to reduce CPU/memory if many embeds exist
        el.removeAttribute('src');
      }
    }
  }, { rootMargin: ROOT_MARGIN, threshold: 0.01 });

  iframes.forEach((el) => io.observe(el));

  // Eagerly preload the closest embeds during idle time so they’re ready before scroll
  const schedule = (cb) => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(cb, { timeout: 600 });
    } else {
      setTimeout(cb, 300);
    }
  };

  function distanceFromViewportTop(el) {
    const r = el.getBoundingClientRect();
    return r.top;
  }

  schedule(() => {
    if (!MAX_EAGER) return;
    // Sort by distance from top and take the closest few that aren’t loaded yet
    const candidates = iframes
      .filter((el) => !el.getAttribute('src'))
      .sort((a, b) => distanceFromViewportTop(a) - distanceFromViewportTop(b))
      .slice(0, MAX_EAGER);

    // Stagger to avoid a burst of requests
    candidates.forEach((el, i) => {
      setTimeout(() => loadFrame(el, true), i * 200);
    });
  });
})();
