(function () {
  try {
    // Retrieve theme, high contrast, and hue values from local storage
    const theme = localStorage.getItem('myCustomTheme') || 'light'; // Default to 'light' if not set
    const highContrast = localStorage.getItem('highContrast') === 'true';
    const selectedColorHue = localStorage.getItem('selectedColorHue') || '230';

    // Set color scheme for light/dark mode
    document.documentElement.style.setProperty('color-scheme', theme);

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