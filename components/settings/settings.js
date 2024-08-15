// Define the custom element for Site Settings
customElements.define(
  "site-settings",
  class extends HTMLElement {
    constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
        <style>
          @import "style.css";
          @import "components/settings/settings.css";
        
          .icon {
            font-family: var(--icon-font-family);
          }
        </style>
        <div class="button-group row">
          <button id="randomColorBtn" class="icon-button pallete-button" aria-label="Random Theme Color">palette</button>
          <button id="openBtn" aria-label="Open Settings">
            <div class="icon">tune</div>Settings
          </button>
        </div>
        <dialog id="dialog" role="dialog" aria-modal="true">
        <div class="container">
          <form id="themeSelect">
            <header>
              <h2 class="heading md" id="dialog-title">Settings</h2>
              <button class="icon-button" value="cancel" formmethod="dialog">Close</button>
            </header>
        
            <label id="colorMode">Color Mode
              <fieldset class="radio-buttons">
                <label class="radio-button">
                  <input type="radio" name="theme" value="light" aria-label="Light Theme">
                  <span class="icon">light_mode</span>
                  <span>Light</span>
                </label>
                <label class="radio-button">
                  <input type="radio" name="theme" value="" checked aria-label="Auto Theme">
                  <span class="icon">routine</span>
                  <span>Auto</span>
                </label>
                <label class="radio-button">
                  <input type="radio" name="theme" value="dark" aria-label="Dark Theme">
                  <span class="icon">dark_mode</span>
                  <span>Dark</span>
                </label>
              </fieldset>
            </label>

            <theme-slider></theme-slider>
        
            <label for="highContrast">High Contrast
              <input type="checkbox" role="switch" id="highContrast" name="highContrast" aria-label="High Contrast Mode">
            </label>
        
            <footer>
              <button type="button" id="cancelBtn" aria-label="Cancel Settings">Cancel</button>
              <button type="button" variant="brand" id="closeBtn" aria-label="Save Settings">Save</button>
            </footer>
          </form>
          </div>
        </dialog>
      `;

      this.dialog = shadowRoot.getElementById("dialog");
      this.themeSelectForm = shadowRoot.getElementById("themeSelect");
      this.highContrastCheckbox = shadowRoot.getElementById("highContrast");
      this.themeSlider = shadowRoot.querySelector("theme-slider");

      this.originalSettings = {};

      shadowRoot.getElementById("openBtn").addEventListener("click", () => {
        this.storeOriginalSettings();
        this.applyStoredSettings();
        this.dialog.showModal();
        gtag('event', 'open_dialog', {
          'event_category': 'Settings',
          'event_label': 'Open Settings Dialog'
        });
      });

      shadowRoot.getElementById("randomColorBtn").addEventListener("click", () => {
        this.pickRandomColor();
        gtag('event', 'random_theme_color', {
          'event_category': 'Settings',
          'event_label': 'Random Theme Color'
        });
      });

      shadowRoot.getElementById("closeBtn").addEventListener("click", () => this.saveChanges());
      shadowRoot.getElementById("cancelBtn").addEventListener("click", () => this.cancelChanges());

      this.themeSlider.addEventListener("hueChange", (event) => {
        localStorage.setItem("selectedColorHue", event.detail);
      });

      this.themeSelectForm.addEventListener("change", event => {
        if (event.target.name === "theme") {
          this.updateTheme(event.target.value);
          gtag('event', 'change_theme', {
            'event_category': 'Settings',
            'event_label': 'Change Theme',
            'value': event.target.value
          });
        }
      });

      this.highContrastCheckbox.addEventListener("change", () => {
        this.toggleHighContrast(this.highContrastCheckbox.checked);
      });
    }

    connectedCallback() {
      this.applyStoredSettings();
    }

    disconnectedCallback() {
      this.shadowRoot.getElementById("openBtn").removeEventListener("click", () => this.dialog.showModal());
      this.shadowRoot.getElementById("randomColorBtn").removeEventListener("click", () => this.pickRandomColor());
      this.shadowRoot.getElementById("closeBtn").removeEventListener("click", () => this.saveChanges());
      this.shadowRoot.getElementById("cancelBtn").removeEventListener("click", () => this.cancelChanges());
      this.themeSlider.removeEventListener("hueChange", (event) => {
        localStorage.setItem("selectedColorHue", event.detail);
      });
      this.themeSelectForm.removeEventListener("change", event => {
        if (event.target.name === "theme") {
          this.updateTheme(event.target.value);
        }
      });
      this.highContrastCheckbox.removeEventListener("change", () => {
        this.toggleHighContrast(this.highContrastCheckbox.checked);
      });
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

    pickRandomColor() {
      const randomHue = Math.floor(Math.random() * 361);
      this.themeSlider.setHue(randomHue); // Update the slider value
      localStorage.setItem("selectedColorHue", randomHue);
      window.dispatchEvent(new CustomEvent('globalHueChange', { detail: randomHue })); // Ensure other components update
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
  }
);