(function () {
  try {
    // Retrieve theme, high contrast, and hue values from local storage
    const theme = localStorage.getItem('myCustomTheme') || 'light dark'; // Default to 'light' if not set
    const highContrast = localStorage.getItem('highContrast') === 'true';
    const selectedColorHue = localStorage.getItem('brandHue') || '230';
    // Retrieve persisted radius and custom theme
    const selectedRadius = localStorage.getItem('baseRadius');
    const selectedDataTheme = localStorage.getItem('dataTheme');

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
    // Apply saved data-theme if available
    if (selectedDataTheme) {
      document.documentElement.setAttribute('data-theme', selectedDataTheme);
    }
  } catch (e) {
    console.error('Error applying theme preferences:', e);
  }
})();
