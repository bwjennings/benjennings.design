// Template
const template = document.createElement("template");
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
    
    /* Overlay input switch (actual control) */
    .theme-switch {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      border: 0;
      background: none;
      cursor: pointer;
      opacity: 0; /* keep it interactive & focusable */
      z-index: 2; /* ensure it sits above visuals */
    }

    .theme-switch:focus-visible + .segmented-buttons {
      outline: 2px solid var(--color-text-base);
      outline-offset: 2px;
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
      pointer-events: none; /* visuals only; let input capture interactions */
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
      cursor: default; /* visuals only; input handles interaction */
      background: none;
    }
    
    .segmented-button.active {
      background: var(--color-fill-a);
      /* View transition class remains in CSS */
      view-transition-class: nav-active;
      view-transition-name: theme-active-circle;
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
      <!-- Real control: checkbox switch for color scheme -->
      <input class="theme-switch" id="theme-switch" type="checkbox" switch aria-label="Toggle dark mode" />
      <!-- Visuals only: two-segment UI kept identical -->
      <div class="segmented-buttons" aria-hidden="true">
        <div class="segmented-button" data-theme="light" part="segment-light segment">
          <div class="icon">light_mode</div>
        </div>
        <div class="segmented-button" data-theme="dark" part="segment-dark segment">
          <div class="icon">dark_mode</div>
        </div>
      </div>
    </div>
  </div>
`;

class SiteSettings extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.switchChangeHandler = this.switchChangeHandler.bind(this);
    this.hueSliderHandler = this.hueSliderHandler.bind(this);
    this.throttledUpdateHue = this.throttle(this.updateHue.bind(this), 16); // ~60fps
    this.saveSettingsSync = this.saveSettingsSync.bind(this);
    this.currentHue = null;
    this.currentTheme = null;
    this.hueTuningTimeout = null;
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

  

  // Temporarily disable CSS transitions during live hue tuning
  beginHueLiveTuning() {
    try {
      document.documentElement.classList.add("hue-live-tuning");
      if (this.hueTuningTimeout) clearTimeout(this.hueTuningTimeout);
      // Remove the class shortly after user stops sliding
      this.hueTuningTimeout = setTimeout(() => {
        document.documentElement.classList.remove("hue-live-tuning");
        this.hueTuningTimeout = null;
      }, 120);
    } catch {}
  }

  // Safe localStorage save with error handling
  safeLocalStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn(`Failed to save ${key} to localStorage:`, e);
      return false;
    }
  }

  // Safe localStorage get with error handling
  safeLocalStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`Failed to read ${key} from localStorage:`, e);
      return null;
    }
  }

  // Synchronous save of current settings (for page unload)
  saveSettingsSync() {
    if (this.currentHue !== null) {
      this.safeLocalStorageSet("brandHue", this.currentHue);
    }
    if (this.currentTheme !== null) {
      this.safeLocalStorageSet("myCustomTheme", this.currentTheme);
    }
  }

  connectedCallback() {
    // Init controls
    const switchInput = this.shadowRoot.getElementById("theme-switch");
    const hueSlider = this.shadowRoot.querySelector(".hue-slider");

    if (switchInput) {
      switchInput.addEventListener("change", this.switchChangeHandler);
    }

    if (hueSlider) {
      hueSlider.addEventListener("input", this.hueSliderHandler);
      hueSlider.addEventListener("change", this.hueSliderHandler);
    }

    // Load stored theme (normalize to 'light' | 'dark').
    // If not set (or legacy/system), resolve to current system preference and persist it
    const rawTheme = this.safeLocalStorageGet("myCustomTheme");
    let normalizedTheme =
      rawTheme === "light" || rawTheme === "dark" ? rawTheme : null;
    if (!normalizedTheme) {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      normalizedTheme = prefersDark ? "dark" : "light";
      // Persist initial explicit choice to avoid cross-page reversals
      this.setActiveTheme(normalizedTheme);
      this.updateTheme(normalizedTheme);
    } else {
      this.setActiveTheme(normalizedTheme);
      this.updateTheme(normalizedTheme);
    }
    // Initialize switch position based on chosen theme
    if (switchInput) {
      switchInput.checked = normalizedTheme === "dark";
    }

    // Initialize hue from storage
    const storedHue = this.safeLocalStorageGet("brandHue");
    const parsedHue = storedHue ? parseInt(storedHue, 10) : null;
    const defaultHue =
      !isNaN(parsedHue) && parsedHue >= 0 && parsedHue <= 360 ? parsedHue : 230;

    if (hueSlider) {
      hueSlider.value = defaultHue;
    }

    this.updateHue(defaultHue);
    this.currentHue = defaultHue;
    this.safeLocalStorageSet("brandHue", defaultHue);

    // Cross-instance/theme sync listeners
    this._onGlobalSchemeChange = (e) => {
      try {
        const theme = e?.detail;
        const switchEl = this.shadowRoot.getElementById("theme-switch");
        if (!switchEl) return;
        if (theme === "light" || theme === "dark") {
          switchEl.checked = theme === "dark";
          this.setActiveTheme(theme);
        } else {
          // Treat others as system
          switchEl.checked = false;
        }
      } catch {}
    };
    this._onGlobalHueChange = (e) => {
      try {
        const hue = parseInt(e?.detail, 10);
        const hueSliderEl = this.shadowRoot.querySelector(".hue-slider");
        if (Number.isFinite(hue) && hueSliderEl) {
          hueSliderEl.value = hue;
          this.currentHue = hue;
          this.updateHue(hue);
        }
      } catch {}
    };
    window.addEventListener("globalSchemeChange", this._onGlobalSchemeChange);
    window.addEventListener("globalHueChange", this._onGlobalHueChange);

    // Add mobile-specific lifecycle event listeners
    window.addEventListener("beforeunload", this.saveSettingsSync);
    window.addEventListener("pagehide", this.saveSettingsSync);

    // Also handle visibility change (mobile browsers switching tabs/apps)
    this.visibilityHandler = () => {
      if (document.visibilityState === "hidden") {
        this.saveSettingsSync();
      }
    };
    document.addEventListener("visibilitychange", this.visibilityHandler);
  }

  setActiveTheme(theme) {
    // Keep visual segments in sync as a fallback when :has is unsupported
    const segments = this.shadowRoot.querySelectorAll(
      ".segmented-button[data-theme]"
    );
    segments.forEach((seg) => {
      const isActive = seg.getAttribute("data-theme") === theme;
      seg.classList.toggle("active", isActive);
    });
  }

  updateTheme(theme) {
    const colorScheme =
      theme === "light" ? "light" : theme === "dark" ? "dark" : "light dark";

    // Track current theme
    this.currentTheme = theme;

    // Persist theme with error handling
    this.safeLocalStorageSet("myCustomTheme", theme);
    // Update in-page cache to avoid stale reads during BFCache/pageshow
    try {
      if (window.themeCache && window.themeCache.values) {
        window.themeCache.values.theme = theme;
        window.themeCache.lastUpdate = Date.now();
      }
    } catch {}

    // Apply styles
    document.documentElement.style.setProperty(
      "--current-color-scheme",
      colorScheme
    );
    // Reflect active theme on host for ::part selectors
    try {
      this.setAttribute("data-theme", theme);
    } catch {}
    window.dispatchEvent(
      new CustomEvent("globalSchemeChange", { detail: theme })
    );
  }

  switchChangeHandler(e) {
    const isDark = e.currentTarget.checked;
    const theme = isDark ? "dark" : "light";

    // Animate if supported
    const supportsVT = typeof document.startViewTransition === "function";
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = () => {
      this.setActiveTheme(theme);
      this.updateTheme(theme);
    };

    if (!supportsVT || prefersReduced) {
      apply();
      return;
    }

    document.documentElement.classList.add("theme-transition");
    try {
      const transition = document.startViewTransition(() => {
        apply();
      });
      transition.finished.finally(() => {
        document.documentElement.classList.remove("theme-transition");
      });
    } catch (e2) {
      document.documentElement.classList.remove("theme-transition");
      apply();
    }
  }

  hueSliderHandler(event) {
    const hue = parseInt(event.target.value, 10);
    if (!isNaN(hue) && hue >= 0 && hue <= 360) {
      // Ensure all elements update instantly without rubber-banding
      this.beginHueLiveTuning();
      // Track current hue immediately
      this.currentHue = hue;

      // Throttle updates
      this.throttledUpdateHue(hue);

      // Update cache
      if (window.themeCache) {
        window.themeCache.values.hue = hue.toString();
      }

      // Reduced debounce delay for mobile performance (50ms instead of 100ms)
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(() => {
        this.safeLocalStorageSet("brandHue", hue);
        window.dispatchEvent(
          new CustomEvent("globalHueChange", { detail: hue })
        );
      }, 50);
    }
  }

  updateHue(hue) {
    if (!isNaN(hue) && hue >= 0 && hue <= 360) {
      document.documentElement.style.setProperty("--hue-root", `${hue}deg`);
    }
  }

  disconnectedCallback() {
    // Save settings one last time before disconnecting
    this.saveSettingsSync();

    // Clear any pending timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    if (this.hueTuningTimeout) {
      clearTimeout(this.hueTuningTimeout);
    }
    // Ensure class is removed on disconnect
    try {
      document.documentElement.classList.remove("hue-live-tuning");
    } catch {}

    // Cleanup listeners
    const hueSlider = this.shadowRoot.querySelector(".hue-slider");
    const switchInput = this.shadowRoot.getElementById("theme-switch");

    if (switchInput) {
      switchInput.removeEventListener("change", this.switchChangeHandler);
    }

    if (hueSlider) {
      hueSlider.removeEventListener("input", this.hueSliderHandler);
      hueSlider.removeEventListener("change", this.hueSliderHandler);
    }

    // Clean up listeners
    window.removeEventListener(
      "globalSchemeChange",
      this._onGlobalSchemeChange
    );
    window.removeEventListener("globalHueChange", this._onGlobalHueChange);
    window.removeEventListener("beforeunload", this.saveSettingsSync);
    window.removeEventListener("pagehide", this.saveSettingsSync);
    if (this.visibilityHandler) {
      document.removeEventListener("visibilitychange", this.visibilityHandler);
    }
  }
}

customElements.define("site-settings", SiteSettings);
