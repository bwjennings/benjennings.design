/** View transition helpers */
document.addEventListener('DOMContentLoaded', () => {
  try {
    if (!(window.CSS && CSS.supports && CSS.supports('view-transition-name', 'page'))) {
      console.warn('View Transitions not fully supported');
    }
  } catch {}

  // Scroll restoration
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'auto'; } catch {}

  // Detail header: persist vt name and state
  try {
    const detailHeader = document.querySelector('.post-header[style]');
    if (detailHeader) {
      const inline = detailHeader.style.getPropertyValue('view-transition-name');
      const computed = getComputedStyle(detailHeader).getPropertyValue('view-transition-name');
      const name = (inline || computed || '').trim();
      if (name && name !== 'none') {
        sessionStorage.setItem('lastVtName', name);
        
        // Ensure history state
        if (!history.state || !history.state.page) {
          try {
            if ('navigation' in window && window.navigation?.updateCurrentEntry) {
              const current = (window.navigation.currentEntry?.getState?.() || {});
              window.navigation.updateCurrentEntry({ state: { ...current, page: 'detail', vt: name } });
            } else {
              history.replaceState({ page: 'detail', vt: name }, '', window.location.href);
            }
          } catch {}
        }
      }
    }
  } catch {}

  // Card part helpers
  const getCardParts = (card) => {
    if (!card) return {};
    const imageEl = card.querySelector('img, .icon-placeholder');
    const titleEl = card.querySelector('h1[class*="heading"]');
    const badgesEl = card.querySelector('.badge-group');
    return { imageEl, titleEl, badgesEl };
  };

  const applyCardPartNames = (card, key, enable) => {
    if (!card || !key) return;
    const { imageEl, titleEl, badgesEl } = getCardParts(card);
    const setOrClear = (el, name, cls) => {
      if (!el) return;
      if (enable) {
        el.style.setProperty('view-transition-name', name);
        if (cls) el.style.setProperty('view-transition-class', cls);
      } else {
        el.style.removeProperty('view-transition-name');
        if (cls) el.style.removeProperty('view-transition-class');
      }
    };
    // Reuse existing classes for scalable styling
    setOrClear(imageEl, `${key}-image`, 'thumbnail');
    setOrClear(titleEl, `${key}-title`, 'heading');
    setOrClear(badgesEl, `${key}-badges`, 'badge-group');
  };

  // Apply classes to detail header parts if named
  const applyDetailClassesIfPresent = () => {
    try {
      const detailHeader = document.querySelector('.post-header[style]');
      if (!detailHeader) return;
      const headerName = (detailHeader.style.getPropertyValue('view-transition-name') || '').trim();
      if (headerName && headerName !== 'none') {
        // Header uses same class as cards
        detailHeader.style.setProperty('view-transition-class', 'card');
        // Known parts
        const img = detailHeader.querySelector('img, .icon-placeholder');
        const title = detailHeader.querySelector('h1[class*="heading"]');
        const badges = detailHeader.querySelector('.badge-group');
        if (img && img.style.getPropertyValue('view-transition-name')) img.style.setProperty('view-transition-class', 'thumbnail');
        if (title && title.style.getPropertyValue('view-transition-name')) title.style.setProperty('view-transition-class', 'heading');
        if (badges && badges.style.getPropertyValue('view-transition-name')) badges.style.setProperty('view-transition-class', 'badge-group');
      }
    } catch {}
  };

  // State helpers
  const getVtFromState = () => {
    try {
      // Use Navigation API if available
      if ('navigation' in window && window.navigation?.currentEntry?.getState) {
        const navState = window.navigation.currentEntry.getState();
        const vt = navState && navState.vt;
        if (vt && String(vt).trim()) return String(vt).trim();
      }
    } catch {}
    try {
      const vt = history.state && history.state.vt;
      return vt && String(vt).trim() ? String(vt).trim() : null;
    } catch { return null; }
  };

  const writeVtToState = (obj) => {
    try {
      const vt = obj && obj.vt;
      const page = obj && obj.page;
      const base = { vt, page };
      if ('navigation' in window && window.navigation?.updateCurrentEntry) {
        const current = (window.navigation.currentEntry?.getState?.() || {});
        window.navigation.updateCurrentEntry({ state: { ...current, ...base } });
        return;
      }
    } catch {}
    try {
      history.replaceState({ ...(history.state || {}), ...obj }, '');
    } catch {}
  };

  // Listing page: pre-name target card
  try {
    const cards = document.querySelectorAll('a[data-vt-target]');
    if (cards.length) {
      const vtFromState = getVtFromState();
      const last = vtFromState || sessionStorage.getItem('lastVtName');
      const target = last ? Array.from(cards).find(a => a.getAttribute('data-vt-target') === last) : null;
      // Clear others
      cards.forEach((a) => {
        if (a !== target) {
          a.style.removeProperty('view-transition-name');
          a.style.removeProperty('view-transition-class');
          applyCardPartNames(a, a.getAttribute('data-vt-target'), false);
        }
      });
      if (target) {
        if (!target.style.getPropertyValue('view-transition-name')) {
          target.style.setProperty('view-transition-name', last);
        }
        // Class hook
        target.style.setProperty('view-transition-class', 'card');
        applyCardPartNames(target, last, true);
        // Persist in history.state
        try { writeVtToState({ page: 'listing', vt: last }); } catch {}
      }
    }
  } catch {}

  // Delegate clicks (name only clicked card)
  const onClick = (e) => {
    // Ignore non-primary or modified clicks
    if ((typeof e.button === 'number' && e.button > 0) || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    // Anchor lookup
    const anyAnchor = e.target && (e.target.closest ? e.target.closest('a') : null);
    if (!anyAnchor) return;

    // Back links navigate normally

    // Card click: set name and record
    const cardAnchor = anyAnchor.matches('a[data-vt-target]') ? anyAnchor : null;
    if (cardAnchor) {
      const name = cardAnchor.getAttribute('data-vt-target');
      if (name) {
        try {
          // Clear others
          document.querySelectorAll('a[data-vt-target]').forEach((a) => {
            if (a !== cardAnchor) a.style.removeProperty('view-transition-name');
          });
          cardAnchor.style.setProperty('view-transition-name', name);
          cardAnchor.style.setProperty('view-transition-class', 'card');
          // Sync parts
          document.querySelectorAll('a[data-vt-target]').forEach((a) => {
            const key = a.getAttribute('data-vt-target');
            applyCardPartNames(a, key, a === cardAnchor);
          });
          // Persist
          sessionStorage.setItem('lastVtName', name);
          // Entry state
          writeVtToState({ page: 'listing', vt: name });
        } catch {}
      }
      return;
    }

    // Top nav: clear vt
    try {
      const isTopNav = anyAnchor.classList?.contains('nav-item') || anyAnchor.closest('site-navigation');
      if (isTopNav) {
        // Clear stored key and names
        sessionStorage.removeItem('lastVtName');

        // Clear names from cards only
        const toClear = document.querySelectorAll(
          'a[data-vt-target], a[data-vt-target] img, a[data-vt-target] .icon-placeholder, a[data-vt-target] h1[class*="heading"], a[data-vt-target] .badge-group'
        );
        toClear.forEach((el) => {
          el.style?.removeProperty('view-transition-name');
          el.style?.removeProperty('view-transition-class');
        });
      }
    } catch {}
  };

  // Capture phase
  document.addEventListener('click', onClick, true);

  // Popstate fallback
  window.addEventListener('popstate', (e) => {
    try {
      // Restore listing state
      if (e.state && e.state.page === 'listing') {
        const vt = e.state.vt;
        if (vt) {
          // Restore names
          const cards = document.querySelectorAll('a[data-vt-target]');
          const target = Array.from(cards).find(a => a.getAttribute('data-vt-target') === vt);
          if (target) {
            cards.forEach((a) => {
              if (a !== target) {
                a.style.removeProperty('view-transition-name');
                a.style.removeProperty('view-transition-class');
                applyCardPartNames(a, a.getAttribute('data-vt-target'), false);
              }
            });
            target.style.setProperty('view-transition-name', vt);
            target.style.setProperty('view-transition-class', 'card');
            applyCardPartNames(target, vt, true);
            sessionStorage.setItem('lastVtName', vt);
          }
        }
      }
    } catch {}
  });

  // BFCache/restore maintenance
  const handleRevealOrShow = (isRevealEvent, e) => {
    // Detect restores
    try {
      const perfNav = (performance && performance.getEntriesByType) ? performance.getEntriesByType('navigation')[0] : null;
      const isHistoryRestore = Boolean(e?.persisted) || (perfNav && perfNav.type === 'back_forward');
      if (isHistoryRestore) {
        document.documentElement.classList.add('restoring');
        // Restore scroll then drop override
        if ('requestAnimationFrame' in window) {
          requestAnimationFrame(() => setTimeout(() => {
            document.documentElement.classList.remove('restoring');
          }, 150));
        } else {
          setTimeout(() => document.documentElement.classList.remove('restoring'), 150);
        }
      }
    } catch {}

    const vt = getVtFromState() || sessionStorage.getItem('lastVtName');
    const cards = document.querySelectorAll('a[data-vt-target]');
    const onListing = cards.length > 0;

    if (onListing) {
      // No vt: clear card names
      if (!vt) {
        cards.forEach((a) => {
          a.style.removeProperty('view-transition-name');
          a.style.removeProperty('view-transition-class');
          applyCardPartNames(a, a.getAttribute('data-vt-target'), false);
        });
      }
      // With vt: keep target named
      else {
        const target = Array.from(cards).find(a => a.getAttribute('data-vt-target') === vt);
        cards.forEach((a) => {
          const key = a.getAttribute('data-vt-target');
          const active = a === target;
          if (!active) {
            a.style.removeProperty('view-transition-name');
            a.style.removeProperty('view-transition-class');
          }
          applyCardPartNames(a, key, active);
        });
        if (target) {
          target.style.setProperty('view-transition-name', vt);
          target.style.setProperty('view-transition-class', 'card');
        }
      }
    } else {
      // Detail pages: keep header names
    }
  };

  // Use pagereveal if available
  if ('onpagereveal' in window) {
    window.addEventListener('pagereveal', (e) => handleRevealOrShow(true, e));
  } else {
    window.addEventListener('pageshow', (e) => handleRevealOrShow(false, e));
  }

  // Ensure detail pages also get class hooks applied
  applyDetailClassesIfPresent();

  // Persist VT on pageswap
  if ('onpageswap' in window) {
    window.addEventListener('pageswap', (e) => {
      try {
        const vt = getVtFromState() || sessionStorage.getItem('lastVtName');
        if (vt) writeVtToState({ page: document.querySelector('a[data-vt-target]') ? 'listing' : (document.body?.classList?.contains('detail-page') ? 'detail' : undefined), vt });
      } catch {}
    });
  }
});
