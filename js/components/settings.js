// Define and cache the template
const template = document.createElement('template');
template.innerHTML = `
  
  <!-- Preload non-critical CSS -->
  <link rel="preload" as="style" href="./css/index.css">
  <link rel="preload" as="style" href="css/components/settings.css">
    <link rel="stylesheet" href="./css/index.css">
  <link rel="stylesheet"  href="css/components/settings.css">

  <button class="secondary" id="openBtn" aria-label="Open Settings">
    <div class="icon md">tune</div>Theme Settings
  </button>
  
  <dialog id="dialog">
    <form id="themeSelect">
      <header>
        <h2 class="heading md" id="dialog-title">Theme Settings</h2>
        <button class="icon-button" value="cancel" formmethod="dialog">close</button>
      </header>
      <div class="content">
        <label id="colorMode">
          Color Mode
          <fieldset class="radio-buttons" autofocus>
            <label class="radio-button">
              <input type="radio" name="theme" value="" checked aria-label="Auto Theme">
              <span class="icon md">routine</span>
              <span>System</span>
            </label>
            <label class="radio-button">
              <input type="radio" name="theme" value="light" aria-label="Light Theme">
              <span class="icon md">light_mode</span>
              <span>Light</span>
            </label>
            <label class="radio-button" style="border:transparent">
              <input type="radio" name="theme" value="dark" aria-label="Dark Theme">
              <span class="icon md">dark_mode</span>
              <span>Dark</span>
            </label>
          </fieldset>
        </label>
        <theme-slider></theme-slider>
        <label for="highContrast" style="width: fit-content;">High Contrast
          <input type="checkbox" switch role="switch" id="highContrast" name="highContrast" aria-label="High Contrast Mode">
        </label>
      </div>
      <footer>
        <button type="button" id="cancelBtn" aria-label="Cancel Settings">Cancel</button>
        <button type="button" variant="brand" id="closeBtn" aria-label="Save Settings">Save</button>
      </footer>
    </form>
  </dialog>
`;

class SiteSettings extends HTMLElement {
  constructor() {
    super();
    // Attach shadow DOM and clone the template
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Cache frequently accessed elements
    this.dialog = this.shadowRoot.getElementById("dialog");
    this.themeSelectForm = this.shadowRoot.getElementById("themeSelect");
    this.highContrastCheckbox = this.shadowRoot.getElementById("highContrast");
    this.themeSlider = this.shadowRoot.querySelector("theme-slider");

    this.originalSettings = {};

    // Bind methods to ensure proper 'this' context
    this.openSettings = this.openSettings.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.cancelChanges = this.cancelChanges.bind(this);
    this.hueChangeHandler = this.hueChangeHandler.bind(this);
    this.themeChangeHandler = this.themeChangeHandler.bind(this);
    this.highContrastChangeHandler = this.highContrastChangeHandler.bind(this);
    this.backdropClickHandler = this.backdropClickHandler.bind(this);

    // Create a debounced version of the hueChangeHandler (100ms delay)
    this.debouncedHueChangeHandler = this.debounce(this.hueChangeHandler, 100);
  }

  // Utility: Debounce function to limit rapid event firing
  debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  connectedCallback() {
    this.applyStoredSettings();

    // Add event listeners
    this.shadowRoot.getElementById("openBtn").addEventListener("click", this.openSettings);
    this.shadowRoot.getElementById("closeBtn").addEventListener("click", this.saveChanges);
    this.shadowRoot.getElementById("cancelBtn").addEventListener("click", this.cancelChanges);

    this.themeSlider.addEventListener("hueChange", this.debouncedHueChangeHandler);
    this.themeSelectForm.addEventListener("change", this.themeChangeHandler);
    this.highContrastCheckbox.addEventListener("change", this.highContrastChangeHandler);

    this.dialog.addEventListener('click', this.backdropClickHandler);
  }

  disconnectedCallback() {
    // Remove event listeners
    this.shadowRoot.getElementById("openBtn").removeEventListener("click", this.openSettings);
    this.shadowRoot.getElementById("closeBtn").removeEventListener("click", this.saveChanges);
    this.shadowRoot.getElementById("cancelBtn").removeEventListener("click", this.cancelChanges);

    this.themeSlider.removeEventListener("hueChange", this.debouncedHueChangeHandler);
    this.themeSelectForm.removeEventListener("change", this.themeChangeHandler);
    this.highContrastCheckbox.removeEventListener("change", this.highContrastChangeHandler);

    this.dialog.removeEventListener('click', this.backdropClickHandler);
  }

  // Cache the original settings in one go
  storeOriginalSettings() {
    this.originalSettings = {
      theme: localStorage.getItem("myCustomTheme") || "",
      hue: this.themeSlider.getHue(),
      highContrast: localStorage.getItem("highContrast") === "true"
    };
  }

  applyStoredSettings() {
    const storedTheme = localStorage.getItem("myCustomTheme") || "";
    const highContrastEnabled = localStorage.getItem("highContrast") === "true";

    if (storedTheme) {
      this.updateTheme(storedTheme);
      const themeRadio = this.shadowRoot.querySelector(`input[name="theme"][value="${storedTheme}"]`);
      if (themeRadio) {
        themeRadio.checked = true;
      }
    }

    this.highContrastCheckbox.checked = highContrastEnabled;
    this.toggleHighContrast(highContrastEnabled);
  }

  updateTheme(theme) {
    const colorScheme = theme === "light"
      ? "light"
      : theme === "dark"
        ? "dark"
        : "light dark";
    // Batch style updates to avoid multiple reflows
    document.documentElement.style.setProperty("--current-color-scheme", colorScheme);
    window.dispatchEvent(new CustomEvent('globalSchemeChange', { detail: theme }));
  }

  toggleHighContrast(enabled) {
    document.documentElement.dataset.mode = enabled ? "high-contrast" : "normal";
    localStorage.setItem("highContrast", enabled.toString());
    window.dispatchEvent(new CustomEvent('globalHighContrastChange', { detail: enabled }));
  }

  // Event Handlers
  openSettings() {
    this.storeOriginalSettings();
    this.applyStoredSettings();
    this.dialog.showModal();
  }

  hueChangeHandler(event) {
    const hueValue = event.detail;
    localStorage.setItem("selectedColorHue", hueValue);
    window.dispatchEvent(new CustomEvent('globalHueChange', { detail: hueValue }));
  }

  themeChangeHandler(event) {
    if (event.target.name === "theme") {
      this.updateTheme(event.target.value);
    }
  }

  highContrastChangeHandler() {
    const highContrastEnabled = this.highContrastCheckbox.checked;
    this.toggleHighContrast(highContrastEnabled);
  }

  saveChanges() {
    try {
      const selectedTheme = this.themeSelectForm.querySelector('input[name="theme"]:checked').value;
      const highContrastEnabled = this.highContrastCheckbox.checked;

      // Batch localStorage writes
      localStorage.setItem("myCustomTheme", selectedTheme);
      localStorage.setItem("highContrast", highContrastEnabled.toString());

      this.dialog.close();
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }

  cancelChanges() {
    // Revert all changes in a single batch update
    this.themeSlider.setHue(this.originalSettings.hue);
    this.updateTheme(this.originalSettings.theme);
    this.highContrastCheckbox.checked = this.originalSettings.highContrast;
    this.toggleHighContrast(this.originalSettings.highContrast);
    this.dialog.close();
  }

  // Closes settings if clicking the backdrop
  backdropClickHandler(event) {
    if (event.target === this.dialog) {
      this.cancelChanges();
    }
  }
}

customElements.define("site-settings", SiteSettings);