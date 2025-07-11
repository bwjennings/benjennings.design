// Define and cache the template for the component
const themeSliderTemplate = document.createElement('template');
themeSliderTemplate.innerHTML = `
  <link href="css/components/slider.css" rel="stylesheet">
  <label for="hueSlider">
    <span class="label-text"></span>
    <input type="range" class="theme" id="hueSlider" name="hue" min="0" max="360" step="2"
      aria-label="Theme Color Hue Slider">
  </label>
`;

customElements.define(
  "theme-slider",
  class ThemeSlider extends HTMLElement {
    constructor() {
      super();

      // Attach shadow DOM and clone template
      this.attachShadow({ mode: "open" });
      const templateContent = themeSliderTemplate.content.cloneNode(true);
      this.shadowRoot.appendChild(templateContent);

      // Conditionally set label text based on the data-hide-label attribute
      const labelTextEl = this.shadowRoot.querySelector(".label-text");
      if (!this.hasAttribute("data-hide-label") && labelTextEl) {
        labelTextEl.textContent = "Theme Color:";
      }

      // Reference the slider element
      this.hueSlider = this.shadowRoot.getElementById("hueSlider");

      // Bind event handlers so they can be properly removed later
      this.handleInput = this.handleInput.bind(this);
      this.handleGlobalHueChange = this.handleGlobalHueChange.bind(this);
      this.handleStorageChange = this.handleStorageChange.bind(this);

      // Create a debounced function to process slider input 
      this.debouncedProcessInput = this.debounce(this.processInput.bind(this), 5);
    }

    // Utility: Debounce function to reduce rapid-fire events
    debounce(func, delay) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }

    connectedCallback() {
      if (!this.hueSlider) {
        console.error("Hue slider element not found in shadow DOM");
        return;
      }

      const storedHue = localStorage.getItem("brandHue");
      if (storedHue !== null) {
        this.hueSlider.value = storedHue;
        this.updateHue(storedHue);
      } else {
        this.hueSlider.value = "230";
      }

      // Add event listener for slider input using the debounced handler
      this.hueSlider.addEventListener("input", this.handleInput);

      // Listen for global hue changes
      window.addEventListener("globalHueChange", this.handleGlobalHueChange);

      // Listen for storage events from other tabs/windows
      window.addEventListener("storage", this.handleStorageChange);
    }

    disconnectedCallback() {
      // Remove event listeners to prevent memory leaks
      if (this.hueSlider) {
        this.hueSlider.removeEventListener("input", this.handleInput);
      }
      window.removeEventListener("globalHueChange", this.handleGlobalHueChange);
      window.removeEventListener("storage", this.handleStorageChange);
    }

    // Called on slider input; defers processing to the debounced function
    handleInput() {
      this.debouncedProcessInput();
    }

    // Processes the slider input: updates hue, saves value, and dispatches events
    processInput() {
      if (!this.hueSlider) return;
      
      const newHue = this.hueSlider.value;
      this.updateHue(newHue);
      this.saveHue(newHue);
      this.dispatchEvent(new CustomEvent("hueChange", { detail: newHue }));
      window.dispatchEvent(new CustomEvent("globalHueChange", { detail: newHue }));
    }

    // Updates the slider value if a global hue change event occurs
    handleGlobalHueChange(event) {
      if (this.hueSlider && event.detail !== this.hueSlider.value) {
        this.hueSlider.value = event.detail;
        this.updateHue(event.detail);
      }
    }

    // Syncs the slider when localStorage changes (e.g., from another tab)
    handleStorageChange(event) {
      if (event.key === "brandHue" && this.hueSlider) {
        const newHue = event.newValue;
        if (newHue && newHue !== this.hueSlider.value) {
          this.hueSlider.value = newHue;
          this.updateHue(newHue);
        }
      } else if (event.key === "myCustomTheme") {
        // Sync the global color scheme if needed
        const newScheme = event.newValue || "light";
        document.documentElement.style.setProperty("--current-color-scheme", newScheme);
      }
    }

    // Update the CSS variable for the hue
    updateHue(hue) {
      document.documentElement.style.setProperty("--color1-hue", hue + "deg");
    }

    // Save the hue value to localStorage
    saveHue(hue) {
      localStorage.setItem("brandHue", hue);
    }

    // Returns the current hue value
    getHue() {
      return this.hueSlider ? this.hueSlider.value : null;
    }

    // Sets the hue value programmatically
    setHue(hue) {
      if (this.hueSlider) {
        this.hueSlider.value = hue;
        this.updateHue(hue);
      }
    }
  }
);