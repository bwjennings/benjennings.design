const template = document.createElement('template');
template.innerHTML = `

  <link rel="stylesheet" href="/assets/css/components/slider.css">

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
  }

  connectedCallback() {
    this.initSwatches();
    const storedHue = localStorage.getItem('brandHue');
    this.slider.value = storedHue !== null ? storedHue : '230';
    this.updateHue(this.slider.value, false);
    this.slider.addEventListener('input', () => this.updateHue(this.slider.value));
  }

  initSwatches() {
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

  setHue(hue, store=true) {
    document.documentElement.style.setProperty('--color1-hue', `${hue}deg`);
    if (store) localStorage.setItem('brandHue', hue);
    this.customSwatchSelected = false;
    this.slider.classList.remove('visible');
    this.swatches.forEach(s => s.classList.toggle('selected', parseInt(s.dataset.hue) === parseInt(hue)));
  }

  setCustomMode() {
    this.customSwatchSelected = true;
    this.slider.classList.add('visible');
    this.swatches.forEach(s => s.classList.toggle('selected', s.dataset.hue === 'custom'));
  }

  updateHue(value, store=true) {
    const v = parseInt(value);
    document.documentElement.style.setProperty('--color1-hue', `${v}deg`);
    if (store) localStorage.setItem('brandHue', v);
  }
}

customElements.define('theme-control', ThemeControl);
export default ThemeControl;
