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
        highContrast: localStorage.getItem('highContrast') === 'true',
        colorHue: localStorage.getItem('brandHue'),
        stimulation: localStorage.getItem('stimulationLevel'),
        radius: localStorage.getItem('baseRadius'),
        dataTheme: localStorage.getItem('dataTheme'),
        contrast: localStorage.getItem('contrast')
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

    if (cached.highContrast) {
      document.documentElement.dataset.mode = 'high-contrast';
    }

    if (cached.colorHue !== null) {
      updates.push(['--hue-root', cached.colorHue + 'deg']);
    }
    if (cached.stimulation !== null) {
      updates.push(['--stimulation-level', cached.stimulation]);
    }
    if (cached.radius !== null) {
      updates.push(['--base-radius', cached.radius + 'px']);
    }
    if (cached.contrast !== null) {
      updates.push(['--contrast', cached.contrast]);
    }

    // Apply all CSS updates in one batch
    updates.forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });

    if (cached.dataTheme) {
      document.documentElement.setAttribute('data-theme', cached.dataTheme);
    }
    
  } catch (e) {
    console.error('Error applying theme preferences:', e);
    // Fallback to default theme if localStorage is corrupted
    try {
      document.documentElement.style.setProperty('--current-color-scheme', 'light dark');
      localStorage.clear();
      // Reset cache
      window.themeCache.values = {};
      window.themeCache.lastUpdate = 0;
    } catch (fallbackError) {
      console.error('Failed to apply fallback theme:', fallbackError);
    }
  }
})();
