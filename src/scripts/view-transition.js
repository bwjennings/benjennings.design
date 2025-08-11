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

  // If we're on a listing page, pre-name the matching card before paint when coming back without bfcache
  try {
    const cards = document.querySelectorAll('a[data-vt-target]');
    if (cards.length) {
      const last = sessionStorage.getItem('lastVtName');
      if (last) {
        const target = Array.from(cards).find(a => a.getAttribute('data-vt-target') === last);
        if (target && !target.style.getPropertyValue('view-transition-name')) {
          target.style.setProperty('view-transition-name', last);
        }
        // Do not clear here; keep for potential multi-hop back. Clear on next navigation or manual cleanup.
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
          // Update session for reverse morph on back
          sessionStorage.setItem('lastVtName', name);
        } catch {}
      }
      return;
    }

    // If this is a top-level navigation click, clear lastVtName so
    // listing pages don't pre-name a card from a previous section.
    try {
      const isTopNav = anyAnchor.classList?.contains('nav-item') || anyAnchor.closest('site-navigation');
      if (isTopNav) {
        sessionStorage.removeItem('lastVtName');
      }
    } catch {}

    // For non-card navigations (e.g., top-level nav), remove any lingering inline names
    // so the outgoing snapshot doesn't create stray named transition groups.
    try {
      document.querySelectorAll('a[data-vt-target]').forEach((a) => {
        a.style.removeProperty('view-transition-name');
      });
    } catch {}
  };

  // Capture phase to run before navigation handling
  document.addEventListener('click', onClick, true);

  // Clean up lingering inline names on bfcache restore
  window.addEventListener('pageshow', () => {
    document.querySelectorAll('a[data-vt-target]').forEach((a) => {
      a.style.removeProperty('view-transition-name');
    });
  });
});
