 // Handle font changes
 const handleFontChange = () => {
    const selectedFont = document.querySelector('input[name="font"]:checked').value;
    document.documentElement.setAttribute('data-font', selectedFont);
    localStorage.setItem('selectedFont', selectedFont);
};

document.querySelectorAll('input[name="font"]').forEach(radio => {
    radio.addEventListener('change', handleFontChange);
});

// Handle theme changes
const handleThemeChange = () => {
    const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
    document.documentElement.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('myCustomTheme', selectedTheme);
};

document.querySelectorAll('input[name="theme"]').forEach(radio => {
    radio.addEventListener('change', handleThemeChange);
});

// Set initial states from local storage on page load
window.addEventListener('DOMContentLoaded', () => {
    const storedFont = localStorage.getItem('selectedFont');
    if (storedFont) {
        document.documentElement.setAttribute('data-font', storedFont);
        document.querySelector(`input[name="font"][value="${storedFont}"]`).checked = true;
    }

    const storedTheme = localStorage.getItem('myCustomTheme');
    if (storedTheme) {
        document.documentElement.setAttribute('data-theme', storedTheme);
        document.querySelector(`input[name="theme"][value="${storedTheme}"]`).checked = true;
    }
});