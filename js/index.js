(function () {
  try {
    // Retrieve theme, high contrast, and hue values from local storage
    const theme = localStorage.getItem('myCustomTheme') || 'light dark'; // Default to 'light' if not set
    const highContrast = localStorage.getItem('highContrast') === 'true';
    const selectedColorHue = localStorage.getItem('selectedColorHue') || '230';

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
    document.documentElement.style.setProperty('--brand-hue', selectedColorHue);
  } catch (e) {
    console.error('Error applying theme preferences:', e);
  }
})();