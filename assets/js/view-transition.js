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

function getSlug(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  let last = segments.pop() || '';
  if (last === 'index.html') last = segments.pop() || 'index';
  return last.replace(/\.html$/, '');
}

function applyViewTransitionNames() {
  // Assign names to cards linking to detail pages
  const cards = document.querySelectorAll('.page-items a.card[href]');
  cards.forEach((card) => {
    const url = new URL(card.getAttribute('href'), location.href);
    const slug = getSlug(url.pathname);
    card.style.viewTransitionName = `vt-${slug}`;
  });

  // Assign name to detail page container if applicable
  if (document.body.classList.contains('detail-page')) {
    const slug = getSlug(location.pathname);
    const container = document.querySelector('main');
    if (container) {
      // Include a generic "detail" name so CSS can target all detail pages
      container.style.viewTransitionName = `vt-${slug}, detail`;
    }
  }
}

document.addEventListener('DOMContentLoaded', applyViewTransitionNames);
