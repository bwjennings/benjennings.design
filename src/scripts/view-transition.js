// Path where this app is deployed. Adjust if deploying at a subdirectory
const basePath = '';

/* ---------- Internal utils ---------- */

// Generate a stable per-tab id so our localStorage fallback is tab-scoped.
const TAB_ID_KEY = 'vt-tab-id';
const tabId = (() => {
  try {
    let id = sessionStorage.getItem(TAB_ID_KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2);
      sessionStorage.setItem(TAB_ID_KEY, id);
    }
    return id;
  } catch {
    // sessionStorage can be disabled; fall back to a constant (best effort)
    return 'no-session';
  }
})();

const DEBUG = false;
const log = (...args) => { if (DEBUG) console.log(...args); };

// Simple transition cache to avoid repeated calculations
const transitionCache = new Map();
const CACHE_SIZE = 10; // Limit cache size

// Strip trailing "index.html" if present and ensure a trailing slash.
// Keep this helper *scoped to routing logic* only.
const normalizePath = (pathname) => {
  const withoutIndex = pathname.replace(/index\.html$/, '');
  return withoutIndex.endsWith('/') ? withoutIndex : withoutIndex + '/';
};

// Remove basePath ONLY when it is a prefix.
const stripBasePath = (pathname) => {
  if (!basePath) return pathname;
  return pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
};

// Top-level navigation order is defined once here.
const NAV_ORDER = ['/', '/fundamentals/', '/designs/', '/experiments/', '/resources/'];
const getPageIndex = (pathname) => {
  const normalizedPath = pathname.endsWith('/') ? pathname : pathname + '/';
  return NAV_ORDER.indexOf(normalizedPath);
};

/* ---------- Page type helpers ---------- */

const isTopLevelPage = (pathname) => {
  const p = normalizePath(pathname);
  return NAV_ORDER.includes(p);
};

const isProjectPage = (pathname) => {
  // Match patterns like /designs/arvest/, /designs/dwellane/, etc.
  return /^\/designs\/[^/]+\/?$/.test(pathname);
};

const isHomePage = (pathname) => {
  const p = normalizePath(pathname);
  return p === '/' || p === '/designs/';
};

/* ---------- Transition classifier ---------- */

const determineTransitionType = (oldNavigationEntry, newNavigationEntry) => {
  // Be robust to early loads / first page where .from can be null.
  if (!oldNavigationEntry || !newNavigationEntry) return 'unknown';
  if (!oldNavigationEntry.url || !newNavigationEntry.url) return 'unknown';

  try {
    const currentURL = new URL(oldNavigationEntry.url);
    const destinationURL = new URL(newNavigationEntry.url);

    const currentPathname = stripBasePath(currentURL.pathname);
    const destinationPathname = stripBasePath(destinationURL.pathname);

    // Create cache key for this transition
    const cacheKey = `${currentPathname}→${destinationPathname}`;
    
    // Check cache first
    if (transitionCache.has(cacheKey)) {
      log(`🔍 Using cached transition: ${cacheKey}`);
      return transitionCache.get(cacheKey);
    }

    log(`🔍 Transition: ${currentPathname} → ${destinationPathname}`);

    let transitionType = 'unknown';

    if (currentPathname === destinationPathname) {
      transitionType = 'reload';
    }
    // Simplified transition detection - only handle most common cases
    else if (isHomePage(currentPathname) && isProjectPage(destinationPathname)) {
      log(`🎯 Card-to-detail transition detected`);
      transitionType = 'card-to-detail';
    }
    else if (isProjectPage(currentPathname) && isHomePage(destinationPathname)) {
      log(`🎯 Detail-to-card transition detected`);
      transitionType = 'detail-to-card';
    }
    // Simplified nav detection - just check if both are top-level
    else if (isTopLevelPage(currentPathname) && isTopLevelPage(destinationPathname)) {
      const fromIdx = getPageIndex(currentPathname);
      const toIdx = getPageIndex(destinationPathname);
      
      if (fromIdx !== -1 && toIdx !== -1) {
        transitionType = fromIdx > toIdx ? 'nav-up' : 'nav-down';
      }
    }

    // Cache the result
    if (transitionCache.size >= CACHE_SIZE) {
      // Simple LRU: remove first entry
      const firstKey = transitionCache.keys().next().value;
      transitionCache.delete(firstKey);
    }
    transitionCache.set(cacheKey, transitionType);

    return transitionType;
  } catch (error) {
    console.warn('Error determining transition type:', error);
    return 'unknown';
  }
};

/* ---------- Event wiring ---------- */

// Critical: Set up pagereveal listener IMMEDIATELY (before DOM loads)
window.addEventListener('pagereveal', (e) => {
  if (!e.viewTransition) return;

  // Prefer Navigation API; fall back to tab-scoped localStorage handoff.
  let transitionType = 'unknown';
  const nav = globalThis.navigation;
  const act = nav?.activation;

  if (act?.from && act?.entry) {
    transitionType = determineTransitionType(act.from, act.entry);
  } else {
    // Fallback to localStorage with error handling
    try {
      const key = `transitionType:${tabId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        transitionType = stored;
        localStorage.removeItem(key); // cleanup immediately
      }
    } catch {
      // Silently ignore storage errors
    }
  }

  log(`🎬 pageReveal: Adding transition type "${transitionType}"`);
  e.viewTransition.types.add(transitionType);
});

// For cross-document handoff on outgoing page
window.addEventListener('pageswap', (e) => {
  const act = e.activation;
  let transitionType = 'unknown';

  if (act?.from && act?.entry) {
    transitionType = determineTransitionType(act.from, act.entry);
    if (e.viewTransition) {
      e.viewTransition.types.add(transitionType);
    }
  }

  // Persist transitionType for browsers without Navigation API
  try {
    const nav = globalThis.navigation;
    if (!nav?.activation) {
      localStorage.setItem(`transitionType:${tabId}`, transitionType);
    }
  } catch {
    // Silently ignore storage errors
  }
});

// Some engines use pagehide / pageshow semantics around bfcache.
// Not strictly required, but keeps behaviour consistent.
window.addEventListener('pageshow', () => {
  log('🔁 PAGESHOW (bfcache restore)');
});

// URLPattern Polyfill - Load synchronously for immediate availability
if (!globalThis.URLPattern) {
  // For now, we'll skip the polyfill since it requires async import
  // Modern browsers should support URLPattern natively
  console.warn('URLPattern not available - some features may not work in older browsers');
}

/* ---------- Capability checks ---------- */

document.addEventListener('DOMContentLoaded', () => {
  let shouldThrow = false;

  if (!window.navigation) {
    const el = document.querySelector('.warning[data-reason="navigation-api"]');
    if (el) el.style.display = 'block';
    // We DO NOT throw here because we provide a localStorage fallback.
  }

  if (!('CSSViewTransitionRule' in window)) {
    const el = document.querySelector('.warning[data-reason="cross-document-view-transitions"]');
    if (el) el.style.display = 'block';
    shouldThrow = true; // We rely on this for core behaviour; abort to avoid half-broken UX.
  }

  if (shouldThrow) {
    throw new Error('Browser is lacking support …');
  }

  log('✅ Cross-document view transitions supported');
});