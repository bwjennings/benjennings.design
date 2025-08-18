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

(function () {
  try {
    const cached = window.themeCache.get();

    // Batch updates
    const updates = [];
    
    if (cached.theme !== null) {
      const colorScheme = cached.theme === '' || cached.theme === 'system' ? 'light dark' : cached.theme;
      updates.push(['--current-color-scheme', colorScheme]);
    }
    if (cached.hue !== null) {
      updates.push(['--hue-root', cached.hue + 'deg']);
    }

    // Apply updates
    updates.forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });

    // Legacy attributes removed
  } catch (e) {
    console.error('Error applying theme preferences:', e);
    // Fallback
    try {
      document.documentElement.style.setProperty('--current-color-scheme', 'light dark');
    } catch (fallbackError) {
      console.error('Fallback theme error:', fallbackError);
    }
  }
})();
