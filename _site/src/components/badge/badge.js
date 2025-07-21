class Badge extends HTMLElement {
  static get observedAttributes() {
    return ['icon', 'text', 'variant'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Create the badge element
    this.badge = document.createElement('span');
    this.badge.classList.add('badge');

    // Icon element
    this.iconEl = document.createElement('span');
    this.iconEl.classList.add('icon');
    this.iconEl.style.display = 'none';

    // Compose badge: icon first, then text node (not span)
    this.badge.appendChild(this.iconEl);
    this.textNode = document.createTextNode('');
    this.badge.appendChild(this.textNode);

    // Attach stylesheets
    const badgeCss = document.createElement('link');
    badgeCss.setAttribute('rel', 'stylesheet');
    badgeCss.setAttribute('href', '/src/assets/styles/components/badge.css');

    const varsCss = document.createElement('link');
    varsCss.setAttribute('rel', 'stylesheet');
    varsCss.setAttribute('href', '/src/assets/styles/base/vars.css');

    // Attach icon font
    const iconFont = document.createElement('link');
    iconFont.setAttribute('rel', 'stylesheet');
    iconFont.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:wght@400&display=swap');

    this.shadowRoot.append(varsCss, badgeCss, iconFont, this.badge);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'icon') {
      if (newValue) {
        this.iconEl.textContent = newValue;
        this.iconEl.style.display = '';
      } else {
        this.iconEl.textContent = '';
        this.iconEl.style.display = 'none';
      }
    }
    if (name === 'text') {
      this.textNode.textContent = newValue || '';
    }
    if (name === 'variant') {
      this.badge.classList.remove('default', 'accent', 'accent-2', 'accent-3', 'primary', 'secondary');
      if (newValue && newValue !== 'default') {
        this.badge.classList.add(newValue);
      }
    }
  }

  connectedCallback() {
    // Initialize attributes
    this.attributeChangedCallback('icon', null, this.getAttribute('icon'));
    this.attributeChangedCallback('text', null, this.getAttribute('text'));
    this.attributeChangedCallback('variant', null, this.getAttribute('variant'));
  }
}

customElements.define('ben-badge', Badge);