class BadgeComponent extends HTMLElement {
    constructor() {
        super(); // Always call super first in constructor
        this.attachShadow({ mode: 'open' }); // Attach a shadow root to the element.
        
        // Create a style element and add CSS rules
        const style = document.createElement('style');
        style.textContent = `
        :host{
          grid-area: badge;
          view-transition-name:badge;
          cursor:default;
          user-select: none;
          -webkit-user-select: none;
          }

            .badge {
                background-color: var(--background-accent);
                color: var(--foreground-accent);
                display: inline-flex;
                padding: var(--spacing-x-small, 4px) var(--spacing-small, 8px);
                justify-content: center;
                align-items: center;
                gap: var(--spacing-x-small, 4px);
                font-size: var(--text-body-xs-size);
                line-height: var(--text-body-sx-line-height);
                border:1px solid var(--border-accent);
            }
                
            .badge span {
                font-family: var(--icon-font-family);
                font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0;
            }

            .primary {
                background-color: var(--background-accent);
                color: var(--foreground-accent);
            }

            .secondary {
                background-color: var( --background-primary-secondary);
                color: var(--foreground-secondary);
                border: 1px solid var(--border-secondary);
                span{
                color:var(--foreground-brand)
                }
            }

            /* Add more variants as needed */
        `;

        // Create a span element and attach the slot for dynamic content
        const span = document.createElement('div');
        span.classList.add('badge', 'primary'); // Default to primary class

        // Create an icon element
        this.iconElement = document.createElement('span');
        
        const slot = document.createElement('slot');
        span.append(this.iconElement, slot);

        // Append style and span to the shadow root
        this.shadowRoot.append(style, span);
    }

    static get observedAttributes() {
        return ['icon', 'variant'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const badgeElement = this.shadowRoot.querySelector('.badge');
        if (name === 'icon') {
            if (newValue) {
                this.iconElement.textContent = newValue;
                this.iconElement.style.display = 'inline';
            } else {
                this.iconElement.style.display = 'none';
            }
        } else if (name === 'variant') {
            if (oldValue) badgeElement.classList.remove(oldValue);
            badgeElement.classList.add(newValue || 'primary');
        }
    }
}

// Define the custom element
customElements.define('my-badge', BadgeComponent);