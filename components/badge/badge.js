class BadgeComponent extends HTMLElement {
    constructor() {
        super(); // Always call super first in constructor
        this.attachShadow({ mode: 'open' }); // Attach a shadow root to the element.
        
        // Create a style element and add CSS rules
        const style = document.createElement('style');
        style.textContent = `
            div {
                background-color: var(--background-secondary);
                border: 1px solid var(--border-secondary);
                color: var(--foreground-secondary);
                display: inline-flex;
                padding: var(--spacing-x-small, 4px) var(--spacing-small, 8px);
                justify-content: center;
                align-items: center;
                gap: var(--spacing-x-small, 4px);
                font-size: var(--text-body-xs-size);
            }

            span {
            color: var(--foreground-accent);
                font-family: var(--icon-font-family);
                
            }
        `;

        // Create a span element and attach the slot for dynamic content
        const span = document.createElement('div');

        // Create an icon element
        this.iconElement = document.createElement('span');
        
        const slot = document.createElement('slot');
        span.append(this.iconElement, slot);

        // Append style and span to the shadow root
        this.shadowRoot.append(style, span);
    }

    static get observedAttributes() {
        return ['icon'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'icon') {
            if (newValue) {
                this.iconElement.textContent = newValue;
                this.iconElement.style.display = 'inline';
            } else {
                this.iconElement.style.display = 'none';
            }
        }
    }
}

// Define the custom element
customElements.define('my-badge', BadgeComponent);