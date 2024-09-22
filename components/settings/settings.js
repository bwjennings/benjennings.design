// Define the custom element for Site Settings
class SiteSettings extends HTMLElement {
    constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
        <style>
         
        
          .icon {
            font-family: var(--icon-font-family);
          }
        </style>
        <link href="components/settings/settings.css" rel="stylesheet" />
          <link href="./css/style.css" rel="stylesheet"  rel="stylesheet" />

       
          <button id="openBtn" aria-label="Open Settings">
            <div class="icon">tune</div>Settings
          </button>
        
        <dialog id="dialog">
          <form id="themeSelect">
            <header>
              <h2 class="heading md" id="dialog-title">Settings</h2>
              <button class="icon-button" value="cancel" formmethod="dialog">Close</button>
            </header>
            <div class="content">
              <label id="colorMode">
                Color Mode
                <fieldset class="radio-buttons" autofocus=true>
                  <label class="radio-button">
                    <input type="radio" name="theme" value="" checked aria-label="Auto Theme">
                    <span class="icon">routine</span>
                    <span>System</span>
                  </label>
                  <label class="radio-button">
                    <input type="radio" name="theme" value="light" aria-label="Light Theme">
                    <span class="icon">light_mode</span>
                    <span>Light</span>
                  </label>
                  <label class="radio-button" style="border:transparent">
                    <input type="radio" name="theme" value="dark" aria-label="Dark Theme">
                    <span class="icon">dark_mode</span>
                    <span>Dark</span>
                  </label>
                </fieldset>
              </label>
              <theme-slider></theme-slider>
              <label for="highContrast" style="width: fit-content;">High Contrast
                <input type="checkbox" role="switch" id="highContrast" name="highContrast" aria-label="High Contrast Mode">
              </label>
            </div>
            <footer>
              <button type="button" id="cancelBtn" aria-label="Cancel Settings">Cancel</button>
              <button type="button" variant="brand" id="closeBtn" aria-label="Save Settings">Save</button>
            </footer>
          </form>
        </dialog>
      `;

      this.dialog = shadowRoot.getElementById("dialog");
      this.themeSelectForm = shadowRoot.getElementById("themeSelect");
      this.highContrastCheckbox = shadowRoot.getElementById("highContrast");
      this.themeSlider = shadowRoot.querySelector("theme-slider");

      this.originalSettings = {};

      // Bind methods to ensure proper 'this' context
      this.openSettings = this.openSettings.bind(this);
      this.saveChanges = this.saveChanges.bind(this);
      this.cancelChanges = this.cancelChanges.bind(this);
      this.hueChangeHandler = this.hueChangeHandler.bind(this);
      this.themeChangeHandler = this.themeChangeHandler.bind(this);
      this.highContrastChangeHandler = this.highContrastChangeHandler.bind(this);
      this.backdropClickHandler = this.backdropClickHandler.bind(this); // Added line
    }

    connectedCallback() {
      this.applyStoredSettings();

      // Add event listeners
      this.shadowRoot.getElementById("openBtn").addEventListener("click", this.openSettings);
      this.shadowRoot.getElementById("closeBtn").addEventListener("click", this.saveChanges);
      this.shadowRoot.getElementById("cancelBtn").addEventListener("click", this.cancelChanges);

      this.themeSlider.addEventListener("hueChange", this.hueChangeHandler);
      this.themeSelectForm.addEventListener("change", this.themeChangeHandler);
      this.highContrastCheckbox.addEventListener("change", this.highContrastChangeHandler);

      this.dialog.addEventListener('click', this.backdropClickHandler); // Added line
    }

    disconnectedCallback() {
      // Remove event listeners
      this.shadowRoot.getElementById("openBtn").removeEventListener("click", this.openSettings);
      this.shadowRoot.getElementById("closeBtn").removeEventListener("click", this.saveChanges);
      this.shadowRoot.getElementById("cancelBtn").removeEventListener("click", this.cancelChanges);

      this.themeSlider.removeEventListener("hueChange", this.hueChangeHandler);
      this.themeSelectForm.removeEventListener("change", this.themeChangeHandler);
      this.highContrastCheckbox.removeEventListener("change", this.highContrastChangeHandler);

      this.dialog.removeEventListener('click', this.backdropClickHandler); // Added line
    }

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
      const colorScheme = theme === "light" ? "light" : theme === "dark" ? "dark" : "light dark";
      document.documentElement.style.setProperty("color-scheme", colorScheme);
    }

    toggleHighContrast(enabled) {
      document.documentElement.dataset.mode = enabled ? "high-contrast" : "normal";
    }


    // Event handler methods
    openSettings() {
      this.storeOriginalSettings();
      this.applyStoredSettings();
      this.dialog.showModal();
      gtag('event', 'open_dialog', {
        'event_category': 'Settings',
        'event_label': 'Open Settings Dialog'
      });
    }

 

    hueChangeHandler(event) {
      localStorage.setItem("selectedColorHue", event.detail);
    }

    themeChangeHandler(event) {
      if (event.target.name === "theme") {
        this.updateTheme(event.target.value);
        gtag('event', 'change_theme', {
          'event_category': 'Settings',
          'event_label': 'Change Theme',
          'value': event.target.value
        });
      }
    }

    highContrastChangeHandler() {
      this.toggleHighContrast(this.highContrastCheckbox.checked);
    }

    saveChanges() {
      try {
        const selectedTheme = this.themeSelectForm.querySelector('input[name="theme"]:checked').value;
        const highContrastEnabled = this.highContrastCheckbox.checked;

        localStorage.setItem("myCustomTheme", selectedTheme);
        localStorage.setItem("highContrast", highContrastEnabled.toString());

        this.dialog.close();
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    }

    cancelChanges() {
      this.themeSlider.setHue(this.originalSettings.hue);
      this.updateTheme(this.originalSettings.theme);
      this.highContrastCheckbox.checked = this.originalSettings.highContrast;
      this.toggleHighContrast(this.originalSettings.highContrast);
      this.dialog.close();
    }

    // Added method to handle backdrop clicks
    backdropClickHandler(event) {
      if (event.target === this.dialog) {
        this.cancelChanges();
      }
    }
  }
  customElements.define("site-settings", SiteSettings);;