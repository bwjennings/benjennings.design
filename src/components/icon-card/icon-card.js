const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      container-type: inline-size;
    }
    
    .icon-card {
      cursor: pointer;
      display: grid;
      grid-template-rows: auto auto 1fr auto;
      height: 100%;
      width: 100%;
      background: var(--color-surface-a);
      border: 1px solid var(--color-border-base);
      border-radius: var(--radius-md);
      outline-style: solid;
      outline-width: 0px;
      outline-color: var(--color-border-base);
      transition: outline 500ms var(--timing-bounce);
      color: var(--color-text-base);
      gap: var(--spacing-lg);
      overflow: hidden;
      outline-offset: 0px;
      padding: var(--spacing-lg);
      align-items: start;
      justify-content: start;
      justify-items: start;
    }

    .icon-card:hover {
      outline: 4px solid var(--color-border-base);
    }

    .icon-card:active {
      outline-width: 16px;
      transition: outline 300ms var(--timing-decelerate);
    }

    .icon-box {
      width: 100%;
      height: 80px;
      background: var(--color-surface-a-secondary);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--icon-font-family);
      font-size: var(--icon-size-xl);
      color: var(--color-icon-base);
      font-variation-settings: 'FILL' var(--icon-fill), 'wght' var(--icon-weight-lg), 'GRAD' var(--icon-grade);
    }


    .badge-group {
      display: flex;
      gap: var(--spacing-sm);
      flex-wrap: wrap;
    }

    /* Variant styles */
    .icon-card.brand {
      background: var(--color-surface-a);
      color: var(--color-text-base);
      border-color: var(--color-border-base);
      outline-color: var(--color-border-base);
    }

    .icon-card.brand .icon-box {
      background: var(--color-surface-a-secondary);
      color: var(--color-icon-base);
    }

    .icon-card.accent-1 {
      background: var(--color-surface-b);
      color: var(--color-text-base-b);
      border-color: var(--color-border-base-b);
      outline-color: var(--color-border-base-b);
    }

    .icon-card.accent-1 .icon-box {
      background: var(--color-surface-b-secondary);
      color: var(--color-icon-base-b);
    }

    .icon-card.accent-2 {
      background: var(--color-surface-c);
      color: var(--color-text-base-c);
      border-color: var(--color-border-base-c);
      outline-color: var(--color-border-base-c);
    }

    .icon-card.accent-2 .icon-box {
      background: var(--color-surface-c-secondary);
      color: var(--color-icon-base-c);
    }

    .icon-card.accent-3 {
      background: var(--color-surface-d);
      color: var(--color-text-base-d);
      border-color: var(--color-border-base-d);
      outline-color: var(--color-border-base-d);
    }

    .icon-card.accent-3 .icon-box {
      background: var(--color-surface-d-secondary);
      color: var(--color-icon-base-d);
    }
  </style>
  
  <link href="/src/assets/styles/base/vars.css" rel="stylesheet">
  
  <div class="icon-card">
    <div class="icon-box">
      <span class="icon" id="icon-display">step</span>
    </div>
    <h3 class="heading md" id="card-title">Create Clarity, not simplicity</h3>
    <div class="badge-group" id="badge-container" style="display: none;">
      <ben-badge icon="edit" text="Badge"></ben-badge>
      <ben-badge icon="edit" text="Badge"></ben-badge>
    </div>
  </div>
`;

class IconCard extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'icon', 'variant', 'show-badges'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    // Cache DOM references
    this._card = this.shadowRoot.querySelector('.icon-card');
    this._iconDisplay = this.shadowRoot.getElementById('icon-display');
    this._cardTitle = this.shadowRoot.getElementById('card-title');
    this._badgeContainer = this.shadowRoot.getElementById('badge-container');
  }

  connectedCallback() {
    // Initialize from attributes
    this.updateTitle();
    this.updateIcon();
    this.updateVariant();
    this.updateBadges();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    switch (name) {
      case 'title':
        this.updateTitle();
        break;
      case 'icon':
        this.updateIcon();
        break;
      case 'variant':
        this.updateVariant();
        break;
      case 'show-badges':
        this.updateBadges();
        break;
    }
  }

  updateTitle() {
    const title = this.getAttribute('title') || 'Create Clarity, not simplicity';
    if (this._cardTitle) {
      this._cardTitle.textContent = title;
    }
  }

  updateIcon() {
    const icon = this.getAttribute('icon') || 'step';
    if (this._iconDisplay) {
      this._iconDisplay.textContent = icon;
    }
  }

  updateVariant() {
    const variant = this.getAttribute('variant') || 'brand';
    if (this._card) {
      // Remove all variant classes
      this._card.classList.remove('brand', 'accent-1', 'accent-2', 'accent-3');
      // Add current variant
      this._card.classList.add(variant);
    }
  }

  updateBadges() {
    const showBadges = this.hasAttribute('show-badges');
    if (this._badgeContainer) {
      this._badgeContainer.style.display = showBadges ? 'flex' : 'none';
    }
  }

  // Getters and setters for programmatic access
  get title() {
    return this.getAttribute('title');
  }

  set title(value) {
    this.setAttribute('title', value);
  }

  get icon() {
    return this.getAttribute('icon');
  }

  set icon(value) {
    this.setAttribute('icon', value);
  }

  get variant() {
    return this.getAttribute('variant');
  }

  set variant(value) {
    this.setAttribute('variant', value);
  }

  get showBadges() {
    return this.hasAttribute('show-badges');
  }

  set showBadges(value) {
    if (value) {
      this.setAttribute('show-badges', '');
    } else {
      this.removeAttribute('show-badges');
    }
  }
}

customElements.define('icon-card', IconCard);
