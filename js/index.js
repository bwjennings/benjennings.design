(function () {
    try {
      const theme = localStorage.getItem('myCustomTheme') || '';
      const highContrast = localStorage.getItem('highContrast') === 'true';
      const selectedColorHue = localStorage.getItem('selectedColorHue') || '';
      const colorScheme = theme === 'light' ? 'light' : theme === 'dark' ? 'dark' : 'light dark';
  
      document.documentElement.style.setProperty('color-scheme', colorScheme);
      
      if (highContrast) {
        document.documentElement.dataset.mode = 'high-contrast';
      }
  
      if (selectedColorHue) {
        document.documentElement.style.setProperty('--theme-hue', selectedColorHue);
      }
    } catch (e) {
      console.error('Error applying theme preferences:', e);
    }
  })();