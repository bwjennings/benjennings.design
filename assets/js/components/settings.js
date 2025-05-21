// Define and cache the template
const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/css/components/radio-buttons.css">
  <link rel="stylesheet" href="/css/components/button.css">
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
  <fieldset class="radio-buttons" id="data-theme-selector">
    <label class="radio-button">
      <input type="radio" name="dataTheme" value="calm" aria-label="Calm">
      <span>Calm</span>
    </label>
    <label class="radio-button">
      <input type="radio" name="dataTheme" value="balanced" aria-label="Balanced">
      <span>Balanced</span>
    </label>
    <label class="radio-button">
      <input type="radio" name="dataTheme" value="energized" aria-label="Energized">
      <span>Energized</span>
    </label>
  </fieldset>
  <button part="button" id="change-hue">Change Hue</button>
`;

class SiteSettings extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.themeChangeHandler = this.themeChangeHandler.bind(this);
    this.dataThemeChangeHandler = this.dataThemeChangeHandler.bind(this);
    this.changeHue = this.changeHue.bind(this);
  }

  connectedCallback() {
    const storedTheme = localStorage.getItem("myCustomTheme") || "";
    const selected = this.shadowRoot.querySelector(`input[name="theme"][value="${storedTheme}"]`);
    if (selected) selected.checked = true;
    this.updateTheme(storedTheme);
    this.shadowRoot.querySelector("fieldset").addEventListener("change", this.themeChangeHandler);
    // Add listener for hue change button
    const hueBtn = this.shadowRoot.getElementById("change-hue");
    hueBtn.addEventListener("click", this.changeHue);
    // Apply persisted hue/radius/chroma if available
    const storedHue = localStorage.getItem('brandHue');
    if (storedHue) {
      document.documentElement.style.setProperty('--brand-hue', storedHue + 'deg');
    }
    const storedRadius = localStorage.getItem('baseRadius');
    if (storedRadius) {
      document.documentElement.style.setProperty('--base-radius', storedRadius + 'px');
    }

    const storedDataTheme = localStorage.getItem('dataTheme') || 'balanced';
    const themeStyleInput = this.shadowRoot.querySelector(`input[name="dataTheme"][value="${storedDataTheme}"]`);
    if (themeStyleInput) themeStyleInput.checked = true;
    this.updateDataTheme(storedDataTheme);
    this.shadowRoot.getElementById('data-theme-selector').addEventListener('change', this.dataThemeChangeHandler);

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

  dataThemeChangeHandler(event) {
    if (event.target.name === "dataTheme") {
      this.updateDataTheme(event.target.value);
    }
  }

  updateDataTheme(themeStyle) {
    localStorage.setItem('dataTheme', themeStyle);
    if (themeStyle) {
      document.documentElement.setAttribute('data-theme', themeStyle);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  changeHue() {
    // Maximum hue shift in degrees
    const hueLimit = 90; // change this value to adjust the limit
    const currentHue = parseInt(localStorage.getItem('brandHue') || '0', 10);
    const deltaHue = Math.floor(Math.random() * (hueLimit * 2 + 1)) - hueLimit;
    const randomHue = (currentHue + deltaHue + 360) % 360;
    document.documentElement.style.setProperty("--brand-hue", randomHue + "deg");

    // Random radius 0–8px
    const randomRadius = Math.floor(Math.random() * 9);
    document.documentElement.style.setProperty("--base-radius", randomRadius + "px");

    // Random text heading grade 0–100 (unitless)
    const randomTextHeadingGrade = Math.floor(Math.random() * 101);
    document.documentElement.style.setProperty('--text-heading-grade', randomTextHeadingGrade);
    localStorage.setItem('textHeadingGrade', randomTextHeadingGrade);

    // Random contrast 0.50–1.50
    const randomContrast = (Math.random() + 0.5).toFixed(2);
    document.documentElement.style.setProperty('--contrast', randomContrast);
    localStorage.setItem('contrast', randomContrast);

    console.log(`--brand-hue set to: ${randomHue}deg`);
    // Persist random values so they survive page loads
    localStorage.setItem('brandHue', randomHue);
    localStorage.setItem('baseRadius', randomRadius);
  }
}

customElements.define("site-settings", SiteSettings);