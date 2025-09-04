// Theme controller following the decision tree
(function () {
  const STORAGE_KEY = 'myCustomTheme'; // 'dark' | 'light'

  const getStored = () => {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  };
  const setStored = (val) => {
    try { localStorage.setItem(STORAGE_KEY, val); } catch {}
  };
  const clearStored = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };
  const osPrefersDark = () => {
    try { return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); } catch { return false; }
  };
  const apply = (theme) => {
    try { document.documentElement.style.setProperty('--current-color-scheme', theme); } catch {}
    try { window.dispatchEvent(new CustomEvent('globalSchemeChange', { detail: theme })); } catch {}
  };
  const computeInitial = () => {
    const saved = getStored();
    if (saved === 'dark') return 'dark';
    if (saved === 'light') return 'light';
    return osPrefersDark() ? 'dark' : 'light';
  };

  // Public API
  const state = { theme: computeInitial() };
  apply(state.theme);

  const updateMode = (dark, persist) => {
    state.theme = dark ? 'dark' : 'light';
    apply(state.theme);
    if (persist) setStored(state.theme);
  };

  const toggleAndPersist = () => {
    updateMode(!(state.theme === 'dark'), true);
  };

  // Expose
  window.__Theme = {
    get: () => state.theme,
    updateMode, // (boolean isDark, boolean persist)
    toggleAndPersist,
  };

  // A) Re-apply on lifecycle
  const reapply = () => {
    const next = computeInitial();
    if (next !== state.theme) {
      state.theme = next;
      apply(state.theme);
    }
  };
  window.addEventListener('pageshow', reapply);
  if ('onpagereveal' in window) window.addEventListener('pagereveal', reapply);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reapply(); });

  // B) When the OS theme changes: set and clear saved preference
  try {
    const mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (mql && mql.addEventListener) {
      mql.addEventListener('change', () => {
        state.theme = mql.matches ? 'dark' : 'light';
        apply(state.theme);
        clearStored(); // Remove any saved preference so OS controls it
      });
    }
  } catch {}

  // Cross-tab sync
  window.addEventListener('storage', (e) => {
    if (!e) return;
    if (e.key === STORAGE_KEY) {
      reapply();
    }
  });
})();
