// Theme cache to avoid redundant localStorage reads
window.themeCache = window.themeCache || {
  lastUpdate: 0,
  values: {},
  isValid() {
    // Cache valid for 1000ms to handle rapid navigation
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

    // Batch DOM updates to minimize reflows
    const updates = [];
    
    if (cached.theme !== null) {
      const colorScheme = cached.theme === '' || cached.theme === 'system' ? 'light dark' : cached.theme;
      updates.push(['--current-color-scheme', colorScheme]);
    }
    if (cached.hue !== null) {
      updates.push(['--hue-root', cached.hue + 'deg']);
    }

    // Apply all CSS updates in one batch
    updates.forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });

    // Removed legacy attributes and variables not controlled via UI
  } catch (e) {
    console.error('Error applying theme preferences:', e);
    // Fallback to default theme
    try {
      document.documentElement.style.setProperty('--current-color-scheme', 'light dark');
    } catch (fallbackError) {
      console.error('Failed to apply fallback theme:', fallbackError);
    }
  }
})();
