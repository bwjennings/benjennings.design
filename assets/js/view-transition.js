function getSlug(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  let last = segments.pop() || '';
  if (last === 'index.html') last = segments.pop() || 'index';
  return last.replace(/\.html$/, '');
}

function isDesignList(url) {
  return url ? url.endsWith('/designs.html') : false;
}

function isDesignDetail(url) {
  return /\/designs\/[^/]+\.html$/.test(url || '');
}

const cases = [
  {
    match: (from, to) => isDesignList(from) && isDesignDetail(to),
    select: (_from, to) => {
      const slug = getSlug(new URL(to, location.href).pathname);
      const card = document.querySelector(`.page-items a.card[href$='${slug}.html']`);
      const container = document.querySelector('.page-detail') || document.querySelector('main');
      return [card, container];
    },
    names: ['item', 'detail'],
  },
  {
    match: (_, to) => isDesignDetail(to),
    select: () => {
      const container = document.querySelector('.page-detail') || document.querySelector('main');
      return [container];
    },
    names: ['detail'],
  },
];

window.addEventListener('pageswap', async (e) => {
  if (!e.viewTransition) return;

  const fromUrl = e.activation.from?.url || null;
  const toUrl = e.activation.entry.url;

  for (const c of cases) {
    if (!c.match(fromUrl, toUrl)) continue;
    const elems = c.select(fromUrl, toUrl).filter(Boolean);
    elems.forEach((el, i) => {
      el.style.viewTransitionName = c.names[i] || `anon-${i}`;
    });
    await e.viewTransition.finished;
    elems.forEach((el) => {
      el.style.viewTransitionName = 'none';
    });
    break;
  }
});
