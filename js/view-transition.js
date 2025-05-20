if ('startViewTransition' in document) {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    // Only handle same-origin navigations without target="_blank" or download
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    if (link.target && link.target !== '_self') return;
    if (link.hasAttribute('download')) return;
    if (url.pathname === location.pathname && !url.hash) return;
    event.preventDefault();
    document.startViewTransition(() => {
      location.href = link.href;
    });
  });
}
