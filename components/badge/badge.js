class BadgeComponent extends HTMLElement {
  constructor() {
    super(); // Always call super first in constructor
    this.attachShadow({ mode: "open" }); // Attach a shadow root to the element.
    this.setAttribute('slot', 'badge');
   
    this.shadowRoot.innerHTML = `
    <style>
     :host {
          grid-area: badge;
          cursor: default;
          user-select: none;
          -webkit-user-select: none;
          }

            .badge {
            height: 20px;
                background-color: var(--background-primary-secondary);
                color: var(--foreground-secondary);
                border: 1px solid var(--border-secondary);
                display: flex;
                padding: var(--spacing-x-small, 4px) var(--spacing-small, 8px);
                justify-content: center;
                align-items: center;
                gap: var(--spacing-x-small, 4px);
                font-size: var(--text-body-xs-size);
                line-height: var(--text-body-sx-line-height);
                
            }

            .badge span {
                font-family: var(--icon-font-family);
                font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0;
                display: none; /* Initially hide the span */
            }

            .primary {
                background-color: var(--background-accent);
                color: var(--foreground-accent);
                border: 1px solid var(--border-accent);
            }

            .secondary {
                background-color: var(--background-primary-secondary);
                color: var(--foreground-secondary);
                border: 1px solid var(--border-secondary);
                span {
                color: var(--foreground-brand)
                }
            }

            /* Add more variants as needed */
        </style>
    <div slot="badge" class="badge ${this.getAttribute("variant") || ''}">
      <span></span>
      <slot></slot>
    </div>
     `;

    this.iconElement = this.shadowRoot.querySelector(".badge span");

    // Initialize icon visibility
    this.iconElement.style.display = this.getAttribute("icon") ? "inline" : "none";
  }

  static get observedAttributes() {
    return ["icon", "variant"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const badgeElement = this.shadowRoot.querySelector(".badge");
    if (name === "icon") {
      if (newValue) {
        this.iconElement.textContent = newValue;
        this.iconElement.style.display = "inline";
      } else {
        this.iconElement.style.display = "none";
      }
    } else if (name === "variant") {
      if (oldValue) badgeElement.classList.remove(oldValue);
      badgeElement.classList.add(newValue || "primary");
    }
  }
}

// Define the custom element
customElements.define("my-badge", BadgeComponent);