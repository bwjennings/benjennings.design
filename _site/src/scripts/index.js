(function () {
  try {
    // Retrieve saved values from local storage (if any)
    const theme = localStorage.getItem('myCustomTheme');
    const highContrast = localStorage.getItem('highContrast') === 'true';
    const selectedColorHue = localStorage.getItem('brandHue');
    const selectedStimulation = localStorage.getItem('stimulationLevel');
    const selectedRadius = localStorage.getItem('baseRadius');
    const selectedDataTheme = localStorage.getItem('dataTheme');
    const selectedContrast = localStorage.getItem('contrast');

    if (theme !== null) {
      const colorScheme = theme === '' || theme === 'system' ? 'light dark' : theme;
      document.documentElement.style.setProperty('--current-color-scheme', colorScheme);
    }

    // Set high-contrast mode if enabled
    if (highContrast) {
      document.documentElement.dataset.mode = 'high-contrast';
    }

    // Set the hue and stimulation level
    if (selectedColorHue !== null) {
      document.documentElement.style.setProperty('--color1-hue', selectedColorHue + 'deg');
    }
    if (selectedStimulation !== null) {
      document.documentElement.style.setProperty('--stimulation-level', selectedStimulation);
    }
    // Apply persisted radius if available
    if (selectedRadius !== null) {
      document.documentElement.style.setProperty('--base-radius', selectedRadius + 'px');
    }
    // Apply saved data-theme if available
    if (selectedDataTheme) {
      document.documentElement.setAttribute('data-theme', selectedDataTheme);
    }
    if (selectedContrast !== null) {
      document.documentElement.style.setProperty('--contrast', selectedContrast);
    }
  } catch (e) {
    console.error('Error applying theme preferences:', e);
    // Fallback to default theme if localStorage is corrupted
    try {
      document.documentElement.style.setProperty('--current-color-scheme', 'light dark');
      localStorage.clear();
    } catch (fallbackError) {
      console.error('Failed to apply fallback theme:', fallbackError);
    }
  }
})();
