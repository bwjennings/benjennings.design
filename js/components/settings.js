// Define and cache the template
const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/css/components/radio-buttons.css">
  <link rel="stylesheet" href="/css/components/button.css">
  <fieldset class="radio-buttons">
    <label class="radio-button">
      <input type="radio" name="theme" value="" checked aria-label="Auto Theme">
      <span class="icon md">routine</span>
      
    </label>
    <label class="radio-button">
      <input type="radio" name="theme" value="light" aria-label="Light Theme">
      <span class="icon md">light_mode</span>
     
    </label>
    <label class="radio-button">
      <input type="radio" name="theme" value="dark" aria-label="Dark Theme">
      <span class="icon md">dark_mode</span>
      
    </label>
  </fieldset>
  <button part="button" id="change-hue">Change Hue</button>
`;

class SiteSettings extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.themeChangeHandler = this.themeChangeHandler.bind(this);
    this.changeHue = this.changeHue.bind(this);
  }

  connectedCallback() {
    const storedTheme = localStorage.getItem("myCustomTheme") || "";
    const selected = this.shadowRoot.querySelector(`input[name="theme"][value="${storedTheme}"]`);
    if (selected) selected.checked = true;
    this.updateTheme(storedTheme);
    this.shadowRoot.querySelector("fieldset").addEventListener("change", this.themeChangeHandler);
    // Add listener for hue change button
    const hueBtn = this.shadowRoot.getElementById("change-hue");
    hueBtn.addEventListener("click", this.changeHue);
    // Apply persisted hue/radius/chroma if available
    const storedHue = localStorage.getItem('brandHue');
    if (storedHue) {
      document.documentElement.style.setProperty('--brand-hue', storedHue + 'deg');
    }
    const storedRadius = localStorage.getItem('baseRadius');
    if (storedRadius) {
      document.documentElement.style.setProperty('--base-radius', storedRadius + 'px');
    }
    const storedChroma = localStorage.getItem('chromaBase');
    if (storedChroma) {
      document.documentElement.style.setProperty('--chroma-base', storedChroma);
    }
    const storedHueOffset = localStorage.getItem('hueOffsetBase');
    if (storedHueOffset) {
      document.documentElement.style.setProperty('--hue-offset-base', storedHueOffset + 'deg');
    }
    // Apply persisted text heading width if available
    const storedTextHeadingWidth = localStorage.getItem('textHeadingWidth');
    if (storedTextHeadingWidth) {
      document.documentElement.style.setProperty('--text-heading-width', storedTextHeadingWidth);
    }
   
  }

  updateTheme(theme) {
    const colorScheme = theme === "light"
      ? "light"
      : theme === "dark"
        ? "dark"
        : "light dark";
    // Batch style updates to avoid multiple reflows
    document.documentElement.style.setProperty("--current-color-scheme", colorScheme);
    window.dispatchEvent(new CustomEvent('globalSchemeChange', { detail: theme }));
  }

  themeChangeHandler(event) {
    if (event.target.name === "theme") {
      this.updateTheme(event.target.value);
    }
  }

  changeHue() {
    // Maximum hue shift in degrees
    const hueLimit = 90; // change this value to adjust the limit
    const currentHue = parseInt(localStorage.getItem('brandHue') || '0', 10);
    const deltaHue = Math.floor(Math.random() * (hueLimit * 2 + 1)) - hueLimit;
    const randomHue = (currentHue + deltaHue + 360) % 360;
    document.documentElement.style.setProperty("--brand-hue", randomHue + "deg");

    // Random radius 0–8px
    const randomRadius = Math.floor(Math.random() * 9);
    document.documentElement.style.setProperty("--base-radius", randomRadius + "px");

    // Random chroma 0.010–0.020
    const randomChromaBase = (Math.random() * 0.01 + 0.010).toFixed(3);
    document.documentElement.style.setProperty("--chroma-base", randomChromaBase);

    // Random hue-offset-base 10–90deg
    const randomHueOffset = Math.floor(Math.random() * 81) + 10;
    document.documentElement.style.setProperty("--hue-offset-base", randomHueOffset + "deg");
 
    // Random text heading grade 0–100 (unitless)
    const randomTextHeadingGrade = Math.floor(Math.random() * 101);
    document.documentElement.style.setProperty('--text-heading-grade', randomTextHeadingGrade);
    localStorage.setItem('textHeadingGrade', randomTextHeadingGrade);

    console.log(`--brand-hue set to: ${randomHue}deg`);
    // Persist random values so they survive page loads
    localStorage.setItem('brandHue', randomHue);
    localStorage.setItem('baseRadius', randomRadius);
    localStorage.setItem('chromaBase', randomChromaBase);
    localStorage.setItem('hueOffsetBase', randomHueOffset);
  }
}

customElements.define("site-settings", SiteSettings);