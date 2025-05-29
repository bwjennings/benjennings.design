const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="css/components/slider.css">
  <style>
    :host { display:inline-block; anchor-name: --theme-button; }
    .picker { display:flex; gap:4px; margin-bottom:8px; }
    .swatch { width:24px; height:24px; border-radius:50%; border:2px solid var(--color-border-primary); cursor:pointer; padding:0; background:transparent; }
    .swatch.selected { outline:2px solid var(--color-foreground-accent); }
    input[type="range"] { width:100%; }
  </style>
  <div class="picker"></div>
  <input class="stim" type="range" min="0.5" max="0.9" step="0.01" aria-label="Stimulation">
`;

class ThemeControl extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'open'}).appendChild(template.content.cloneNode(true));
    this.picker = this.shadowRoot.querySelector('.picker');
    this.slider = this.shadowRoot.querySelector('.stim');
    this.hues = [0,60,120,210,280];
    this.swatches = [];
  }

  connectedCallback() {
    this.initSwatches();
    const storedStim = localStorage.getItem('stimulationLevel');
    this.slider.value = storedStim !== null ? storedStim : '0.7';
    this.updateStim(this.slider.value, false);
    this.slider.addEventListener('input', () => this.updateStim(this.slider.value));
  }

  initSwatches() {
    const storedHue = parseInt(localStorage.getItem('brandHue'));
    const defaultHue = !isNaN(storedHue) ? storedHue : 230;
    this.hues.forEach(h => {
      const btn = document.createElement('button');
      btn.className = 'swatch';
      btn.style.backgroundColor = `hsl(${h} 80% 60%)`;
      btn.dataset.hue = h;
      btn.addEventListener('click', () => this.setHue(h));
      this.picker.appendChild(btn);
      this.swatches.push(btn);
    });
    this.setHue(defaultHue, false);
  }

  setHue(hue, store=true) {
    document.documentElement.style.setProperty('--base-hue', `${hue}deg`);
    if (store) localStorage.setItem('brandHue', hue);
    this.swatches.forEach(s => s.classList.toggle('selected', parseInt(s.dataset.hue) === parseInt(hue)));
  }

  updateStim(value, store=true) {
    const v = parseFloat(value).toFixed(2);
    document.documentElement.style.setProperty('--stimulation-level', v);
    if (store) localStorage.setItem('stimulationLevel', v);
  }
}

customElements.define('theme-control', ThemeControl);
export default ThemeControl;
