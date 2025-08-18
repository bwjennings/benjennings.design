// Template
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: var(--text-body-font-family);
    }
    
    .color-picker {
      background: var(--color-surface-2);
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      gap: 8px;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 8px;
      position: relative;
      border-radius: 32px;
      width: 100%;
    }
    
    .color-picker::before {
      content: '';
      position: absolute;
      border: 1px solid var(--color-border-secondary);
      inset: 0;
      pointer-events: none;
      border-radius: 32px;
    }
    
    .hue-slider {
      -webkit-appearance: none;
      appearance: none;
      cursor: grab;
      width: 100%;
      height: 100%;
      border-radius: 24px;
      border: none;
      outline: none;
      background: none;
      box-sizing: border-box;
      flex: 1;
      align-self: stretch;
      min-width: 1px;
    }
    
    .hue-slider:active {
      cursor: grabbing;
    }
    
    .thumb {
      aspect-ratio: 1;
      background: rgba(0, 0, 0, 0.4);
      height: 31px;
      position: relative;
      border-radius: 99px;
      flex-shrink: 0;
    }
    
   
    
    /* WebKit track */
    .hue-slider::-webkit-slider-runnable-track {
      height: 100%;
      border-radius: 24px;
      background: linear-gradient(to right in oklch longer hue,
        oklch(60% 0.2 0),
        oklch(60% 0.2 360));
      box-shadow: inset 0 0 0 4px #fbf5ee;
      border: none;
    }

    .hue-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 39px;
      height: 39px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);
      border: 4px solid #ffffff;
      cursor: pointer;
      transition: transform 0.15s var(--transition-timing-motion);
    }
    
    .hue-slider:hover::-webkit-slider-thumb {
      transform: scale(1.1);
    }
    
    .hue-slider::-moz-range-thumb {
      width: 39px;
      height: 39px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);
      border: 4px solid #ffffff;
      cursor: pointer;
      box-shadow: none;
      transition: transform 0.15s var(--transition-timing-motion);
    }
    
    .hue-slider:hover::-moz-range-thumb {
      transform: scale(1.1);
    }
    
    .hue-slider::-moz-range-track {
      height: 100%;
      border-radius: 24px;
      border: none;
      background: linear-gradient(to right,
        hsl(0, 100%, 50%),
        hsl(60, 100%, 50%),
        hsl(120, 100%, 50%),
        hsl(180, 100%, 50%),
        hsl(240, 100%, 50%),
        hsl(300, 100%, 50%),
        hsl(360, 100%, 50%));
      box-shadow: inset 0 0 0 4px #fbf5ee;
    }
    
    .segmented-button-group {
      position: relative;
      border-radius: 24px;
      background: var(--color-surface-3);
      flex-shrink: 0;
      align-self: stretch;
    }
    
    .segmented-button-group::before {
      content: '';
      position: absolute;
      border: 1px solid var(--color-border-primary);
      inset: 0;
      pointer-events: none;
      border-radius: 24px;
    }
    
    .segmented-buttons {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      gap: 4px;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 4px;
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    .segmented-button {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 8px;
      position: relative;
      border-radius: 32px;
      width: 39px;
      height: 39px;
      flex-shrink: 0;
      border: none;
      cursor: pointer;
      background: none;
    }
    
    .segmented-button.active {
      background: var(--color-fill-a);
    }
    
    .segmented-button .icon {
      font-family: 'Material Symbols Sharp', sans-serif;
      line-height: 0;
      position: relative;
      flex-shrink: 0;
      font-size: 22.66px;
      color: var(--color-icon-secondary);
      text-align: left;
      white-space: nowrap;
    }
    
    .segmented-button.active .icon {
      color: rgba(255, 255, 255, 0.8);
    }
  </style>
  
  <div class="color-picker">
    <input type="range" class="hue-slider" id="hue-slider" min="0" max="360" step="1" aria-label="Theme Color Hue">
    
    <div class="segmented-button-group">
      <div class="segmented-buttons">
        <button class="segmented-button active" data-theme="light">
          <div class="icon">light_mode</div>
        </button>
        <button class="segmented-button" data-theme="dark">
          <div class="icon">dark_mode</div>
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

  // Debounce
  debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Throttle
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

  // Batch CSS updates
  batchCssUpdates(updates) {
    // rAF timing
    requestAnimationFrame(() => {
      updates.forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });
    });
  }

  connectedCallback() {
    // Init controls
    const themeButtons = this.shadowRoot.querySelectorAll('[data-theme]');
    const hueSlider = this.shadowRoot.querySelector('.hue-slider');
    
    // Bind events
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
    
    // Persist theme
    localStorage.setItem("myCustomTheme", theme);

    // Apply styles
    document.documentElement.style.setProperty("--current-color-scheme", colorScheme);
    window.dispatchEvent(new CustomEvent('globalSchemeChange', { detail: theme }));
  }

  themeChangeHandler(event) {
    const theme = event.currentTarget.dataset.theme;
    if (!theme) return;

    // Animate if supported
    const supportsVT = typeof document.startViewTransition === 'function';
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Apply fallback
    const apply = () => {
      this.setActiveTheme(theme);
      this.updateTheme(theme);
    };

    if (!supportsVT || prefersReduced) {
      apply();
      return;
    }

    // Add class
    document.documentElement.classList.add('theme-transition');
    try {
      const transition = document.startViewTransition(() => {
        apply();
      });
      // Cleanup class
      transition.finished.finally(() => {
        document.documentElement.classList.remove('theme-transition');
      });
    } catch (e) {
      document.documentElement.classList.remove('theme-transition');
      apply();
    }
  }


  hueSliderHandler(event) {
    const hue = parseInt(event.target.value, 10);
    if (!isNaN(hue) && hue >= 0 && hue <= 360) {
      // Throttle updates
      this.throttledUpdateHue(hue);
      
      // Update cache
      if (window.themeCache) {
        window.themeCache.values.hue = hue.toString();
      }
      
      // Debounce storage + event
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(() => {
        localStorage.setItem('brandHue', hue);
        window.dispatchEvent(new CustomEvent('globalHueChange', { detail: hue }));
      }, 100);
    }
  }

  updateHue(hue) {
    if (!isNaN(hue) && hue >= 0 && hue <= 360) {
      document.documentElement.style.setProperty('--hue-root', `${hue}deg`);
    }
  }

  disconnectedCallback() {
    // Cleanup listeners
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
  }
}

customElements.define("site-settings", SiteSettings);
