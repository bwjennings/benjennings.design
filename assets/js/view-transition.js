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
      const card = document.querySelector(
        `.page-items a.card[href$='${slug}.html']`
      );
      const container =
        document.querySelector('.page-detail') || document.querySelector('main');
      return [card, container];
    },
    names: (_from, to) => {
      const slug = getSlug(new URL(to, location.href).pathname);
      return [`vt-${slug}`, `vt-${slug}, detail`];
    },
  },
  {
    match: (from, to) => isDesignDetail(from) && isDesignList(to),
    select: (from) => {
      const slug = getSlug(new URL(from, location.href).pathname);
      const card = document.querySelector(
        `.page-items a.card[href$='${slug}.html']`
      );
      const container =
        document.querySelector('.page-detail') || document.querySelector('main');
      // container exists on the detail page, card on the list page
      return [container, card];
    },
    names: (from) => {
      const slug = getSlug(new URL(from, location.href).pathname);
      return [`vt-${slug}, detail`, `vt-${slug}`];
    },
  },
  {
    match: (_, to) => isDesignDetail(to),
    select: (_from, to) => {
      const container =
        document.querySelector('.page-detail') || document.querySelector('main');
      return [container];
    },
    names: (_from, to) => {
      const slug = getSlug(new URL(to, location.href).pathname);
      return [`vt-${slug}, detail`];
    },
  },
];

window.addEventListener('pageswap', async (e) => {
  if (!e.viewTransition) return;

  const fromUrl = e.activation.from?.url || null;
  const toUrl = e.activation.entry.url;

  for (const c of cases) {
    if (!c.match(fromUrl, toUrl)) continue;
    const elems = c.select(fromUrl, toUrl).filter(Boolean);
    const names = typeof c.names === 'function' ? c.names(fromUrl, toUrl) : c.names;
    elems.forEach((el, i) => {
      el.style.viewTransitionName = names[i] || `anon-${i}`;
    });
    await e.viewTransition.finished;
    elems.forEach((el) => {
      el.style.viewTransitionName = 'none';
    });
    break;
  }
});
