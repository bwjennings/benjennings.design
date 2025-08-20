// Theme cache
window.themeCache = window.themeCache || {
  lastUpdate: 0,
  values: {},
  isValid() {
    // 1000ms cache TTL
    return Date.now() - this.lastUpdate < 1000;
  },
  update() {
    try {
      this.values = {
        theme: localStorage.getItem('myCustomTheme'),
        hue: localStorage.getItem('brandHue')
      };
      this.lastUpdate = Date.now();
    } catch (e) {
      console.error('Error reading theme from localStorage:', e);
      this.values = {};
    }
  },
  get() {
    if (!this.isValid()) {
      this.update();
    }
    return this.values;
  }
};

// Normalize and apply stored theme values
function applyStoredThemeVars() {
  try {
    const cached = window.themeCache.get();

    // Batch updates
    const updates = [];

    // Theme: allow 'light' | 'dark'; if missing/legacy, resolve to current system preference
    if (typeof cached.theme === 'string') {
      const t = cached.theme.trim();
      const isExplicit = (t === 'light' || t === 'dark');
      const effective = isExplicit
        ? t
        : ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
      // If we had a legacy/non-explicit value, persist the effective explicit theme now
      if (!isExplicit) {
        try { localStorage.setItem('myCustomTheme', effective); } catch {}
        if (window.themeCache && window.themeCache.values) {
          window.themeCache.values.theme = effective;
          window.themeCache.lastUpdate = Date.now();
        }
      }
      updates.push(['--current-color-scheme', effective]);
    }

    // Hue: accept numeric strings or values with 'deg'
    if (cached.hue != null) {
      const raw = String(cached.hue);
      const parsed = parseInt(raw, 10);
      if (!Number.isNaN(parsed)) {
        const clamped = Math.max(0, Math.min(360, parsed));
        updates.push(['--hue-root', clamped + 'deg']);
      }
    }

    // Apply updates
    updates.forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  } catch (e) {
    console.error('Error applying theme preferences:', e);
    // Fallback
    try {
      document.documentElement.style.setProperty('--current-color-scheme', 'light dark');
    } catch (fallbackError) {
      console.error('Fallback theme error:', fallbackError);
    }
  }
}

// Initial run (eager to avoid flashes)
(function () { applyStoredThemeVars(); })();

// Re-apply on visibility and page lifecycle (BFCache/prerender)
const reapply = () => { try { applyStoredThemeVars(); } catch {} };
window.addEventListener('pageshow', reapply);
if ('onpagereveal' in window) window.addEventListener('pagereveal', reapply);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reapply(); });
