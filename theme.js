const handleThemeChange = () => {
    const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
    document.documentElement.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('myCustomTheme', selectedTheme);
  };
  
  document.querySelectorAll('input[name="theme"]').forEach(radio => {
    radio.addEventListener('change', handleThemeChange);
  });
  
  window.addEventListener('DOMContentLoaded', () => {
    const storedTheme = localStorage.getItem('myCustomTheme');
    if (storedTheme) {
      document.documentElement.setAttribute('data-theme', storedTheme);
      document.querySelector(`input[name="theme"][value="${storedTheme}"]`).checked = true;
    }
  });
  