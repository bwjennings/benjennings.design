// Define and cache the template
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: var(--text-body-font-family);
    }
    
    .settings-container {
      position: relative;
      width: 100%;
      height: auto;
      background: var(--color-background-page);
      border-radius: 24px;
      padding: 8px;
      box-sizing: border-box;
    }
    
    .settings-content {
      display: flex;
      flex-direction: row;
      gap: 8px;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
    }
    
    .hue-slider-container {
      flex: 1;
      display: flex;
    }
    
    .hue-slider {
      -webkit-appearance: none;
      appearance: none;
      cursor: grab;
      width: 100%;
      height: 32px;
      border-radius: 20px;
      border: none;
      outline: none;
      background: linear-gradient(to right,
        hsl(0, 100%, 50%),
        hsl(60, 100%, 50%),
        hsl(120, 100%, 50%),
        hsl(180, 100%, 50%),
        hsl(240, 100%, 50%),
        hsl(300, 100%, 50%),
        hsl(360, 100%, 50%));
    }
    
    .hue-slider:active {
      cursor: grabbing;
    }
    
    .hue-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);
      border: 4px solid #ffffff;
      cursor: pointer;
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);
      transition: transform 0.15s ease;
    }
    
    .hue-slider:hover::-webkit-slider-thumb {
      transform: scale(1.1);
    }
    
    .hue-slider::-moz-range-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);
      border: 4px solid #ffffff;
      cursor: pointer;
      box-shadow: none;
      transition: transform 0.15s ease;
    }
    
    .hue-slider:hover::-moz-range-thumb {
      transform: scale(1.1);
    }
    
    .hue-slider::-moz-range-track {
      height: 32px;
      border-radius: 20px;
      border: none;
      background: linear-gradient(to right,
        hsl(0, 100%, 50%),
        hsl(60, 100%, 50%),
        hsl(120, 100%, 50%),
        hsl(180, 100%, 50%),
        hsl(240, 100%, 50%),
        hsl(300, 100%, 50%),
        hsl(360, 100%, 50%));
    }
    
    .theme-buttons {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: flex-start;
    }
    
    .theme-button {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      background: var(--color-background-primary);
    }
    
    .theme-button.active {
      background: var(--color-background-base-emphasis);
    }
    
    .theme-button .icon {
      font-family: 'Material Symbols Sharp', sans-serif;
      font-size: 20px;
      line-height: 1;
      font-weight: 400;
      color: var(--color-icon-secondary);
    }
    
    .theme-button.active .icon {
      color: var(--color-icon-onEmphasis);
    }
  </style>
  
  <div class="settings-container">
    <div class="settings-content">
      <div class="hue-slider-container">
        <input type="range" class="hue-slider" id="hue-slider" min="0" max="360" step="1" aria-label="Theme Color Hue">
      </div>
      
      <div class="theme-buttons">
        <button class="theme-button active" data-theme="light">
          <span class="icon">light_mode</span>
        </button>
        <button class="theme-button" data-theme="dark">
          <span class="icon">dark_mode</span>
        </button>
      </div>
    </div>
  </div>
