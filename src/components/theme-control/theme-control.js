const template = document.createElement('template');
template.innerHTML = `

  <link rel="stylesheet" href="/src/assets/styles/components/slider.css">

  <style>
    :host { display:flex; flex-direction:column; anchor-name: --theme-button; }
    .picker { display:flex; gap:4px; background-color:var(--color-background-secondary);border-radius:var(--radius-md); padding:8px;justify-items:stretch; margin-bottom:8px; height:40px;}
    .swatch {  flex:1; border-radius:calc(var(--radius-md) - 8px); border:2px solid var(--color-border-primary); cursor:pointer; padding:0; background:transparent; }
    .swatch.selected { outline:2px solid var(--color-foreground-color2); }
    .custom-swatch { background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24, #f0932b); }
    input[type="range"] { flex:1; display:none; }
    input[type="range"].visible { display:block; }
    
  </style>
  <div class="picker"></div>
  <input class="hue" type="range" min="0" max="360" step="1" aria-label="Hue">
`;

class ThemeControl extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'open'}).appendChild(template.content.cloneNode(true));
    this.picker = this.shadowRoot.querySelector('.picker');
    this.slider = this.shadowRoot.querySelector('.hue');
    this.hues = [25,80,150,210,300];
    this.swatches = [];
    this.customSwatchSelected = false;

    // Check if required elements exist
    if (!this.picker || !this.slider) {
      console.error("Required theme control elements not found in shadow DOM");
    }
  }

  connectedCallback() {
    if (!this.picker || !this.slider) {
      return; // Exit early if required elements are missing
    }
    
    this.initSwatches();
    const storedHue = localStorage.getItem('brandHue');
    this.slider.value = storedHue !== null ? storedHue : '230';
    this.updateHue(this.slider.value, false);
    this.slider.addEventListener('input', () => this.updateHue(this.slider.value));
  }

  initSwatches() {
    if (!this.picker) {
      console.error("Picker element not found, cannot initialize swatches");
      return;
    }
    
    const storedHue = parseInt(localStorage.getItem('brandHue')) || 230;
    const defaultHue = storedHue;
    this.hues.forEach(h => {
      const btn = document.createElement('button');
      btn.className = 'swatch';
      btn.style.backgroundColor = `oklch(70% 35% ${h} )`;
      btn.dataset.hue = h;
      btn.addEventListener('click', () => this.setHue(h));
      this.picker.appendChild(btn);
      this.swatches.push(btn);
    });
    
    // Add custom swatch
    const customBtn = document.createElement('button');
    customBtn.className = 'swatch custom-swatch';
    customBtn.dataset.hue = 'custom';
    customBtn.addEventListener('click', () => this.setCustomMode());
    this.picker.appendChild(customBtn);
    this.swatches.push(customBtn);
    
    this.setHue(defaultHue, false);
  }

  // Calculate the shortest path between two hues on a 360-degree circle
  calculateShortestHuePath(currentHue, targetHue) {
    const diff = targetHue - currentHue;
    const absDiff = Math.abs(diff);
    
    if (absDiff <= 180) {
      // Direct path is shortest
      return targetHue;
    } else {
      // Wrap around is shorter
      if (diff > 0) {
        // Going clockwise but wrap counter-clockwise is shorter
        return targetHue - 360;
      } else {
        // Going counter-clockwise but wrap clockwise is shorter
        return targetHue + 360;
      }
    }
  }

  // Animate hue changes with easing
  animateHueTransition(currentHue, targetHue, duration = 400) {
    const startTime = performance.now();
    const startHue = currentHue;
    const endHue = this.calculateShortestHuePath(currentHue, targetHue);
    
    // Easing function (ease-out cubic)
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      
      const currentAnimatedHue = startHue + (endHue - startHue) * easedProgress;
      const normalizedHue = ((currentAnimatedHue % 360) + 360) % 360;
      
      document.documentElement.style.setProperty('--color1-hue', `${normalizedHue}deg`);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure final value is exactly the target
        const finalNormalizedHue = ((targetHue % 360) + 360) % 360;
        document.documentElement.style.setProperty('--color1-hue', `${finalNormalizedHue}deg`);
      }
    };
    
    requestAnimationFrame(animate);
  }

  setHue(hue, store=true, withTransition=true) {
    if (withTransition) {
      // Get current hue value
      const currentHueStr = getComputedStyle(document.documentElement).getPropertyValue('--color1-hue');
      const currentHue = parseInt(currentHueStr) || 230;
      
      // Animate the transition
      this.animateHueTransition(currentHue, hue);
    } else {
      // Immediate update (for slider input)
      document.documentElement.style.setProperty('--color1-hue', `${hue}deg`);
    }
    
    if (store) localStorage.setItem('brandHue', hue);
    this.customSwatchSelected = false;
    if (this.slider) {
      this.slider.classList.remove('visible');
    }
    this.swatches.forEach(s => {
      if (s) {
        s.classList.toggle('selected', parseInt(s.dataset.hue) === parseInt(hue));
      }
    });
  }

  setCustomMode() {
    this.customSwatchSelected = true;
    if (this.slider) {
      this.slider.classList.add('visible');
    }
    this.swatches.forEach(s => {
      if (s) {
        s.classList.toggle('selected', s.dataset.hue === 'custom');
      }
    });
  }

  updateHue(value, store=true) {
    const v = parseInt(value);
    // Slider input should be immediate (no transition)
    document.documentElement.style.setProperty('--color1-hue', `${v}deg`);
    if (store) localStorage.setItem('brandHue', v);
  }
}

customElements.define('theme-control', ThemeControl);
export default ThemeControl;
