// Define the custom element for Theme Slider
customElements.define(
  "theme-slider",
  class extends HTMLElement {
    constructor() {
      super();

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

      this.hueSlider = shadowRoot.getElementById("hueSlider");

      this.hueSlider.addEventListener("input", () => {
        this.updateHue(this.hueSlider.value);
        this.saveHue(this.hueSlider.value);
        this.dispatchEvent(new CustomEvent('hueChange', { detail: this.hueSlider.value }));
        window.dispatchEvent(new CustomEvent('globalHueChange', { detail: this.hueSlider.value }));
      });

      window.addEventListener('globalHueChange', (event) => {
        if (event.detail !== this.hueSlider.value) {
          this.hueSlider.value = event.detail;
          this.updateHue(event.detail);
        }
      });
    }

    connectedCallback() {
      const storedHue = localStorage.getItem("selectedColorHue") || "230";
      this.hueSlider.value = storedHue;
      this.updateHue(storedHue);
    }

    updateHue(hue) {
      document.documentElement.style.setProperty('--brand-hue', hue);
    }

    saveHue(hue) {
      localStorage.setItem("selectedColorHue", hue);
    }

    getHue() {
      return this.hueSlider.value;
    }

    setHue(hue) {
      this.hueSlider.value = hue;
      this.updateHue(hue);
    }
  }
);