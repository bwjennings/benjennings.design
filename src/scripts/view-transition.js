/**
 * View transition helpers.
 * - Warn if unsupported.
 * - Ensure only the clicked card gets a named transition so others fall back to page blur.
 */
document.addEventListener('DOMContentLoaded', () => {
  if (!('CSSViewTransitionRule' in window)) {
    console.warn('View transitions are not supported in this browser.');
  }

  // If we're on a detail page, record the header's view-transition-name for back navigation.
  try {
    const detailHeader = document.querySelector('.post-header[style]');
    if (detailHeader) {
      const inline = detailHeader.style.getPropertyValue('view-transition-name');
      const computed = getComputedStyle(detailHeader).getPropertyValue('view-transition-name');
      const name = (inline || computed || '').trim();
      if (name && name !== 'none') {
        sessionStorage.setItem('lastVtName', name);
      }
    }
  } catch {}

  // Helpers to manage per-card part names (image/title/badges)
  const getCardParts = (card) => {
    if (!card) return {};
    const imageEl = card.querySelector('img, .icon-placeholder');
    const titleEl = card.querySelector('h1.title');
    const badgesEl = card.querySelector('.badge-group');
    return { imageEl, titleEl, badgesEl };
  };

  const applyCardPartNames = (card, key, enable) => {
    if (!card || !key) return;
    const { imageEl, titleEl, badgesEl } = getCardParts(card);
    const setOrClear = (el, name) => {
      if (!el) return;
      if (enable) el.style.setProperty('view-transition-name', name);
      else el.style.removeProperty('view-transition-name');
    };
    setOrClear(imageEl, `${key}-image`);
    setOrClear(titleEl, `${key}-title`);
    setOrClear(badgesEl, `${key}-badges`);
  };

  // URL helpers to persist the last VT key in history for robust back/forward
  const getVtFromUrl = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const vt = params.get('vt');
      return vt && vt.trim() ? vt.trim() : null;
    } catch { return null; }
  };

  const setVtInUrl = (name) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('vt', name);
      history.replaceState(history.state, '', url);
    } catch {}
  };

  const clearVtInUrl = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('vt');
      history.replaceState(history.state, '', url);
    } catch {}
  };

  // If we're on a listing page, pre-name the matching card + parts using URL param (preferred)
  // and fall back to sessionStorage as a secondary hint.
  try {
    const cards = document.querySelectorAll('a[data-vt-target]');
    if (cards.length) {
      const vtFromUrl = getVtFromUrl();
      const last = vtFromUrl || sessionStorage.getItem('lastVtName');
      const target = last ? Array.from(cards).find(a => a.getAttribute('data-vt-target') === last) : null;
      // Clear others first
      cards.forEach((a) => {
        if (a !== target) {
          a.style.removeProperty('view-transition-name');
          applyCardPartNames(a, a.getAttribute('data-vt-target'), false);
        }
      });
      if (target) {
        if (!target.style.getPropertyValue('view-transition-name')) {
          target.style.setProperty('view-transition-name', last);
        }
        applyCardPartNames(target, last, true);
        // Ensure URL carries the vt key for reliable reverse transitions
        if (!vtFromUrl) setVtInUrl(last);
      }
    }
  } catch {}

  // Delegate clicks to anchors that declare a data-vt-target
  // This sets the view-transition-name only on the activated card so
  // non-activated cards remain unnamed and participate in the page animation.
  const onClick = (e) => {
    // Only handle primary-button navigations without modifiers
    if ((e.button !== 0 && e.detail !== 0) || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    // Find any anchor (we may need to clean up even for non-card links)
    const anyAnchor = e.target && (e.target.closest ? e.target.closest('a') : null);
    if (!anyAnchor) return;

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
          // Also set names on the clicked card's parts and clear others
          document.querySelectorAll('a[data-vt-target]').forEach((a) => {
            const key = a.getAttribute('data-vt-target');
            applyCardPartNames(a, key, a === cardAnchor);
          });
          // Update session for reverse morph on back
          sessionStorage.setItem('lastVtName', name);
          // Persist key in URL of the listing page's history entry for robust back navigation
          setVtInUrl(name);
        } catch {}
      }
      return;
    }

    // If this is a top-level navigation click, clear lastVtName so
    // listing pages don't pre-name a card from a previous section.
    try {
      const isTopNav = anyAnchor.classList?.contains('nav-item') || anyAnchor.closest('site-navigation');
      if (isTopNav) {
        // Navigating to another top-level page: clear stored key and any inline names,
        // and remove vt from the URL so the next visit doesn't pre-name incorrectly.
        sessionStorage.removeItem('lastVtName');
        clearVtInUrl();
        document.querySelectorAll('[style]')
          .forEach((el) => el.style?.removeProperty('view-transition-name'));
      }
      // IMPORTANT: Do not clear names for non-card, non-topnav links (e.g., Back buttons).
      // Keeping names enables reverse morph into the cached listing card.
    } catch {}
  };

  // Capture phase to run before navigation handling
  document.addEventListener('click', onClick, true);

  // Clean up lingering inline names on bfcache restore
  window.addEventListener('pageshow', (e) => {
    const vt = getVtFromUrl();
    const cards = document.querySelectorAll('a[data-vt-target]');
    const onListing = cards.length > 0;

    if (onListing) {
      // On listing pages, if vt is missing, clear any lingering names on cards only.
      if (!vt) {
        cards.forEach((a) => {
          a.style.removeProperty('view-transition-name');
          applyCardPartNames(a, a.getAttribute('data-vt-target'), false);
        });
      }
      // If vt exists, ensure target card remains named (parts too) and others are clear.
      else {
        const target = Array.from(cards).find(a => a.getAttribute('data-vt-target') === vt);
        cards.forEach((a) => {
          const key = a.getAttribute('data-vt-target');
          const active = a === target;
          if (!active) a.style.removeProperty('view-transition-name');
          applyCardPartNames(a, key, active);
        });
        if (target) target.style.setProperty('view-transition-name', vt);
      }
    } else {
      // On detail pages, never strip header names here; they need to persist for reverse morph.
    }
  });
});
