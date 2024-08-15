// Define the custom element for Theme Slider
customElements.define(
  "theme-slider",
  class extends HTMLElement {
    constructor() {
      super();

      // Attach a shadow DOM to the element
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
        <style>
          @import "style.css";
          @import "components/ThemeSlider/theme-slider.css";
        </style>
        <label for="hueSlider">Theme Color:
          <input type="range" class="theme" id="hueSlider" name="hue" min="0" max="360" step="2"
            aria-label="Theme Color Hue Slider">
        </label>
      `;

      // Reference to the slider element
      this.hueSlider = shadowRoot.getElementById("hueSlider");

      // Handle slider input changes
      this.hueSlider.addEventListener("input", () => {
        this.updateHue(this.hueSlider.value);
        this.saveHue(this.hueSlider.value);
        this.dispatchEvent(new CustomEvent('hueChange', { detail: this.hueSlider.value }));
        window.dispatchEvent(new CustomEvent('globalHueChange', { detail: this.hueSlider.value }));
      });

      // Listen for global changes to the hue value
      window.addEventListener('globalHueChange', (event) => {
        if (event.detail !== this.hueSlider.value) {
          this.hueSlider.value = event.detail;
          this.updateHue(event.detail);
        }
      });
    }

    // Lifecycle method called when the element is added to the DOM
    connectedCallback() {
      const storedHue = localStorage.getItem("selectedColorHue") || "230";
      this.hueSlider.value = storedHue;
      this.updateHue(storedHue);

      // Listen for changes to localStorage in case of updates from other tabs/windows
      window.addEventListener('storage', (event) => {
        if (event.key === 'selectedColorHue') {
          const newHue = event.newValue;
          if (newHue !== this.hueSlider.value) {
            this.hueSlider.value = newHue;
            this.updateHue(newHue);
          }
        }
      });
    }

    // Update the CSS variable for the hue
    updateHue(hue) {
      document.documentElement.style.setProperty('--brand-hue', hue);
    }

    // Save the hue value to localStorage
    saveHue(hue) {
      localStorage.setItem("selectedColorHue", hue);
    }

    // Get the current hue value
    getHue() {
      return this.hueSlider.value;
    }

    // Set the hue value programmatically
    setHue(hue) {
      this.hueSlider.value = hue;
      this.updateHue(hue);
    }
  }
);