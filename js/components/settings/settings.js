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
      height: 100%;
      border: 1px solid var(--color-border-primary);
      border-radius: var(--radius-none);
      
    }
    
    .settings-content {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xxl);
      align-items: flex-start;
      justify-content: flex-start;
      padding: var(--spacing-xxl);
      box-sizing: border-box;
    }
    
    .color-picker {
      background: var(--color-background-primary);
      height: 40px;
      border-radius: 100px;
      width: 100%;
      display: flex;
      align-items: center;
      position: relative;
    }
    
    .color-picker-content {
      display: flex;
      gap: var(--spacing-xs);
      height: 40px;
      align-items: center;
      justify-content: flex-start;
      padding: var(--spacing-xs);
      width: 100%;
      box-sizing: border-box;
    }
    
    .color-item {
      flex: 1;
      height: 100%;
      min-height: 1px;
      min-width: 1px;
      border-radius: 100px;
      flex-shrink: 0;
    }
    
    .color-item:nth-child(1) { background: oklch(70% 35% 25deg); }
    .color-item:nth-child(2) { background: oklch(70% 35% 80deg); }
    .color-item:nth-child(3) { background: oklch(70% 35% 150deg); }
    .color-item:nth-child(4) { background: oklch(70% 35% 210deg); }
    .color-item:nth-child(5) { background: oklch(70% 35% 300deg); }
    
    .color-item.custom {
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24, #f0932b);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 0;
      box-sizing: border-box;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid var(--color-border-primary);
    }
    
    .color-item.custom.selected {
      outline: 2px solid var(--color-foreground-base);
    }
    
    .color-item.swatch {
      border: 2px solid var(--color-border-primary);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .color-item.swatch.selected {
      outline: 2px solid var(--color-foreground-base);
    }
    
    .color-item.custom .icon {
      font-family: var(--icon-font-family);
      font-size: var(--icon-size-md);
      line-height: 1;
      font-weight: var(--icon-weight-md);
      color: var(--color-foreground-secondary);
      white-space: nowrap;
    }
    
    .color-item.custom.selected .icon {
      color: var(--color-foreground-onEmphasis);
    }
    
    .color-slider {
      width: 100%;
      height: 32px;
      display: none;
      position: relative;
    }
    
    .color-slider.visible {
      display: block;
    }
    
    .hue-slider {
      width: 100%;
      height: 32px;
      -webkit-appearance: none;
      appearance: none;
      background: linear-gradient(to left in oklch longer hue, 
        oklch(70% 35% 0deg), 
        oklch(70% 35% 0deg));
      border-radius: 0;
      outline: none;
      border: none;
    }
    
    .hue-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: var(--spacing-xxl);
      height: var(--spacing-xxl);
      background: var(--color-background-base-emphasis);
      cursor: pointer;
      border: none;
      border-radius: var(--radius-none);
    }
    
    .hue-slider::-moz-range-thumb {
      width: var(--spacing-xxl);
      height: var(--spacing-xxl);
      background: var(--color-background-base-emphasis);
      cursor: pointer;
      border: none;
      border-radius: var(--radius-none);
    }
    
    .segmented-buttons {
      height: 40px;
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 1px solid var(--color-border-primary);
      border-radius: var(--radius-none);
    }
    
    .segmented-button {
      flex: 1;
      height: 100%;
      min-height: 1px;
      min-width: 1px;
      position: relative;
      flex-shrink: 0;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: all 0.2s ease;
    }
    
    .segmented-button:not(:last-child) {
      border-right: 1px solid var(--color-border-primary);
    }
    
    .segmented-button.active {
      background: var(--color-background-base);
    }
    
    .segmented-button-content {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
      justify-content: center;
      padding: var(--spacing-sm) var(--spacing-lg);
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      line-height: 1;
      font-weight: var(--text-body-weight);
      font-size: var(--text-body-md-size);
      text-align: left;
      white-space: nowrap;
    }
    
    .segmented-button .icon {
      font-family: var(--icon-font-family);
      font-size: var(--icon-size-lg);
      line-height: 1;
      font-weight: var(--icon-weight-md);
      flex-shrink: 0;
    }
    
    .segmented-button .text {
      font-family: var(--text-body-font-family);
      font-size: var(--text-body-md-size);
      line-height: var(--text-body-md-line-height);
      font-weight: var(--text-body-weight);
      flex-shrink: 0;
    }
    
    .segmented-button:not(.active) .icon,
    .segmented-button:not(.active) .text {
      color: var(--color-foreground-primary);
    }
    
    .segmented-button.active .icon,
    .segmented-button.active .text {
      color: var(--color-foreground-base);
    }
  </style>
  
  <div class="settings-container">
    <div class="settings-content">
      <div class="color-slider" data-color-slider>
        <input type="range" class="hue-slider" min="0" max="360" step="1" aria-label="Hue">
      </div>
      
      <div class="color-picker">
        <div class="color-picker-content">
          <div class="color-item swatch" data-hue="25"></div>
          <div class="color-item swatch" data-hue="80"></div>
          <div class="color-item swatch" data-hue="150"></div>
          <div class="color-item swatch" data-hue="210"></div>
          <div class="color-item swatch" data-hue="300"></div>
          <div class="color-item custom" data-hue="custom">
            <span class="icon">colorize</span>
          </div>
        </div>
      </div>
      
      <div class="segmented-buttons">
        <button class="segmented-button active" data-theme="light">
          <div class="segmented-button-content">
            <span class="icon">light_mode</span>
            <span class="text">Light</span>
          </div>
        </button>
        <button class="segmented-button" data-theme="dark">
          <div class="segmented-button-content">
            <span class="icon">dark_mode</span>
            <span class="text">Dark</span>
          </div>
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
    this.swatchClickHandler = this.swatchClickHandler.bind(this);
    this.customColorHandler = this.customColorHandler.bind(this);
    this.hueSliderHandler = this.hueSliderHandler.bind(this);
    this.hues = [25, 80, 150, 210, 300];
    this.swatches = [];
    this.customSwatchSelected = false;
  }

  connectedCallback() {
    // Initialize theme buttons
    const themeButtons = this.shadowRoot.querySelectorAll('[data-theme]');
    const swatchButtons = this.shadowRoot.querySelectorAll('.swatch');
    const customColorButton = this.shadowRoot.querySelector('[data-hue="custom"]');
    const hueSlider = this.shadowRoot.querySelector('.hue-slider');
    
    // Store swatches reference
    this.swatches = [...swatchButtons, customColorButton];
    
    // Add event listeners
    themeButtons.forEach(button => {
      button.addEventListener('click', this.themeChangeHandler);
    });
    
    swatchButtons.forEach(button => {
      button.addEventListener('click', this.swatchClickHandler);
    });
    
    if (customColorButton) {
      customColorButton.addEventListener('click', this.customColorHandler);
    }
    
    if (hueSlider) {
      hueSlider.addEventListener('input', this.hueSliderHandler);
    }
    
    // Load stored theme
    const storedTheme = localStorage.getItem("myCustomTheme");
    if (storedTheme !== null) {
      this.setActiveTheme(storedTheme);
      this.updateTheme(storedTheme);
    }
    
    // Initialize hue from storage
    const storedHue = localStorage.getItem('brandHue');
    const defaultHue = storedHue ? parseInt(storedHue) : 230;
    
    if (hueSlider) {
      hueSlider.value = defaultHue;
    }
    
    this.setHue(defaultHue, false);
    
    // Apply persisted radius if available
    const storedRadius = localStorage.getItem('baseRadius');
    if (storedRadius) {
      document.documentElement.style.setProperty('--base-radius', storedRadius + 'px');
    }
  }

  setActiveTheme(theme) {
    const themeButtons = this.shadowRoot.querySelectorAll('[data-theme]');
    themeButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.theme === theme);
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

  swatchClickHandler(event) {
    const hue = parseInt(event.currentTarget.dataset.hue);
    if (!isNaN(hue)) {
      this.setHue(hue);
    }
  }

  customColorHandler(event) {
    this.customSwatchSelected = true;
    const colorSlider = this.shadowRoot.querySelector('[data-color-slider]');
    
    if (colorSlider) {
      colorSlider.classList.add('visible');
    }
    
    // Update selected state
    this.swatches.forEach(s => {
      s.classList.toggle('selected', s.dataset.hue === 'custom');
    });
  }

  hueSliderHandler(event) {
    const hue = parseInt(event.target.value);
    this.updateHue(hue);
    localStorage.setItem('brandHue', hue);
  }

  setHue(hue, store = true) {
    document.documentElement.style.setProperty('--color1-hue', `${hue}deg`);
    if (store) localStorage.setItem('brandHue', hue);
    
    this.customSwatchSelected = false;
    const colorSlider = this.shadowRoot.querySelector('[data-color-slider]');
    if (colorSlider) {
      colorSlider.classList.remove('visible');
    }
    
    // Update selected state
    this.swatches.forEach(s => {
      s.classList.toggle('selected', parseInt(s.dataset.hue) === parseInt(hue));
    });
  }

  updateHue(hue) {
    document.documentElement.style.setProperty('--color1-hue', `${hue}deg`);
  }
}

customElements.define("site-settings", SiteSettings);