`;

class SiteSettings extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.themeChangeHandler = this.themeChangeHandler.bind(this);
    this.hueSliderHandler = this.hueSliderHandler.bind(this);
    this.debouncedHueSliderHandler = this.debounce(this.hueSliderHandler, 5);
    this.throttledUpdateHue = this.throttle(this.updateHue.bind(this), 16); // ~60fps
  }

  // Utility: Debounce function to reduce rapid-fire events
  debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Throttle function for CSS updates to prevent layout thrashing
  throttle(func, delay) {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return func.apply(this, args);
      }
    };
  }

  // Batched CSS update utility
  batchCssUpdates(updates) {
    // Use requestAnimationFrame for optimal timing
    requestAnimationFrame(() => {
      updates.forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });
    });
  }

  connectedCallback() {
    // Initialize theme buttons
    const themeButtons = this.shadowRoot.querySelectorAll('[data-theme]');
    const hueSlider = this.shadowRoot.querySelector('.hue-slider');
    
    // Add event listeners with keyboard support
    themeButtons.forEach(button => {
      if (button) {
        button.addEventListener('click', this.themeChangeHandler);
        button.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.themeChangeHandler(e);
          }
        });
        // Make focusable
        button.setAttribute('tabindex', '0');
        button.setAttribute('role', 'button');
        button.setAttribute('aria-pressed', button.classList.contains('active'));
      }
    });
    
    
    if (hueSlider) {
      hueSlider.addEventListener('input', this.hueSliderHandler);
      hueSlider.addEventListener('change', this.hueSliderHandler);
    }
    
    // Load stored theme
    const storedTheme = localStorage.getItem("myCustomTheme");
    if (storedTheme !== null) {
      this.setActiveTheme(storedTheme);
      this.updateTheme(storedTheme);
    }
    
    // Initialize hue from storage
    const storedHue = localStorage.getItem('brandHue');
    const parsedHue = storedHue ? parseInt(storedHue, 10) : null;
    const defaultHue = (!isNaN(parsedHue) && parsedHue >= 0 && parsedHue <= 360) ? parsedHue : 230;
    
    if (hueSlider) {
      hueSlider.value = defaultHue;
    }
    
    this.updateHue(defaultHue);
    localStorage.setItem('brandHue', defaultHue);
    
    // Apply persisted radius if available
    const storedRadius = localStorage.getItem('baseRadius');
    if (storedRadius) {
      document.documentElement.style.setProperty('--base-radius', storedRadius + 'px');
    }
  }

  setActiveTheme(theme) {
    const themeButtons = this.shadowRoot.querySelectorAll('[data-theme]');
    themeButtons.forEach(button => {
      if (button) {
        const isActive = button.dataset.theme === theme;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', isActive);
      }
    });
  }

  updateTheme(theme) {
    const colorScheme = theme === "light"
      ? "light"
      : theme === "dark"
        ? "dark"
        : "light dark";
    
    // Persist the chosen theme so it can be restored on other pages
    localStorage.setItem("myCustomTheme", theme);

    // Batch style updates to avoid multiple reflows
    document.documentElement.style.setProperty("--current-color-scheme", colorScheme);
    window.dispatchEvent(new CustomEvent('globalSchemeChange', { detail: theme }));
  }

  themeChangeHandler(event) {
    const theme = event.currentTarget.dataset.theme;
    if (theme) {
      this.setActiveTheme(theme);
      this.updateTheme(theme);
    }
  }


  hueSliderHandler(event) {
    const hue = parseInt(event.target.value, 10);
    if (!isNaN(hue) && hue >= 0 && hue <= 360) {
      // Use throttled update for smooth performance
      this.throttledUpdateHue(hue);
      
      // Update cache immediately for consistency
      if (window.themeCache) {
        window.themeCache.values.colorHue = hue.toString();
      }
      
      // Debounce localStorage and event dispatch to avoid excessive writes
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(() => {
        localStorage.setItem('brandHue', hue);
        window.dispatchEvent(new CustomEvent('globalHueChange', { detail: hue }));
      }, 100);
    }
  }

  updateHue(hue) {
    if (!isNaN(hue) && hue >= 0 && hue <= 360) {
      document.documentElement.style.setProperty('--color1-hue', `${hue}deg`);
    }
  }

  disconnectedCallback() {
    // Clean up event listeners to prevent memory leaks
    const themeButtons = this.shadowRoot.querySelectorAll('[data-theme]');
    const hueSlider = this.shadowRoot.querySelector('.hue-slider');
    
    themeButtons.forEach(button => {
      if (button) {
        button.removeEventListener('click', this.themeChangeHandler);
      }
    });
    
    if (hueSlider) {
      hueSlider.removeEventListener('input', this.hueSliderHandler);
      hueSlider.removeEventListener('change', this.hueSliderHandler);
    }
    
    // Clean up any global event listeners if they exist
    // (These would be added if we had global theme sync)
  }
}

customElements.define("site-settings", SiteSettings);