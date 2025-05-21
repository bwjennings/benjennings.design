(function () {
  try {
    // Retrieve theme, high contrast, and hue values from local storage
    const theme = localStorage.getItem('myCustomTheme') || 'light dark'; // Default to 'light' if not set
    const highContrast = localStorage.getItem('highContrast') === 'true';
    const selectedColorHue = localStorage.getItem('brandHue') || '230';
    // Retrieve persisted radius, chroma, and hue offset
    const selectedRadius = localStorage.getItem('baseRadius');
    const selectedChroma = localStorage.getItem('chromaBase');
    const selectedHueOffset = localStorage.getItem('hueOffsetBase');
    const selectedContrast = localStorage.getItem('contrast');

    // Determine the color scheme based on theme setting
    const colorScheme = theme === 'system' ? 'light dark' : theme;
    document.documentElement.style.setProperty('--current-color-scheme', colorScheme);

    // Set high-contrast mode if enabled
    if (highContrast) {
      document.documentElement.dataset.mode = 'high-contrast';
    } else {
      document.documentElement.dataset.mode = 'normal';
    }

    // Set the hue
    document.documentElement.style.setProperty('--brand-hue', selectedColorHue + 'deg');
    // Apply persisted radius if available
    if (selectedRadius) {
      document.documentElement.style.setProperty('--base-radius', selectedRadius + 'px');
    }
    // Apply persisted chroma if available
    if (selectedChroma) {
      document.documentElement.style.setProperty('--chroma-base', selectedChroma);
    }
    // Apply persisted hue-offset-base if available
    if (selectedHueOffset) {
      document.documentElement.style.setProperty('--hue-offset-base', selectedHueOffset + 'deg');
    }

    // Apply persisted contrast if available
    if (selectedContrast) {
      document.documentElement.style.setProperty('--contrast', selectedContrast);
    }
  } catch (e) {
    console.error('Error applying theme preferences:', e);
  }
})();
