customElements.define(
  "theme-slider",
  class extends HTMLElement {
    constructor() {
      super();

      // Attach a shadow DOM to the element
      const shadowRoot = this.attachShadow({ mode: "open" });

      // Check if the 'data-hide-label' attribute is present
      const hideLabel = this.hasAttribute('data-hide-label');

      // Template with conditional label text visibility
      shadowRoot.innerHTML = `
        <link href="css/style.css" rel="stylesheet"  />
        <link href="components/ThemeSlider/theme-slider.css" rel="stylesheet" />
          
        <label for="hueSlider">
          ${!hideLabel ? 'Theme Color:' : ''}
          <input type="range" class="theme" id="hueSlider" name="hue" min="0" max="360" step="2"
            aria-label="Theme Color Hue Slider">
        </label>
      `;

      // Reference to the slider element
      this.hueSlider = shadowRoot.getElementById("hueSlider");

      // Play sound on initial click (omitted actual playSound method here)
      this.hueSlider.addEventListener("mousedown", () => {
        this.playSound();
      });

      // Handle slider input changes
      this.hueSlider.addEventListener("input", () => {
        const newHue = this.hueSlider.value;
        this.updateHue(newHue);
        this.saveHue(newHue);
        this.dispatchEvent(new CustomEvent('hueChange', { detail: newHue }));
        window.dispatchEvent(new CustomEvent('globalHueChange', { detail: newHue }));
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
      const storedHue = localStorage.getItem("selectedColorHue") || "200";
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

        if (event.key === 'myCustomTheme') {
          // Sync color scheme changes
          const newScheme = event.newValue || 'light';
          document.documentElement.style.setProperty('--current-color-scheme', newScheme);
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