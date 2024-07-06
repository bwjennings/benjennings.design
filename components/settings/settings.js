// Define the custom element
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
        <button id="openBtn" aria-label="Open Settings"><div class="icon">tune</div>Settings</button>
        <dialog id="dialog" role="dialog" aria-modal="true">
          <h2 class="dialog-header">Settings</h2>
          <form id="themeSelect">
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
            <label for="hueSlider">Theme Color:
              <input type="range" class="theme" id="hueSlider" name="hue" min="0" max="360" step="2" aria-label="Theme Color Hue Slider">
            </label>
            <label for="highContrast">High Contrast:
              <input type="checkbox" id="highContrast" name="highContrast" aria-label="High Contrast Mode">
            </label>
          </form>
          <footer>
            <button id="cancelBtn" aria-label="Cancel Settings">Cancel</button>
            <button variant="brand" id="closeBtn" aria-label="Save Settings">Save</button>
          </footer>
        </dialog>
      `;

      this.dialog = shadowRoot.getElementById("dialog");
      this.hueSlider = shadowRoot.getElementById("hueSlider");
      this.themeSelectForm = shadowRoot.getElementById("themeSelect");
      this.highContrastCheckbox = shadowRoot.getElementById("highContrast");

      shadowRoot.getElementById("openBtn").addEventListener("click", () => this.dialog.showModal());
      shadowRoot.getElementById("closeBtn").addEventListener("click", () => this.saveChanges());
      shadowRoot.getElementById("cancelBtn").addEventListener("click", () => this.cancelChanges());

      this.hueSlider.addEventListener("input", () => {
        this.updateHue(this.hueSlider.value);
      });
      this.themeSelectForm.addEventListener("change", event => {
        if (event.target.name === "theme") {
          this.updateTheme(event.target.value);
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
      this.shadowRoot.getElementById("closeBtn").removeEventListener("click", () => this.saveChanges());
      this.shadowRoot.getElementById("cancelBtn").removeEventListener("click", () => this.cancelChanges());
      this.hueSlider.removeEventListener("input", () => {
        this.updateHue(this.hueSlider.value);
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

    applyStoredSettings() {
      const storedTheme = localStorage.getItem("myCustomTheme") || "";
      const storedHue = localStorage.getItem("selectedColorHue") || "230"; // Default hue if not stored
      const highContrastEnabled = localStorage.getItem("highContrast") === "true";

      console.log("Stored theme:", storedTheme);
      console.log("Stored hue:", storedHue);
      console.log("High contrast enabled:", highContrastEnabled);

      if (storedTheme) {
        this.updateTheme(storedTheme);
        const themeRadio = this.shadowRoot.querySelector(`input[name="theme"][value="${storedTheme}"]`);
        if (themeRadio) {
          themeRadio.checked = true;
        }
      }

      this.hueSlider.value = storedHue;
      this.updateHue(storedHue);

      this.highContrastCheckbox.checked = highContrastEnabled;
      this.toggleHighContrast(highContrastEnabled);
    }

    updateTheme(theme) {
      const colorScheme = theme === "light" ? "light" : theme === "dark" ? "dark" : "light dark";
      document.documentElement.style.setProperty("color-scheme", colorScheme);
    }

    updateHue(hue) {
      document.documentElement.style.setProperty('--brand-hue', hue);
    }

    toggleHighContrast(enabled) {
      document.documentElement.dataset.mode = enabled ? "high-contrast" : "normal";
      console.log("High contrast mode set to:", document.documentElement.dataset.mode);
    }

    saveChanges() {
      try {
        const selectedTheme = this.themeSelectForm.querySelector('input[name="theme"]:checked').value;
        const selectedHue = this.hueSlider.value;
        const highContrastEnabled = this.highContrastCheckbox.checked;

        localStorage.setItem("myCustomTheme", selectedTheme);
        localStorage.setItem("selectedColorHue", selectedHue);
        localStorage.setItem("highContrast", highContrastEnabled.toString());

        this.dialog.close();
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    }

    cancelChanges() {
      this.dialog.close();
      this.applyStoredSettings(); // Reapply the initial settings when cancelling
    }
  }
);