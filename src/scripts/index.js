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

    // Theme: allow 'light' | 'dark' | 'system' | ''
    if (typeof cached.theme === 'string') {
      const t = cached.theme.trim();
      const colorScheme = (t === '' || t === 'system') ? 'light dark' : (t === 'light' || t === 'dark') ? t : 'light dark';
      updates.push(['--current-color-scheme', colorScheme]);
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

// Re-apply on pageshow (helps with prerender/BFCache restores)
window.addEventListener('pageshow', () => {
  try { applyStoredThemeVars(); } catch {}
});
