/**
 * View transition helpers.
 * - Warn if unsupported.
 * - Ensure only the clicked card gets a named transition so others fall back to page blur.
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    if (!(window.CSS && CSS.supports && CSS.supports('view-transition-name', 'page'))) {
      console.warn('View Transitions not fully supported; falling back gracefully.');
    }
  } catch {}

  // Ensure the browser restores scroll on history navigations
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'auto'; } catch {}

  // If we're on a detail page, record the header's view-transition-name for back navigation
  // and ensure we have proper history state
  try {
    const detailHeader = document.querySelector('.post-header[style]');
    if (detailHeader) {
      const inline = detailHeader.style.getPropertyValue('view-transition-name');
      const computed = getComputedStyle(detailHeader).getPropertyValue('view-transition-name');
      const name = (inline || computed || '').trim();
      if (name && name !== 'none') {
        sessionStorage.setItem('lastVtName', name);
        
        // Ensure we have proper history state for this detail page
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

  // Helpers to manage per-card part names (image/title/badges)
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

  // Apply class hooks to detail header and parts if they already have names
  const applyDetailClassesIfPresent = () => {
    try {
      const detailHeader = document.querySelector('.post-header[style]');
      if (!detailHeader) return;
      const headerName = (detailHeader.style.getPropertyValue('view-transition-name') || '').trim();
      if (headerName && headerName !== 'none') {
        // Header container should share the same class as list cards
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

  // State helpers: prefer history.state, fall back to sessionStorage
  const getVtFromState = () => {
    try {
      // Prefer Navigation API state if available
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

  // If we're on a listing page, pre-name the matching card + parts using URL param (preferred)
  // and fall back to sessionStorage as a secondary hint.
  try {
    const cards = document.querySelectorAll('a[data-vt-target]');
    if (cards.length) {
      const vtFromState = getVtFromState();
      const last = vtFromState || sessionStorage.getItem('lastVtName');
      const target = last ? Array.from(cards).find(a => a.getAttribute('data-vt-target') === last) : null;
      // Clear others first
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
        // Class hook for anchor snapshot
        target.style.setProperty('view-transition-class', 'card');
        applyCardPartNames(target, last, true);
        // Persist in history.state for reliable reverse transitions
        try { writeVtToState({ page: 'listing', vt: last }); } catch {}
      }
    }
  } catch {}

  // Delegate clicks to anchors that declare a data-vt-target
  // This sets the view-transition-name only on the activated card so
  // non-activated cards remain unnamed and participate in the page animation.
  const onClick = (e) => {
    // Only ignore non-primary mouse buttons and modified clicks
    // Mobile taps may have undefined button and non-zero detail; allow those.
    if ((typeof e.button === 'number' && e.button > 0) || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    // Find any anchor (we may need to clean up even for non-card links)
    const anyAnchor = e.target && (e.target.closest ? e.target.closest('a') : null);
    if (!anyAnchor) return;

    // Let back links navigate normally; state is already managed elsewhere
    // (leaving logic intact for future custom handling if needed)

    // If this is a card click, set its transition name and record it
    const cardAnchor = anyAnchor.matches('a[data-vt-target]') ? anyAnchor : null;
    if (cardAnchor) {
      const name = cardAnchor.getAttribute('data-vt-target');
      if (name) {
        try {
          // Remove any previously applied names so only the clicked card is named
          document.querySelectorAll('a[data-vt-target]').forEach((a) => {
            if (a !== cardAnchor) a.style.removeProperty('view-transition-name');
          });
          cardAnchor.style.setProperty('view-transition-name', name);
          cardAnchor.style.setProperty('view-transition-class', 'card');
          // Also set names on the clicked card's parts and clear others
          document.querySelectorAll('a[data-vt-target]').forEach((a) => {
            const key = a.getAttribute('data-vt-target');
            applyCardPartNames(a, key, a === cardAnchor);
          });
          // Update session for reverse morph on back
          sessionStorage.setItem('lastVtName', name);
          // Persist key in entry state for robust back navigation
          writeVtToState({ page: 'listing', vt: name });
          // Allow default navigation to proceed for proper cross-document VT
        } catch {}
      }
      return;
    }

    // If this is a top-level navigation click, clear lastVtName so
    // listing pages don't pre-name a card from a previous section.
    try {
      const isTopNav = anyAnchor.classList?.contains('nav-item') || anyAnchor.closest('site-navigation');
      if (isTopNav) {
        // Navigating to another top-level page: clear stored key and remove vt
        sessionStorage.removeItem('lastVtName');

        // Only clear names from card elements and their parts; do NOT touch navigation
        const toClear = document.querySelectorAll(
          'a[data-vt-target], a[data-vt-target] img, a[data-vt-target] .icon-placeholder, a[data-vt-target] h1[class*="heading"], a[data-vt-target] .badge-group'
        );
        toClear.forEach((el) => {
          el.style?.removeProperty('view-transition-name');
          el.style?.removeProperty('view-transition-class');
        });
      }
      // IMPORTANT: Do not clear names for non-card, non-topnav links (e.g., Back buttons).
      // Keeping names enables reverse morph into the cached listing card.
    } catch {}
  };

  // Capture phase to run before navigation handling
  document.addEventListener('click', onClick, true);

  // Handle browser back/forward navigation (fallback)
  window.addEventListener('popstate', (e) => {
    try {
      // If we have state indicating this is a listing page, restore it properly
      if (e.state && e.state.page === 'listing') {
        const vt = e.state.vt;
        if (vt) {
          // Restore the view transition name on the correct card
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

  // Clean up lingering inline names on bfcache restore
  const handleRevealOrShow = (isRevealEvent, e) => {
    // Detect history restores (bfcache or back/forward nav)
    try {
      const perfNav = (performance && performance.getEntriesByType) ? performance.getEntriesByType('navigation')[0] : null;
      const isHistoryRestore = Boolean(e?.persisted) || (perfNav && perfNav.type === 'back_forward');
      if (isHistoryRestore) {
        document.documentElement.classList.add('restoring');
        // Allow UA to restore scroll, then drop the override
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
      // On listing pages, if vt is missing, clear any lingering names on cards only.
      if (!vt) {
        cards.forEach((a) => {
          a.style.removeProperty('view-transition-name');
          a.style.removeProperty('view-transition-class');
          applyCardPartNames(a, a.getAttribute('data-vt-target'), false);
        });
      }
      // If vt exists, ensure target card remains named (parts too) and others are clear.
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
      // On detail pages, never strip header names here; they need to persist for reverse morph.
    }
  };

  // Prefer pagereveal for precise timing; fallback to pageshow
  if ('onpagereveal' in window) {
    window.addEventListener('pagereveal', (e) => handleRevealOrShow(true, e));
  } else {
    window.addEventListener('pageshow', (e) => handleRevealOrShow(false, e));
  }

  // Ensure detail pages also get class hooks applied
  applyDetailClassesIfPresent();

  // On outgoing navigation, persist VT key if needed and pause work
  if ('onpageswap' in window) {
    window.addEventListener('pageswap', (e) => {
      try {
        const vt = getVtFromState() || sessionStorage.getItem('lastVtName');
        if (vt) writeVtToState({ page: document.querySelector('a[data-vt-target]') ? 'listing' : (document.body?.classList?.contains('detail-page') ? 'detail' : undefined), vt });
      } catch {}
      // If needed, pause timers/observers here
    });
  }
});
