// theme-control.js
const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/assets/css/components/button.css">
  <link rel="stylesheet" href="/assets/css/components/dialog.css">
  <style>
    :host { display: inline-block; anchor-name: --theme-button; }
    button { display: none; }
    .slider {
      position: relative;
      width:100%;
      height: 100px;
      touch-action: none;
      overflow: hidden;
      border-radius: 0.5rem;
      border: 1px solid #cbd5e1;
      &:hover{
      cursor:grab;
      }

      &:active{
      cursor:grabbing;}
    }
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      border-radius: 0.5rem;
    }
    .slider-handle {
      position: absolute;
      width: 24px;
      height: 24px;
      background: var(--background-base);
      border-radius: 50%;
      border: 3px solid #fff;
      
      transition: transform 0.1s ease-out, box-shadow 0.1s ease-out;
      z-index: 10;
      top: 50%;
      left: 50%;
      
    }
    .slider-handle:active,
    .slider-handle.dragging {
      transform: scale(1.15);
      cursor:grabbing;
      box-shadow: 0 0 0 10px var(--background-base);
    }
    @media screen and (max-width: 800px), (max-height: 500px) {
      button { display: inline-flex; }
    }
    
  </style>
  <button id="toggle" class="button sm" aria-label="Theme controls"><span class="icon">tune</span> Theme</button>
  <div class="slider" id="slider">
    <canvas id="sliderBackgroundCanvas"></canvas>
    <div id="sliderHandle" class="slider-handle handle"></div>
  </div>
