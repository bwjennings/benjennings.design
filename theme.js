const themeSelect = document.getElementById('themeSelect');

const handleThemeChange = (e) => {
  const theme = e.target.value;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('myCustomTheme', theme);
}

// Event listener for the select element
themeSelect.addEventListener('change', handleThemeChange);

window.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('myCustomTheme');
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeSelect.value = theme; // Set the select element to the current theme
  }
});
