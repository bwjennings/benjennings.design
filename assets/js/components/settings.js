// Define and cache the template
const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/assets/css/components/radio-buttons.css">
  <link rel="stylesheet" href="/assets/css/components/button.css">
  <fieldset class="radio-buttons">
    <label class="radio-button">
      <input type="radio" name="theme" value="" checked aria-label="Auto Theme">
      <span class="icon md">routine</span>
      
    </label>
    <label class="radio-button">
      <input type="radio" name="theme" value="light" aria-label="Light Theme">
      <span class="icon md">light_mode</span>
     
    </label>
    <label class="radio-button">
      <input type="radio" name="theme" value="dark" aria-label="Dark Theme">
      <span class="icon md">dark_mode</span>
      
    </label>
  </fieldset>

`;

class SiteSettings extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.themeChangeHandler = this.themeChangeHandler.bind(this);
  }

  connectedCallback() {
    const storedTheme = localStorage.getItem("myCustomTheme") || "";
    const selected = this.shadowRoot.querySelector(`input[name="theme"][value="${storedTheme}"]`);
    if (selected) selected.checked = true;
    this.updateTheme(storedTheme);
    this.shadowRoot.querySelector("fieldset").addEventListener("change", this.themeChangeHandler);
    // Apply persisted hue/radius/chroma if available
    const storedHue = localStorage.getItem('brandHue');
    if (storedHue) {
      document.documentElement.style.setProperty('--base-hue', storedHue + 'deg');
    }
    const storedRadius = localStorage.getItem('baseRadius');
    if (storedRadius) {
      document.documentElement.style.setProperty('--base-radius', storedRadius + 'px');
    }


    // Apply persisted text heading width if available
    const storedTextHeadingWidth = localStorage.getItem('textHeadingWidth');
    if (storedTextHeadingWidth) {
      document.documentElement.style.setProperty('--text-heading-width', storedTextHeadingWidth);
    }
   
  }

  updateTheme(theme) {
    const colorScheme = theme === "light"
      ? "light"
      : theme === "dark"
        ? "dark"
        : "light dark";
    // Persist the chosen theme so it can be restored on other pages
    // An empty string represents the system/default setting
    localStorage.setItem("myCustomTheme", theme);

    // Batch style updates to avoid multiple reflows
    document.documentElement.style.setProperty("--current-color-scheme", colorScheme);
    window.dispatchEvent(new CustomEvent('globalSchemeChange', { detail: theme }));
  }

  themeChangeHandler(event) {
    if (event.target.name === "theme") {
      this.updateTheme(event.target.value);
    }
  }



}

customElements.define("site-settings", SiteSettings);