`;

class ThemeControl extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
    this.anchorSupported = CSS.supports('anchor-name: --test');
    this.slider  = this.shadowRoot.querySelector('.slider');
    this.button  = this.shadowRoot.querySelector('#toggle');
    this.handle  = this.shadowRoot.querySelector('#sliderHandle');
    this.canvas  = this.shadowRoot.querySelector('#sliderBackgroundCanvas');
    this.handleWidth = 24;
    this.handleHeight = 24;
    this.dragging = false;
    this.onDown = this.onDown.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onUp   = this.onUp.bind(this);
    this.buttonHandler = () => {
      if (this.slider.hasAttribute('popover')) {
        this.slider.showPopover();
      }
    };
    this.handleMobileChange = this.handleMobileChange.bind(this);
  }

  connectedCallback() {
    const storedHue  = parseFloat(localStorage.getItem('brandHue')) || '0';
    const storedStim = parseFloat(localStorage.getItem('stimulationLevel')) || '0.50';
    this.slider.addEventListener('pointerdown', this.onDown);
    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerup',   this.onUp);
    const x = storedHue / 360;
    const minS = 0.5, maxS = 0.9;
    const y = (storedStim - minS) / (maxS - minS);
    this.updateHandle(x, y);
    this.updateVariables(x, y);

    if (!this.anchorSupported) {
      const nav = this.closest('.sidebar');
      if (nav) {
        const height = nav.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--bottom-nav-height', `${height}px`);
      }
    }

    this.mobileQuery = window.matchMedia('(max-width: 800px), (max-height: 500px)');
    this.mobileQuery.addEventListener('change', this.handleMobileChange);
    this.handleMobileChange(this.mobileQuery);

    this.button.addEventListener('click', this.buttonHandler);
    requestAnimationFrame(() => this.drawDotPattern(x * this.slider.offsetWidth, y * this.slider.offsetHeight));
  }

  disconnectedCallback() {
    this.slider.removeEventListener('pointerdown', this.onDown);
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerup',   this.onUp);
    if (this.mobileQuery)
      this.mobileQuery.removeEventListener('change', this.handleMobileChange);
    this.button.removeEventListener('click', this.buttonHandler);
  }

  onDown(e) { this.dragging = true; this.updateFromEvent(e); }
  onMove(e) { if (this.dragging) this.updateFromEvent(e); }
  onUp()    { this.dragging = false; }

  updateFromEvent(e) {
    const rect = this.slider.getBoundingClientRect();
    let x = (e.clientX - rect.left) / rect.width;
    let y = (e.clientY - rect.top)  / rect.height;
    x = Math.min(1, Math.max(0, x));
    y = Math.min(1, Math.max(0, y));
    this.updateHandle(x, y);
    this.updateVariables(x, y);
  }

  updateHandle(x, y) {
    const rect = this.slider.getBoundingClientRect();
    const tx = x * rect.width  - this.handleWidth  / 2;
    const ty = y * rect.height - this.handleHeight / 2;
    this.handle.style.left = `${tx}px`;
    this.handle.style.top  = `${ty}px`;
    this.drawDotPattern(x * rect.width, y * rect.height);
  }

  drawDotPattern(handleX, handleY) {
    const canvas = this.canvas;
    if (!this.slider.offsetWidth || !this.slider.offsetHeight) {
      requestAnimationFrame(() => this.drawDotPattern(handleX, handleY));
      return;
    }
    const rect = this.slider.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    const dotRadius = 3;
    const minVerticalGap = 8;
    const maxVerticalGap = 40;
    const minHorizontalGap = 8;
    const maxHorizontalGap = 30;
    const saturation = 80;
    const lightness = 65;
    const defaultDotColor = 'rgba(180, 180, 180, 0.5)';
    const interactionRadius = Math.min(width, height) / 3.5;
    const maxDisplacement = dotRadius * 8;

    let y = dotRadius;
    let rowCount = 0;

    while (y - dotRadius < height) {
      const t = Math.max(0, Math.min(1, y / height));
      const currentVerticalGap = minVerticalGap + t * (maxVerticalGap - minVerticalGap);
      const currentHorizontalGap = minHorizontalGap + t * (maxHorizontalGap - minHorizontalGap);
      const safeHorizontalGap = Math.max(1, currentHorizontalGap);
      const xOffset = (rowCount % 2 === 0) ? 0 : safeHorizontalGap / 2;

      for (let originalX = xOffset + safeHorizontalGap / 2; originalX - dotRadius < width; originalX += safeHorizontalGap) {
        let drawX = originalX;
        let drawY = y;
        let dotColor = defaultDotColor;

        const dxOriginal = originalX - handleX;
        const dyOriginal = y - handleY;
        const distanceOriginal = Math.sqrt(dxOriginal * dxOriginal + dyOriginal * dyOriginal);

        if (distanceOriginal < interactionRadius && distanceOriginal > 0) {
          const normalizedColorX = Math.max(0, Math.min(width, originalX)) / width;
          const hue = normalizedColorX * 180;
          dotColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

          const repelFactor = (1 - (distanceOriginal / interactionRadius));
          const displacementStrength = repelFactor * maxDisplacement;

          drawX += (dxOriginal / distanceOriginal) * displacementStrength;
          drawY += (dyOriginal / distanceOriginal) * displacementStrength;
        }

        ctx.beginPath();
        ctx.arc(drawX, drawY, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      }

      y += Math.max(1, currentVerticalGap);
      rowCount++;
    }
  }

  updateVariables(x, y) {
    const hueValue = Math.round(x * 360);
    const minS = 0.5, maxS = 0.9;
    const stim = (y * (maxS - minS) + minS).toFixed(2);
    document.documentElement.style.setProperty('--base-hue', hueValue + 'deg');
    document.documentElement.style.setProperty('--stimulation-level', stim);
    localStorage.setItem('brandHue', hueValue);
    localStorage.setItem('stimulationLevel', stim);
  }

  handleMobileChange(e) {
    if (e.matches) {
      this.slider.setAttribute('popover', '');
      this.button.style.display = 'inline-flex';
    } else {
      this.slider.removeAttribute('popover');
      this.button.style.display = 'none';
    }
  }
}

customElements.define('theme-control', ThemeControl);
export default ThemeControl;
